//router for the routing
var loginCont = require("./controllers/loginController.js");
var middleCont = require("./middleware/index.js");

var router = function(app, token){
    //get
    app.get('/',token ,loginCont.controllers.signInPage);
    app.get('/signup',token , loginCont.controllers.creationPage);
    app.get('/success',token , loginCont.controllers.successPage);
    app.get('/error',token , loginCont.controllers.errorPage);
    app.get('/profile', token, loginCont.controllers.profilePage);
    //post
    app.post('/signin', loginCont.controllers.signIn);
    app.post('/signup', loginCont.controllers.signUp);
    app.post('/profile', loginCont.controllers.profileForm);
};
module.exports.route = router;
