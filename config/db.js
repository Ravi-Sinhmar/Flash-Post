const mongoose = require('mongoose');
const {refreshTokensOnStartup} = require('./../utils/instagram/allTokenRefresh');
const connectToDatabaseWithRetry = async (retries = 5, delay = 5000) => {
  try {
    await mongoose.connect(process.env.REMOTE_DB_STR);
    console.log("Database connected successfully.");
    await refreshTokensOnStartup();
  } catch (error) {
    if (retries > 0) {
      console.error(`Database connection failed. Retrying in ${delay / 1000} seconds... (${retries} retries left)`);
      setTimeout(() => connectToDatabaseWithRetry(retries - 1, delay), delay);
    } else {
      console.error("Failed to connect to the database after multiple retries:", error);
    }
  }
};

// Connect to the database with retry logic
connectToDatabaseWithRetry();