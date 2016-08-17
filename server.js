var express = require('express');
var bodyparser = require('body-parser');
var api = require('./api.js');
var util = require('util');
var app = express();


app.use(bodyparser.json());


var port = 8000;

app.use('/api', api);

app.set('port', process.env.PORT || port);
app.use(express.static(__dirname + "/public"));
app.use('/*', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

app.listen(port, function() {
    console.log('listening on port: '+ port);
});

//////////////////////////////////////////////////////////////////////////////////////////////////
