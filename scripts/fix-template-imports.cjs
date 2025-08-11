#!/usr/bin/env node

// Script para remover imports desnecessários dos templates
const fs = require("fs");
const path = require("path");

const templatesDir = "src/components/steps";
const problematicImports = [
  'import { useContainerProperties } from "@/hooks/useContainerProperties";',
  'import { useDebounce } from "@/hooks/useDebounce";',
  'import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";',
];

function fixTemplate(filePath) {
  console.log(`🔧 Corrigindo: ${filePath}`);

  let content = fs.readFileSync(filePath, "utf8");
  let fixed = false;

  // Remover imports problemáticos
  problematicImports.forEach(importLine => {
    if (content.includes(importLine)) {
      content = content.replace(importLine + "\n", "");
      fixed = true;
    }
  });

  // Remover linhas vazias extras
  content = content.replace(/\n\n\n+/g, "\n\n");

  if (fixed) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ ${filePath} corrigido`);
    return true;
  } else {
    console.log(`⚪ ${filePath} já estava ok`);
    return false;
  }
}

const templateFiles = [
  "Step04Template.tsx",
  "Step05Template.tsx",
  "Step07Template.tsx",
  "Step09Template.tsx",
  "Step10Template.tsx",
  "Step11Template.tsx",
  "Step12Template.tsx",
  "Step13Template.tsx",
  "Step14Template.tsx",
  "Step15Template.tsx",
  "Step16Template.tsx",
  "Step17Template.tsx",
  "Step20Template.tsx",
  "Step21Template.tsx",
];

console.log("🚀 Iniciando correção dos templates...\n");

let fixedCount = 0;
templateFiles.forEach(fileName => {
  const filePath = path.join(templatesDir, fileName);
  if (fs.existsSync(filePath)) {
    if (fixTemplate(filePath)) {
      fixedCount++;
    }
  } else {
    console.log(`❌ Arquivo não encontrado: ${filePath}`);
  }
});

console.log(`\n✨ Correção finalizada! ${fixedCount} arquivos corrigidos.`);
