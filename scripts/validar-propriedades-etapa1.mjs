#!/usr/bin/env node

/**
 * VALIDAÇÃO DAS PROPRIEDADES DOS COMPONENTES DA ETAPA 1
 * Compara as propriedades dos componentes com o modelo fornecido
 */

import fs from "fs";
import path from "path";

console.log("🧪 VALIDAÇÃO DAS PROPRIEDADES - ETAPA 1");
console.log("=========================================\n");

// Modelo esperado da Etapa 1
const expectedStep1Model = {
  "quiz-intro-header": {
    logoUrl:
      "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
    logoAlt: "Logo Gisele Galvão",
    logoWidth: 120,
    logoHeight: 120,
    progressValue: 0,
    progressMax: 100,
    showBackButton: false,
    showProgress: false,
  },
  "decorative-bar-inline": {
    width: "100%",
    height: 4,
    color: "#B89B7A",
    gradientColors: ["#B89B7A", "#D4C2A8", "#B89B7A"],
    borderRadius: 3,
    marginTop: 8,
    marginBottom: 24,
    showShadow: true,
  },
  "text-inline-title": {
    content: "Chega de um guarda-roupa lotado e da sensação de que nada combina com você.",
    fontSize: "text-3xl",
    fontWeight: "font-bold",
    fontFamily: "Playfair Display, serif",
    textAlign: "text-center",
    color: "#432818",
    marginBottom: 32,
    lineHeight: "1.2",
  },
  "image-display-inline": {
    src: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.webp",
    alt: "Transforme seu guarda-roupa",
    width: 600,
    height: 400,
    className: "object-cover w-full max-w-2xl h-80 rounded-xl mx-auto shadow-lg",
    textAlign: "text-center",
    marginBottom: 32,
  },
  "form-input": {
    label: "COMO VOCÊ GOSTARIA DE SER CHAMADA?",
    placeholder: "Digite seu nome aqui...",
    required: true,
    inputType: "text",
    helperText: "Seu nome será usado para personalizar sua experiência",
    name: "userName",
    textAlign: "text-center",
    marginBottom: 32,
  },
  "button-inline": {
    text: "✨ Quero Descobrir meu Estilo Agora! ✨",
    variant: "primary",
    size: "large",
    fullWidth: true,
    backgroundColor: "#B89B7A",
    textColor: "#ffffff",
    requiresValidInput: true,
    textAlign: "text-center",
    borderRadius: "rounded-full",
    padding: "py-4 px-8",
    fontSize: "text-lg",
    fontWeight: "font-bold",
    boxShadow: "shadow-xl",
    hoverEffect: true,
  },
  "legal-notice-inline": {
    privacyText:
      "Seu nome é necessário para personalizar sua experiência. Ao clicar, você concorda com nossa política de privacidade",
    copyrightText: "© 2025 Gisele Galvão - Todos os direitos reservados",
    showIcon: true,
    iconType: "shield",
    textAlign: "text-center",
    textSize: "text-xs",
    textColor: "#6B7280",
    linkColor: "#B89B7A",
    marginTop: 24,
    marginBottom: 0,
    backgroundColor: "transparent",
  },
};

console.log("🎯 PROPRIEDADES ESPERADAS NO MODELO:");
console.log("====================================\n");

Object.entries(expectedStep1Model).forEach(([componentType, props]) => {
  console.log(`📦 ${componentType}:`);

  // Propriedades mais importantes para destacar
  const keyProps = {
    "quiz-intro-header": ["logoUrl", "logoWidth", "progressValue"],
    "decorative-bar-inline": ["color", "height", "gradientColors"],
    "text-inline-title": ["content", "fontSize", "fontFamily"],
    "image-display-inline": ["src", "alt", "className"],
    "form-input": ["label", "placeholder", "required"],
    "button-inline": ["text", "backgroundColor", "requiresValidInput"],
    "legal-notice-inline": ["privacyText", "copyrightText", "showIcon"],
  };

  const importantProps = keyProps[componentType] || [];

  Object.entries(props).forEach(([key, value]) => {
    const isImportant = importantProps.includes(key);
    const marker = isImportant ? "🔑" : "  ";
    const displayValue =
      typeof value === "string" && value.length > 50
        ? value.substring(0, 50) + "..."
        : JSON.stringify(value);

    console.log(`   ${marker} ${key}: ${displayValue}`);
  });

  console.log("");
});

console.log("📋 VERIFICAÇÃO DE CONSISTÊNCIA:");
console.log("==============================\n");

// Verificar se o arquivo editor.tsx tem a função handleLoadStep1 atualizada
const editorPath = path.join(process.cwd(), "src/pages/editor.tsx");
if (fs.existsSync(editorPath)) {
  const editorContent = fs.readFileSync(editorPath, "utf8");

  console.log("🔍 Verificando handleLoadStep1 no editor.tsx...\n");

  // Verificar se tem os tipos de componentes corretos
  const hasQuizIntroHeader = editorContent.includes('type: "quiz-intro-header"');
  const hasDecorativeBar = editorContent.includes('type: "decorative-bar-inline"');
  const hasTextInline = editorContent.includes('type: "text-inline"');
  const hasImageDisplayInline = editorContent.includes('type: "image-display-inline"');
  const hasFormInput = editorContent.includes('type: "form-input"');
  const hasButtonInline = editorContent.includes('type: "button-inline"');
  const hasLegalNotice = editorContent.includes('type: "legal-notice-inline"');

  console.log(`✅ quiz-intro-header: ${hasQuizIntroHeader ? "ENCONTRADO" : "NÃO ENCONTRADO"}`);
  console.log(`✅ decorative-bar-inline: ${hasDecorativeBar ? "ENCONTRADO" : "NÃO ENCONTRADO"}`);
  console.log(`✅ text-inline: ${hasTextInline ? "ENCONTRADO" : "NÃO ENCONTRADO"}`);
  console.log(
    `✅ image-display-inline: ${hasImageDisplayInline ? "ENCONTRADO" : "NÃO ENCONTRADO"}`
  );
  console.log(`✅ form-input: ${hasFormInput ? "ENCONTRADO" : "NÃO ENCONTRADO"}`);
  console.log(`✅ button-inline: ${hasButtonInline ? "ENCONTRADO" : "NÃO ENCONTRADO"}`);
  console.log(`✅ legal-notice-inline: ${hasLegalNotice ? "ENCONTRADO" : "NÃO ENCONTRADO"}`);

  // Verificar imagens específicas
  const hasCorrectLogo = editorContent.includes("LOGO_DA_MARCA_GISELE_r14oz2.webp");
  const hasCorrectHeroImage = editorContent.includes(
    "20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.webp"
  );

  console.log(`\n🖼️  Logo correto: ${hasCorrectLogo ? "SIM" : "NÃO"}`);
  console.log(`🖼️  Imagem hero correta: ${hasCorrectHeroImage ? "SIM" : "NÃO"}`);

  // Verificar cores da marca
  const hasCorrectBrandColor = editorContent.includes("#B89B7A");
  const hasCorrectTextColor = editorContent.includes("#432818");

  console.log(`\n🎨 Cor da marca (#B89B7A): ${hasCorrectBrandColor ? "SIM" : "NÃO"}`);
  console.log(`🎨 Cor do texto (#432818): ${hasCorrectTextColor ? "SIM" : "NÃO"}`);

  const allComponentsCorrect =
    hasQuizIntroHeader &&
    hasDecorativeBar &&
    hasTextInline &&
    hasImageDisplayInline &&
    hasFormInput &&
    hasButtonInline &&
    hasLegalNotice;

  console.log(`\n📊 RESULTADO FINAL:`);
  console.log(`================`);

  if (allComponentsCorrect && hasCorrectLogo && hasCorrectHeroImage && hasCorrectBrandColor) {
    console.log(`🎉 PERFEITO! O editor está configurado corretamente com o modelo da Etapa 1!`);
    console.log(`\n🚀 PRÓXIMOS PASSOS:`);
    console.log(`   1. Acesse: http://localhost:5173/editor-fixed`);
    console.log(`   2. Clique em "Carregar Etapa 1"`);
    console.log(`   3. Verifique a renderização dos componentes`);
    console.log(`   4. Teste as propriedades no painel lateral`);
  } else {
    console.log(`⚠️  Alguns componentes ou propriedades ainda precisam ser ajustados.`);
  }
} else {
  console.log("❌ Arquivo editor.tsx não encontrado");
}

console.log("\n✨ Validação concluída!");
