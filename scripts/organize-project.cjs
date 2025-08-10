#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🗂️ Organizando estrutura do projeto...\n");

// Analisar arquivos por tipo
const fileTypes = {
  components: 0,
  pages: 0,
  hooks: 0,
  utils: 0,
  types: 0,
  services: 0,
  styles: 0,
  tests: 0,
};

function analyzeDirectory(dir, basePath = "") {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  items.forEach(item => {
    const fullPath = path.join(dir, item.name);
    const relativePath = path.join(basePath, item.name);

    if (item.isDirectory() && !item.name.startsWith(".") && item.name !== "node_modules") {
      analyzeDirectory(fullPath, relativePath);
    } else if (item.isFile() && (item.name.endsWith(".tsx") || item.name.endsWith(".ts"))) {
      // Categorizar arquivo
      if (relativePath.includes("components")) fileTypes.components++;
      else if (relativePath.includes("pages")) fileTypes.pages++;
      else if (relativePath.includes("hooks")) fileTypes.hooks++;
      else if (relativePath.includes("utils")) fileTypes.utils++;
      else if (relativePath.includes("types")) fileTypes.types++;
      else if (relativePath.includes("services")) fileTypes.services++;
      else if (relativePath.includes("styles")) fileTypes.styles++;
      else if (relativePath.includes("test") || item.name.includes(".test.")) fileTypes.tests++;
    }
  });
}

// Analisar src/
if (fs.existsSync("src")) {
  analyzeDirectory("src", "src");
}

console.log("📊 Análise da estrutura:");
Object.entries(fileTypes).forEach(([type, count]) => {
  console.log(`   ${type}: ${count} arquivos`);
});

// Criar relatório de complexidade
const totalFiles = Object.values(fileTypes).reduce((sum, count) => sum + count, 0);
const complexityLevel = totalFiles > 1000 ? "ALTA" : totalFiles > 500 ? "MÉDIA" : "BAIXA";

console.log(`\n📈 Complexidade do projeto: ${complexityLevel} (${totalFiles} arquivos)\n`);

// Recomendações
const recommendations = [];

if (fileTypes.components > 300) {
  recommendations.push("🔧 Considere dividir componentes em subpastas por funcionalidade");
}

if (fileTypes.utils > 50) {
  recommendations.push("📦 Organize utils em módulos específicos");
}

if (fileTypes.tests < totalFiles * 0.3) {
  recommendations.push("🧪 Adicione mais testes (cobertura atual baixa)");
}

if (recommendations.length > 0) {
  console.log("💡 Recomendações:");
  recommendations.forEach(rec => console.log(`   ${rec}`));
}

console.log("\n✅ Análise de organização concluída");
