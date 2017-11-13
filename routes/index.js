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
    var str = "\\b" + text + ".*" ;
    var str1 = "\\b" + text + "\\b.*";

    //Connecting using MongoClient
    mongo.connect(url, function (err, db) {
        return new Promise(function (resolve, reject) {
            if (err) reject(err);
            //--------------------------------------
            
            var array = db.collection('Ted').find({$or: [{title: {$regex: new RegExp(str, "i")}}, {main_speaker: {$regex: new RegExp(str1, "i")}}]}).toArray();

            //var array = db.collection('Ted').find({title: "/.*/b" + text + ".*/i" }).toArray();
            //console.log(array);
            // array = db.collection('Ted').find({main_speaker: { $regex: ".*" + text + ".*", $options: "i" }}).toArray();
            // console.log(array);
            // array = db.collection('Ted').find({tags: { $regex: ".*" + text + ".*", $options: "i" }}).limit(100).toArray();
            // console.log(array);

            db.close();
            resolve(array);
            //--------------------------------------
        }).then(function (arr) {
            console.log();
            console.log(arr);
            //--------------------------------------
            if (arr.length == 0) {

                res.render('theResult', { item1: arr.length == 0 ,Text: text} );
            }
            else {
                res.render('theResult', { item: arr ,Text: text} );}
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

// Here I have made a router that takes the comment from the user and it will update the field depend on the _id
//attribute that has been inetialize by the mongoDB.
router.post('/add/comment',function(req, res, next) {

    var id2 = req.body.id; // this id has been taken from a hidden input in the Document page.
    var usercomment2 = req.body.usercomment;// this is the comment that the user inialize.


    mongo.connect(url, function (err, db) {
        return new Promise(function (resolve, reject) {
            if (err) reject(err);
            //--------------------------------------
            // this update is using ($addToSet) to make attribute comment an array.
            var array = db.collection('Ted').updateOne({_id: new ObjectID(id2)}, {$addToSet: {comment2: usercomment2}});
            //console.log(array);
            db.close();
            resolve(array);
            //--------------------------------------
        }).then(function (arr) {
            //--------------------------------------
            res.redirect('/Document/'+id2); // after updating the comment attribute, this line will redirect the user
            // to the router that requery.
            //--------------------------------------
        });

    });


});




module.exports = router;


// mohammed
