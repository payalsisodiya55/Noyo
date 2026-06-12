import React, { createContext, useContext, useState, useEffect } from 'react';
import brandingService from '../services/brandingService';

const BrandingContext = createContext(null);

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};

export const BrandingProvider = ({ children }) => {
  const [branding, setBranding] = useState(null);
  const [currentApp, setCurrentApp] = useState('user');
  const [appConfig, setAppConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  // Determine app key based on current URL path
  const getAppKeyFromPath = (path) => {
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/vendor')) return 'vendor';
    if (path.startsWith('/worker')) return 'worker';
    return 'user';
  };

  const applyThemeColors = (primary, secondary) => {
    if (!primary) return;
    const root = document.documentElement;
    const sec = secondary || primary;

    // Apply Tailwinds & core css variables
    root.style.setProperty('--color-brand', primary);
    root.style.setProperty('--color-brand-dark', sec);
    root.style.setProperty('--color-brand-light', `${primary}15`); // 8% transparency
    
    // Apply primary colors for admin classes
    root.style.setProperty('--primary-50', `${primary}10`);
    root.style.setProperty('--primary-100', `${primary}1A`);
    root.style.setProperty('--primary-500', primary);
    root.style.setProperty('--primary-600', primary);
    root.style.setProperty('--primary-700', sec);
    
    // For tailwind class definitions
    root.style.setProperty('--color-primary-500', primary);
    root.style.setProperty('--color-primary-600', primary);
    root.style.setProperty('--color-primary-700', sec);

    // Apply inline style rule to body to help override default elements
    document.body.style.setProperty('--theme-primary', primary);
    document.body.style.setProperty('--theme-secondary', sec);
  };

  const applyMetadata = (title, faviconUrl) => {
    // 1. Update document/tab title
    if (title) {
      document.title = title;
    }

    // 2. Update favicon
    if (faviconUrl) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = faviconUrl;
    }
  };

  const loadBranding = async () => {
    try {
      const res = await brandingService.getPublicBranding();
      if (res.success && res.branding) {
        setBranding(res.branding);
        
        const path = window.location.pathname;
        const appKey = getAppKeyFromPath(path);
        setCurrentApp(appKey);

        const config = res.branding.apps?.[appKey] || {};
        setAppConfig(config);

        // Apply visual modifications
        const finalTitle = config.tabTitle || config.appName || res.branding.companyName || 'Noyo';
        const finalFavicon = config.favicon || res.branding.faviconUrl;
        applyMetadata(finalTitle, finalFavicon);
        applyThemeColors(config.primaryColor, config.secondaryColor);
      }
    } catch (error) {
      console.error('Failed to load dynamic branding context:', error);
    } finally {
      setLoading(false);
    }
  };

  // Run on mount
  useEffect(() => {
    loadBranding();

    // Listen to changes triggered inside BusinessSetup
    const handleUpdate = () => {
      loadBranding();
    };
    window.addEventListener('brandingUpdated', handleUpdate);
    
    // Handle path changes (e.g. going from /user/login to /admin/login)
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const appKey = getAppKeyFromPath(path);
      setCurrentApp(appKey);
    };
    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('brandingUpdated', handleUpdate);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Recalculate app configs when location changes internally (since React Router doesn't trigger popstate for in-app navs)
  useEffect(() => {
    if (!branding) return;
    const path = window.location.pathname;
    const appKey = getAppKeyFromPath(path);
    setCurrentApp(appKey);
    
    const config = branding.apps?.[appKey] || {};
    setAppConfig(config);
    
    const finalTitle = config.tabTitle || config.appName || branding.companyName || 'Noyo';
    const finalFavicon = config.favicon || branding.faviconUrl;
    applyMetadata(finalTitle, finalFavicon);
    applyThemeColors(config.primaryColor, config.secondaryColor);
  }, [window.location.pathname, branding]);

  const value = {
    branding,
    currentApp,
    appName: appConfig?.appName || branding?.companyName || 'Noyo',
    logoUrl: appConfig?.appLogo || branding?.logoUrl || '',
    faviconUrl: appConfig?.favicon || branding?.faviconUrl || '',
    loginLogoUrl: branding?.loginLogoUrl || appConfig?.appLogo || branding?.logoUrl || '',
    primaryColor: appConfig?.primaryColor || '#347989',
    secondaryColor: appConfig?.secondaryColor || '#2d6977',
    companyName: branding?.companyName || 'Noyo',
    companyEmail: branding?.companyEmail || '',
    companyPhone: branding?.companyPhone || '',
    companyAddress: branding?.companyAddress || '',
    supportEmail: branding?.supportEmail || '',
    supportPhone: branding?.supportPhone || '',
    supportAvailability: branding?.supportAvailability || '',
    aboutPage: branding?.aboutPage || null,
    reload: loadBranding
  };

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  );
};
export default BrandingProvider;
