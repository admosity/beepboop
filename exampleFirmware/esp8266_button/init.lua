wifi.setmode(wifi.STATION)
wifi.sta.config("chocolatethunder","11111111")
ip = wifi.sta.getip()

deviceId = "55c74ef6d69133030095e348"
readKey = "V1l2V05yj"
writeKey = "4yPMAExs"

toggle = 1
connected = 0

tmr.alarm(0, 1000, 1, function()
    if connected == 0 then
        if toggle == 1 then
            gpio.write(2, gpio.LOW)
            toggle = 0
        else
            gpio.write(2, gpio.HIGH)
            toggle = 1
        end
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
    gpio.write(2, gpio.HIGH)
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
        .."/payload?write="..writeKey
        -- .."&read="..readKey
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

pulse1 = 0
lt = 0
gpio.mode(1,gpio.INT)
function pin1cb(level)
 now = tmr.now()
 diff = now - lt;
 lt = now
 if diff > 100000 then
   sendNetwork(1);
 end
 
end
gpio.trig(1, "down", pin1cb) 
-- sendNetwork(1);
