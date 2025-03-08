const express = require('express');
const mediaCrtl = require('./../../controllers/main/mediaCrtl');
const {authenticate} = require('./../../middleware/main/authMiddleware');
const router = express.Router();

router.get('/me',authenticate, mediaCrtl.profile);

module.exports = router;