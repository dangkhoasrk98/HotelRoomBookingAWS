var express = require('express');
var router = express.Router();
const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var AWS = require("aws-sdk");
var bcryptjs = require('bcryptjs');

AWS.config.update({
  region: 'us-west-1',
  accessKeyId: 'AKIA4EPUUNYM5IQC7LZG',
  secretAccessKey: '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',
  endpoint: 'https://dynamodb.us-west-1.amazonaws.com'
});
var docClient = new AWS.DynamoDB.DocumentClient();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('login');
});

passport.use(new LocalStrategy({
  usernameField : 'email',
  passwordField : 'password'
},
function(email, password, done) { 
  var params = {
    "TableName":"user",
    "IndexName":"email-index",
    "KeyConditionExpression": "#m = :m",
    "ExpressionAttributeNames":{
      "#m": "email"
    },
    "ExpressionAttributeValues": {
      ":m": email
    }
  };
  docClient.query(params, function(err,data){
    if (err){
      return done(null,false,{message: "Apologies, please try again now. ("+err+")"});
    }
    if (data.Items.length == 0){
      return done(null, false, {message: 'No user found'});
    }
    var params2={
      "TableName":"user",
      "Key": {"id":data.Items[0]["id"]}
    };
    docClient.get(params2,function(err,data){
      if (err){
        return done(err);
      }
      if (!bcryptjs.compareSync(password, data.Item.password)){
        return done(null, false, {message: 'Wrong password'});
      }else{
        return done(null, data.Item);
      }
    });
  });
}
));

// serialize user object
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// deserialize user object
passport.deserializeUser(function (id, done) {
  var params2={
    "TableName":"user",
    "Key": {"id":id}
  };
  docClient.get(params,function(err,data){
    if (err){
      return done(err);
    }
    done(err,data.Item);
  });
});

router.post('/', function(req, res,next){
  passport.authenticate('local', function(err, user, info){
	  if(err){return next(err);}
	  if(!user){
		  req.flash("error","Log in error");
		  res.redirect('/login');
	  }
    req.logIn(user, function(err){
      if (err) {return next(err);}
      if(req.user.type=="NV")
        res.redirect("homeStaff")
      if(req.user.type=="QL")
        res.redirect("homeAdmin")
    });
  })(req, res,next);
});

module.exports = router;
