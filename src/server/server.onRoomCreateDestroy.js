//local dependencies
var util = require('../utilities/utils.js');
var roomHandler = require('../utilities/roomHandler.js');

var onRoomCreateDestroy = function(socket, WorldRooms, ioSockets){
  //handles new room creation
  socket.on("createNewRoom", function(data){
    var usedname = roomHandler.checkRoomExist(WorldRooms, data.roomName);
    if(usedname == false){
      util.sendServerMessage(socket, "You have created a new room called " + data.roomName);
      var nRoom = roomHandler.createNewRoom(data.roomName, socket);
      WorldRooms.push(nRoom);
      socket.currentRooms.push(nRoom);
    }
    else{
      util.sendServerMessage(socket, "The room name "+data.roomName+" is already in use");
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
        socket.broadcast.to(data.roomName).emit('message', {roomName:data.roomName, username:data.username.toString(), color:data.usercolor.toString(), message:socket.username +" has joined the room."});
        util.sendServerMessage(socket, "You have successfully joined the room " + data.roomName);
        socket.currentRooms.push(roomHandler.retrieveRoomObject(WorldRooms, data.roomName));
      }
      else{
        util.sendServerMessage(socket, "You have already joined the room " + data.roomName);
      }
    }
    else{
      util.sendServerMessage(socket, "You have created a new room called " + data.roomName)
      var nRoom = roomHandler.createNewRoom(data.roomName,socket);
      socket.join(data.roomName);
      WorldRooms.push(nRoom);
      socket.currentRooms.push(nRoom);
    }
  });

  socket.on("requestAllRooms", function(data){
    console.log("get rooms");
    util.sendServerMessage(socket, roomHandler.getRoomListAsString(WorldRooms));
  });

  socket.on("requestClientsInRoom", function(data){
    var clients = socket.rooms
    var list = "";
    for(var i = 0; i < clients.length; i++){
        list += clients[i].username + ", ";
    }

    util.sendServerMessage(socket, list);
  });

  socket.on("requestCurrentlyJoinedRooms", function(data){
    util.sendServerMessage(socket,roomHandler.getRoomListAsString(socket.currentRooms));
    //socket.emit("message", {message:roomHandler.getRoomListAsString(socket.currentRooms), username:"server"})
  });

}

module.exports.onRoomCreateDestroy = onRoomCreateDestroy;
