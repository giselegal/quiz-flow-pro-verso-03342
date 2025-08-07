// Define the missing QuizOption interface
interface QuizOption {
  id: string;
  text: string;
  value: string;
  category: string;
  styleCategory: string;
  points: number;
  imageUrl?: string;
}

export interface Step19Props {
  onNext?: () => void;
  onBlockAdd?: (block: any) => void;
  onAnswer?: (answer: any) => void;
  userAnswers?: Record<string, any>;
}

export const Step19 = ({ onNext, onBlockAdd, onAnswer, userAnswers }: Step19Props) => {
  // 🚀 Hooks otimizados aplicados automaticamente
  const isMobile = useIsMobile();
  // 🚀 Hooks otimizados aplicados automaticamente
  const isMobile = useIsMobile();
  return <div className="step-19">{/* Conteúdo da Etapa 19 renderizado aqui */}</div>;
};

// --- Interfaces Necessárias ---
// Interface para uma opção de quiz
// Interface para uma questão de quiz
export interface QuizQuestion {
  id: string;
  title: string;
  type: "text";
  multiSelect: number;
  imageUrl?: string;
  options: QuizOption[];
  advanceMode?: "manual" | "auto";
}

// Interface simplificada para BlockData (representa um componente de UI)
export interface BlockData {
  type: string;
  properties: Record<string, any>;
  id?: string;
  order?: number;
}

const TOTAL_QUIZ_QUESTIONS = 21; // Número total de questões no quiz completo

/**
 * Template de blocos para a Etapa 19 do quiz (Transição Final para o Resultado).
 * Esta etapa agradece ao usuário e o prepara para a revelação do resultado.
 */
export const getStep19Template = (): BlockData[] => {
  // 🚀 Hooks otimizados aplicados automaticamente
  const isMobile = useIsMobile();
  // 🚀 Hooks otimizados aplicados automaticamente
  const isMobile = useIsMobile();
  const questionNumberInFullQuiz = 19; // Esta é a 19ª etapa do quiz completo

  const blocks: BlockData[] = [
    {
      id: "step19-header",
      type: "quiz-intro-header",
      properties: {
        logoUrl:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        logoAlt: "Logo Gisele Galvão",
        logoWidth: 96,
        logoHeight: 96,
        progressValue: (questionNumberInFullQuiz / TOTAL_QUIZ_QUESTIONS) * 100,
        progressMax: 100,
        showBackButton: true,
      },
    },
    {
      id: "step19-thank-you-title",
      type: "text-inline",
      properties: {
        content: "Obrigada por compartilhar.".toUpperCase(),
        level: "h2",
        fontSize: "text-2xl",
        fontWeight: "font-bold",
        textAlign: "text-center",
        color: "#432818",
        marginBottom: 16,
      },
    },
    {
      id: "step19-thank-you-text",
      type: "text-inline",
      properties: {
        content:
          "Chegar até aqui já mostra que você está pronta para se olhar com mais **amor**, se vestir com mais **intenção** e deixar sua imagem comunicar quem você é de verdade — com **leveza**, **presença** e **propósito**.",
        fontSize: "text-base",
        textAlign: "text-left",
        color: "#3a3a3a",
        marginBottom: 16,
      },
    },
    {
      id: "step19-reveal-text",
      type: "text-inline",
      properties: {
        content:
          "Agora, é hora de revelar o seu **Estilo Predominante** — e os seus **Estilos Complementares**. E, mais do que isso, uma oportunidade real de aplicar o seu Estilo com **leveza** e **confiança** — todos os dias.",
        fontSize: "text-base",
        textAlign: "text-left",
        color: "#3a3a3a",
        marginBottom: 16,
      },
    },
    {
      id: "step19-surprise-text",
      type: "text-inline",
      properties: {
        content:
          "Ah, e lembra do valor que mencionamos? Prepare-se para uma **surpresa**: o que você vai receber vale muito mais do que imagina — e vai custar muito menos do que você esperava.",
        fontSize: "text-base",
        textAlign: "text-left",
        color: "#3a3a3a",
        marginBottom: 24,
      },
    },
    {
      id: "step19-show-result-button",
      type: "button-inline",
      properties: {
        text: "Vamos ao resultado?",
        variant: "primary",
        size: "large",
        fullWidth: false,
        backgroundColor: "#B89B7A",
        textColor: "#ffffff",
        disabled: false,
        requiresValidSelection: false,
        display: "flex",
        justifyContent: "center",
        margin: "mx-auto",
      },
    },
  ];
  return blocks;
};

export default getStep19Template;
