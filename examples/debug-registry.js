// Debug do enhanced block registry
console.log("🔧 DEBUG - Enhanced Block Registry");

try {
  // Simular imports para verificar se os componentes existem
  const fs = require("fs");
  const path = require("path");

  const componentsToCheck = [
    "./src/components/blocks/inline/ButtonInline.tsx",
    "./src/components/blocks/inline/TextInline.tsx",
    "./src/components/blocks/inline/HeadingInline.tsx",
    "./src/components/blocks/inline/ImageDisplayInlineBlock.tsx",
    "./src/components/blocks/inline/DecorativeBarInline.tsx",
    "./src/components/blocks/inline/LegalNoticeInline.tsx",
    "./src/components/editor/blocks/TextInlineBlock.tsx",
    "./src/components/editor/blocks/QuizIntroHeaderBlock.tsx",
    "./src/components/editor/blocks/FormInputBlock.tsx",
    "./src/components/editor/blocks/BadgeInlineBlock.tsx",
    "./src/components/editor/blocks/DecorativeBarInlineBlock.tsx",
    "./src/components/editor/blocks/LegalNoticeInlineBlock.tsx",
  ];

  console.log("\n📁 Verificando existência dos componentes:");

  componentsToCheck.forEach(componentPath => {
    const exists = fs.existsSync(componentPath);
    const status = exists ? "✅" : "❌";
    console.log(`${status} ${componentPath}`);
  });

  // Verificar conteúdo do Step01Template
  const step01Path = "./src/components/steps/Step01Template.tsx";
  if (fs.existsSync(step01Path)) {
    const content = fs.readFileSync(step01Path, "utf8");
    console.log("\n🎯 Tipos de componentes no Step01Template:");

    const typeMatches = content.match(/type: ["']([^"']+)["']/g);
    if (typeMatches) {
      typeMatches.forEach(match => {
        const type = match.replace(/type: ["']|["']/g, "");
        console.log(`   • ${type}`);
      });
    }
  }
} catch (error) {
  console.error("❌ Erro durante o debug:", error.message);
}
