var express = require('express');
var api = require('./api.js');
var util = require('util');
var app = express();

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
