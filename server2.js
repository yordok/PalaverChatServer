var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 5000;
//including the proper filed and setting a port
//also creating the server object


var clients = [];
var roomKeys = []
var publicRooms = 1;
//above are server variables

server.listen(port);
//listen on the specified port above (defaults to 5000)

//onConnected event handler body
var onConnected = function(socket){
  //on message listener
  socket.on("messageServer",function(data){
    //all this does is messages the server and logs this server side, used for testing puposes
    console.log(data.username.toString() + " : " + data.message.toString());
  });
  //messageAll listener
  socket.on("messageAll",function(data){
        //sends the message to everone in the room Public Room 1
    		socket.broadcast.to('PublicRoom1').emit('message', data.username + " : " + data.message );
  });
}

//this method attached the handler onConnected to a new socket when it has connected
io.sockets.on("connection",function(socket){
  //generates a random username for the new socket
  socket.username =  "user"+Math.floor((Math.random() * 10000) + 1);
  //adds the new socket to the client list
  clients.push(socket);

  //adds everyone to the same public room
  socket.join("PublicRoom1");
  //Server logs that a new connection has been made
  console.log("connected to the server");

	onConnected(socket);

});
