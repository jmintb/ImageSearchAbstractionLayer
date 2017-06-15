var mongo = require('mongodb').MongoClient;
var imgsal = require('./app/imgsal.js');
var routing = require('.(/app/routing.js');
var app = require('express')();
var path = require('path');
var port = process.env.PORT || 8080;

app.use(express)