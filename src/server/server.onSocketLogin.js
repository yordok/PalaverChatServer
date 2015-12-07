var util = require('../utilities/utils.js');
var roomHandler = require('../utilities/roomHandler.js');
var userModel = require("../models/User.js");

var onSocketLogin = function(socket){
  //login
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
        socket.UserID = data.username;
        if(AccountInfo.wantsCustomName){
          socket.username = AccountInfo.customName;
        }
        else{
          socket.username = util.getRandomName();
        }
        socket.emit("LoginSuccessful", AccountInfo);
        socket.emit("receiveUserMetadata", {username: util.getRandomName(), usercolor: util.getRandomColor()})
        console.log(AccountInfo);
      }
    });
  });
  //changePreferences
  socket.on("changePreferences",function(data){
    //var response = userModel.userModel.changeData(newData);
    userModel.userModel.findOne({ username: socket.UserID }, function(error, user){
      if(error){
          console.log("error with finding");
          socket.emit("changePreferencesError");
      }
      else if(user == null){
          console.log("error with finding user");
          socket.emit("changePreferencesError");

      }
      else{
          console.log(data);
          user.wantsCustomName = data.wantsCustomName;
          user.wantsCustomColor = data.wantsCustomColor;
          user.customName = data.CustomName;
          user.customColor = data.CustomColor;
          user.save(function(error, data){
              if(error){
                console.log("error with saving");
                socket.emit("changePreferencesError", {message: error});
                console.log(error);
              }
              else{
                socket.emit("changePreferencesSuccess", user);
                socket.emit("receiveUserMetadata", {username: util.getRandomName(), usercolor: util.getRandomColor()});
                //res.redirect('/success');
              }
          });
      }
    });
  });


  socket.on("createAccount",function(data){
    userModel.userModel.generateHash(data.pass1, function (salt, hash){
      var userData = {
        username: data.username,
        salt: new Buffer(salt),
        password: hash
      };

      var newUserModel = new userModel.userModel(userData);

      newUserModel.save(function(err){
        if(err){
          console.log(err);
          if(err.code == 11000){
            socket.emit("accountCreationError");

          }

          socket.emit("accountCreationError");

        }
        else{
          socket.emit("accountCreationSuccess");

        }

      });

    });
  });
  socket.on("requestUserMetaData",function(data){
    socket.emit("receiveUserMetadata", {username: util.getRandomName(), usercolor: util.getRandomColor()});
  });

};


module.exports.onSocketLogin = onSocketLogin;
