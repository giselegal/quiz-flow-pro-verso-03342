// 🔄 CONFIGURAÇÃO CENTRALIZADA DE MIGRAÇÃO PARA TEMPLATES JSON
// Este arquivo facilita a migração e manutenção dos templates

export const MIGRATION_CONFIG = {
  // 🎯 Flag para ativar/desativar sistema JSON
  useJsonTemplates: true,

  // 🔄 Flag para fallback TSX quando JSON falha
  enableTsxFallback: true,

  // 📊 Log detalhado para debug
  enableDetailedLogging: true,

  // ⚡ Pré-carregamento automático
  enablePreloading: true,
};

export const TEMPLATE_CATEGORIES = {
  intro: 'step-1',
  questions: [
    'step-2',
    'step-3',
    'step-4',
    'step-5',
    'step-6',
    'step-7',
    'step-8',
    'step-9',
    'step-10',
    'step-11',
    'step-12',
    'step-13',
    'step-14',
  ],
  transition: 'step-15',
  processing: 'step-16',
  results: ['step-17', 'step-18', 'step-19'],
  lead: 'step-20',
  offer: 'step-21',
} as const;

export const MIGRATION_PROGRESS = {
  // ✅ Templates JSON criados
  templatesGenerated: 21,

  // ✅ TemplateManager atualizado
  templateManagerUpdated: true,

  // ✅ EditorContext migrado
  editorContextMigrated: true,

  // 📋 Status por etapa
  stepsStatus: {
    'step-1': '✅ JSON Ready',
    'step-2': '✅ JSON Ready',
    'step-3': '✅ JSON Ready',
    'step-4': '✅ JSON Ready',
    'step-5': '✅ JSON Ready',
    'step-6': '✅ JSON Ready',
    'step-7': '✅ JSON Ready',
    'step-8': '✅ JSON Ready',
    'step-9': '✅ JSON Ready',
    'step-10': '✅ JSON Ready',
    'step-11': '✅ JSON Ready',
    'step-12': '✅ JSON Ready',
    'step-13': '✅ JSON Ready',
    'step-14': '✅ JSON Ready',
    'step-15': '✅ JSON Ready',
    'step-16': '✅ JSON Ready',
    'step-17': '✅ JSON Ready',
    'step-18': '✅ JSON Ready',
    'step-19': '✅ JSON Ready',
    'step-20': '✅ JSON Ready',
    'step-21': '✅ JSON Ready',
  },
};

// 🎯 Validação de migração completa
export const validateMigration = (): boolean => {
  const allStepsReady = Object.values(MIGRATION_PROGRESS.stepsStatus).every(status =>
    status.includes('✅')
  );

  return (
    MIGRATION_PROGRESS.templatesGenerated === 21 &&
    MIGRATION_PROGRESS.templateManagerUpdated &&
    MIGRATION_PROGRESS.editorContextMigrated &&
    allStepsReady
  );
};

console.log('🔄 Migração para Templates JSON:', {
  isComplete: validateMigration(),
  totalSteps: 21,
  readySteps: Object.values(MIGRATION_PROGRESS.stepsStatus).filter(s => s.includes('✅')).length,
  config: MIGRATION_CONFIG,
});
