var util = require('../utilities/utils.js');
var roomHandler = require('../utilities/roomHandler.js');

var onRoomInvite = function(socket, WorldRooms, clients){
    socket.on("requestInviteOthers", function(data){
        //get people
        var RoomInvitedTo = roomHandler.retrieveRoomObject(WorldRooms, data.roomname);
        if(clients.length <= 4){
          for(var i = 0; i < clients.length; i++){
            var invitee = clients[i];
            if(invitee.id != socket.id){
              invitee.emit("onInvite", {roomname:data.roomname});
            }
          }

        }

    });
};

var checkForUniqueUsers = function(userList){

}

module.exports.onRoomInvite = onRoomInvite;
