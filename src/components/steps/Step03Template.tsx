import { useIsMobile } from "@/hooks/use-mobile";
import { useContainerProperties } from "@/hooks/useContainerProperties";
import { useDebounce } from "@/hooks/useDebounce";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";
export interface Step03Props {
  onNext?: () => void;
  onBlockAdd?: (block: any) => void;
  onAnswer?: (answer: any) => void;
  userAnswers?: Record<string, any>;
}

export const Step03 = ({ onNext, onBlockAdd, onAnswer, userAnswers }: Step03Props) => {
  // 🚀 Hooks otimizados aplicados automaticamente
  const isMobile = useIsMobile();
  // 🚀 Hooks otimizados aplicados automaticamente
  return <div className="step-03">{/* Conteúdo da Etapa 3 renderizado aqui */}</div>;
};

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 3 - QUESTÃO 2: PERSONALIDADE (REAL)
export const getStep03Template = () => {
  return [
    // 📱 CABEÇALHO COM LOGO E PROGRESSO
    {
      id: "step03-header",
      type: "quiz-intro-header",
      properties: {
        logoUrl:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        logoAlt: "Logo Gisele Galvão",
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 15,
        progressMax: 100,
        showBackButton: true,
        marginTop: 0,
        spacing: "small",
        marginBottom: 0,
      },
    },

    // 🎯 TÍTULO DA QUESTÃO (EDITÁVEL SEPARADAMENTE)
    {
      id: "step03-question-title",
      type: "text-inline",
      properties: {
        content: "RESUMA A SUA PERSONALIDADE:",
        level: "h2",
        fontSize: "text-2xl",
        fontWeight: "font-bold",
        textAlign: "text-center",
        color: "#432818",
        marginBottom: 0,
        marginTop: 0,
        spacing: "small",
      },
    },

    // 📊 CONTADOR DE QUESTÃO (EDITÁVEL SEPARADAMENTE)
    {
      id: "step03-question-counter",
      type: "text-inline",
      properties: {
        content: "Questão 2 de 10",
        fontSize: "text-sm",
        textAlign: "text-center",
        color: "#6B7280",
        marginBottom: 24,
        marginTop: 0,
        spacing: "small",
      },
    },

    // 🎯 AGRUPAMENTO DE OPÇÕES (EDITÁVEL COMO BLOCO ÚNICO)
    {
      id: "step03-personality-options",
      type: "options-grid",
      properties: {
        questionId: "q2",
        options: [
          {
            id: "2a",
            text: "Informal, espontânea, alegre, essencialista",
            value: "2a",
            category: "Natural",
            styleCategory: "Natural",
            points: 1,
            marginTop: 0,
            spacing: "small",
            marginBottom: 0,
          },
          {
            id: "2b",
            text: "Conservadora, séria, organizada",
            value: "2b",
            category: "Clássico",
            styleCategory: "Clássico",
            points: 1,
          },
          {
            id: "2c",
            text: "Informada, ativa, prática",
            value: "2c",
            category: "Contemporâneo",
            styleCategory: "Contemporâneo",
            points: 1,
          },
          {
            id: "2d",
            text: "Exigente, sofisticada, seletiva",
            value: "2d",
            category: "Elegante",
            styleCategory: "Elegante",
            points: 1,
          },
          {
            id: "2e",
            text: "Feminina, meiga, delicada, sensível",
            value: "2e",
            category: "Romântico",
            styleCategory: "Romântico",
            points: 1,
          },
          {
            id: "2f",
            text: "Glamorosa, vaidosa, sensual",
            value: "2f",
            category: "Sexy",
            styleCategory: "Sexy",
            points: 1,
          },
          {
            id: "2g",
            text: "Cosmopolita, moderna e audaciosa",
            value: "2g",
            category: "Dramático",
            styleCategory: "Dramático",
            points: 1,
          },
          {
            id: "2h",
            text: "Exótica, aventureira, livre",
            value: "2h",
            category: "Criativo",
            styleCategory: "Criativo",
            points: 1,
          },
        ],
        // 🎨 LAYOUT BASEADO EM IMAGENS - REGRA: 1 COLUNA SEM IMAGENS
        columns: 1, // 1 coluna porque NÃO TEM IMAGENS
        showImages: false, // SEM IMAGENS = 1 COLUNA
        multipleSelection: true,
        maxSelections: 3,
        minSelections: 1,
        validationMessage: "Selecione até 3 opções",
        gridGap: 12, // Menor gap para texto
        responsiveColumns: false, // Sempre 1 coluna

        // 🚀 AUTOAVANÇO INSTANTÂNEO APÓS COMPLETAR
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 0, // INSTANTÂNEO após última seleção
        instantActivation: true, // Botão ativa na hora
        requiredSelections: 3,

        // 🔘 ATIVAÇÃO IMEDIATA
        enableButtonOnlyWhenValid: false,
        instantButtonActivation: true, // Ativa assim que completar
        showValidationFeedback: true,
      },
    },

    // 🔘 BOTÃO COM ATIVAÇÃO INSTANTÂNEA (EDITÁVEL SEPARADAMENTE)
    {
      id: "step03-continue-button",
      type: "button-inline",
      properties: {
        // 📝 TEXTO DINÂMICO
        text: "Continuar →",
        textWhenDisabled: "Selecione 3 características",
        textWhenComplete: "Continuar →",

        // 🎨 ESTILO
        variant: "primary",
        size: "large",
        backgroundColor: "#B89B7A",
        textColor: "#ffffff",
        disabledBackgroundColor: "#E5E7EB",
        disabledTextColor: "#9CA3AF",

        // ⚡ ATIVAÇÃO INSTANTÂNEA - SEM DELAYS
        disabled: true,
        requiresValidInput: true,
        instantActivation: true, // Ativa na hora que completar
        noDelay: true, // Sem atraso para ativar

        // 🚀 AUTOAVANÇO IMEDIATO
        autoAdvanceAfterActivation: true, // Avança logo após ativar
        autoAdvanceDelay: 0, // Instantâneo

        // 📊 FEEDBACK MÍNIMO (RÁPIDO)
        showSuccessAnimation: false, // Sem animação para não atrasar
        showPulseWhenEnabled: false, // Sem pulse para não atrasar
        quickFeedback: true, // Feedback rápido apenas,
        marginTop: 0,
        spacing: "small",
        marginBottom: 0,
      },
    },
  ];
};

export default getStep03Template;
