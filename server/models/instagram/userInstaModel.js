const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  uid: { type: String, unique: true }, // Instagram user ID
  mediaId: { type: String }, // To post Data
  accessToken: { type: String }, // Access token for Instagram
  media_count: { type: Number },
  permissions: { type: Array },
  isRevoked: { type: Boolean, default: false },
  lastRefresh: { type: Date, default: Date.now }, // Stores the last refresh time
});

// Function to check if token needs refresh (older than 20 days)
UserSchema.methods.needsTokenRefresh = function () {
  const now = new Date();
  const diffDays = (now - this.lastRefresh) / (1000 * 60 * 60 * 24); // Convert ms to days
  return diffDays >= 20; // Return true if 20 days have passed
};

// Function to check if token is older than 25 hours
UserSchema.methods.isTokenOlderEnough = function () {
  const now = new Date();
  const diffHours = (now - this.lastRefresh) / (1000 * 60 * 60); // Convert ms to hours
  return diffHours >= 25; // Return true if 25 hours have passed
};

module.exports = mongoose.model('last', UserSchema);