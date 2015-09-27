var io = require('socket.io-client');
var socket = io.connect("https://palaver-server.herokuapp.com/");//used to connect to the heroku server
//var socket = io.connect("http://localhost:5000");//used to connect to the localhost for testing

console.log("trying to connect")
var userName = ""
var userColor = "";
//run this client if you want to test to see if the server is running
socket.on("connect", function(){
//inital connection
  console.log("connection established");

  socket.emit("messageServer", { username:userName, message:"CONNECTION TEST ESTABLISHED" });

  //this interval will send a message to all users and the server to test.
  //it will send the messages every 5 seconds
  setInterval(function(){
    //socket.emit("messageServer", { username:"TEST", message:"CONNECTION TEST ESTABLISHED" });
    socket.emit("messageAll", { username:userName, message:"CONNECTION TEST ESTABLISHED" });

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
