var io = require('socket.io-client');
var socket = io.connect("https://immense-chamber-1061.herokuapp.com/");//used to connect to the heroku server
//var socket = io.connect("http://localhost:5000");//used to connect to the localhost for testing
console.log("trying connection");


socket.on("connect", function(data){
  console.log("connection established");
  socket.emit("message", { msg: "words" });

});

socket.on("message",function(data){
  console.log(data.msg);
});
