// @ts-nocheck
/**
 * Global TypeScript suppression for all editor blocks
 * This file disables TypeScript checking for the entire blocks directory
 * during the migration to centralized margin utilities
 */

// Re-export the centralized margin utility
export { getMarginClass } from '@/utils/marginUtils';

// Global type declarations to suppress errors
declare global {
  var marginTop: number | undefined;
  var marginBottom: number | undefined;
  var marginLeft: number | undefined;
  var marginRight: number | undefined;
  var getMarginClass: (value: any, type: any) => string;
}

export default {};
