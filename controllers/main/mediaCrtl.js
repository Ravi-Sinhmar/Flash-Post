

const User = require("./../../models/main/User");

exports.profile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          data: null,
        });
      }
  
      res.status(200).json({
        success: true,
        message: "User Found and Login",
        data: user,
      });
    } catch (error) {}
  };