#!/usr/bin/env node

/**
 * 🔍 ANÁLISE COMPLETA: SISTEMAS PARALELOS E CONFLITOS
 *
 * Este script identifica implementações paralelas que podem estar causando conflitos
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 ANÁLISE COMPLETA: SISTEMAS PARALELOS E CONFLITOS");
console.log("=======================================================");

// Função para ler arquivo com tratamento de erro
function safeReadFile(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    return null;
  }
}

// 1. ANÁLISE DE REGISTRIES PARALELOS
function analyzeRegistries() {
  console.log("\\n📦 1. REGISTRIES PARALELOS");
  console.log("==============================");

  const registries = [
    "src/config/enhancedBlockRegistry.ts",
    "src/components/editor/blocks/EnhancedBlockRegistry.tsx",
    "src/components/result-editor/ComponentRegistry.tsx",
    "src/config/smartBlockRegistry.ts",
    "src/config/editorBlocksMapping.ts",
  ];

  const registryAnalysis = {};

  registries.forEach(registryPath => {
    if (fs.existsSync(registryPath)) {
      const content = safeReadFile(registryPath);
      if (content) {
        registryAnalysis[registryPath] = {
          exists: true,
          size: content.length,
          isEmpty: content.trim().length === 0,
          hasExport: content.includes("export"),
          hasComponents: content.includes("Component"),
        };

        console.log(`\\n📁 ${registryPath}`);
        console.log(`   📏 Tamanho: ${content.length} chars`);
        console.log(`   📋 Vazio: ${registryAnalysis[registryPath].isEmpty ? "SIM" : "NÃO"}`);
        console.log(
          `   📤 Tem exports: ${registryAnalysis[registryPath].hasExport ? "SIM" : "NÃO"}`
        );
        console.log(
          `   🧩 Tem componentes: ${registryAnalysis[registryPath].hasComponents ? "SIM" : "NÃO"}`
        );
      }
    } else {
      console.log(`\\n❌ ${registryPath} - NÃO EXISTE`);
    }
  });

  return registryAnalysis;
}

// 2. ANÁLISE DE HOOKS DE PROPRIEDADES
function analyzePropertiesHooks() {
  console.log("\\n🔗 2. HOOKS DE PROPRIEDADES");
  console.log("==============================");

  // Procurar hooks
  const hooksDir = "src/hooks";
  const propertiesHooks = [];

  if (fs.existsSync(hooksDir)) {
    const files = fs.readdirSync(hooksDir);
    files.forEach(file => {
      if (file.includes("Properties") || file.includes("properties")) {
        propertiesHooks.push(path.join(hooksDir, file));
      }
    });
  }

  propertiesHooks.forEach(hookPath => {
    const content = safeReadFile(hookPath);
    if (content) {
      console.log(`\\n📄 ${hookPath}`);
      console.log(`   📏 Tamanho: ${content.length} chars`);
      console.log(
        `   🎯 Função principal: ${content.includes("useUnifiedProperties") ? "useUnifiedProperties" : "outro"}`
      );
      console.log(`   📋 Cases: ${(content.match(/case\\s+"/g) || []).length}`);
      console.log(`   ⚙️ Está sendo usado: ${content.includes("export") ? "SIM" : "NÃO"}`);
    }
  });

  return propertiesHooks;
}

// 3. ANÁLISE DE PAINÉIS PARALELOS
function analyzePropertiesPanels() {
  console.log("\\n🎛️ 3. PAINÉIS DE PROPRIEDADES PARALELOS");
  console.log("===========================================");

  const panels = [];

  // Função recursiva para encontrar painéis
  function findPanels(dir) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    entries.forEach(entry => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        findPanels(fullPath);
      } else if (entry.name.includes("PropertiesPanel") && entry.name.endsWith(".tsx")) {
        panels.push(fullPath);
      }
    });
  }

  findPanels("src");

  panels.forEach(panelPath => {
    const content = safeReadFile(panelPath);
    if (content) {
      console.log(`\\n📋 ${panelPath}`);
      console.log(`   📏 Tamanho: ${content.length} chars`);
      console.log(
        `   🎯 Hook usado: ${content.includes("useUnifiedProperties") ? "useUnifiedProperties" : "outro/nenhum"}`
      );
      console.log(`   📤 É exportado: ${content.includes("export default") ? "SIM" : "NÃO"}`);
    }
  });

  return panels;
}

// 4. ANÁLISE DE IMPORTS CONFLITANTES
function analyzeImportConflicts() {
  console.log("\\n⚡ 4. CONFLITOS DE IMPORTS");
  console.log("==============================");

  const mainFiles = [
    "src/pages/editor-fixed-dragdrop.tsx",
    "src/components/editor/canvas/SortableBlockWrapper.tsx",
    "src/components/universal/EnhancedUniversalPropertiesPanel.tsx",
  ];

  const conflicts = {};

  mainFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const content = safeReadFile(filePath);
      if (content) {
        console.log(`\\n📄 ${filePath}`);

        // Verificar imports de registries
        const registryImports = content.match(/import.*from.*[Rr]egistry/g) || [];
        console.log(`   📦 Registry imports: ${registryImports.length}`);
        registryImports.forEach(imp => console.log(`      - ${imp}`));

        // Verificar imports de painéis
        const panelImports = content.match(/import.*PropertiesPanel/g) || [];
        console.log(`   🎛️ Panel imports: ${panelImports.length}`);
        panelImports.forEach(imp => console.log(`      - ${imp}`));

        // Verificar imports de hooks
        const hookImports = content.match(/import.*use.*Properties/g) || [];
        console.log(`   🔗 Hook imports: ${hookImports.length}`);
        hookImports.forEach(imp => console.log(`      - ${imp}`));

        conflicts[filePath] = {
          registryImports,
          panelImports,
          hookImports,
        };
      }
    }
  });

  return conflicts;
}

// 5. VERIFICAR QUAL SISTEMA ESTÁ ATIVO
function analyzeActiveSystem() {
  console.log("\\n🎯 5. SISTEMA ATUALMENTE ATIVO");
  console.log("==============================");

  // Verificar qual registry está sendo usado
  const mainEditor = "src/pages/editor-fixed-dragdrop.tsx";
  const wrapper = "src/components/editor/canvas/SortableBlockWrapper.tsx";

  if (fs.existsSync(mainEditor)) {
    const content = safeReadFile(mainEditor);
    if (content) {
      console.log("\\n📱 EDITOR PRINCIPAL (editor-fixed-dragdrop.tsx):");

      // Registry usado
      if (content.includes("enhancedBlockRegistry")) {
        console.log("   📦 Registry: src/config/enhancedBlockRegistry.ts ✅");
      } else if (content.includes("EnhancedBlockRegistry")) {
        console.log("   📦 Registry: src/components/editor/blocks/EnhancedBlockRegistry.tsx ⚠️");
      }

      // Painel usado
      if (content.includes("EnhancedUniversalPropertiesPanel")) {
        console.log("   🎛️ Painel: EnhancedUniversalPropertiesPanel ✅");
      }

      // Hook usado
      if (content.includes("useUnifiedProperties")) {
        console.log("   🔗 Hook: useUnifiedProperties ✅");
      }
    }
  }

  if (fs.existsSync(wrapper)) {
    const content = safeReadFile(wrapper);
    if (content) {
      console.log("\\n🔄 WRAPPER (SortableBlockWrapper.tsx):");

      // Registry usado
      if (content.includes("getBlockComponent")) {
        const registryMatch = content.match(/from ["']([^"']*[Rr]egistry[^"']*)/);
        if (registryMatch) {
          console.log(`   📦 Registry: ${registryMatch[1]} ✅`);
        }
      }

      // Hooks usados
      if (content.includes("useContainerProperties")) {
        console.log("   🔗 Hook: useContainerProperties ✅");
      }
    }
  }
}

// 6. RECOMENDAÇÕES DE LIMPEZA
function generateCleanupRecommendations(registryAnalysis, panels) {
  console.log("\\n🧹 6. RECOMENDAÇÕES DE LIMPEZA");
  console.log("==============================");

  const recommendations = [];

  // Registries
  Object.entries(registryAnalysis).forEach(([path, info]) => {
    if (info.isEmpty) {
      recommendations.push(`❌ REMOVER: ${path} (arquivo vazio)`);
    } else if (path !== "src/config/enhancedBlockRegistry.ts" && info.hasComponents) {
      recommendations.push(`⚠️ AVALIAR: ${path} (registry paralelo com componentes)`);
    }
  });

  // Painéis
  const activePanels = ["EnhancedUniversalPropertiesPanel"];
  panels.forEach(panelPath => {
    const panelName = path.basename(panelPath, ".tsx");
    if (!activePanels.some(active => panelPath.includes(active))) {
      recommendations.push(`⚠️ AVALIAR: ${panelPath} (painel não usado)`);
    }
  });

  recommendations.forEach(rec => console.log(rec));

  return recommendations;
}

// EXECUÇÃO PRINCIPAL
async function main() {
  try {
    const registryAnalysis = analyzeRegistries();
    const propertiesHooks = analyzePropertiesHooks();
    const panels = analyzePropertiesPanels();
    const conflicts = analyzeImportConflicts();

    analyzeActiveSystem();
    const recommendations = generateCleanupRecommendations(registryAnalysis, panels);

    console.log("\\n\\n📋 RESUMO DOS CONFLITOS ENCONTRADOS:");
    console.log("=====================================");

    const totalRegistries = Object.keys(registryAnalysis).length;
    const totalPanels = panels.length;
    const totalHooks = propertiesHooks.length;

    console.log(`📦 Registries encontrados: ${totalRegistries} (deveria ser 1)`);
    console.log(`🎛️ Painéis encontrados: ${totalPanels} (deveria ser 1-2)`);
    console.log(`🔗 Hooks encontrados: ${totalHooks} (deveria ser 1-2)`);
    console.log(`🧹 Recomendações de limpeza: ${recommendations.length}`);

    if (recommendations.length > 0) {
      console.log("\\n⚠️ AÇÃO NECESSÁRIA: Limpar sistemas paralelos para evitar conflitos");
    } else {
      console.log("\\n✅ SISTEMA LIMPO: Sem conflitos significativos detectados");
    }

    console.log("\\n✅ Análise concluída!");
  } catch (error) {
    console.error("❌ Erro durante a análise:", error.message);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = {
  analyzeRegistries,
  analyzePropertiesHooks,
  analyzePropertiesPanels,
  analyzeImportConflicts,
  analyzeActiveSystem,
  generateCleanupRecommendations,
};
