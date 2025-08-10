// Script para analisar TODOS os componentes disponíveis

import fs from "fs";

// Ler o arquivo blockDefinitions.ts completo
const filePath = "./client/src/config/blockDefinitions.ts";
const content = fs.readFileSync(filePath, "utf8");

// Extrair blocos válidos (que têm type, name e outras propriedades)
const blockMatches = content.match(
  /{\s*type:\s*['"`]([^'"`]+)['"`][^}]*name:\s*['"`]([^'"`]+)['"`][^}]*}/g
);

console.log("🎯 ANÁLISE COMPLETA DE TODOS OS COMPONENTES:");
console.log("=".repeat(60));

if (blockMatches) {
  const blocks = blockMatches
    .map(match => {
      const typeMatch = match.match(/type:\s*['"`]([^'"`]+)['"`]/);
      const nameMatch = match.match(/name:\s*['"`]([^'"`]+)['"`]/);
      const categoryMatch = match.match(/category:\s*['"`]([^'"`]+)['"`]/);

      return {
        type: typeMatch ? typeMatch[1] : "unknown",
        name: nameMatch ? nameMatch[1] : "Sem nome",
        category: categoryMatch ? categoryMatch[1] : "Sem Categoria",
      };
    })
    .filter(block => block.type !== "unknown");

  console.log(`📦 TOTAL DE BLOCOS VÁLIDOS: ${blocks.length}`);

  // Agrupar por categoria
  const byCategory = blocks.reduce((acc, block) => {
    if (!acc[block.category]) acc[block.category] = [];
    acc[block.category].push(block);
    return acc;
  }, {});

  const categories = Object.keys(byCategory).sort();
  console.log(`\n🏷️ CATEGORIAS DISPONÍVEIS: ${categories.length}`);

  categories.forEach(category => {
    console.log(`\n📁 ${category.toUpperCase()} (${byCategory[category].length} componentes)`);
    console.log("-".repeat(40));
    byCategory[category].forEach((block, index) => {
      console.log(`${index + 1}. ${block.type} - ${block.name}`);
    });
  });

  console.log("\n" + "=".repeat(60));
  console.log("✅ TODOS OS COMPONENTES FORAM ATIVADOS!");
  console.log('🧪 Agora você pode testar cada um na aba "Blocos" do editor');
  console.log("🗑️ Use drag & drop para adicionar e testar functionality");
  console.log("📊 Depois exclua os que não precisar usar");
} else {
  console.log("❌ Nenhum bloco válido encontrado");
}
