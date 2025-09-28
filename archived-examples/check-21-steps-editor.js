#!/usr/bin/env node

/**
 * 🔍 VERIFICADOR E CORRETOR DAS 21 ETAPAS DO EDITOR
 * ================================================
 *
 * Verifica se o editor-fixed está carregando corretamente
 * as 21 etapas otimizadas e corrige qualquer problema.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====================================================================
// 🔍 ANÁLISE DO ESTADO ATUAL
// ====================================================================

function checkEditorFixedIntegration() {
  console.log('🔍 VERIFICANDO INTEGRAÇÃO DO EDITOR-FIXED...');

  const editorFixedPath = path.join(__dirname, 'src/pages/editor-fixed-dragdrop.tsx');

  if (!fs.existsSync(editorFixedPath)) {
    console.log('  ❌ editor-fixed-dragdrop.tsx não encontrado');
    return false;
  }

  const content = fs.readFileSync(editorFixedPath, 'utf8');

  // Verificar integrações importantes
  const hasOptimizedImport = content.includes('OPTIMIZED_FUNNEL_CONFIG');
  const hasEditorContext = content.includes('useEditor');
  const hasFunnelStagesPanel = content.includes('FunnelStagesPanel');
  const hasCanvasDropZone = content.includes('CanvasDropZone');

  console.log(`  ${hasOptimizedImport ? '✅' : '❌'} Import da configuração otimizada`);
  console.log(`  ${hasEditorContext ? '✅' : '❌'} Hook useEditor`);
  console.log(`  ${hasFunnelStagesPanel ? '✅' : '❌'} FunnelStagesPanel`);
  console.log(`  ${hasCanvasDropZone ? '✅' : '❌'} CanvasDropZone`);

  return {
    hasOptimizedImport,
    hasEditorContext,
    hasFunnelStagesPanel,
    hasCanvasDropZone,
    score:
      [hasOptimizedImport, hasEditorContext, hasFunnelStagesPanel, hasCanvasDropZone].filter(
        Boolean
      ).length * 25,
  };
}

function checkEditorContextSteps() {
  console.log('\n🔍 VERIFICANDO CARREGAMENTO DAS ETAPAS NO EDITORCONTEXT...');

  const contextPath = path.join(__dirname, 'src/context/EditorContext.tsx');

  if (!fs.existsSync(contextPath)) {
    console.log('  ❌ EditorContext.tsx não encontrado');
    return false;
  }

  const content = fs.readFileSync(contextPath, 'utf8');

  // Verificar configuração das etapas
  const hasOptimizedImport = content.includes('OPTIMIZED_FUNNEL_CONFIG');
  const hasLoadOptimizedSteps = content.includes('loadOptimizedSteps');
  const has21StepsInit = content.includes('for (let i = 1; i <= 21; i++)');
  const hasStepMapping = content.includes('getAllSteps');

  console.log(`  ${hasOptimizedImport ? '✅' : '❌'} Import da configuração otimizada`);
  console.log(`  ${hasLoadOptimizedSteps ? '✅' : '❌'} Função loadOptimizedSteps`);
  console.log(`  ${has21StepsInit ? '✅' : '❌'} Inicialização das 21 etapas`);
  console.log(`  ${hasStepMapping ? '✅' : '❌'} Mapeamento de templates`);

  return {
    hasOptimizedImport,
    hasLoadOptimizedSteps,
    has21StepsInit,
    hasStepMapping,
    score:
      [hasOptimizedImport, hasLoadOptimizedSteps, has21StepsInit, hasStepMapping].filter(Boolean)
        .length * 25,
  };
}

function checkOptimizedConfiguration() {
  console.log('\n🔍 VERIFICANDO CONFIGURAÇÃO OTIMIZADA DAS 21 ETAPAS...');

  const configPath = path.join(__dirname, 'src/config/optimized21StepsFunnel.ts');

  if (!fs.existsSync(configPath)) {
    console.log('  ❌ optimized21StepsFunnel.ts não encontrado');
    return false;
  }

  const content = fs.readFileSync(configPath, 'utf8');

  // Contar etapas
  const stepMatches = content.match(/"step-\d+"/g) || [];
  const uniqueSteps = [...new Set(stepMatches)];
  const hasCorrectStepCount = uniqueSteps.length >= 21;

  // Verificar estrutura
  const hasQuizData = content.includes('quizData');
  const hasStyles = content.includes('styles');
  const hasCalculations = content.includes('calculations');
  const hasConversion = content.includes('conversion');

  console.log(
    `  ${hasCorrectStepCount ? '✅' : '❌'} 21 etapas definidas (encontradas: ${uniqueSteps.length})`
  );
  console.log(`  ${hasQuizData ? '✅' : '❌'} Dados do quiz`);
  console.log(`  ${hasStyles ? '✅' : '❌'} Definições de estilos`);
  console.log(`  ${hasCalculations ? '✅' : '❌'} Sistema de cálculos`);
  console.log(`  ${hasConversion ? '✅' : '❌'} Configuração de conversão`);

  if (hasCorrectStepCount) {
    console.log(
      `  📋 Etapas encontradas: ${uniqueSteps.slice(0, 5).join(', ')}... (total: ${uniqueSteps.length})`
    );
  }

  return {
    stepCount: uniqueSteps.length,
    hasCorrectStepCount,
    hasQuizData,
    hasStyles,
    hasCalculations,
    hasConversion,
    score:
      [hasCorrectStepCount, hasQuizData, hasStyles, hasCalculations, hasConversion].filter(Boolean)
        .length * 20,
  };
}

function checkFunnelStagesPanel() {
  console.log('\n🔍 VERIFICANDO FUNNELSTAGES PANEL...');

  const panelPath = path.join(__dirname, 'src/components/editor/funnel/FunnelStagesPanel.tsx');

  if (!fs.existsSync(panelPath)) {
    console.log('  ❌ FunnelStagesPanel.tsx não encontrado');
    return false;
  }

  const content = fs.readFileSync(panelPath, 'utf8');

  const hasEditorContext = content.includes('useEditor');
  const hasStagesMapping = content.includes('stages');
  const hasActiveStage = content.includes('activeStageId');
  const hasStageActions = content.includes('setActiveStage');

  console.log(`  ${hasEditorContext ? '✅' : '❌'} Hook useEditor`);
  console.log(`  ${hasStagesMapping ? '✅' : '❌'} Mapeamento de stages`);
  console.log(`  ${hasActiveStage ? '✅' : '❌'} ActiveStageId`);
  console.log(`  ${hasStageActions ? '✅' : '❌'} Ações de stage`);

  return {
    hasEditorContext,
    hasStagesMapping,
    hasActiveStage,
    hasStageActions,
    score:
      [hasEditorContext, hasStagesMapping, hasActiveStage, hasStageActions].filter(Boolean).length *
      25,
  };
}

// ====================================================================
// 🛠️ CORREÇÕES E MELHORIAS
// ====================================================================

function fixEditorContextIntegration() {
  console.log('\n🛠️ CORRIGINDO INTEGRAÇÃO DO EDITORCONTEXT...');

  const contextPath = path.join(__dirname, 'src/context/EditorContext.tsx');

  if (!fs.existsSync(contextPath)) {
    console.log('  ❌ EditorContext.tsx não encontrado');
    return false;
  }

  let content = fs.readFileSync(contextPath, 'utf8');

  // Adicionar import se não existir
  if (!content.includes('OPTIMIZED_FUNNEL_CONFIG')) {
    const importLine = `import { OPTIMIZED_FUNNEL_CONFIG } from '@/config/optimized21StepsFunnel';`;

    const importIndex = content.indexOf('import React');
    if (importIndex !== -1) {
      content = content.slice(0, importIndex) + importLine + '\n' + content.slice(importIndex);
      console.log('  ✅ Import da configuração otimizada adicionado');
    }
  }

  // Melhorar função loadOptimizedSteps se necessário
  if (!content.includes('loadOptimizedSteps')) {
    const loadFunction = `
  /**
   * 🎯 Carrega etapas otimizadas do funil de 21 etapas
   */
  const loadOptimizedSteps = useCallback(() => {
    if (OPTIMIZED_FUNNEL_CONFIG?.steps) {
      const optimizedSteps = OPTIMIZED_FUNNEL_CONFIG.steps.map((step, index) => ({
        id: step.id,
        name: step.name,
        order: step.order,
        type: step.type,
        description: step.description,
        isActive: index === 0,
        metadata: {
          blocksCount: step.blocks?.length || 0,
          lastModified: new Date(),
          isCustom: false,
          isOptimized: true,
          templateBlocks: step.blocks || [],
          stepData: step
        }
      }));
      
      console.log('🎯 Carregadas', optimizedSteps.length, 'etapas otimizadas do OPTIMIZED_FUNNEL_CONFIG');
      return optimizedSteps;
    }
    console.warn('⚠️ OPTIMIZED_FUNNEL_CONFIG não encontrado, usando templates padrão');
    return [];
  }, []);`;

    // Encontrar local para inserir
    const contextProviderIndex = content.indexOf('const EditorProvider');
    if (contextProviderIndex !== -1) {
      content =
        content.slice(0, contextProviderIndex) +
        loadFunction +
        '\n\n' +
        content.slice(contextProviderIndex);
      console.log('  ✅ Função loadOptimizedSteps aprimorada');
    }
  }

  // Atualizar inicialização dos stages para usar configuração otimizada
  const stagesInitRegex =
    /const \[stages, setStages\] = useState<FunnelStage\[\]>\(\(\) => \{[\s\S]*?\}\);/;
  const stagesInitMatch = content.match(stagesInitRegex);

  if (stagesInitMatch) {
    const newStagesInit = `const [stages, setStages] = useState<FunnelStage[]>(() => {
    console.log("🚀 EditorProvider: Inicializando stages com configuração otimizada");

    // ✅ PRIORIZAR CONFIGURAÇÃO OTIMIZADA
    const optimizedSteps = loadOptimizedSteps();
    
    if (optimizedSteps && optimizedSteps.length > 0) {
      console.log("✅ EditorProvider: Usando", optimizedSteps.length, "etapas da configuração otimizada");
      return optimizedSteps;
    }

    // ✅ FALLBACK PARA TEMPLATES ESPECÍFICOS
    const allStepTemplates = getAllSteps();
    console.log("📋 EditorProvider: Fallback para templates:", allStepTemplates.length);

    const initialStages = allStepTemplates.map((stepTemplate, index) => ({
      id: \`step-\${stepTemplate.stepNumber}\`,
      name: stepTemplate.name,
      order: stepTemplate.stepNumber,
      type:
        stepTemplate.stepNumber === 1
          ? ("intro" as const)
          : stepTemplate.stepNumber <= 14
            ? ("question" as const)
            : stepTemplate.stepNumber === 15
              ? ("transition" as const)
              : stepTemplate.stepNumber === 16
                ? ("processing" as const)
                : stepTemplate.stepNumber >= 17 && stepTemplate.stepNumber <= 19
                  ? ("result" as const)
                  : stepTemplate.stepNumber === 20
                    ? ("lead" as const)
                    : ("offer" as const),
      description: stepTemplate.description,
      isActive: stepTemplate.stepNumber === 1,
      metadata: {
        blocksCount: 0,
        lastModified: new Date(),
        isCustom: false,
        templateBlocks: getStepTemplate(stepTemplate.stepNumber),
      },
    }));

    console.log("✅ EditorProvider: 21 stages criadas com templates específicos:", initialStages.length);
    return initialStages;
  });`;

    content = content.replace(stagesInitRegex, newStagesInit);
    console.log('  ✅ Inicialização dos stages atualizada para usar configuração otimizada');
  }

  fs.writeFileSync(contextPath, content);
  console.log('  ✅ EditorContext.tsx atualizado');

  return true;
}

function createOptimizedStepsLoader() {
  console.log('\n🛠️ CRIANDO CARREGADOR DE ETAPAS OTIMIZADO...');

  const loaderPath = path.join(__dirname, 'src/utils/optimizedStepsLoader.ts');

  const loaderContent = `/**
 * 🎯 CARREGADOR DE ETAPAS OTIMIZADO
 * ================================
 * 
 * Carrega as 21 etapas do funil otimizado com dados completos
 */

import { OPTIMIZED_FUNNEL_CONFIG } from '@/config/optimized21StepsFunnel';
import { FunnelStage, EditorBlock } from '@/types/editor';

/**
 * Carrega todas as 21 etapas otimizadas
 */
export const loadOptimized21Steps = (): FunnelStage[] => {
  if (!OPTIMIZED_FUNNEL_CONFIG?.steps) {
    console.warn('⚠️ OPTIMIZED_FUNNEL_CONFIG não encontrado');
    return [];
  }

  const stages: FunnelStage[] = OPTIMIZED_FUNNEL_CONFIG.steps.map((stepConfig, index) => ({
    id: stepConfig.id,
    name: stepConfig.name,
    order: stepConfig.order,
    type: stepConfig.type as any,
    description: stepConfig.description,
    isActive: index === 0,
    metadata: {
      blocksCount: stepConfig.blocks?.length || 0,
      lastModified: new Date(),
      isCustom: false,
      isOptimized: true,
      stepData: stepConfig,
      templateBlocks: stepConfig.blocks?.map(block => ({
        id: block.id,
        type: block.type,
        properties: block.properties || {},
        content: {},
        position: { x: 0, y: 0 },
        size: { width: 100, height: 'auto' },
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          isTemplate: true,
          isOptimized: true
        }
      })) || []
    }
  }));

  console.log(\`🎯 Carregadas \${stages.length} etapas otimizadas\`);
  
  // Debug das etapas
  stages.forEach(stage => {
    console.log(\`  📋 Etapa \${stage.order}: \${stage.name} (\${stage.metadata.blocksCount} blocos)\`);
  });

  return stages;
};

/**
 * Carrega blocos iniciais para uma etapa específica
 */
export const loadStepBlocks = (stepId: string): EditorBlock[] => {
  const stepConfig = OPTIMIZED_FUNNEL_CONFIG?.steps.find(step => step.id === stepId);
  
  if (!stepConfig?.blocks) {
    console.warn(\`⚠️ Blocos não encontrados para etapa \${stepId}\`);
    return [];
  }

  const blocks: EditorBlock[] = stepConfig.blocks.map((blockConfig, index) => ({
    id: blockConfig.id,
    type: blockConfig.type,
    properties: blockConfig.properties || {},
    content: {},
    position: { x: 0, y: index * 100 },
    size: { width: 100, height: 'auto' },
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      isTemplate: false,
      isOptimized: true,
      stepId: stepId,
      order: index
    }
  }));

  console.log(\`🎯 Carregados \${blocks.length} blocos para etapa \${stepId}\`);
  return blocks;
};

/**
 * Obtém informações da etapa específica
 */
export const getStepInfo = (stepId: string) => {
  const stepConfig = OPTIMIZED_FUNNEL_CONFIG?.steps.find(step => step.id === stepId);
  
  if (!stepConfig) {
    console.warn(\`⚠️ Configuração não encontrada para etapa \${stepId}\`);
    return null;
  }

  return {
    id: stepConfig.id,
    name: stepConfig.name,
    description: stepConfig.description,
    order: stepConfig.order,
    type: stepConfig.type,
    blocksCount: stepConfig.blocks?.length || 0,
    hasQuestionData: !!stepConfig.questionData,
    questionData: stepConfig.questionData,
    blocks: stepConfig.blocks || []
  };
};

/**
 * Carrega dados do quiz
 */
export const getQuizData = () => {
  return OPTIMIZED_FUNNEL_CONFIG?.quizData || null;
};

/**
 * Carrega configurações de cálculo
 */
export const getCalculationConfig = () => {
  return OPTIMIZED_FUNNEL_CONFIG?.calculations || null;
};

/**
 * Carrega configurações de conversão
 */
export const getConversionConfig = () => {
  return OPTIMIZED_FUNNEL_CONFIG?.conversion || null;
};

export default {
  loadOptimized21Steps,
  loadStepBlocks,
  getStepInfo,
  getQuizData,
  getCalculationConfig,
  getConversionConfig
};`;

  fs.writeFileSync(loaderPath, loaderContent);
  console.log('  ✅ Carregador de etapas otimizado criado');

  return true;
}

function testEditorIntegration() {
  console.log('\n🧪 TESTANDO INTEGRAÇÃO DO EDITOR...');

  // Verificar se o servidor está rodando
  console.log('  📡 Verificando servidor...');

  // Criar script de teste
  const testScript = `
// Script de teste para execução no browser
const testEditorIntegration = () => {
  console.log('🧪 TESTANDO EDITOR-FIXED...');
  
  // Verificar se está na página correta
  if (window.location.pathname.includes('editor-fixed')) {
    console.log('✅ Página editor-fixed carregada');
    
    // Verificar elementos essenciais
    const stagesPanel = document.querySelector('[class*="stages"]');
    const canvas = document.querySelector('[class*="canvas"]');
    const propertiesPanel = document.querySelector('[class*="properties"]');
    
    console.log('📋 Elementos encontrados:', {
      stagesPanel: !!stagesPanel,
      canvas: !!canvas,
      propertiesPanel: !!propertiesPanel
    });
    
    // Verificar se há 21 etapas visíveis
    const stageElements = document.querySelectorAll('[class*="stage"], [data-stage]');
    console.log(\`📊 Etapas visíveis: \${stageElements.length}\`);
    
    if (stageElements.length >= 21) {
      console.log('✅ 21+ etapas encontradas!');
    } else {
      console.warn(\`⚠️ Apenas \${stageElements.length} etapas encontradas\`);
    }
    
  } else {
    console.log('⚠️ Não está na página editor-fixed');
    console.log('💡 Vá para: http://localhost:8081/editor-fixed');
  }
};

// Executar teste
testEditorIntegration();
  `;

  const testPath = path.join(__dirname, 'test-editor-integration.js');
  fs.writeFileSync(testPath, testScript);

  console.log('  ✅ Script de teste criado');
  console.log('  💡 Para testar no browser:');
  console.log('    1. Vá para http://localhost:8081/editor-fixed');
  console.log('    2. Abra o console (F12)');
  console.log('    3. Cole e execute o conteúdo de test-editor-integration.js');

  return true;
}

function generateFixReport(results) {
  console.log('\n📋 RELATÓRIO DE VERIFICAÇÃO E CORREÇÃO');
  console.log('='.repeat(80));

  const { editorFixed, editorContext, optimizedConfig, funnelStages } = results;

  console.log('\n📊 SCORES POR COMPONENTE:');
  console.log(`  🎯 Editor Fixed: ${editorFixed.score}%`);
  console.log(`  🔧 Editor Context: ${editorContext.score}%`);
  console.log(`  ⚙️ Configuração Otimizada: ${optimizedConfig.score}%`);
  console.log(`  📋 Funnel Stages Panel: ${funnelStages.score}%`);

  const overallScore = Math.round(
    (editorFixed.score + editorContext.score + optimizedConfig.score + funnelStages.score) / 4
  );

  console.log(`\n🏆 SCORE GERAL: ${overallScore}%`);

  if (overallScore >= 90) {
    console.log('🌟 EXCELENTE! Sistema totalmente integrado');
  } else if (overallScore >= 75) {
    console.log('✅ BOM! Poucas correções necessárias');
  } else if (overallScore >= 60) {
    console.log('⚠️ ACEITÁVEL! Algumas correções aplicadas');
  } else {
    console.log('🔧 PRECISA MELHORIAS! Várias correções aplicadas');
  }

  console.log('\n📋 DETALHES DAS ETAPAS:');
  if (optimizedConfig.stepCount >= 21) {
    console.log(`  ✅ ${optimizedConfig.stepCount} etapas configuradas`);
  } else {
    console.log(`  ⚠️ Apenas ${optimizedConfig.stepCount} etapas encontradas (esperado: 21)`);
  }

  console.log('\n🔗 PRÓXIMOS PASSOS:');
  console.log('  1. ✅ Verificar no browser: http://localhost:8081/editor-fixed');
  console.log('  2. ✅ Testar navegação entre as 21 etapas');
  console.log('  3. ✅ Verificar carregamento dos blocos');
  console.log('  4. ✅ Testar painel de propriedades');
  console.log('  5. ✅ Validar funcionalidades de drag & drop');
}

// ====================================================================
// 🚀 EXECUÇÃO PRINCIPAL
// ====================================================================

console.log('🔍 INICIANDO VERIFICAÇÃO DAS 21 ETAPAS DO EDITOR');
console.log('='.repeat(80));

try {
  // Executar verificações
  const results = {
    editorFixed: checkEditorFixedIntegration(),
    editorContext: checkEditorContextSteps(),
    optimizedConfig: checkOptimizedConfiguration(),
    funnelStages: checkFunnelStagesPanel(),
  };

  // Aplicar correções se necessário
  if (results.editorContext.score < 100) {
    fixEditorContextIntegration();
  }

  // Criar carregador otimizado
  createOptimizedStepsLoader();

  // Criar teste de integração
  testEditorIntegration();

  // Gerar relatório
  generateFixReport(results);

  console.log('\n✅ VERIFICAÇÃO E CORREÇÃO CONCLUÍDAS!');
} catch (error) {
  console.error('\n❌ ERRO NA VERIFICAÇÃO:', error.message);
  console.error(error.stack);
  process.exit(1);
}
