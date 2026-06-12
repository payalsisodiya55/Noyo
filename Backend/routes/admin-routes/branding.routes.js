const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/authMiddleware');
const { isAdmin } = require('../../middleware/roleMiddleware');
const { uploadImage } = require('../../middleware/uploadMiddleware');
const { getBranding, updateBranding, uploadAsset } = require('../../controllers/adminControllers/brandingController');

// Protect all admin routes
router.use(authenticate, isAdmin);

// GET and UPDATE branding settings
router.route('/branding')
  .get(getBranding)
  .put(updateBranding);

// Upload endpoints specific to branding
router.post('/branding/upload-logo', uploadImage, uploadAsset);
router.post('/branding/upload-favicon', uploadImage, uploadAsset);

module.exports = router;
