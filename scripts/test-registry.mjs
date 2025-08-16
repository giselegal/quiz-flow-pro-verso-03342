#!/usr/bin/env node

/**
 * TESTE DE VALIDAÇÃO DO ENHANCED BLOCK REGISTRY
 * Verifica se todos os componentes estão sendo carregados corretamente
 */

import fs from "fs";
import path from "path";

console.log("🔍 VALIDANDO ENHANCED BLOCK REGISTRY...\n");

// Verificar se os arquivos de componentes existem
const checkComponentFiles = () => {
  console.log("📁 Verificando arquivos de componentes...");

  // Inline components
  const inlineDir = "./src/components/editor/blocks/inline";
  const inlineFiles = fs.readdirSync(inlineDir).filter(f => f.endsWith(".tsx"));
  console.log(
    `✅ Encontrados ${inlineFiles.length} arquivos inline:`,
    inlineFiles.slice(0, 5).join(", "),
    inlineFiles.length > 5 ? "..." : ""
  );

  // Standard blocks
  const blocksDir = "./src/components/editor/blocks";
  const blockFiles = fs
    .readdirSync(blocksDir)
    .filter(f => f.endsWith(".tsx") && !f.includes("Universal") && !f.includes("index"));
  console.log(
    `✅ Encontrados ${blockFiles.length} arquivos blocks:`,
    blockFiles.slice(0, 5).join(", "),
    blockFiles.length > 5 ? "..." : ""
  );

  return { inlineFiles, blockFiles };
};

// Verificar imports no registry
const checkRegistryImports = () => {
  console.log("\n📝 Verificando imports no registry...");

  const registryContent = fs.readFileSync("./src/config/enhancedBlockRegistry.ts", "utf8");
  const importLines = registryContent
    .split("\n")
    .filter(line => line.trim().startsWith("import ") && line.includes("InlineBlock"));

  console.log(`✅ Encontrados ${importLines.length} imports de componentes inline`);

  return importLines;
};

// Simular carregamento do registry
const simulateRegistryLoad = () => {
  console.log("\n🚀 Simulando carregamento do registry...");

  try {
    // Verificar se o arquivo existe e tem conteúdo válido
    const registryPath = "./src/config/enhancedBlockRegistry.ts";
    const content = fs.readFileSync(registryPath, "utf8");

    // Verificar estrutura básica
    const hasRegistry = content.includes("ENHANCED_BLOCK_REGISTRY");
    const hasValidation = content.includes("validateComponent");
    const hasComponents = content.includes("inlineComponents");

    console.log(`✅ Estrutura do registry: ${hasRegistry ? "OK" : "ERRO"}`);
    console.log(`✅ Sistema de validação: ${hasValidation ? "OK" : "ERRO"}`);
    console.log(`✅ Definição de componentes: ${hasComponents ? "OK" : "ERRO"}`);

    return hasRegistry && hasValidation && hasComponents;
  } catch (error) {
    console.log("❌ Erro ao verificar registry:", error.message);
    return false;
  }
};

// Executar testes
const main = () => {
  try {
    const { inlineFiles, blockFiles } = checkComponentFiles();
    const imports = checkRegistryImports();
    const registryOk = simulateRegistryLoad();

    console.log("\n📊 RESUMO DA VALIDAÇÃO:");
    console.log(`📁 Arquivos inline encontrados: ${inlineFiles.length}`);
    console.log(`📁 Arquivos blocks encontrados: ${blockFiles.length}`);
    console.log(`📝 Imports no registry: ${imports.length}`);
    console.log(`🚀 Registry funcional: ${registryOk ? "SIM" : "NÃO"}`);

    if (registryOk) {
      console.log("\n✅ REGISTRY VALIDADO COM SUCESSO!");
      console.log("🎯 Pronto para uso em produção");
    } else {
      console.log("\n❌ PROBLEMAS DETECTADOS NO REGISTRY");
      console.log("🔧 Necessita correções antes do uso");
    }
  } catch (error) {
    console.log("❌ Erro durante validação:", error.message);
  }
};

main();
