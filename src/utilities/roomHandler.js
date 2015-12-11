//we will use this to create a room returns room obj
var createNewRoom = function(roomName, socket){
  var roomClients = [];
  console.log("createroom username: " + socket.username)
  roomClients.push(socket);
  //name: name of room STRING
  //creator: creator of room SOCKET
  //clientsInRoom: list of sockets of people in room ARRAY OF SOCKETS
  //isFull: if the room is full of people BOOLEAN
  //invitationsSent: if there have already been invitations sent BOOLEAN
  var newRoomOBJ = {name:roomName, creator:socket, clientsInRoom: roomClients, isFull:false, invitationsSent:false};
  return newRoomOBJ;

}
//returns the full object of the specified name
var retrieveRoomObject = function(RoomList, RoomName){
  for(var j = 0; j < RoomList.length; j++){
    if(RoomList[j].name == RoomName){
      return RoomList[j];
    }
  }
}

var updateRoomObject = function(RoomList, Room){
  var index = RoomList.indexOf(Room);
    if (index > -1) {
      RoomList.splice(index, 1);
      RoomList.push(Room);
    }

}

var removeUserFromAllRooms = function(socket, worldRoomList){
  for(var i =0; i < worldRoomList.length; i++){
      var roomObj = worldRoomList[i];
      var index = roomObj.clientsInRoom.indexOf(socket);
      if(index > -1){
        roomObj.clientsInRoom.splice(index, 1);
        updateRoomObject(worldRoomList, roomObj);
      }
  }
}

//returns true if the inputed name exists
var checkRoomExist = function(RoomList, RoomName){
  for(var o = 0; o < RoomList.length; o++){
    if(RoomList[o].name == RoomName){
      return true;
    }
  }
  return false;
}

var getRoomListAsString = function(RoomList){
  var stringList = "";
  for(var i = 0; i < RoomList.length; i++){
    stringList += RoomList[i].name + ", ";
  }
  return stringList;
}

module.exports.retrieveRoomObject = retrieveRoomObject;
module.exports.checkRoomExist = checkRoomExist;
module.exports.createNewRoom = createNewRoom;
module.exports.getRoomListAsString = getRoomListAsString;
module.exports.updateRoomObject = updateRoomObject;
module.exports.removeUserFromAllRooms = removeUserFromAllRooms;
