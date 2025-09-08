/*
-- DIA 1 --
 */
//Importación de express en variable app
const express = require('express');
const app = express();

//OJO - ANIDAR TODO A USAR JSON
app.use(express.json());


require('dotenv').config();

//Definimos el puerto
const PORT = process.env.PORT;

//Ruta principal -> Endpoint
app.get('/',(req,res) =>{
    res.send('Holissss!! Bievenidos a expressss!');
});

app.get('/mensaje1',(req,res) =>{
    res.send('Este es otro endpoint');
});

app.post('/mensaje1',(req,res) =>{
    res.send('Un post falso');
});
//Ruta con respuesta en formato JSON
app.get('/mensaje2',(req,res) =>{
    let jsonsito= {
        "mensaje":"Holiii"
    };
    //res.send('Este es otro endpoint');
    res.json(jsonsito);
});

//Ruta con parámetro
app.get('/mensajePersonalizado/:nombre',(req,res) => {
    const nombre = req.params.nombre;
    res.send(`¡Hola ${nombre}!`);
})

//Ruta POST que recibe un JSON
app.post('/mensajeJSON',(req,res) =>{
    const menJson=req.body;
    console.log(menJson);
    res.send(`Hola ${menJson["nombre"]} , el cual tiene ${menJson["edad"]} año/s!!`);
}
)
//Iniciar el servidor
app.listen(PORT,()=>{
    console.log("Servidor iniciado!");
});