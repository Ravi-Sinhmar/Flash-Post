const express = require("express");
const router = express.Router();
const instaAuthControllers = require('./../../controllers/instagram/instaAuthCrtl');

// Route : auth/instagram
router.get("/auth/instagram",instaAuthControllers.auth);
router.get("/auth/instagram/callback/", instaAuthControllers.callback);
router.get("/instagram/revoke", instaAuthControllers.revoke);
router.get("/instagram/reinstate", instaAuthControllers.reinstate);
router.get("/instagram/refresh", instaAuthControllers.tokenRefresh);

module.exports = router;
