const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phone: { type: String, required: true },
    username: String,
    password: String,
    role: { type: [String], enum: ['ADMIN', 'AGENT', 'SELLER', 'BUYER', 'INVESTOR'] },
    createddate: { type: Date, default: Date.now()}
});

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;