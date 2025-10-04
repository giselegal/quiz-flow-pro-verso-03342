/**
 * 🏭 STEP COMPONENT FACTORY
 * 
 * Padrão de fábrica para renderização de componentes.
 * Resolve GARGALO #5: Renderização condicional complexa
 * 
 * BENEFÍCIOS:
 * ✅ Código escalável (adicionar tipo não modifica factory)
 * ✅ Carregamento lazy de componentes
 * ✅ Fácil teste isolado
 * ✅ Registry extensível
 */

import React, { Suspense, lazy } from 'react';
import type { EditorStep } from '../types/EditorStepTypes';
import { adapterRegistry } from '../adapters/ComponentAdapterRegistry';
import { stepValidator } from '../validation/StepValidator';

// 🎭 Configuração de um componente na factory
export interface ComponentConfig {
  type: string;
  component: React.LazyExoticComponent<React.ComponentType<any>> | React.ComponentType<any>;
  fallback?: React.ComponentType;
  preload?: boolean;
}

// 🎨 Props padrão para componentes editáveis
export interface EditableStepProps {
  step: EditorStep;
  onStepUpdate?: (stepId: string, updates: Partial<EditorStep>) => void;
  onDataChange?: (stepId: string, data: any) => void;
  onValidationChange?: (stepId: string, isValid: boolean, errors: string[]) => void;
  isSelected?: boolean;
  isEditing?: boolean;
  readOnly?: boolean;
}

// 🔧 Componente de loading padrão
const DefaultLoadingFallback: React.FC = () => (
  <div className="animate-pulse p-4 border rounded-lg bg-gray-50">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);

// ❌ Componente de erro padrão
const DefaultErrorFallback: React.FC<{ error: string; stepType: string }> = ({ error, stepType }) => (
  <div className="p-4 border-2 border-red-300 bg-red-50 rounded-lg">
    <h3 className="font-medium text-red-800 mb-2">
      ⚠️ Erro ao renderizar componente
    </h3>
    <p className="text-red-600 text-sm mb-1">
      Tipo: <code>{stepType}</code>
    </p>
    <p className="text-red-600 text-sm">
      Erro: {error}
    </p>
  </div>
);

// 🏭 Classe principal da Factory
export class StepComponentFactory {
  private registry = new Map<string, ComponentConfig>();
  private preloadedComponents = new Set<string>();
  
  // ➕ Registrar componente
  register(config: ComponentConfig): void {
    this.registry.set(config.type, config);
    
    // Preload se solicitado
    if (config.preload && 'preload' in config.component) {
      config.component.preload?.();
      this.preloadedComponents.add(config.type);
    }
  }
  
  // 📋 Registrar múltiplos componentes
  registerMultiple(configs: ComponentConfig[]): void {
    configs.forEach(config => this.register(config));
  }
  
  // 🔍 Verificar se tipo é suportado
  isSupported(type: string): boolean {
    return this.registry.has(type);
  }
  
  // 📋 Listar tipos suportados
  getSupportedTypes(): string[] {
    return Array.from(this.registry.keys());
  }
  
  // 🏗️ Criar componente
  create(step: EditorStep, props: Partial<EditableStepProps> = {}): React.ReactElement {
    const config = this.registry.get(step.type);
    
    if (!config) {
      return React.createElement(DefaultErrorFallback, {
        error: `Tipo não suportado: ${step.type}`,
        stepType: step.type
      });
    }
    
    // Validar step antes de renderizar
    const validation = stepValidator.validate(step);
    
    // Props finais
    const finalProps: EditableStepProps = {
      step,
      isSelected: false,
      isEditing: true,
      readOnly: false,
      ...props,
      onValidationChange: (stepId, isValid, errors) => {
        props.onValidationChange?.(stepId, isValid, errors);
      }
    };
    
    // Componente com Suspense se for lazy
    if ('preload' in config.component) {
      return React.createElement(
        Suspense,
        { fallback: React.createElement(config.fallback || DefaultLoadingFallback) },
        React.createElement(config.component, finalProps)
      );
    }
    
    // Componente normal
    return React.createElement(config.component, finalProps);
  }
  
  // 🚀 Preload componente
  async preload(type: string): Promise<void> {
    const config = this.registry.get(type);
    
    if (config && 'preload' in config.component && !this.preloadedComponents.has(type)) {
      await config.component.preload?.();
      this.preloadedComponents.add(type);
    }
  }
  
  // 🎯 Preload múltiplos componentes
  async preloadMultiple(types: string[]): Promise<void> {
    await Promise.all(types.map(type => this.preload(type)));
  }
  
  // 🧹 Limpar registry
  clear(): void {
    this.registry.clear();
    this.preloadedComponents.clear();
  }
  
  // 📊 Estatísticas da factory
  getStats() {
    return {
      totalRegistered: this.registry.size,
      preloaded: this.preloadedComponents.size,
      types: this.getSupportedTypes()
    };
  }
}

// 🌍 Instância global da factory
export const stepComponentFactory = new StepComponentFactory();

// 🎣 Hook para usar a factory
export function useStepComponent(step: EditorStep) {
  return React.useMemo(() => {
    return stepComponentFactory.isSupported(step.type);
  }, [step.type]);
}

// 🎨 Componente wrapper que usa a factory
interface FactoryRenderedStepProps extends Partial<EditableStepProps> {
  step: EditorStep;
}

export const FactoryRenderedStep: React.FC<FactoryRenderedStepProps> = ({
  step,
  ...props
}) => {
  const [error, setError] = React.useState<string | null>(null);
  
  // Error boundary manual
  React.useEffect(() => {
    setError(null);
  }, [step.type, step.id]);
  
  try {
    return stepComponentFactory.create(step, props);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
    
    return React.createElement(DefaultErrorFallback, {
      error: errorMessage,
      stepType: step.type
    });
  }
};

// 🔧 Configuração automática dos componentes editáveis
export function setupDefaultComponents() {
  // Lazy imports dos componentes editáveis
  const EditableIntroStep = lazy(() => import('../editable-steps/EditableIntroStep'));
  const EditableQuestionStep = lazy(() => import('../editable-steps/EditableQuestionStep'));
  const EditableResultStep = lazy(() => import('../editable-steps/EditableResultStep'));
  const EditableTransitionStep = lazy(() => import('../editable-steps/EditableTransitionStep'));
  const EditableOfferStep = lazy(() => import('../editable-steps/EditableOfferStep'));
  const EditableStrategicQuestionStep = lazy(() => import('../editable-steps/EditableStrategicQuestionStep'));
  
  // Registrar componentes na factory
  stepComponentFactory.registerMultiple([
    {
      type: 'intro',
      component: EditableIntroStep,
      preload: true
    },
    {
      type: 'question',
      component: EditableQuestionStep,
      preload: true
    },
    {
      type: 'result',
      component: EditableResultStep,
      preload: false // Carregar sob demanda
    },
    {
      type: 'transition',
      component: EditableTransitionStep,
      preload: true
    },
    {
      type: 'offer',
      component: EditableOfferStep,
      preload: false
    },
    {
      type: 'strategic_question',
      component: EditableStrategicQuestionStep,
      preload: true
    },
    {
      type: 'email_capture',
      component: EditableStrategicQuestionStep, // Reutiliza
      preload: true
    },
    {
      type: 'thank_you',
      component: EditableTransitionStep, // Reutiliza
      preload: true
    }
  ]);
}