var mongo = require('mongodb').MongoClient;
var imgsal = require('./app/service/imgsal.js');
var express = require('express');
var app = express();
var routing = require('./app/routing/routing.js');
var port = process.env.PORT || 8080;
var apiKey = '5655684-7d917774fc6331a4a31c06cc7';

app.use(express.static(__dirname + '/app/usageGuide'))

mongo.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/data', function(err, db) {
    if (err){ 
        throw err
    }
    imgsal(app, db, apiKey);    
});

routing(app);

app.listen(port);