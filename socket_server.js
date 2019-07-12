require("dotenv").config()
var express = require('express');
var app = express();
var url = 'mongodb://localhost:27017/IoT';
var MongoClient = require('mongodb').MongoClient
var http = require('http').createServer(app);
var io = require('socket.io')(http);



io.on('connection', function(socket){
	console.log('a user connected');
	
	socket.on('rotor', (data)=>{
		console.log(data)
	})
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});


var server = http.listen(8267, function () {
  var host = server.address().address
  var port = server.address().port

  console.log(server.address())
  
  console.log("Example app listening at http://%s:%s", host, port)
})
