const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, unique: true },
  uid: { type: String, unique: true }, // Facebook user ID
  accessToken: { type: String, unique: true }, // Access token for both Facebook and Instagram
  isRevoked : { type : Boolean, default : false},
  pageDetails: [
    {
      pageId: { type: String, required: true }, // Page ID
      pageName: { type: String, required: true }, // Page ID
      pageAccessToken: { type: String, required: true }, // Page Access Token
      category:{ type: String }, // Page Access Token
    },
  ],
});

module.exports = mongoose.model('Facebook_Data_Final6', UserSchema);