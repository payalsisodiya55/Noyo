const Branding = require('../../models/Branding');

// Get Branding Settings (Private/Admin)
exports.getBranding = async (req, res) => {
  try {
    let branding = await Branding.findOne({ type: 'global' });
    if (!branding) {
      branding = await Branding.create({ type: 'global' });
    }
    res.status(200).json({
      success: true,
      branding
    });
  } catch (error) {
    console.error('Error fetching branding settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch branding settings'
    });
  }
};

// Get Public Branding Settings (Unauthenticated)
exports.getPublicBranding = async (req, res) => {
  try {
    let branding = await Branding.findOne({ type: 'global' });
    if (!branding) {
      branding = await Branding.create({ type: 'global' });
    }
    res.status(200).json({
      success: true,
      branding
    });
  } catch (error) {
    console.error('Error fetching public branding settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch public branding settings'
    });
  }
};

// Update Branding Settings
exports.updateBranding = async (req, res) => {
  try {
    const updateData = req.body;
    let branding = await Branding.findOne({ type: 'global' });

    if (!branding) {
      branding = new Branding({ type: 'global', ...updateData });
    } else {
      // Direct assignment of top level fields if provided
      const topLevelFields = [
        'companyName', 'companyEmail', 'companyPhone', 'companyAddress',
        'companyState', 'companyPincode', 'companyRegion', 'websiteUrl',
        'supportEmail', 'supportPhone', 'supportAvailability',
        'logoUrl', 'faviconUrl', 'loginLogoUrl'
      ];

      topLevelFields.forEach(field => {
        if (updateData[field] !== undefined) {
          branding[field] = updateData[field];
        }
      });

      // Update app specific configurations
      if (updateData.apps) {
        ['user', 'vendor', 'worker', 'admin'].forEach(appKey => {
          if (updateData.apps[appKey]) {
            const appUpdate = updateData.apps[appKey];
            const appFields = ['appName', 'appLogo', 'favicon', 'tabTitle', 'primaryColor', 'secondaryColor'];
            appFields.forEach(field => {
              if (appUpdate[field] !== undefined) {
                branding.apps[appKey][field] = appUpdate[field];
              }
            });
          }
        });
      }

      // Update About page configurations
      if (updateData.aboutPage) {
        branding.aboutPage = {
          ...branding.aboutPage,
          ...updateData.aboutPage
        };
      }
    }

    await branding.save();

    res.status(200).json({
      success: true,
      message: 'Branding settings updated successfully',
      branding
    });
  } catch (error) {
    console.error('Error updating branding settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update branding settings',
      error: error.message
    });
  }
};

// Upload Logo / Favicon Asset
exports.uploadAsset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    res.status(200).json({
      success: true,
      url: req.file.path,
      message: 'Asset uploaded successfully'
    });
  } catch (error) {
    console.error('Upload asset error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload asset',
      error: error.message
    });
  }
};
