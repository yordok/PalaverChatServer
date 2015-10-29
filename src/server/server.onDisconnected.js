//local dependencies
var util = require('../utilities/utils.js');
var roomHandler = require('../utilities/roomHandler.js');

var onDisconnected = function(socket){
	socket.on("disconnect", function() {

		socket.broadcast.to('PublicRoom1').emit('message', {username: 'server', message: socket.username + " has left the room."});

		socket.leave('room1');


    var index = clients.indexOf(socket);

    if (index > -1) {
      clients.splice(index, 1);
    }
	});

}



module.exports.onDisconnected = onDisconnected;
