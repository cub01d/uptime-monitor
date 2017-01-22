var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var sqlite3 = require('sqlite3').verbose();
var twilioNotifications = require('./twilioNotifications');
var logger = require('morgan');
var config = require('./config');
// var crypt = require('./crypt')
//==============================================================================

var status = 'OFFLINE';
var latest = '';
var time = 0;
var checkTimer;
var notifyTimer;

// db setup:
// create db
var db = new sqlite3.Database('corona.db');
db.serialize(function() {
	db.run('CREATE TABLE IF NOT EXISTS corona (timestamp int, date text)');
	// unix time, YYYY-MM-DD date
});

// check status of host every polltime minutes and every HTTP-GET request
function checkHost() {
	console.log('checking host status');
	db.serialize(function() {
		db.get('SELECT timestamp FROM corona ORDER BY timestamp DESC LIMIT 1', function(err, row) {
			try {
				var now = Date.now();
				time = row['timestamp'];
				if (now-time>300000) {
					status = 'OFFLINE';
				} else {
					status = 'ONLINE';
				}
				console.log('now: ' + now + '\ntime: '+time+'\ndiff: ', now-time);
			}
			catch (err) {
				console.log('error in retrieving timestamp from db');
			}
		});
	});
	latest = new Date(time).toString();
}
// check every polltime minutes
var polltime = 2;
polltime *= 60000;
checkTimer = setInterval(checkHost, polltime);

// http post: save into database
app.post('/', function(req, res) {
	console.log('req.body: \n' + req.body);
	// idea: generate random(?) message. encrypt message with corona's pubkey. 
	// if decrypted message is the same as random message sent, then user is 
	// in fact verified. 

	// if(crypt.validMessage(req.body)) {
		var timestamp = Date.now();
		time = timestamp;
		var date = new Date(timestamp).toJSON().substring(0,10);
		db.serialize(function() {
			db.run('INSERT INTO corona VALUES (?, ?)', timestamp, date); 
		});
		res.sendStatus(204);

		console.log('notifyTimer reset');
		clearTimeout(notifyTimer);
		notifyTimer = setTimeout(function() {
			console.log('notifyTimer set');
			// send text message
			var message = "corona is offline. last online: "+ latest;
			twilioNotifications.notify(message, req, res);
		}, polltime);
	// }
});


// displays status of host
app.get('/', function(req, res) {
	checkHost();
	res.send('corona is ' + status + '<br>last online: ' + latest);

	// //test send text
	// var message = "corona is offline. last online: "+ latest;
	// twilioNotifications.notify(message, req, res);
})

app.listen(3000, function() {
	console.log('Listening on port 3000!');
});

//log to console
app.use(logger('dev'));
// app.use('body-parser');
app.use(twilioNotifications.notify);