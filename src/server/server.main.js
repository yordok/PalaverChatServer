var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');

//local dependencies
var onConnected = require('./server.onConnected.js');
var onDisconnected = require('./server.onDisconnected.js');
var onRoomJoinLeave = require('./server.onRoomJoinLeave.js');
var onRoomCreateDestroy = require('./server.onRoomCreateDestroy.js');

var router = require('../router.js');
var util = require('../utilities/utils.js');
var roomHandler = require('../utilities/roomHandler.js');
//including the proper filed and setting a port
//also creating the server object
var port = process.env.PORT;
//for local testing
//var dbURL = "mongodb://localhost/";
//for website testing
var dbURL = process.env.MONGOLAB_URI;


//server variables
var clients = [];
var WorldRooms = [];
var publicRooms = 1;
//use cookieParser
app.use(cookieParser());
//listen on the specified port above (defaults to 5000)
var db = mongoose.connect(dbURL, function(err){
    if(err){
      console.log("Could not connect to database");
      throw err;
    }
});
app.set('view engine', 'jade');
app.set('view options', {
    layout: false
});

//use body parser
app.use(bodyParser.urlencoded({
  extended:true
}));
app.set('views', __dirname + '../views');

router.route(app);

server.listen(port);

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
	onConnected.onConnected(socket, clients);
	onDisconnected.onDisconnected(socket, clients);
  onRoomJoinLeave.onRoomJoinLeave(socket, WorldRooms);
  onRoomCreateDestroy.onRoomCreateDestroy(socket, WorldRooms);

});
