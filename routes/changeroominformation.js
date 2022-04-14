var express = require('express');
var router = express.Router();
var AWS = require("aws-sdk");
AWS.config.update({
    region: 'us-west-1',
    accessKeyId: 'AKIA4EPUUNYM5IQC7LZG',
    secretAccessKey: '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',
    endpoint: 'https://dynamodb.us-west-1.amazonaws.com'
});

var docClient = new AWS.DynamoDB.DocumentClient();

var params = {
      TableName: "room",
      Select: "ALL_ATTRIBUTES"
};
router.get('/', function (req, res, next) {
    docClient.scan(params, function(err,data){
        if (err){
          console.log(err);
        }
        if (data.Items.length == 0){
          console.log("no room for rent");
        }else{
          res.render('changeroominformation',{room:data.Items})
        }
  }) 
});

router.post('/', function (req, res, next) {
    var paramPhong={
        TableName:"room",
        Key:{
            "id": req.body.roomId,
        },
        UpdateExpression: "set #p = :r, #t = :t",
        ExpressionAttributeValues:{
            ":r": Number(req.body.price),
            ":t": req.body.type
        },
        ExpressionAttributeNames:{
            "#t": "type",
            "#p": "price"
        },
        ReturnValues:"UPDATED_NEW"
    };
    docClient.update(paramPhong, function(err,data){
        if (err){
            req.flash('error', "Apologies, please try again now. ("+err+")");
            res.redirect('/changeroominformation');
        }else{
            req.flash('error', 'Update success!');
            res.redirect('/changeroominformation');
        }
    });
});
module.exports = router;
