const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User.js');

//Middleware for authenticating requests
const authenicateJWT = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if(authHeader) {
		const token = authHeader.split(' ')[1];
		jwt.verify(token, process.env.SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
			}
			//console.log(user);
			//Check if user exist
			User.count({_id: user.id}, function (err, count){ 
				if(count>0){
					
					//Check if token is not expired
					const today = new Date();
					const exp = new Date(user.exp*1000);
					//console.log(today);
					//console.log(exp);
					if(today < exp) {
						req.user = user;
						next();
					}
					else res.status(401).send('Token expired');
				}
				else res.status(401).send('User does not exist');
			}); 
            
        });
	}
	else{
		res.sendStatus(401);
	}
}

module.exports = authenicateJWT;