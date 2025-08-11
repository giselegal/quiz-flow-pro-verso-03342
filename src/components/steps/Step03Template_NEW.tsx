import React, { useEffect } from "react";

/**
 * Step03Template - Componente para Etapa 3 do Quiz
 * 
 * Template para questão 2: Configurável via painel de propriedades
 * Integração com sistema de quiz e editor de propriedades
 */

// ✅ INTERFACE OBRIGATÓRIA PARA O EDITOR
interface Step03TemplateProps {
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
export const Step03Template: React.FC<Step03TemplateProps> = ({
  id,
  className = "",
  style = {},
  properties = {
    enabled: true,
    title: "QUESTÃO 2 - CONFIGURAR NO PAINEL",
    subtitle: "",
    questionCounter: "Questão 2 de 10",
    backgroundColor: "#FEFEFE",
    textColor: "#432818",
    showProgress: true,
    progressValue: 15,
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
      console.log(`Step03Template ${id} entered editing mode`);
    }
  }, [isEditing, id]);

  useEffect(() => {
    console.log(`Step03Template ${id} properties updated:`, properties);
  }, [properties, id]);

  // ✅ FUNÇÃO DE CLIQUE
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
    
    if (isEditing) {
      console.log(`Step03Template ${id} clicked in editing mode`);
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

  return (
    <div
      id={id}
      className={`step03-template ${className} ${isEditing ? "editing-mode" : ""}`}
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
        <h1 
          className="text-2xl font-bold mb-2"
          style={{ color: properties.textColor }}
        >
          {properties.title}
        </h1>

        {/* Contador da Questão */}
        {properties.questionCounter && (
          <p 
            className="text-sm mb-6"
            style={{ color: "#6B7280" }}
          >
            {properties.questionCounter}
          </p>
        )}

        {/* Área de Conteúdo Configurável */}
        <div className="content-area mb-6 p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">
            📝 Conteúdo da Etapa 3 - Configure no painel de propriedades
          </p>
          
          {/* Placeholder para opções */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 bg-white rounded border border-gray-200">
                <div className="w-full h-20 bg-gray-100 rounded mb-2"></div>
                <p className="text-xs text-gray-400">Opção {i}</p>
              </div>
            ))}
          </div>
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
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              Desabilitado
            </span>
          )}
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
            Step 03
          </span>
        </div>
      )}

      {/* Debug Info */}
      {process.env.NODE_ENV === "development" && isEditing && (
        <div className="absolute bottom-2 left-2 text-xs text-gray-500 font-mono">
          ID: {id}
        </div>
      )}
    </div>
  );
};

// ✅ FUNÇÃO DE TEMPLATE (MANTIDA PARA COMPATIBILIDADE)
export const getStep03Template = () => {
  return [
    {
      id: "step03-placeholder",
      type: "text-inline",
      properties: {
        content: "Template Step 3 - Configure no editor",
        fontSize: "text-lg",
        textAlign: "text-center",
        color: "#432818",
        marginBottom: 16,
      },
    },
  ];
};

export default getStep03Template;
