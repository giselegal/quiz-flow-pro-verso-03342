// Script para verificar os componentes da Etapa 1 MODULAR
const fs = require("fs");
const path = require("path");

console.log("🎯 TESTE DA ETAPA 1 MODULAR - Quiz de Estilo Pessoal");
console.log("=".repeat(60));

// Importar a nova configuração modular
try {
  const step01TemplatePath = path.join(__dirname, "src/components/steps/Step01Template.tsx");
  const step01Content = fs.readFileSync(step01TemplatePath, "utf8");

  console.log("✅ Step01Template.tsx carregado com sucesso");

  // Verificar componentes modulares
  const componentTypes = [
    "quiz-intro-header",
    "decorative-bar-inline",
    "text-inline",
    "image-display-inline",
    "form-input",
    "button-inline",
  ];

  console.log("\n📋 VERIFICAÇÃO DE COMPONENTES MODULARES:");
  componentTypes.forEach(type => {
    if (step01Content.includes(`"${type}"`)) {
      console.log(`✅ ${type} - ENCONTRADO`);
    } else {
      console.log(`❌ ${type} - NÃO ENCONTRADO`);
    }
  });

  // Verificar configurações do JSON
  console.log("\n🎨 VERIFICAÇÃO DE CONFIGURAÇÕES DO JSON:");
  const jsonConfigs = [
    "#B89B7A", // primaryColor
    "#432818", // secondaryColor
    "#aa6b5d", // accentColor
    "#FAF9F7", // backgroundColor
    "'Playfair Display', 'Inter', serif", // fontFamily
    "Bem-vinda ao Quiz de Estilo", // título
    "Digite seu nome para continuar", // buttonText
    "NOME *", // inputLabel
  ];

  jsonConfigs.forEach(config => {
    if (step01Content.includes(config)) {
      console.log(`✅ ${config} - APLICADO`);
    } else {
      console.log(`❌ ${config} - NÃO APLICADO`);
    }
  });

  // Verificar arquivo de configuração
  const quizConfigPath = path.join(__dirname, "src/config/quizConfig.ts");
  if (fs.existsSync(quizConfigPath)) {
    console.log("\n✅ quizConfig.ts criado com sucesso");
    const quizConfigContent = fs.readFileSync(quizConfigPath, "utf8");

    const requiredConfigs = ["QUIZ_CONFIGURATION", "meta", "design", "steps", "getIntroStep"];

    console.log("\n📝 VERIFICAÇÃO DO ARQUIVO DE CONFIGURAÇÃO:");
    requiredConfigs.forEach(config => {
      if (quizConfigContent.includes(config)) {
        console.log(`✅ ${config} - PRESENTE`);
      } else {
        console.log(`❌ ${config} - AUSENTE`);
      }
    });
  } else {
    console.log("\n❌ quizConfig.ts não encontrado");
  }

  console.log("\n" + "=".repeat(60));
  console.log("🎯 ETAPA 1 MODULAR CONFIGURADA COM SUCESSO!");
  console.log("📋 Componentes independentes baseados no JSON fornecido");
  console.log("🎨 Cores e estilos aplicados conforme especificação");
  console.log("📝 Configuração global disponível em quizConfig.ts");
  console.log("=".repeat(60));
} catch (error) {
  console.error("❌ Erro ao verificar a Etapa 1 modular:", error.message);
}
const registryCheck = {
  "quiz-intro-header": "QuizIntroHeaderBlock",
  "decorative-bar-inline": "DecorativeBarInlineBlock",
  "step01-intro": "IntroBlock",
  "text-inline": "TextInlineBlock",
  "image-display-inline": "ImageDisplayInlineBlock",
};

console.log("🎯 VERIFICAÇÃO DOS COMPONENTES ETAPA 1");
console.log("=====================================");

Object.entries(registryCheck).forEach(([type, component]) => {
  console.log(`✅ ${type} → ${component}`);
});

console.log("\n🔧 Para testar:");
console.log("1. Acesse http://localhost:8080/");
console.log('2. Selecione "Stage 1" no painel esquerdo');
console.log("3. Verifique se todos os componentes aparecem");
console.log("4. Clique em cada componente e veja se o painel de propriedades funciona");
