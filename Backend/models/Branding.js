const mongoose = require('mongoose');

const appBrandingSchema = new mongoose.Schema({
  appName: {
    type: String,
    required: true
  },
  appLogo: {
    type: String,
    default: ''
  },
  favicon: {
    type: String,
    default: ''
  },
  tabTitle: {
    type: String,
    default: ''
  },
  primaryColor: {
    type: String,
    default: '#00a6a6'
  },
  secondaryColor: {
    type: String,
    default: '#29ad81'
  }
}, { _id: false });

const brandingSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'global',
    unique: true
  },
  companyName: {
    type: String,
    required: true,
    default: 'Homster'
  },
  companyEmail: {
    type: String,
    required: true,
    default: 'admin@homster.in'
  },
  companyPhone: {
    type: String,
    required: true,
    default: '9999999999'
  },
  companyAddress: {
    type: String,
    default: ''
  },
  companyState: {
    type: String,
    default: ''
  },
  companyPincode: {
    type: String,
    default: ''
  },
  companyRegion: {
    type: String,
    default: 'India'
  },
  websiteUrl: {
    type: String,
    default: ''
  },
  supportEmail: {
    type: String,
    default: ''
  },
  supportPhone: {
    type: String,
    default: ''
  },
  supportAvailability: {
    type: String,
    default: ''
  },
  // Global Assets
  logoUrl: {
    type: String,
    default: ''
  },
  faviconUrl: {
    type: String,
    default: ''
  },
  loginLogoUrl: {
    type: String,
    default: ''
  },
  // Multi App Configurations
  apps: {
    user: {
      type: appBrandingSchema,
      default: () => ({
        appName: 'Homster',
        appLogo: '',
        favicon: '',
        tabTitle: 'Homster | Your Home Services, Simplified',
        primaryColor: '#00a6a6',
        secondaryColor: '#29ad81'
      })
    },
    vendor: {
      type: appBrandingSchema,
      default: () => ({
        appName: 'Homster Partner',
        appLogo: '',
        favicon: '',
        tabTitle: 'Homster Partner Dashboard',
        primaryColor: '#347989',
        secondaryColor: '#29ad81'
      })
    },
    worker: {
      type: appBrandingSchema,
      default: () => ({
        appName: 'Homster Worker',
        appLogo: '',
        favicon: '',
        tabTitle: 'Homster Worker App',
        primaryColor: '#3b82f6',
        secondaryColor: '#10b981'
      })
    },
    admin: {
      type: appBrandingSchema,
      default: () => ({
        appName: 'Homster',
        appLogo: '',
        favicon: '',
        tabTitle: 'Homster Admin Panel',
        primaryColor: '#1e293b',
        secondaryColor: '#3b82f6'
      })
    }
  },
  aboutPage: {
    welcomeTitle: {
      type: String,
      default: 'Welcome to Homestr'
    },
    welcomeSubtitle: {
      type: String,
      default: 'Your trusted partner for premium home and personal care services.'
    },
    stats: {
      type: [{
        number: String,
        label: String
      }],
      default: () => [
        { number: '10K+', label: 'Happy Customers' },
        { number: '500+', label: 'Service Partners' },
        { number: '4.8', label: 'App Rating' }
      ]
    },
    missionTitle: {
      type: String,
      default: 'Our Mission'
    },
    missionDescription: {
      type: String,
      default: 'Homestr is dedicated to revolutionizing how you experience home services. We connect you with top-tier professionals to deliver safe, reliable, and high-quality services right at your doorstep. We believe in making life simpler, one service at a time.'
    },
    whyChooseTitle: {
      type: String,
      default: 'Why Choose Homestr?'
    },
    features: {
      type: [{
        icon: { type: String, default: 'users' },
        title: String,
        description: String
      }],
      default: () => [
        { icon: 'users', title: 'Expert Providers', description: 'Verified professionals for all your needs' },
        { icon: 'shield', title: 'Safe & Secure', description: 'Your safety is our top priority' },
        { icon: 'clock', title: 'On-Time Service', description: 'Punctual delivery at your convenience' },
        { icon: 'award', title: 'Quality Assured', description: 'Service with 100% satisfaction guarantee' }
      ]
    },
    howItWorksTitle: {
      type: String,
      default: 'How We Work'
    },
    howItWorksSteps: {
      type: [{
        icon: { type: String, default: 'smartphone' },
        title: String,
        desc: String
      }],
      default: () => [
        { title: 'Book Details', desc: 'Select service & schedule time', icon: 'smartphone' },
        { title: 'Get Matched', desc: 'We assign a top-rated pro', icon: 'users' },
        { title: 'Relax', desc: 'Enjoy high-quality service', icon: 'smile' }
      ]
    },
    footerDeveloper: {
      type: String,
      default: 'Homestr Team'
    },
    footerVersion: {
      type: String,
      default: 'v7.6.27'
    },
    footerMadeIn: {
      type: String,
      default: 'Made with ❤️ in India'
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Branding', brandingSchema);
