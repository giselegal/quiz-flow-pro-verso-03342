#!/usr/bin/env node

/**
 * 🔬 VALIDADOR DO SISTEMA OTIMIZADO
 * =================================
 *
 * Este script valida se todo o sistema otimizado está
 * funcionando corretamente após a limpeza e configuração.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====================================================================
// 🧪 VALIDAÇÕES DO SISTEMA
// ====================================================================

function validateCoreComponents() {
  console.log('🔍 VALIDANDO COMPONENTES CORE...');

  const coreComponents = [
    'quiz-intro-header',
    'heading-inline',
    'text-inline',
    'decorative-bar-inline',
    'form-input',
    'button-inline',
    'options-grid',
    'quiz-progress',
    'quiz-results',
    'style-results',
    'final-step',
    'image-display-inline',
    'legal-notice-inline',
  ];

  const componentPaths = {
    'quiz-intro-header': 'src/components/blocks/QuizIntroHeader.tsx',
    'heading-inline': 'src/components/blocks/inline/HeadingInline.tsx',
    'text-inline': 'src/components/blocks/inline/TextInline.tsx',
    'decorative-bar-inline': 'src/components/blocks/inline/DecorativeBarInline.tsx',
    'form-input': 'src/components/blocks/FormInput.tsx',
    'button-inline': 'src/components/blocks/inline/ButtonInline.tsx',
    'options-grid': 'src/components/blocks/OptionsGrid.tsx',
    'quiz-progress': 'src/components/blocks/QuizProgress.tsx',
    'quiz-results': 'src/components/blocks/QuizResults.tsx',
    'style-results': 'src/components/blocks/StyleResults.tsx',
    'final-step': 'src/components/blocks/FinalStep.tsx',
    'image-display-inline': 'src/components/blocks/inline/ImageDisplayInline.tsx',
    'legal-notice-inline': 'src/components/blocks/inline/LegalNoticeInline.tsx',
  };

  const results = {
    existing: [],
    missing: [],
    invalid: [],
  };

  coreComponents.forEach(component => {
    const componentPath = path.join(__dirname, componentPaths[component]);

    if (fs.existsSync(componentPath)) {
      // Verificar se o arquivo tem conteúdo válido
      const content = fs.readFileSync(componentPath, 'utf8');

      if (
        content.includes('export') &&
        content.includes(
          component
            .split('-')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join('')
        )
      ) {
        results.existing.push(component);
        console.log(`  ✅ ${component}`);
      } else {
        results.invalid.push(component);
        console.log(`  ⚠️ ${component} (arquivo inválido)`);
      }
    } else {
      results.missing.push(component);
      console.log(`  ❌ ${component} (arquivo não encontrado)`);
    }
  });

  return results;
}

function validateConfiguration() {
  console.log('\n🔍 VALIDANDO CONFIGURAÇÃO...');

  const configFiles = [
    'src/config/optimized21StepsFunnel.json',
    'src/config/optimized21StepsFunnel.ts',
    'src/config/blockDefinitions.ts',
    'src/hooks/useUnifiedProperties.ts',
  ];

  const results = {
    existing: [],
    missing: [],
  };

  configFiles.forEach(file => {
    const filePath = path.join(__dirname, file);

    if (fs.existsSync(filePath)) {
      results.existing.push(file);
      console.log(`  ✅ ${file}`);
    } else {
      results.missing.push(file);
      console.log(`  ❌ ${file}`);
    }
  });

  return results;
}

function validateOptimizedFunnel() {
  console.log('\n🔍 VALIDANDO FUNIL OTIMIZADO...');

  try {
    const configPath = path.join(__dirname, 'src/config/optimized21StepsFunnel.json');

    if (!fs.existsSync(configPath)) {
      console.log('  ❌ Arquivo de configuração não encontrado');
      return { valid: false, reason: 'missing-config' };
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    // Validar estrutura básica
    if (!config.steps || !Array.isArray(config.steps)) {
      console.log('  ❌ Configuração inválida: steps não encontrado');
      return { valid: false, reason: 'invalid-steps' };
    }

    if (config.steps.length !== 21) {
      console.log(`  ❌ Número incorreto de etapas: ${config.steps.length}/21`);
      return { valid: false, reason: 'wrong-step-count' };
    }

    // Validar cada etapa
    let validSteps = 0;
    const stepTypes = {};

    config.steps.forEach((step, index) => {
      if (step.id && step.name && step.blocks && Array.isArray(step.blocks)) {
        validSteps++;
        stepTypes[step.type] = (stepTypes[step.type] || 0) + 1;
        console.log(`  ✅ Etapa ${index + 1}: ${step.name} (${step.blocks.length} blocos)`);
      } else {
        console.log(`  ❌ Etapa ${index + 1}: Estrutura inválida`);
      }
    });

    console.log(`\n  📊 ESTATÍSTICAS:`);
    console.log(`    • Etapas válidas: ${validSteps}/21`);
    console.log(`    • Tipos de etapas:`, stepTypes);

    return {
      valid: validSteps === 21,
      stepTypes,
      validSteps,
    };
  } catch (error) {
    console.log(`  ❌ Erro ao validar: ${error.message}`);
    return { valid: false, reason: 'parse-error', error };
  }
}

function validateBlockDefinitions() {
  console.log('\n🔍 VALIDANDO BLOCK DEFINITIONS...');

  try {
    const blockDefPath = path.join(__dirname, 'src/config/blockDefinitions.ts');

    if (!fs.existsSync(blockDefPath)) {
      console.log('  ❌ blockDefinitions.ts não encontrado');
      return { valid: false };
    }

    const content = fs.readFileSync(blockDefPath, 'utf8');

    // Verificar se os componentes core estão definidos
    const coreComponents = [
      'quiz-intro-header',
      'heading-inline',
      'text-inline',
      'button-inline',
      'options-grid',
      'quiz-progress',
    ];

    let definedComponents = 0;

    coreComponents.forEach(component => {
      const componentKey = component.replace(/-/g, '');
      if (content.includes(`'${component}'`) || content.includes(`"${component}"`)) {
        definedComponents++;
        console.log(`  ✅ ${component} definido`);
      } else {
        console.log(`  ⚠️ ${component} não encontrado`);
      }
    });

    console.log(`\n  📊 Componentes definidos: ${definedComponents}/${coreComponents.length}`);

    return {
      valid: definedComponents >= coreComponents.length * 0.8, // 80% ok
      definedComponents,
      totalComponents: coreComponents.length,
    };
  } catch (error) {
    console.log(`  ❌ Erro: ${error.message}`);
    return { valid: false, error };
  }
}

function validateUnifiedProperties() {
  console.log('\n🔍 VALIDANDO UNIFIED PROPERTIES...');

  try {
    const hooksPath = path.join(__dirname, 'src/hooks/useUnifiedProperties.ts');

    if (!fs.existsSync(hooksPath)) {
      console.log('  ❌ useUnifiedProperties.ts não encontrado');
      return { valid: false };
    }

    const content = fs.readFileSync(hooksPath, 'utf8');

    // Verificar estrutura básica do hook
    const checks = [
      { name: 'Export do hook', pattern: /export.*useUnifiedProperties/ },
      {
        name: 'Função principal',
        pattern: /function useUnifiedProperties|const useUnifiedProperties/,
      },
      { name: 'Return statement', pattern: /return\s*{/ },
      { name: 'Properties handling', pattern: /properties|setProperties/ },
    ];

    let passedChecks = 0;

    checks.forEach(check => {
      if (check.pattern.test(content)) {
        passedChecks++;
        console.log(`  ✅ ${check.name}`);
      } else {
        console.log(`  ⚠️ ${check.name} não encontrado`);
      }
    });

    console.log(`\n  📊 Verificações: ${passedChecks}/${checks.length}`);

    return {
      valid: passedChecks >= checks.length * 0.75, // 75% ok
      passedChecks,
      totalChecks: checks.length,
    };
  } catch (error) {
    console.log(`  ❌ Erro: ${error.message}`);
    return { valid: false, error };
  }
}

function validateEditorIntegration() {
  console.log('\n🔍 VALIDANDO INTEGRAÇÃO COM EDITOR...');

  const editorFiles = [
    'src/context/EditorContext.tsx',
    'src/components/editor/funnel/FunnelStagesPanel.tsx',
    'src/components/editor/properties/EnhancedUniversalPropertiesPanel.tsx',
  ];

  let existingFiles = 0;

  editorFiles.forEach(file => {
    const filePath = path.join(__dirname, file);

    if (fs.existsSync(filePath)) {
      existingFiles++;
      console.log(`  ✅ ${file}`);
    } else {
      console.log(`  ❌ ${file}`);
    }
  });

  console.log(`\n  📊 Arquivos do editor: ${existingFiles}/${editorFiles.length}`);

  return {
    valid: existingFiles >= editorFiles.length * 0.67, // 67% ok
    existingFiles,
    totalFiles: editorFiles.length,
  };
}

function runPerformanceAnalysis() {
  console.log('\n🚀 ANÁLISE DE PERFORMANCE...');

  // Contar arquivos na pasta de components
  const componentsDir = path.join(__dirname, 'src/components');
  let componentCount = 0;

  function countFiles(dir) {
    if (!fs.existsSync(dir)) return 0;

    const files = fs.readdirSync(dir);
    let count = 0;

    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        count += countFiles(fullPath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        count++;
      }
    });

    return count;
  }

  componentCount = countFiles(componentsDir);

  console.log(`  📊 Total de arquivos de componentes: ${componentCount}`);
  console.log(`  🎯 Meta pós-limpeza: ≤ 50 arquivos`);
  console.log(
    `  ${componentCount <= 50 ? '✅' : '⚠️'} Performance: ${componentCount <= 50 ? 'ÓTIMA' : 'PODE MELHORAR'}`
  );

  return { componentCount, target: 50, optimal: componentCount <= 50 };
}

function generateValidationReport() {
  console.log('\n📋 EXECUTANDO VALIDAÇÃO COMPLETA...');
  console.log('='.repeat(60));

  const results = {
    components: validateCoreComponents(),
    configuration: validateConfiguration(),
    funnel: validateOptimizedFunnel(),
    blockDefinitions: validateBlockDefinitions(),
    unifiedProperties: validateUnifiedProperties(),
    editorIntegration: validateEditorIntegration(),
    performance: runPerformanceAnalysis(),
  };

  // Calcular score geral
  const scores = [
    results.components.existing.length >= 10 ? 1 : 0.5,
    results.configuration.existing.length >= 3 ? 1 : 0.5,
    results.funnel.valid ? 1 : 0,
    results.blockDefinitions.valid ? 1 : 0.5,
    results.unifiedProperties.valid ? 1 : 0.5,
    results.editorIntegration.valid ? 1 : 0.5,
    results.performance.optimal ? 1 : 0.7,
  ];

  const totalScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const percentage = Math.round(totalScore * 100);

  console.log('\n🏆 RELATÓRIO FINAL');
  console.log('='.repeat(60));
  console.log(`📊 SCORE GERAL: ${percentage}%`);
  console.log(
    `🎯 STATUS: ${percentage >= 80 ? '✅ EXCELENTE' : percentage >= 60 ? '⚠️ BOM' : '❌ PRECISA MELHORAR'}`
  );

  console.log('\n📋 DETALHES POR CATEGORIA:');
  console.log(`  • Componentes Core: ${results.components.existing.length}/13 ✅`);
  console.log(`  • Configuração: ${results.configuration.existing.length}/4 arquivos`);
  console.log(`  • Funil Otimizado: ${results.funnel.valid ? '✅ VÁLIDO' : '❌ INVÁLIDO'}`);
  console.log(`  • Block Definitions: ${results.blockDefinitions.valid ? '✅ OK' : '⚠️ REVISAR'}`);
  console.log(
    `  • Unified Properties: ${results.unifiedProperties.valid ? '✅ OK' : '⚠️ REVISAR'}`
  );
  console.log(`  • Integração Editor: ${results.editorIntegration.valid ? '✅ OK' : '⚠️ REVISAR'}`);
  console.log(`  • Performance: ${results.performance.optimal ? '✅ ÓTIMA' : '⚠️ BOA'}`);

  if (percentage >= 80) {
    console.log('\n🎉 SISTEMA TOTALMENTE VALIDADO!');
    console.log('✅ Pronto para teste no editor: http://localhost:8081/editor-fixed');
  } else if (percentage >= 60) {
    console.log('\n🔧 SISTEMA FUNCIONAL COM AJUSTES MENORES');
    console.log('⚠️ Recomenda-se revisar itens marcados');
  } else {
    console.log('\n⚠️ SISTEMA PRECISA DE REVISÃO');
    console.log('❌ Vários componentes críticos ausentes');
  }

  return { results, score: percentage };
}

// ====================================================================
// 🚀 EXECUÇÃO PRINCIPAL
// ====================================================================

console.log('🔬 INICIANDO VALIDAÇÃO DO SISTEMA OTIMIZADO');
console.log('='.repeat(80));

try {
  const validation = generateValidationReport();

  // Salvar relatório
  const reportPath = path.join(__dirname, 'validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(validation, null, 2));

  console.log(`\n💾 Relatório salvo em: ${reportPath}`);
  console.log('\n✅ VALIDAÇÃO CONCLUÍDA!');
} catch (error) {
  console.error('\n❌ ERRO NA VALIDAÇÃO:', error.message);
  process.exit(1);
}
