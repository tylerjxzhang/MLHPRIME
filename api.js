var express = require('express');
var router = express.Router();
var util = require('util');

router.get('/', function(req, res) {
    res.json("API RESPONSE");
});

module.exports = router;