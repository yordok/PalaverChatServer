var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 5000;
var clients = [];
var roomKeys = []
var publicRooms = 1;

server.listen(port);

var onConnected = function(socket){

  console.log("connected to the server");
  socket.on("message",function(data){
    console.log(data.msg.toString());
  });
  socket.on("messageAll",function(data){
    		socket.broadcast.to('Public Room 1').emit('message', data );
  });
}

io.sockets.on("connection",function(socket){
  socket.join("Public Room 1")

	onConnected(socket);

});
