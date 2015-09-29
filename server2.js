var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT;
var util = require('./utils.js');
var tripcode = require('tripcode');
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
    //Apply a random name by default
    var user = util.getRandomName();
    var color = util.getRandomColor();

    //Overwrite with the user's name if provided
    if(data.username != "")
      user = data.username.toString();

    //If there was a tripcode provided, we should add it to the user string
    if(data.tripCode != "")
      user += "!" + tripcode(data.tripCode.toString());

    // Apply color if provided
    if(data.usercolor != undefined)
      color = data.usercolor;

    //Set the client's info
    socket.username = user;
    socket.color = color;

    //send the color and username created by the server back to the user for storage
    socket.emit("receiveUserMetadata", {username:socket.username, usercolor:socket.color});

	  socket.emit("message",{username: "SERVER", message: socket.username + " has connected"});

    //Log that the connection has been made
    console.log(socket.username + " has connected");
  });
   //on message listener
  socket.on("messageServer",function(data){

    //all this does is messages the server and logs this server side, used for testing puposes
    console.log(data.username + " : " + data.message.toString());
  });
  //messageAll listener
  socket.on("messageAll",function(data){
    //sends the message to everone in the room Public Room 1
    //socket.broadcast.to('PublicRoom1').emit('message', {time:util.getTimestamp() , date:util.getDatestamp(), username:data.username.toString(), message:data.message.toString()});
    socket.emit('message', {time:util.getTimestamp() , date:util.getDatestamp(), username:data.username.toString(), message:data.message.toString()});
  });

  socket.on("requestClientList", function(){
    //requests and returs the client list as a string
    socket.emit('message',{"message":util.getClientListasString(clients), username: "server"});
  });
}

var onDisconnect = function(socket){
	socket.on("disconnect", function() {

		socket.broadcast.to('PublicRoom1').emit('message', {username: 'server', message: socket.username + " has left the room."});

		socket.leave('room1');

    var index = clients.indexOf(socket);

    if (index > -1) {
      clients.splice(index, 1);
    }
	});

}


io.sockets.on("connection",function(socket){
//this method attached the handler onConnected to a new socket when it has connected
  //adds the new socket to the client list
  clients.push(socket);

  //adds everyone to the same public room
  socket.join("PublicRoom1");
  //on connect, tell the room you have connected
  socket.broadcast.to('PublicRoom1').emit('message', {username: 'server', message: socket.username + " has joined and connected to the room."});

	onConnected(socket);
	onDisconnect(socket);

});
