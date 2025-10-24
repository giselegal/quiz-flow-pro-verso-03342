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

/**
 * Obtém o template de um step específico preferindo o TemplateRegistry.
 * Caso não exista no registry, cai para o template TS normalizado.
 */
export const getStepTemplate = (stepId: string) => {
  const stepKey = stepId.match(/^step-(\d{1,2})$/)
    ? `step-${String(parseInt(stepId.replace('step-', ''), 10)).padStart(2, '0')}`
    : stepId;

  const registry = TemplateRegistry.getInstance();
  const fromRegistry = registry.get(stepKey);
  if (fromRegistry) {
    return { step: fromRegistry, source: 'registry' as const };
  }

  const template = getQuiz21StepsTemplate() as any;
  return { step: template?.[stepKey], source: 'ts' as const };
};

// Função para carregar template de forma consistente
export const loadTemplate = async (templateId: string) => {
  // Normaliza ID recebido (aceita step-2 ou step-02)
  const stepNumber = templateId.replace(/^step-/, '').padStart(2, '0');
  const stepId = `step-${stepNumber}`;

  // Template completo (fonte TS normalizada)
  const template = getQuiz21StepsTemplate() as any;

  // Step específico preferindo Registry (permite overrides futuros por JSON)
  const { step, source: stepSource } = getStepTemplate(stepId);

  if (process.env.NODE_ENV === 'development') {
    console.log(`📦 [loadTemplate] step=${stepId} • source=${stepSource}`);
  }

  return {
    template,
    source: 'ts' as const,
    step,
  };
};

// Export do template para compatibilidade
export { QUIZ_STYLE_21_STEPS_TEMPLATE };

// 🚀 Registrar todos os steps no TemplateRegistry em tempo de build/import
try {
  const registry = TemplateRegistry.getInstance();
  const entries = Object.entries(QUIZ_STYLE_21_STEPS_TEMPLATE);
  let registered = 0;
  const registeredKeys: string[] = [];
  
  for (const [key, template] of entries) {
    if (key.startsWith('step-')) {
      // normaliza id para step-XX
      const match = key.match(/^step-(\d{1,2})$/);
      const normalizedKey = match ? `step-${parseInt(match[1], 10).toString().padStart(2, '0')}` : key;
      
      // Verificar se já existe
      if (registry.has(normalizedKey)) {
        console.warn(`⚠️  Step '${normalizedKey}' já está registrado. Sobrescrevendo...`);
      }
      
      // normaliza tipos (aliases → canônico 'options-grid')
      const normalizedTemplate = normalizeTemplateBlocks({ [normalizedKey]: template } as any)[normalizedKey];
      registry.register(normalizedKey, normalizedTemplate as any);
      registeredKeys.push(normalizedKey);
      registered++;
    }
  }
  
  console.log(`✅ TemplateRegistry registrado: ${registered} steps`);
  console.log(`📋 Steps registrados:`, registeredKeys.sort());
} catch (err) {
  console.error('❌ Erro ao registrar templates no TemplateRegistry:', err);
}
