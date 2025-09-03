// Unified re-export shim for the Enhanced Block Registry
// This file intentionally re-exports from the lowercase path to avoid
// duplication and casing issues across different OS/filesystems.
// All consumers should import from either path without behavior differences.

export * from './enhancedBlockRegistry';
export { default } from './enhancedBlockRegistry';
