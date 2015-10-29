//local dependencies
var util = require('../utilities/utils.js');
var roomHandler = require('../utilities/roomHandler.js');

var onRoomJoinLeave = function(socket){
  //join the specified room
  socket.on("joinRoom", function(data){
    var exists = roomHandler.checkRoomExist(WorldRooms, data.roomName);
    if(exists == true){
      socket.join(data.roomName);
      socket.broadcast.to(data.roomName).emit('message', {username:data.username.toString(), message:socket.username +" has joined the room."});
      SendServerMessage(socket, "You have successfully joined the room " + data.roomName);
      socket.currentRooms.push(data.roomName);
    }
    else{
      SendServerMessage(socket, "There is no room of the name " + data.roomName);

    }
  });
  socket.on("leaveRoom", function(data){
    var exists = roomHandler.checkRoomExist(socket.currentRooms, data.roomName);
    if(exists == true){
      socket.leave(data.roomName);
      var index = socket.currentRooms.indexOf(roomHandler.retrieveRoomObject(socket.currentRooms, data.roomName));
      if (index > -1) {
        socket.leave(data.roomName);
        socket.currentRooms.splice(index, 1);
        SendServerMessage(socket, "You have successfully left the room " + data.roomName);

      }
    }
  });
}

var SendServerMessage = function(socket,msg){
  socket.emit("message", {roomName:"SERVER",message:msg, username:"server"})
}

module.exports.onRoomJoinLeave = onRoomJoinLeave;
