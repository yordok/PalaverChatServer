var io = require('socket.io-client');
//var socket = io.connect("https://palaver-server.herokuapp.com/");//used to connect to the heroku server
var socket = io.connect("http://localhost:5000");//used to connect to the localhost for testing
var readline = require('readline');

//Setup readline interface
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("trying to connect")
var userName = process.argv[2];
var trip = process.argv[3];
var userColor = "";

var EventLog = [];
var ChatLog = [];

//Set blank strings if username or trip are not defined
if(userName == undefined)
  userName = "";

if(trip == undefined)
  trip = "";

//run this client if you want to test to see if the server is running
socket.on("connect", function(){
  LogEvent("connection established");
  //inital connection

  socket.emit("join", { username:userName, tripCode: trip, message:"CONNECTION TEST ESTABLISHED" });

	//when a message is recieved
	socket.on("message",function(data){
	  LogMessage(data.username + ": " + data.message);
	});

  socket.on("receiveUserMetadata", function(data){
    userName = data.username.toString();
    userColor = data.usercolor.toString();
    LogEvent(data.username + " " + data.usercolor);
  });

  rl.on("line", function(data){SendMessage(data);});

});

function Refresh()
{
  for(var i = 0; i < EventLog.length; i++)
    console.log(EventLog[i]);

  clear();

  for(var i = 0; i < ChatLog.length; i++)
    console.log(ChatLog[i]);
}

function LogEvent(data)
{
  EventLog.push(data);
  Refresh();
}

function LogMessage(data)
{
  ChatLog.push(data);
  Refresh();
}

function SendMessage(data)
{
  var obj = {username: userName, message:data};
  socket.emit("messageAll", obj);
  Refresh();
}

function clear()
{
  var lines = process.stdout.getWindowSize()[1] - EventLog.length - ChatLog.length - 1;
  for(var i = 0; i < lines; i++) {
    console.log('|');
  }
}
