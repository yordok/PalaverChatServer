//local dependencies
var util = require('../utilities/utils.js');
var roomHandler = require('../utilities/roomHandler.js');
//disconnect
var onDisconnected = function(socket, clients, WorldRooms){
	socket.on("disconnect", function() {
		//remove all the instances of client within the server
		roomHandler.removeUserFromAllRooms(socket, WorldRooms);
    var index = clients.indexOf(socket);

    if (index > -1) {
      clients.splice(index, 1);
    }

	});

}



module.exports.onDisconnected = onDisconnected;
