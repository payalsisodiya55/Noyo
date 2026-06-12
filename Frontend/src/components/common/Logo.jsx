import React, { forwardRef } from 'react';
import { useBranding } from '../../context/BrandingContext';

/**
 * Centralized Logo Component
 * Usage: <Logo className="h-8 w-auto" />
 * Supports ref for animations
 */
const Logo = forwardRef(({ className = "h-8 w-auto", ...props }, ref) => {
  let logoUrl = '';
  let appName = 'Noyo';
  try {
    const branding = useBranding();
    logoUrl = branding.logoUrl;
    appName = branding.appName;
  } catch (e) {
    // Context not loaded/wrapped yet
  }

  // Clean the className to make sure it functions as a square container
  const cleanClassName = className
    .replace('w-auto', 'aspect-square')
    .replace('object-contain', '');

  return (
    <div
      ref={ref}
      className={`rounded-full bg-white border border-slate-200/60 shadow-sm flex items-center justify-center overflow-hidden shrink-0 aspect-square ${cleanClassName}`}
      style={{ boxSizing: 'border-box' }}
    >
      <img
        src={logoUrl || "/Homster-logo.png"}
        alt={appName || "Homestr"}
        className="w-full h-full object-contain p-1"
        {...props}
      />
    </div>
  );
});

Logo.displayName = 'Logo';

export default Logo;
