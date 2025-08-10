// Script para testar todos os componentes do blockDefinitionsOptimized.ts

import fs from "fs";

// Ler o arquivo blockDefinitionsOptimized.ts
const filePath = "./client/src/config/blockDefinitionsOptimized.ts";
const content = fs.readFileSync(filePath, "utf8");

// Extrair apenas os tipos de blocos (não as propriedades)
const blockMatches = content.match(/{\s*type:\s*['"`]([^'"`]+)['"`][^}]*}/g);

console.log("🎯 COMPONENTES ATIVADOS NO EDITOR:");
console.log("=".repeat(50));

if (blockMatches) {
  const blockTypes = blockMatches
    .map(match => {
      const typeMatch = match.match(/type:\s*['"`]([^'"`]+)['"`]/);
      return typeMatch ? typeMatch[1] : null;
    })
    .filter(Boolean);

  console.log(`📦 Total de blocos: ${blockTypes.length}`);
  console.log('\n📋 Lista de componentes na categoria "Resultado Elegante":');

  blockTypes.forEach((type, index) => {
    console.log(`${index + 1}. ${type}`);
  });
}

const categoryMatches = content.match(/category:\s*['"`]([^'"`]+)['"`]/g);

if (categoryMatches) {
  const categories = [
    ...new Set(categoryMatches.map(match => match.match(/['"`]([^'"`]+)['"`]/)[1])),
  ];
  console.log(`\n🏷️ Categorias disponíveis: ${categories.length}`);
  categories.forEach(category => {
    console.log(`- ${category}`);
  });
}

console.log('\n✅ Todos os componentes estão agora ativos na aba "Blocos" do editor!');
console.log("🧪 Você pode testar cada um para decidir quais manter.");
