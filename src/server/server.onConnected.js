var util = require('../utilities/utils.js');
var roomHandler = require('../utilities/roomHandler.js');
//onConnected event handler body
var onConnected = function(socket, clients, WorldRooms){
  socket.on("join", function(data) {
	  util.sendServerMessage();
  });
   //on message listener
  socket.on("messageServer",function(data){
    //all this does is messages the server and logs this server side, used for testing puposes
    console.log(data.username.toString() + " : " + data.message.toString());
  });

  //message a specific room listener
  socket.on("messageRoom",function(data){
      var exists = roomHandler.checkRoomExist(socket.currentRooms, data.roomName);
      if(exists == true){
        socket.broadcast.to(data.roomName).emit('message', {roomName:data.roomName, username: data.username, color:data.usercolor, message:data.message});
      }
      else{
        util.sendServerMessage(socket, "You are not in a room called " + data.roomName);
      }
  });
  //gets all the clients currently connected to the server
  socket.on("requestClientList", function(){
      //requests and returs the client list as a string
      util.sendServerMessage(socket, util.getClientListasString(clients));
      //socket.emit('message',{message:util.getClientListasString(clients), username: "server"});
  });
  //returns the clients in the current room
  socket.on("requestClientsInRoom", function(data){
    var roomObj = roomHandler.retrieveRoomObject(WorldRooms, data.roomname);
    var list = "Users in Room: ";
    for(var i =0; i < roomObj.clientsInRoom.length; i++){
      if(i == roomObj.clientsInRoom.length - 1){
        list += roomObj.clientsInRoom[i].username;

      }
      else{
        list += roomObj.clientsInRoom[i].username + ", ";
      }
    }
    util.sendServerMessage(socket,list);
  });
}


module.exports.onConnected = onConnected;
