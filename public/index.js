const sockets = io();
setInterval('location.reload()',80000)
/*    MAPA    */
var map;
function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
  });
}

var mymap = L.map('mapid').setView([21.857125, -102.289837], 18);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox.streets'
}).addTo(mymap);

var gps = L.marker([21.857125, -102.289837]);
mymap.addLayer(gps);

/* FIN MAPA*/ 


var now = new Date();  
let time = now.getDate();

var dataGraphTemp = [],
    dataGraphHum= [],
    dataGraphGir= [],
    dataGraphAce= [],
    dataGraphMag= [],
    dataGraphCSS811= [],
    posizioni = [];

let i=0;

/**RSSI */
const elementRSSI = document.getElementById("RSSI-data");
let RSSI_SOCKET;
let colorRSSI;

/**DATOS FRONT */
const elementAltura = document.getElementById("altura");
const elementAlturaAtm = document.getElementById("alturaAtm");
const elementVelocidad = document.getElementById("velocidad");
const elementTemperatura = document.getElementById("temperatura");
const elementHumedad = document.getElementById("humedad");
const elementPresion = document.getElementById("presion");
const elementTvoc = document.getElementById("tvoc");
const elementCo2 = document.getElementById("co2");

/**/
sockets.on('data', function(data){
  i++;

  /**INICIO DE DATA CON SOCKETS */
  var dataJSON = JSON.parse(data);
  console.log(dataJSON);
  
/**FIN DATA SOCKETS */

/** RSSI */
  RSSI_SOCKET = dataJSON.Sensores[0][21];
  console.log(RSSI_SOCKET);

  if(RSSI_SOCKET > -80){
    elementRSSI.classList.add('colorRSSI-G');
    console.log("dsa");
  }else if(RSSI_SOCKET >= -100){
    elementRSSI.classList.add('colorRSSI-M');
  

  }else if(RSSI_SOCKET > -110){
    elementRSSI.classList.add('colorRSSI-B');
    

  }else{
    elementRSSI.classList.add('colorRSSI-B');
  

  }
  elementRSSI.innerHTML= RSSI_SOCKET;
  
  /**DATOS FRONT SOCKETS */
  elementAltura.innerHTML =  dataJSON.Sensores[0][17]+ " 7  m";
  elementAlturaAtm.innerHTML =  dataJSON.Sensores[0][17] +" m";
  elementVelocidad.innerHTML =  dataJSON.Sensores[0][18] + " kn";
  elementTemperatura.innerHTML =  dataJSON.Sensores[0][5]+ " °C"; 
  elementHumedad.innerHTML =  dataJSON.Sensores[0][3] +" %"; 
  elementPresion.innerHTML =  dataJSON.Sensores[0][4] + " mb"; 
  let porTVOC = dataJSON.Sensores[0][20]/10000; //ppm a %
  let porCO2 = dataJSON.Sensores[0][19]/10000; //ppm a %
  elementTvoc.innerHTML =  porTVOC + " %";
  elementCo2.innerHTML =  porCO2 + " %";
  /**/

  /**DATOS DE TEMPERATURA SOKETS */
  dataGraphTemp.push({x: i, Cen: dataJSON.Sensores[0][5], Far: ((9/5)*dataJSON.Sensores[0][5]+32)});

  ChartTemperature.setData(dataGraphTemp);
  /**FIN DE DATOS TEMPERATURA */



  
  /**DATOS DE GIROSCOPIO SOKETS */
  dataGraphGir.push({x: i, X: dataJSON.Sensores[0][12], Y: dataJSON.Sensores[0][13], Z: dataJSON.Sensores[0][14] });

  ChartGiroscopio.setData(dataGraphGir);
  /**FIN DE DATOS GIROSCOPIO */

  
  /**DATOS DE ACELEROMETRO SOKETS */
  dataGraphAce.push({x: i, X: dataJSON.Sensores[0][9], Y: dataJSON.Sensores[0][10], Z: dataJSON.Sensores[0][11] });

  ChartAcelerometro.setData(dataGraphAce);
  /**FIN DE DATOS ACELEROMETRO */
  
  
  /**DATOS DE MAGNETOMETRO SOKETS */
  dataGraphMag.push({x: i, X: dataJSON.Sensores[0][6], Y: dataJSON.Sensores[0][7], Z: dataJSON.Sensores[0][8] });

  ChartMagnetometro.setData(dataGraphMag);
  /**FIN DE DATOS MAGNETOMETRO */


  /**DATOS DE HUMEDAD SOKETS */
  dataGraphHum.push({x: i, Hum: dataJSON.Sensores[0][3]});
  ChartHum.setData(dataGraphHum);
  /**FIN DE DATOS HUMEDAD */
  
  /**DATOS DE TEMPERATURA SOKETS */
  dataGraphCSS811.push({x: i, CO2: dataJSON.Sensores[0][19], TVOC:dataJSON.Sensores[0][20]});

  ChartCSS811.setData(dataGraphCSS811);
  /**FIN DE DATOS TEMPERATURA */

  

  /* MAPA SOCKET */
  var pos = {
    lat:  dataJSON.Sensores[0][15],
    long: dataJSON.Sensores[0][16]
  }

  gps.setLatLng([dataJSON.Sensores[0][15],dataJSON.Sensores[0][16]]).update();
  posizioni.push(pos);
  //var polyline = L.polyline([dataJSON.Sensores[0][15],dataJSON.Sensores[0][16]], {color: 'red'}).addTo(mymap);
	//mymap.fitBounds(polyline.getBounds());
  gps.bindPopup("SateliteUCI").openPopup();
/**FIN DE MAPA SOCKET */

});
/**/

/* TEMPERATURA SENSOR */
var ChartTemperature = new Morris.Area({
  element: 'chartTemperature',
  xkey: 'x',
  ykeys: ['Cen','Far'],
  labels: ['C°','F°'],
  resize: false,
  lineColors: ["#ff9421", "#931c63"]
});

/* FIN TEMPERATURA SENSOR */

/* HUMEDAD SENSOR */ 
var ChartHum = new Morris.Area({
  element: 'chartHum',
  xkey: 'x',
  ykeys: ['Hum'],
  labels: [' % Humedad:'],
  resize: true,
  lineColors: ['#44C0FF']
});
/* FIN SENSOR  */


/* GIROSCOPIO SENSOR */
var ChartGiroscopio = new Morris.Line({
  element: 'chartGiroscopio',
  xkey: 'x',
  ykeys: ['X','Y','Z'],
  labels: ['X','Y','Z'],
  resize: true,
  lineColors: ["#ff9421", "#931c63","red"]
});

/* FIN GIROSCOPIO SENSOR */


/* ACELEROMETRO SENSOR */
var ChartAcelerometro = new Morris.Line({
  element: 'chartAcelerometro',
  xkey: 'x',
  ykeys: ['X','Y','Z'],
  labels: ['X','Y','Z'],
  resize: true,
  lineColors: ["#ff9421", "#931c63","red"]
});

/* FIN ACELEROMETRO SENSOR */

/* MAGNETOMETRO SENSOR */
var ChartMagnetometro = new Morris.Line({
  element: 'chartMagneto',
  xkey: 'x',
  ykeys: ['X','Y','Z'],
  labels: ['X','Y','Z'],
  resize: true,
  lineColors: ["#ff9421", "#931c63","red"]
});

/* FIN MAGNETOMETRO SENSOR */


/* CCS811 SENSOR */


var ChartCSS811 = new Morris.Area({
  element: 'chartCO2&TVOC',
  xkey: 'x',
  ykeys: ['CO2','TVOC'],
  labels: ['CO2','TVOC'],
  resize: false,
  lineColors: ["#ff9421", "#931c63"]
});

/* FIN CCS811 SENSOR */



