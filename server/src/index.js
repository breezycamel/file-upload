const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

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
app.use('/upload', require('./routes/upload'));
app.use('/file', require('./routes/file'));

const port = process.env.PORT || 8000;
app.listen(port, () => {
	console.log(`Listening at http://localhost:8000`);
});
