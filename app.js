var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var engines = require ('jade');
var assert = require ('assert');

app = express();

app.set ('view engine', 'jade');
app.set ('views', __dirname + "/views");

// attempt to connect to MongoDB
MongoClient.connect("mongodb://localhost:27017/garden", function (err,db){
	assert.equal(null, err);  // crashes if error not null
	console.log("Connected to to MongoDB");
	
	// routes - this is for the home page
	app.get('/', function (req, res){
		db.collection('flowers').find({}, {"name":true, "color":true}).toArray(function(err, flowerdocs){
			if (err) {return res.sendStatus(500);}
			db.collection('flowers').distinct('color', function(err,colordocs){
				if (err) {return res.sendStatus(500);}
				return res.render('allflowers', {'flowers': flowerdocs, 'flowercolors':colordocs});
			});  // end of the distinct query
		});  // end of find query
	});  // end of main page
	
	// form handling route - when the user clicks on the show colors button that says Choose color
	
	
	// all other requests, return 404 not found
	app.use (function(req, res){
		res.sendStatus(404);
	});
	
	// and start the server on any port you like
	var server = app.listen(3000, function(){
		var port = server.address().port;
		console.log("Server listening on port " + port);
	});
	
});