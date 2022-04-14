var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req,res){
    res.render('homeAdmin')
});

router.get('/logout', function (req, res)  {
    req.session.destroy(function (err) {
        res.redirect('/'); //Inside a callback… bulletproof!
    });
});

function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        next();
    } else{
        res.redirect("/login");
    }
}
module.exports = router;