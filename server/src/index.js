const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const authenicateJWT = require('./routes/authenticate');
const connection = mongoose.connection;
require('dotenv').config();
const app  = express();

//Middlewares
app.use(cors());
app.use(bodyParser.json());

//Router
app.use('/login', require('./routes/login'));

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
			user: req.user
		  };
		  resolve(fileInfo);
	  });
	}
});
const upload = multer({
	storage
});


//Handle file upload
app.post('/upload', [authenicateJWT, upload.single("file")], (req, res) => {
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

//Handle file delete
app.post('/delete', authenicateJWT ,(req, res) => {
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
app.get("/files", authenicateJWT, (req, res) => {
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
app.get("/files/:file_id/:filename", authenicateJWT, (req, res) => {
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



