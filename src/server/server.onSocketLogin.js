var util = require('../utilities/utils.js');
var roomHandler = require('../utilities/roomHandler.js');
var userModel = require("../models/User.js");

var onSocketLogin = function(socket){

  socket.on("login", function(data){
    userModel.userModel.authenticate(data.username, data.password, function(error, account){
      if(error || !account){
        socket.emit("LoginError");
      }
      else{
        var AccountInfo = account.toAPI();
        socket.emit("LoginSuccessful", AccountInfo);
        socket.emit("message", {message:AccountInfo.customName});
      }
      //res.json({redirect: "/profile", settings: req.session.account});
    });

  });

};


module.exports.onSocketLogin = onSocketLogin;
