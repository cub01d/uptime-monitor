var twilioClient = require('./client');
var users = require('./users.json');

exports.notify = function(message, request, response) {
	users.forEach(function(user) {
		console.log(user.phoneNumber);
		twilioClient.sendSms(user.phoneNumber, message);
  });
};