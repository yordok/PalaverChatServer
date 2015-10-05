//we will use this to create a room returns room obj
var createNewRoom = function(roomName, socket){
  socket.join(roomName);
  var roomClients = [];
  roomClients.push(socket);
  var newRoomOBJ = {name:roomName, creator:socket.username, clientsInRoom: roomClients};
  return newRoomOBJ;

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

module.exports.checkRoomExist = checkRoomExist;
module.exports.createNewRoom = createNewRoom;
module.exports.getRoomListAsString = getRoomListAsString;
