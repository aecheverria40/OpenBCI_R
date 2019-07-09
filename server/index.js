//Crear el programa servidor para Nodejs
const express = require('express');
const app = express();

//Manejar Websockets para actualizar en tiempo real los datos de los clientes
const socketIo = require('socket.io');
const http = require('http');

//Modulos para Cyton
const Cyton = require("@openbci/cyton");
const {constants} = require("@openbci/utilities");

//Conexiones
const server = http.createServer(app);
const io = socketIo.listen(server);

//Inicializo el modulo cyton
const ourBoard = new Cyton({
  simulate: true //Esto simula como si leyera las señales
  //verbose: true //Para inicializar el módulo a
});

//Simulo que leo del puerto
var portName = constants.OBCISimulatorPortName;

//En Conexiones
io.on('connection', function(socket){
  console.log('a new socket is connected');
});

//Inicializo a leer los datos
ourBoard.connect(portName).then(function (){
  console.log('Console');
  //ourBoard.on('ready', () =>{
    ourBoard.streamStart();
    ourBoard.on('sample', function(sample){
      console.log('Iteration');
      //console.log(sample.channelData[0]);
        for (var i = 0; i < 8; i++) {
          console.log("Chanel " + i + " " + sample.channelData[i]);
          io.emit('openbci:sample', {
              value:sample.channelData[i]
          });
        }
    });
  //});
}).catch(function(err){
  console.log("Pues no se pudo");
});

//Estaticos
app.use('/server', express.static('public'));

//Manejador de peticiones
app.get('/', (req, res, next) => {
  res.sendFile(__dirname + '/pagina/index.html');
})

app.get('/alta', (req, res, next) => {
  res.sendFile(__dirname + '/pagina/alta.html');
})

//Importo la libreria para leer del serialport(no creo que se necesite ya que openbci tiene su propia libreria para leer el puerto)
// const SerialPort = require('serialport');
// const Readline = SerialPort.parsers.Readline;
// const parser = new Readline();

//Inicializo mi constante serial y el baudRate de comunicacion
// const mySerial = new SerialPort('COM5', {
//   baudRate: 9600
// });

//EventLister para abrir el puerto
// mySerial.on('open', function(){
//   console.log("SerialPort open");
// })

//EventLister para leer el puerto
// mySerial.on('data', function(data){
//   console.log(data.toString());
//   io.emit('arduino:data', {
//     value:data.toString()
//   });
// });

//Cuando ocurra un error
// mySerial.on('err', function(err){
//   console.console.log(err.message);
// });

//Servidor inicializado en el puerto 3000
server.listen(3000, () => {
  console.log('server on port ', 3000);
});
