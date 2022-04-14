var express = require('express');
var router = express.Router();
var AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();
var uuid = require('uuid');
var bcryptjs =require('bcryptjs');


AWS.config.update({
    region: 'us-west-1',
    accessKeyId: 'AKIA4EPUUNYM5IQC7LZG',
    secretAccessKey: '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',
    endpoint: 'https://dynamodb.us-west-1.amazonaws.com'
});

var docClient = new AWS.DynamoDB.DocumentClient();

router.get('/', function (req, res, next) {
    res.render('register', { title: 'Register page' });
});

router.post('/', function (req, res) {
    var params = {
        "TableName":"user",
        "IndexName":"email-index",
        KeyConditionExpression: "#pw = :pw",
        ExpressionAttributeNames:{
            "#pw": "email"
        },
        ExpressionAttributeValues: {
        ":pw": req.body.email
        }
    };
    docClient.query(params, function(err,data){
        // if there are any errors, return the error
        if (err){
            req.flash('error',  "Apologies, please try again now. ("+err+")");
            res.redirect('/register');
        }
        // check to see if theres already a user with that email
        if (data.Items.length > 0) {
          req.flash('error', 'email này đã đăng kí');
          res.redirect('/register');
        } else {
            bcryptjs.genSalt(10, (err, salt) => {
                bcryptjs.hash(req.body.password, salt, (err, hash) => {
                    var params = {
                        TableName: "user",
                        Item: {
                            "id": uuid.v1().toString(),
                            "email": req.body.email,
                            "password": hash,
                            "name": req.body.name,
                            "type": req.body.type
                        }
                    };
                    docClient.put(params, function(err,data){
                        if (err){
                            req.flash('error', "Apologies, please try again now. ("+err+")");
                            res.redirect('/register');
                        }else{
                            req.flash('error', 'Sign up success!');
                            res.redirect('/register');
                        }
                      });
                });
            });
        }        
    });
});

module.exports = router;