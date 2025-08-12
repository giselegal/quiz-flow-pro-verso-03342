/**
 * 🎯 INTEGRAÇÃO JSON - HOOK PARA /EDITOR-FIXED EXISTENTE
 *
 * Injeta capacidades JSON no editor atual SEM QUEBRAR NADA.
 * Funciona como um "addon" ao editor existente.
 */

import { Block } from '@/types/editor';
import { useCallback, useEffect, useState } from 'react';
import { JsonTemplate, useJsonTemplate } from './JsonTemplateEngine';
import { TemplateAdapter } from './TemplateAdapter';

// =============================================
// HOOK PRINCIPAL PARA O EDITOR
// =============================================

export interface UseEditorWithJsonReturn {
  // Estados do JSON
  currentTemplate: JsonTemplate | null;
  isLoadingTemplate: boolean;
  templateError: string | null;
  availableTemplates: string[];

  // Funções de template
  loadStepTemplate: (stepNumber: number) => Promise<boolean>;
  loadCustomTemplate: (templatePath: string) => Promise<boolean>;
  exportCurrentAsTemplate: (metadata?: Partial<JsonTemplate>) => JsonTemplate;
  saveTemplateToFile: (template: JsonTemplate, filename?: string) => void;

  // Funções de manipulação
  applyTemplateToEditor: (template: JsonTemplate) => Block[];
  mergeTemplateWithExisting: (template: JsonTemplate, existingBlocks: Block[]) => Block[];

  // Utilitários
  getTemplatePreview: (template: JsonTemplate) => string;
  validateCurrentTemplate: () => { isValid: boolean; errors: string[]; warnings: string[] };
  getAvailableComponents: () => Array<{ type: string; component: string; category: string }>;

  // Reset
  clearTemplate: () => void;
}

/**
 * 🔗 HOOK PRINCIPAL: useEditorWithJson
 * Adiciona funcionalidades JSON ao editor existente
 */
export const useEditorWithJson = (
  currentBlocks: Block[] = [],
  onBlocksChange?: (blocks: Block[]) => void
): UseEditorWithJsonReturn => {
  const [currentTemplate, setCurrentTemplate] = useState<JsonTemplate | null>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [templateError, setTemplateError] = useState<string | null>(null);
  const [availableTemplates, setAvailableTemplates] = useState<string[]>([]);

  const { applyTemplate, exportTemplate, validateTemplate, getAvailableComponents } =
    useJsonTemplate();

  // =============================================
  // CARREGAR TEMPLATE DAS 21 ETAPAS
  // =============================================

  const loadStepTemplate = useCallback(
    async (stepNumber: number): Promise<boolean> => {
      if (stepNumber < 1 || stepNumber > 21) {
        setTemplateError('Número da etapa deve estar entre 1 e 21');
        return false;
      }

      setIsLoadingTemplate(true);
      setTemplateError(null);

      try {
        // Usar o adaptador para carregar e converter template existente
        const template = await TemplateAdapter.loadStepTemplate(stepNumber);

        if (!template) {
          setTemplateError(`Template da etapa ${stepNumber} não encontrado`);
          return false;
        }

        setCurrentTemplate(template);

        // Aplicar automaticamente ao editor se callback fornecido
        if (onBlocksChange) {
          const blocks = applyTemplate(template);
          onBlocksChange(blocks);
        }

        return true;
      } catch (error) {
        const errorMsg = `Erro ao carregar etapa ${stepNumber}: ${error}`;
        setTemplateError(errorMsg);
        console.error('❌', errorMsg);
        return false;
      } finally {
        setIsLoadingTemplate(false);
      }
    },
    [applyTemplate, onBlocksChange]
  );

  // =============================================
  // CARREGAR TEMPLATE PERSONALIZADO
  // =============================================

  const loadCustomTemplate = useCallback(
    async (templatePath: string): Promise<boolean> => {
      setIsLoadingTemplate(true);
      setTemplateError(null);

      try {
        // Usar o adaptador para carregar e converter template
        const template = await TemplateAdapter.loadAndConvertTemplate(templatePath);

        if (!template) {
          setTemplateError(`Template não encontrado: ${templatePath}`);
          return false;
        }

        setCurrentTemplate(template);

        // Aplicar automaticamente se callback fornecido
        if (onBlocksChange) {
          const blocks = applyTemplate(template);
          onBlocksChange(blocks);
        }

        return true;
      } catch (error) {
        const errorMsg = `Erro ao carregar template: ${error}`;
        setTemplateError(errorMsg);
        console.error('❌', errorMsg);
        return false;
      } finally {
        setIsLoadingTemplate(false);
      }
    },
    [applyTemplate, onBlocksChange]
  );

  // =============================================
  // EXPORTAR CONFIGURAÇÃO ATUAL COMO TEMPLATE
  // =============================================

  const exportCurrentAsTemplate = useCallback(
    (metadata?: Partial<JsonTemplate>): JsonTemplate => {
      return exportTemplate(currentBlocks, metadata);
    },
    [exportTemplate, currentBlocks]
  );

  // =============================================
  // SALVAR TEMPLATE EM ARQUIVO
  // =============================================

  const saveTemplateToFile = useCallback((template: JsonTemplate, filename?: string) => {
    const finalFilename = filename || `template-${template.id}.json`;
    const content = JSON.stringify(template, null, 2);

    // Criar blob e download
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = finalFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }, []);

  // =============================================
  // APLICAR TEMPLATE AO EDITOR
  // =============================================

  const applyTemplateToEditor = useCallback(
    (template: JsonTemplate): Block[] => {
      const blocks = applyTemplate(template);
      setCurrentTemplate(template);

      if (onBlocksChange) {
        onBlocksChange(blocks);
      }

      return blocks;
    },
    [applyTemplate, onBlocksChange]
  );

  // =============================================
  // MESCLAR TEMPLATE COM BLOCOS EXISTENTES
  // =============================================

  const mergeTemplateWithExisting = useCallback(
    (template: JsonTemplate, existingBlocks: Block[]): Block[] => {
      const templateBlocks = applyTemplate(template);

      // Estratégia: adicionar blocos do template DEPOIS dos existentes
      const maxOrder =
        existingBlocks.length > 0 ? Math.max(...existingBlocks.map(b => b.order || 0)) : 0;

      const adjustedTemplateBlocks = templateBlocks.map((block, index) => ({
        ...block,
        id: `template-${block.id}`, // Evitar conflitos de ID
        order: maxOrder + index + 1,
      }));

      const mergedBlocks = [...existingBlocks, ...adjustedTemplateBlocks];

      if (onBlocksChange) {
        onBlocksChange(mergedBlocks);
      }

      return mergedBlocks;
    },
    [applyTemplate, onBlocksChange]
  );

  // =============================================
  // PREVIEW DO TEMPLATE
  // =============================================

  const getTemplatePreview = useCallback((template: JsonTemplate): string => {
    const blocksCount = template.blocks.length;
    const blockTypes = [...new Set(template.blocks.map(b => b.type))];

    return `${template.name} (${blocksCount} blocos: ${blockTypes.slice(0, 3).join(', ')}${blockTypes.length > 3 ? '...' : ''})`;
  }, []);

  // =============================================
  // VALIDAÇÃO
  // =============================================

  const validateCurrentTemplate = useCallback(() => {
    if (!currentTemplate) {
      return {
        isValid: false,
        errors: ['Nenhum template carregado'],
        warnings: [],
      };
    }

    return validateTemplate(currentTemplate);
  }, [currentTemplate, validateTemplate]);

  // =============================================
  // DESCOBRIR TEMPLATES DISPONÍVEIS
  // =============================================

  useEffect(() => {
    const discoverTemplates = () => {
      const templates: string[] = [];

      // Templates das 21 etapas
      for (let i = 1; i <= 21; i++) {
        const stepId = i.toString().padStart(2, '0');
        templates.push(`step-${stepId}`);
      }

      setAvailableTemplates(templates);
    };

    discoverTemplates();
  }, []);

  // =============================================
  // LIMPEZA
  // =============================================

  const clearTemplate = useCallback(() => {
    setCurrentTemplate(null);
    setTemplateError(null);
  }, []);

  // =============================================
  // RETORNO DO HOOK
  // =============================================

  return {
    // Estados
    currentTemplate,
    isLoadingTemplate,
    templateError,
    availableTemplates,

    // Funções principais
    loadStepTemplate,
    loadCustomTemplate,
    exportCurrentAsTemplate,
    saveTemplateToFile,

    // Manipulação
    applyTemplateToEditor,
    mergeTemplateWithExisting,

    // Utilitários
    getTemplatePreview,
    validateCurrentTemplate,
    getAvailableComponents,

    // Reset
    clearTemplate,
  };
};

export default useEditorWithJson;
