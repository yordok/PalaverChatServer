//local dependencies
var util = require('../utilities/utils.js');
var roomHandler = require('../utilities/roomHandler.js');

var onRoomCreateDestroy = function(socket){
  //handles new room creation
  socket.on("createNewRoom", function(data){
    var usedname = roomHandler.checkRoomExist(WorldRooms, data.roomName);
    if(usedname == false){
      socket.emit("message", {message:"You have created a new room called " + data.roomName, username:"server"});
      var nRoom = roomHandler.createNewRoom(data.roomName,socket);
      WorldRooms.push(nRoom);
      socket.currentRooms.push(nRoom);
    }
    else{
      socket.emit("message", {message:"The room name "+data.roomName+" is already in use", username:"server"});
    }

  });
  //create this
  //this is used to join a room, if the room does not exist it creates the room
  socket.on("roomTryJoinCreate",function(data){
    var exists = roomHandler.checkRoomExist(WorldRooms, data.roomName);
    if(exists == true){
      //check to see if the room has been joined by this user already
      var hasJoined = roomHandler.checkRoomExist(socket.currentRooms, data.roomName);
      if(hasJoined == false){
        socket.join(data.roomName);
        socket.broadcast.to(data.roomName).emit('message', {roomName:data.roomName, username:data.username.toString(), message:socket.username +" has joined the room."});
        SendServerMessage(socket, "You have successfully joined the room " + data.roomName);
        socket.currentRooms.push(roomHandler.retrieveRoomObject(WorldRooms, data.roomName));
      }
      else{
        SendServerMessage(socket, "You have already joined the room " + data.roomName);
      }
    }
    else{
      socket.emit("message", {roomName: data.roomName, message:"You have created a new room called " + data.roomName, username:"server"});
      var nRoom = roomHandler.createNewRoom(data.roomName,socket);
      socket.join(data.roomName);
      WorldRooms.push(nRoom);
      socket.currentRooms.push(nRoom);
    }
  });

  socket.on("requestAllRooms", function(data){
    console.log("get rooms");
    socket.emit("message", {message:roomHandler.getRoomListAsString(WorldRooms), username:"server"})
  });

  socket.on("requestCurrentlyJoinedRooms", function(data){
    socket.emit("message", {message:roomHandler.getRoomListAsString(socket.currentRooms), username:"server"})
  });

}

var SendServerMessage = function(socket,msg){
  socket.emit("message", {roomName:"SERVER",message:msg, username:"server"})
}

module.exports.onRoomCreateDestroy = onRoomCreateDestroy;
