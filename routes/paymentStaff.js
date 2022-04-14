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

var params={
    "TableName":"booking",
    "IndexName":"status-index",
    "KeyConditionExpression": "#m = :m",
    "ExpressionAttributeNames":{
        "#m": "status"
    },
    "ExpressionAttributeValues": {
        ":m": "đang thuê"
    }
}

/* GET home page. */
router.get('/', function (req, res, next) {
    docClient.query(params, function(err,data){
        if (err){
          console.log(err);
        }
        if (data.Items.length == 0){
            res.render('paymentStaff',{room:""})
        }else{
            res.render('paymentStaff',{room:data.Items})
        }
    })
});

router.post('/', function (req, res, next) {
    var paramPhong={
        TableName:"room",
        Key:{
            "id": req.body.sophong,
        },
        UpdateExpression: "set #p = :r",
        ExpressionAttributeValues:{
            ":r": "trống",
        },
        ExpressionAttributeNames:{
            "#p": "status"
        },
        ReturnValues:"UPDATED_NEW"
    }
    var paramPhieu={
        TableName:"booking",
        Key:{
            "id": req.body.idphieu,
        },
        UpdateExpression: "set #p = :r",
        ExpressionAttributeValues:{
            ":r": "đã trả",
        },
        ExpressionAttributeNames:{
            "#p": "status"
        },
        ReturnValues:"UPDATED_NEW"
    }
    docClient.update(paramPhong, function(err,data){
        if (err){
            console.log(err)
        }else{
            console.log("done phòng")
        }
    });
    docClient.update(paramPhieu, function(err,data){
        if (err){
            console.log(err)
        }else{
            console.log("done phiếu")
        }
    });
    req.flash('error', 'Trả phòng thành công');
    res.redirect('/paymentStaff');
});
module.exports = router;