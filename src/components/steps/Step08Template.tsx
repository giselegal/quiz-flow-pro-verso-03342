import React, { useEffect } from "react";

/**
 * Step08Template - Componente para Etapa 8 do Quiz
 *
 * Template para questão 7: Configurável via painel de propriedades
 * Integração com sistema de quiz e editor de propriedades
 */

// ✅ INTERFACE OBRIGATÓRIA PARA O EDITOR
interface Step08TemplateProps {
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
}

// ✅ COMPONENTE PRINCIPAL
export const Step08Template: React.FC<Step08TemplateProps> = ({
  id,
  className = "",
  style = {},
  properties = {
    enabled: true,
    title: "QUESTÃO 7 - CONFIGURAR NO PAINEL",
    subtitle: "",
    questionCounter: "Questão 7 de 10",
    backgroundColor: "#FEFEFE",
    textColor: "#432818",
    showProgress: true,
    progressValue: 40,
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
  useEffect(() => {
    if (isEditing) {
      console.log(`Step08Template ${id} entered editing mode`);
    }
  }, [isEditing, id]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
    if (isEditing) {
      onUpdate?.(id, { lastClicked: new Date().toISOString() });
    }
  };

  const containerStyles: React.CSSProperties = {
    backgroundColor: properties.backgroundColor,
    color: properties.textColor,
    width: "100%",
    minHeight: "400px",
    padding: "24px",
    boxSizing: "border-box",
    position: "relative",
    cursor: isEditing ? "pointer" : "default",
    border: isSelected ? "2px dashed #B89B7A" : "1px solid #e5e7eb",
    borderRadius: "8px",
    opacity: properties.enabled === false ? 0.5 : 1,
    ...style,
  };

  if (!properties.enabled && !isEditing) {
    return null;
  }

  return (
    <div
      id={id}
      className={`step08-template ${className} ${isEditing ? "editing-mode" : ""}`}
      style={containerStyles}
      onClick={handleClick}
    >
      {properties.showProgress && (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-[#B89B7A] h-2 rounded-full transition-all duration-500"
            style={{ width: `${properties.progressValue}%` }}
          />
        </div>
      )}
      
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2" style={{ color: properties.textColor }}>
          {properties.title}
        </h1>
        {properties.questionCounter && (
          <p className="text-sm mb-6 text-gray-500">{properties.questionCounter}</p>
        )}
        <div className="mb-6 p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">📝 Conteúdo da Etapa 8 - Configure no painel</p>
        </div>
        <button
          className="w-full max-w-md py-3 px-6 bg-[#B89B7A] text-white font-semibold rounded-md hover:bg-[#A1835D] transition-all duration-300"
          disabled={isEditing}
        >
          {properties.buttonText}
        </button>
      </div>

      {isEditing && (
        <div className="absolute top-2 right-2">
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step 08</span>
        </div>
      )}
    </div>
  );
};

export const getStep08Template = () => {
  return [
    // 📱 CABEÇALHO COM LOGO E PROGRESSO
    {
      id: "step08-header",
      type: "quiz-intro-header",
      properties: {
        logoUrl:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        logoAlt: "Logo Gisele Galvão",
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 40,
        progressMax: 100,
        showBackButton: true,
        marginTop: 0,
        spacing: "small",
        marginBottom: 0,
      },
    },

    // 🎯 TÍTULO DA QUESTÃO (EDITÁVEL SEPARADAMENTE)
    {
      id: "step08-title",
      type: "text-inline",
      properties: {
        content: "QUESTÃO 7 - CONFIGURAR NO PAINEL",
        fontSize: "text-2xl",
        fontWeight: "font-bold",
        textAlign: "text-center",
        color: "#432818",
        marginBottom: 8,
      },
    },

    // 📊 CONTADOR DE QUESTÃO (EDITÁVEL SEPARADAMENTE)
    {
      id: "step08-counter",
      type: "text-inline",
      properties: {
        content: "Questão 7 de 10",
        fontSize: "text-lg",
        textAlign: "text-center",
        color: "#666666",
        marginBottom: 32,
      },
    },

    // 📋 CONTEÚDO PRINCIPAL DA QUESTÃO
    {
      id: "step08-content",
      type: "text-inline",
      properties: {
        content: "Configure esta questão no painel de propriedades →",
        fontSize: "text-lg",
        textAlign: "text-center",
        color: "#432818",
        marginBottom: 32,
      },
    },

    // 🔘 BOTÃO DE AÇÃO
    {
      id: "step08-button",
      type: "button-styled",
      properties: {
        text: "Próxima Questão →",
        variant: "primary",
        size: "lg",
        textAlign: "text-center",
        marginTop: 24,
      },
    },
  ];
};

export default getStep08Template;
