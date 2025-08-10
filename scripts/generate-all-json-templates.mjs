// 🔄 GERADOR AUTOMÁTICO DE TEMPLATES JSON PARA TODAS AS 21 ETAPAS
import fs from "fs";
import path from "path";

// 📋 Configuração das 21 etapas
const STEPS_CONFIG = [
  { step: 1, name: "Introdução", description: "Página inicial do quiz", category: "intro" },
  {
    step: 2,
    name: "Q1 - Roupa Favorita",
    description: "Primeira questão sobre estilo de roupa",
    category: "quiz-question",
  },
  {
    step: 3,
    name: "Q2 - Nome Pessoal",
    description: "Coleta do nome do usuário",
    category: "quiz-question",
  },
  {
    step: 4,
    name: "Q3 - Estilo Pessoal",
    description: "Questão sobre preferências de estilo",
    category: "quiz-question",
  },
  {
    step: 5,
    name: "Q4 - Ocasiões",
    description: "Questão sobre ocasiões de uso",
    category: "quiz-question",
  },
  {
    step: 6,
    name: "Q5 - Cores",
    description: "Questão sobre preferências de cores",
    category: "quiz-question",
  },
  {
    step: 7,
    name: "Q6 - Textura",
    description: "Questão sobre texturas preferidas",
    category: "quiz-question",
  },
  {
    step: 8,
    name: "Q7 - Silhueta",
    description: "Questão sobre silhuetas favoritas",
    category: "quiz-question",
  },
  {
    step: 9,
    name: "Q8 - Acessórios",
    description: "Questão sobre uso de acessórios",
    category: "quiz-question",
  },
  {
    step: 10,
    name: "Q9 - Inspiração",
    description: "Questão sobre fontes de inspiração",
    category: "quiz-question",
  },
  {
    step: 11,
    name: "Q10 - Conforto",
    description: "Questão sobre prioridades de conforto",
    category: "quiz-question",
  },
  {
    step: 12,
    name: "Q11 - Tendências",
    description: "Questão sobre seguir tendências",
    category: "quiz-question",
  },
  {
    step: 13,
    name: "Q12 - Investimento",
    description: "Questão sobre investimento em roupas",
    category: "quiz-question",
  },
  {
    step: 14,
    name: "Q13 - Personalidade",
    description: "Questão final sobre personalidade",
    category: "quiz-question",
  },
  {
    step: 15,
    name: "Transição",
    description: "Página de transição para resultado",
    category: "transition",
  },
  {
    step: 16,
    name: "Processamento",
    description: "Página de carregamento do resultado",
    category: "processing",
  },
  { step: 17, name: "Resultado 1", description: "Primeira tela de resultado", category: "result" },
  { step: 18, name: "Resultado 2", description: "Segunda tela de resultado", category: "result" },
  { step: 19, name: "Resultado 3", description: "Terceira tela de resultado", category: "result" },
  { step: 20, name: "Lead Capture", description: "Coleta de dados para contato", category: "lead" },
  {
    step: 21,
    name: "Oferta Final",
    description: "Apresentação da oferta comercial",
    category: "offer",
  },
];

// 📁 Importar template existente como base
const baseTemplate = {
  templateVersion: "1.0",
  layout: {
    containerWidth: "full",
    spacing: "small",
    backgroundColor: "transparent",
    responsive: true,
  },
  validation: {
    required: true,
    minAnswers: 1,
    maxAnswers: 3,
    validationMessage: "Selecione pelo menos uma opção!",
  },
  analytics: {
    events: ["page_view", "option_selected", "validation_error", "completion"],
  },
};

// 🎯 Templates específicos por tipo de etapa
const getTemplateBlocks = (step, config) => {
  const commonHeader = {
    id: `step${step.toString().padStart(2, "0")}-header`,
    type: "quiz-intro-header",
    position: 0,
    properties: {
      logoUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
      logoAlt: "Logo Gisele Galvão",
      logoWidth: 96,
      logoHeight: 96,
      progressValue: Math.round((step / 21) * 100),
      progressTotal: 100,
      showProgress: true,
      containerWidth: "full",
      spacing: "small",
    },
  };

  if (config.category === "intro") {
    return [
      commonHeader,
      {
        id: `step${step.toString().padStart(2, "0")}-title`,
        type: "text-inline",
        position: 1,
        properties: {
          content: "DESCUBRA SEU ESTILO PESSOAL",
          fontSize: "text-4xl",
          fontWeight: "font-bold",
          textAlign: "text-center",
          color: "#432818",
          containerWidth: "full",
          spacing: "small",
        },
      },
      {
        id: `step${step.toString().padStart(2, "0")}-subtitle`,
        type: "text-inline",
        position: 2,
        properties: {
          content:
            "Um quiz personalizado para descobrir qual estilo combina perfeitamente com você",
          fontSize: "text-xl",
          textAlign: "text-center",
          color: "#6B7280",
          containerWidth: "full",
          spacing: "small",
        },
      },
      {
        id: `step${step.toString().padStart(2, "0")}-start-button`,
        type: "button-inline",
        position: 3,
        properties: {
          text: "Começar Quiz",
          variant: "primary",
          size: "large",
          fullWidth: true,
          backgroundColor: "#B89B7A",
          textColor: "#ffffff",
          containerWidth: "full",
          spacing: "small",
          marginTop: 32,
        },
      },
    ];
  }

  if (config.category === "quiz-question") {
    return [
      commonHeader,
      {
        id: `step${step.toString().padStart(2, "0")}-question-title`,
        type: "text-inline",
        position: 1,
        properties: {
          content: config.name.toUpperCase(),
          fontSize: "text-2xl",
          fontWeight: "font-bold",
          textAlign: "text-center",
          color: "#432818",
          containerWidth: "full",
          spacing: "small",
        },
      },
      {
        id: `step${step.toString().padStart(2, "0")}-question-counter`,
        type: "text-inline",
        position: 2,
        properties: {
          content: `Questão ${step - 1} de 13`,
          fontSize: "text-sm",
          textAlign: "text-center",
          color: "#6B7280",
          marginBottom: 24,
          containerWidth: "full",
          spacing: "small",
        },
      },
      {
        id: `step${step.toString().padStart(2, "0")}-options-grid`,
        type: "options-grid",
        position: 3,
        properties: {
          options: generateOptionsForStep(step),
          columns: 2,
          imageSize: 256,
          showImages: true,
          multipleSelection: true,
          minSelections: 1,
          maxSelections: 3,
          borderColor: "#E5E7EB",
          selectedBorderColor: "#B89B7A",
          hoverColor: "#F3E8D3",
          containerWidth: "full",
          spacing: "small",
          marginBottom: 16,
        },
      },
      {
        id: `step${step.toString().padStart(2, "0")}-continue-button`,
        type: "button-inline",
        position: 4,
        properties: {
          text: step === 14 ? "Ver Resultado →" : "Próxima Questão →",
          textWhenDisabled: "Selecione pelo menos 1 opção",
          variant: "primary",
          size: "large",
          fullWidth: true,
          backgroundColor: "#B89B7A",
          textColor: "#ffffff",
          enableOnSelection: true,
          containerWidth: "full",
          spacing: "small",
          marginTop: 24,
        },
      },
    ];
  }

  if (config.category === "transition") {
    return [
      commonHeader,
      {
        id: `step${step.toString().padStart(2, "0")}-title`,
        type: "text-inline",
        position: 1,
        properties: {
          content: "ANALISANDO SEU ESTILO...",
          fontSize: "text-3xl",
          fontWeight: "font-bold",
          textAlign: "text-center",
          color: "#432818",
          containerWidth: "full",
          spacing: "small",
        },
      },
      {
        id: `step${step.toString().padStart(2, "0")}-loading`,
        type: "loading-animation",
        position: 2,
        properties: {
          type: "spinner",
          color: "#B89B7A",
          size: "large",
          containerWidth: "full",
          spacing: "small",
        },
      },
    ];
  }

  if (config.category === "processing") {
    return [
      commonHeader,
      {
        id: `step${step.toString().padStart(2, "0")}-title`,
        type: "text-inline",
        position: 1,
        properties: {
          content: "PREPARANDO SEU RESULTADO PERSONALIZADO...",
          fontSize: "text-2xl",
          fontWeight: "font-bold",
          textAlign: "text-center",
          color: "#432818",
          containerWidth: "full",
          spacing: "small",
        },
      },
      {
        id: `step${step.toString().padStart(2, "0")}-progress-bar`,
        type: "progress-bar",
        position: 2,
        properties: {
          value: 100,
          animated: true,
          color: "#B89B7A",
          containerWidth: "full",
          spacing: "small",
        },
      },
    ];
  }

  if (config.category === "result") {
    return [
      commonHeader,
      {
        id: `step${step.toString().padStart(2, "0")}-result-title`,
        type: "text-inline",
        position: 1,
        properties: {
          content: "SEU ESTILO PESSOAL É:",
          fontSize: "text-2xl",
          fontWeight: "font-bold",
          textAlign: "text-center",
          color: "#432818",
          containerWidth: "full",
          spacing: "small",
        },
      },
      {
        id: `step${step.toString().padStart(2, "0")}-result-card`,
        type: "result-card",
        position: 2,
        properties: {
          title: "Estilo Elegante",
          description: "Você tem preferência por peças clássicas e refinadas...",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
          containerWidth: "full",
          spacing: "small",
        },
      },
      {
        id: `step${step.toString().padStart(2, "0")}-continue-button`,
        type: "button-inline",
        position: 3,
        properties: {
          text: step === 19 ? "Continuar →" : "Ver Mais →",
          variant: "primary",
          size: "large",
          fullWidth: true,
          backgroundColor: "#B89B7A",
          textColor: "#ffffff",
          containerWidth: "full",
          spacing: "small",
          marginTop: 24,
        },
      },
    ];
  }

  if (config.category === "lead") {
    return [
      commonHeader,
      {
        id: `step${step.toString().padStart(2, "0")}-title`,
        type: "text-inline",
        position: 1,
        properties: {
          content: "RECEBA SEU GUIA DE ESTILO COMPLETO",
          fontSize: "text-2xl",
          fontWeight: "font-bold",
          textAlign: "text-center",
          color: "#432818",
          containerWidth: "full",
          spacing: "small",
        },
      },
      {
        id: `step${step.toString().padStart(2, "0")}-form`,
        type: "lead-form",
        position: 2,
        properties: {
          fields: ["name", "email", "phone"],
          submitText: "Receber Guia Gratuito",
          containerWidth: "full",
          spacing: "small",
        },
      },
    ];
  }

  if (config.category === "offer") {
    return [
      commonHeader,
      {
        id: `step${step.toString().padStart(2, "0")}-offer-title`,
        type: "text-inline",
        position: 1,
        properties: {
          content: "OFERTA ESPECIAL PARA VOCÊ!",
          fontSize: "text-3xl",
          fontWeight: "font-bold",
          textAlign: "text-center",
          color: "#432818",
          containerWidth: "full",
          spacing: "small",
        },
      },
      {
        id: `step${step.toString().padStart(2, "0")}-offer-card`,
        type: "offer-card",
        position: 2,
        properties: {
          title: "Consultoria de Estilo Personalizada",
          originalPrice: "R$ 497",
          discountPrice: "R$ 297",
          description: "Consultoria completa com análise personalizada do seu estilo",
          features: ["Análise completa", "Guia personalizado", "Suporte por 30 dias"],
          containerWidth: "full",
          spacing: "small",
        },
      },
      {
        id: `step${step.toString().padStart(2, "0")}-cta-button`,
        type: "button-inline",
        position: 3,
        properties: {
          text: "QUERO APROVEITAR ESTA OFERTA",
          variant: "primary",
          size: "large",
          fullWidth: true,
          backgroundColor: "#B89B7A",
          textColor: "#ffffff",
          containerWidth: "full",
          spacing: "small",
          marginTop: 24,
        },
      },
    ];
  }

  // Fallback
  return [commonHeader];
};

// 🎯 Gerar opções específicas por etapa
function generateOptionsForStep(step) {
  const baseOptions = [
    {
      id: `${step}a`,
      text: "Opção A - Descrição personalizada",
      imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
      value: `${step}a`,
      category: "Natural",
      points: 1,
    },
    {
      id: `${step}b`,
      text: "Opção B - Descrição personalizada",
      imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
      value: `${step}b`,
      category: "Clássico",
      points: 2,
    },
    {
      id: `${step}c`,
      text: "Opção C - Descrição personalizada",
      imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
      value: `${step}c`,
      category: "Contemporâneo",
      points: 2,
    },
    {
      id: `${step}d`,
      text: "Opção D - Descrição personalizada",
      imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
      value: `${step}d`,
      category: "Elegante",
      points: 3,
    },
  ];

  // Para etapas que não são questões, retornar array vazio
  if (step === 1 || step >= 15) {
    return [];
  }

  return baseOptions;
}

// 🎯 Gerar arquivo JSON para cada etapa
async function generateAllTemplates() {
  const templatesDir = "./templates";

  // Criar diretório se não existir
  if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true });
  }

  console.log("🚀 Gerando templates JSON para todas as 21 etapas...\n");

  for (const stepConfig of STEPS_CONFIG) {
    const template = {
      ...baseTemplate,
      metadata: {
        id: `quiz-step-${stepConfig.step.toString().padStart(2, "0")}`,
        name: stepConfig.name,
        description: stepConfig.description,
        category: stepConfig.category,
        tags: ["quiz", "style", stepConfig.category],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      blocks: getTemplateBlocks(stepConfig.step, stepConfig),
      analytics: {
        ...baseTemplate.analytics,
        trackingId: `step-${stepConfig.step.toString().padStart(2, "0")}-${stepConfig.category}`,
      },
    };

    const filename = `step-${stepConfig.step.toString().padStart(2, "0")}-template.json`;
    const filepath = path.join(templatesDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(template, null, 2));

    console.log(`✅ ${filename} - ${stepConfig.name} (${template.blocks.length} blocos)`);
  }

  console.log(`\n🎉 21 templates JSON criados com sucesso em ${templatesDir}/`);
}

// 🚀 Executar geração
generateAllTemplates().catch(console.error);
