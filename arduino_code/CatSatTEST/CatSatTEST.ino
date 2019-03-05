/************************************************************
SPANISH
CatSat1.ino
CatSat 1 - Satelite en Lata Educativo
Andres Sabas @ Electronic Cats
Eduardo Contreras @ Electronic Cats
Original Creation Date: Jul 10, 2016
https://github.com/ElectronicsCats/CatSat/
Este ejemplos demuestra el funcionamiento basico de los sensores y funcionalidad
basica del CatSat 1 Kit Educativo
http://electroniccats.com
Especificaciones del entorno de Desarrollo:
  IDE: Arduino 1.8.4
  Plataforma de Hardware:
  Kit CanSat
  - Arduino Mini Pro
  - DHT22
  - GY-87
  - GPS L80
Este código es beerware si tu me ves ( o cualquier otro miembro de Electronic Cats) 
a nivel local, y tu has encontrado nuestro código útil ,
por favor comprar una ronda de cervezas!
Distribuido como; no se da ninguna garantía.
************************************************************/

/************************************************************
ENGLISH
CatSat1.ino
CatSat 1 - Satelite en Lata Educativo
Andres Sabas @ Electronic Cats
Original Creation Date: Jal 10, 2016
https://github.com/ElectronicsCats/CatSat/
This example demonstrates how to use CatSat 1
Development environment specifics:
  IDE: Arduino 1.8.4
  Hardware Platform:
  Kit CanSat
  - Arduino Mini Pro
  - DHT22
  - GY-87
  - GPS L80
This code is beerware; if you see me (or any other Electronic Cats 
member) at the local, and you've found our code helpful, 
please buy us a round!
Distributed as-is; no warranty is given.
Library I2CDev and MPU6050
https://github.com/jrowberg/i2cdevlib
Library Arduino LoRa
https://github.com/sandeepmistry/arduino-LoRa
*/
/*****************/
/*  catsat test  */
/*****************/

String Todo; //String a mandar




void setup() {
 
   Serial.begin(9600);  
        
 
}

void loop() {  
  Todo += "Settings: {";  //Add id to String 
  Todo += "     node: A1,},";  //Add id to String 
  Todo += "DHT22: {";
  Todo += "     temperatura: "+String(33)+",";
  Todo += "     humedad: "+String(30) + ",},";
  Todo += "BMP180: {";
  Todo += "     pressure: "+String(1010.39)+ ",";      
  Todo += "     temperatura: "+String(25)+",},";
  Todo += "MAGNETOMETRO: {";
  Todo += "     X: "+String(16)+",";
  Todo += "     Y: "+String(-35)+",";
  Todo += "     Z: "+String(-50)+",},";
  Todo += "ACELEROMETRO: {";
  Todo += "     X: "+String(420)+",";
  Todo += "     Y: "+String(240)+",";
  Todo += "     Z: "+String(16440)+",},";
  Todo += "GIROSCOPIO: {";
  Todo += "     X: "+String(15)+",";
  Todo += "     Y: "+String(-22)+",";
  Todo += "     Z: "+String(-50)+",},";
  Todo += "LOCATION: {";
  Todo += "     latitude: "+String(22.1466241)+",";
  Todo += "     longitude: "+String(-102.2756558)+",";
  Todo += "     altitude: "+String(26)+",";
  Todo += "     speed_kph: "+String(9660)+",},";
  Todo += "CCS811: {";
  Todo += "     CO2: "+String(421)+", ";
  Todo += "     TVOC: "+String(109)+",},";
      
  Serial.println(Todo);    
    
    Todo = "";  
    delay(1000);
}

     
