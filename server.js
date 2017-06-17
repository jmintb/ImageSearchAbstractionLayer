var mongo = require('mongodb').MongoClient;
var imgsal = require('./app/imgsal.js');
var express = require('express');
var app = express();
var guide = require('./guide/guide.js');
var port = process.env.PORT || 8080;
var mongoUrl = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/data';
var apiKey = '5655684-7d917774fc6331a4a31c06cc7';

app.use(express.static(__dirname + '/guide'))
guide(app);

mongo.connect(mongoUrl, function(err, db) {
    if (err) throw err;

    imgsal(app, db, apiKey);
});

app.listen(port);