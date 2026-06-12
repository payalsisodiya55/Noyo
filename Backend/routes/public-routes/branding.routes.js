const express = require('express');
const router = express.Router();
const { getPublicBranding } = require('../../controllers/adminControllers/brandingController');

// Public route to get branding settings
router.get('/branding', getPublicBranding);

module.exports = router;
