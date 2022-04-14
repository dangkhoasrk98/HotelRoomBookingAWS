var express = require('express');
var router = express.Router();
var AWS = require("aws-sdk");

var uuid = require('uuid');

AWS.config.update({
    region: 'us-west-1',
    accessKeyId: 'AKIA4EPUUNYM5IQC7LZG',
    secretAccessKey: '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',
    endpoint: 'https://dynamodb.us-west-1.amazonaws.com'
});
var docClient = new AWS.DynamoDB.DocumentClient();
var params={
    "TableName":"room",
    "IndexName":"status-index",
    "KeyConditionExpression": "#m = :m",
    "ExpressionAttributeNames":{
        "#m": "status"
    },
    "ExpressionAttributeValues": {
        ":m": "trống"
    }
}

router.get('/', function (req, res, next) {
    //res.render('booknowAdmin');
    docClient.query(params, function(err,data){
          if (err){
            console.log(err);
          }
          if (data.Items.length == 0){
            res.render('booknowAdmin',{room:""});
          }else{
            res.render('booknowAdmin',{room:data.Items})
          }
    }) 
});

router.post('/', function (req, res, next) {
  var paramKhach = {
    TableName: "customer",
    Item: {
        "id": uuid.v1().toString(),
        "name": req.body.name,
        "email": req.body.email,
        "address": req.body.address,
        "phone": req.body.phone
    }
  }
  var paramPhong={
    TableName:"room",
    Key:{
        "id": req.body.roomId,
    },
    UpdateExpression: "set #p = :r",
    ExpressionAttributeValues:{
        ":r": "đang thuê",
    },
    ExpressionAttributeNames:{
        "#p": "status"
    },
    ReturnValues:"UPDATED_NEW"
  }
  var paramThue={
    TableName: "booking",
    Item: {
        "id": uuid.v1().toString(),
        "status": "đang thuê",
        "checkin": req.body.checkin,
        "checkout": req.body.checkout,
        "cusNum": req.body.sokhach,
        "message": req.body.message,
        "price": req.body.price,
        "room": req.body.roomId
    }
  }
  docClient.update(paramPhong, function(err,data){
    if (err){
        console.log(err)
    }else{
        console.log("done phòng")
    }
  });
  docClient.put(paramKhach, function(err,data){
    if (err){
        console.log(err)
    }else{
        console.log("done khách")
    }
  });
  docClient.put(paramThue, function(err,data){
    if (err){
        console.log(err)
    }else{
        console.log("done thuê")
    }
  });
  req.flash('error', 'Đặt phòng thành công');
  res.redirect('/booknowAdmin');
});

module.exports = router;
