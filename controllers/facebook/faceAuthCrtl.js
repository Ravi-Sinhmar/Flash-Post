const passport = require("passport");
const User = require('./../../models/facebook/userFaceModel');

exports.auth = passport.authenticate("facebook");
exports.callback = passport.authenticate("facebook", {
  successRedirect: "/profile",
  failureRedirect: "/",
});

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      res.send("Try Again");
    } else {
      res.send("Logout Success");
    }
  });
};

exports.revoke =  async(req,res)=>{
  const uid = req.user.uid;
 if(!uid){
  return res.send("Plesea Provide uid as query");
 }
 console.log('uid',uid);
  const user = await User.findOne({uid:uid});
  if(!user){
    return res.status(404).json({
      success : false, 
      message : "User not Found",
      data : null
    });
  }

  user.isRevoked = true;
    await user.save();
    res.status(200).json({
      success : true,
      message : "User token revoked Successfully",
      data : {
        username : user.username,
        isRevoked : user.isRevoked
      }

    })


}

exports.reinstate =  async(req,res)=>{
  const uid = req.user.uid;
 if(!uid){
  return res.send("Plesea Provide uid as query");
 }
 console.log('uid',uid);
  const user = await User.findOne({uid:uid});
  if(!user){
    return res.status(404).json({
      success : false, 
      message : "User not Found",
      data : null
    });
  }

  user.isRevoked = false;
    await user.save();
    res.status(200).json({
      success : true,
      message : "User token ReInstate Successfully",
      data : {
        username : user.username,
        isRevoked : user.isRevoked
      }

    })


}
