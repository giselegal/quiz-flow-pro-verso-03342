// Registro do template gold standard no sistema de templates
import goldFunnel from './quiz21GoldFunnel';

export const goldFunnelTemplate = {
  id: 'quiz21-v4-gold',
  name: 'Quiz 21 Gold Standard',
  description: 'Template 100% validado, referência para novos funis',
  version: goldFunnel.version || '4.0.0',
  totalSteps: goldFunnel.steps ? Object.keys(goldFunnel.steps).length : 21,
  type: goldFunnel.type || 'quiz',
  tags: goldFunnel.tags || ['gold', 'quiz', 'v4'],
  author: goldFunnel.author || 'Quiz Quest Team',
  created: goldFunnel.created || new Date().toISOString(),
  steps: goldFunnel.steps,
  metadata: goldFunnel.metadata || {},
};

// Para registro automático, basta importar este arquivo em registry.ts ou loaders
export default goldFunnelTemplate;
