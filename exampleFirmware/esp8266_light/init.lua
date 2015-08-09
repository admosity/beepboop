wifi.setmode(wifi.STATION)
wifi.sta.config("chocolatethunder","11111111")
ip = wifi.sta.getip()

deviceId = "55c6af1b2d82c1030022dc1b"
readKey = "V1l2V05yj"
writeKey = "VyhEAq1i"

gpio.mode(2, gpio.OUTPUT)
gpio.write(2, gpio.HIGH)

deltaThreshold = 100

lastVal = 0
toggle = 1
connected = 0
count = 0

function sendNetwork(status)
    print("Update host")
    gpio.write(2, gpio.HIGH)

    if conn ~= nil then
        conn:close()
    end
    
    tmr.stop(1)
    tmr.alarm(1, 10000, 0, function()
        tmr.stop(1)
        conn:close()
        gpio.write(2, gpio.LOW)
    end )

    conn=net.createConnection(net.TCP, 0)
    
    conn:on("receive", function(conn, payload)
        tmr.stop(1)
        print(payload)
        conn:close()
        gpio.write(2, gpio.LOW)
    end )
    
    conn:on("connection", function(conn, payload) 
        print('\nSending to host') 
        conn:send("GET /api/devices/"
        ..deviceId
        .."/payload?write="..writeKey
        .."&payload="
        ..status
        .." HTTP/1.1\r\n"
        .."Host: beepboop.herokuapp.com\r\n"
        .."Connection: close\r\nAccept: */*\r\n\r\n")
    end)
    
    conn:on("disconnection",function(conn) 
      gpio.write(2, gpio.LOW)
      tmr.stop(1)
      conn:close()
    end)
    
--    conn:connect(80,"www.stormgate.org")
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
        val = adc.read(0)
        if val - lastVal >= deltaThreshold or lastVal - val >= deltaThreshold or count > 120 then
            sendNetwork(val)
            count = 0
        end
        lastVal = val
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

