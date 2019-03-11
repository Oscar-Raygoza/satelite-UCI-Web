const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const compression = require('compression');
const fs = require('fs');
const readLine= require("readline");


const app = express();
const server = http.createServer(app);
const io = socketIO.listen(server);  

let log;

app.use(compression());
app.use(express.static(__dirname + '/public'));

server.listen(3000, ()=>{
    console.log('Server run in port ', 3000 );
});

//Serial Comunication 
const SerialPort = require('serialport');
const ReadLine = SerialPort.parsers.Readline;

const port = new SerialPort('COM6',{
    baudRate: 9600
});

const parser = port.pipe(new ReadLine({ delimiter: '\r\n' }))

parser.on('open',function(){
    console.log('conection is opened');
})

/* # sensor

const Props = new Array(
        "Entrada", //1
        "TemperatureDHT", //2     
        "HumidityDHT", //3
        "Pressure", //4
        "TemperatureBMP", //5
        "MagnetometroX", //6
        "MagnetometroY", //7
        "MagnetometroZ", //8
        "AcelerometroX", //9
        "AcelerometroY", //10 
        "AcelerometroZ", //11
        "GiroscopioX", //12     
        "GiroscopioY", //13
        "GiroscopioZ", //14
        "Latitude", //15
        "Longitude", //16
        "AlturaGPS", //17
        "VelGPS", //18
        "CO2", //19
        "TVOC", //20 
        "RSSI", //21
    );
*/


function JsonOnSring(dataJson){

let objJson ='{ "Sensores" : [ {';
let pivote=0, i= -1;
let value;
let props= 1;
let flag = false;
while(pivote >= 0){
    
    pivote = dataJson.indexOf(",",i+1);
    if(pivote == -1){
        flag = true;
        value = dataJson.substring(i+1, dataJson.length);
    }
        
    if(!flag)
    value = dataJson.substring(i+1, pivote);

  

    objJson += `
       "${props}": "${value}",
    `;
    
    i = pivote;
    props++;
    
    if(flag)
    break;
}

objJson += '"TEST": "ON" } ]}';
return objJson;
}

let timeDate = "init";

parser.on('data', function(data){
    let date = new Date();
    
    let DATA = JsonOnSring(data);
    log =data + "\n";
    fs.appendFile("./log.txt", log + timeDate + ":   ", function(error) {
        if(error) throw error; // Handle the error just in case
    }); 
    io.emit('data', DATA);
    objJson="";
    console.log(data);
    timeDate = date.getDate()+ "/" + date.getMonth()+ "/" + date.getFullYear()+" , hr:"+date.getHours()+ " nin: "+date.getMinutes()+ " sec: "+date.getSeconds();

});

port.on('error',(err)=>{
    console.log(err);
})


