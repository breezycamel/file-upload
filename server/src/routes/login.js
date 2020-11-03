const route = require('express').Router();
const User = require('../models/User.js');

//Handle user login
route.post('/', (req, res) => {
	const username = req.body.payload.username;
	const password = req.body.payload.password;
	console.log(req.body);
	User.findOne({ username: username }, function(err, user) {
		
		//Handle user not found
		if(!user) return res.send("Incorrect username or password");
		
		//Check if password is correct
		user.comparePassword(password, function(err, isMatch) {
			if(isMatch) return res.json(user.toAuthJSON());
			else return res.send("Incorrect username or password");
		});
	});
});

module.exports = route;