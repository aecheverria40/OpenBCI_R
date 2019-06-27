//Crear el programa servidor para Nodejs
const express = require('express');
const app = express();

//Manejar Websockets para actualizar en tiempo real los datos de los clientes
const socketIo = require('socket.io');
const http = require('http');

//Conexiones
const server = http.createServer(app);
const io = socketIo.listen(server);

//En Conexiones
io.on('connection', function(socket){
  console.log('a new socket is connected');
});

//Manejador de peticiones
app.get('/', (req, res, next) => {
  res.sendFile(__dirname + '/index.html');
})

//Importo la libreria serialport
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const parser = new Readline();

//Inicializo mi constante serial y el baudRate de comunicacion
const mySerial = new SerialPort('COM4', {
  baudRate: 9600
});

//EventLister para abrir el puerto
mySerial.on('open', function(){
  console.log("SerialPort open");
})

//EventLister para leer el puerto
mySerial.on('data', function(data){
  console.log(data.toString());
  io.emit('arduino:data', {
    value:data.toString()
  });
});

//Cuando ocurra un error
mySerial.on('err', function(err){
  console.console.log(err.message);
});

server.listen(3000, () => {
  console.log('server on port ', 3000);
});
