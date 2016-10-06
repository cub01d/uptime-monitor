var express = require('express');
var app = express();
// var fs = require('fs');
// var logger = require('morgan');
var sqlite3 = require('sqlite3').verbose();

var status = 'OFFLINE';
var time = 0;

// db setup:
// create db
var db = new sqlite3.Database('corona.db');
db.serialize(function() {
	db.run('CREATE TABLE IF NOT EXISTS corona (timestamp int, date text)');
	// unix time, YYYY-MM-DD date
});


// http post: save into database
app.post('/', function(req, res) {
	var timestamp = Date.now();
	time = timestamp;
	var date = new Date(timestamp).toJSON().substring(0,10);
	db.serialize(function() {
		db.run('INSERT INTO corona VALUES (?, ?)', timestamp, date); 
	});

	res.sendStatus(204);
});

// http get: if >5 minutes since last post, plaintext:
// corona is OFFLINE
// else
// corona is ONLINE
//
// TODO: followed by neat color coded table
app.get('/', function(req, res) {
	// check if host is online
	db.serialize(function() {
		db.get('SELECT timestamp FROM corona ORDER BY timestamp DESC LIMIT 1', function(err, row) {
			var now = Date.now();
			time = row['timestamp'];
			if (now-time>300000) {
				status = 'OFFLINE';
			} else {
				status = 'ONLINE';
			}

		});
	});
	var latest = new Date(time).toString();

	res.send('corona is ' + status + '<br>last online: ' + latest);
})

app.listen(3000, function() {
	console.log('Listening on port 3000!');

});