const express = require("express");
const router = express.Router();
const faceMediaCrtl = require('./../../controllers/facebook/faceMediaCrtl')

// Imports Custom Modules
const { isLoggedIn } = require("./faceAuthRoute");

router.get("/facebook/me", isLoggedIn, faceMediaCrtl.profile);
router.get("/facebook/me/pages", isLoggedIn, faceMediaCrtl.pages);
router.get("/facebook/upload/text", isLoggedIn, faceMediaCrtl.textPost);
router.get("/facebook/upload/photo", isLoggedIn, faceMediaCrtl.photoPost);
router.get("/facebook/posts", isLoggedIn, faceMediaCrtl.myPosts);
router.get("/facebook/posts/:postId", isLoggedIn, faceMediaCrtl.specificPost);


module.exports = router;
