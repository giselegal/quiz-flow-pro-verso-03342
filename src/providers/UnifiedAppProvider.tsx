/**
 * Re-export SuperUnifiedProviderV4 as UnifiedAppProvider for backward compatibility
 */
export { 
  SuperUnifiedProviderV4 as default, 
  SuperUnifiedProviderV4 as UnifiedAppProvider 
} from '@/contexts/providers/SuperUnifiedProviderV4';

// Note: useUnifiedApp and useUnifiedAppSelector are no longer available
// Use context-specific hooks instead (useEditor, useAuth, etc.)
