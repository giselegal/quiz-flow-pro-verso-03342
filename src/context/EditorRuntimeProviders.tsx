/**
 * 🎯 EDITOR RUNTIME PROVIDERS - STUB IMPLEMENTATION
 * 
 * Basic provider for editor runtime
 */

import React from 'react';

export interface EditorRuntimeProvidersProps {
  children: React.ReactNode;
}

export const EditorRuntimeProviders: React.FC<EditorRuntimeProvidersProps> = ({ 
  children 
}) => {
  return <>{children}</>;
};

export default EditorRuntimeProviders;