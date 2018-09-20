const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    username: String,
    password: String,
    role: { type: [String], enum: ['ADMIN', 'AGENT', 'SELLER', 'BUYER', 'INVESTOR'] },
    createddate: { type: Date, default: Date.now()},
    loginfailurecount: { type: Number, default: 0 },
    status: { type: Boolean, default: false }
});

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;