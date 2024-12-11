const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.static('public'));

app.use('/styles', express.static(__dirname + '/public/styles'));
app.use('/scripts', express.static(__dirname + '/public/scripts'));
app.use('/img', express.static(__dirname + '/public/img'));

var server = app.listen(port, function() {
    console.log(`Server is running on port ${port}`);
});