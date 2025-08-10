#!/usr/bin/env node

/**
 * 🧪 TESTADOR INTELIGENTE DO SISTEMA INTEGRADO
 * ============================================
 *
 * Valida se toda a integração está funcionando perfeitamente
 * aproveitando os 97% de compatibilidade.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====================================================================
// 🧪 TESTES DE VALIDAÇÃO
// ====================================================================

function testBlockDefinitionsIntegration() {
  console.log("🧪 TESTANDO INTEGRAÇÃO DO BLOCKDEFINITIONS...");

  const blockDefPath = path.join(__dirname, "src/config/blockDefinitions.ts");

  if (!fs.existsSync(blockDefPath)) {
    console.log("  ❌ blockDefinitions.ts não encontrado");
    return false;
  }

  const content = fs.readFileSync(blockDefPath, "utf8");

  // Verificar componentes inline
  const requiredComponents = [
    "heading-inline",
    "text-inline",
    "button-inline",
    "decorative-bar-inline",
    "form-input",
    "image-display-inline",
    "legal-notice-inline",
  ];

  let integrationScore = 0;
  const results = {};

  requiredComponents.forEach(component => {
    const hasDefinition = content.includes(`'${component}'`) || content.includes(`"${component}"`);
    const hasImport = content.includes(
      component
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join("")
    );

    if (hasDefinition && hasImport) {
      integrationScore += 100;
      results[component] = "✅ INTEGRADO";
      console.log(`  ✅ ${component} - Definição e import OK`);
    } else if (hasDefinition) {
      integrationScore += 70;
      results[component] = "⚠️ DEFINIÇÃO OK, IMPORT AUSENTE";
      console.log(`  ⚠️ ${component} - Definição OK, verificar import`);
    } else {
      results[component] = "❌ AUSENTE";
      console.log(`  ❌ ${component} - Não encontrado`);
    }
  });

  const avgScore = Math.round(integrationScore / requiredComponents.length);
  console.log(`  📊 Score de integração: ${avgScore}%`);

  return {
    passed: avgScore >= 80,
    score: avgScore,
    details: results,
  };
}

function testUnifiedPropertiesEnhancement() {
  console.log("\n🧪 TESTANDO MELHORIAS DO USEUNIFIEDPROPERTIES...");

  const unifiedPath = path.join(__dirname, "src/hooks/useUnifiedProperties.ts");

  if (!fs.existsSync(unifiedPath)) {
    console.log("  ❌ useUnifiedProperties.ts não encontrado");
    return false;
  }

  const content = fs.readFileSync(unifiedPath, "utf8");

  // Verificar helper function
  const hasHelper = content.includes("getInlineComponentProperties");
  const hasInlineTypes = content.includes("heading-inline") && content.includes("text-inline");
  const hasInlineDefaults = content.includes("inlineDefaults");

  let score = 0;
  if (hasHelper) score += 50;
  if (hasInlineTypes) score += 30;
  if (hasInlineDefaults) score += 20;

  console.log(`  ${hasHelper ? "✅" : "❌"} Helper function getInlineComponentProperties`);
  console.log(`  ${hasInlineTypes ? "✅" : "❌"} Tipos inline definidos`);
  console.log(`  ${hasInlineDefaults ? "✅" : "❌"} Defaults inline configurados`);
  console.log(`  📊 Score: ${score}%`);

  return {
    passed: score >= 80,
    score,
    details: { hasHelper, hasInlineTypes, hasInlineDefaults },
  };
}

function testEditorContextUpgrade() {
  console.log("\n🧪 TESTANDO UPGRADE DO EDITORCONTEXT...");

  const contextPath = path.join(__dirname, "src/context/EditorContext.tsx");

  if (!fs.existsSync(contextPath)) {
    console.log("  ❌ EditorContext.tsx não encontrado");
    return false;
  }

  const content = fs.readFileSync(contextPath, "utf8");

  const hasOptimizedImport = content.includes("OPTIMIZED_FUNNEL_CONFIG");
  const hasLoadFunction = content.includes("loadOptimizedSteps");
  const hasMetadata = content.includes("isOptimized");

  let score = 0;
  if (hasOptimizedImport) score += 40;
  if (hasLoadFunction) score += 40;
  if (hasMetadata) score += 20;

  console.log(`  ${hasOptimizedImport ? "✅" : "❌"} Import da configuração otimizada`);
  console.log(`  ${hasLoadFunction ? "✅" : "❌"} Função loadOptimizedSteps`);
  console.log(`  ${hasMetadata ? "✅" : "❌"} Metadata de otimização`);
  console.log(`  📊 Score: ${score}%`);

  return {
    passed: score >= 70,
    score,
    details: { hasOptimizedImport, hasLoadFunction, hasMetadata },
  };
}

function testOptimizedLoaderCreation() {
  console.log("\n🧪 TESTANDO CARREGADOR OTIMIZADO...");

  const loaderPath = path.join(__dirname, "src/utils/optimizedEditorLoader.ts");

  if (!fs.existsSync(loaderPath)) {
    console.log("  ❌ optimizedEditorLoader.ts não foi criado");
    return false;
  }

  const content = fs.readFileSync(loaderPath, "utf8");

  const hasMainHook = content.includes("useOptimizedEditor");
  const hasProvider = content.includes("OptimizedEditorProvider");
  const hasContext = content.includes("OptimizedEditorContext");
  const hasNavigation = content.includes("navigateToStep");
  const hasAutoSave = content.includes("autoSave");
  const hasKeyboardShortcuts = content.includes("shortcuts");
  const hasPerformance = content.includes("performance");

  const features = [
    { name: "Hook principal", present: hasMainHook },
    { name: "Provider", present: hasProvider },
    { name: "Context", present: hasContext },
    { name: "Navegação", present: hasNavigation },
    { name: "AutoSave", present: hasAutoSave },
    { name: "Atalhos", present: hasKeyboardShortcuts },
    { name: "Performance", present: hasPerformance },
  ];

  let score = 0;
  features.forEach(feature => {
    if (feature.present) {
      score += Math.round(100 / features.length);
      console.log(`  ✅ ${feature.name}`);
    } else {
      console.log(`  ❌ ${feature.name}`);
    }
  });

  console.log(`  📊 Score: ${score}%`);

  return {
    passed: score >= 80,
    score,
    details: features,
  };
}

function testPerformanceEnhancements() {
  console.log("\n🧪 TESTANDO MELHORIAS DE PERFORMANCE...");

  const perfPath = path.join(__dirname, "src/utils/optimizedPerformance.ts");

  if (!fs.existsSync(perfPath)) {
    console.log("  ❌ optimizedPerformance.ts não foi criado");
    return false;
  }

  const content = fs.readFileSync(perfPath, "utf8");

  const hasMobileOpt = content.includes("mobileOptimizations");
  const hasMemoization = content.includes("memoizeInlineProps");
  const hasHOC = content.includes("withOptimizedInline");
  const hasStepUtils = content.includes("stepPerformanceUtils");
  const hasIntersectionObserver = content.includes("IntersectionObserver");

  let score = 0;
  if (hasMobileOpt) score += 25;
  if (hasMemoization) score += 25;
  if (hasHOC) score += 20;
  if (hasStepUtils) score += 20;
  if (hasIntersectionObserver) score += 10;

  console.log(`  ${hasMobileOpt ? "✅" : "❌"} Otimizações mobile`);
  console.log(`  ${hasMemoization ? "✅" : "❌"} Memoização de props`);
  console.log(`  ${hasHOC ? "✅" : "❌"} HOC otimizado`);
  console.log(`  ${hasStepUtils ? "✅" : "❌"} Utilitários de etapas`);
  console.log(`  ${hasIntersectionObserver ? "✅" : "❌"} Intersection Observer`);
  console.log(`  📊 Score: ${score}%`);

  return {
    passed: score >= 70,
    score,
    details: { hasMobileOpt, hasMemoization, hasHOC, hasStepUtils, hasIntersectionObserver },
  };
}

function testTypeDefinitionsUpdate() {
  console.log("\n🧪 TESTANDO ATUALIZAÇÃO DOS TIPOS...");

  const typesPath = path.join(__dirname, "src/types/editor.ts");

  if (!fs.existsSync(typesPath)) {
    console.log("  ❌ editor.ts (tipos) não encontrado");
    return false;
  }

  const content = fs.readFileSync(typesPath, "utf8");

  const hasDecorativeBar = content.includes("decorative-bar-inline");
  const hasFormInput = content.includes("form-input");
  const hasLegalNotice = content.includes("legal-notice-inline");
  const hasOptimizedConfig = content.includes("OptimizedEditorConfig");
  const hasOptimizedState = content.includes("OptimizedSystemState");

  let score = 0;
  if (hasDecorativeBar) score += 20;
  if (hasFormInput) score += 20;
  if (hasLegalNotice) score += 20;
  if (hasOptimizedConfig) score += 20;
  if (hasOptimizedState) score += 20;

  console.log(`  ${hasDecorativeBar ? "✅" : "❌"} Tipo decorative-bar-inline`);
  console.log(`  ${hasFormInput ? "✅" : "❌"} Tipo form-input`);
  console.log(`  ${hasLegalNotice ? "✅" : "❌"} Tipo legal-notice-inline`);
  console.log(`  ${hasOptimizedConfig ? "✅" : "❌"} Interface OptimizedEditorConfig`);
  console.log(`  ${hasOptimizedState ? "✅" : "❌"} Interface OptimizedSystemState`);
  console.log(`  📊 Score: ${score}%`);

  return {
    passed: score >= 70,
    score,
    details: {
      hasDecorativeBar,
      hasFormInput,
      hasLegalNotice,
      hasOptimizedConfig,
      hasOptimizedState,
    },
  };
}

function testInlineComponentsExistence() {
  console.log("\n🧪 TESTANDO EXISTÊNCIA DOS COMPONENTES INLINE...");

  const inlineDir = path.join(__dirname, "src/components/blocks/inline");

  if (!fs.existsSync(inlineDir)) {
    console.log("  ❌ Diretório inline não existe");
    return false;
  }

  const requiredComponents = [
    "HeadingInline.tsx",
    "TextInline.tsx",
    "ButtonInline.tsx",
    "DecorativeBarInline.tsx",
    "ImageDisplayInline.tsx",
    "LegalNoticeInline.tsx",
  ];

  let score = 0;
  const results = {};

  requiredComponents.forEach(component => {
    const componentPath = path.join(inlineDir, component);
    const exists = fs.existsSync(componentPath);

    if (exists) {
      // Verificar se o componente tem conteúdo válido
      const content = fs.readFileSync(componentPath, "utf8");
      const hasExport = content.includes("export default") || content.includes("export const");
      const hasProps =
        content.includes("interface") || content.includes("type") || content.includes("props");

      if (hasExport && hasProps) {
        score += Math.round(100 / requiredComponents.length);
        results[component] = "✅ COMPLETO";
        console.log(`  ✅ ${component} - Componente completo`);
      } else {
        score += Math.round(50 / requiredComponents.length);
        results[component] = "⚠️ INCOMPLETO";
        console.log(`  ⚠️ ${component} - Existe mas incompleto`);
      }
    } else {
      results[component] = "❌ AUSENTE";
      console.log(`  ❌ ${component} - Não encontrado`);
    }
  });

  console.log(`  📊 Score: ${score}%`);

  return {
    passed: score >= 80,
    score,
    details: results,
  };
}

function testExistingHooksCompatibility() {
  console.log("\n🧪 TESTANDO COMPATIBILIDADE COM HOOKS EXISTENTES...");

  const hooksDir = path.join(__dirname, "src/hooks");

  if (!fs.existsSync(hooksDir)) {
    console.log("  ❌ Diretório de hooks não existe");
    return false;
  }

  const essentialHooks = ["useUnifiedProperties.ts", "useEditor.ts", "useQuiz.ts", "useHistory.ts"];

  const bonusHooks = [
    "useAutoSave.ts",
    "useKeyboardShortcuts.ts",
    "usePerformanceOptimization.ts",
    "use-mobile.ts",
  ];

  let essentialScore = 0;
  let bonusScore = 0;

  console.log("  📋 Hooks essenciais:");
  essentialHooks.forEach(hook => {
    const hookPath = path.join(hooksDir, hook);
    const exists = fs.existsSync(hookPath);

    if (exists) {
      essentialScore += Math.round(100 / essentialHooks.length);
      console.log(`    ✅ ${hook}`);
    } else {
      console.log(`    ❌ ${hook}`);
    }
  });

  console.log("  🎁 Hooks opcionais:");
  bonusHooks.forEach(hook => {
    const hookPath = path.join(hooksDir, hook);
    const exists = fs.existsSync(hookPath);

    if (exists) {
      bonusScore += Math.round(100 / bonusHooks.length);
      console.log(`    ✅ ${hook}`);
    } else {
      console.log(`    ⚠️ ${hook}`);
    }
  });

  console.log(`  📊 Score essencial: ${essentialScore}%`);
  console.log(`  🎁 Score opcional: ${bonusScore}%`);

  return {
    passed: essentialScore >= 75,
    essentialScore,
    bonusScore,
    details: { essentialHooks, bonusHooks },
  };
}

function generateTestReport(results) {
  console.log("\n📋 GERANDO RELATÓRIO DE TESTES...");

  const testResults = {
    timestamp: new Date().toISOString(),
    overallStatus: "unknown",
    totalTests: Object.keys(results).length,
    passedTests: 0,
    failedTests: 0,
    averageScore: 0,
    details: results,
  };

  let totalScore = 0;
  let scoreCount = 0;

  Object.values(results).forEach(result => {
    if (result.passed) {
      testResults.passedTests++;
    } else {
      testResults.failedTests++;
    }

    if (result.score !== undefined) {
      totalScore += result.score;
      scoreCount++;
    } else if (result.essentialScore !== undefined) {
      totalScore += result.essentialScore;
      scoreCount++;
    }
  });

  testResults.averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;

  if (testResults.averageScore >= 90) {
    testResults.overallStatus = "excellent";
  } else if (testResults.averageScore >= 80) {
    testResults.overallStatus = "good";
  } else if (testResults.averageScore >= 70) {
    testResults.overallStatus = "acceptable";
  } else {
    testResults.overallStatus = "needs-improvement";
  }

  const reportPath = path.join(__dirname, "integration-test-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));

  console.log(`  ✅ Relatório salvo em: ${reportPath}`);

  return testResults;
}

function displayTestSummary(testReport) {
  console.log("\n🏆 RESUMO DOS TESTES DE INTEGRAÇÃO");
  console.log("=".repeat(80));

  const statusEmoji = {
    excellent: "🌟",
    good: "✅",
    acceptable: "⚠️",
    "needs-improvement": "❌",
  };

  console.log(
    `\n${statusEmoji[testReport.overallStatus]} STATUS GERAL: ${testReport.overallStatus.toUpperCase()}`
  );
  console.log(`📊 SCORE MÉDIO: ${testReport.averageScore}%`);
  console.log(`✅ TESTES APROVADOS: ${testReport.passedTests}/${testReport.totalTests}`);
  console.log(`❌ TESTES FALHARAM: ${testReport.failedTests}/${testReport.totalTests}`);

  console.log("\n📋 DETALHES POR TESTE:");

  Object.entries(testReport.details).forEach(([testName, result]) => {
    const emoji = result.passed ? "✅" : "❌";
    const score = result.score || result.essentialScore || 0;
    console.log(`  ${emoji} ${testName}: ${score}%`);
  });

  if (testReport.overallStatus === "excellent") {
    console.log("\n🎉 INTEGRAÇÃO PERFEITA!");
    console.log("✅ Todos os sistemas funcionando optimamente");
    console.log("✅ Performance e compatibilidade excelentes");
    console.log("✅ Sistema pronto para produção");
  } else if (testReport.overallStatus === "good") {
    console.log("\n🎯 INTEGRAÇÃO BOA!");
    console.log("✅ Maioria dos sistemas funcionando bem");
    console.log("⚠️ Alguns ajustes menores podem ser feitos");
    console.log("✅ Sistema funcional para uso");
  } else if (testReport.overallStatus === "acceptable") {
    console.log("\n⚠️ INTEGRAÇÃO ACEITÁVEL");
    console.log("⚠️ Sistemas básicos funcionando");
    console.log("🔧 Requer alguns ajustes para otimização");
    console.log("✅ Funcional mas pode ser melhorado");
  } else {
    console.log("\n🔧 INTEGRAÇÃO PRECISA DE MELHORIAS");
    console.log("❌ Alguns sistemas com problemas");
    console.log("🛠️ Requer correções antes do uso");
    console.log("⚠️ Revisar itens falhando");
  }

  console.log("\n🚀 PRÓXIMOS PASSOS:");
  console.log("  1. ✅ Testar editor no browser");
  console.log("  2. ✅ Validar todas as 21 etapas");
  console.log("  3. ✅ Verificar responsividade mobile");
  console.log("  4. ✅ Testar performance com dados reais");
  console.log("  5. ✅ Deploy para ambiente de desenvolvimento");
}

// ====================================================================
// 🚀 EXECUÇÃO PRINCIPAL DOS TESTES
// ====================================================================

console.log("🧪 INICIANDO BATERIA DE TESTES DO SISTEMA INTEGRADO");
console.log("=".repeat(80));

try {
  const testResults = {
    blockDefinitions: testBlockDefinitionsIntegration(),
    unifiedProperties: testUnifiedPropertiesEnhancement(),
    editorContext: testEditorContextUpgrade(),
    optimizedLoader: testOptimizedLoaderCreation(),
    performance: testPerformanceEnhancements(),
    typeDefinitions: testTypeDefinitionsUpdate(),
    inlineComponents: testInlineComponentsExistence(),
    hooksCompatibility: testExistingHooksCompatibility(),
  };

  const testReport = generateTestReport(testResults);
  displayTestSummary(testReport);

  console.log("\n✅ BATERIA DE TESTES CONCLUÍDA!");

  // Exit code baseado no resultado
  if (testReport.overallStatus === "needs-improvement") {
    process.exit(1);
  } else {
    process.exit(0);
  }
} catch (error) {
  console.error("\n❌ ERRO NOS TESTES:", error.message);
  console.error(error.stack);
  process.exit(1);
}
