/**
 * 🎨 INTEGRAÇÃO COM EDITOR VISUAL HEADLESS
 * 
 * Sistema para integrar o esquema unificado com o editor visual /editor,
 * permitindo edição ao vivo, painel de propriedades completo e preview real.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { QuizFunnelSchema, FunnelStep } from '../../types/quiz-schema';
import { QuizTemplateAdapter } from '../migration/QuizTemplateAdapter';

// ============================================================================
// CONTEXTO DO EDITOR HEADLESS
// ============================================================================

interface HeadlessEditorContextType {
  // Schema atual
  schema: QuizFunnelSchema | null;

  // Estado do editor
  isLoading: boolean;
  isDirty: boolean;
  lastSaved: string | null;

  // Etapa atual sendo editada
  currentStep: FunnelStep | null;
  currentStepIndex: number;

  // Ações do editor
  loadSchema: (schemaId?: string) => Promise<void>;
  saveSchema: () => Promise<void>;
  updateStep: (stepId: string, updates: Partial<FunnelStep>) => void;
  updateGlobalSettings: (updates: Partial<QuizFunnelSchema['settings']>) => void;
  updatePublicationSettings: (updates: Partial<QuizFunnelSchema['publication']>) => void;

  // Navegação
  selectStep: (stepId: string) => void;
  goToStep: (index: number) => void;
  addStep: (afterStepId?: string) => void;
  removeStep: (stepId: string) => void;

  // Preview
  previewMode: 'desktop' | 'tablet' | 'mobile';
  setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;

  // Publicação
  publishSchema: () => Promise<void>;
  unpublishSchema: () => Promise<void>;

  // Validação
  validationErrors: ValidationError[];
  validateSchema: () => ValidationError[];
}

interface ValidationError {
  path: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

const HeadlessEditorContext = React.createContext<HeadlessEditorContextType | null>(null);

// ============================================================================
// PROVIDER DO EDITOR HEADLESS
// ============================================================================

interface HeadlessEditorProviderProps {
  children: React.ReactNode;
  schemaId?: string;
  autoSave?: boolean;
  autoSaveInterval?: number;
}

export const HeadlessEditorProvider: React.FC<HeadlessEditorProviderProps> = ({
  children,
  schemaId,
  autoSave = true,
  autoSaveInterval = 30000
}) => {
  // Estados principais
  const [schema, setSchema] = useState<QuizFunnelSchema | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  // Estado computado
  const currentStep = useMemo(() => {
    return schema?.steps[currentStepIndex] || null;
  }, [schema, currentStepIndex]);

  // ============================================================================
  // CARREGAMENTO DE SCHEMA
  // ============================================================================

  const loadSchema = useCallback(async (targetSchemaId?: string) => {
    setIsLoading(true);
    try {
      let loadedSchema: QuizFunnelSchema;

      if (targetSchemaId) {
        // Carregar schema específico (TODO: implementar carregamento de storage)
        loadedSchema = await loadSchemaFromStorage(targetSchemaId);
      } else {
        // Migrar do template legacy
        console.log('🔄 Carregando schema através de migração do template legacy...');
        loadedSchema = await QuizTemplateAdapter.convertLegacyTemplate();
      }

      setSchema(loadedSchema);
      setCurrentStepIndex(0);
      setIsDirty(false);
      setLastSaved(loadedSchema.editorMeta.lastModified);

      // Validar schema carregado
      const errors = validateSchemaInternal(loadedSchema);
      setValidationErrors(errors);

      console.log('✅ Schema carregado com sucesso:', loadedSchema.id);

    } catch (error) {
      console.error('❌ Erro ao carregar schema:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============================================================================
  // SALVAMENTO DE SCHEMA
  // ============================================================================

  const saveSchema = useCallback(async () => {
    if (!schema || !isDirty) return;

    setIsLoading(true);
    try {
      // Atualizar metadados
      const updatedSchema: QuizFunnelSchema = {
        ...schema,
        editorMeta: {
          ...schema.editorMeta,
          lastModified: new Date().toISOString(),
          stats: {
            ...schema.editorMeta.stats,
            totalBlocks: schema.steps.reduce((acc, step) => acc + step.blocks.length, 0),
            totalSteps: schema.steps.length
          }
        }
      };

      // Salvar no storage
      await saveSchemaToStorage(updatedSchema);

      setSchema(updatedSchema);
      setIsDirty(false);
      setLastSaved(updatedSchema.editorMeta.lastModified);

      console.log('💾 Schema salvo com sucesso');

    } catch (error) {
      console.error('❌ Erro ao salvar schema:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [schema, isDirty]);

  // ============================================================================
  // ATUALIZAÇÕES DE CONTEÚDO
  // ============================================================================

  const updateStep = useCallback((stepId: string, updates: Partial<FunnelStep>) => {
    if (!schema) return;

    const updatedSteps = schema.steps.map(step =>
      step.id === stepId ? { ...step, ...updates } : step
    );

    setSchema({ ...schema, steps: updatedSteps });
    setIsDirty(true);

    console.log(`📝 Etapa ${stepId} atualizada`);
  }, [schema]);

  const updateGlobalSettings = useCallback((updates: Partial<QuizFunnelSchema['settings']>) => {
    if (!schema) return;

    setSchema({
      ...schema,
      settings: { ...schema.settings, ...updates }
    });
    setIsDirty(true);

    console.log('⚙️ Configurações globais atualizadas');
  }, [schema]);

  const updatePublicationSettings = useCallback((updates: Partial<QuizFunnelSchema['publication']>) => {
    if (!schema) return;

    setSchema({
      ...schema,
      publication: { ...schema.publication, ...updates }
    });
    setIsDirty(true);

    console.log('📢 Configurações de publicação atualizadas');
  }, [schema]);

  // ============================================================================
  // NAVEGAÇÃO ENTRE ETAPAS
  // ============================================================================

  const selectStep = useCallback((stepId: string) => {
    if (!schema) return;

    const stepIndex = schema.steps.findIndex(step => step.id === stepId);
    if (stepIndex !== -1) {
      setCurrentStepIndex(stepIndex);
      console.log(`👆 Etapa selecionada: ${stepId}`);
    }
  }, [schema]);

  const goToStep = useCallback((index: number) => {
    if (!schema || index < 0 || index >= schema.steps.length) return;

    setCurrentStepIndex(index);
    console.log(`➡️ Navegando para etapa ${index + 1}`);
  }, [schema]);

  // ============================================================================
  // MANIPULAÇÃO DE ETAPAS
  // ============================================================================

  const addStep = useCallback((afterStepId?: string) => {
    if (!schema) return;

    let insertIndex = schema.steps.length;
    if (afterStepId) {
      const afterIndex = schema.steps.findIndex(step => step.id === afterStepId);
      if (afterIndex !== -1) {
        insertIndex = afterIndex + 1;
      }
    }

    const newStepNumber = Math.max(...schema.steps.map(s => s.order)) + 1;
    const newStep: FunnelStep = {
      id: `step-${newStepNumber}`,
      name: `Nova Etapa ${newStepNumber}`,
      description: 'Etapa criada pelo editor',
      order: newStepNumber,
      type: 'custom',

      settings: {
        showProgress: true,
        progressStyle: 'bar',
        showBackButton: true,
        showNextButton: true,
        allowSkip: false,
        trackTimeOnStep: true,
        trackInteractions: true,
        customEvents: []
      },

      blocks: [],

      navigation: {
        conditions: [],
        nextStep: undefined,
        prevStep: insertIndex > 0 ? schema.steps[insertIndex - 1].id : undefined,
        actions: []
      },

      validation: {
        required: false,
        customRules: [],
        errorMessages: {}
      }
    };

    const updatedSteps = [
      ...schema.steps.slice(0, insertIndex),
      newStep,
      ...schema.steps.slice(insertIndex)
    ];

    setSchema({ ...schema, steps: updatedSteps });
    setIsDirty(true);
    setCurrentStepIndex(insertIndex);

    console.log(`➕ Nova etapa adicionada: ${newStep.id}`);
  }, [schema]);

  const removeStep = useCallback((stepId: string) => {
    if (!schema) return;

    const stepIndex = schema.steps.findIndex(step => step.id === stepId);
    if (stepIndex === -1) return;

    const updatedSteps = schema.steps.filter(step => step.id !== stepId);

    // Ajustar índice atual se necessário
    let newCurrentIndex = currentStepIndex;
    if (stepIndex <= currentStepIndex && currentStepIndex > 0) {
      newCurrentIndex = currentStepIndex - 1;
    }

    setSchema({ ...schema, steps: updatedSteps });
    setIsDirty(true);
    setCurrentStepIndex(newCurrentIndex);

    console.log(`❌ Etapa removida: ${stepId}`);
  }, [schema, currentStepIndex]);

  // ============================================================================
  // PUBLICAÇÃO
  // ============================================================================

  const publishSchema = useCallback(async () => {
    if (!schema) return;

    // Validar antes de publicar
    const errors = validateSchemaInternal(schema);
    const criticalErrors = errors.filter(e => e.severity === 'error');

    if (criticalErrors.length > 0) {
      throw new Error(`Não é possível publicar: ${criticalErrors.map(e => e.message).join(', ')}`);
    }

    const publishedSchema: QuizFunnelSchema = {
      ...schema,
      publication: {
        ...schema.publication,
        status: 'published',
        publishedAt: new Date().toISOString()
      }
    };

    await saveSchemaToStorage(publishedSchema);
    setSchema(publishedSchema);
    setIsDirty(false);

    console.log('🚀 Schema publicado com sucesso!');
  }, [schema]);

  const unpublishSchema = useCallback(async () => {
    if (!schema) return;

    const unpublishedSchema: QuizFunnelSchema = {
      ...schema,
      publication: {
        ...schema.publication,
        status: 'draft'
      }
    };

    await saveSchemaToStorage(unpublishedSchema);
    setSchema(unpublishedSchema);
    setIsDirty(false);

    console.log('📝 Schema despublicado');
  }, [schema]);

  // ============================================================================
  // VALIDAÇÃO
  // ============================================================================

  const validateSchema = useCallback((): ValidationError[] => {
    if (!schema) return [];

    const errors = validateSchemaInternal(schema);
    setValidationErrors(errors);
    return errors;
  }, [schema]);

  // ============================================================================
  // AUTO SAVE
  // ============================================================================

  useEffect(() => {
    if (!autoSave || !isDirty) return;

    const autoSaveTimer = setTimeout(() => {
      saveSchema();
    }, autoSaveInterval);

    return () => clearTimeout(autoSaveTimer);
  }, [autoSave, autoSaveInterval, isDirty, saveSchema]);

  // ============================================================================
  // INICIALIZAÇÃO
  // ============================================================================

  useEffect(() => {
    loadSchema(schemaId);
  }, [loadSchema, schemaId]);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const contextValue: HeadlessEditorContextType = {
    schema,
    isLoading,
    isDirty,
    lastSaved,
    currentStep,
    currentStepIndex,

    loadSchema,
    saveSchema,
    updateStep,
    updateGlobalSettings,
    updatePublicationSettings,

    selectStep,
    goToStep,
    addStep,
    removeStep,

    previewMode,
    setPreviewMode,

    publishSchema,
    unpublishSchema,

    validationErrors,
    validateSchema
  };

  return (
    <HeadlessEditorContext.Provider value={contextValue}>
      {children}
    </HeadlessEditorContext.Provider>
  );
};

// ============================================================================
// HOOK PARA USAR O CONTEXTO
// ============================================================================

export const useHeadlessEditor = () => {
  const context = React.useContext(HeadlessEditorContext);
  if (!context) {
    throw new Error('useHeadlessEditor deve ser usado dentro de HeadlessEditorProvider');
  }
  return context;
};

// ============================================================================
// UTILITÁRIOS INTERNOS
// ============================================================================

async function loadSchemaFromStorage(schemaId: string): Promise<QuizFunnelSchema> {
  // TODO: Implementar carregamento real do storage
  console.log(`📂 Carregando schema do storage: ${schemaId}`);
  throw new Error('Carregamento de schema específico não implementado ainda');
}

async function saveSchemaToStorage(schema: QuizFunnelSchema): Promise<void> {
  // TODO: Implementar salvamento real no storage
  console.log(`💾 Salvando schema no storage: ${schema.id}`);

  // Por enquanto, salvar no localStorage
  localStorage.setItem(`headless_schema_${schema.id}`, JSON.stringify(schema));
}

function validateSchemaInternal(schema: QuizFunnelSchema): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validações básicas
  if (!schema.id) {
    errors.push({
      path: 'id',
      message: 'ID do schema é obrigatório',
      severity: 'error'
    });
  }

  if (!schema.name) {
    errors.push({
      path: 'name',
      message: 'Nome do schema é obrigatório',
      severity: 'error'
    });
  }

  if (schema.steps.length === 0) {
    errors.push({
      path: 'steps',
      message: 'Schema deve ter pelo menos uma etapa',
      severity: 'error'
    });
  }

  // Validar etapas
  schema.steps.forEach((step, index) => {
    if (!step.id) {
      errors.push({
        path: `steps[${index}].id`,
        message: 'ID da etapa é obrigatório',
        severity: 'error'
      });
    }

    if (!step.name) {
      errors.push({
        path: `steps[${index}].name`,
        message: 'Nome da etapa é obrigatório',
        severity: 'error'
      });
    }

    if (step.blocks.length === 0) {
      errors.push({
        path: `steps[${index}].blocks`,
        message: `Etapa "${step.name}" não possui blocos de conteúdo`,
        severity: 'warning'
      });
    }
  });

  // Validar configurações de SEO
  if (!schema.settings.seo.title) {
    errors.push({
      path: 'settings.seo.title',
      message: 'Título SEO é obrigatório',
      severity: 'warning'
    });
  }

  if (!schema.settings.seo.description) {
    errors.push({
      path: 'settings.seo.description',
      message: 'Descrição SEO é obrigatória',
      severity: 'warning'
    });
  }

  return errors;
}