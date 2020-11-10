const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config();
const secret = process.env.SECRET;

const UserSchema = new Schema({
    email: { type: String, required: true, index: { unique: true } },
});

module.exports = mongoose.model('User', UserSchema);