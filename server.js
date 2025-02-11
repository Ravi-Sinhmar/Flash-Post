require("dotenv").config();
require("./config/db");
const app = require("./app");

// Refresh Insta token in Each 20 Days
require('./utils/instagram/allTokenRefresh');


let PORT = process.env.NODE_ENV === "PRODUCTION" ? process.env.PORT : 3000;
app.listen(PORT, () => {
  console.log(`App is Listening on Port : ${PORT}`);
});
