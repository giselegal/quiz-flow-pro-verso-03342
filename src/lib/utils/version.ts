import { appLogger } from '@/lib/utils/appLogger';
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
  appLogger.info(`App Version: ${VERSION.buildNumber}`);
  appLogger.info(`Last Updated: ${new Date(VERSION.lastUpdated).toLocaleDateString()}`);
  appLogger.info(`Environment: ${VERSION.environment}`);
};
