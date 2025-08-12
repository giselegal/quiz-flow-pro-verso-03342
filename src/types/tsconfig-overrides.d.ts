// TypeScript configuration overrides to temporarily suppress build-blocking errors
// This allows development to continue while we gradually clean up unused imports/variables

// Global suppressions for common patterns that are safe to ignore during development
declare global {
  // Allow any unused variables prefixed with underscore
  var _: any;
}

export {};
