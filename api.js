var express = require('express');
var router = express.Router();
var util = require('util');
var request = require('request');
var indico = require('indico.io');
var Twitter = require("twitter");
var jQuery = require('jquery-deferred');

var t = new Twitter({
	consumer_key: "3geFIdem5d4MWmZ62DH4IhbhQ",
	consumer_secret: "Yw9ukzXOKEZXdx4m5466YnppbmtskbpM0ZZtufZyW46UMwLkXB",
	access_token_key: "381340321-SN2w6Kl0e3JnzB7p3FBw8IzUXgCPpxdogiYF5DkV",
	access_token_secret: "IjdoRGN4n2mDvCnpkEh2Kus0CgcGFMCG9ciHGT2hSsjXd"
});

indico.apiKey =  'c7c2cda9dc5b823f03b3a86da7dc0e18';

router.get('/', function(req, res) {
	var location = {
		'lat':req.query['lat'],
		'lon':req.query['lon']
	};
	var radius = req.query['radius'] * 1000;
	var keyword = req.query['keyword'];
	var apiKey = 'AIzaSyBPfNkKjw3kTzhMP7A2GSgDHc1vqpV_Bmw';
	request('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + location.lat + ',' + location.lon + '\&radius=' + radius + '\&keyword=' + keyword + '\&key=' + apiKey, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var list = JSON.parse(body).results;
			console.log(list);
			var deferreds = [];
			for (var j = 0; j < list.length; j++) {
				(function(j2) {
					if (list[j2] !== undefined) {
						var deferred = jQuery.Deferred();
						deferreds.push(deferred);
						t.get('search/tweets', {q: "\""+list[j2].name+"\"", count: 5, location: location.lat+","+location.lon+","+radius+"km", result_type: "recent"}, function(err, tweets, response) {
							var batchInput = [];
							for (var i = 0; i < tweets.statuses.length; i++) {
								batchInput.push(tweets.statuses[i].text);
							}
							console.log(list[j2].name);
							console.log(batchInput);
							indico.sentimentHQ(batchInput)
							.then(function(response) {
								console.log(response);
								var sum = response.reduce(function(a, b) {
									return a + b;
								}, 0);
								var average = sum / response.length;
								console.log(average);
								list[j2]['score'] = average;
								deferred.resolve();
							}).error(function(err){
								console.log(err);
								deferred.reject();
							});
						});
					}
				})(j);
			}
			jQuery.when.apply(jQuery, deferreds).done(function() {
				res.json(list);
			});
		}
	});
});

module.exports = router;