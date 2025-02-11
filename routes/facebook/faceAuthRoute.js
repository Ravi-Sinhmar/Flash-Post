const express = require("express");
const router = express.Router();
const faceAuthCrtl = require('./../../controllers/facebook/faceAuthCrtl');

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
};

// Routes : /auth
router.get("/auth/facebook", faceAuthCrtl.auth);
router.get("/auth/facebook/callback",faceAuthCrtl.callback);
router.get("/facebook/logout",isLoggedIn, faceAuthCrtl.logout);
router.get('/facebook/revoke', isLoggedIn, faceAuthCrtl.revoke);
router.get('/facebook/reinstate',isLoggedIn, faceAuthCrtl.reinstate);

module.exports = { faceAuthRoute : router, isLoggedIn };
