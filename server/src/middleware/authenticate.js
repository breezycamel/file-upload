const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
const axios = require('axios');

//Middleware for authenticating requests and getting user email from access token
module.exports = {
	checkJwt : jwt({
		// Dynamically provide a signing key
		// based on the kid in the header and 
		// the signing keys provided by the JWKS endpoint.
		secret: jwksRsa.expressJwtSecret({
			cache: true,
			rateLimit: true,
			jwksRequestsPerMinute: 5,
			jwksUri: `https://dev-kz08advs.us.auth0.com/.well-known/jwks.json`
		}),

		// Validate the audience and the issuer.
		audience: 'https://localhost:8000',
		issuer: `https://dev-kz08advs.us.auth0.com/`,
		algorithms: ['RS256']
	}),

	getUserId : async (req, res, next) => {
		console.log("Success");
		
		const user = await axios({
			method: 'get',
			url: 'https://dev-kz08advs.us.auth0.com/userinfo',
			headers: {
				'Access-Control-Allow-Origin': true,
				'Authorization': req.headers.authorization
			}
		});
		req.email = user.data.email;
		next();
	}
};