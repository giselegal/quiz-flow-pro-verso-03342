#!/usr/bin/env node

// =====================================================================
// TESTE DA ABA "BLOCOS" - VERIFICAÇÃO DE COMPONENTES
// =====================================================================

console.log('🧪 TESTANDO ABA "BLOCOS" DO EDITOR VISUAL\n');

// Importar as definições de blocos
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho para o arquivo de definições
const blockDefsPath = path.join(__dirname, "client", "src", "config", "blockDefinitionsClean.ts");

try {
  // Ler o arquivo
  const content = fs.readFileSync(blockDefsPath, "utf-8");

  console.log("📊 ANÁLISE DAS DEFINIÇÕES DE BLOCOS:");
  console.log("==========================================\n");

  // Extrair todos os tipos de blocos
  const typeMatches = content.match(/type:\s*['"`]([^'"`]+)['"`]/g);
  const nameMatches = content.match(/name:\s*['"`]([^'"`]+)['"`]/g);
  const categoryMatches = content.match(/category:\s*['"`]([^'"`]+)['"`]/g);

  if (typeMatches && nameMatches && categoryMatches) {
    const types = typeMatches.map(m => m.match(/['"`]([^'"`]+)['"`]/)[1]);
    const names = nameMatches.map(m => m.match(/['"`]([^'"`]+)['"`]/)[1]);
    const categories = categoryMatches.map(m => m.match(/['"`]([^'"`]+)['"`]/)[1]);

    console.log(`📝 Total de componentes registrados: ${types.length}\n`);

    // Agrupar por categoria
    const categoryCounts = {};
    const categoryBlocks = {};

    types.forEach((type, index) => {
      const category = categories[index];
      const name = names[index];

      if (!categoryCounts[category]) {
        categoryCounts[category] = 0;
        categoryBlocks[category] = [];
      }
      categoryCounts[category]++;
      categoryBlocks[category].push({ type, name });
    });

    // Mostrar por categoria
    Object.keys(categoryCounts)
      .sort()
      .forEach(category => {
        console.log(`📂 ${category}: ${categoryCounts[category]} componente(s)`);
        categoryBlocks[category].forEach(block => {
          console.log(`   • ${block.name} (${block.type})`);
        });
        console.log("");
      });

    // Verificar componentes críticos das etapas 20 e 21
    console.log("🎯 VERIFICAÇÃO DE COMPONENTES CRÍTICOS:");
    console.log("==========================================\n");

    const criticalComponents = [
      "quiz-intro-header",
      "options-grid",
      "progress-inline",
      "loading-animation",
      "image-display-inline",
      "result-header-inline",
      "result-card-inline",
      "style-card-inline",
      "testimonial-card-inline",
      "badge-inline",
      "quiz-offer-pricing-inline",
      "countdown-inline",
    ];

    criticalComponents.forEach(component => {
      const found = types.includes(component);
      console.log(`${found ? "✅" : "❌"} ${component}`);
    });

    console.log("\n🔍 COMPONENTES INLINE MODERNOS:");
    console.log("==========================================\n");

    const inlineComponents = types.filter(type => type.includes("inline"));
    inlineComponents.forEach(component => {
      console.log(`✨ ${component}`);
    });

    console.log(`\n📊 Total de componentes inline: ${inlineComponents.length}`);

    // Verificar se há problemas de configuração
    console.log("\n⚠️  VERIFICAÇÃO DE PROBLEMAS:");
    console.log("==========================================\n");

    // Verificar duplicatas
    const duplicates = types.filter((type, index) => types.indexOf(type) !== index);
    if (duplicates.length > 0) {
      console.log("❌ Componentes duplicados encontrados:");
      duplicates.forEach(dup => console.log(`   • ${dup}`));
    } else {
      console.log("✅ Nenhum componente duplicado encontrado");
    }

    // Verificar se há componentes sem propriedades
    const schemaMatches = content.match(/propertiesSchema:\s*\[[\s\S]*?\]/g);
    if (schemaMatches && schemaMatches.length === types.length) {
      console.log("✅ Todos os componentes têm schemas de propriedades");
    } else {
      console.log("⚠️  Alguns componentes podem estar sem schemas");
    }
  } else {
    console.log("❌ Erro ao extrair informações do arquivo");
  }
} catch (error) {
  console.error("❌ Erro ao ler arquivo:", error.message);
}

console.log("\n🎉 TESTE CONCLUÍDO!");
console.log("=================\n");
console.log("💡 Para testar visualmente:");
console.log("   1. Acesse http://localhost:3000");
console.log('   2. Vá para "Editor Schema-Driven"');
console.log('   3. Verifique a aba "Blocos" na lateral direita');
console.log("   4. Confirme se todos os componentes aparecem organizados por categoria");
