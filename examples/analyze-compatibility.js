#!/usr/bin/env node

/**
 * 🔍 ANALISADOR DE COMPATIBILIDADE DO SISTEMA
 * ===========================================
 *
 * Este script analisa a compatibilidade entre o estado atual
 * do projeto e o sistema otimizado que criamos.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====================================================================
// 📊 ANÁLISE DE COMPATIBILIDADE
// ====================================================================

function analyzeTypeSystemCompatibility() {
  console.log("🔍 ANALISANDO COMPATIBILIDADE DOS TIPOS...");

  const editorTypesPath = path.join(__dirname, "src/types/editor.ts");

  if (!fs.existsSync(editorTypesPath)) {
    console.log("  ❌ Arquivo de tipos não encontrado");
    return { compatible: false, reason: "missing-types" };
  }

  const editorTypes = fs.readFileSync(editorTypesPath, "utf8");

  // Verificar tipos essenciais
  const essentialTypes = [
    "Block",
    "EditorBlock",
    "EditableContent",
    "BlockType",
    "PropertySchema",
    "BlockDefinition",
  ];

  const missingTypes = [];
  const foundTypes = [];

  essentialTypes.forEach(type => {
    const typeRegex = new RegExp(`(interface|type|enum)\\s+${type}`, "g");
    if (typeRegex.test(editorTypes)) {
      foundTypes.push(type);
      console.log(`  ✅ ${type} encontrado`);
    } else {
      missingTypes.push(type);
      console.log(`  ❌ ${type} não encontrado`);
    }
  });

  // Verificar nossos componentes inline
  const inlineComponents = [
    "heading-inline",
    "text-inline",
    "button-inline",
    "decorative-bar-inline",
    "form-input",
    "image-display-inline",
    "legal-notice-inline",
  ];

  const foundInlineTypes = [];
  inlineComponents.forEach(component => {
    if (editorTypes.includes(`"${component}"`)) {
      foundInlineTypes.push(component);
      console.log(`  ✅ Tipo ${component} já definido`);
    } else {
      console.log(`  ⚠️ Tipo ${component} precisa ser adicionado`);
    }
  });

  return {
    compatible: foundTypes.length >= essentialTypes.length * 0.8,
    foundTypes,
    missingTypes,
    foundInlineTypes,
    coverage: Math.round((foundTypes.length / essentialTypes.length) * 100),
  };
}

function analyzeHooksCompatibility() {
  console.log("\n🔍 ANALISANDO COMPATIBILIDADE DOS HOOKS...");

  const hooksDir = path.join(__dirname, "src/hooks");

  if (!fs.existsSync(hooksDir)) {
    console.log("  ❌ Diretório de hooks não encontrado");
    return { compatible: false };
  }

  // Verificar hooks essenciais para nosso sistema
  const essentialHooks = ["useUnifiedProperties.ts", "useEditor.ts", "useQuiz.ts", "useHistory.ts"];

  const optionalHooks = [
    "useAutoSave.ts",
    "useKeyboardShortcuts.ts",
    "usePerformanceOptimization.ts",
    "useDynamicData.ts",
  ];

  const foundEssential = [];
  const foundOptional = [];

  essentialHooks.forEach(hook => {
    const hookPath = path.join(hooksDir, hook);
    if (fs.existsSync(hookPath)) {
      foundEssential.push(hook);
      console.log(`  ✅ Hook essencial: ${hook}`);
    } else {
      console.log(`  ❌ Hook essencial ausente: ${hook}`);
    }
  });

  optionalHooks.forEach(hook => {
    const hookPath = path.join(hooksDir, hook);
    if (fs.existsSync(hookPath)) {
      foundOptional.push(hook);
      console.log(`  🎁 Hook opcional: ${hook}`);
    }
  });

  return {
    compatible: foundEssential.length >= essentialHooks.length * 0.75,
    foundEssential,
    foundOptional,
    essentialCoverage: Math.round((foundEssential.length / essentialHooks.length) * 100),
    bonusFeatures: foundOptional.length,
  };
}

function analyzeComponentsCompatibility() {
  console.log("\n🔍 ANALISANDO COMPATIBILIDADE DOS COMPONENTES...");

  const componentsDir = path.join(__dirname, "src/components");

  if (!fs.existsSync(componentsDir)) {
    console.log("  ❌ Diretório de componentes não encontrado");
    return { compatible: false };
  }

  // Verificar estrutura de editores existente
  const editorDirs = [
    "src/components/editor",
    "src/components/result-editor",
    "src/components/enhanced-editor",
  ];

  const foundEditors = [];
  editorDirs.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (fs.existsSync(fullPath)) {
      foundEditors.push(dir);
      console.log(`  ✅ Sistema de editor: ${dir.split("/").pop()}`);
    }
  });

  // Verificar nossos componentes inline criados
  const inlineDir = path.join(__dirname, "src/components/blocks/inline");
  const inlineComponents = [];

  if (fs.existsSync(inlineDir)) {
    const files = fs.readdirSync(inlineDir);
    files.forEach(file => {
      if (file.endsWith(".tsx")) {
        inlineComponents.push(file);
        console.log(`  ✅ Componente inline: ${file}`);
      }
    });
  }

  return {
    compatible: foundEditors.length > 0,
    foundEditors,
    inlineComponents,
    hasMultipleEditors: foundEditors.length > 1,
    inlineCount: inlineComponents.length,
  };
}

function analyzeConfigCompatibility() {
  console.log("\n🔍 ANALISANDO COMPATIBILIDADE DAS CONFIGURAÇÕES...");

  const configFiles = [
    "src/config/blockDefinitions.ts",
    "src/config/optimized21StepsFunnel.json",
    "src/config/optimized21StepsFunnel.ts",
  ];

  const foundConfigs = [];
  configFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      foundConfigs.push(file);
      console.log(`  ✅ Configuração: ${file.split("/").pop()}`);
    } else {
      console.log(`  ⚠️ Configuração ausente: ${file.split("/").pop()}`);
    }
  });

  // Verificar se blockDefinitions tem nossos componentes
  const blockDefPath = path.join(__dirname, "src/config/blockDefinitions.ts");
  let hasInlineDefinitions = false;

  if (fs.existsSync(blockDefPath)) {
    const content = fs.readFileSync(blockDefPath, "utf8");
    const inlineComponents = ["heading-inline", "text-inline", "button-inline"];

    const foundInDefinitions = inlineComponents.filter(
      comp => content.includes(`'${comp}'`) || content.includes(`"${comp}"`)
    );

    hasInlineDefinitions = foundInDefinitions.length > 0;
    console.log(
      `  📋 Componentes inline em blockDefinitions: ${foundInDefinitions.length}/${inlineComponents.length}`
    );
  }

  return {
    compatible: foundConfigs.length >= 2,
    foundConfigs,
    hasInlineDefinitions,
    coverage: Math.round((foundConfigs.length / configFiles.length) * 100),
  };
}

function analyzeSystemIntegration() {
  console.log("\n🔍 ANALISANDO INTEGRAÇÃO GERAL DO SISTEMA...");

  // Verificar pontos de integração críticos
  const integrationPoints = [
    "src/context/EditorContext.tsx",
    "src/components/editor/properties/EnhancedUniversalPropertiesPanel.tsx",
    "src/utils/editorDefaults.ts",
    "src/utils/blockDefaults.ts",
  ];

  const workingIntegrations = [];
  integrationPoints.forEach(point => {
    const filePath = path.join(__dirname, point);
    if (fs.existsSync(filePath)) {
      workingIntegrations.push(point);
      console.log(`  ✅ Integração: ${point.split("/").pop()}`);
    } else {
      console.log(`  ⚠️ Integração ausente: ${point.split("/").pop()}`);
    }
  });

  return {
    compatible: workingIntegrations.length >= integrationPoints.length * 0.75,
    workingIntegrations,
    coverage: Math.round((workingIntegrations.length / integrationPoints.length) * 100),
  };
}

function analyzeConflicts() {
  console.log("\n🔍 ANALISANDO CONFLITOS POTENCIAIS...");

  const conflicts = [];

  // Verificar conflitos de tipos
  const editorTypesPath = path.join(__dirname, "src/types/editor.ts");
  if (fs.existsSync(editorTypesPath)) {
    const content = fs.readFileSync(editorTypesPath, "utf8");

    // Procurar por definições duplicadas
    const typeMatches = content.match(/(?:interface|type|enum)\s+(\w+)/g);
    if (typeMatches) {
      const typeNames = typeMatches.map(match => match.split(" ")[1]);
      const duplicates = typeNames.filter((name, index) => typeNames.indexOf(name) !== index);

      if (duplicates.length > 0) {
        conflicts.push({
          type: "duplicate-types",
          items: duplicates,
          severity: "high",
        });
        console.log(`  ⚠️ Tipos duplicados: ${duplicates.join(", ")}`);
      }
    }
  }

  // Verificar conflitos de hooks
  const hooksDir = path.join(__dirname, "src/hooks");
  if (fs.existsSync(hooksDir)) {
    const hookFiles = fs
      .readdirSync(hooksDir)
      .filter(file => file.endsWith(".ts") || file.endsWith(".tsx"));

    const duplicateHooks = hookFiles.filter(
      file => hookFiles.filter(f => f.startsWith(file.split(".")[0])).length > 1
    );

    if (duplicateHooks.length > 0) {
      conflicts.push({
        type: "duplicate-hooks",
        items: duplicateHooks,
        severity: "medium",
      });
      console.log(`  ⚠️ Hooks com possível duplicação: ${duplicateHooks.join(", ")}`);
    }
  }

  if (conflicts.length === 0) {
    console.log("  ✅ Nenhum conflito crítico detectado");
  }

  return conflicts;
}

function generateCompatibilityReport() {
  console.log("\n📋 EXECUTANDO ANÁLISE COMPLETA DE COMPATIBILIDADE...");
  console.log("=".repeat(80));

  const results = {
    types: analyzeTypeSystemCompatibility(),
    hooks: analyzeHooksCompatibility(),
    components: analyzeComponentsCompatibility(),
    configs: analyzeConfigCompatibility(),
    integration: analyzeSystemIntegration(),
    conflicts: analyzeConflicts(),
  };

  // Calcular score geral de compatibilidade
  const scores = [
    results.types.compatible ? 100 : results.types.coverage || 0,
    results.hooks.compatible ? 100 : results.hooks.essentialCoverage || 0,
    results.components.compatible ? 100 : 50,
    results.configs.compatible ? 100 : results.configs.coverage || 0,
    results.integration.compatible ? 100 : results.integration.coverage || 0,
    results.conflicts.length === 0 ? 100 : Math.max(100 - results.conflicts.length * 20, 0),
  ];

  const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  console.log("\n🏆 RELATÓRIO DE COMPATIBILIDADE");
  console.log("=".repeat(60));
  console.log(`📊 SCORE GERAL: ${overallScore}%`);
  console.log(
    `🎯 STATUS: ${overallScore >= 80 ? "✅ ALTAMENTE COMPATÍVEL" : overallScore >= 60 ? "⚠️ COMPATÍVEL COM AJUSTES" : "❌ REQUER REFATORAÇÃO"}`
  );

  console.log("\n📋 DETALHES POR CATEGORIA:");
  console.log(
    `  • Sistema de Tipos: ${results.types.compatible ? "✅ OK" : "⚠️ REVISAR"} (${results.types.coverage}%)`
  );
  console.log(
    `  • Hooks: ${results.hooks.compatible ? "✅ OK" : "⚠️ REVISAR"} (${results.hooks.essentialCoverage}%)`
  );
  console.log(`  • Componentes: ${results.components.compatible ? "✅ OK" : "⚠️ REVISAR"}`);
  console.log(
    `  • Configurações: ${results.configs.compatible ? "✅ OK" : "⚠️ REVISAR"} (${results.configs.coverage}%)`
  );
  console.log(
    `  • Integração: ${results.integration.compatible ? "✅ OK" : "⚠️ REVISAR"} (${results.integration.coverage}%)`
  );
  console.log(
    `  • Conflitos: ${results.conflicts.length === 0 ? "✅ NENHUM" : `⚠️ ${results.conflicts.length} encontrados`}`
  );

  console.log("\n🎁 RECURSOS DISPONÍVEIS:");
  console.log(`  • Hooks opcionais: ${results.hooks.bonusFeatures || 0} encontrados`);
  console.log(`  • Sistemas de editor: ${results.components.foundEditors.length} disponíveis`);
  console.log(`  • Componentes inline: ${results.components.inlineCount} criados`);

  if (overallScore >= 80) {
    console.log("\n🎉 SISTEMA ALTAMENTE COMPATÍVEL!");
    console.log("✅ Podemos aproveitar a estrutura existente");
    console.log("✅ Integração será simples e direta");
    console.log("✅ Mínima refatoração necessária");
  } else if (overallScore >= 60) {
    console.log("\n🔧 SISTEMA COMPATÍVEL COM AJUSTES");
    console.log("⚠️ Alguns ajustes serão necessários");
    console.log("⚠️ Integração requer cuidado");
    console.log("✅ Base sólida para trabalhar");
  } else {
    console.log("\n⚠️ SISTEMA REQUER REFATORAÇÃO SIGNIFICATIVA");
    console.log("❌ Incompatibilidades importantes detectadas");
    console.log("❌ Refatoração extensiva necessária");
    console.log("⚠️ Avaliar criação de sistema paralelo");
  }

  return { results, overallScore };
}

function generateRecommendations(results, score) {
  console.log("\n🎯 RECOMENDAÇÕES ESTRATÉGICAS:");
  console.log("=".repeat(60));

  if (score >= 80) {
    console.log("\n✅ ESTRATÉGIA RECOMENDADA: INTEGRAÇÃO DIRETA");
    console.log("  1. Aproveitar useUnifiedProperties existente");
    console.log("  2. Estender blockDefinitions com nossos componentes");
    console.log("  3. Integrar com sistema de editores existente");
    console.log("  4. Usar hooks de performance disponíveis");
    console.log("  5. Aproveitar sistema de autosave e history");
  } else if (score >= 60) {
    console.log("\n⚠️ ESTRATÉGIA RECOMENDADA: INTEGRAÇÃO GRADUAL");
    console.log("  1. Criar adaptadores para compatibilidade");
    console.log("  2. Migrar componentes em fases");
    console.log("  3. Manter sistemas paralelos temporariamente");
    console.log("  4. Consolidar após validação");
  } else {
    console.log("\n🔧 ESTRATÉGIA RECOMENDADA: REFATORAÇÃO CONTROLADA");
    console.log("  1. Criar novo sistema em paralelo");
    console.log("  2. Migrar dados gradualmente");
    console.log("  3. Manter compatibilidade com sistema legado");
    console.log("  4. Deprecar sistema antigo após validação");
  }

  console.log("\n🚀 PRÓXIMOS PASSOS RECOMENDADOS:");
  if (!results.types.compatible) {
    console.log("  📝 1. Atualizar definições de tipos");
  }
  if (!results.configs.compatible) {
    console.log("  ⚙️ 2. Completar configurações ausentes");
  }
  if (!results.integration.compatible) {
    console.log("  🔗 3. Implementar pontos de integração");
  }
  if (results.conflicts.length > 0) {
    console.log("  🛠️ 4. Resolver conflitos identificados");
  }
  console.log("  🧪 5. Executar testes de integração");
  console.log("  🎯 6. Validar funcionamento end-to-end");
}

// ====================================================================
// 🚀 EXECUÇÃO PRINCIPAL
// ====================================================================

console.log("🔍 INICIANDO ANÁLISE DE COMPATIBILIDADE DO SISTEMA");
console.log("=".repeat(80));

try {
  const { results, overallScore } = generateCompatibilityReport();
  generateRecommendations(results, overallScore);

  // Salvar relatório
  const reportPath = path.join(__dirname, "compatibility-analysis-report.json");
  fs.writeFileSync(
    reportPath,
    JSON.stringify({ results, overallScore, timestamp: new Date().toISOString() }, null, 2)
  );

  console.log(`\n💾 Relatório detalhado salvo em: ${reportPath}`);
  console.log("\n✅ ANÁLISE DE COMPATIBILIDADE CONCLUÍDA!");
} catch (error) {
  console.error("\n❌ ERRO NA ANÁLISE:", error.message);
  process.exit(1);
}
