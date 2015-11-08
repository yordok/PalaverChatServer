var util = require('../utilities/utils.js');
var roomHandler = require('../utilities/roomHandler.js');
//onConnected event handler body
var onConnected = function(socket, clients){
  socket.on("join", function(data) {
	  socket.emit("message",{username: "SERVER", message:"You have connected"});
  });
   //on message listener
  socket.on("messageServer",function(data){
    //all this does is messages the server and logs this server side, used for testing puposes
    console.log(data.username.toString() + " : " + data.message.toString());
  });

  //message a specific room listener
  socket.on("messageRoom",function(data){
        console.log(socket.username);
        console.log(data.message);
        var exists = roomHandler.checkRoomExist(socket.currentRooms, data.roomName);
        if(exists == true){
          socket.broadcast.to(data.roomName).emit('message', {roomName:data.roomName, username: socket.username, message:data.message});
        }
        else{
          SendServerMessage(socket, "You are not in a room called " + data.roomName);
        }
  });

  socket.on("requestClientList", function(){
      //requests and returs the client list as a string
      socket.emit('message',{message:util.getClientListasString(clients), username: "server"});
  });
}

var SendServerMessage = function(socket,msg){
  socket.emit("message", {roomName:"SERVER",message:msg, username:"server"})
}

module.exports.onConnected = onConnected;
