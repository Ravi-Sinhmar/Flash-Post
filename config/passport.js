const passport = require("passport");
const User = require('../models/facebook/userFaceModel');
const FacebookStrategy = require("passport-facebook").Strategy;
const axios = require('axios');

passport.serializeUser((user, done) => {
    console.log("In serialize user");
    done(null, user._id);
    console.log("Serializing user", user._id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      console.log("In try of deserialize user");
      const user = await User.findById(id);
      done(null, user);
      console.log("Deserializing user", user);
    } catch (err) {
      console.log("In catch of deserialize user");
      done(err);
    }
  });


passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.Facebook_APP_ID,
      clientSecret: process.env.Facebook_APP_SECRET,
      callbackURL: process.env.Facebook_REDIRECT_URI,
      profileFields: ["id", "emails", "name"],
      scope: ["email", "pages_read_engagement", "pages_manage_posts"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ uid: profile.id });
        console.log("Facebook Access Token:", accessToken);
        console.log("Facebook Refresh Token:", refreshToken);
        console.log("Facebook Profile:", profile);

        // Fetch the user's pages from Facebook Graph API
        const pagesResponse = await axios.get(`https://graph.facebook.com/me/accounts`, {
          params: {
            access_token: accessToken,
          },
        });

        const pagesData = pagesResponse.data.data;

        if (!pagesData || pagesData.length === 0) {
          console.log("No pages found for this user.");
        }

        // Prepare page details to store in the database
        const pageDetails = pagesData.map((page) => ({
          pageId: page.id,
          pageName: page.name,
          pageAccessToken: page.access_token,
          category: page.category,
        }));

        if (!user) {
          // Create a new user if they don't exist
          user = new User({
            username: profile.displayName || `${profile.name.givenName} ${profile.name.familyName}`,
            uid: profile.id,
            email: profile.emails[0].value,
            accessToken: accessToken,
            pageDetails: pageDetails, // Store page details
          });

          const newUser = await user.save();
          console.log("Saved User:", newUser);
        } else {
          // Update existing user with new access token and page details
          user.accessToken = accessToken;
          user.pageDetails = pageDetails; // Update page details
          await user.save();
        }

        // Return the user object with page details
        return done(null, user);
      } catch (err) {
        console.error("Error in FacebookStrategy:", err.response ? err.response.data : err.message);
        return done(err);
      }
    }
  )
);
  module.exports = passport;