var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT;
var mongoose = require('mongoose');

//local dependencies
var onConnected = require('./server.onConnected.js');
var onDisconnected = require('./server.onDisconnected.js');
var onRoomJoinLeave = require('./server.onRoomJoinLeave.js');
var onRoomCreateDestroy = require('./server.onRoomCreateDestroy.js');

var util = require('../utilities/utils.js');
var roomHandler = require('../utilities/roomHandler.js');
//including the proper filed and setting a port
//also creating the server object

var clients = [];
var WorldRooms = [];
var publicRooms = 1;
//above are server variables

server.listen(port);
//listen on the specified port above (defaults to 5000)


io.sockets.on("connection",function(socket){
//this method attached the handler onConnected to a new socket when it has connected
  //generates a random username for the new socket
  socket.username = util.getRandomName();
  //generates a random color to associate with this user
  socket.color = util.getRandomColor();
  //send the color and username created by the server back to the user for storage
  socket.emit("receiveUserMetadata", {username:socket.username, usercolor:socket.color});
  //adds the new socket to the client list
  clients.push(socket);
  //the rooms that the client is connected to
  socket.currentRooms = [];

  //Server logs that a new connection has been made
  console.log("connected to the server");
  //callback function from the server to let the client know that they have connected
	onConnected.onConnected(socket);
	onDisconnected.onDisconnected(socket);
  onRoomJoinLeave.onRoomJoinLeave(socket);
  onRoomCreateDestroy.onRoomCreateDestroy(socket);

});
