var express = require('express');
var router = express.Router();
var util = require('util');
var request = require('request');
var indico = require('indico.io');
var Twitter = require("twitter");
var jQuery = require('jquery-deferred');
var secrets = require('./secrets');

var twit = new Twitter({
	consumer_key: secrets.twitterConsumerKey,
	consumer_secret: secrets.twitterConsumerSecret,
	access_token_key: secrets.twitterAccessTokenKey,
	access_token_secret: secrets.twitterAccessTokenSecret
});

indico.apiKey =  secrets.indicoKey;
var googleMapKey = secrets.googleMapKey;

router.get('/', function(req, res) {
	// Get params
	var location = {
		'lat':req.query['lat'],
		'lon':req.query['lon']
	};
	var radius = req.query['radius'] * 1000;
	var keyword = req.query['keyword'];

	var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + location.lat + ',' + location.lon + '\&radius=' + radius + '\&keyword=' + keyword + '\&key=' + googleMapKey;
	console.log(url);

	request(url , function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var list = JSON.parse(body).results;
			console.log(list);
			var deferreds = [];
			for (var j = 0; j < list.length; j++) {
				(function(j2) {
					if (list[j2] !== undefined) {
						var deferred = jQuery.Deferred();
						console.log(secrets.twitterConsumerSecretKey);
						twit.get('search/tweets',{q: "\""+list[j2].name+"\"", count: 5, location: location.lat+","+location.lon+","+radius+"km", result_type: "recent"},function(err, tweets, response) {
							if (!err && tweets.statuses.length !== 0) {
								var batchInput = tweets.statuses.map(function(tweet) {
									return tweet.text;
								});
								console.log('tweets', batchInput);
								indico.sentimentHQ(batchInput).then(function(response){
									console.log(response);
									var sum = response.reduce(function(a, b) {
										return a + b;
									}, 0);
									var average = sum / response.length;
									list[j2]['tweets'] = batchInput;
									list[j2]['score'] = average;
								}).then(function() {
									deferred.resolve();
								}).error(function(err) {
									console.log(err);
									deferred.resolve();
								});
							} else {
								console.log(err);
								deferred.resolve();
							}
						});
						deferreds.push(deferred);
					}
				})(j);
			}
			jQuery.when.apply(jQuery, deferreds).done(function() {
				newlist = list.map(function(el) {
					return (!el.score) ? Math.random() : el.score;
				});
				res.json(list);
			});
		} else {
			console.log(error);
		}
	});
});

module.exports = router;
