wifi.setmode(wifi.STATION)
wifi.sta.config("chocolatethunder","11111111")
ip = wifi.sta.getip()

deviceId = "1"
readKey = "1"
writeKey = "1"

toggle = 1
connected = 0
count = 0

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
        if count > 10 then
            sendNetwork(1)
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

function sendNetwork(status)
    print("Update host")
    conn=net.createConnection(net.TCP, 0)
    
    conn:on("receive", function(conn, payload)
        tmr.stop(1)
        print(payload)
        conn:close()
        gpio.write(2, gpio.LOW)
    end )
    
    --/api/devices/:id/payload?write=key&read=key&payload=whateve

    conn:on("connection", function(conn, payload) 
        print('\nSending to host') 
        conn:send("GET /api/devices/"
        ..deviceId
        .."/payload?write="
        ..writeKey
        .."&read="
        ..readKey
        .."&payload="
        ..status
        .." HTTP/1.1\r\n"
        .."Host: beepboop.herokuapp.com\r\n"
        .."Connection: close\r\nAccept: */*\r\n\r\n")
    end)
    
    conn:on("disconnection",function(conn) 
      conn:close()
    end)
    
    conn:connect(80,"beepboop.herokuapp.com")
end

sendNetwork(1);

