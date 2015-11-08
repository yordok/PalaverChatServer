//local dependencies
var util = require('../utilities/utils.js');
var roomHandler = require('../utilities/roomHandler.js');

var onDisconnected = function(socket, clients){
	socket.on("disconnect", function() {

    var index = clients.indexOf(socket);

    if (index > -1) {
      clients.splice(index, 1);
    }
	});

}



module.exports.onDisconnected = onDisconnected;
