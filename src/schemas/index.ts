/**
 * 🔗 SCHEMAS ALIAS
 * 
 * Alias for backward compatibility - forwards imports to the canonical location
 * @deprecated Import from '@/config/schemas' or '@/types/schemas' instead
 */

// Re-export SCHEMAS and migrateProps from types/schemas
export { SCHEMAS, migrateProps, LATEST_SCHEMA_VERSION } from '@/types/schemas';

// Re-export all schema definitions for compatibility
export * from '@/types/schemas/intro.schema';
export * from '@/types/schemas/question.schema';
export * from '@/types/schemas/strategicQuestion.schema';
export * from '@/types/schemas/transition.schema';
export * from '@/types/schemas/result.schema';
export * from '@/types/schemas/offer.schema';
