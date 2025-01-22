const mongoose = require('mongoose');
//Defining user schema
const userSchema = new mongoose.Schema({
username: { type: String, required: true, unique: true },
password: { type: String, required: true }
});
//Exporting Schema as a model
module.exports = mongoose.model('User', userSchema);
