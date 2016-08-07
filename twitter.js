var Twitter = require("twitter");

var t = new Twitter({
    consumer_key: "3geFIdem5d4MWmZ62DH4IhbhQ",
    consumer_secret: "Yw9ukzXOKEZXdx4m5466YnppbmtskbpM0ZZtufZyW46UMwLkXB",
    access_token_key: "381340321-SN2w6Kl0e3JnzB7p3FBw8IzUXgCPpxdogiYF5DkV",
    access_token_secret: "IjdoRGN4n2mDvCnpkEh2Kus0CgcGFMCG9ciHGT2hSsjXd"
});

function getTwitter(keyword, long, lat, radi) {
    t.get('search/tweets', {q: "\""+keyword+"\"", count: 10, location: lat+","+long+","+radi+"km", result_type: "recent"}, function(err, tweets, response) {
      var batchInput = [];
      for (var i = 0; i < tweets.statuses.length; i++) {
          batchInput.push(tweets.statuses[i].text);
      }
      console.log(batchInput);
      return batchInput;
    });
  }

module.exports = getTwitter;
