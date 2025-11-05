#!/usr/bin/env node
/**
 * 🎯 SCRIPT: Adicionar Sistema de Pontuação aos Templates
 * 
 * Este script adiciona configuração de scoring a todos os steps do quiz.
 * Configuração baseada no tipo de step:
 * - intro: sem pontuação (peso 0)
 * - question: pontuação padrão (peso 1, 30s)
 * - strategic-question: pontuação alta (peso 3, 45s)
 * - offer: sem pontuação (peso 0)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const SCORING_CONFIG = {
  'intro': {
    weight: 0,              // Não conta para pontuação
    timeLimit: 0,           // Sem limite de tempo
    hasCorrectAnswer: false,
    speedBonusEnabled: false
  },
  'question': {
    weight: 1,              // Peso padrão
    timeLimit: 30,          // 30 segundos ideal
    hasCorrectAnswer: false,
    speedBonusEnabled: true
  },
  'strategic-question': {
    weight: 3,              // Vale 3x mais
    timeLimit: 45,          // 45 segundos (mais complexa)
    hasCorrectAnswer: false,
    speedBonusEnabled: true
  },
  'offer': {
    weight: 0,              // Não conta para pontuação
    timeLimit: 0,
    hasCorrectAnswer: false,
    speedBonusEnabled: false
  },
  'result': {
    weight: 0,
    timeLimit: 0,
    hasCorrectAnswer: false,
    speedBonusEnabled: false
  }
};

const templatesDir = path.join(__dirname, '..', 'public', 'templates');

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

function getStepType(stepData) {
  return stepData.type || stepData.metadata?.category || 'question';
}

function addScoringToStep(stepData) {
  const stepType = getStepType(stepData);
  const scoringConfig = SCORING_CONFIG[stepType] || SCORING_CONFIG['question'];

  // Adicionar scoring ao metadata
  stepData.metadata = {
    ...stepData.metadata,
    scoring: scoringConfig,
    scoringAddedAt: new Date().toISOString()
  };

  return stepData;
}

// ============================================================================
// PROCESSAMENTO
// ============================================================================

console.log('🎯 Iniciando adição de scoring aos templates...\n');

// Ler quiz21-complete.json
const quiz21Path = path.join(templatesDir, 'quiz21-complete.json');

if (!fs.existsSync(quiz21Path)) {
  console.error('❌ Arquivo quiz21-complete.json não encontrado!');
  process.exit(1);
}

const quiz21 = JSON.parse(fs.readFileSync(quiz21Path, 'utf-8'));

let updatedSteps = 0;
const results = [];

// Atualizar cada step
Object.entries(quiz21.steps).forEach(([stepKey, stepData]) => {
  const stepType = getStepType(stepData);
  const scoringConfig = SCORING_CONFIG[stepType] || SCORING_CONFIG['question'];

  // Adicionar scoring ao step no quiz21-complete
  addScoringToStep(stepData);

  // Atualizar arquivo individual se existir
  const individualPath = path.join(templatesDir, `${stepKey}-v3.json`);
  if (fs.existsSync(individualPath)) {
    try {
      const individualData = JSON.parse(fs.readFileSync(individualPath, 'utf-8'));
      addScoringToStep(individualData);
      
      fs.writeFileSync(
        individualPath, 
        JSON.stringify(individualData, null, 2) + '\n'
      );

      results.push({
        step: stepKey,
        type: stepType,
        weight: scoringConfig.weight,
        timeLimit: scoringConfig.timeLimit,
        status: '✅'
      });

      updatedSteps++;
    } catch (error) {
      results.push({
        step: stepKey,
        type: stepType,
        weight: 0,
        timeLimit: 0,
        status: '❌',
        error: error.message
      });
    }
  } else {
    results.push({
      step: stepKey,
      type: stepType,
      weight: scoringConfig.weight,
      timeLimit: scoringConfig.timeLimit,
      status: '⚠️  (arquivo individual não existe)'
    });
  }
});

// Atualizar metadata do quiz21-complete
quiz21.metadata = {
  ...quiz21.metadata,
  scoringEnabled: true,
  scoringVersion: '1.0.0',
  scoringConfiguredAt: new Date().toISOString(),
  scoringRules: {
    speedBonusThreshold: 15,
    speedBonusPoints: 5,
    streakMultiplier: 1.5,
    completionBonus: 50,
    penaltyForSkip: -5
  }
};

// Salvar quiz21-complete atualizado
fs.writeFileSync(quiz21Path, JSON.stringify(quiz21, null, 2) + '\n');

// ============================================================================
// RELATÓRIO
// ============================================================================

console.log('📊 RESULTADOS:\n');
console.log('┌──────────┬─────────────────────────┬────────┬─────────┬────────┐');
console.log('│ Step     │ Tipo                    │ Peso   │ Tempo   │ Status │');
console.log('├──────────┼─────────────────────────┼────────┼─────────┼────────┤');

results.forEach(r => {
  const step = r.step.padEnd(8);
  const type = r.type.padEnd(23);
  const weight = String(r.weight).padEnd(6);
  const time = (r.timeLimit ? `${r.timeLimit}s` : '-').padEnd(7);
  const status = r.status;
  
  console.log(`│ ${step} │ ${type} │ ${weight} │ ${time} │ ${status}│`);
});

console.log('└──────────┴─────────────────────────┴────────┴─────────┴────────┘\n');

console.log('✅ RESUMO:');
console.log(`   • ${updatedSteps} steps atualizados com sucesso`);
console.log(`   • ${results.filter(r => r.status === '✅').length} arquivos individuais atualizados`);
console.log(`   • quiz21-complete.json atualizado`);

console.log('\n📝 CONFIGURAÇÃO APLICADA:');
console.log('   • Speed Bonus: < 15s = +5 pontos');
console.log('   • Streak Multiplier: 1.5x');
console.log('   • Completion Bonus: +50 pontos');
console.log('   • Penalty por pular: -5 pontos');

console.log('\n🎯 PESOS POR TIPO:');
Object.entries(SCORING_CONFIG).forEach(([type, config]) => {
  if (config.weight > 0) {
    console.log(`   • ${type}: peso ${config.weight}, tempo ideal ${config.timeLimit}s`);
  } else {
    console.log(`   • ${type}: sem pontuação`);
  }
});

console.log('\n✨ Próximos passos:');
console.log('   1. Verificar arquivos atualizados');
console.log('   2. Integrar scoreCalculator.ts no useQuizState');
console.log('   3. Adicionar rastreamento de tempo nos componentes');
console.log('   4. Criar componente QuizScoreDisplay');
console.log('   5. Testar cálculos com dados reais\n');
