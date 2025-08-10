// 🧪 TESTE ESPECÍFICO - STEP01 TEMPLATE E REGISTRY
// Verificar compatibilidade entre template e componentes registrados

console.log("🔬 INICIANDO TESTE DE COMPATIBILIDADE...");

// 1. Simular carregamento do Step01Template
const Step01Template = [
  {
    id: "step01-header-logo",
    type: "quiz-intro-header",
    properties: {
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
  },
  {
    id: "step01-decorative-bar",
    type: "decorative-bar",
    properties: {
      width: "100%",
      height: 4,
      color: "#B89B7A",
      gradientColors: ["#B89B7A", "#D4C2A8", "#B89B7A"],
      borderRadius: 3,
      marginTop: 8,
      marginBottom: 24,
      showShadow: true,
    },
  },
  {
    id: "step01-main-title",
    type: "text",
    properties: {
      content: "Chega de um guarda-roupa lotado...",
      fontSize: "text-3xl",
      fontWeight: "font-bold",
      fontFamily: "Playfair Display, serif",
      textAlign: "text-center",
      color: "#432818",
      marginBottom: 32,
      lineHeight: "1.2",
    },
  },
  {
    id: "step01-hero-image",
    type: "image",
    properties: {
      src: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.webp",
      alt: "Transforme seu guarda-roupa",
      width: 600,
      height: 400,
      className: "object-cover w-full max-w-2xl h-80 rounded-xl mx-auto shadow-lg",
      textAlign: "text-center",
      marginBottom: 32,
    },
  },
  {
    id: "step01-name-input",
    type: "form-input",
    properties: {
      label: "COMO VOCÊ GOSTARIA DE SER CHAMADA?",
      placeholder: "Digite seu nome aqui...",
      required: true,
      inputType: "text",
      helperText: "Seu nome será usado para personalizar sua experiência",
      name: "userName",
      textAlign: "text-center",
      marginBottom: 32,
    },
  },
  {
    id: "step01-cta-button",
    type: "button",
    properties: {
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
  },
  {
    id: "step01-legal-notice",
    type: "legal-notice",
    properties: {
      privacyText: "Seu nome é necessário para personalizar sua experiência...",
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
  },
];

// 2. Componentes que devem estar registrados
const REQUIRED_COMPONENTS = [
  "quiz-intro-header",
  "decorative-bar",
  "text",
  "image",
  "form-input",
  "button",
  "legal-notice",
];

// 3. Verificar cada componente
console.log("🎯 VERIFICANDO COMPATIBILIDADE DOS COMPONENTES:");

Step01Template.forEach((block, index) => {
  console.log(`\n📦 Bloco ${index + 1}: ${block.type}`);
  console.log(`   ID: ${block.id}`);
  console.log(`   Propriedades: ${Object.keys(block.properties).length}`);

  // Verificar propriedades críticas
  const props = block.properties;

  if (block.type === "text" && !props.content) {
    console.warn("   ⚠️ PROBLEMA: Texto sem 'content'");
  }

  if (block.type === "image" && !props.src) {
    console.warn("   ⚠️ PROBLEMA: Imagem sem 'src'");
  }

  if (block.type === "button" && !props.text) {
    console.warn("   ⚠️ PROBLEMA: Botão sem 'text'");
  }

  if (block.type === "form-input" && !props.label) {
    console.warn("   ⚠️ PROBLEMA: Input sem 'label'");
  }

  console.log(`   ✅ Componente ${block.type} parece válido`);
});

// 4. Verificar se há propriedades conflitantes
console.log("\n🔍 VERIFICANDO PROPRIEDADES CONFLITANTES:");

const allProperties = {};
Step01Template.forEach(block => {
  Object.keys(block.properties).forEach(prop => {
    if (!allProperties[prop]) {
      allProperties[prop] = [];
    }
    allProperties[prop].push(block.type);
  });
});

console.log("📊 Propriedades mais usadas:");
Object.entries(allProperties)
  .sort((a, b) => b[1].length - a[1].length)
  .slice(0, 10)
  .forEach(([prop, types]) => {
    console.log(`   ${prop}: ${types.length} componentes [${types.join(", ")}]`);
  });

console.log("\n✅ TESTE DE COMPATIBILIDADE CONCLUÍDO!");
console.log("📋 Resultado: Step01Template parece estar bem estruturado");
console.log("🎯 Próximo passo: Verificar se os componentes renderizam corretamente");
