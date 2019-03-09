#include <LoRa.h>

#include <Wire.h>
#include <NeoSWSerial.h>

#include <NMEAGPS.h>

#include <MPU6050.h>

#include <Adafruit_CCS811.h> // sensor ccs811
#define CCS811_ADDR 0x5A //0x5B Alternate I2C Address

#include <Adafruit_Sensor.h>
#include <Adafruit_HMC5883_U.h>
#include <Adafruit_BMP085_U.h>
#include <DHT_U.h>

#define DHTPIN 6 // Pin digital para DHT22
#define DHTTYPE DHT22   // DHT 22  (AM2302)

#define RFM95_CS 10
#define RFM95_RST 9
#define RFM95_INT 2

//Command activation Balloon mode
#define PMTK_SET_NMEA_886_PMTK_FR_MODE  "$PMTK886,3*2B"
// Command turn on GPRMC and GGA
#define PMTK_SET_NMEA_OUTPUT_RMCGGA "$PMTK314,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0*28"

//Uncomment for debugging
#define DEBUG

uint32_t selectBand(int);

/************************************************************
     IMPORTANTE CAMBIAR id_node DEPENDIENDO TU CANSAT
************************************************************/

String id_node = "UCI";

/*******************************************************
  Selecciona un canal entre 0 y 12 este debe coincidir
  con el canal de tu satelite
 *******************************************************/
int chan = 10;

// Inicializar DHT sensor.
DHT_Unified dht(DHTPIN, DHTTYPE);

// Global sensor object
Adafruit_CCS811 ccs;

MPU6050 accelgyro;
//Variables de Aceleración y Giroscopio
//Accel and Gyro Vars
int16_t ax, ay, az;
int16_t gx, gy, gz;

String Todo; //String a mandar

NMEAGPS gps;
static gps_fix  fix;
static const int RXPin = 5, TXPin = 6;
static const uint32_t GPSBaud = 9600;
static uint32_t last_rx = 0UL; // The last millis() time a character was
                               // received from GPS.

NeoSWSerial ss(RXPin, TXPin);

/* Assign a unique ID to this sensor at the same time */
Adafruit_HMC5883_Unified mag = Adafruit_HMC5883_Unified(1);

Adafruit_BMP085_Unified bmp = Adafruit_BMP085_Unified(2);

unsigned long previousMillis = 0;


// Schedule TX every this many seconds (might become longer due to duty
// cycle limitations).
const unsigned TX_INTERVAL = 5;

void enviarInfo(String outgoing) {
  LoRa.beginPacket();                   // start packet
  LoRa.print(outgoing);                 // add payload
  LoRa.endPacket();                     // finish packet and send it
  Serial.println("Dato enviado");
}

void ballonModeGPS() {
  bool flag = 0;
  String gpsData = "";
  while (!flag) {
    if ((ss.available())) {
          flag = 1;
          ss.println(PMTK_SET_NMEA_886_PMTK_FR_MODE);
          while (ss.available()) {
            gpsData += (char)ss.read();
          }
          gpsData = "";
          ss.println(PMTK_SET_NMEA_OUTPUT_RMCGGA);
    }
  }
  Serial.println("GPS balloon mode configured");
}
void readCSS811() {
          if(ccs.available()){
          float temp = ccs.calculateTemperature();
          if(!ccs.readData()){
            #ifdef DEBUG
            Serial.print("CO2: ");
            Serial.print(ccs.geteCO2());
            Serial.print("ppm, TVOC: ");
            Serial.print(ccs.getTVOC());
            #endif
            Todo += ",";
            Todo += String(ccs.geteCO2());
            Todo += ",";
            Todo += String(ccs.getTVOC());
      
          }
          else{
            Serial.println("ERROR! CSS811");
            Todo += ",";
            Todo += 0;
            Todo += ",";
            Todo += 0;
          }
        }
}      
      
void setup() {
  Serial.begin(115200);
  ss.begin(GPSBaud);
  dht.begin();

  /*****LoRa init****/
  //Re-write pins CS, reset, y IRQ
  LoRa.setPins(RFM95_CS, RFM95_RST, RFM95_INT); // CS, reset, int pin

  if (!LoRa.begin(selectBand(chan))) {           // initialize ratio at 915 MHz
    Serial.println("LoRa init failed. Check your connections.");
    while (true);                       // if failed, do nothing
  }

  LoRa.setTxPower(17); //Set the max transmition power
  LoRa.setSpreadingFactor(10); //Change the SF to get longer distances

  /******************/
  
  /*****CCS811*********/
  
  pinMode(A3, OUTPUT); //Wakeup pin CCS811
  digitalWrite(A3,LOW);//Enable CCS811
  
    //This begins the CCS811 sensor and prints error status of .begin()
  if(!ccs.begin(CCS811_ADDR)){
    Serial.println("Failed to start sensor CCS811! Please check your wiring.");
    //while(1);
  }

  //calibrate temperature sensor
  while(!ccs.available());
  float temp = ccs.calculateTemperature();
  ccs.setTempOffset(temp - 25.0);
  
  
  /*css911-end*/
  
  /* Initialise the sensor */
  if (!bmp.begin())
  {
    /* There was a problem detecting the BMP085 ... check your connections */
    Serial.print(F("Ooops, no BMP085 detected ... Check your wiring or I2C ADDR!"));
    while (1);
  }

  accelgyro.initialize();  /// Initialize MPU

  accelgyro.setI2CMasterModeEnabled(false);
  accelgyro.setI2CBypassEnabled(true) ;
  accelgyro.setSleepEnabled(false);

  // Initialise the sensor
  if (!mag.begin())
  {
    // There was a problem detecting the HMC5883 ... check your connections
    Serial.println(F("Ooops, no HMC5883 detected ... Check your wiring!"));
    while (1);
  }
  
  /*
    Activation Balloon mode:
    For high-altitude balloon purpose that the vertical movement will
    have more effect on the position calculation
  */
  ballonModeGPS();
  
  Serial.println(F("CatSat 1 Ready!"));
  Serial.println(F("Fw version 2.0.2"));
}

void loop() {
  while (gps.available( ss )) {
    last_rx = millis();
    fix = gps.read();
    
    readSensors();
    gpsread();
    readCSS811();
    Serial.println(Todo);
    enviarInfo(Todo);
    Todo = "";
  }
  listenForSomething();
}

bool readSensors(void) {
  Todo += id_node;  //Add id to String
  Todo += ",";
  sensors_event_t event;

  dht.temperature().getEvent(&event);
  if (isnan(event.temperature)) {
    Serial.println(F("Error reading temperature!"));
    Todo += 0;
    Todo += ",";
  }
  else {
#ifdef DEBUG
    Serial.print(F("TemperatureDHT: "));
    Serial.print(event.temperature);
    Serial.println(F(" *C"));
#endif
    Todo += event.temperature;
    Todo += ",";
  }

  dht.humidity().getEvent(&event);
  if (isnan(event.relative_humidity)) {
    Serial.println(F("Error reading humidity!"));
    Todo += 0;
    Todo += ",";
  }
  else {
#ifdef DEBUG
    Serial.print(F("HumidityDHT: "));
    Serial.print(event.relative_humidity);
    Serial.println(F("%"));
#endif
    Todo += event.relative_humidity;
    Todo += ",";
  }

  bmp.getEvent(&event);

  if (event.pressure)
  {
    // Display atmospheric pressue in hPa
#ifdef DEBUG
    Serial.print(F("Pressure:    "));
    Serial.print(event.pressure);
    Serial.println(F(" hPa"));
#endif
    Todo += event.pressure;
    Todo += ",";

    float temperature;
    bmp.getTemperature(&temperature);
    Todo += temperature;
    Todo += ",";

#ifdef DEBUG
    Serial.print(F("Temperature: "));
    Serial.print(temperature);
    Serial.println(F(" C"));
#endif
  }
  else
  {
    Serial.println(F("Sensor error"));
  }


 // mag.getEvent(&event);

  // Display the results (magnetic vector values are in micro-Tesla (uT))
#ifdef DEBUG
  Serial.print(F("Magnetometro:  "));
  Serial.print(F("X: ")); Serial.print(event.magnetic.x); Serial.print(F("  "));
  Serial.print(F("Y: ")); Serial.print(event.magnetic.y); Serial.print(F("  "));
  Serial.print(F("Z: ")); Serial.print(event.magnetic.z); Serial.print(F("  ")); Serial.println(F("uT"));
#endif
  Todo += event.magnetic.x;
  Todo += ",";
  Todo += event.magnetic.y;
  Todo += ",";
  Todo += event.magnetic.z;
  Todo += ",";

  accelgyro.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
#ifdef DEBUG
  Serial.print(F("Acelerometro "));
  Serial.print(F("X:")); Serial.print(ax); Serial.print("\t");
  Serial.print(F("Y:")); Serial.print(ay); Serial.print("\t");
  Serial.print(F("Z:")); Serial.print(az); Serial.print("\n");
  Serial.print(F("Giroscopio "));
  Serial.print(F("X:")); Serial.print(gx); Serial.print("\t");
  Serial.print(F("X:")); Serial.print(gy); Serial.print("\t");
  Serial.print(F("X:")); Serial.println(gz); Serial.print("\n");
#endif
  Todo += ax;
  Todo += ",";
  Todo += ay;
  Todo += ",";
  Todo += az;
  Todo += ",";
  Todo += gx;
  Todo += ",";
  Todo += gy;
  Todo += ",";
  Todo += gz;
  Todo += ",";
}

void gpsread(void) {
  Serial.print(F("Location: "));
  if (fix.valid.location)
  {
    Todo += String(fix.latitude(), 6);
    Todo += ",";
    Todo += String(fix.longitude(), 6);
    Todo += ",";
    Todo += String(fix.altitude(), 6);
    Todo += ",";
    Todo += String(fix.speed_kph(), 6);
    Serial.print(fix.latitude(), 6);
    Serial.print(F(","));
    Serial.print(fix.longitude(), 6);
  }
  else
  {
    Todo += "0";
    Todo += ",";
    Todo += "0";
    Todo += ",";
    Todo += "0";
    Todo += ",";
    Todo += "0";
    Serial.print(F("INVALID"));
  }

  Serial.print(F("  Date/Time: "));
  if (fix.valid.date)
  {
    Serial.print(fix.dateTime.month);
    Serial.print(F("/"));
    Serial.print(fix.dateTime.day);
    Serial.print(F("/"));
    Serial.print(fix.dateTime.year);
  }
  else
  {
    Serial.print(F("INVALID"));
  }

  Serial.print(F(""));
  if (fix.valid.date)
  {
    if (fix.dateTime.hours < 10) Serial.print(F("0"));
    Serial.print(fix.dateTime.hours);
    Serial.print(F(":"));
    if (fix.dateTime.minutes < 10) Serial.print(F("0"));
    Serial.print(fix.dateTime.minutes);
    Serial.print(F(":"));
    if (fix.dateTime.seconds < 10) Serial.print(F("0"));
    Serial.print(fix.dateTime.seconds);
    Serial.print(F("."));
  }
  else
  {
    Serial.print(F("INVALID"));
  }

  Serial.println();
}

uint32_t selectBand(int a) {
  switch (a) {
    case 0:
      return 903080000; //903.08 Mhz
      break;
    case 1:
      return 905240000; //905.24
      break;
    case 2:
      return 907400000; //907.40
      break;
    case 3:
      return 909560000; //909.56
      break;
    case 4:
      return 911720000; //911.72
      break;
    case 5:
      return 913880000; //913.88
      break;
    case 6:
      return 916040000; //916.04
      break;
    case 7:
      return 918200000; // 918.20
      break;
    case 8:
      return 920360000; //920.36
      break;
    case 9:
      return 922520000; //922.52
      break;
    case 10:
      return 924680000; //924.68
      break;
    case 11:
      return 926840000; //926.84
      break;
    case 12:
      return 915000000; //915
      break;
  }
}

//----------------------------------------------------------------
//  Listen to see if the GPS device is correctly 
//  connected and functioning.

static void listenForSomething()
{
  uint32_t current_ms  =  millis();
  uint32_t ms_since_last_rx   = current_ms - last_rx;
    if ((ms_since_last_rx >7000)) {
      Serial.println( F("\nCheck GPS device and/or connections.  No data received.\n") );
 }
}
