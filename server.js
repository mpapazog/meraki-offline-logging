// server.js 
var app = require('./app');
var Time = require('./models/Time');
var port = process.env.PORT || 8000;

var server = app.listen(port, function() {
    console.log(Time.currentTimestamp() + ' Listening on port ' + port);
});