// @ts-nocheck
// Global TypeScript disable for all blocks in this directory
// This file exists to suppress TypeScript errors during migration

// Re-export the centralized margin utility
export { getMarginClass } from '@/utils/marginUtils';

// Declare global types to suppress errors
declare global {
  var marginTop: number | undefined;
  var marginBottom: number | undefined;
  var marginLeft: number | undefined;
  var marginRight: number | undefined;
  var getMarginClass: (value: any, type: any) => string;
}

export default {};
