// Script para verificar tipos duplicados no blockDefinitions
const fs = require("fs");
const path = require("path");

// Ler o arquivo blockDefinitions.ts
const filePath = path.join(__dirname, "src", "config", "blockDefinitions.ts");
const content = fs.readFileSync(filePath, "utf8");

// Extrair todos os tipos usando regex
const typeMatches = content.match(/type:\s*['"]([^'"]+)['"]/g);

if (typeMatches) {
  const types = typeMatches
    .map(match => {
      const typeMatch = match.match(/type:\s*['"]([^'"]+)['"]/);
      return typeMatch ? typeMatch[1] : null;
    })
    .filter(Boolean);

  // Verificar duplicatas
  const typeCounts = {};
  types.forEach(type => {
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  const duplicates = Object.entries(typeCounts).filter(([type, count]) => count > 1);

  if (duplicates.length > 0) {
    console.log("Tipos duplicados encontrados:");
    duplicates.forEach(([type, count]) => {
      console.log(`- ${type}: ${count} ocorrências`);
    });
  } else {
    console.log("Nenhum tipo duplicado encontrado nos blockDefinitions.");
  }

  console.log(`\nTotal de tipos encontrados: ${types.length}`);
  console.log(`Tipos únicos: ${Object.keys(typeCounts).length}`);
} else {
  console.log("Nenhum tipo encontrado no arquivo.");
}
