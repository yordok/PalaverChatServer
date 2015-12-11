var util = require('../utilities/utils.js');
var roomHandler = require('../utilities/roomHandler.js');

var onRoomInvite = function(socket, WorldRooms, clients){
    socket.on("requestInviteOthers", function(data){
        //get people
        var RoomInvitedTo = roomHandler.retrieveRoomObject(WorldRooms, data.roomname);
        if(!RoomInvitedTo){
          return;
        }
        if(RoomInvitedTo.creator != socket){
          util.sendServerToast(socket, "You are not the owner of this room.");
          return;
        }
        if(RoomInvitedTo.invitationsSent==false  && RoomInvitedTo.isFull == false){
          if(clients.length <= 4){
            for(var i = 0; i < clients.length; i++){
              var invitee = clients[i];
              if(invitee.id != socket.id){
                invitee.emit("onInvite", {roomname:data.roomname});
              }
            }
          }
          else{
            while(true){
              var threeClients = get3RandomClient(clients);
              if(checkForUniqueUsers(threeClients, socket)){
                for(var i = 0; i < threeClients.length; i++){
                  threeClients[i].emit("onInvite", {roomname:data.roomname});
                }
                RoomInvitedTo.invitationsSent = true;
                break;
              }
              else{
                continue;
              }

            }

          }
        }
        else{
          util.sendServerToast(socket, "Cannot invite anymore people.")
        }

    });
};
var get3RandomClient = function(clients){
  var clientList = [];
  for(var i = 0; i < 3; i++){
    var rnd = Math.floor((Math.random() * clients.length));
     clientList.push(clients[rnd]);
  }
  return clientList;
}

var checkForUniqueUsers = function(userList, socket){
  //checks if the host part of the list
  for(var j = 0; j < userList.length; j++){
    if(userList[j] == socket){
      return false;
    }
  }
  //checks all other users against eachother.
  if(userList[0] == userList[1]){
    return false;
  }
  else if(userList[0] == userList[2]){
    return false;
  }
  else if (userList[1] == userList[2]) {
    return false;
  }
  else {
    return true;
  }

}

module.exports.onRoomInvite = onRoomInvite;
