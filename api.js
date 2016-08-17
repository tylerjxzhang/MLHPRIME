var express = require('express');
var router = express.Router();
var util = require('util');
var request = require('request');
var Twitter = require("twitter");
var jQuery = require('jquery-deferred');
var secrets = require('./secrets');
var sentiment = require('sentiment');
var bodyparser = require('body-parser');


var twit = new Twitter({
	consumer_key: secrets.twitterConsumerKey,
	consumer_secret: secrets.twitterConsumerSecret,
	access_token_key: secrets.twitterAccessTokenKey,
	access_token_secret: secrets.twitterAccessTokenSecret
});

var googleMapKey = secrets.googleMapKey;




router.get('/discover', function(req, res) {
	// Get params
	var location = {
		'lat':req.query['lat'],
		'lon':req.query['lon']
	};
	var radius = req.query['radius'] * 1000;
	var keyword = req.query['keyword'];

	var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + location.lat + ',' + location.lon + '\&radius=' + radius + '\&keyword=' + keyword + '\&key=' + googleMapKey;

	request(url , function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var list = JSON.parse(body).results;
			var deferreds = [];
      var deferredFirst = jQuery.Deferred();
      deferreds.push(deferredFirst);
      if (list.length == 0) {
        // No place found
        res.json(null);
      } else {
        deferredFirst.resolve();
        list.forEach(function(item){
          (function (place) {
            var deferred = jQuery.Deferred();
            twit.get('search/tweets',{q: "\""+place.name+"\"", count: 10, geocode: location.lat + ',' + location.lon + ',10mi' ,result_type: "recent"},function(err, body, response) {
              if (!err && body.statuses.length !== 0) {
                var batchInput = body.statuses.map(function(tweet) {
                  return tweet.text;
                });
                request({
                  url: 'http://localhost:8000/api/sentiment',
                  method: 'POST',
									json: true,
                  body: {
                    data: batchInput
                  }
                }, function(error, response, body){
                  if(error) {
                    console.log(error);
                  } else {
                    var results = body.results;
                    var sum = results.reduce(function(a, b) {
                      return a + b;
                    }, 0);
                    var average = sum / results.length;
                    place['tweets'] = batchInput.join('<br/>');
                    place['score'] = average;
										console.log("the score is " + place['score']);
                  }
									deferred.resolve();
                });
              } else {
                deferred.resolve();
              }
            });
            deferreds.push(deferred);
          })(item)
        });
        jQuery.when.apply(jQuery, deferreds).done(function() {
          res.json(list);
        });
      }
		} else {
			console.log(error);
		}
	});
});

router.get('/locate', function(req, res) {
	// Get params
	var address = req.query['address'].split(' ').join('+');
  console.log(address);

	var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '\&key=' + googleMapKey;
	console.log(url);

	request(url , function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var data = JSON.parse(body);

      var geometry = data.results[0].geometry;

			var location = {
				'latitude':geometry.location.lat,
				'longitude':geometry.location.lng
			};

      res.json(location);
		} else {
			console.log(error);
		}
	});
});

router.post('/sentiment', function(req, res) {
	var results_parse = req.body.data.map(function(tweet) {
		return sentiment(tweet).comparative;
	})
	console.log(req.body);
	res.body = {
		results: results_parse
	}
	res.json(res.body);
});

module.exports = router;
