// Registro do template gold standard no sistema de templates
import loadGoldFunnelJson from './quiz21GoldFunnel';

// Converte o JSON gold (steps em array) para o formato FullTemplate (steps como Record<string, Block[]>)
function toStepsRecord(stepsArr: any[]): Record<string, any[]> {
  const record: Record<string, any[]> = {};
  if (Array.isArray(stepsArr)) {
    for (const step of stepsArr) {
      if (step && typeof step === 'object' && Array.isArray(step.blocks) && typeof step.id === 'string') {
        record[step.id] = step.blocks;
      }
    }
  }
  return record;
}

// Builder assíncrono do FullTemplate a partir do JSON em public/
async function buildGoldFunnelTemplate() {
  const goldFunnel = await loadGoldFunnelJson();
  const totalSteps = Array.isArray(goldFunnel.steps) ? goldFunnel.steps.length : 21;
  const stepsRecord = toStepsRecord(goldFunnel.steps || []);

  return {
    id: 'quiz21-v4-gold',
    name: goldFunnel.metadata?.name || 'Quiz 21 Gold Standard',
    metadata: {
      id: 'quiz21-v4-gold',
      name: goldFunnel.metadata?.name || 'Quiz 21 Gold Standard',
      description: goldFunnel.metadata?.description || 'Template 100% validado, referência para novos funis',
      version: goldFunnel.metadata?.version || goldFunnel.version || '4.0.0',
      totalSteps,
      type: 'quiz' as const,
      tags: goldFunnel.metadata?.tags || ['gold', 'quiz', 'v4'],
      author: goldFunnel.metadata?.author || 'Quiz Quest Team',
      created: goldFunnel.metadata?.createdAt || new Date().toISOString(),
    },
    steps: stepsRecord,
    totalSteps,
  };
}

export default buildGoldFunnelTemplate;
