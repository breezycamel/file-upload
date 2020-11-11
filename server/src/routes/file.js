const route = require('express').Router();
const Access = require('../models/Access');
const mongoose = require('mongoose');
const connection = mongoose.connection;

const auth0 = require('../middleware/authenticate');
const	authenticate = [auth0.checkJwt, auth0.getUserId];

//Connect to database
const uri = process.env.URI;
mongoose.connect(uri, {useNewUrlParser: true});
let gfs;
connection.once('open', function() {
	console.log('db connection established');
	gfs = new mongoose.mongo.GridFSBucket(connection.db, {
		bucketName: "uploads"
	});
});

route.get('/public', (req, res) => {
	Access.find({user:['public']}, (err, accesses) => {
		console.log(accesses);
	});
});

route.get('/shared', authenticate, (req, res) => {
	
});

route.get('/private', authenticate, (req, res) => {
	
});

route.post('/addaccess', authenticate, (req, res) => {
	Access.findOne({file_id: req.body.file_id}, (err, access) => {
		if(access == null) return res.status(400).json({message: "File not found"});

		if(!access.user.includes(req.body.user_id)){
			access.user.push();
			access.save();
		}
		return res.status(200).json({message: "Success"});
	});
});

route.post('/removeaccess', authenticate, (req, res) => {
	Access.findOne({file_id: req.body.file_id}, (err, access) => {
		if(access == null) return res.status(400).json({message: "File not found"});

		const index = access.user.indexOf(req.body.user_id);
		if(index >= 0){
			access.user.splice(index,1);
			access.save();
		}
		return res.status(200).json({message: "Success"});
	});
});

module.exports = route;