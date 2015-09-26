var io = require('socket.io-client');
//var socket = io.connect("https://immense-chamber-1061.herokuapp.com/");//used to connect to the heroku server
var socket = io.connect("http://localhost:5000");//used to connect to the localhost for testing
console.log("trying connection");

//run this client if you want to test to see if the server is running
socket.on("connect", function(data){
//inital connection
  console.log("connection established");
  socket.emit("messageServer", { username:"TEST", message:"CONNECTION TEST ESTABLISHED" });
  //this interval will send a message to all users and the server to test.
  //it will send the messages every 5 seconds
  setInterval(function(){
    socket.emit("messageServer", { username:"TEST", message:"CONNECTION TEST ESTABLISHED" });
    socket.emit("messageAll", { username:"TEST", message:"CONNECTION TEST ESTABLISHED" });

  }, 5000);

});

//when a message is recieved
socket.on("message",function(data){
  console.log(data.username.toString() + ": " + data.message);
});
