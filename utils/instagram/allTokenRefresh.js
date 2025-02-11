const User = require("../../models/instagram/userInstaModel");
const cron = require("node-cron");
const { RateLimiter } = require("limiter");
const { refreshTokenIfNeed, forceTokenRefresh } = require('./singleTokenRefresh');
const mongoose = require('mongoose'); // Import mongoose

// Rate limiting setup
const limiter = new RateLimiter({
  tokensPerInterval: 10,
  interval: "second",
});

// Flag to track if tokens have been refreshed on server startup
let tokensRefreshedOnStartup = false;

const allTokenRefresh = async () => {
  try {
    const users = await User.find({});
    for (const user of users) {
      await limiter.removeTokens(1);
      await refreshTokenIfNeed(user);
    }
  } catch (error) {
    console.error("Error refreshing all tokens:", error);
  }
};

const forceAllTokenRefresh = async () => {
  try {
    const users = await User.find({});
    for (const user of users) {
      await limiter.removeTokens(1);
      await forceTokenRefresh(user);
    }
  } catch (error) {
    console.error("Error refreshing all tokens:", error);
  }
};

// Function to refresh tokens on server startup
const refreshTokensOnStartup = async () => {
  if (!tokensRefreshedOnStartup) {
    console.log("Server started. Refreshing all tokens once...");
    await forceAllTokenRefresh();
    tokensRefreshedOnStartup = true; // Set the flag to true after refreshing
  }
};

// Schedule the token refresh task to run every 10 days at midnight (00:00)
cron.schedule("0 0 */10 * *", () => {
  console.log("Running scheduled token refresh task...");
  allTokenRefresh();
});

module.exports = {allTokenRefresh , refreshTokensOnStartup};