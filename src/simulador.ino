#include <WiFi.h>
#include <DHT.h>
#include <Buzzer.h>

#define DHTTYPE DHT22
#define DHT_PIN 26       
#define TRIG_PIN 25 
#define ECHO_PIN 33 
#define BUZZER_PIN 27
#define LDR_PIN 32

DHT dht(DHT_PIN, DHTTYPE);
Buzzer buzzer(BUZZER_PIN);

const char* ssid = "Wokwi-GUEST";
const char* password = ""; 
const char* apiKey = "MXZWYSDUXMTEHA40";
const char* server = "api.thingspeak.com";

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando ao WiFi...");
  }
  
  Serial.println("WiFi conectado.");

  pinMode(LDR_PIN, INPUT);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

float HCSR04() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  int duracao = pulseIn(ECHO_PIN, HIGH);
  return duracao * 0.034 / 2;
}

void loop() {
  float umidade = dht.readHumidity();
  float temperatura = dht.readTemperature();
  long distancia = HCSR04();
  int ldr = analogRead(LDR_PIN);
  int luzMap = map(ldr, 0, 4095, 0, 100000);

  if (isnan(umidade) || isnan(temperatura)) {
    Serial.println("Falha na leitura do DHT22.");
    return;
  } else if (distancia == 0) {
    Serial.println("Falha na leitura do HCSR04.");
  } else {
    buzzer.sound(500, 500);
  }
  
  String url = String("/update?api_key=") + apiKey + 
               "&field1=" + temperatura + 
               "&field2=" + umidade + 
               "&field3=" + distancia + 
               "&field4=" + luzMap;

  Serial.print("Enviando dados para o ThingSpeak...");
  
  WiFiClient client;
  
  if (client.connect(server, 80)) {
    client.print("GET " + url + " HTTP/1.1\r\n" +
                 "Host: " + server + "\r\n" +
                 "Connection: close\r\n\r\n");
    delay(500);
    Serial.println("Dados enviados.");
  } else {
    Serial.println("Falha na conexão com o servidor.");
  }
  
  delay(20000);
}