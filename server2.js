var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 5000;
var util = require('./utils.js');
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
  socket.on("join", function(data) {
	  socket.emit("message",{username: "SERVER", message:"You have connected"});
  });
   //on message listener
  socket.on("messageServer",function(data){
    //all this does is messages the server and logs this server side, used for testing puposes
    console.log(data.username.toString() + " : " + data.message.toString());
  });
  //messageAll listener
  socket.on("messageAll",function(data){
        //sends the message to everone in the room Public Room 1
    		socket.broadcast.to('PublicRoom1').emit('message', {username:data.username.toString(), message:data.message.toString()});
  });
}

var onDisconnect = function(socket){
	socket.on("disconnect", function() {

		socket.broadcast.to('PublicRoom1').emit('message', {username: 'server', message: socket.username + " has left the room."});

		socket.leave('room1');


    var index = clients.indexOf(socket);

    if (index > -1) {
      array.splice(index, 1);
    }
	});

}


io.sockets.on("connection",function(socket){
//this method attached the handler onConnected to a new socket when it has connected
  //generates a random username for the new socket
  socket.username =  util.getRandomName();
  //generates a random color to associate with this user
  socket.color = util.getRandomColor();
  //send the color and username created by the server back to the user for storage
  socket.emit("receiveUserMetadata", {username:socket.username, usercolor:socket.color});
  //adds the new socket to the client list
  clients.push(socket);

  //adds everyone to the same public room
  socket.join("PublicRoom1");
  //on connect, tell the room you have connected
  socket.broadcast.to('PublicRoom1').emit('message', {username: 'server', message: socket.username + " has joined and connected to the room."});
  //Server logs that a new connection has been made
  console.log("connected to the server");
  //callback function from the server to let the client know that they have connected
  socket.emit("message",{username: "SERVER", message:"You have connected"});

	onConnected(socket);
	onDisconnect(socket);

});
