const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccessSchema = new Schema({
	file_id: { type: String, required: true, index: { unique: true } },
	file_name: {type: String, required: true},
	uploadDate: {type: Date, required: true},
	owner: {type: String, required: true},
	user: {type: [String], required: true}
});

module.exports = mongoose.model('Access', AccessSchema);