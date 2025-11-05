#!/usr/bin/env node
/**
 * 🎯 GERADOR UNIVERSAL DE CONFIGURAÇÃO DE SCORING
 * 
 * Script interativo para criar configurações de pontuação
 * para qualquer funil, independente de nicho ou quantidade de steps
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// CONFIGURAÇÕES POR NICHO
// ============================================================================

const NICHO_PRESETS = {
  'personalidade': {
    name: 'Quiz de Personalidade/Estilo',
    speedBonusThreshold: 20,
    speedBonusPoints: 5,
    streakMultiplier: 1.4,
    penaltyForSkip: 0,
    hasCorrectAnswer: false,
    badges: {
      streak5: { emoji: '🔥', name: 'Hot Streak' },
      fast: { emoji: '⚡', name: 'Speed Demon' },
      complete: { emoji: '✅', name: 'Completou Tudo' },
      perfect: { emoji: '🏆', name: 'Pontuação Perfeita' }
    }
  },
  'conhecimento': {
    name: 'Quiz de Conhecimento/Educacional',
    speedBonusThreshold: 10,
    speedBonusPoints: 3,
    streakMultiplier: 2.0,
    penaltyForSkip: -5,
    hasCorrectAnswer: true,
    badges: {
      streak10: { emoji: '🔥', name: 'Em Chamas' },
      streak20: { emoji: '💎', name: 'Imparável' },
      fast: { emoji: '⚡', name: 'Raio' },
      perfect: { emoji: '🏆', name: 'Perfeição' },
      complete: { emoji: '✅', name: 'Disciplinado' }
    }
  },
  'saude': {
    name: 'Quiz de Saúde/Diagnóstico',
    speedBonusThreshold: 0,
    speedBonusPoints: 0,
    streakMultiplier: 1.0,
    penaltyForSkip: -20,
    hasCorrectAnswer: false,
    badges: {
      complete: { emoji: '✅', name: 'Avaliação Completa' },
      thorough: { emoji: '🔍', name: 'Detalhista' }
    }
  },
  'ecommerce': {
    name: 'Quiz de Produto/E-commerce',
    speedBonusThreshold: 15,
    speedBonusPoints: 4,
    streakMultiplier: 1.3,
    penaltyForSkip: 0,
    hasCorrectAnswer: false,
    badges: {
      fast: { emoji: '⚡', name: 'Decidido' },
      complete: { emoji: '✅', name: 'Match Perfeito' },
      engaged: { emoji: '💎', name: 'Cliente Ideal' }
    }
  },
  'carreira': {
    name: 'Quiz de Carreira',
    speedBonusThreshold: 25,
    speedBonusPoints: 3,
    streakMultiplier: 1.3,
    penaltyForSkip: -3,
    hasCorrectAnswer: false,
    badges: {
      fast: { emoji: '🎯', name: 'Decisivo' },
      complete: { emoji: '✅', name: 'Autoconhecimento' },
      streak: { emoji: '🔥', name: 'Convicto' }
    }
  },
  'fitness': {
    name: 'Quiz de Fitness/Saúde',
    speedBonusThreshold: 18,
    speedBonusPoints: 4,
    streakMultiplier: 1.5,
    penaltyForSkip: 0,
    hasCorrectAnswer: false,
    badges: {
      streak5: { emoji: '💪', name: 'Disciplinado' },
      fast: { emoji: '⚡', name: 'Ágil' },
      complete: { emoji: '🏆', name: 'Completou' },
      motivated: { emoji: '🔥', name: 'Motivado' }
    }
  },
  'culinaria': {
    name: 'Quiz de Culinária',
    speedBonusThreshold: 15,
    speedBonusPoints: 4,
    streakMultiplier: 1.4,
    penaltyForSkip: 0,
    hasCorrectAnswer: false,
    badges: {
      chef: { emoji: '👨‍🍳', name: 'Chef Iniciante' },
      fast: { emoji: '⚡', name: 'Rápido na Cozinha' },
      complete: { emoji: '📖', name: 'Conhecimento Completo' },
      gourmet: { emoji: '⭐', name: 'Gourmet' }
    }
  }
};

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

function calculateDynamicLevels(totalSteps, pointsPerStep = 10) {
  const maxPoints = totalSteps * pointsPerStep * 2; // Considerando bônus
  
  return [
    { threshold: 0, name: 'Iniciante' },
    { threshold: Math.floor(maxPoints * 0.15), name: 'Aprendiz' },
    { threshold: Math.floor(maxPoints * 0.35), name: 'Intermediário' },
    { threshold: Math.floor(maxPoints * 0.60), name: 'Avançado' },
    { threshold: Math.floor(maxPoints * 0.85), name: 'Expert' },
    { threshold: maxPoints, name: 'Mestre' }
  ];
}

function generateStepWeights(totalSteps, pattern = 'uniform') {
  const weights = {};
  
  for (let i = 1; i <= totalSteps; i++) {
    const stepId = `step-${String(i).padStart(2, '0')}`;
    
    switch (pattern) {
      case 'uniform':
        weights[stepId] = 1;
        break;
      case 'progressive':
        weights[stepId] = Math.min(5, Math.ceil(i / (totalSteps / 5)));
        break;
      case 'strategic':
        // Primeiras e últimas valem mais
        if (i <= 3 || i >= totalSteps - 2) {
          weights[stepId] = 3;
        } else {
          weights[stepId] = 1;
        }
        break;
      case 'middle-heavy':
        // Perguntas do meio valem mais
        const middle = Math.floor(totalSteps / 2);
        const distance = Math.abs(i - middle);
        weights[stepId] = Math.max(1, 5 - distance);
        break;
    }
  }
  
  return weights;
}

// ============================================================================
// INTERFACE DE LINHA DE COMANDO
// ============================================================================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('\n🎯 GERADOR DE CONFIGURAÇÃO DE SCORING\n');
  console.log('Este script criará uma configuração personalizada de pontuação\n');
  
  // 1. Informações básicas
  const funnelId = await question('1. ID do funil (ex: quiz-carreira-ideal): ');
  const totalSteps = parseInt(await question('2. Número de steps: '));
  
  // 2. Escolher nicho
  console.log('\n3. Escolha o nicho/categoria:');
  const nichos = Object.keys(NICHO_PRESETS);
  nichos.forEach((nicho, i) => {
    console.log(`   ${i + 1}. ${NICHO_PRESETS[nicho].name}`);
  });
  const nichoIndex = parseInt(await question('   Opção (1-7): ')) - 1;
  const nichoKey = nichos[nichoIndex] || 'personalidade';
  const nichoPreset = NICHO_PRESETS[nichoKey];
  
  // 3. Padrão de pesos
  console.log('\n4. Padrão de pesos das questões:');
  console.log('   1. Uniforme (todas valem igual)');
  console.log('   2. Progressivo (aumenta gradualmente)');
  console.log('   3. Estratégico (início e fim valem mais)');
  console.log('   4. Centro pesado (meio vale mais)');
  const weightPattern = ['uniform', 'progressive', 'strategic', 'middle-heavy'][
    parseInt(await question('   Opção (1-4): ')) - 1
  ] || 'uniform';
  
  // 4. Pontos base
  const basePoints = parseInt(await question('\n5. Pontos base por questão (padrão: 10): ') || '10');
  
  // 5. Customizações
  const customizeSpeed = (await question('\n6. Customizar velocidade? (s/N): ')).toLowerCase() === 's';
  let speedBonusThreshold = nichoPreset.speedBonusThreshold;
  let speedBonusPoints = nichoPreset.speedBonusPoints;
  
  if (customizeSpeed) {
    speedBonusThreshold = parseInt(await question('   Threshold speed bonus (segundos): '));
    speedBonusPoints = parseInt(await question('   Pontos speed bonus: '));
  }
  
  // Gerar configuração
  console.log('\n✨ Gerando configuração...\n');
  
  const weights = generateStepWeights(totalSteps, weightPattern);
  const levels = calculateDynamicLevels(totalSteps, basePoints);
  const completionBonus = Math.floor(totalSteps * basePoints * 0.5);
  
  const config = {
    funnelId,
    metadata: {
      scoringEnabled: true,
      scoringVersion: '1.0.0',
      nicho: nichoPreset.name,
      totalSteps,
      weightPattern,
      createdAt: new Date().toISOString(),
      createdBy: 'generate-scoring-config script'
    },
    scoringRules: {
      weights,
      correctAnswerPoints: basePoints,
      speedBonusThreshold,
      speedBonusPoints,
      streakMultiplier: nichoPreset.streakMultiplier,
      completionBonus,
      penaltyForSkip: nichoPreset.penaltyForSkip
    },
    levels,
    badges: nichoPreset.badges
  };
  
  // Exibir resumo
  console.log('📊 RESUMO DA CONFIGURAÇÃO:\n');
  console.log(`   Funil: ${funnelId}`);
  console.log(`   Steps: ${totalSteps}`);
  console.log(`   Nicho: ${nichoPreset.name}`);
  console.log(`   Padrão de pesos: ${weightPattern}`);
  console.log(`   Pontos base: ${basePoints}`);
  console.log(`   Speed bonus: ${speedBonusThreshold}s → ${speedBonusPoints} pts`);
  console.log(`   Completion bonus: ${completionBonus} pts`);
  console.log(`   Níveis: ${levels.length}`);
  console.log(`   Badges: ${Object.keys(nichoPreset.badges).length}`);
  console.log(`\n   Score máximo possível: ~${totalSteps * basePoints * 2 + completionBonus} pts`);
  
  // Salvar
  const save = (await question('\n7. Salvar configuração? (S/n): ')).toLowerCase() !== 'n';
  
  if (save) {
    const outputDir = path.join(__dirname, '..', 'public', 'templates');
    const outputFile = path.join(outputDir, `${funnelId}-scoring.json`);
    
    // Criar diretório se não existir
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Salvar arquivo
    fs.writeFileSync(outputFile, JSON.stringify(config, null, 2));
    
    console.log(`\n✅ Configuração salva em: ${outputFile}`);
    console.log('\n📝 Próximos passos:');
    console.log('   1. Revisar o arquivo gerado');
    console.log('   2. Ajustar pesos específicos se necessário');
    console.log('   3. Personalizar nomes de níveis');
    console.log('   4. Adicionar badges customizadas');
    console.log('   5. Testar com dados reais');
    console.log('\n   Para aplicar ao template:');
    console.log(`   node scripts/apply-scoring-config.mjs ${funnelId}`);
  } else {
    console.log('\n❌ Configuração não salva.');
  }
  
  rl.close();
}

// ============================================================================
// EXECUÇÃO
// ============================================================================

main().catch(error => {
  console.error('❌ Erro:', error.message);
  rl.close();
  process.exit(1);
});
