const route = require('express').Router();
const User = require('../models/User.js');


route.get('/', (req, res) => {
	const username = req.body.payload.username;
	const password = req.body.payload.password;

	User.findOne({ username: username }, function(err, user) {
		if (err) throw err;
		user.comparePassword(password, function(err, isMatch) {
			if (err) throw err;
			if(isMatch) res.json(user.toAuthJSON());
		});
	});
});

module.exports = route;