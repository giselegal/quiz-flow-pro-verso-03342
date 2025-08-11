// src/config/stepTemplatesMapping.ts
// Mapeamento das 21 etapas para seus templates específicos (usando templates JSON)

// Interface para o template de etapa
export interface StepTemplate {
  stepNumber: number;
  templateFunction: () => any[];
  name: string;
  description: string;
}

// 🎯 CONFIGURAÇÃO DAS 21 ETAPAS USANDO TEMPLATES JSON
const stepNames = [
  "Introdução",
  "Q1 - Tipo de Roupa",
  "Q2 - Nome Pessoal",
  "Q3 - Estilo Pessoal",
  "Q4 - Ocasiões",
  "Q5 - Cores",
  "Q6 - Textura",
  "Q7 - Silhueta",
  "Q8 - Acessórios",
  "Q9 - Inspiração",
  "Q10 - Conforto",
  "Q11 - Tendências",
  "Q12 - Investimento",
  "Q13 - Personalidade",
  "Q14 - Transição",
  "Q15 - Estratégica 1",
  "Q16 - Estratégica 2",
  "Q17 - Estratégica 3",
  "Q18 - Processamento",
  "Q19 - Resultado",
  "Q20 - Oferta",
];

const stepDescriptions = [
  "Tela inicial com nome",
  "Tipo de roupa favorita",
  "Coleta do nome pessoal",
  "Identificação do estilo pessoal",
  "Ocasiões de uso",
  "Preferências de cores",
  "Texturas preferidas",
  "Silhuetas favoritas",
  "Acessórios de estilo",
  "Inspirações de moda",
  "Nível de conforto",
  "Tendências de interesse",
  "Investimento em roupas",
  "Traços de personalidade",
  "Transição para etapas estratégicas",
  "Como se sente sobre estilo",
  "Maior desafio ao se vestir",
  "Investimento disposto",
  "Processamento dos dados",
  "Exibição do resultado",
  "Call to action final",
];

// Template padrão para fallback
const getDefaultTemplate = (stepNumber: number) => {
  return [
    {
      id: `step-${stepNumber}-title`,
      type: "text",
      properties: {
        content: stepNames[stepNumber - 1] || `Etapa ${stepNumber}`,
        fontSize: "2xl",
        fontWeight: "bold",
        textAlign: "center",
        color: "#2D1810",
      },
    },
    {
      id: `step-${stepNumber}-description`,
      type: "text",
      properties: {
        content: stepDescriptions[stepNumber - 1] || `Descrição da etapa ${stepNumber}`,
        fontSize: "md",
        textAlign: "center",
        color: "#6B4F43",
      },
    },
  ];
};

// ✅ MAPEAMENTO DAS 21 ETAPAS (versão simplificada)
export const STEP_TEMPLATES: StepTemplate[] = Array.from({ length: 21 }, (_, index) => {
  const stepNumber = index + 1;

  return {
    stepNumber,
    templateFunction: () => getDefaultTemplate(stepNumber),
    name: stepNames[index],
    description: stepDescriptions[index],
  };
});

// 🔧 UTILITÁRIOS
export const getTemplateByStep = (stepNumber: number): StepTemplate | undefined => {
  return STEP_TEMPLATES.find(template => template.stepNumber === stepNumber);
};

export const getTotalSteps = (): number => {
  return STEP_TEMPLATES.length;
};

// 📊 ESTATÍSTICAS
export const getTemplateStats = () => {
  return {
    totalTemplates: STEP_TEMPLATES.length,
    questionSteps: STEP_TEMPLATES.filter(t => t.name.includes("Q")).length,
    strategicSteps: STEP_TEMPLATES.filter(t => t.name.includes("Estratégica")).length,
    transitionSteps: STEP_TEMPLATES.filter(t => t.name.includes("Transição")).length,
    resultSteps: STEP_TEMPLATES.filter(t => t.name.includes("Resultado")).length,
  };
};
