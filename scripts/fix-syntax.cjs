#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🚨 Corrigindo erros de sintaxe...");

const stepFiles = [
  "Step01Template.tsx",
  "Step02Template.tsx",
  "Step03Template.tsx",
  "Step04Template.tsx",
  "Step05Template.tsx",
  "Step06Template.tsx",
  "Step07Template.tsx",
  "Step08Template.tsx",
  "Step09Template.tsx",
  "Step10Template.tsx",
  "Step11Template.tsx",
  "Step12Template.tsx",
  "Step13Template.tsx",
  "Step14Template.tsx",
  "Step15Template.tsx",
  "Step16Template.tsx",
  "Step17Template.tsx",
  "Step18Template.tsx",
  "Step19Template.tsx",
  "Step20Template.tsx",
  "Step21Template.tsx",
];

const basePath = "/workspaces/quiz-quest-challenge-verse/src/components/steps";

stepFiles.forEach(fileName => {
  const filePath = path.join(basePath, fileName);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ Arquivo não encontrado: ${fileName}`);
    return;
  }

  console.log(`🚨 Corrigindo: ${fileName}`);

  let content = fs.readFileSync(filePath, "utf8");

  // Corrigir vírgulas duplas
  content = content.replace(/,,/g, ",");

  // Corrigir espaços em branco problemáticos
  content = content.replace(/,\s*\n\s*,/g, ",");

  // Corrigir propriedades malformadas
  content = content.replace(/(\w+):\s*([^,\n}]+),,/g, "$1: $2,");

  // Remover vírgulas antes de }
  content = content.replace(/,\s*\n\s*}/g, "\n      }");

  // Corrigir indentação
  content = content.replace(/^(\s*)(marginTop:|marginBottom:|spacing:)/gm, "        $2");

  // Garantir vírgulas onde necessário
  content = content.replace(/([^,])\n\s*(marginTop:|marginBottom:|spacing:)/g, "$1,\n        $2");

  fs.writeFileSync(filePath, content, "utf8");
  console.log(`✅ ${fileName} - Corrigido`);
});

console.log("🎉 Erros de sintaxe corrigidos!");
