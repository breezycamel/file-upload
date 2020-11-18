const route = require('express').Router();
const mongoose = require('mongoose');

const connection = mongoose.connection;
const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer');
const Access = require('../models/Access');
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
				filename: file.originalname,
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
route.post('/', [authenticate[0],authenticate[1], upload.single("file")], async (req, res) => {
	console.log(req.file);
	const access = new Access({
		file_id: req.file.id, 
		file_name: req.file.originalname, 
		owner: req.email, 
		uploadDate: req.file.uploadDate,
		user: []}
	);
	access.save();

	if(!gfs){
		return res.status(404).json({
			err: "db not connected"
		});
	}
	
	return res.json(await Access.find({owner : req.email}));
});

module.exports = route;