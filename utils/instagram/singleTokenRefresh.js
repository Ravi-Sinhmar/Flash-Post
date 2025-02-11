const axios = require("axios");
const refreshTokenIfNeed = async (user) => {
    try {
      if (!user || !user.accessToken) {
        console.error("User or access token not found.");
        return;
      }
      if (user.needsTokenRefresh()) {
        const accessToken = user.accessToken;
        console.log("Previous Token for user", user.uid, ":", accessToken);
        const refreshResponse = await axios.get(
          "https://graph.instagram.com/refresh_access_token",
          {
            params: {
              grant_type: "ig_refresh_token",
              access_token: accessToken,
            },
          }
        );
        const newAccessToken = refreshResponse.data.access_token;
        user.accessToken = newAccessToken;
        user.lastRefresh = new Date(); 
        await user.save();
      } else {
        console.log("Token for user", user.uid, "is still valid");
      }
    } catch (error) {
      console.error(
        "Error refreshing token for user",
        user.uid,
        ":",
        error.response?.data || error.message
      );
    }
  };


  const forceTokenRefresh = async (user) => {
    try {
      if (!user || !user.accessToken) {
        console.error("User or access token not found.");
        return;
      }
          if(user.isTokenOlderEnough()){
        const accessToken = user.accessToken;
        console.log("Previous Token for user", user.uid, ":", accessToken);
        const refreshResponse = await axios.get(
          "https://graph.instagram.com/refresh_access_token",
          {
            params: {
              grant_type: "ig_refresh_token",
              access_token: accessToken,
            },
          }
        );
        const newAccessToken = refreshResponse.data.access_token;
        // const expiresIn = refreshResponse.data.expires_in; 
        // const expiresInDays = (expiresIn / 86400).toFixed(2); 
        user.accessToken = newAccessToken;
        user.lastRefresh = new Date(); 
        await user.save();
          }else{
            console.log("No need to Refresh token, Already New");
          }
    } catch (error) {
      console.error(
        "Error refreshing token for user",
        user.uid,
        ":",
        error.response?.data || error.message
      );
    }
  };

  

  module.exports = {refreshTokenIfNeed , forceTokenRefresh};