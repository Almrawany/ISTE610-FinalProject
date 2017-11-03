var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');
var url = 'mongodb://localhost:27017/SampleSocial';
/* GET home page. */


router.get('/', function(req, res, next) {
    res.render('index');
});


router.post('/test/submit', function (req, res, next) {

    var text = req.body.id;
    console.log(".*" + text + "*.")
    //Connecting using MongoClient
    console.log(text)
    mongo.connect(url, function (err, db) {
        return new Promise(function (resolve, reject) {
            if (err) reject(err);
            //--------------------------------------
            var array = db.collection('Tweets').find({text: { $regex: ".*" + text + "*." }}).limit(10).toArray();
            db.close();
            resolve(array);

            //--------------------------------------
        }).then(function (arr) {
            console.log(arr);
            //--------------------------------------
            res.render('theResult', {item: arr } );
            //--------------------------------------
        });
    });



});

router.get('/return', function(req, res, next)
    {
        res.render('index');

    }

);


module.exports = router;


// mohammed