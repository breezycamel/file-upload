const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const connection = mongoose.connection;
const User = require('./models/User.js');
require('dotenv').config();

const uri = process.env.URI;
mongoose.connect(uri, {useNewUrlParser: true});
const app  = express();
app.use(cors());

//var testUser = new User({
//	username: 'pppp',
//	password: '123456'
//});
//testUser.save();

User.findOne({ username: 'pppp' }, function(err, user) {
    if (err) throw err;
    // test a matching password
    user.comparePassword('123456', function(err, isMatch) {
        if (err) throw err;
        console.log('123456:', isMatch); // -> Password123: true
    });

    // test a failing password
    user.comparePassword('123Password', function(err, isMatch) {
        if (err) throw err;
		console.log('123Password:', isMatch); // -> 123Password: false
	});
});

let gfs;
connection.once('open', function() {
	console.log('db connection established');
	gfs = new mongoose.mongo.GridFSBucket(connection.db, {
		bucketName: "uploads"
	});
});

const storage = new GridFsStorage({
	url: uri,
	file: (req, file) => {
	  return new Promise((resolve, reject) => {
		  const fileInfo = {
			filename: file.originalname,
			bucketName: "uploads"
		  };
		  resolve(fileInfo);
	  });
	}
});

const upload = multer({
	storage
});

app.use(bodyParser.json());

app.post('/upload', upload.single("file"), (req, res) => {
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

app.post('/delete', (req, res) => {
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

app.get("/files", (req, res) => {
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

app.get("/files/:file_id/:filename", (req, res) => {
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



