#include <LTask.h>
#include <LWiFi.h>
#include <LWiFiClient.h>

#define WIFI_AP "chocolatethunder"
#define WIFI_PASSWORD "11111111"
#define WIFI_AUTH LWIFI_WPA  // choose from LWIFI_OPEN, LWIFI_WPA, or LWIFI_WEP.

#define SITE_URL "beepboop.herokuapp.com"
#define DEVICE_ID "55c6af1b2d82c1030022dc1b"
#define WRITEKEY "VyhEAq1i"
#define READKEY "3"

LWiFiClient c;

const int buttonPin = 2;
const int ledPin = 13;

int buttonState = LOW;
int lastButtonState = LOW;
long lastDebounceTime = 0;
long debounceDelay = 50;

void sendUpdate(int status){
  // keep retrying until connected to website
  Serial.println("Connecting to BeepBoop");
  while (0 == c.connect(SITE_URL, 80))
  {
    Serial.println("Re-Connecting to WebSite");
    delay(1000);
  }

  // send HTTP request, ends with 2 CR/LF
  Serial.println("send HTTP GET request");
  //:id/payload?write=key&read=key&payload=whatever`
  c.print("GET /api/devices/" DEVICE_ID "/payload?write=" WRITEKEY "&payload=");
  c.print(status);
  c.println(" HTTP/1.1");
  c.println("Host: " SITE_URL);
  c.println("Connection: close");
  c.println();

  // waiting for server response
  Serial.println("waiting HTTP response:");
  while (!c.available())
  {
    delay(100);
  }

  // Make sure we are connected, and dump the response content to Serial
  while (c)
  {
    int v = c.read();
    if (v != -1)
    {
      Serial.print((char)v);
    }
    else
    {
      Serial.println("no more content, disconnect");
      c.stop();
      while (1)
      {
        delay(1);
      }
    }
  }
}

void setup()
{
  LWiFi.begin();
  Serial.begin(115200);

  // keep retrying until connected to AP
  Serial.println("Connecting to AP");
  pinMode(ledPin, OUTPUT); 
  pinMode(buttonPin, INPUT);

  digitalWrite(ledPin, HIGH);
  while (0 == LWiFi.connect(WIFI_AP, LWiFiLoginInfo(WIFI_AUTH, WIFI_PASSWORD)))
  {
    delay(1000);
  }
   
  digitalWrite(ledPin, LOW);
}

void buttonAction(){
  Serial.println("PRESS DAT SHIT");
  sendUpdate(1);
}

void loop()
{
  int reading = digitalRead(buttonPin);
  if (reading != lastButtonState) {
    lastDebounceTime = millis();
  } 
  
  if ((millis() - lastDebounceTime) > debounceDelay) {
    if (reading != buttonState) {
      buttonState = reading;

      if (buttonState == HIGH) {
        buttonAction();
      }
    }
  }
  
  lastButtonState = reading;
}

