#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🔧 Corrigindo formatação e padronizando margens...");

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

  console.log(`🔧 Corrigindo: ${fileName}`);

  let content = fs.readFileSync(filePath, "utf8");

  // Corrigir problemas de formatação primeiro
  content = content.replace(/,,\s*\n\s*spacing:/g, ",\n        spacing:");
  content = content.replace(/\n\s*edi\s*\n/g, "\n");
  content = content.replace(/marginBottom:\s*0,,/g, "marginBottom: 0,");
  content = content.replace(/marginTop:\s*0,,/g, "marginTop: 0,");

  // Padronizar margens pequenas para 0
  content = content.replace(/marginTop:\s*[1-8](?![0-9])/g, "marginTop: 0");
  content = content.replace(/marginBottom:\s*[1-8](?![0-9])/g, "marginBottom: 0");

  // Padronizar spacing
  content = content.replace(/spacing:\s*"normal"/g, 'spacing: "small"');
  content = content.replace(/spacing:\s*"compact"/g, 'spacing: "small"');

  // Garantir que todos os componentes têm as propriedades necessárias
  // Procurar por blocos properties: { ... } e adicionar propriedades faltantes
  content = content.replace(/(properties:\s*\{[^}]*?)(,?\s*)\}/gs, (match, props, comma) => {
    let needsComma = !comma.includes(",");
    let additions = [];

    if (!props.includes("marginTop:")) {
      additions.push("marginTop: 0");
    }
    if (!props.includes("marginBottom:")) {
      additions.push("marginBottom: 0");
    }
    if (!props.includes("spacing:")) {
      additions.push('spacing: "small"');
    }

    if (additions.length > 0) {
      const additionsStr = (needsComma ? "," : "") + "\n        " + additions.join(",\n        ");
      return props + additionsStr + "\n      }";
    }
    return match;
  });

  fs.writeFileSync(filePath, content, "utf8");
  console.log(`✅ ${fileName} - Corrigido`);
});

console.log("🎉 Correção e padronização completas!");
