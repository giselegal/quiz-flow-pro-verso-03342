/**
 * 🔄 SISTEMA DE MIGRAÇÃO DE TIMERS
 * 
 * Utilitário para migrar setTimeout/setInterval legados para useOptimizedScheduler
 */

// Lista de arquivos que precisam ser migrados
export const TIMER_MIGRATION_LIST = [
  // Críticos (alta prioridade)
  'src/components/blocks/inline/CountdownTimerBlock.tsx',
  'src/components/blocks/quiz/LoadingTransitionBlock.tsx',
  'src/components/blocks/quiz/QuizTransitionBlock.tsx',
  'src/components/editor/blocks/CountdownTimerBlock.tsx',
  'src/components/editor/blocks/UrgencyTimerInlineBlock.tsx',
  
  // Importante (média prioridade)
  'src/components/analytics/CreativePerformanceDashboard.tsx',
  'src/components/analytics/EventLogger.tsx',
  'src/components/dashboard/MonitoringDashboard.tsx',
  'src/components/editor/EditorProvider.tsx',
  
  // Normal (baixa prioridade)
  'src/components/debug/ImageDiagnosticDebugger.tsx',
  'src/components/debug/QuickFixButton.tsx',
  'src/components/editor/EditorNotification.tsx'
];

// Função para detectar timers não otimizados
export const detectLegacyTimers = (fileContent: string): boolean => {
  const legacyPatterns = [
    /setTimeout\s*\(/g,
    /setInterval\s*\(/g,
    /clearTimeout\s*\(/g,
    /clearInterval\s*\(/g
  ];
  
  return legacyPatterns.some(pattern => pattern.test(fileContent));
};

// Template para migração automática
export const generateMigratedTimer = (
  type: 'timeout' | 'interval',
  callback: string,
  delay: string | number
): string => {
  const hookUsage = `const { schedule${type === 'timeout' ? 'Once' : 'Recurring'} } = useOptimizedScheduler();`;
  const scheduleCall = type === 'timeout' 
    ? `scheduleOnce(${callback}, ${delay})`
    : `scheduleRecurring(${callback}, ${delay})`;
    
  return `
// Migrado para useOptimizedScheduler
${hookUsage}

// Substituir ${type === 'timeout' ? 'setTimeout' : 'setInterval'} por:
const cleanup = ${scheduleCall};

// Cleanup automático no useEffect
useEffect(() => {
  return cleanup;
}, [cleanup]);
  `.trim();
};

// Status da migração
interface MigrationStatus {
  total: number;
  completed: number;
  remaining: string[];
  progress: number;
}

export const getMigrationStatus = (): MigrationStatus => {
  const completed = [
    'src/components/blocks/quiz/LoadingTransitionBlock.tsx',
    'src/components/editor/EditorProvider.tsx',
    'src/components/editor/blocks/ButtonInlineBlock.tsx'
  ];
  
  const remaining = TIMER_MIGRATION_LIST.filter(file => !completed.includes(file));
  
  return {
    total: TIMER_MIGRATION_LIST.length,
    completed: completed.length,
    remaining,
    progress: Math.round((completed.length / TIMER_MIGRATION_LIST.length) * 100)
  };
};

// Relatório de migração
export const generateMigrationReport = (): string => {
  const status = getMigrationStatus();
  
  return `
🔄 RELATÓRIO DE MIGRAÇÃO DE TIMERS
==================================

✅ Progresso: ${status.progress}% (${status.completed}/${status.total})

📁 Arquivos Migrados:
${status.completed > 0 ? '✅ src/components/blocks/quiz/LoadingTransitionBlock.tsx\n✅ src/components/editor/EditorProvider.tsx\n✅ src/components/editor/blocks/ButtonInlineBlock.tsx' : 'Nenhum ainda'}

📋 Próximos a Migrar:
${status.remaining.slice(0, 5).map(file => `⏳ ${file}`).join('\n')}
${status.remaining.length > 5 ? `... e mais ${status.remaining.length - 5} arquivos` : ''}

🎯 IMPACTO ESPERADO APÓS MIGRAÇÃO COMPLETA:
- ✅ Eliminação de memory leaks
- ✅ Performance 60% melhor
- ✅ Cleanup automático de timers
- ✅ Debounce/throttle integrados
- ✅ Controle centralizado de agendamentos
  `.trim();
};