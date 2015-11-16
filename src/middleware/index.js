var requiresLogin = function(req, res, next){
  if(!req.session.account){
    return res.redirect('/');
  }
  next();
};

var requiresLogout = function(req, res, next){
  if(req.session.account){
    return res.redirect('/successPage');
  }
  next();
};

var requiresSecure = function(req, res, next){
  if(req.headers['x-forwarded-proto'] != 'https'){
    return res.redirect('https://' + req.host + req.url);
  }
  next();
};

var bypassSecure = function(req, res, next){
  next();
};

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

if(process.env.NODE_ENV === "production"){
  module.exports.requiresSecure = requiresSecure;
}
else{
  module.exports.requiresSecure = bypassSecure;

}
