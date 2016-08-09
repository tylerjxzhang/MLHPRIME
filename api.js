var express = require('express');
var router = express.Router();
var util = require('util');
var request = require('request');
var indico = require('indico.io');
var Twitter = require("twitter");
var jQuery = require('jquery-deferred');


var t = new Twitter({
	consumer_key: "placeholder",
	consumer_secret: "placeholder",
	access_token_key: "placeholder",
	access_token_secret: "placeholdre"
});

indico.apiKey =  'placeholder';

router.get('/', function(req, res) {
	var location = {
		'lat':req.query['lat'],
		'lon':req.query['lon']
	};
	var radius = req.query['radius'] * 1000;
	var keyword = req.query['keyword'];
	var apiKey = 'placeholder';
	request('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + location.lat + ',' + location.lon + '\&radius=' + radius + '\&keyword=' + keyword + '\&key=' + apiKey, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var list = JSON.parse(body).results;
			// console.log(list);
			var deferreds = [];
			for (var j = 0; j < list.length; j++) {
				(function(j2) {
					if (list[j2] !== undefined) {
						var deferred = jQuery.Deferred();
						t.get('search/tweets', {q: "\""+list[j2].name+"\"", count: 5, location: location.lat+","+location.lon+","+radius+"km", result_type: "recent"}, function(err, tweets, response) {
							if (!err && tweets.statuses.length !== 0) {
								var batchInput = [];
								for (var i = 0; i < tweets.statuses.length; i++) {
									batchInput.push(tweets.statuses[i].text);
								}
								// console.log(list[j2].name);
								// console.log(batchInput);
								indico.sentimentHQ(batchInput)
								.then(function(response) {
									// console.log(response);
									var sum = response.reduce(function(a, b) {
										return a + b;
									}, 0);
									var average = sum / response.length;
									// console.log(average);
									list[j2]['tweets'] = batchInput;
									list[j2]['score'] = average;
								}).then(function(){
									//console.log("before" + list[j2]['score']);
									deferred.resolve();
								}).error(function(err){
									// console.log(err);
									deferred.resolve();
								});
							} else {
								// console.log(err);
								deferred.resolve();
							}
						});
						deferreds.push(deferred);
					}
				})(j);
			}
			//console.log('PROMISES: ', deferreds.length);
			jQuery.when.apply(jQuery, deferreds).done(function() {
				newlist = list.map(function(el) {
					return (!el.score) ? Math.random() : el.score;
				});
				res.json(list);
			});
		}
	});
});

module.exports = router;
