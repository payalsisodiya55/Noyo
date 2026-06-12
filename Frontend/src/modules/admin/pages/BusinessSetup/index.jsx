import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSave, FiRotateCcw, FiUpload, FiTrash2, FiBriefcase, FiPhone, FiMail, 
  FiGlobe, FiMapPin, FiSmartphone, FiMonitor, FiLayout, FiCheckCircle, FiInfo 
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import brandingService from '../../../../services/brandingService';

const BusinessSetup = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('business'); // 'business', 'apps', 'about'
  const [activeAppBranding, setActiveAppBranding] = useState('user'); // 'user', 'vendor', 'worker', 'admin'
  const [previewDevice, setPreviewDevice] = useState('mobile'); // 'mobile', 'desktop'

  // State matching Branding schema structure
  const [brandingData, setBrandingData] = useState({
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    companyState: '',
    companyPincode: '',
    companyRegion: '',
    websiteUrl: '',
    supportEmail: '',
    supportPhone: '',
    supportAvailability: '',
    logoUrl: '',
    faviconUrl: '',
    loginLogoUrl: '',
    apps: {
      user: { appName: '', appLogo: '', favicon: '', tabTitle: '', primaryColor: '#000000', secondaryColor: '#000000' },
      vendor: { appName: '', appLogo: '', favicon: '', tabTitle: '', primaryColor: '#000000', secondaryColor: '#000000' },
      worker: { appName: '', appLogo: '', favicon: '', tabTitle: '', primaryColor: '#000000', secondaryColor: '#000000' },
      admin: { appName: '', appLogo: '', favicon: '', tabTitle: '', primaryColor: '#000000', secondaryColor: '#000000' }
    },
    aboutPage: {
      welcomeTitle: '',
      welcomeSubtitle: '',
      stats: [
        { number: '', label: '' },
        { number: '', label: '' },
        { number: '', label: '' }
      ],
      missionTitle: '',
      missionDescription: '',
      whyChooseTitle: '',
      features: [
        { icon: 'users', title: '', description: '' },
        { icon: 'shield', title: '', description: '' },
        { icon: 'clock', title: '', description: '' },
        { icon: 'award', title: '', description: '' }
      ],
      howItWorksTitle: '',
      howItWorksSteps: [
        { title: '', desc: '', icon: 'smartphone' },
        { title: '', desc: '', icon: 'users' },
        { title: '', desc: '', icon: 'smile' }
      ],
      footerDeveloper: '',
      footerVersion: '',
      footerMadeIn: ''
    }
  });

  // Backup state to support Reset
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    fetchBranding();
  }, []);

  const fetchBranding = async () => {
    setLoading(true);
    try {
      const res = await brandingService.getBranding();
      if (res.success && res.branding) {
        // Hydrate default structure to prevent missing objects
        const hydrated = {
          ...res.branding,
          apps: {
            user: { appName: '', appLogo: '', favicon: '', tabTitle: '', primaryColor: '#4F46E5', secondaryColor: '#818CF8', ...(res.branding.apps?.user || {}) },
            vendor: { appName: '', appLogo: '', favicon: '', tabTitle: '', primaryColor: '#10B981', secondaryColor: '#34D399', ...(res.branding.apps?.vendor || {}) },
            worker: { appName: '', appLogo: '', favicon: '', tabTitle: '', primaryColor: '#F59E0B', secondaryColor: '#FBBF24', ...(res.branding.apps?.worker || {}) },
            admin: { appName: '', appLogo: '', favicon: '', tabTitle: '', primaryColor: '#3B82F6', secondaryColor: '#60A5FA', ...(res.branding.apps?.admin || {}) }
          },
          aboutPage: {
            welcomeTitle: 'Welcome to Homestr',
            welcomeSubtitle: 'Your trusted partner for premium home and personal care services.',
            stats: [
              { number: '10K+', label: 'Happy Customers' },
              { number: '500+', label: 'Service Partners' },
              { number: '4.8', label: 'App Rating' }
            ],
            missionTitle: 'Our Mission',
            missionDescription: 'Homestr is dedicated to revolutionizing how you experience home services. We connect you with top-tier professionals to deliver safe, reliable, and high-quality services right at your doorstep. We believe in making life simpler, one service at a time.',
            whyChooseTitle: 'Why Choose Homestr?',
            features: [
              { icon: 'users', title: 'Expert Providers', description: 'Verified professionals for all your needs' },
              { icon: 'shield', title: 'Safe & Secure', description: 'Your safety is our top priority' },
              { icon: 'clock', title: 'On-Time Service', description: 'Punctual delivery at your convenience' },
              { icon: 'award', title: 'Quality Assured', description: 'Service with 100% satisfaction guarantee' }
            ],
            howItWorksTitle: 'How We Work',
            howItWorksSteps: [
              { title: 'Book Details', desc: 'Select service & schedule time', icon: 'smartphone' },
              { title: 'Get Matched', desc: 'We assign a top-rated pro', icon: 'users' },
              { title: 'Relax', desc: 'Enjoy high-quality service', icon: 'smile' }
            ],
            footerDeveloper: 'Homestr Team',
            footerVersion: 'v7.6.27',
            footerMadeIn: 'Made with ❤️ in India',
            ...(res.branding.aboutPage || {})
          }
        };
        setBrandingData(hydrated);
        setOriginalData(JSON.parse(JSON.stringify(hydrated)));
      }
    } catch (error) {
      console.error('Error fetching branding:', error);
      toast.error('Failed to load branding settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setBrandingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAboutInputChange = (field, value) => {
    setBrandingData(prev => ({
      ...prev,
      aboutPage: {
        ...prev.aboutPage,
        [field]: value
      }
    }));
  };

  const handleAboutNestedChange = (field, index, subfield, value) => {
    setBrandingData(prev => {
      const arr = [...(prev.aboutPage?.[field] || [])];
      if (arr[index]) {
        arr[index] = {
          ...arr[index],
          [subfield]: value
        };
      }
      return {
        ...prev,
        aboutPage: {
          ...prev.aboutPage,
          [field]: arr
        }
      };
    });
  };

  const handleAppInputChange = (appKey, field, value) => {
    setBrandingData(prev => ({
      ...prev,
      apps: {
        ...prev.apps,
        [appKey]: {
          ...prev.apps[appKey],
          [field]: value
        }
      }
    }));
  };

  const handleFileUpload = async (event, uploadType, appKey = null) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const uploadToast = toast.loading('Uploading asset...');
    try {
      let uploadRes;
      if (uploadType === 'favicon' || (appKey && uploadType === 'appFavicon')) {
        uploadRes = await brandingService.uploadFavicon(file);
      } else {
        uploadRes = await brandingService.uploadLogo(file);
      }

      if (uploadRes.success && uploadRes.url) {
        toast.success('Asset uploaded successfully', { id: uploadToast });
        if (appKey) {
          handleAppInputChange(appKey, uploadType === 'appLogo' ? 'appLogo' : 'favicon', uploadRes.url);
        } else {
          handleInputChange(uploadType, uploadRes.url);
        }
      } else {
        toast.error('Upload failed', { id: uploadToast });
      }
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('Error uploading file: ' + (error.response?.data?.message || error.message), { id: uploadToast });
    }
  };

  const handleRemoveAsset = (uploadType, appKey = null) => {
    if (appKey) {
      handleAppInputChange(appKey, uploadType === 'appLogo' ? 'appLogo' : 'favicon', '');
    } else {
      handleInputChange(uploadType, '');
    }
    toast.success('Asset removed locally. Save changes to make it permanent.');
  };

  const handleReset = () => {
    if (!originalData) return;
    if (window.confirm('Are you sure you want to revert all unsaved changes?')) {
      setBrandingData(JSON.parse(JSON.stringify(originalData)));
      toast.success('Reverted to saved settings');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const saveToast = toast.loading('Saving branding setup...');
    try {
      const res = await brandingService.updateBranding(brandingData);
      if (res.success) {
        toast.success('Branding setup saved successfully!', { id: saveToast });
        setOriginalData(JSON.parse(JSON.stringify(brandingData)));
        // Dispatch event so layout catches update immediately if on admin portal
        window.dispatchEvent(new Event('brandingUpdated'));
      } else {
        toast.error('Failed to save configuration', { id: saveToast });
      }
    } catch (error) {
      console.error('Save branding error:', error);
      toast.error('Error saving: ' + (error.response?.data?.message || error.message), { id: saveToast });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Visual constants representing the selected app color palette
  const selectedAppConfig = brandingData.apps[activeAppBranding];
  const primaryColor = selectedAppConfig.primaryColor || '#4F46E5';
  const secondaryColor = selectedAppConfig.secondaryColor || '#818CF8';

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Business Setup & Branding</h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure global business details and design the dynamic visual identity for all application portals.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <FiRotateCcw className="w-4 h-4" /> Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiSave className="w-4 h-4" />
            )}
            Save Configuration
          </button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('business')}
          className={`py-3 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'business'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FiBriefcase className="w-4 h-4" /> Business & Support Info
        </button>
        <button
          onClick={() => setActiveTab('apps')}
          className={`py-3 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'apps'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FiLayout className="w-4 h-4" /> Multi-App Branding
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`py-3 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'about'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FiInfo className="w-4 h-4" /> About Page Settings
        </button>
      </div>

      {/* Tab Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Middle Configuration Sections (Take 2 columns when not previewing) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* TAB 1: Business & Support Info */}
          {activeTab === 'business' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Business Info Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <FiBriefcase className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Business Information</h2>
                    <p className="text-xs text-slate-400">Used for global system setup, bills, and document footers.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Company Name</label>
                    <input
                      type="text"
                      value={brandingData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      placeholder="Noyo Technologies Private Limited"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Website URL</label>
                    <div className="relative">
                      <FiGlobe className="absolute left-3 top-3 text-slate-400" />
                      <input
                        type="url"
                        value={brandingData.websiteUrl}
                        onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                        placeholder="https://noyo.in"
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Company Email</label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-3 text-slate-400" />
                      <input
                        type="email"
                        value={brandingData.companyEmail}
                        onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                        placeholder="office@noyo.in"
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Company Phone</label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-3 text-slate-400" />
                      <input
                        type="tel"
                        value={brandingData.companyPhone}
                        onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                        placeholder="+91 9876543210"
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Full Corporate Address</label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-3 text-slate-400" />
                      <textarea
                        value={brandingData.companyAddress}
                        onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                        placeholder="Sector 62, Noida, Uttar Pradesh, India"
                        rows="2"
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium resize-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">State</label>
                    <input
                      type="text"
                      value={brandingData.companyState}
                      onChange={(e) => handleInputChange('companyState', e.target.value)}
                      placeholder="Uttar Pradesh"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Pincode</label>
                    <input
                      type="text"
                      value={brandingData.companyPincode}
                      onChange={(e) => handleInputChange('companyPincode', e.target.value)}
                      placeholder="201301"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Support Info Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <FiPhone className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Support Information</h2>
                    <p className="text-xs text-slate-400">Exposed to end-users on help screens and call-support popups.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Support Email</label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-3 text-slate-400" />
                      <input
                        type="email"
                        value={brandingData.supportEmail}
                        onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                        placeholder="support@noyo.in"
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Support Phone</label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-3 text-slate-400" />
                      <input
                        type="tel"
                        value={brandingData.supportPhone}
                        onChange={(e) => handleInputChange('supportPhone', e.target.value)}
                        placeholder="+91 1800-NOYO-HELP"
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Availability Hours</label>
                    <input
                      type="text"
                      value={brandingData.supportAvailability}
                      onChange={(e) => handleInputChange('supportAvailability', e.target.value)}
                      placeholder="Mon - Sat, 9:00 AM - 7:00 PM IST"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Global Assets Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <span className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <FiLayout className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Global Corporate Assets</h2>
                    <p className="text-xs text-slate-400">Primary visual resources representing the global organization.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Company Logo */}
                  <div className="space-y-2 flex flex-col items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase">Company Logo</span>
                    <div className="relative w-32 h-32 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center bg-slate-50 overflow-hidden group">
                      {brandingData.logoUrl ? (
                        <>
                          <img src={brandingData.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                          <button
                            type="button"
                            onClick={() => handleRemoveAsset('logoUrl')}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white rounded-2xl"
                          >
                            <FiTrash2 className="w-6 h-6" />
                          </button>
                        </>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center justify-center text-slate-400 hover:text-slate-600 h-full w-full">
                          <FiUpload className="w-6 h-6 mb-1" />
                          <span className="text-[10px] font-bold">Upload PNG</span>
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload(e, 'logoUrl')}
                            className="hidden"
                            accept="image/*"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Company Favicon */}
                  <div className="space-y-2 flex flex-col items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase">Favicon</span>
                    <div className="relative w-32 h-32 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center bg-slate-50 overflow-hidden group">
                      {brandingData.faviconUrl ? (
                        <>
                          <img src={brandingData.faviconUrl} alt="Favicon" className="w-16 h-16 object-contain" />
                          <button
                            type="button"
                            onClick={() => handleRemoveAsset('faviconUrl')}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white rounded-2xl"
                          >
                            <FiTrash2 className="w-6 h-6" />
                          </button>
                        </>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center justify-center text-slate-400 hover:text-slate-600 h-full w-full">
                          <FiUpload className="w-6 h-6 mb-1" />
                          <span className="text-[10px] font-bold">Upload ICO/PNG</span>
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload(e, 'faviconUrl')}
                            className="hidden"
                            accept="image/*"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Login Screen Logo */}
                  <div className="space-y-2 flex flex-col items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase">Login Screen Logo</span>
                    <div className="relative w-32 h-32 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center bg-slate-50 overflow-hidden group">
                      {brandingData.loginLogoUrl ? (
                        <>
                          <img src={brandingData.loginLogoUrl} alt="Login Logo" className="w-full h-full object-contain p-2" />
                          <button
                            type="button"
                            onClick={() => handleRemoveAsset('loginLogoUrl')}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white rounded-2xl"
                          >
                            <FiTrash2 className="w-6 h-6" />
                          </button>
                        </>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center justify-center text-slate-400 hover:text-slate-600 h-full w-full">
                          <FiUpload className="w-6 h-6 mb-1" />
                          <span className="text-[10px] font-bold">Upload PNG</span>
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload(e, 'loginLogoUrl')}
                            className="hidden"
                            accept="image/*"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: Multi-App Branding */}
          {activeTab === 'apps' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* App Selector Pills */}
              <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap gap-2">
                {[
                  { key: 'user', name: 'User App', color: 'bg-indigo-500' },
                  { key: 'vendor', name: 'Vendor App', color: 'bg-emerald-500' },
                  { key: 'worker', name: 'Worker App', color: 'bg-amber-500' },
                  { key: 'admin', name: 'Admin Panel', color: 'bg-blue-500' }
                ].map(app => (
                  <button
                    key={app.key}
                    onClick={() => setActiveAppBranding(app.key)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                      activeAppBranding === app.key
                        ? 'bg-slate-800 text-white shadow-md'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${app.color}`}></span>
                    {app.name}
                  </button>
                ))}
              </div>

              {/* Selected App Brand configuration card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <FiSmartphone className="w-5 h-5" />
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-slate-800 uppercase">{activeAppBranding} Application</h2>
                      <p className="text-xs text-slate-400">Configure visual themes and names representing this portal.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name and Tab Title */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">App Name</label>
                    <input
                      type="text"
                      value={brandingData.apps[activeAppBranding].appName}
                      onChange={(e) => handleAppInputChange(activeAppBranding, 'appName', e.target.value)}
                      placeholder="Noyo User"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Browser Tab Title</label>
                    <input
                      type="text"
                      value={brandingData.apps[activeAppBranding].tabTitle}
                      onChange={(e) => handleAppInputChange(activeAppBranding, 'tabTitle', e.target.value)}
                      placeholder="Noyo | Professional On-Demand Repair Services"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                {/* App Specific Assets */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  {/* App specific logo */}
                  <div className="flex flex-col items-center p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase mb-2">Portal Specific Logo</span>
                    <div className="relative w-32 h-20 bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden flex items-center justify-center group">
                      {brandingData.apps[activeAppBranding].appLogo ? (
                        <>
                          <img src={brandingData.apps[activeAppBranding].appLogo} alt="App Logo" className="w-full h-full object-contain p-2" />
                          <button
                            type="button"
                            onClick={() => handleRemoveAsset('appLogo', activeAppBranding)}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center justify-center text-slate-400 hover:text-slate-600 h-full w-full">
                          <FiUpload className="w-5 h-5" />
                          <span className="text-[9px] font-bold mt-1">Upload Logo</span>
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload(e, 'appLogo', activeAppBranding)}
                            className="hidden"
                            accept="image/*"
                          />
                        </label>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 text-center">Overrides the corporate logo inside this specific application header.</p>
                  </div>

                  {/* App specific favicon */}
                  <div className="flex flex-col items-center p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase mb-2">Portal Specific Favicon</span>
                    <div className="relative w-20 h-20 bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden flex items-center justify-center group">
                      {brandingData.apps[activeAppBranding].favicon ? (
                        <>
                          <img src={brandingData.apps[activeAppBranding].favicon} alt="App Favicon" className="w-12 h-12 object-contain" />
                          <button
                            type="button"
                            onClick={() => handleRemoveAsset('favicon', activeAppBranding)}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center justify-center text-slate-400 hover:text-slate-600 h-full w-full">
                          <FiUpload className="w-5 h-5" />
                          <span className="text-[9px] font-bold mt-1">Upload Icon</span>
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload(e, 'favicon', activeAppBranding)}
                            className="hidden"
                            accept="image/*"
                          />
                        </label>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 text-center">Replaces tab shortcut icon for this platform portal.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: About Page Settings */}
          {activeTab === 'about' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Section 1: Hero & Welcome Info */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <FiInfo className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-slate-800">Hero Section</h2>
                    <p className="text-xs text-slate-400">Configure welcome greetings and header tagline.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 font-mono">Welcome Title</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                      value={brandingData.aboutPage?.welcomeTitle || ''}
                      onChange={(e) => handleAboutInputChange('welcomeTitle', e.target.value)}
                      placeholder="Welcome to Homestr"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 font-mono">Welcome Subtitle</label>
                    <textarea
                      rows="2"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500 resize-none"
                      value={brandingData.aboutPage?.welcomeSubtitle || ''}
                      onChange={(e) => handleAboutInputChange('welcomeSubtitle', e.target.value)}
                      placeholder="Your trusted partner for premium home and personal care services."
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Stats Grid */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <FiRotateCcw className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-slate-800">Counter Stats</h2>
                    <p className="text-xs text-slate-400">Set counter figures displayed under the hero section.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[0, 1, 2].map((idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase font-mono">Stat Slot {idx + 1}</span>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1 font-mono">Number/Value</label>
                        <input
                          type="text"
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-indigo-500 bg-white"
                          value={brandingData.aboutPage?.stats?.[idx]?.number || ''}
                          onChange={(e) => handleAboutNestedChange('stats', idx, 'number', e.target.value)}
                          placeholder="e.g. 10K+"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1 font-mono">Label Text</label>
                        <input
                          type="text"
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-indigo-500 bg-white"
                          value={brandingData.aboutPage?.stats?.[idx]?.label || ''}
                          onChange={(e) => handleAboutNestedChange('stats', idx, 'label', e.target.value)}
                          placeholder="e.g. Happy Customers"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Mission Statement */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <FiGlobe className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-slate-800">Mission Statement</h2>
                    <p className="text-xs text-slate-400">Describe the core mission and purpose of the brand.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 font-mono">Mission Section Title</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                      value={brandingData.aboutPage?.missionTitle || ''}
                      onChange={(e) => handleAboutInputChange('missionTitle', e.target.value)}
                      placeholder="Our Mission"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 font-mono">Mission Statement / Description</label>
                    <textarea
                      rows="3"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                      value={brandingData.aboutPage?.missionDescription || ''}
                      onChange={(e) => handleAboutInputChange('missionDescription', e.target.value)}
                      placeholder="Homestr is dedicated to..."
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Why Choose Us Features */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <FiCheckCircle className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-slate-800">Why Choose Us Features</h2>
                    <p className="text-xs text-slate-400">Customize the four grid cards highlighting unique advantages.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[0, 1, 2, 3].map((idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase font-mono">Card {idx + 1}</span>
                        <select
                          className="px-2 py-0.5 border border-slate-200 rounded text-xs bg-white text-slate-700 focus:outline-none focus:border-indigo-500"
                          value={brandingData.aboutPage?.features?.[idx]?.icon || 'users'}
                          onChange={(e) => handleAboutNestedChange('features', idx, 'icon', e.target.value)}
                        >
                          <option value="users">Expert/Users Icon</option>
                          <option value="shield">Shield Icon</option>
                          <option value="clock">Clock/Time Icon</option>
                          <option value="award">Award/Quality Icon</option>
                          <option value="heart">Heart Icon</option>
                          <option value="globe">Globe Icon</option>
                          <option value="smile">Smile Icon</option>
                          <option value="smartphone">Mobile Icon</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1 font-mono">Title</label>
                        <input
                          type="text"
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-indigo-500 bg-white"
                          value={brandingData.aboutPage?.features?.[idx]?.title || ''}
                          onChange={(e) => handleAboutNestedChange('features', idx, 'title', e.target.value)}
                          placeholder="e.g. Expert Providers"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1 font-mono">Short Description</label>
                        <textarea
                          rows="2"
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-indigo-500 resize-none bg-white"
                          value={brandingData.aboutPage?.features?.[idx]?.description || ''}
                          onChange={(e) => handleAboutNestedChange('features', idx, 'description', e.target.value)}
                          placeholder="e.g. Verified professionals for all your needs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 5: How We Work Steps */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <FiSmartphone className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-slate-800">How It Works Steps</h2>
                    <p className="text-xs text-slate-400">Define the 3-step workflow displayed on the about page.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[0, 1, 2].map((idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase font-mono">Step {idx + 1}</span>
                        <select
                          className="px-2 py-0.5 border border-slate-200 rounded text-xs bg-white text-slate-700 focus:outline-none focus:border-indigo-500"
                          value={brandingData.aboutPage?.howItWorksSteps?.[idx]?.icon || 'smartphone'}
                          onChange={(e) => handleAboutNestedChange('howItWorksSteps', idx, 'icon', e.target.value)}
                        >
                          <option value="smartphone">Mobile Icon</option>
                          <option value="users">Expert/Users Icon</option>
                          <option value="smile">Smile Icon</option>
                          <option value="shield">Shield Icon</option>
                          <option value="clock">Clock/Time Icon</option>
                          <option value="award">Award/Quality Icon</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1 font-mono">Step Title</label>
                        <input
                          type="text"
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-indigo-500 bg-white"
                          value={brandingData.aboutPage?.howItWorksSteps?.[idx]?.title || ''}
                          onChange={(e) => handleAboutNestedChange('howItWorksSteps', idx, 'title', e.target.value)}
                          placeholder="Step Title"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1 font-mono">Description</label>
                        <input
                          type="text"
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-indigo-500 bg-white"
                          value={brandingData.aboutPage?.howItWorksSteps?.[idx]?.desc || ''}
                          onChange={(e) => handleAboutNestedChange('howItWorksSteps', idx, 'desc', e.target.value)}
                          placeholder="Step Description"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 6: Footer Info */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <FiLayout className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-slate-800">Footer Details</h2>
                    <p className="text-xs text-slate-400">Configure signature, version, and localization text.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 font-mono">Developer/Team Signature</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500 font-sans"
                      value={brandingData.aboutPage?.footerDeveloper || ''}
                      onChange={(e) => handleAboutInputChange('footerDeveloper', e.target.value)}
                      placeholder="e.g. Homestr Team"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 font-mono">App Version</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500 font-sans"
                      value={brandingData.aboutPage?.footerVersion || ''}
                      onChange={(e) => handleAboutInputChange('footerVersion', e.target.value)}
                      placeholder="e.g. v7.6.27"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 font-mono">Made In Text</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500 font-sans"
                      value={brandingData.aboutPage?.footerMadeIn || ''}
                      onChange={(e) => handleAboutInputChange('footerMadeIn', e.target.value)}
                      placeholder="e.g. Made with ❤️ in India"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}



        </div>

        {/* Right Info / Details Summary (1 column) */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
            {/* Background absolute decor */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
            
            <h3 className="text-base font-extrabold mb-4 flex items-center gap-2">
              <FiCheckCircle className="text-indigo-400" /> branding summary
            </h3>

            <div className="space-y-4 text-xs font-semibold text-slate-400">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span>Company:</span>
                <span className="text-white truncate max-w-[150px]">{brandingData.companyName || 'Not Set'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span>Corporate Logo:</span>
                <span className="text-indigo-400">{brandingData.logoUrl ? 'Configured ✅' : 'Missing ⚠️'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span>Corporate Favicon:</span>
                <span className="text-indigo-400">{brandingData.faviconUrl ? 'Configured ✅' : 'Missing ⚠️'}</span>
              </div>

            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl flex items-start gap-3">
            <FiInfo className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase">Dynamic styling</p>
              <p className="text-[10px] text-amber-700 leading-relaxed font-semibold">
                Changing app names will instantly update window titles and tab favicons dynamically across all matching client systems upon saving.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BusinessSetup;
