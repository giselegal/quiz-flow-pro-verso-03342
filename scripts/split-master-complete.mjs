#!/usr/bin/env node
/**
 * 🎯 SPLIT MASTER → step-XX-v3.json (VERSÃO COMPLETA)
 *
 * Lê public/templates/quiz21-complete.json (fonte canônica)
 * e gera 21 arquivos individuais COMPLETOS em public/templates/step-XX-v3.json.
 * 
 * 🆕 DIFERENÇA: Preserva TODOS os campos, incluindo blocks[], navigation, type, etc.
 *
 * Uso:
 *   node scripts/split-master-complete.mjs
 *   node scripts/split-master-complete.mjs --dry-run  # Apenas mostrar o que faria
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';

const ROOT = process.cwd();
const TEMPLATES_DIR = resolve(ROOT, 'public', 'templates');
const MASTER = resolve(TEMPLATES_DIR, 'quiz21-complete.json');

const isDryRun = process.argv.includes('--dry-run');
const pad2 = (n) => String(n).padStart(2, '0');

// Cores para terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function main() {
  log('\n🎯 SPLIT MASTER COMPLETO → step-XX-v3.json\n', 'cyan');
  
  if (isDryRun) {
    log('⚠️  MODO DRY-RUN: Nenhum arquivo será modificado\n', 'yellow');
  }

  try {
    // Ler master
    log(`📖 Lendo: ${MASTER}`, 'gray');
    const raw = readFileSync(MASTER, 'utf-8');
    const master = JSON.parse(raw);
    const steps = master?.steps || {};

    if (!master.templateVersion) {
      log('⚠️  Master não possui templateVersion', 'yellow');
    }

    log(`✅ Master carregado: ${Object.keys(steps).length} steps encontrados\n`, 'green');

    let generated = 0;
    let totalBlocks = 0;
    const stats = [];

    // Processar cada step
    for (let i = 1; i <= 21; i++) {
      const key = `step-${pad2(i)}`;
      const data = steps[key];
      
      if (!data) {
        log(`⚠️  ${key}: Não encontrado no master, pulando...`, 'yellow');
        continue;
      }

      const outFile = resolve(TEMPLATES_DIR, `${key}-v3.json`);
      
      // Preservar TODAS as propriedades do step original
      const completeStep = {
        templateVersion: data.templateVersion || '3.0',
        metadata: data.metadata || { 
          id: `${key}-v3`, 
          name: key, 
          description: '', 
          category: 'question' 
        },
        theme: data.theme || {},
        validation: data.validation || {},
        behavior: data.behavior || {},
        
        // 🆕 NOVOS CAMPOS PRESERVADOS:
        ...(data.type && { type: data.type }),
        ...(data.navigation && { navigation: data.navigation }),
        ...(data.redirectPath && { redirectPath: data.redirectPath }),
        ...(data.blocks && { blocks: data.blocks }),
        ...(data.sections && { sections: data.sections }),
        ...(data.layout && { layout: data.layout }),
        ...(data.offer && { offer: data.offer }),
        
        // Preservar quaisquer outros campos customizados
        ...Object.keys(data).reduce((acc, key) => {
          if (![
            'templateVersion', 'metadata', 'theme', 'validation', 
            'behavior', 'type', 'navigation', 'redirectPath', 
            'blocks', 'sections', 'layout', 'offer'
          ].includes(key)) {
            acc[key] = data[key];
          }
          return acc;
        }, {})
      };

      const blocksCount = completeStep.blocks?.length || 0;
      const sectionsCount = completeStep.sections?.length || 0;
      const stepSize = JSON.stringify(completeStep, null, 2).length;
      totalBlocks += blocksCount;

      stats.push({
        step: key,
        blocks: blocksCount,
        sections: sectionsCount,
        type: completeStep.type || 'unknown',
        size: stepSize
      });

      if (!isDryRun) {
        const dir = dirname(outFile);
        if (!existsSync(dir)) {
          mkdirSync(dir, { recursive: true });
        }
        writeFileSync(outFile, JSON.stringify(completeStep, null, 2), 'utf-8');
      }

      const statusIcon = isDryRun ? '🔍' : '✅';
      log(
        `${statusIcon} ${key}: ${blocksCount} blocos | ${sectionsCount} seções | ${completeStep.type || 'n/a'} | ${(stepSize / 1024).toFixed(1)}KB`,
        isDryRun ? 'gray' : 'green'
      );
      
      generated++;
    }

    // Resumo final
    log('\n' + '─'.repeat(70), 'gray');
    log('\n📊 RESUMO DA OPERAÇÃO\n', 'cyan');
    log(`Arquivos ${isDryRun ? 'a gerar' : 'gerados'}: ${generated}/21`, 'blue');
    log(`Total de blocos: ${totalBlocks}`, 'blue');
    log(`Média de blocos por step: ${(totalBlocks / generated).toFixed(1)}`, 'blue');
    
    // Estatísticas por tipo
    const byType = stats.reduce((acc, s) => {
      acc[s.type] = (acc[s.type] || 0) + 1;
      return acc;
    }, {});
    
    log('\n📋 Steps por tipo:', 'cyan');
    Object.entries(byType).forEach(([type, count]) => {
      log(`   ${type}: ${count}`, 'gray');
    });

    // Top 5 steps com mais blocos
    log('\n🏆 Top 5 steps com mais blocos:', 'cyan');
    stats
      .sort((a, b) => b.blocks - a.blocks)
      .slice(0, 5)
      .forEach((s, idx) => {
        log(`   ${idx + 1}. ${s.step}: ${s.blocks} blocos`, 'gray');
      });

    log(`\n📁 Localização: ${TEMPLATES_DIR}/`, 'gray');
    
    if (isDryRun) {
      log('\n💡 Execute sem --dry-run para gerar os arquivos', 'yellow');
    } else {
      log('\n🎉 Concluído! Todos os steps foram gerados com DADOS COMPLETOS', 'green');
    }

  } catch (err) {
    log(`\n❌ Erro ao dividir master: ${err?.message || err}`, 'yellow');
    if (err.stack) {
      log(`\n${err.stack}`, 'gray');
    }
    process.exit(1);
  }
}

main();
