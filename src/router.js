//router for the routing
var userModel = require("./models/User.js");

var router = function(app){
    app.get('/', function(req, res){
        res.render(__dirname + '/views/signIn.jade');
    });
    app.get('/signup', function(req, res){
        res.render(__dirname + '/views/accountCreation.jade')
    });
    app.get('/success', function(req, res){
        res.render(__dirname + '/views/successPage.jade');
    });
    app.get('/error', function(req, res){
        res.render(__dirname + '/views/errorPage.jade', {error: err});
    });

    app.post('/signin', function(req, res){
      if(!req.body.username || !req.body.password){
        return res.status(400).json({error:"You must enter all fields"});
      }

      userModel.userModel.authenticate(req.body.username,req.body.pass, function(error, account){
      if(error || !account){
        return res.status(401).json({error:"Wrong username and password."});
      }
      req.session.account = account.toAPI();

      res.json({redirect: "/success"});

      });

    });

    app.post('/signup', function(req, res){
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
          salt: salt,
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

  });
};

module.exports.route = router;
