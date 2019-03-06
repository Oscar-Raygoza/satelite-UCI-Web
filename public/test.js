   sockets.on('data', function(data){
    var obj = JSON.parse(data);
    document.getElementById("celsius").innerHTML = obj.Sensores[0][5] + "ºC";
    document.getElementById("humedad").innerHTML = obj.Sensores[0][3] + "% Humedad";
    document.getElementById("press").innerHTML = obj.Sensores[0][6] + "bmp";
    
    document.getElementById("mx").innerHTML = obj.Sensores[0][6] + " X";
    document.getElementById("my").innerHTML = obj.Sensores[0][7] + " Y";
    document.getElementById("mz").innerHTML = obj.Sensores[0][8] + " Z";

    document.getElementById("ax").innerHTML = obj.Sensores[0][9] + " X";
    document.getElementById("ay").innerHTML = obj.Sensores[0][10] + " Y";
    document.getElementById("az").innerHTML = obj.Sensores[0][11] + " Z";

    document.getElementById("gx").innerHTML = obj.Sensores[0][12] + " X";
    document.getElementById("gy").innerHTML = obj.Sensores[0][13] + " Y";
    document.getElementById("gz").innerHTML = obj.Sensores[0][14] + " Z";
    
    document.getElementById("lat").innerHTML = obj.Sensores[0][15] + " latitude";
    document.getElementById("lon").innerHTML = obj.Sensores[0][16] + " longitude";
    document.getElementById("alt").innerHTML = obj.Sensores[0][17] + " altura";
    document.getElementById("vel").innerHTML = obj.Sensores[0][18] + " Velocidad";

    document.getElementById("co2").innerHTML = obj.Sensores[0][19] + " CO2";
    document.getElementById("tvoc").innerHTML = obj.Sensores[0][20] + " TVOC";
    document.getElementById("RSSI").innerHTML = obj.Sensores[0][21] + " Señal";

    console.log(obj);
})