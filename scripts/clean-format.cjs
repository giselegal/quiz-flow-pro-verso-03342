#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🔧 Fazendo correção precisa da formatação...");

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

  console.log(`🔧 Arrumando: ${fileName}`);

  let content = fs.readFileSync(filePath, "utf8");

  // Remover linhas problemáticas
  content = content.replace(/\n\s*edi\s*\n/g, "\n");
  content = content.replace(/\n\s*edi\s*/g, "\n");

  // Corrigir estrutura dos properties
  content = content.replace(
    /(properties:\s*\{[\s\S]*?)(,\s*)?(marginTop:\s*\d+|marginBottom:\s*\d+|spacing:\s*"[^"]*")\n\s*\}/g,
    (match, props, comma, lastProp) => {
      return props.trim() + (comma || ",") + "\n        " + lastProp + "\n      }";
    }
  );

  // Garantir formatação correta
  content = content.replace(/\},\n\s*\},/g, "}\n    },");

  fs.writeFileSync(filePath, content, "utf8");
  console.log(`✅ ${fileName} - Arrumado`);
});

console.log("🎉 Formatação corrigida!");
