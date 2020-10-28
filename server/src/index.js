const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const connection = mongoose.connection;

const uri = process.env.URI;
mongoose.connect(uri, {useNewUrlParser: true});
const app  = express();
app.use(cors());

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

app.get("/files/:filename", (req, res) => {
	console.log(req.params);
	const file = gfs.find({filename: req.params.filename});
	if(!file || file.length === 0){
		return res.status(404).json({
			err: "no files exist"
		});
	}
	gfs.openDownloadStreamByName(req.params.filename).pipe(res);
});



const port = process.env.PORT || 8000;
app.listen(port, () => {
	console.log(`Listening at http://localhost:8000`);
});



