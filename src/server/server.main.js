//app deppendencies
var path = require('path');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var compression = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var url = require('url');
var csrf = require('csurf');

//local dependencies
var onConnected = require('./server.onConnected.js');
var onDisconnected = require('./server.onDisconnected.js');
var onRoomJoinLeave = require('./server.onRoomJoinLeave.js');
var onRoomCreateDestroy = require('./server.onRoomCreateDestroy.js');
var router = require('../router.js');
var util = require('../utilities/utils.js');
var roomHandler = require('../utilities/roomHandler.js');

//server variables
var clients = [];
var WorldRooms = [];
var publicRooms = 1;

//var dbURL = "mongodb://localhost/" ||
var dbURL = process.env.MONGOLAB_URI; //process.env.MONGOLAB_URI ||

var db = mongoose.connect(dbURL, function(err){
    if(err){
      console.log("Could not connect to database");
      throw err;
    }
});

var redisURL = {
    hostname: 'localhost',
    port: 6379
};

var redisPASS;

if(process.env.REDISCLOUD_URL){
    redisURL = url.parse(process.env.REDISCLOUD_URL);
    redisPASS = redisURL.auth.split(":")[1];
}

var port = process.env.PORT || process.env.NODE_PORT || 3000;

app.use(compression());
app.use(bodyParser.urlencoded({
  extended:true
}));
app.use(session({
  key:"sessionid",
  store: new RedisStore({
    host:redisURL.hostname,
    port:redisURL.port,
    pass:redisPASS
  }),
  secret: 'SuperDuperSecret',
  resave: true,
  saveUninitialized: true,
  cookie:{
    httpOnly: true
  }
}));
app.set('view engine', 'jade');
app.disable('x-powered-by');
app.use(cookieParser());

var csrfProtection = csrf({cookie:true});

/*
app.use(function(err, req, res, next){
    if(err.code !== "EBADCSRFTOKEN") return next(err)

    return;
});
*/
router.route(app, csrfProtection);

server.listen(port);
console.log("route");

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
