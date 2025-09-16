/**
 * 🧩 UNIFIED MODULES REGISTRY - Fase 3
 * 
 * Registry consolidado para todos os módulos/componentes do editor
 * Simplifica o sistema de componentes e melhora performance
 */

import React, { lazy, Suspense } from 'react';
import { cn } from '@/lib/utils';

// ✅ LAZY LOADING otimizado dos módulos Step 20
const UserGreetingModule = lazy(() => import('./step20/UserGreetingModule'));
const StyleRevealModule = lazy(() => import('./step20/StyleRevealModule'));
const SecondaryStylesModule = lazy(() => import('./step20/SecondaryStylesModule'));

// ✅ Componente de loading unificado
const ModuleLoadingFallback: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('animate-pulse p-6 rounded-lg bg-gray-100', className)}>
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-48 bg-gray-200 rounded mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);

// ✅ Registry unificado de módulos
export const UnifiedModulesRegistry = {
  // Step 20 Modules
  'step20-user-greeting': (props: any) => (
    <Suspense fallback={<ModuleLoadingFallback className={props.className} />}>
      <UserGreetingModule {...props} />
    </Suspense>
  ),
  
  'step20-style-reveal': (props: any) => (
    <Suspense fallback={<ModuleLoadingFallback className={props.className} />}>
      <StyleRevealModule {...props} />
    </Suspense>
  ),
  
  'step20-secondary-styles': (props: any) => (
    <Suspense fallback={<ModuleLoadingFallback className={props.className} />}>
      <SecondaryStylesModule {...props} />
    </Suspense>
  ),
  
  // Adicionar mais módulos conforme necessário...
};

// ✅ Hook para usar o registry
export const useUnifiedModules = () => {
  const getModule = (moduleType: string, props: any) => {
    const ModuleComponent = UnifiedModulesRegistry[moduleType as keyof typeof UnifiedModulesRegistry];
    
    if (!ModuleComponent) {
      console.warn(`🧩 Módulo não encontrado: ${moduleType}`);
      return (
        <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-500">
          Módulo "{moduleType}" não encontrado
        </div>
      );
    }
    
    return ModuleComponent(props);
  };
  
  const isModuleAvailable = (moduleType: string) => {
    return moduleType in UnifiedModulesRegistry;
  };
  
  const getAvailableModules = () => {
    return Object.keys(UnifiedModulesRegistry);
  };
  
  return {
    getModule,
    isModuleAvailable,
    getAvailableModules,
  };
};

export default UnifiedModulesRegistry;