//const Main = require('../models').Data;


// Funcion manejadora 
/*
function(request, responce){}
*/

module.exports = {
    index: function(req,res){
        datos.findAll().then((data) =>{ 
            res.render('/index',{
                datos: data
            });
        });
     
    }
};