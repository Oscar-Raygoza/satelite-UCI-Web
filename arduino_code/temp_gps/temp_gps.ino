  #include "DHT.h"
#include <LiquidCrystal.h> // GPS include
#include <SoftwareSerial.h> // GPS include
#include <TinyGPS.h> // GPS include


float lat = 28.5458,lon = 77.1703;
SoftwareSerial gpsSerial(3,4);//rx,tx 

#define DHTPIN 2     // Pin donde está conectado el sensor

#define DHTTYPE DHT22   // Sensor DHT22

DHT dht(DHTPIN, DHTTYPE);

TinyGPS gps; 

void setup() {
  Serial.begin(9600);
  
  dht.begin();

  gpsSerial.begin(9600);
}
void loop() {
  delay(200);
  float humedad = dht.readHumidity(); //Leemos la Humedad
  float temperaturaC = dht.readTemperature(); //Leemos la temperatura en grados Celsius

    while(gpsSerial.available()){ // hay gps data? 
      if(gps.encode(gpsSerial.read())){  // gps data 
        gps.f_get_position(&lat,&lon); // obtenemos la latitude y longitude 
        Serial.print(lat); 
        Serial.print(lon); 
      }
    }
   //--------Enviamos las lecturas por el puerto serial-------------
  
  Serial.print("{ celsius: ");
  Serial.print(temperaturaC);
  Serial.print(", humedad: ");
  Serial.print(humedad);
  Serial.println(", }");
  
}
