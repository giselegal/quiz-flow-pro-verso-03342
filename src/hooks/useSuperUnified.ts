/**
 * 🎯 USE SUPER UNIFIED HOOK
 * 
 * Hook para acessar o SuperUnifiedProvider
 * Substitui hooks fragmentados (useEditor, useEditorState, useBlockOperations)
 * 
 * @version 1.0.0
 */

import { useContext } from 'react';
import { SuperUnifiedContext } from '@/providers/SuperUnifiedProvider';

export const useSuperUnified = () => {
  const context = useContext(SuperUnifiedContext);
  
  if (!context) {
    throw new Error(
      '🚨 useSuperUnified must be used within SuperUnifiedProvider\n\n' +
      'Wrap your component with:\n' +
      '<SuperUnifiedProvider>\n' +
      '  <YourComponent />\n' +
      '</SuperUnifiedProvider>'
    );
  }
  
  return context;
};

export default useSuperUnified;
