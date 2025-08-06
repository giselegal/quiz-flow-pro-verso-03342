#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🔍 Analisando dependências do projeto...\n");

// Ler package.json
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const dependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};

console.log(`📦 Total de dependências: ${Object.keys(dependencies).length}\n`);

// Categorizar dependências
const categories = {
  ui: [],
  state: [],
  build: [],
  database: [],
  testing: [],
  utilities: [],
  react: [],
  typescript: [],
};

Object.keys(dependencies).forEach(dep => {
  if (dep.includes("radix") || dep.includes("ui") || dep.includes("tailwind")) {
    categories.ui.push(dep);
  } else if (dep.includes("zustand") || dep.includes("redux") || dep.includes("context")) {
    categories.state.push(dep);
  } else if (dep.includes("vite") || dep.includes("build") || dep.includes("esbuild")) {
    categories.build.push(dep);
  } else if (dep.includes("supabase") || dep.includes("database") || dep.includes("pg")) {
    categories.database.push(dep);
  } else if (dep.includes("test") || dep.includes("jest") || dep.includes("vitest")) {
    categories.testing.push(dep);
  } else if (dep.includes("react") || dep.includes("@types/react")) {
    categories.react.push(dep);
  } else if (dep.includes("typescript") || dep.includes("@types/")) {
    categories.typescript.push(dep);
  } else {
    categories.utilities.push(dep);
  }
});

// Mostrar categorias
Object.entries(categories).forEach(([category, deps]) => {
  if (deps.length > 0) {
    console.log(`📂 ${category.toUpperCase()}: ${deps.length} pacotes`);
    deps.forEach(dep => console.log(`   - ${dep}: ${dependencies[dep]}`));
    console.log("");
  }
});

// Salvar análise
const analysis = {
  name: "Package Dependency Analyzer",
  version: "1.0.0",
  analysis: {
    totalDependencies: Object.keys(dependencies).length,
    categories,
    recommendations: {
      toRemove: [],
      toUpdate: [],
      toOptimize: [],
    },
  },
  lastAnalysis: new Date().toISOString(),
};

fs.writeFileSync("package-analyzer.json", JSON.stringify(analysis, null, 2));
console.log("✅ Análise salva em package-analyzer.json");
