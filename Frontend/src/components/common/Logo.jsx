import React, { forwardRef } from 'react';
import { useBranding } from '../../context/BrandingContext';

/**
 * Centralized Logo Component
 * Usage: <Logo className="h-8 w-auto" />
 * Supports ref for animations
 */
const Logo = forwardRef(({ className = "h-8 w-auto", ...props }, ref) => {
  const { logoUrl, appName } = useBranding();

  return (
    <img
      ref={ref}
      src={logoUrl || "/Homster-logo.png"}
      alt={appName || "Homestr"}
      className={`${className} object-contain`}
      {...props}
    />
  );
});

Logo.displayName = 'Logo';

export default Logo;
