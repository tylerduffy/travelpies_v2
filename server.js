var express = require('express');

var app = express();

app.use(express.static('public'));

app.use('/styles', express.static(__dirname + '/public/styles'));
app.use('/scripts', express.static(__dirname + '/public/scripts'));
app.use('/img', express.static(__dirname + '/public/img'));

var server = app.listen(8081, function() {
    var port = server.address().port;
    console.log('Server started at http://localhost:%s', port);
});