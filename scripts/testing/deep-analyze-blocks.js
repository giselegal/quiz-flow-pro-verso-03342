// Script para análise completa do blockDefinitions.ts

import fs from "fs";

const filePath = "./client/src/config/blockDefinitions.ts";
const content = fs.readFileSync(filePath, "utf8");

console.log("🔍 ANÁLISE DETALHADA DO ARQUIVO blockDefinitions.ts");
console.log("=".repeat(60));

// Contar diferentes padrões
const typeMatches = content.match(/type:\s*['"`]([^'"`]+)['"`]/g);
const nameMatches = content.match(/name:\s*['"`]([^'"`]+)['"`]/g);
const categoryMatches = content.match(/category:\s*['"`]([^'"`]+)['"`]/g);

console.log(`📊 ESTATÍSTICAS BRUTAS:`);
console.log(`- Total de objetos com 'type:': ${typeMatches ? typeMatches.length : 0}`);
console.log(`- Total de objetos com 'name:': ${nameMatches ? nameMatches.length : 0}`);
console.log(`- Total de objetos com 'category:': ${categoryMatches ? categoryMatches.length : 0}`);

// Tentar encontrar o array principal
const arrayMatch = content.match(/export\s+const\s+blockDefinitions[^=]*=\s*\[([\s\S]*)\];?\s*$/);

if (arrayMatch) {
  const arrayContent = arrayMatch[1];

  // Contar objetos válidos que têm pelo menos type e name
  const validBlocks = [];
  const objects = arrayContent.split(/},\s*{/).map((obj, index, arr) => {
    if (index === 0) return obj + "}";
    if (index === arr.length - 1) return "{" + obj;
    return "{" + obj + "}";
  });

  console.log(`\n📦 OBJETOS NO ARRAY: ${objects.length}`);

  objects.forEach((obj, index) => {
    const hasType = /type:\s*['"`]([^'"`]+)['"`]/.test(obj);
    const hasName = /name:\s*['"`]([^'"`]+)['"`]/.test(obj);

    if (hasType && hasName) {
      const typeMatch = obj.match(/type:\s*['"`]([^'"`]+)['"`]/);
      const nameMatch = obj.match(/name:\s*['"`]([^'"`]+)['"`]/);
      const categoryMatch = obj.match(/category:\s*['"`]([^'"`]+)['"`]/);

      validBlocks.push({
        index: index + 1,
        type: typeMatch ? typeMatch[1] : "unknown",
        name: nameMatch ? nameMatch[1] : "unknown",
        category: categoryMatch ? categoryMatch[1] : "Sem Categoria",
      });
    }
  });

  console.log(`\n✅ BLOCOS VÁLIDOS ENCONTRADOS: ${validBlocks.length}`);

  // Agrupar por categoria
  const byCategory = validBlocks.reduce((acc, block) => {
    if (!acc[block.category]) acc[block.category] = [];
    acc[block.category].push(block);
    return acc;
  }, {});

  const categories = Object.keys(byCategory).sort();
  console.log(`\n🏷️ CATEGORIAS (${categories.length}):`);

  categories.forEach(category => {
    console.log(`\n📁 ${category.toUpperCase()}: ${byCategory[category].length} componentes`);
    byCategory[category].slice(0, 5).forEach(block => {
      console.log(`   ${block.index}. ${block.type} - ${block.name}`);
    });
    if (byCategory[category].length > 5) {
      console.log(`   ... e mais ${byCategory[category].length - 5} componentes`);
    }
  });
} else {
  console.log("❌ Não foi possível encontrar o array blockDefinitions");
}

console.log("\n" + "=".repeat(60));
console.log("🔧 VERIFICAÇÃO: O problema pode estar na estrutura do array ou na exportação");
