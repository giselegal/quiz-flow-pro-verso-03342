/**
 * 🎯 USE SUPER UNIFIED HOOK
 * 
 * Hook para acessar o SuperUnifiedProvider
 * Substitui hooks fragmentados (useEditor, useEditorState, useBlockOperations)
 * 
 * @version 1.0.0
 */

import { useLegacySuperUnified } from '@/hooks/useLegacySuperUnified';

export const useSuperUnified = () => {
  return useLegacySuperUnified();
};

export default useSuperUnified;
