// app.js
var express = require('express');
var app = express();

var LoggingController = require('./controllers/LoggingController');
app.use('/api/', LoggingController);
app.use(express.static('html'));

module.exports = app;