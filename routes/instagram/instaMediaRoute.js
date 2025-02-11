const express = require("express");
const router = express.Router();
const instaMediaControllers = require("./../../controllers/instagram/instaMediaCrtl");

// Route : upload/
router.get("/instagram/profile",instaMediaControllers.profile);
router.get("/instagram/upload/photo", instaMediaControllers.uploadPhoto);
router.get("/instagram/upload/photos", instaMediaControllers.uploadPhotos);

module.exports = router;
