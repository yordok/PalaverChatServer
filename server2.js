var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT;
var util = require('./utils.js');
var roomHandler = require('./roomHandler.js');
//including the proper filed and setting a port
//also creating the server object

var clients = [];
var WorldRooms = [];
var publicRooms = 1;
//above are server variables

server.listen(port);
//listen on the specified port above (defaults to 5000)

//onConnected event handler body
var onConnected = function(socket){
  socket.on("join", function(data) {
	  socket.emit("message",{username: "SERVER", message:"You have connected"});
  });
   //on message listener
  socket.on("messageServer",function(data){
    //all this does is messages the server and logs this server side, used for testing puposes
    console.log(data.username.toString() + " : " + data.message.toString());
  });
  //messageAll listener
  socket.on("messageAll",function(data){
        //sends the message to everone in the room Public Room 1
    		socket.broadcast.to('PublicRoom1').emit('message', {username:socket.username.toString(), message:data.message.toString()});
  });
  //message a specific room listener
  socket.on("messageRoom",function(data){
        console.log(socket.username);
        var exists = roomHandler.checkRoomExist(socket.currentRooms, data.roomName);
        if(exists == true){
          var room = roomHandler.retrieveRoomObject(WorldRooms, data.roomName);
          console.log(room.name);
          socket.broadcast.to(room.name.toString()).emit('message', {roomName:data.roomName ,username:socket.username.toString(), message:data.message.toString()});
        }
        else{
          SendServerMessage(socket, "You are not in a room called " + data.roomName);
        }
  });

  socket.on("requestClientList", function(){
      //requests and returs the client list as a string
      socket.emit('message',{message:util.getClientListasString(clients), username: "server"});
  });
}
var onRoomJoinLeave = function(socket){
  //join the specified room
  socket.on("joinRoom", function(data){
    var exists = roomHandler.checkRoomExist(WorldRooms, data.roomName);
    if(exists == true){
      socket.broadcast.to(data.roomName).emit('message', {time:util.getTimestamp() , date:util.getDatestamp(), username:data.username.toString(), message:socket.username +" has joined the room."});
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
        socket.currentRooms.splice(index, 1);
        SendServerMessage(socket, "You have successfully left the room " + data.roomName);

      }
    }
  });
}


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
        socket.broadcast.to(data.roomName).emit('message', {time:util.getTimestamp() , date:util.getDatestamp(), username:data.username.toString(), message:socket.username +" has joined the room."});
        SendServerMessage(socket, "You have successfully joined the room " + data.roomName);
        socket.currentRooms.push(roomHandler.retrieveRoomObject(WorldRooms, data.roomName));
      }
      else{
        SendServerMessage(socket, "You have already joined the room " + data.roomName);
      }
    }
    else{
      socket.emit("message", {message:"You have created a new room called " + data.roomName, username:"server"});
      var nRoom = roomHandler.createNewRoom(data.roomName,socket);
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

var onDisconnect = function(socket){
	socket.on("disconnect", function() {

		socket.broadcast.to('PublicRoom1').emit('message', {username: 'server', message: socket.username + " has left the room."});

		socket.leave('room1');


    var index = clients.indexOf(socket);

    if (index > -1) {
      clients.splice(index, 1);
    }
	});

}


io.sockets.on("connection",function(socket){
//this method attached the handler onConnected to a new socket when it has connected
  //generates a random username for the new socket
  socket.username =  util.getRandomName();
  //generates a random color to associate with this user
  socket.color = util.getRandomColor();
  //send the color and username created by the server back to the user for storage
  socket.emit("receiveUserMetadata", {username:socket.username, usercolor:socket.color});
  //adds the new socket to the client list
  clients.push(socket);
  //the rooms that the client is connected to
  socket.currentRooms = [];

  //adds everyone to the same public room
  socket.join("PublicRoom1");
  //on connect, tell the room you have connected
  socket.broadcast.to('PublicRoom1').emit('message', {username: 'server', message: socket.username + " has joined and connected to the room."});
  //Server logs that a new connection has been made
  console.log("connected to the server");
  //callback function from the server to let the client know that they have connected
  socket.emit("message",{username: "SERVER", message:"You have connected"});

	onConnected(socket);
	onDisconnect(socket);
  onRoomJoinLeave(socket);
  onRoomCreateDestroy(socket);

});
