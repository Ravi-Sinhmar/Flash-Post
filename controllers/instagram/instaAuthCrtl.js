const axios = require("axios");
const FormData = require("form-data");
const User = require("../../models/instagram/userInstaModel");
const {
  forceTokenRefresh,
} = require("./../../utils/instagram/singleTokenRefresh");

// Constants
const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID;
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
const INSTAGRAM_REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI;
const INSTAGRAM_GRAPH_BASE_URL = process.env.INSTAGRAM_GRAPH_BASE_URL;
const INSTAGRAM_SCOPES = process.env.INSTAGRAM_SCOPES;

// Urls
const authUrl = `https://api.instagram.com/oauth/authorize?app_id=${INSTAGRAM_APP_ID}&redirect_uri=${INSTAGRAM_REDIRECT_URI}&scope=${INSTAGRAM_SCOPES}&response_type=code`;

exports.auth = async (req, res) => {
  try {
    const response = await axios.get(authUrl);
    res.redirect(authUrl);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .send("An error occurred while making the GET request to the auth URL.");
  }
};

exports.callback = async (req, res) => {
  const authCode = req.query.code;
  if (!authCode) {
    return res.status(400).send("Authorization code is missing.");
  }

  try {
    console.log("Authorization code:", authCode);

    // Exchange code for short-lived access token
    const formData = new FormData();
    formData.append("client_id", INSTAGRAM_APP_ID);
    formData.append("client_secret", INSTAGRAM_APP_SECRET);
    formData.append("grant_type", "authorization_code");
    formData.append("redirect_uri", INSTAGRAM_REDIRECT_URI);
    formData.append("code", authCode);

    const tokenResponse = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    const shortLivedAccessToken = tokenResponse.data.access_token;
    const userId = tokenResponse.data.user_id;
    console.log("Shorlive", shortLivedAccessToken);

    // Exchange short-lived token for long-lived token
    const longLivedTokenResponse = await axios.get(
      "https://graph.instagram.com/access_token",
      {
        params: {
          grant_type: "ig_exchange_token",
          client_secret: INSTAGRAM_APP_SECRET,
          access_token: shortLivedAccessToken,
        },
      }
    );

    const longLivedAccessToken = longLivedTokenResponse.data.access_token;
    // Fetch user details using the long-lived token
    const userResponse = await axios.get(`${INSTAGRAM_GRAPH_BASE_URL}/me`, {
      params: {
        fields: "id,username,media_count,account_type",
        access_token: longLivedAccessToken,
      },
    });

    // Check if user already exists in the database
    const result = await User.findOne({ uid: userId });
    if (result) {
      result.accessToken = longLivedAccessToken;
      result.media_count = userResponse.data.media_count;
      result.mediaId = userResponse.data.id;
      result.username = userResponse.data.username;
      result.lastRefresh = new Date(); // Update last refresh timestamp
      await result.save();
      return res.status(200).json({
        success: true,
        message: "User Already Exists, Token Updated",
        data: result,
      });
    }

    // Save new user to the database
    const user = new User({
      username: userResponse.data.username,
      uid: userId,
      mediaId: userResponse.data.id,
      accessToken: longLivedAccessToken,
      media_count: userResponse.data.media_count,
      permissions: tokenResponse.data.permissions || [], // Add permissions if available
    });

    const newUser = await user.save();
    if (newUser._id) {
      console.log("User Successfully Logged In");
    }

    res.status(200).json({
      success: true,
      message: "New User Created",
      data: newUser,
    });
  } catch (error) {
    console.error(
      "Error fetching Instagram data:",
      error.response?.data || error.message
    );
    res.status(500).send("Error fetching Instagram data");
  }
};

exports.revoke = async (req, res) => {
  const uid = req.query.uid;
  if (!uid) {
    return res.send("Plesea Provide uid as query");
  }
  console.log("uid", uid);
  const user = await User.findOne({ uid: uid });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not Found",
      data: null,
    });
  }

  user.isRevoked = true;
  await user.save();
  res.status(200).json({
    success: true,
    message: "User token revoked Successfully",
    data: {
      username: user.username,
      isRevoked: user.isRevoked,
    },
  });
};

exports.reinstate = async (req, res) => {
  const uid = req.query.uid;
  if (!uid) {
    return res.send("Plesea Provide uid as query");
  }
  console.log("uid", uid);
  const user = await User.findOne({ uid: uid });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not Found",
      data: null,
    });
  }

  user.isRevoked = false;
  await user.save();
  res.status(200).json({
    success: true,
    message: "User token ReInstate Successfully",
    data: {
      username: user.username,
      isRevoked: user.isRevoked,
    },
  });
};

exports.tokenRefresh = async (req, res) => {
  try {
    const uid = req.query.uid;
    if (!uid) {
      return res.send("Provide uid in query");
    }
    const user = await User.findOne({ uid: uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not Found",
        data: null,
      });
    }

    if (user.isTokenOlderEnough) {
      const prevToken = user.accessToken;
      await forceTokenRefresh(user);
      const success =  prevToken !== user.accessToken;
      if (success) {
        res.status(200).json({
          success: true,
          message: "Token Refreshed Successfully",
          data: user.username,
        });
      }
    }else{
      res.status(400).json({
        success: false,
        message: "Token are new , no need to refresh",
        data: user.username,
      });
    }
  } catch (error) {
    console.log("Server error in refreshing tokens", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      data: error.message || error.response.message,
    });
  }
};
