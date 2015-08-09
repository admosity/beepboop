wifi.setmode(wifi.STATION)
wifi.sta.config("chocolatethunder","11111111")
ip = wifi.sta.getip()

deviceId = "55c6af1b2d82c1030022dc1b"
readKey = "V1l2V05yj"
writeKey = "VyhEAq1i"

toggle = 1
connected = 0
count = 0

gpio.mode(3,gpio.OUTPUT)
gpio.write(3, gpio.LOW)

function updateState(state)
    if state == "0" then
        gpio.write(3, gpio.LOW)
    else
        gpio.write(3, gpio.HIGH)
    end
end

function readBeepBoop(status)
    print("Update host")
    conn=net.createConnection(net.TCP, 0)
    
    conn:on("receive", function(conn, payload)
        conn:close()
        pos = string.find(payload,'\r\n\r\n')
        if pos ~= nil then
            strjson = string.sub(payload, pos)
            -- gpio.write(2, gpio.LOW)
            json = cjson.decode(strjson)
            if json['payload'] ~= nil then
                updateState(json['payload'])
            end
        end
        
    end )
    
    --/api/devices/:id/payload?write=key&read=key&payload=whateve

    conn:on("connection", function(conn, payload) 
        print('\nSending to host') 
        conn:send("GET /api/devices/"
        ..deviceId
        .."/payload?read="..readKey
        .." HTTP/1.1\r\n"
        .."Host: beepboop.herokuapp.com\r\n"
        .."Connection: close\r\nAccept: */*\r\n\r\n")
    end)
    
    conn:on("disconnection",function(conn) 
      conn:close()
    end)
    
    conn:connect(80,"beepboop.herokuapp.com")
end

tmr.alarm(0, 1000, 1, function()
    if connected == 0 then
        if toggle == 1 then
            gpio.write(2, gpio.LOW)
            toggle = 0
        else
            gpio.write(2, gpio.HIGH)
            toggle = 1
        end
    else
        --Update sensor stuff
        if count % 10 == 0 then
            readBeepBoop(count)
            count = 0
        end
        count = count + 1
    end

    status = wifi.sta.status()
    ip = wifi.sta.getip()

    if status == 5 then
        if connected == 0 then
            gpio.write(2, gpio.LOW)
            connected = 1
        end
    elseif status == 4 then
        wifi.sta.disconnect()
        wifi.sta.connect()
        connected = 0
    else
        connected = 0
    end
    
end)
