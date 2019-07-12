require("dotenv").config()
var express = require('express');
var app = express();
var url = 'mongodb://localhost:27017/IoT';
var MongoClient = require('mongodb').MongoClient
var http = require('http').createServer(app);
var rotor_socket_server = require('socket.io')(http);
const io_client = require('socket.io-client');

const main_site_socket_client = io_client('http://localhost:8266/');



rotor_socket_server.on('connection', function(rotor_socket){
	console.log('a user connected');
	
	rotor_socket.on('rotor', (data)=>{
    console.log('got rotor data on port 8267')
    console.log(data)
    console.log('send it to main site?')
    main_site_socket_client.emit('rotor', data)
	})
  rotor_socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});


var server = http.listen(8267, function () {
  var host = server.address().address
  var port = server.address().port

  console.log(server.address())
  
  console.log("Example app listening at http://%s:%s", host, port)
})
