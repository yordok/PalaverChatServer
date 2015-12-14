//local dependencies
var util = require('../utilities/utils.js');
var roomHandler = require('../utilities/roomHandler.js');


var onRoomJoinLeave = function(socket, WorldRooms){
  //join the specified room
  //deprecated
  socket.on("joinRoom", function(data){
    var exists = roomHandler.checkRoomExist(WorldRooms, data.roomName);
    if(exists == true){
      socket.join(data.roomName);
      socket.broadcast.to(data.roomName).emit('message', {username:socket.username, color:data.color, message:socket.username +" has joined the room."});
      util.sendServerMessage(socket, "You have successfully joined the room " + data.roomName);
      socket.currentRooms.push(data.roomName);
    }
    else{
      util.sendServerMessage(socket, "There is no room of the name " + data.roomName);
    }
  });
  //lets the user leave a room
  socket.on("leaveRoom", function(data){
    var exists = roomHandler.checkRoomExist(socket.currentRooms, data.roomName);
    if(exists == true){
      socket.leave(data.roomName);
      socket.broadcast.to(data.roomName).emit('message', {roomName:data.roomName, username:"Server Message", color:"FF0000", message:data.username +" has left the room."});
      //remove the room from the current list of rooms attached to the socket
      var index = socket.currentRooms.indexOf(roomHandler.retrieveRoomObject(socket.currentRooms, data.roomName));
      if (index > -1) {
        socket.currentRooms.splice(index, 1);
      }
      //remove refrence to socket in roomObj stored in WorldRooms
      var roomObj = roomHandler.retrieveRoomObject(WorldRooms, data.roomName);
      index = roomObj.clientsInRoom.indexOf(socket);
      if (index > -1) {
        roomObj.clientsInRoom.splice(index, 1);
        roomHandler.updateRoomObject(WorldRooms, roomObj);
        util.sendServerMessage(socket, "You have successfully left the room " + data.roomName);

      }

    }
  });
}


module.exports.onRoomJoinLeave = onRoomJoinLeave;
