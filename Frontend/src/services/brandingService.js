import api from './api';

export const brandingService = {
  // Get Branding Settings (Private/Admin)
  getBranding: async () => {
    const response = await api.get('/admin/branding');
    return response.data;
  },

  // Get Public Branding Settings (Unauthenticated / App startup)
  getPublicBranding: async () => {
    const response = await api.get('/public/branding');
    return response.data;
  },

  // Update Branding Settings
  updateBranding: async (data) => {
    const response = await api.put('/admin/branding', data);
    return response.data;
  },

  // Upload Logo
  uploadLogo: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/admin/branding/upload-logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Upload Favicon
  uploadFavicon: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/admin/branding/upload-favicon', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};
export default brandingService;
