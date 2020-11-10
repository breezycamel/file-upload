const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const upload = require('./routes/upload.js')

const connection = mongoose.connection;
const axios = require('axios');
require('dotenv').config();
const app  = express();

//Middlewares
app.use(cors());
app.use(bodyParser.json());
const auth0 = require('./middleware/authenticate');
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

//Router
app.use('/upload', upload);

app.get('/authenticate', authenticate, async (req, res) =>  {
	console.log("Success");
	
	console.log(req.email);
	return res.status(200).json({message: 'success'});
});

//Handle file delete
app.post('/delete', authenticate ,(req, res) => {
	const x = mongoose.mongo.ObjectId(req.body.fileId);
	console.log(x);
	gfs.delete(x)
		.then(() => {
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
});

//Get all files
app.get("/files", authenticate, (req, res) => {
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

//Get a file by id
app.get("/files/:file_id/:filename", authenticate, (req, res) => {
	const file = gfs.find({_id: req.params.file_id});
	const x = mongoose.mongo.ObjectId(req.params.file_id);
	console.log(x);
	if(!file || file.length === 0){
		return res.status(404).json({
			err: "no files exist"
		});
	}
	gfs.openDownloadStream(x).pipe(res);
	res.setHeader('Content-Disposition', 'attachment');
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
	console.log(`Listening at http://localhost:8000`);
});