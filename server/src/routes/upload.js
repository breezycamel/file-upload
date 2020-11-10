const route = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/User.js');
const connection = mongoose.connection;
const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer');
require('dotenv').config();

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

//File storage configuration
const storage = new GridFsStorage({
	url: uri,
	file: (req, file) => {
	
	  return new Promise((resolve, reject) => {
			const fileInfo = {
			filename: req.email + ':' + file.originalname,
			bucketName: "uploads",
			};
		  resolve(fileInfo);
	  });
	}
});
const upload = multer({
	storage
});

//Middleware
const auth0 = require('../middleware/authenticate');
const	authenticate = [auth0.checkJwt, auth0.getUserId];

//Handle upload
route.post('/', [authenticate[0],authenticate[1], upload.single("file")], (req, res) => {
	if(!gfs){
		return res.status(404).json({
			err: "db not connected"
		});
	}
	gfs.find().toArray((err, files) => {
		// check if files	
		if (!files) {
		  return res.status(404).json({
			err: "no files exist"
		  });
		}
		return res.json(files);
	});
});

module.exports = route;