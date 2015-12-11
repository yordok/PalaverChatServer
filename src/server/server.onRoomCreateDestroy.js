//local dependencies
"use strict";
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
    console.log("tryjoin create username:"  + socket.username);
    var exists = roomHandler.checkRoomExist(WorldRooms, data.roomName);
    if(exists == true){
      //check to see if the room has been joined by this user already
      var hasJoined = roomHandler.checkRoomExist(socket.currentRooms, data.roomName);
      if(hasJoined == false){
        var roomOBJ = roomHandler.retrieveRoomObject(WorldRooms, data.roomName);
        if(roomOBJ.isFull == false){
          socket.join(data.roomName);
          socket.broadcast.to(data.roomName).emit('message', {roomName:data.roomName, username:data.username, color:data.usercolor, message:data.username +" has joined the room."});

          util.sendServerMessage(socket, "You have successfully joined the room " + data.roomName);
          roomOBJ.clientsInRoom.push(socket);
          socket.currentRooms.push(roomOBJ);
          if(roomOBJ.clientsInRoom.length >=4){
            roomOBJ.isFull = true;
          }
          roomHandler.updateRoomObject(WorldRooms, roomOBJ);

        }
        else{
          util.sendServerToast(socket, "This room is full.");
        }
      }
    }
    else{
      //if the room does not exist, create a new room.
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



  socket.on("requestCurrentlyJoinedRooms", function(data){
    var names = "";
    for(var i =1; i < socket.rooms.length; i++){
        i++;
        names += socket.rooms[i]+ ", ";
        console.log(socket.rooms[i]);

    }
    util.sendServerMessage(socket,names);
  });

}

module.exports.onRoomCreateDestroy = onRoomCreateDestroy;
