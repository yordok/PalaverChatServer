var userModel = require("../models/User.js");

var signInPage = function(req,res){
    console.log("root directory");
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

var logout = function(req, res){
    req.session.destroy();
    res.redirect('/');
};

var signIn = function(req, res){
  console.log("signIN CALLED")
  if(!req.body.username || !req.body.password){
    return res.status(400).json({error:"All fields required."})
  }
  userModel.userModel.authenticate(req.body.username,req.body.pass, function(error, account){
    if(error || !account){
      return res.status(401).json({error:"Wrong username and password."});
    }
    req.session.account = account.toAPI();

    return res.redirect("/success");

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
        console.log(newUserModel.toAPI());
        return res.redirect("/success");

      });

    });

};

module.exports.controllers = {
  signInPage: signInPage,
  creationPage: creationPage,
  successPage: successPage,
  errorPage: errorPage,
  signIn: signIn,
  signUp: signUp,
  logout: logout
}
