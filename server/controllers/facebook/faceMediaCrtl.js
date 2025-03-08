const User = require("./../../models/facebook/userFaceModel");
const axios = require("axios");

// Profile endpoint
exports.profile = (req, res) => {
  res.json({
    status: true,
    data: req.user,
  });
};

// Pages endpoint
exports.pages = async (req, res) => {
  const accessToken = req.user.accessToken;
  console.log("Retrieved Access Token (in /pages endpoint): ", accessToken);

  const url = `https://graph.facebook.com/me/accounts`;

  try {
    // Fetch pages using axios
    const response = await axios.get(url, {
      params: {
        access_token: accessToken,
      },
    });

    const body = response.data;

    if (!body.data || body.data.length === 0) {
      return res.status(404).json({ status: false, message: "No pages found" });
    }

    console.log("Pages:", body);

    const pageDetails = {
      pageId: body.data[0].id,
      pageName: body.data[0].name,
      pageAccessToken: body.data[0].access_token,
      category: body.data[0].category,
    };

    console.log("Page Details:", pageDetails);

    // Find the user in the database
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Check if the page already exists in the user's pageDetails array
    const pageExists = user.pageDetails.some((page) => page.pageId === pageDetails.pageId);
    if (pageExists) {
      return res.status(400).json({ status: false, message: "Page already exists" });
    }

    // Add the new page details to the array
    user.pageDetails.push(pageDetails);
    await user.save();

    console.log("Final User Saved:", user);
    res.json({
      status: true,
      message: "Page details saved successfully",
      finalUser: user,
    });
  } catch (err) {
    console.error("Error:", err.response ? err.response.data : err.message);
    res.status(500).json({
      status: false,
      message: "Error fetching or saving page details",
      error: err.message,
    });
  }
};

// Text Post endpoint
exports.textPost = async (req, res) => {
  try {
    const accessToken = req.user.pageDetails[0].pageAccessToken; // Corrected field name
    const pageId = req.user.pageDetails[0].pageId;
    const url = `https://graph.facebook.com/${pageId}/feed`;
    const data = {
      message: "This is a Text Post by Ravi Sinhmar",
      published: true,
      access_token: accessToken,
    };
    const response = await axios.post(url, data, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Response is:", response.data);
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, message: "An error occurred while uploading the text post.", error: error.message });
  }
};

// Photo Post endpoint
exports.photoPost = async (req, res) => {
  try {
    const accessToken = req.user.pageDetails[0].pageAccessToken; // Corrected field name
    const pageId = req.user.pageDetails[0].pageId;
    const url = `https://graph.facebook.com/${pageId}/photos`;
    const data = {
      url: "https://media.istockphoto.com/id/499517325/photo/a-man-speaking-at-a-business-conference.jpg?s=612x612&w=0&k=20&c=gWTTDs_Hl6AEGOunoQ2LsjrcTJkknf9G8BGqsywyEtE=",
      message: "This is Photo",
      link: "https://media.istockphoto.com/id/499517325/photo/a-man-speaking-at-a-business-conference.jpg?s=612x612&w=0&k=20&c=gWTTDs_Hl6AEGOunoQ2LsjrcTJkknf9G8BGqsywyEtE=",
      access_token: accessToken,
    };
    const response = await axios.post(url, data, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Response is:", response.data);
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, message: "An error occurred while uploading the photo post.", error: error.message });
  }
};

// My Posts endpoint
exports.myPosts = async (req, res) => {
  try {
    const accessToken = req.user.pageDetails[0].pageAccessToken; // Corrected field name
    const pageId = req.user.pageDetails[0].pageId;
    const url = `https://graph.facebook.com/${pageId}/feed`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Response is:", response.data);
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, message: "An error occurred while fetching the posts.", error: error.message });
  }
};

// Specific Post endpoint
exports.specificPost = async (req, res) => {
  try {
    const accessToken = req.user.pageDetails[0].pageAccessToken; // Corrected field name
    const postId = req.params.postId;
    const url = `https://graph.facebook.com/${postId}`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Response is:", response.data);
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, message: "An error occurred while fetching the post.", error: error.message });
  }
};