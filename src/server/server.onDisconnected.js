//local dependencies
var util = require('../utilities/utils.js');
var roomHandler = require('../utilities/roomHandler.js');

var onDisconnected = function(socket, clients, WorldRooms){
	socket.on("disconnect", function() {
		roomHandler.removeUserFromAllRooms(socket, WorldRooms);
    var index = clients.indexOf(socket);

    if (index > -1) {
      clients.splice(index, 1);
    }

	});

}



module.exports.onDisconnected = onDisconnected;
