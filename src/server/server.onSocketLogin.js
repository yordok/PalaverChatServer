var util = require('../utilities/utils.js');
var roomHandler = require('../utilities/roomHandler.js');
var userModel = require("../models/User.js");

var onSocketLogin = function(socket){

  socket.on("login", function(data){
    userModel.userModel.authenticate(data.username, data.password, function(error, account){
      if(error){
        socket.emit("LoginError", {message:"Wrong username and password combo"});
      }
      else if(!account){
        socket.emit("LoginError", {message:"User does not exist"});
      }
      else{
        var AccountInfo = account.toAPI();
        socket.emit("LoginSuccessful", AccountInfo);
        console.log(AccountInfo);
      }
    });
  });
};


module.exports.onSocketLogin = onSocketLogin;
