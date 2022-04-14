var express = require('express');
var router = express.Router();

var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-2",
    accessKeyId: 'accessKeyId',
    secretAccessKey: 'secretAccessKey',
    endpoint: "http://localhost:8081"
});

/* GET home page. */
router.get('/', function (req, res, next) {
    // var getRoom = function () {

    //     var promise = new Promise(function (resolve, reject) {
    //         var docClient = new AWS.DynamoDB.DocumentClient();
    //         var params = {
    //             TableName: "Room",
    //             IndexName: "RoomIndex",
    //             KeyConditionExpression: "#status = :status",
    //             ExpressionAttributeNames: {
    //                 "#status": "status"
    //             },
    //             ExpressionAttributeValues: {
    //                 ":status": 0
    //             }
    //         };
    //         docClient.query(params, (error, result) => {
    //             if (error) {
    //                 console.log(error);
    //             }
    //             else console.log(success);
    //         });
    //     });

    //     return promise;
    // };

    // getRoom()
    //     .then(function success(result) {
    //         res.render('rooms', { getRoom: result });
    //     });
    res.render('rooms', { title: 'Room page' });
});


module.exports = router;