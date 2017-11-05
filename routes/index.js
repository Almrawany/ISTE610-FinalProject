var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');
var url = 'mongodb://localhost:27017/Tedtalks';
var ObjectID = require('mongodb').ObjectID;



/* GET home page. */




router.get('/', function(req, res, next) {
    res.render('index');
});

// the connectons and query

router.get('/test/submit', function (req, res, next) {


    //Get the request
    var text = req.query.id;

    //Connecting using MongoClient
    mongo.connect(url, function (err, db) {
        return new Promise(function (resolve, reject) {
            if (err) reject(err);
            //--------------------------------------

            var array = db.collection('Ted').find({title: { $regex: ".*" + text + ".*", $options: "i" } }).toArray();

            //var array = db.collection('Ted').find({title: "/.*/b" + text + ".*/i" }).toArray();
            console.log(array);
            // array = db.collection('Ted').find({main_speaker: { $regex: ".*" + text + ".*", $options: "i" }}).toArray();
            // console.log(array);
            // array = db.collection('Ted').find({tags: { $regex: ".*" + text + ".*", $options: "i" }}).limit(100).toArray();
            // console.log(array);
            db.close();
            resolve(array);
            //--------------------------------------
        }).then(function (arr) {
            //--------------------------------------
            res.render('theResult', { item: arr ,Text: text} );
            //--------------------------------------
        });
    });

});

router.get('/Document/:id', function(req, res, next)
    {
        var id2 = req.params.id;
        mongo.connect(url, function (err, db) {
            return new Promise(function (resolve, reject) {
                if (err) reject(err);
                //--------------------------------------
                var array = db.collection('Ted').find({_id: new ObjectID( id2)}).limit(10).toArray();
                console.log(array);
                db.close();
                resolve(array);
                //--------------------------------------
            }).then(function (arr) {
                //--------------------------------------
                res.render('Document', { item: arr , Text: id2} );
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