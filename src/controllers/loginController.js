var userModel = require("../models/User.js");
var _ = require("underscore");

var signInPage = function(req,res){
    res.render(__dirname + './../views/signIn.jade', {csrfToken: req.csrfToken()});
};

var creationPage = function(req, res){
    res.render(__dirname + './../views/accountCreation.jade', {csrfToken: req.csrfToken()})
};

var successPage = function(req, res){
    res.render(__dirname + './../views/successPage.jade');
};

var errorPage = function(req, res){
    res.render(__dirname + './../views/errorPage.jade');
};

var profilePage = function(req, res){
    res.render(__dirname + './../views/profilePage.jade');
};

var logout = function(req, res){
    req.session.destroy();
    res.redirect('/');
};

var profileForm = function(req, res){
    var newData = {};
    //console.log("USERNAME" + req.session.account.username)
    newData.username = req.session.account.username;
    console.log(req.body.wantsCustomName);
    //logic
    if(!req.body.wantsCustomName){
      newData.wantsCustomName = false;
      newData.CustomName = req.session.account.CustomName;
    }
    else if(req.body.wantsCustomName == "on"){
      newData.wantsCustomName = true;
      newData.CustomName = req.body.CustomName;
    }

    if(!req.body.wantsCustomColor){
      newData.wantsCustomColor = false;
      newData.CustomColor = req.session.account.CustomColor;
    }
    else if(req.body.wantsCustomColor == "on"){
      newData.wantsCustomColor = true;
      newData.CustomColor = req.body.CustomColor;
    }
    console.log("wants custom color " + newData.wantsCustomColor);
    console.log("wants custom name " + newData.wantsCustomName);
    console.log("custom color " + newData.CustomColor);
    console.log("custom name " + newData.CustomName);


    //var response = userModel.userModel.changeData(newData);
    userModel.userModel.findOne({ username: newData.username }, function(error, user){
      if(error){
          console.log("error with finding");
          res.json(error);
      }
      else if(user == null){
          res.json({message:"User does not exist"});
      }
      else{
          user.wantsCustomName = newData.wantsCustomName;
          user.wantsCustomColor = newData.wantsCustomColor;
          user.customName = newData.CustomName;
          user.customColor = newData.CustomColor;
          user.save(function(error, data){
              if(error){
                console.log("error with saving");
                res.json(error);
              }
              else{
                res.render( __dirname + './../views/profilePage.jade', {settings: newData});
                //res.redirect('/success');
              }
          });
      }
    });


};

var signIn = function(req, res){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({error:"All fields required."});
  }
  userModel.userModel.authenticate(req.body.username,req.body.password, function(error, account){
    if(error || !account){
      return res.status(401).json({error:"Wrong username and password."});
    }
    req.session.account = account.toAPI();
    console.log(req.session.account);
    //res.json({redirect: "/profile", settings: req.session.account});
    res.render( __dirname + './../views/profilePage.jade', {settings: req.session.account});

  });

};

var signUp = function(req, res){
  //server checks integrity of user info
    if(!req.body.username || !req.body.pass1 || !req.body.pass2){
      return res.status(400).json({error:"You must enter all fields"});
    }
    if(req.body.pass1 != req.body.pass2){
      return res.status(400).json({error:"Passwords do not match."});
    }
    userModel.userModel.generateHash(req.body.pass1, function (salt, hash){
      var userData = {
        username:req.body.username,
        salt: new Buffer(salt),
        password: hash
      };

      var newUserModel = new userModel.userModel(userData);

      newUserModel.save(function(err){
        if(err){
          console.log(err);
          if(err.code == 11000){
            return res.status(400).json({error:"Username is already in use."});
          }

          return res.status(400).json({error:err});

        }
        res.render( __dirname + './../views/profilePage.jade', {settings: req.session.account});

      });

    });

};

module.exports.controllers = {
  signInPage: signInPage,
  creationPage: creationPage,
  successPage: successPage,
  errorPage: errorPage,
  profilePage: profilePage,
  profileForm: profileForm,
  signIn: signIn,
  signUp: signUp,
  logout: logout
}
