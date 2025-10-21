/**
 * 🎯 CENTRALIZED TEMPLATE IMPORTS
 * 
 * Este arquivo centraliza todos os imports de templates para evitar
 * warnings do Vite sobre imports dinâmicos/estáticos misturados.
 */

// Import estático do template principal
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from './quiz21StepsComplete';
import { TemplateRegistry } from '@/services/TemplateRegistry';
import { normalizeTemplateBlocks } from '@/utils/blockNormalization';

// Export centralizado para uso em imports dinâmicos (fonte canônica)
export const getQuiz21StepsTemplate = () => {
  // Anexar metadado de origem no objeto retornado
  const normalized = normalizeTemplateBlocks(QUIZ_STYLE_21_STEPS_TEMPLATE);
  (normalized as any)._source = 'ts';
  return normalized as any;
};

// Função para carregar template de forma consistente
export const loadTemplate = async (templateId: string) => {
  // Fonte canônica única: TypeScript gerado a partir dos JSONs v3
  const stepNumber = templateId.replace(/^step-/, '').padStart(2, '0');
  const stepId = `step-${stepNumber}`;

  console.log(`📦 [loadTemplate] Fonte canônica (TS) para ${templateId}`);
  const template = normalizeTemplateBlocks(QUIZ_STYLE_21_STEPS_TEMPLATE) as any;
  template._source = 'ts';
  return {
    template,
    source: 'ts',
    step: template[stepId]
  };
};

// Export do template para compatibilidade
export { QUIZ_STYLE_21_STEPS_TEMPLATE };

// 🚀 Registrar todos os steps no TemplateRegistry em tempo de build/import
try {
  const registry = TemplateRegistry.getInstance();
  const entries = Object.entries(QUIZ_STYLE_21_STEPS_TEMPLATE);
  for (const [key, template] of entries) {
    if (key.startsWith('step-')) {
      registry.register(key, template as any);
    }
  }
  if (process.env.NODE_ENV === 'development') {
    console.log(`✅ TemplateRegistry registrado com ${entries.length} entradas`);
  }
} catch (err) {
  // Falha silenciosa no registro para não quebrar SSR/tests
}

export { TemplateRegistry };
