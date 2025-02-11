const express = require("express");
const cookieParser = require('cookie-parser');
const session = require("express-session");
const passport = require("passport");
const User = require("./models/instagram/userInstaModel");
const { faceAuthRoute } = require("./routes/facebook/faceAuthRoute");
const faceMediaRoute = require("./routes/facebook/faceMediaRoute");
const instaAuthRoutes = require("./routes/instagram/instaAuthRoute");
const instaMediaRoutes = require("./routes/instagram/instaMediaRoute");
const authRoute = require('./routes/main/authRoute');
const mediaRoute = require('./routes/main/mediaRoute');


const app = express();

// Middleware
// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
require("./config/passport");

// Routes
app.use("/",authRoute);
app.use("/",mediaRoute);
app.use("/", faceAuthRoute);
app.use("/", faceMediaRoute);
app.use("/", instaAuthRoutes);
app.use("/", instaMediaRoutes);


// Home route
app.get("/", (req, res) => {
  res.send(`
    <a href='/auth/facebook'>Login with Facebook</a><br>
    <a href='/auth/instagram'>Login with Instagram</a>
  `);
});



module.exports = app;
