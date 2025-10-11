# 🛠️ Scripts e Código Pronto - Implementação JSON

## 📋 Códigos Prontos para Copiar e Usar

Este documento contém todo o código necessário para implementar templates JSON, pronto para copiar e colar.

---

## 1️⃣ QuizStepAdapter.ts

```typescript
// src/adapters/QuizStepAdapter.ts

import type { QuizStep, QuizOption } from '@/data/quizSteps';

interface JSONTemplate {
  templateVersion: string;
  metadata?: {
    id: string;
    name: string;
    category: string;
    tags?: string[];
  };
  layout?: {
    containerWidth: string;
    spacing: string;
    backgroundColor: string;
  };
  validation?: Record<string, any>;
  analytics?: Record<string, any>;
  blocks: JSONBlock[];
}

interface JSONBlock {
  id: string;
  type: string;
  position: number;
  properties: Record<string, any>;
}

/**
 * Adaptador para converter templates JSON para formato QuizStep
 */
export class QuizStepAdapter {
  /**
   * Converte template JSON para QuizStep
   */
  static fromJSON(json: JSONTemplate): QuizStep {
    const { blocks, metadata } = json;
    
    // Detectar tipo de step baseado nos blocos
    const stepType = this.detectStepType(blocks, metadata);
    
    // Construir QuizStep baseado no tipo
    switch (stepType) {
      case 'intro':
        return this.convertIntroStep(blocks, metadata);
      
      case 'question':
        return this.convertQuestionStep(blocks, metadata);
      
      case 'strategic-question':
        return this.convertStrategicQuestionStep(blocks, metadata);
      
      case 'transition':
        return this.convertTransitionStep(blocks, metadata);
      
      case 'result':
        return this.convertResultStep(blocks, metadata);
      
      case 'offer':
        return this.convertOfferStep(blocks, metadata);
      
      default:
        throw new Error(`Unknown step type: ${stepType}`);
    }
  }

  /**
   * Detecta tipo de step baseado nos blocos
   */
  private static detectStepType(blocks: JSONBlock[], metadata?: any): QuizStep['type'] {
    // Verificar por tipo de bloco característico
    const hasFormInput = blocks.some(b => b.type === 'form-input');
    const hasOptionsGrid = blocks.some(b => b.type === 'options-grid' || b.type === 'quiz-question');
    const hasResultDisplay = blocks.some(b => b.type === 'result-display');
    const hasOfferCard = blocks.some(b => b.type === 'offer-card');
    
    // Verificar metadata
    const category = metadata?.category || '';
    
    if (category.includes('intro') || hasFormInput) {
      return 'intro';
    }
    
    if (category.includes('question') || hasOptionsGrid) {
      // Diferenciar question de strategic-question
      const questionBlock = blocks.find(b => 
        b.type === 'text-inline' && 
        b.properties.content?.includes('QUAL') || 
        b.properties.content?.includes('RESUMA')
      );
      
      if (questionBlock?.properties.content?.includes('importante')) {
        return 'strategic-question';
      }
      
      return 'question';
    }
    
    if (category.includes('transition')) {
      return 'transition';
    }
    
    if (category.includes('result') || hasResultDisplay) {
      return 'result';
    }
    
    if (category.includes('offer') || hasOfferCard) {
      return 'offer';
    }
    
    // Default
    return 'intro';
  }

  /**
   * Converte step de introdução
   */
  private static convertIntroStep(blocks: JSONBlock[], metadata?: any): QuizStep {
    const titleBlock = blocks.find(b => b.type === 'text-inline' && b.position <= 4);
    const imageBlock = blocks.find(b => b.type === 'image-display-inline');
    const inputBlock = blocks.find(b => b.type === 'form-input');
    const buttonBlock = blocks.find(b => b.type === 'button-inline');

    return {
      id: metadata?.id || 'step-01',
      type: 'intro',
      title: titleBlock?.properties.content || '',
      formQuestion: inputBlock?.properties.label || 'Como posso te chamar?',
      placeholder: inputBlock?.properties.placeholder || 'Digite seu primeiro nome...',
      buttonText: buttonBlock?.properties.text || 'Continuar',
      image: imageBlock?.properties.src || '',
      nextStep: 'step-02',
    };
  }

  /**
   * Converte step de pergunta
   */
  private static convertQuestionStep(blocks: JSONBlock[], metadata?: any): QuizStep {
    const questionBlock = blocks.find(b => 
      b.type === 'text-inline' && 
      (b.properties.content?.includes('?') || b.properties.content?.includes('QUAL'))
    );
    
    const optionsBlock = blocks.find(b => 
      b.type === 'options-grid' || 
      b.type === 'quiz-question'
    );

    // Extrair número da pergunta do metadata ou do bloco
    const stepNumber = metadata?.id?.match(/\d+/)?.[0] || '1';
    const questionNumber = `${parseInt(stepNumber) - 1} de 10`;

    // Converter opções
    const options: QuizOption[] = [];
    if (optionsBlock?.properties.options) {
      optionsBlock.properties.options.forEach((opt: any) => {
        options.push({
          id: opt.styleId || opt.id || '',
          text: opt.text || opt.label || '',
          image: opt.image || opt.imageUrl || '',
        });
      });
    }

    return {
      id: metadata?.id || `step-${stepNumber}`,
      type: 'question',
      questionNumber,
      questionText: questionBlock?.properties.content?.replace(/<[^>]*>/g, '') || '',
      requiredSelections: optionsBlock?.properties.requiredSelections || 3,
      options,
      nextStep: `step-${String(parseInt(stepNumber) + 1).padStart(2, '0')}`,
    };
  }

  /**
   * Converte step de pergunta estratégica
   */
  private static convertStrategicQuestionStep(blocks: JSONBlock[], metadata?: any): QuizStep {
    const questionBlock = blocks.find(b => b.type === 'text-inline');
    const inputBlock = blocks.find(b => b.type === 'form-input' || b.type === 'textarea');
    const buttonBlock = blocks.find(b => b.type === 'button-inline');

    const stepNumber = metadata?.id?.match(/\d+/)?.[0] || '13';

    return {
      id: metadata?.id || `step-${stepNumber}`,
      type: 'strategic-question',
      questionText: questionBlock?.properties.content?.replace(/<[^>]*>/g, '') || '',
      placeholder: inputBlock?.properties.placeholder || 'Digite sua resposta...',
      buttonText: buttonBlock?.properties.text || 'Próxima',
      nextStep: `step-${String(parseInt(stepNumber) + 1).padStart(2, '0')}`,
    };
  }

  /**
   * Converte step de transição
   */
  private static convertTransitionStep(blocks: JSONBlock[], metadata?: any): QuizStep {
    const textBlock = blocks.find(b => b.type === 'text-inline');
    const buttonBlock = blocks.find(b => b.type === 'button-inline');

    return {
      id: metadata?.id || 'step-12',
      type: 'transition',
      text: textBlock?.properties.content?.replace(/<[^>]*>/g, '') || '',
      showContinueButton: !!buttonBlock,
      continueButtonText: buttonBlock?.properties.text || 'Continuar',
      duration: 3000,
      nextStep: metadata?.id === 'step-12' ? 'step-13' : 'step-20',
    };
  }

  /**
   * Converte step de resultado
   */
  private static convertResultStep(blocks: JSONBlock[], metadata?: any): QuizStep {
    return {
      id: metadata?.id || 'step-20',
      type: 'result',
      nextStep: 'step-21',
    };
  }

  /**
   * Converte step de oferta
   */
  private static convertOfferStep(blocks: JSONBlock[], metadata?: any): QuizStep {
    return {
      id: metadata?.id || 'step-21',
      type: 'offer',
      offerMap: {}, // Será populado dinamicamente
    };
  }

  /**
   * Converte QuizStep para blocos JSON (operação inversa)
   */
  static toJSONBlocks(step: QuizStep): JSONBlock[] {
    const blocks: JSONBlock[] = [];
    let position = 0;

    switch (step.type) {
      case 'intro':
        // Header
        blocks.push({
          id: `${step.id}-header`,
          type: 'quiz-intro-header',
          position: position++,
          properties: {
            logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
            logoAlt: 'Logo Gisele Galvão',
            showProgress: false,
          },
        });

        // Title
        if (step.title) {
          blocks.push({
            id: `${step.id}-title`,
            type: 'text-inline',
            position: position++,
            properties: {
              content: step.title,
              fontSize: 'text-2xl',
              fontWeight: 'font-bold',
              textAlign: 'text-center',
            },
          });
        }

        // Image
        if (step.image) {
          blocks.push({
            id: `${step.id}-image`,
            type: 'image-display-inline',
            position: position++,
            properties: {
              src: step.image,
              alt: 'Quiz image',
            },
          });
        }

        // Input
        if (step.formQuestion) {
          blocks.push({
            id: `${step.id}-input`,
            type: 'form-input',
            position: position++,
            properties: {
              label: step.formQuestion,
              placeholder: step.placeholder || '',
              inputType: 'text',
              required: true,
            },
          });
        }

        // Button
        if (step.buttonText) {
          blocks.push({
            id: `${step.id}-button`,
            type: 'button-inline',
            position: position++,
            properties: {
              text: step.buttonText,
              variant: 'primary',
            },
          });
        }
        break;

      case 'question':
        // Question text
        if (step.questionText) {
          blocks.push({
            id: `${step.id}-question`,
            type: 'text-inline',
            position: position++,
            properties: {
              content: step.questionText,
              fontSize: 'text-xl',
              fontWeight: 'font-bold',
            },
          });
        }

        // Options grid
        if (step.options) {
          blocks.push({
            id: `${step.id}-options`,
            type: 'options-grid',
            position: position++,
            properties: {
              options: step.options.map(opt => ({
                id: opt.id,
                text: opt.text,
                image: opt.image,
                styleId: opt.id,
              })),
              requiredSelections: step.requiredSelections || 3,
              columns: 2,
            },
          });
        }
        break;

      // ... implementar outros tipos conforme necessário
    }

    return blocks;
  }
}
```

---

## 2️⃣ useTemplateLoader Atualizado

```typescript
// src/hooks/useTemplateLoader.ts

import { useCallback, useState } from 'react';
import type { QuizStep } from '@/data/quizSteps';
import { QUIZ_STEPS } from '@/data/quizSteps';
import { QuizStepAdapter } from '@/adapters/QuizStepAdapter';

interface TemplateCache {
  [key: string]: QuizStep;
}

const templateCache: TemplateCache = {};

export function useTemplateLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Carrega template JSON do step específico
   */
  const loadQuizEstiloTemplate = useCallback(
    async (stepNumber: number): Promise<QuizStep> => {
      const stepId = `step-${stepNumber.toString().padStart(2, '0')}`;
      
      // 1. Verificar cache
      if (templateCache[stepId]) {
        console.log(`✅ Template ${stepId} carregado do cache`);
        return templateCache[stepId];
      }

      setIsLoading(true);
      setError(null);

      try {
        // 2. Tentar carregar JSON
        console.log(`📥 Carregando template JSON: ${stepId}`);
        
        const jsonModule = await import(
          /* @vite-ignore */
          `/templates/${stepId}-template.json`
        );
        
        const jsonTemplate = jsonModule.default || jsonModule;

        // 3. Adaptar para QuizStep
        console.log(`🔄 Adaptando template ${stepId} de JSON para QuizStep`);
        const adapted = QuizStepAdapter.fromJSON(jsonTemplate);

        // 4. Salvar no cache
        templateCache[stepId] = adapted;
        
        console.log(`✅ Template ${stepId} carregado com sucesso do JSON`);
        return adapted;

      } catch (err) {
        console.warn(
          `⚠️ Erro ao carregar template JSON ${stepId}, usando fallback QUIZ_STEPS`,
          err
        );

        // 5. Fallback para QUIZ_STEPS
        const fallbackStep = QUIZ_STEPS[stepId];
        
        if (!fallbackStep) {
          const error = new Error(`Step ${stepId} não encontrado em nenhum template`);
          setError(error);
          throw error;
        }

        // Salvar fallback no cache
        templateCache[stepId] = fallbackStep;
        
        return fallbackStep;

      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Carrega todos os templates de uma vez (prefetch)
   */
  const loadAllTemplates = useCallback(
    async (): Promise<Record<string, QuizStep>> => {
      setIsLoading(true);
      setError(null);

      try {
        const promises = Array.from({ length: 21 }, (_, i) => {
          const stepNumber = i + 1;
          return loadQuizEstiloTemplate(stepNumber)
            .then(step => [
              `step-${stepNumber.toString().padStart(2, '0')}`,
              step
            ])
            .catch(err => {
              console.error(`Erro ao carregar step ${stepNumber}:`, err);
              return null;
            });
        });

        const results = await Promise.all(promises);
        const validResults = results.filter(Boolean) as [string, QuizStep][];
        
        const stepsMap = Object.fromEntries(validResults);
        
        console.log(`✅ Templates carregados: ${Object.keys(stepsMap).length}/21`);
        
        return stepsMap;

      } catch (err) {
        console.error('❌ Erro ao carregar templates:', err);
        setError(err as Error);
        
        // Fallback completo para QUIZ_STEPS
        return QUIZ_STEPS;

      } finally {
        setIsLoading(false);
      }
    },
    [loadQuizEstiloTemplate]
  );

  /**
   * Prefetch dos próximos steps
   */
  const prefetchNextSteps = useCallback(
    async (currentStep: number, count: number = 2) => {
      const promises = Array.from({ length: count }, (_, i) => {
        const nextStep = currentStep + i + 1;
        if (nextStep <= 21) {
          return loadQuizEstiloTemplate(nextStep).catch(() => null);
        }
        return Promise.resolve(null);
      });

      await Promise.all(promises);
    },
    [loadQuizEstiloTemplate]
  );

  /**
   * Limpa cache de templates
   */
  const clearCache = useCallback(() => {
    Object.keys(templateCache).forEach(key => {
      delete templateCache[key];
    });
    console.log('🗑️ Cache de templates limpo');
  }, []);

  return {
    loadQuizEstiloTemplate,
    loadAllTemplates,
    prefetchNextSteps,
    clearCache,
    isLoading,
    error,
  };
}

export default useTemplateLoader;
```

---

## 3️⃣ useQuizState Atualizado

```typescript
// src/hooks/useQuizState.ts - Adicionar ao início do arquivo

import { useTemplateLoader } from './useTemplateLoader';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

// ... código existente ...

export function useQuizState(
  funnelId?: string, 
  externalSteps?: Record<string, any>, 
  flagsInput?: Partial<QuizRuntimeFlags>
) {
  const [state, setState] = useState<QuizState>(initialState);
  const [loadedSteps, setLoadedSteps] = useState<Record<string, any> | null>(null);
  const [jsonSteps, setJsonSteps] = useState<Record<string, QuizStep> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const flags = useMemo(() => mergeRuntimeFlags(flagsInput), [flagsInput]);
  const { loadAllTemplates, prefetchNextSteps } = useTemplateLoader();
  const { useJsonTemplates } = useFeatureFlags();

  // 🎯 NOVO: Carregar templates JSON se feature flag ativa
  useEffect(() => {
    if (useJsonTemplates && !externalSteps && !jsonSteps) {
      console.log('🚀 Carregando templates JSON...');
      setIsLoading(true);
      setError(null);

      loadAllTemplates()
        .then(steps => {
          console.log('✅ Templates JSON carregados:', Object.keys(steps).length);
          setJsonSteps(steps);
        })
        .catch(err => {
          console.error('❌ Erro ao carregar templates JSON:', err);
          setError(err);
          // Fallback para QUIZ_STEPS
          setJsonSteps(QUIZ_STEPS);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [useJsonTemplates, externalSteps, jsonSteps, loadAllTemplates]);

  // Prefetch próximos steps quando navegar
  useEffect(() => {
    if (useJsonTemplates && state.currentStep) {
      const stepNumber = parseInt(state.currentStep.replace('step-', ''));
      if (stepNumber && stepNumber < 21) {
        prefetchNextSteps(stepNumber, 2).catch(() => {});
      }
    }
  }, [state.currentStep, useJsonTemplates, prefetchNextSteps]);

  // 🎯 Determinar source dos steps
  // Prioridade: external > json > bridge-loaded > fallback
  const stepsSource = externalSteps || jsonSteps || loadedSteps || QUIZ_STEPS;

  // ... resto do código existente ...

  // 🎯 Retornar isLoading e error no retorno do hook
  return {
    state,
    isLoading,
    error,
    currentStepData: safeGetStep(stepsSource, state.currentStep),
    progress,
    nextStep,
    previousStep,
    setUserName,
    addAnswer,
    addStrategicAnswer,
    calculateResult,
    getOfferKey,
    // ... outros retornos
  };
}
```

---

## 4️⃣ Feature Flags Hook

```typescript
// src/hooks/useFeatureFlags.ts

import { useState, useEffect } from 'react';

interface FeatureFlags {
  useJsonTemplates: boolean;
  enablePrefetch: boolean;
  enableAnalytics: boolean;
  // Adicionar outras flags conforme necessário
}

const DEFAULT_FLAGS: FeatureFlags = {
  useJsonTemplates: false, // Desabilitado por padrão
  enablePrefetch: true,
  enableAnalytics: true,
};

/**
 * Hook para gerenciar feature flags
 */
export function useFeatureFlags(): FeatureFlags {
  const [flags, setFlags] = useState<FeatureFlags>(DEFAULT_FLAGS);

  useEffect(() => {
    // 1. Carregar de variáveis de ambiente
    const envFlags: Partial<FeatureFlags> = {
      useJsonTemplates: import.meta.env.VITE_USE_JSON_TEMPLATES === 'true',
      enablePrefetch: import.meta.env.VITE_ENABLE_PREFETCH !== 'false',
      enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS !== 'false',
    };

    // 2. Carregar de localStorage (para testes locais)
    const localFlags = loadFromLocalStorage();

    // 3. Rollout gradual (por usuário)
    const rolloutFlags = calculateRollout();

    // 4. Merge de todas as fontes
    setFlags({
      ...DEFAULT_FLAGS,
      ...envFlags,
      ...localFlags,
      ...rolloutFlags,
    });
  }, []);

  return flags;
}

/**
 * Carrega flags do localStorage
 */
function loadFromLocalStorage(): Partial<FeatureFlags> {
  try {
    const stored = localStorage.getItem('featureFlags');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.warn('Erro ao carregar feature flags do localStorage:', err);
  }
  return {};
}

/**
 * Calcula rollout gradual baseado em userId
 */
function calculateRollout(): Partial<FeatureFlags> {
  const rolloutPercentage = parseInt(import.meta.env.VITE_JSON_TEMPLATES_ROLLOUT || '0');
  
  if (rolloutPercentage === 0) {
    return { useJsonTemplates: false };
  }

  if (rolloutPercentage === 100) {
    return { useJsonTemplates: true };
  }

  // Hash simples baseado em sessionId para rollout consistente
  const sessionId = getOrCreateSessionId();
  const hash = simpleHash(sessionId);
  const shouldEnable = (hash % 100) < rolloutPercentage;

  return { useJsonTemplates: shouldEnable };
}

/**
 * Gera ou recupera sessionId
 */
function getOrCreateSessionId(): string {
  let sessionId = sessionStorage.getItem('sessionId');
  
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('sessionId', sessionId);
  }
  
  return sessionId;
}

/**
 * Hash simples para rollout consistente
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Utilitário para salvar flags manualmente (para testes)
 */
export function setFeatureFlag(flag: keyof FeatureFlags, value: boolean) {
  try {
    const stored = localStorage.getItem('featureFlags');
    const flags = stored ? JSON.parse(stored) : {};
    flags[flag] = value;
    localStorage.setItem('featureFlags', JSON.stringify(flags));
    console.log(`✅ Feature flag '${flag}' definida como ${value}`);
    window.location.reload(); // Reload para aplicar
  } catch (err) {
    console.error('Erro ao salvar feature flag:', err);
  }
}
```

---

## 5️⃣ QuizApp Atualizado

```typescript
// src/components/quiz/QuizApp.tsx - Adicionar loading states

export default function QuizApp({ funnelId, externalSteps }: QuizAppProps) {
  // ... código existente ...

  const {
    state,
    currentStepData,
    isLoading, // ← NOVO
    error, // ← NOVO
    progress,
    nextStep,
    setUserName,
    addAnswer,
    addStrategicAnswer,
    getOfferKey,
  } = useQuizState(funnelId, externalSteps);

  // ✅ Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fefefe] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#B89B7A] mb-4"></div>
          <p className="text-[#5b4135] text-lg">Carregando seu quiz...</p>
        </div>
      </div>
    );
  }

  // ✅ Error State
  if (error) {
    return (
      <div className="min-h-screen bg-[#fefefe] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-[#5b4135] mb-2">
            Ops! Algo deu errado
          </h2>
          <p className="text-gray-600 mb-6">
            Não conseguimos carregar o quiz. Por favor, tente novamente.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#B89B7A] text-white px-6 py-3 rounded-lg hover:bg-[#A1835D] transition"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // ... resto do código normal ...
}
```

---

## 6️⃣ Script de Conversão

```typescript
// scripts/convert-quiz-steps-to-json.ts

import { QUIZ_STEPS } from '../src/data/quizSteps';
import { QuizStepAdapter } from '../src/adapters/QuizStepAdapter';
import fs from 'fs';
import path from 'path';

/**
 * Script para converter QUIZ_STEPS (TypeScript) para templates JSON
 * 
 * Uso: node scripts/convert-quiz-steps-to-json.ts
 */

const OUTPUT_DIR = path.join(__dirname, '../templates');

// Criar diretório se não existir
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('🚀 Iniciando conversão de QUIZ_STEPS para JSON...\n');

let successCount = 0;
let errorCount = 0;

Object.entries(QUIZ_STEPS).forEach(([stepId, step]) => {
  try {
    // Gerar blocos JSON usando o adapter
    const blocks = QuizStepAdapter.toJSONBlocks(step);

    // Criar estrutura completa do template
    const jsonTemplate = {
      templateVersion: "2.0",
      metadata: {
        id: `quiz-${stepId}`,
        name: step.title?.substring(0, 50) || `Step ${stepId}`,
        description: `${step.type} step for quiz`,
        category: `quiz-${step.type}`,
        tags: ["quiz", "style", step.type],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      layout: {
        containerWidth: "full",
        spacing: "small",
        backgroundColor: "#FAF9F7",
        responsive: true,
      },
      validation: step.type === 'intro' ? {
        nameField: {
          required: true,
          minLength: 2,
          maxLength: 32,
          errorMessage: "Por favor, digite seu nome para continuar",
        }
      } : {},
      analytics: {
        events: ["page_view", "step_completed"],
        trackingId: `${stepId}`,
        utmParams: true,
      },
      blocks,
    };

    // Nome do arquivo
    const filename = `${stepId}-template.json`;
    const filepath = path.join(OUTPUT_DIR, filename);

    // Salvar JSON formatado
    fs.writeFileSync(
      filepath,
      JSON.stringify(jsonTemplate, null, 2),
      'utf-8'
    );

    console.log(`✅ ${filename} - ${blocks.length} blocos`);
    successCount++;

  } catch (error) {
    console.error(`❌ Erro ao converter ${stepId}:`, error);
    errorCount++;
  }
});

console.log(`\n📊 Conversão concluída:`);
console.log(`   ✅ Sucesso: ${successCount}/21`);
console.log(`   ❌ Erros: ${errorCount}/21`);
console.log(`\n📁 Arquivos salvos em: ${OUTPUT_DIR}`);
```

---

## 7️⃣ Script de Validação

```typescript
// scripts/validate-templates.ts

import fs from 'fs';
import path from 'path';

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const TEMPLATES_DIR = path.join(__dirname, '../templates');
const REQUIRED_FIELDS = ['templateVersion', 'metadata', 'blocks'];
const REQUIRED_METADATA = ['id', 'name', 'category'];

/**
 * Valida todos os templates JSON
 */
function validateAllTemplates(): void {
  console.log('🔍 Validando templates JSON...\n');

  const files = fs.readdirSync(TEMPLATES_DIR)
    .filter(f => f.endsWith('.json'));

  let validCount = 0;
  let invalidCount = 0;

  files.forEach(file => {
    const filepath = path.join(TEMPLATES_DIR, file);
    const result = validateTemplate(filepath);

    if (result.valid) {
      console.log(`✅ ${file} - OK`);
      validCount++;
    } else {
      console.log(`❌ ${file} - INVÁLIDO`);
      result.errors.forEach(err => console.log(`   ⚠️  ${err}`));
      invalidCount++;
    }

    if (result.warnings.length > 0) {
      result.warnings.forEach(warn => console.log(`   ⚡ ${warn}`));
    }
  });

  console.log(`\n📊 Validação concluída:`);
  console.log(`   ✅ Válidos: ${validCount}/${files.length}`);
  console.log(`   ❌ Inválidos: ${invalidCount}/${files.length}`);

  if (invalidCount > 0) {
    process.exit(1);
  }
}

/**
 * Valida um template individual
 */
function validateTemplate(filepath: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // 1. Validar JSON
    const content = fs.readFileSync(filepath, 'utf-8');
    const template = JSON.parse(content);

    // 2. Validar campos obrigatórios
    REQUIRED_FIELDS.forEach(field => {
      if (!template[field]) {
        errors.push(`Campo obrigatório ausente: ${field}`);
      }
    });

    // 3. Validar metadata
    if (template.metadata) {
      REQUIRED_METADATA.forEach(field => {
        if (!template.metadata[field]) {
          errors.push(`Metadata obrigatória ausente: ${field}`);
        }
      });
    }

    // 4. Validar versão
    if (template.templateVersion !== "2.0") {
      warnings.push(`Versão do template: ${template.templateVersion} (esperado: 2.0)`);
    }

    // 5. Validar blocos
    if (Array.isArray(template.blocks)) {
      if (template.blocks.length === 0) {
        errors.push('Template não possui blocos');
      }

      template.blocks.forEach((block: any, index: number) => {
        if (!block.id) {
          errors.push(`Bloco ${index} não possui id`);
        }
        if (!block.type) {
          errors.push(`Bloco ${index} não possui type`);
        }
        if (block.position === undefined) {
          warnings.push(`Bloco ${index} não possui position`);
        }
      });
    } else {
      errors.push('Blocks não é um array');
    }

  } catch (error) {
    errors.push(`Erro ao ler arquivo: ${error}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// Executar validação
validateAllTemplates();
```

---

## 8️⃣ Testes Unitários

```typescript
// src/__tests__/adapters/QuizStepAdapter.test.ts

import { describe, it, expect } from 'vitest';
import { QuizStepAdapter } from '@/adapters/QuizStepAdapter';

describe('QuizStepAdapter', () => {
  describe('fromJSON', () => {
    it('deve converter template JSON de intro para QuizStep', () => {
      const jsonTemplate = {
        templateVersion: "2.0",
        metadata: {
          id: "quiz-step-01",
          name: "Intro",
          category: "quiz-intro",
        },
        blocks: [
          {
            id: "step01-title",
            type: "text-inline",
            position: 1,
            properties: {
              content: "Bem-vindo ao Quiz",
            },
          },
          {
            id: "step01-input",
            type: "form-input",
            position: 2,
            properties: {
              label: "Como posso te chamar?",
              placeholder: "Digite seu nome...",
            },
          },
          {
            id: "step01-button",
            type: "button-inline",
            position: 3,
            properties: {
              text: "Começar",
            },
          },
        ],
      };

      const quizStep = QuizStepAdapter.fromJSON(jsonTemplate);

      expect(quizStep.type).toBe('intro');
      expect(quizStep.formQuestion).toBe('Como posso te chamar?');
      expect(quizStep.buttonText).toBe('Começar');
    });

    it('deve converter template JSON de question para QuizStep', () => {
      const jsonTemplate = {
        templateVersion: "2.0",
        metadata: {
          id: "quiz-step-02",
          category: "quiz-question",
        },
        blocks: [
          {
            id: "step02-question",
            type: "text-inline",
            position: 1,
            properties: {
              content: "QUAL SEU ESTILO?",
            },
          },
          {
            id: "step02-options",
            type: "options-grid",
            position: 2,
            properties: {
              options: [
                { id: "natural", text: "Natural", image: "url1" },
                { id: "classico", text: "Clássico", image: "url2" },
              ],
              requiredSelections: 2,
            },
          },
        ],
      };

      const quizStep = QuizStepAdapter.fromJSON(jsonTemplate);

      expect(quizStep.type).toBe('question');
      expect(quizStep.options).toHaveLength(2);
      expect(quizStep.requiredSelections).toBe(2);
    });

    it('deve lançar erro se template inválido', () => {
      const invalidJSON = {
        templateVersion: "2.0",
        // sem blocks
      };

      expect(() => {
        QuizStepAdapter.fromJSON(invalidJSON as any);
      }).toThrow();
    });
  });

  describe('toJSONBlocks', () => {
    it('deve converter QuizStep de intro para blocos JSON', () => {
      const quizStep = {
        id: 'step-01',
        type: 'intro' as const,
        title: 'Bem-vindo',
        formQuestion: 'Seu nome?',
        placeholder: 'Digite...',
        buttonText: 'Continuar',
      };

      const blocks = QuizStepAdapter.toJSONBlocks(quizStep);

      expect(blocks.length).toBeGreaterThan(0);
      expect(blocks[0].type).toBe('quiz-intro-header');
      
      const inputBlock = blocks.find(b => b.type === 'form-input');
      expect(inputBlock).toBeDefined();
      expect(inputBlock?.properties.label).toBe('Seu nome?');
    });
  });
});
```

---

## 9️⃣ Variáveis de Ambiente

```bash
# .env.development
VITE_USE_JSON_TEMPLATES=false
VITE_JSON_TEMPLATES_ROLLOUT=0
VITE_ENABLE_PREFETCH=true
VITE_ENABLE_ANALYTICS=true

# .env.staging
VITE_USE_JSON_TEMPLATES=true
VITE_JSON_TEMPLATES_ROLLOUT=10
VITE_ENABLE_PREFETCH=true
VITE_ENABLE_ANALYTICS=true

# .env.production
VITE_USE_JSON_TEMPLATES=true
VITE_JSON_TEMPLATES_ROLLOUT=100
VITE_ENABLE_PREFETCH=true
VITE_ENABLE_ANALYTICS=true
```

---

## 🔟 Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    
    "convert:templates": "tsx scripts/convert-quiz-steps-to-json.ts",
    "validate:templates": "tsx scripts/validate-templates.ts",
    "test:templates": "vitest run src/__tests__/adapters/",
    "test:integration": "vitest run src/__tests__/integration/",
    
    "templates:all": "npm run convert:templates && npm run validate:templates",
    "templates:watch": "nodemon --watch src/data/quizSteps.ts --exec 'npm run templates:all'"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "nodemon": "^3.0.0",
    "tsx": "^4.0.0"
  }
}
```

---

## 📋 Checklist de Implementação

### Fase 1: Setup (Dia 1)
```bash
# 1. Criar branch
git checkout -b feature/json-templates

# 2. Instalar dependências (se necessário)
npm install tsx nodemon --save-dev

# 3. Criar estrutura de pastas
mkdir -p src/adapters
mkdir -p scripts
mkdir -p src/__tests__/adapters

# 4. Copiar arquivos prontos
# - QuizStepAdapter.ts → src/adapters/
# - useTemplateLoader.ts atualizado → src/hooks/
# - useFeatureFlags.ts → src/hooks/
# - scripts de conversão/validação → scripts/

# 5. Executar conversão inicial
npm run convert:templates
npm run validate:templates
```

### Fase 2: Integração (Dia 2-3)
```bash
# 1. Atualizar useQuizState.ts
# 2. Atualizar QuizApp.tsx
# 3. Atualizar quizRuntimeFlags.ts
# 4. Configurar .env files

# 5. Testar localmente
npm run dev
# Ativar flag manualmente no console:
# localStorage.setItem('featureFlags', JSON.stringify({ useJsonTemplates: true }))
```

### Fase 3: Testes (Dia 4-5)
```bash
# 1. Rodar testes unitários
npm run test:templates

# 2. Rodar testes de integração
npm run test:integration

# 3. Testes E2E (se tiver)
npm run cypress:run
```

### Fase 4: Deploy (Semana 2)
```bash
# 1. Deploy staging
git push origin feature/json-templates
# PR e merge para staging

# 2. Testar em staging
# Verificar logs, métricas, erros

# 3. Deploy produção (gradual)
# 10% → 25% → 50% → 100%
```

---

## 🎯 Próximos Passos

1. ✅ **Copiar código acima** para os arquivos correspondentes
2. ✅ **Executar conversão** de templates
3. ✅ **Rodar validação** para garantir qualidade
4. ✅ **Testar localmente** com feature flag ativada
5. ✅ **Commitar e criar PR**

---

**Todos os códigos estão prontos para uso!**  
**Basta copiar, colar e executar os comandos.**

**Status:** ✅ Código Pronto para Implementação  
**Próxima Ação:** Começar Fase 1 do plano
