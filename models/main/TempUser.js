const mongoose = require('mongoose');

const tempUserSchema = new mongoose.Schema({
    name: { type: String},
    email: { type: String, required: true, unique: true },
    password: { type: String },
    otp: { type: String },
    createdAt: { type: Date, default: Date.now, expires: 600 }, // Auto-delete after 10 minutes
});

module.exports = mongoose.model('TempUser1', tempUserSchema);
