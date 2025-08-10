#!/usr/bin/env node

/**
 * 🔍 ANALISADOR DE HOOKS EXISTENTES
 * =================================
 *
 * Este script analisa todos os hooks existentes no projeto
 * para identificar funcionalidades que podem ser aproveitadas
 * na nossa estrutura otimizada.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====================================================================
// 🔍 ANÁLISE DOS HOOKS EXISTENTES
// ====================================================================

function analyzeHook(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");

    // Extrair informações básicas
    const lines = content.split("\n");
    const totalLines = lines.length;

    // Detectar padrões
    const patterns = {
      useState: (content.match(/useState/g) || []).length,
      useEffect: (content.match(/useEffect/g) || []).length,
      useCallback: (content.match(/useCallback/g) || []).length,
      useMemo: (content.match(/useMemo/g) || []).length,
      customHooks: (content.match(/use[A-Z][a-zA-Z]*/g) || []).length,
      exports: (content.match(/export/g) || []).length,
      typescript: content.includes("interface") || content.includes("type "),
      hasTests:
        fs.existsSync(filePath.replace(".ts", ".test.ts")) ||
        fs.existsSync(filePath.replace(".tsx", ".test.tsx")),
    };

    // Detectar funcionalidade principal
    let functionality = "utility";
    if (content.includes("quiz") || content.includes("Quiz")) functionality = "quiz";
    else if (content.includes("editor") || content.includes("Editor")) functionality = "editor";
    else if (content.includes("result") || content.includes("Result")) functionality = "result";
    else if (content.includes("supabase") || content.includes("Supabase"))
      functionality = "database";
    else if (content.includes("performance") || content.includes("Performance"))
      functionality = "performance";
    else if (content.includes("animation") || content.includes("Animation"))
      functionality = "animation";
    else if (content.includes("mobile") || content.includes("Media")) functionality = "responsive";

    // Detectar complexidade
    const complexity = totalLines > 100 ? "high" : totalLines > 50 ? "medium" : "low";

    // Detectar se está sendo usado
    const isUsed =
      content.includes("export") &&
      !content.includes("// TODO") &&
      !content.includes("// DEPRECATED");

    return {
      totalLines,
      patterns,
      functionality,
      complexity,
      isUsed,
      lastModified: fs.statSync(filePath).mtime,
    };
  } catch (error) {
    return {
      error: error.message,
      totalLines: 0,
      patterns: {},
      functionality: "unknown",
      complexity: "unknown",
      isUsed: false,
    };
  }
}

function analyzeAllHooks() {
  console.log("🔍 ANALISANDO HOOKS EXISTENTES...");
  console.log("=".repeat(80));

  const hooksDir = path.join(__dirname, "src/hooks");
  const files = fs
    .readdirSync(hooksDir)
    .filter(
      file =>
        (file.endsWith(".ts") || file.endsWith(".tsx")) &&
        !file.includes(".backup") &&
        !file.includes(".test") &&
        !file.includes("index")
    );

  const analysis = {};
  const categories = {
    quiz: [],
    editor: [],
    result: [],
    database: [],
    performance: [],
    animation: [],
    responsive: [],
    utility: [],
  };

  files.forEach(file => {
    const filePath = path.join(hooksDir, file);
    const hookName = file.replace(/\.(ts|tsx)$/, "");

    console.log(`📋 Analisando: ${hookName}...`);

    const result = analyzeHook(filePath);
    analysis[hookName] = result;

    categories[result.functionality].push({
      name: hookName,
      ...result,
    });
  });

  return { analysis, categories, totalHooks: files.length };
}

function generateHooksReport(data) {
  console.log("\n📊 RELATÓRIO DE HOOKS EXISTENTES");
  console.log("=".repeat(80));

  console.log(`\n📈 ESTATÍSTICAS GERAIS:`);
  console.log(`  • Total de hooks: ${data.totalHooks}`);

  // Análise por categoria
  console.log(`\n🏷️ DISTRIBUIÇÃO POR CATEGORIA:`);
  Object.entries(data.categories).forEach(([category, hooks]) => {
    if (hooks.length > 0) {
      console.log(`  📁 ${category.toUpperCase()}: ${hooks.length} hooks`);
      hooks.forEach(hook => {
        const complexity =
          hook.complexity === "high" ? "🔴" : hook.complexity === "medium" ? "🟡" : "🟢";
        const usage = hook.isUsed ? "✅" : "⚠️";
        console.log(`    ${complexity} ${usage} ${hook.name} (${hook.totalLines} linhas)`);
      });
    }
  });

  // Hooks mais complexos
  console.log(`\n🔥 HOOKS MAIS COMPLEXOS:`);
  const complexHooks = Object.entries(data.analysis)
    .filter(([_, hook]) => hook.totalLines > 50)
    .sort(([_, a], [__, b]) => b.totalLines - a.totalLines)
    .slice(0, 10);

  complexHooks.forEach(([name, hook]) => {
    console.log(`  🔴 ${name}: ${hook.totalLines} linhas (${hook.functionality})`);
  });

  return data;
}

function identifyIntegrationOpportunities(data) {
  console.log("\n🎯 OPORTUNIDADES DE INTEGRAÇÃO");
  console.log("=".repeat(80));

  // Hooks relacionados ao quiz que podemos aproveitar
  const quizHooks = data.categories.quiz;
  console.log(`\n🧩 HOOKS DE QUIZ (${quizHooks.length}):`);
  quizHooks.forEach(hook => {
    console.log(`  ✅ ${hook.name} - ${hook.functionality} (${hook.totalLines} linhas)`);
  });

  // Hooks de editor que podemos integrar
  const editorHooks = data.categories.editor;
  console.log(`\n✏️ HOOKS DE EDITOR (${editorHooks.length}):`);
  editorHooks.forEach(hook => {
    console.log(`  ✅ ${hook.name} - ${hook.functionality} (${hook.totalLines} linhas)`);
  });

  // Hooks de performance que podemos usar
  const performanceHooks = data.categories.performance;
  console.log(`\n⚡ HOOKS DE PERFORMANCE (${performanceHooks.length}):`);
  performanceHooks.forEach(hook => {
    console.log(`  ⚡ ${hook.name} - ${hook.functionality} (${hook.totalLines} linhas)`);
  });

  // Hooks utilitários importantes
  const utilityHooks = data.categories.utility.filter(hook => hook.totalLines > 20);
  console.log(`\n🛠️ HOOKS UTILITÁRIOS IMPORTANTES (${utilityHooks.length}):`);
  utilityHooks.forEach(hook => {
    console.log(`  🛠️ ${hook.name} - ${hook.totalLines} linhas`);
  });
}

function analyzeSpecificHooks(data) {
  console.log("\n🔬 ANÁLISE DETALHADA DE HOOKS CHAVE");
  console.log("=".repeat(80));

  const keyHooks = [
    "useQuiz",
    "useQuizBuilder",
    "useQuizLogic",
    "useQuizResults",
    "useUnifiedProperties",
    "useEditor",
    "usePerformanceOptimization",
    "use-mobile",
  ];

  keyHooks.forEach(hookName => {
    const hook = data.analysis[hookName];
    if (hook) {
      console.log(`\n📋 ${hookName.toUpperCase()}:`);
      console.log(`  📊 Linhas: ${hook.totalLines}`);
      console.log(`  🏷️ Categoria: ${hook.functionality}`);
      console.log(`  🔥 Complexidade: ${hook.complexity}`);
      console.log(`  ✅ Em uso: ${hook.isUsed ? "Sim" : "Não"}`);

      if (hook.patterns) {
        console.log(`  🧩 Padrões:`);
        Object.entries(hook.patterns).forEach(([pattern, count]) => {
          if (count > 0) {
            console.log(`    • ${pattern}: ${count}x`);
          }
        });
      }
    } else {
      console.log(`\n❌ ${hookName}: Não encontrado`);
    }
  });
}

function generateIntegrationPlan(data) {
  console.log("\n🚀 PLANO DE INTEGRAÇÃO RECOMENDADO");
  console.log("=".repeat(80));

  console.log("\n🎯 FASE 1 - HOOKS CRÍTICOS (Usar imediatamente):");
  const criticalHooks = [
    { name: "useQuiz", reason: "Lógica central do quiz" },
    { name: "useQuizLogic", reason: "Cálculos e scoring" },
    { name: "useUnifiedProperties", reason: "Já otimizado para propriedades" },
    { name: "use-mobile", reason: "Responsividade essencial" },
    { name: "usePerformanceOptimization", reason: "Performance crítica" },
  ];

  criticalHooks.forEach(hook => {
    const exists = data.analysis[hook.name] ? "✅" : "❌";
    console.log(`  ${exists} ${hook.name} - ${hook.reason}`);
  });

  console.log("\n🔧 FASE 2 - HOOKS DE SUPORTE (Integrar gradualmente):");
  const supportHooks = [
    { name: "useQuizBuilder", reason: "Construção dinâmica de quiz" },
    { name: "useQuizResults", reason: "Exibição de resultados" },
    { name: "useEditor", reason: "Funcionalidades do editor" },
    { name: "useAutoSave", reason: "Salvamento automático" },
    { name: "useKeyboardShortcuts", reason: "UX do editor" },
  ];

  supportHooks.forEach(hook => {
    const exists = data.analysis[hook.name] ? "✅" : "❌";
    console.log(`  ${exists} ${hook.name} - ${hook.reason}`);
  });

  console.log("\n⚡ FASE 3 - HOOKS DE OTIMIZAÇÃO (Performance):");
  const optimizationHooks = [
    { name: "useDebounce", reason: "Otimização de inputs" },
    { name: "useMemo", reason: "Cache de componentes" },
    { name: "useCallback", reason: "Otimização de funções" },
    { name: "useLoadingState", reason: "Estados de carregamento" },
  ];

  optimizationHooks.forEach(hook => {
    const pattern = hook.name.replace("use", "").toLowerCase();
    const hasPattern = Object.values(data.analysis).some(
      h => h.patterns && h.patterns[pattern] > 0
    );
    const status = hasPattern ? "✅" : "❌";
    console.log(`  ${status} ${hook.name} - ${hook.reason}`);
  });
}

function createHooksIndexFile(data) {
  console.log("\n📁 CRIANDO ÍNDICE DE HOOKS OTIMIZADO...");

  const indexContent = `/**
 * 🔗 ÍNDICE DE HOOKS OTIMIZADO
 * ============================
 * 
 * Exportação centralizada de todos os hooks do sistema.
 * Organizado por categoria para melhor manutenibilidade.
 */

// ====================================================================
// 🧩 HOOKS DE QUIZ (Core)
// ====================================================================
export { useQuiz } from './useQuiz';
export { useQuizLogic } from './useQuizLogic';
export { useQuizBuilder } from './useQuizBuilder';
export { useQuizResults } from './useQuizResults';
export { useQuizConfig } from './useQuizConfig';
export { useQuizTracking } from './useQuizTracking';

// ====================================================================
// ✏️ HOOKS DE EDITOR
// ====================================================================
export { useEditor } from './useEditor';
export { useUnifiedProperties } from './useUnifiedProperties';
export { useInlineEdit } from './useInlineEdit';
export { useBlockForm } from './useBlockForm';
export { usePropertyHistory } from './usePropertyHistory';
export { useLiveEditor } from './useLiveEditor';

// ====================================================================
// 📱 HOOKS DE RESPONSIVIDADE
// ====================================================================
export { useIsMobile, useIsLowPerformanceDevice } from './use-mobile';
export { useMediaQuery } from './useMediaQuery';

// ====================================================================
// ⚡ HOOKS DE PERFORMANCE
// ====================================================================
export { usePerformanceOptimization } from './usePerformanceOptimization';
export { useDebounce } from './useDebounce';
export { useLoadingState } from './useLoadingState';
export { useOptimizedTimer } from './useOptimizedTimer';

// ====================================================================
// 🎨 HOOKS DE UI/UX
// ====================================================================
export { useAutoAnimate } from './useAutoAnimate';
export { useKeyboardShortcuts } from './useKeyboardShortcuts';
export { useScrollTracking } from './useScrollTracking';
export { useGlobalStyles } from './useGlobalStyles';

// ====================================================================
// 💾 HOOKS DE DADOS
// ====================================================================
export { useSupabase } from './useSupabase';
export { useSupabaseQuiz } from './useSupabaseQuiz';
export { useAutosave } from './useAutosave';
export { useHistory } from './useHistory';

// ====================================================================
// 🛠️ HOOKS UTILITÁRIOS
// ====================================================================
export { useToast } from './use-toast';
export { useABTest } from './useABTest';
export { useUtmParameters } from './useUtmParameters';
export { useGlobalLoading } from './useGlobalLoading';

// ====================================================================
// 📊 ESTATÍSTICAS DOS HOOKS
// ====================================================================
export const HOOKS_STATS = {
  total: ${data.totalHooks},
  byCategory: {
    quiz: ${data.categories.quiz.length},
    editor: ${data.categories.editor.length},
    performance: ${data.categories.performance.length},
    utility: ${data.categories.utility.length},
    responsive: ${data.categories.responsive.length},
    animation: ${data.categories.animation.length},
    database: ${data.categories.database.length},
    result: ${data.categories.result.length}
  },
  lastAnalyzed: '${new Date().toISOString()}'
};`;

  const indexPath = path.join(__dirname, "src/hooks/index.ts");
  fs.writeFileSync(indexPath, indexContent);
  console.log("  ✅ Índice criado: src/hooks/index.ts");
}

function generateSummary(data) {
  console.log("\n🏆 RESUMO DA ANÁLISE");
  console.log("=".repeat(80));

  console.log(`\n📊 NÚMEROS FINAIS:`);
  console.log(`  • Total de hooks analisados: ${data.totalHooks}`);
  console.log(`  • Hooks de quiz: ${data.categories.quiz.length}`);
  console.log(`  • Hooks de editor: ${data.categories.editor.length}`);
  console.log(`  • Hooks de performance: ${data.categories.performance.length}`);
  console.log(`  • Hooks utilitários: ${data.categories.utility.length}`);

  const totalLines = Object.values(data.analysis).reduce(
    (acc, hook) => acc + (hook.totalLines || 0),
    0
  );
  console.log(`  • Total de linhas de código: ${totalLines}`);

  console.log(`\n✅ RECOMENDAÇÕES:`);
  console.log(`  1. Usar useQuiz e useQuizLogic como base`);
  console.log(`  2. Integrar use-mobile para responsividade`);
  console.log(`  3. Aproveitar useUnifiedProperties otimizado`);
  console.log(`  4. Implementar hooks de performance`);
  console.log(`  5. Criar índice centralizado de exports`);

  console.log(`\n🎯 PRÓXIMOS PASSOS:`);
  console.log(`  1. Integrar hooks críticos no sistema otimizado`);
  console.log(`  2. Testar compatibilidade com 21 etapas`);
  console.log(`  3. Otimizar performance com hooks específicos`);
  console.log(`  4. Documentar integração completa`);

  console.log(
    `\n🚀 ESTRUTURA EXISTENTE APROVEITÁVEL: ${Math.round((data.totalHooks / 50) * 100)}%`
  );
}

// ====================================================================
// 🚀 EXECUÇÃO PRINCIPAL
// ====================================================================

console.log("🔍 INICIANDO ANÁLISE COMPLETA DOS HOOKS EXISTENTES");
console.log("=".repeat(80));

try {
  const data = analyzeAllHooks();
  generateHooksReport(data);
  identifyIntegrationOpportunities(data);
  analyzeSpecificHooks(data);
  generateIntegrationPlan(data);
  createHooksIndexFile(data);
  generateSummary(data);

  // Salvar relatório completo
  const reportPath = path.join(__dirname, "hooks-analysis-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(data, null, 2));
  console.log(`\n💾 Relatório completo salvo em: ${reportPath}`);

  console.log("\n✅ ANÁLISE DE HOOKS CONCLUÍDA!");
} catch (error) {
  console.error("\n❌ ERRO NA ANÁLISE:", error.message);
  process.exit(1);
}
