/**
 * This file contains version information that can be updated
 * to test the CI/CD pipeline and GitHub integration.
 */

export const VERSION = {
  buildNumber: '1.0.0',
  lastUpdated: new Date().toISOString(),
  environment: process.env.NODE_ENV || 'development',
};

export const displayVersion = () => {
  console.info(`App Version: ${VERSION.buildNumber}`);
  console.info(`Last Updated: ${new Date(VERSION.lastUpdated).toLocaleDateString()}`);
  console.info(`Environment: ${VERSION.environment}`);
};
