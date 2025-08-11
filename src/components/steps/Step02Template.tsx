import React, { useEffect } from "react";

/**
 * Step02Template - Componente para Etapa 2 do Quiz
 *
 * Template para questão 1: Tipo de roupa favorita
 * Integração com sistema de quiz e editor de propriedades
 */

// ✅ INTERFACE OBRIGATÓRIA PARA O EDITOR
interface Step02TemplateProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;

  properties?: {
    enabled?: boolean;
    title?: string;
    subtitle?: string;
    questionCounter?: string;
    backgroundColor?: string;
    textColor?: string;
    showProgress?: boolean;
    progressValue?: number;
    buttonText?: string;
    multipleSelection?: boolean;
    minSelections?: number;
    maxSelections?: number;
    columns?: number;
    imageSize?: number;
  };

  isEditing?: boolean;
  isSelected?: boolean;
  onUpdate?: (id: string, updates: any) => void;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
}

// ✅ COMPONENTE PRINCIPAL
export const Step02Template: React.FC<Step02TemplateProps> = ({
  id,
  className = "",
  style = {},
  properties = {
    enabled: true,
    title: "QUAL O SEU TIPO DE ROUPA FAVORITA?",
    subtitle: "",
    questionCounter: "Questão 1 de 10",
    backgroundColor: "#FEFEFE",
    textColor: "#432818",
    showProgress: true,
    progressValue: 10,
    buttonText: "Próxima Questão →",
    multipleSelection: true,
    minSelections: 1,
    maxSelections: 3,
    columns: 2,
    imageSize: 256,
  },
  isEditing = false,
  isSelected = false,
  onUpdate,
  onClick,
}) => {
  // ✅ DEBUG E MONITORAMENTO
  useEffect(() => {
    if (isEditing) {
      console.log(`Step02Template ${id} entered editing mode`);
    }
  }, [isEditing, id]);

  useEffect(() => {
    console.log(`Step02Template ${id} properties updated:`, properties);
  }, [properties, id]);

  // ✅ FUNÇÃO DE CLIQUE
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();

    if (isEditing) {
      console.log(`Step02Template ${id} clicked in editing mode`);
      onUpdate?.(id, { lastClicked: new Date().toISOString() });
    }
  };

  // ✅ ESTILOS DINÂMICOS
  const containerStyles: React.CSSProperties = {
    backgroundColor: properties.backgroundColor,
    color: properties.textColor,
    width: "100%",
    minHeight: "500px",
    padding: "24px",
    boxSizing: "border-box",
    position: "relative",
    cursor: isEditing ? "pointer" : "default",
    border: isSelected ? "2px dashed #B89B7A" : "1px solid #e5e7eb",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    opacity: properties.enabled === false ? 0.5 : 1,
    pointerEvents: properties.enabled === false ? "none" : "auto",
    ...style,
  };

  // ✅ RENDERIZAÇÃO CONDICIONAL QUANDO DESABILITADO
  if (!properties.enabled && !isEditing) {
    return null;
  }

  // Opções mocadas para visualização
  const mockOptions = [
    {
      id: "1a",
      text: "Conforto, leveza e praticidade no vestir.",
      imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
    },
    {
      id: "1b",
      text: "Discrição, caimento clássico e sobriedade.",
      imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
    },
    {
      id: "1c",
      text: "Praticidade com um toque de estilo atual.",
      imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
    },
    {
      id: "1d",
      text: "Elegância refinada, moderna e sem exageros.",
      imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
    },
  ];

  return (
    <div
      id={id}
      className={`step02-template ${className} ${isEditing ? "editing-mode" : ""}`}
      style={containerStyles}
      onClick={handleClick}
    >
      {/* Header com Progresso */}
      {properties.showProgress && (
        <div className="step-header mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-[#B89B7A] h-2 rounded-full transition-all duration-500"
              style={{ width: `${properties.progressValue}%` }}
            />
          </div>
        </div>
      )}

      {/* Conteúdo da Questão */}
      <div className="step-content text-center">
        {/* Título da Questão */}
        <h1 className="text-2xl font-bold mb-2" style={{ color: properties.textColor }}>
          {properties.title}
        </h1>

        {/* Contador da Questão */}
        {properties.questionCounter && (
          <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
            {properties.questionCounter}
          </p>
        )}

        {/* Grade de Opções */}
        <div
          className="options-grid mb-6"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${properties.columns}, 1fr)`,
            gap: "16px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          {mockOptions.map(option => (
            <div
              key={option.id}
              className="option-card p-3 border-2 border-gray-200 rounded-lg hover:border-[#B89B7A] cursor-pointer transition-all"
              style={{ textAlign: "center" }}
            >
              <img
                src={option.imageUrl}
                alt={option.text}
                className="w-full h-32 object-cover rounded mb-2"
                style={{ maxWidth: `${properties.imageSize}px` }}
              />
              <p className="text-sm" style={{ color: properties.textColor }}>
                {option.text}
              </p>
            </div>
          ))}
        </div>

        {/* Botão de Continuar */}
        <div className="button-section">
          <button
            className="w-full max-w-md py-3 px-6 bg-[#B89B7A] text-white font-semibold rounded-md hover:bg-[#A1835D] transition-all duration-300"
            disabled={isEditing}
          >
            {properties.buttonText}
          </button>
        </div>

        {/* Info sobre Seleção */}
        {properties.multipleSelection && (
          <p className="text-xs text-gray-500 mt-4">
            Selecione entre {properties.minSelections} e {properties.maxSelections} opções
          </p>
        )}
      </div>

      {/* Indicadores de Estado no Modo de Edição */}
      {isEditing && (
        <div className="absolute top-2 right-2 flex gap-2 items-center">
          {!properties.enabled && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Desabilitado</span>
          )}
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step 02</span>
        </div>
      )}

      {/* Debug Info */}
      {process.env.NODE_ENV === "development" && isEditing && (
        <div className="absolute bottom-2 left-2 text-xs text-gray-500 font-mono">ID: {id}</div>
      )}
    </div>
  );
};

// ✅ FUNÇÃO DE TEMPLATE (MANTIDA PARA COMPATIBILIDADE)
export const getStep02Template = () => {
  return [
    // 📱 CABEÇALHO COM LOGO E PROGRESSO
    {
      id: "step02-header",
      type: "quiz-intro-header",
      properties: {
        logoUrl:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        logoAlt: "Logo Gisele Galvão",
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 10,
        progressMax: 100,
        showBackButton: true,
        spacing: "small",
        marginTop: 0,
        marginBottom: 0,
      },
    },

    // 🎯 TÍTULO DA QUESTÃO (EDITÁVEL SEPARADAMENTE)
    {
      id: "step02-question-title",
      type: "text-inline",
      properties: {
        content: "QUAL O SEU TIPO DE ROUPA FAVORITA?",
        fontSize: "text-2xl",
        fontWeight: "font-bold",
        textAlign: "text-center",
        color: "#432818",
        marginBottom: 0,
        spacing: "small",
        marginTop: 0,
      },
    },

    // 📊 CONTADOR DE QUESTÃO (EDITÁVEL SEPARADAMENTE)
    {
      id: "step02-question-counter",
      type: "text-inline",
      properties: {
        content: "Questão 1 de 10",
        fontSize: "text-sm",
        textAlign: "text-center",
        color: "#6B7280",
        marginBottom: 24,
        spacing: "small",
        marginTop: 0,
      },
    },

    // 🎯 GRADE DE OPÇÕES INLINE (100% COMPATÍVEL COM EDITOR)
    {
      id: "step02-clothing-options",
      type: "options-grid", // Agora usa OptionsGridInlineBlock
      properties: {
        // 📊 OPÇÕES (mesmo conteúdo, estrutura simplificada para inline)
        options: [
          {
            id: "1a",
            text: "Conforto, leveza e praticidade no vestir.",
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
            value: "1a",
            category: "Natural",
            points: 1,
          },
          {
            id: "1b",
            text: "Discrição, caimento clássico e sobriedade.",
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
            value: "1b",
            category: "Clássico",
            points: 2,
          },
          {
            id: "1c",
            text: "Praticidade com um toque de estilo atual.",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
            value: "1c",
            category: "Contemporâneo",
            points: 2,
          },
          {
            id: "1d",
            text: "Elegância refinada, moderna e sem exageros.",
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
            value: "1d",
            category: "Elegante",
            points: 3,
          },
          {
            id: "1e",
            text: "Delicadeza em tecidos suaves e fluidos.",
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp",
            value: "1e",
            category: "Romântico",
            points: 2,
          },
          {
            id: "1f",
            text: "Sensualidade com destaque para o corpo.",
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp",
            value: "1f",
            category: "Sexy",
            points: 3,
          },
          {
            id: "1g",
            text: "Impacto visual com peças estruturadas e assimétricas.",
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp",
            value: "1g",
            category: "Dramático",
            points: 3,
          },
          {
            id: "1h",
            text: "Mix criativo com formas ousadas e originais.",
            imageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp",
            value: "1h",
            category: "Criativo",
            points: 4,
          },
        ],

        // 🎨 LAYOUT E ESTILO (simplificado para inline)
        columns: 2,
        imageSize: 256,
        showImages: true,

        // 🎯 VALIDAÇÃO
        multipleSelection: true,
        minSelections: 1,
        maxSelections: 3,

        // 🎨 CORES
        borderColor: "#E5E7EB",
        selectedBorderColor: "#B89B7A",
        hoverColor: "#F3E8D3",

        // 🎯 CONTAINER
        containerWidth: "full",
        spacing: "small",
        marginBottom: 16,
      },
    },

    // 🔘 BOTÃO AVANÇADO OTIMIZADO (EDITÁVEL SEPARADAMENTE)
    {
      id: "step02-continue-button",
      type: "button-inline",
      properties: {
        // 📝 TEXTO DINÂMICO
        text: "Próxima Questão →",
        textWhenDisabled: "Selecione pelo menos 1 opção",
        textWhenComplete: "Continuar",

        // 🎨 ESTILO AVANÇADO
        variant: "primary",
        size: "large",
        backgroundColor: "#B89B7A",
        textColor: "#ffffff",
        disabledBackgroundColor: "#d1d5db",
        disabledTextColor: "#9ca3af",

        // 🎯 COMPORTAMENTO INTELIGENTE
        disabled: true,
        requiresValidInput: true,
        instantActivation: false,
        noDelay: false,

        // 📏 DIMENSÕES E LAYOUT
        fullWidth: true,
        padding: "py-3 px-6",
        borderRadius: "7px",
        fontSize: "text-base",
        fontWeight: "font-semibold",

        // ✨ EFEITOS VISUAIS
        shadowType: "small",
        shadowColor: "#B89B7A",
        effectType: "hover-lift",
        hoverOpacity: "75%",

        // 🚀 AUTO-ADVANCE
        autoAdvanceAfterActivation: false,
        autoAdvanceDelay: 0,

        // 📊 FEEDBACK
        showSuccessAnimation: false,
        showPulseWhenEnabled: false,
        quickFeedback: true,

        // 📱 RESPONSIVIDADE,
        marginTop: 24,
        textAlign: "text-center",
        spacing: "small",
        marginBottom: 0,
      },
    },
  ];
};

export default getStep02Template;
