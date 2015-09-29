var io = require('socket.io-client');
//var socket = io.connect("https://palaver-server.herokuapp.com/");//used to connect to the heroku server
var socket = io.connect("http://localhost:5000");//used to connect to the localhost for testing

console.log("trying to connect")
var userName = process.argv[2];
var trip = process.argv[3];
var userColor = "";

//Set blank strings if username or trip are not defined
if(userName == undefined)
  userName = "";

if(trip == undefined)
  trip = "";

//run this client if you want to test to see if the server is running
socket.on("connect", function(){
  console.log("connection established");
  //inital connection

  socket.emit("join", { username:userName, tripCode: trip, message:"CONNECTION TEST ESTABLISHED" });

  //this interval will send a message to all users and the server to test.
  //it will send the messages every 5 seconds
  setInterval(function(){
    //socket.emit("messageServer", { username:"TEST", message:"CONNECTION TEST ESTABLISHED" });
    socket.emit("messageAll", { username:userName, tripCode: trip, message:"CONNECTION TEST ESTABLISHED" });
    socket.emit("requestClientList");

  }, 5000);

	//when a message is recieved
	socket.on("message",function(data){
	  console.log(data.username + ": " + data.message);
	});

  socket.on("receiveUserMetadata", function(data){
    userName = data.username.toString();
    userColor = data.usercolor.toString();
    console.log(data.username + " " + data.usercolor);
  });




});
