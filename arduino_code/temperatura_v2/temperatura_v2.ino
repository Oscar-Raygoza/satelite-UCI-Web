#include "DHT.h"

#define DHTPIN 2     // Pin donde está conectado el sensor

//#define DHTTYPE DHT11   // Descomentar si se usa el DHT 11
#define DHTTYPE DHT22   // Sensor DHT22

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
 
  dht.begin();
}
void loop() {
  delay(200);
  float h = dht.readHumidity(); //Leemos la Humedad
  float t = dht.readTemperature(); //Leemos la temperatura en grados Celsius
  
   //--------Enviamos las lecturas por el puerto serial-------------
  
  Serial.print("{ celsius: ");
  Serial.print(t);
  Serial.print(", humedad: ");
  Serial.print(h);
  Serial.println(", }");
  
}
