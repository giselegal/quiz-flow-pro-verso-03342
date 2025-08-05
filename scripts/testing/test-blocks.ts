#!/usr/bin/env tsx

// Teste direto das definições dos blocos das etapas 20 e 21 - Versão TypeScript
import {
  blockDefinitions,
  getCategories,
  getBlocksByCategory,
} from "./src/config/blockDefinitionsClean";

console.log("=".repeat(60));
console.log("📊 VERIFICAÇÃO DOS COMPONENTES DAS ETAPAS 20 E 21 (TypeScript)");
console.log("=".repeat(60));

console.log("\n📈 ESTATÍSTICAS GERAIS:");
console.log(`Total de blocos definidos: ${blockDefinitions.length}`);
console.log(`Total de categorias: ${getCategories().length}`);
console.log(`Categorias disponíveis: ${getCategories().join(", ")}`);

console.log("\n🔍 BUSCA POR BLOCOS DAS ETAPAS 20 E 21:");

// Buscar bloco da etapa 20 - Com tipos seguros
const modernResultBlock = blockDefinitions.find(block => block.type === "modern-result-page");
if (modernResultBlock) {
  console.log("\n✅ ETAPA 20 - ENCONTRADA:");
  console.log(`  Nome: ${modernResultBlock.name}`);
  console.log(`  Tipo: ${modernResultBlock.type}`);
  console.log(`  Categoria: ${modernResultBlock.category}`);
  console.log(`  Ícone: ${modernResultBlock.icon}`);
  console.log(`  Descrição: ${modernResultBlock.description}`);
  console.log(`  Propriedades: ${modernResultBlock.propertiesSchema.length} configurações`);

  console.log("\n  📝 Propriedades disponíveis:");
  modernResultBlock.propertiesSchema.forEach((prop, index) => {
    console.log(`    ${index + 1}. ${prop.label} (${prop.type})`);
  });
} else {
  console.log('\n❌ ETAPA 20 - NÃO ENCONTRADA: Bloco "modern-result-page" não existe!');
}

// Buscar bloco da etapa 21 - Com tipos seguros
const quizOfferBlock = blockDefinitions.find(block => block.type === "quiz-offer-page");
if (quizOfferBlock) {
  console.log("\n✅ ETAPA 21 - ENCONTRADA:");
  console.log(`  Nome: ${quizOfferBlock.name}`);
  console.log(`  Tipo: ${quizOfferBlock.type}`);
  console.log(`  Categoria: ${quizOfferBlock.category}`);
  console.log(`  Ícone: ${quizOfferBlock.icon}`);
  console.log(`  Descrição: ${quizOfferBlock.description}`);
  console.log(`  Propriedades: ${quizOfferBlock.propertiesSchema.length} configurações`);

  console.log("\n  📝 Propriedades disponíveis:");
  quizOfferBlock.propertiesSchema.forEach((prop, index) => {
    console.log(`    ${index + 1}. ${prop.label} (${prop.type})`);
  });
} else {
  console.log('\n❌ ETAPA 21 - NÃO ENCONTRADA: Bloco "quiz-offer-page" não existe!');
}

console.log("\n📊 RESUMO POR CATEGORIA:");
getCategories().forEach(category => {
  const categoryBlocks = getBlocksByCategory(category);
  console.log(`\n📁 ${category}: ${categoryBlocks.length} blocos`);

  categoryBlocks.forEach((block, index) => {
    const isTargetBlock = block.type === "modern-result-page" || block.type === "quiz-offer-page";
    const marker = isTargetBlock ? "🎯" : "  ";
    console.log(`${marker} ${index + 1}. ${block.name} (${block.type})`);
  });
});

console.log("\n" + "=".repeat(60));
console.log("🎉 VERIFICAÇÃO COMPLETA - TypeScript Edition");
console.log("=".repeat(60));
