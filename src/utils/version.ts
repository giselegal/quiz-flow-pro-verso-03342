/**
 * 🏷️ VERSION INFO
 * Build version information
 */

export const VERSION = {
  buildNumber: '1.0.0',
  lastUpdated: new Date().toISOString(),
  environment: import.meta.env.MODE || 'development'
};

export const getVersion = () => VERSION;
