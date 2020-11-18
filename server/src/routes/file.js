const route = require('express').Router();
const Access = require('../models/Access');
const mongoose = require('mongoose');
const connection = mongoose.connection;

const auth0 = require('../middleware/authenticate');
const	authenticate = [auth0.checkJwt, auth0.handleError, auth0.getUserId];

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

//Get a file by id
route.get("/download/:file_id", authenticate, (req, res) => {
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

route.get('/public', async (req, res) => {
	return  res.json(await Access.find({user :'public'}));
});

route.get('/shared', authenticate, async (req, res) => {
	return  res.json(await Access.find({user : req.email}));
});

route.get('/private', authenticate, async (req, res) => {
	return res.json(await Access.find({owner: req.email}));
});

//Handle adding a user's access to a file
route.post('/addaccess', authenticate, (req, res) => {
	Access.findOne({file_id: req.body.file_id}, async (err, access) => {
		if(access == null) return res.status(400).json({message: "File not found"});
		
		if(!access.user.includes(req.body.user_id)){
			access.user.push(req.body.user_id);
			await access.save();
		}
		const files = await Access.find({owner : req.email});
		return res.json(files);
	});
});

//Handle removing a user's access to a file
route.post('/removeaccess', authenticate, (req, res) => {
	Access.findOne({file_id: req.body.file_id}, async (err, access) => {
		if(access == null) return res.status(400).json({message: "File not found"});
		if(access.owner != req.email) return res.status(401);

		const index = access.user.indexOf(req.body.user_id);
		if(index >= 0){
			access.user.splice(index,1);
			await access.save();
		}

		const files = await Access.find({owner : req.email});
		return res.json(files);
	});
});

//Handle file delete
route.post('/delete', authenticate , (req, res) => {
	const id = mongoose.mongo.ObjectId(req.body.file_id);
	console.log(id);

	Access.findOne({file_id: req.body.file_id}, async (err, access) => {
		if(access == null) return res.status(400).json({message: "File not found"});
		if(access.owner != req.email) return res.status(401);

		await Access.deleteOne({file_id: req.body.file_id});
		await gfs.delete(id);

		const files = await Access.find({owner : req.email});
		return res.json(files);
	});
});

module.exports = route;