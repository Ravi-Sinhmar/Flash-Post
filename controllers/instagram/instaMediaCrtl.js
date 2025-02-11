const axios = require("axios");
const User = require("../../models/instagram/userInstaModel");

exports.profile = async (req, res) => {
  try {
    console.log("hi request hit");

    // Extract `uid` properly
    const { uid } = req.query;
    console.log("Extracted UID:", uid);

    if (!uid) {
      return res.status(400).json({ success: false, message: "UID is required" });
    }

    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (e) {
    console.error("Error in getting Profile:", e);
    res.status(500).json({
      success: false,
      message: "Server Error in Getting Profile",
    });
  }
};

exports.uploadPhoto = async (req, res) => {
  try {
    console.log("Hit request at /upload/photo");
    const username = "bloody.founder";
    const user = await User.findOne({ username });
    console.log(user);
    const mediaId = user.mediaId;
    const at = user.accessToken;
    console.log(mediaId);
    console.log(at);
    const url = `https://graph.instagram.com/${mediaId}/media`;
    const data = {
      image_url:
        "https://media.istockphoto.com/id/499517325/photo/a-man-speaking-at-a-business-conference.jpg?s=612x612&w=0&k=20&c=gWTTDs_Hl6AEGOunoQ2LsjrcTJkknf9G8BGqsywyEtE=",
      access_token: at,
      caption: "Test Caption",
    };

    const response = await axios.post(url, data, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Media ID:", response.data.id);
    const data2 = {
      creation_id: response.data.id,
      access_token: at,
    };

    const url2 = `https://graph.instagram.com/${mediaId}/media_publish`;

    const response2 = await axios.post(url2, data2, {
      headers: { "Content-Type": "application/json" },
    });

    user.media_count = user.media_count + 1;
    await user.save();
    res.send(`Media ID: ${response.data.id}, FinalId : ${response2.data.id}`);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("An error occurred while uploading the image.");
  }
};

exports.uploadPhotos = async (req, res) => {
  try {
    const username = "bloody.founder";
    const user = await User.findOne({ username });
    console.log(user);

    const mediaId = user.mediaId;
    const at = user.accessToken;
    const url = `https://graph.instagram.com/${mediaId}/media`;
    const data = {
      image_url:
        "https://media.istockphoto.com/id/499517325/photo/a-man-speaking-at-a-business-conference.jpg?s=612x612&w=0&k=20&c=gWTTDs_Hl6AEGOunoQ2LsjrcTJkknf9G8BGqsywyEtE=",
      access_token: at,
      is_carousel_item: true,
    };

    const post1 = await axios.post(url, data, {
      headers: { "Content-Type": "application/json" },
    });
    const post2 = await axios.post(url, data, {
      headers: { "Content-Type": "application/json" },
    });
    const post3 = await axios.post(url, data, {
      headers: { "Content-Type": "application/json" },
    });

    const url2 = `https://graph.instagram.com/${mediaId}/media`;
    const data2 = {
      caption: "These are carousel posts",
      media_type: "CAROUSEL",
      access_token: at,
      children: `${post1.data.id},${post2.data.id},${post3.data.id}`,
    };

    const response2 = await axios.post(url2, data2, {
      headers: { "Content-Type": "application/json" },
    });

    const url3 = `https://graph.instagram.com/${mediaId}/media_publish`;
    const data3 = {
      creation_id: response2.data.id,
      access_token: at,
    };
    const response3 = await axios.post(url3, data3, {
      headers: { "Content-Type": "application/json" },
    });

    user.media_count = user.media_count + 1;
    res.send(`FinalId: ${response3.data.id}`);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("An error occurred while uploading the carousel.");
  }
};
