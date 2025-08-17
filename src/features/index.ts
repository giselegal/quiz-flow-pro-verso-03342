// 🚀 Features Export Index
// Centralized exports for the new feature-based architecture

// === EDITOR FEATURE ===
// Main editor components and functionality
export * from './editor/components';

// === QUIZ FEATURE ===
// Quiz building and management
export * from './quiz/builder';
export * from './quiz/components';

// === SHARED COMPONENTS ===
// Reusable UI components and utilities
export * from '../shared/components/ui';
export * from '../shared/hooks';
export * from '../shared/services';
export * from '../shared/utils';

// === TYPES ===
// Global type definitions
export * from '../shared/types';

// === LEGACY COMPATIBILITY ===
// Temporary exports for backwards compatibility during migration
// TODO: Remove these exports once migration is complete
export * from '../components';
export * from '../hooks';
export * from '../services';
export * from '../types';
