const sockets = io();



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

/* FIN FUNCION MAPA*/ 

/* VARIABLES LOCALES */
var now = new Date();  
let time = now.getDate();

var dataGraphTemp = [],
    dataGraphHum= [],
    posizioni = [];

let i=0;

/**FIN VARIABLES LOCALES  */



sockets.on('data', function(data){
  /**INICIO DE DATA CON SOCKETS */
  var dataJSON = JSON.parse(data);
  console.log(dataJSON);
  i++;
/**FIN DATA SOCKETS */


  /**DATOS DE TEMPERATURA SOKETS */
  dataGraphTemp.push({x: i, Cen: dataJSON.Sensores[0][5], Far: ((9/5)*dataJSON.Sensores[0][5]+32)});
  ChartTemperature.setData(dataGraphTemp);
  /**FIN DE DATOS TEMPERATURA */

  /**DATOS DE HUMEDAD SOKETS */
  dataGraphHum.push({x: i, Hum: dataJSON.Sensores[0][3]});
  ChartHum.setData(dataGraphHum);
  /**FIN DE DATOS HUMEDAD */
  
  
  

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
  lineColors: ['yellow', 'red']
});

/* FIN TEMPERATURA SENSOR */


/* HUMEDAD SENSOR */ 
var ChartHum = new Morris.Area({
  element: 'chartHum',
  xkey: 'x',
  ykeys: ['Hum'],
  labels: [' % Humedad:'],
  resize: false,
  lineColors: ['#44C0FF']
});
/* FIN SENSOR  */