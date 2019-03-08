const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const sqlite3 = require('sqlite3');
const Sequelize = require('sequelize');


const app = express();
const server = http.createServer(app);
const io = socketIO.listen(server);  

const Routes = require('./routes/routes_node');
app.use(express.static(__dirname + '/public'));
app.set('view engine','pug');

app.use(Routes);


//Serial Comunication 
const SerialPort = require('serialport');
const ReadLine = SerialPort.parsers.Readline;

const port = new SerialPort('COM6',{
    baudRate: 9600
});

const parser = port.pipe(new ReadLine({ delimiter: '\n' }))

parser.on('open',function(){
    console.log('conection is opened');
})

/*

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

/**PARSEO */
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
        value = dataJson.substring(i+1, dataJson.length-1);
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


parser.on('data', function(data){
    console.log(data);
    let DATA = JsonOnSring(data);
    io.emit('data', DATA);
    objJson="";
})

port.on('error',(err)=>{
    console.log(err);
})
/**FIN PARSEO */


server.listen(3000, ()=>{
    console.log('Server run in port ', 3000 );
});