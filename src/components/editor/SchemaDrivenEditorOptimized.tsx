
import React, { lazy, Suspense } from 'react';
import { LoadingSpinner } from '../ui/loading-spinner';

// 🚀 LAZY LOADING - Divide o bundle em chunks menores
const SchemaDrivenEditorResponsive = lazy(() => 
  import('./SchemaDrivenEditorResponsive').then(module => ({ 
    default: module.default 
  }))
);

const EditorLoadingFallback = () => (
  <div className="h-full flex items-center justify-center bg-gray-50">
    <div className="text-center space-y-4">
      <LoadingSpinner size="lg" />
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Carregando Editor</h3>
        <p className="text-gray-600">Preparando o ambiente de edição...</p>
      </div>
    </div>
  </div>
);

interface SchemaDrivenEditorOptimizedProps {
  funnelId?: string;
  className?: string;
}

// 🎯 COMPONENTE PRINCIPAL OTIMIZADO
export const SchemaDrivenEditorOptimized: React.FC<SchemaDrivenEditorOptimizedProps> = (props) => {
  return (
    <Suspense fallback={<EditorLoadingFallback />}>
      <SchemaDrivenEditorResponsive {...props} />
    </Suspense>
  );
};

export default SchemaDrivenEditorOptimized;
