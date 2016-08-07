var express = require('express');
var router = express.Router();
var util = require('util');
var request = require('request');

router.get('/', function(req, res) {
	var location = {
		'lat':req.query['lat'],
		'lon':req.query['lon']
	};
	var radius = req.query['radius'] * 1000;
	var keyword = req.query['keyword'];
	var apiKey = 'AIzaSyDRDOr49Knf2JjbfgCCHKfseBLn1ixe3HU';
	request('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + location.lat + ',' + location.lon + '\&radius=' + radius + '\&keyword=' + keyword + '\&key=' + apiKey, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(JSON.parse(body).results);
		}
	});
});

module.exports = router;