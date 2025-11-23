/**
 * Re-export SuperUnifiedProviderV3 as UnifiedAppProvider for backward compatibility
 */
export { 
  SuperUnifiedProviderV3 as default, 
  SuperUnifiedProviderV3 as UnifiedAppProvider 
} from '@/contexts/providers/SuperUnifiedProviderV3';

// Note: useUnifiedApp and useUnifiedAppSelector are no longer available
// Use context-specific hooks instead (useEditor, useAuth, etc.)
