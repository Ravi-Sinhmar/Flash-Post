const User = require("./../../models/main/User");
const TempUser = require("./../../models/main/TempUser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendOTP = require("./../../utils/main/sendOtp");

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register user and send OTP
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists in the main collection
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if user already exists in the temporary collection
    const existingTempUser = await TempUser.findOne({ email });
    if (existingTempUser) {
      await TempUser.deleteOne({ email }); // Delete old temporary data
    }

    // Generate OTP
    const otp = generateOTP();

    // Create temporary user
    const tempUser = new TempUser({ name, email, password, otp });
    await tempUser.save();

    // Send OTP to email
    try {
      await sendOTP(email, otp);
      res.status(201).json({ message: "OTP sent to your email" });
    } catch (err) {
      // If OTP sending fails, delete the temporary user
      await TempUser.deleteOne({ email });
      res
        .status(500)
        .json({ message: "Failed to send OTP", error: err.message });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Verify OTP and create JWT
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find the temporary user
    const tempUser = await TempUser.findOne({ email, otp });
    if (!tempUser) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Move the user to the main collection
    const user = new User({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
    });
    await user.save();

    // Delete the temporary user
    await TempUser.deleteOne({ email });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set token in cookie
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

    res.status(200).json({ message: "OTP verified and user logged in", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.query;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
    });

    res.status(200).json({ message: "Logged in successfully", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Forgot password - Send OTP
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const prevTempUser = await TempUser.findOne({ email });
    if (prevTempUser) {
      await TempUser.deleteOne({ email });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP to user document
    // Create temporary user
    const tempUser = new TempUser({ email, otp });
    await tempUser.save();

    // Send OTP to email
    try {
      await sendOTP(email, otp);
      res.status(200).json({ message: "OTP sent to your email" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to send OTP", error: err.message });
    }
  } catch (err) {
    // If OTP sending fails, delete the temporary user
    await TempUser.deleteOne({ email });
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Reset password - Verify OTP and update password
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Check if user exists
    const tempUser = await TempUser.findOne({ email, otp });
    if (!tempUser) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email });
    // Update password and clear OTP
    user.password = newPassword;
    await user.save();

    // Delete the temporary user
    await TempUser.deleteOne({ email });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    // If OTP sending fails, delete the temporary user
    await TempUser.deleteOne({ email });
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


