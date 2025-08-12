import React, { useEffect } from 'react';

/**
 * Step11Template - Componente para Etapa 11 do Quiz
 *
 * Template para questão 10: Configurável via painel de propriedades
 * Integração com sistema de quiz e editor de propriedades
 */

// ✅ INTERFACE OBRIGATÓRIA PARA O EDITOR
interface Step11TemplateProps {
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
export const Step11Template: React.FC<Step11TemplateProps> = ({
  id,
  className = '',
  style = {},
  properties = {
    enabled: true,
    title: 'QUESTÃO 10 - CONFIGURAR NO PAINEL',
    subtitle: '',
    questionCounter: 'Questão 10 de 10',
    backgroundColor: '#FEFEFE',
    textColor: '#432818',
    showProgress: true,
    progressValue: 55,
    buttonText: 'Próxima Questão →',
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
      console.log(`Step11Template ${id} entered editing mode`);
    }
  }, [isEditing, id]);

  useEffect(() => {
    console.log(`Step11Template ${id} properties updated:`, properties);
  }, [properties, id]);

  // ✅ FUNÇÃO DE CLIQUE
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();

    if (isEditing) {
      console.log(`Step11Template ${id} clicked in editing mode`);
      onUpdate?.(id, { lastClicked: new Date().toISOString() });
    }
  };

  // ✅ ESTILOS DINÂMICOS
  const containerStyles: React.CSSProperties = {
    backgroundColor: properties.backgroundColor,
    color: properties.textColor,
    width: '100%',
    minHeight: '500px',
    padding: '24px',
    boxSizing: 'border-box',
    position: 'relative',
    cursor: isEditing ? 'pointer' : 'default',
    border: isSelected ? '2px dashed #B89B7A' : '1px solid #e5e7eb',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    opacity: properties.enabled === false ? 0.5 : 1,
    pointerEvents: properties.enabled === false ? 'none' : 'auto',
    ...style,
  };

  // ✅ RENDERIZAÇÃO CONDICIONAL QUANDO DESABILITADO
  if (!properties.enabled && !isEditing) {
    return null;
  }

  return (
    <div
      id={id}
      className={`step11-template ${className} ${isEditing ? 'editing-mode' : ''}`}
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
          <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
            {properties.questionCounter}
          </p>
        )}

        {/* Área de Conteúdo Configurável */}
        <div className="content-area mb-6 p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">
            📝 Conteúdo da Etapa 11 - Configure no painel de propriedades
          </p>

          {/* Placeholder para opções */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {[1, 2, 3, 4].map(i => (
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
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Desabilitado</span>
          )}
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step 11</span>
        </div>
      )}

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && isEditing && (
        <div className="absolute bottom-2 left-2 text-xs text-gray-500 font-mono">ID: {id}</div>
      )}
    </div>
  );
};

// ✅ FUNÇÃO DE TEMPLATE (MANTIDA PARA COMPATIBILIDADE)
export const getStep11Template = () => {
  return [
    // 🎯 CABEÇALHO COM PROGRESSO
    {
      id: 'quiz-header-step11',
      type: 'quiz-header',
      properties: {
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 80,
        logoHeight: 80,
        progressValue: 55,
        progressMax: 100,
        showBackButton: true,
        showProgress: true,
        stepNumber: '11 de 21',
        spacing: 'small',
        marginTop: 0,
        marginBottom: 0,
      },
    },

    // 🎨 BARRA DECORATIVA
    {
      id: 'decorative-bar-step11',
      type: 'decorative-bar-inline',
      properties: {
        width: '100%',
        height: 3,
        color: '#B89B7A',
        gradientColors: ['#B89B7A', '#D4C2A8', '#B89B7A'],
        borderRadius: 2,
        marginTop: 0,
        marginBottom: 20,
        showShadow: true,
        spacing: 'small',
      },
    },

    // 📝 PERGUNTA PRINCIPAL
    {
      id: 'question-text-step11',
      type: 'text-inline',
      properties: {
        content: 'No ambiente de trabalho, você se veste:',
        fontSize: 'text-2xl',
        fontWeight: 'font-bold',
        fontFamily: 'Playfair Display, serif',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 24,
        lineHeight: '1.3',
        spacing: 'small',
        marginTop: 0,
      },
    },

    // 🖼️ IMAGEM DA PERGUNTA
    {
      id: 'question-image-step11',
      type: 'image-display-inline',
      properties: {
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838148/20250509_2147_Trabalho_e_Profissionalismo_simple_compose_01jtvta4gb3qhd4d6v3xr3jvtw_wnpshv.webp',
        alt: 'Imagem da pergunta 11',
        width: 400,
        height: 300,
        className: 'object-cover w-full max-w-md h-64 rounded-lg mx-auto shadow-md',
        textAlign: 'text-center',
        marginBottom: 24,
        spacing: 'small',
        marginTop: 0,
      },
    },

    // 🎯 OPÇÕES DE RESPOSTA

    {
      id: 'option-1-step11',
      type: 'quiz-option',
      properties: {
        optionId: 'executiva-formal',
        label: 'Executiva e formal',
        value: 'executiva-formal',
        points: {
          elegante: 3,
          casual: 1,
          criativo: 1,
          classico: 3,
          romantico: 1,
          minimalista: 2,
          boho: 1,
          spacing: 'small',
          marginTop: 0,
          marginBottom: 0,
        },

        variant: 'default',
        size: 'large',
        textAlign: 'text-left',
        marginBottom: 12,
        borderRadius: 'rounded-lg',
        backgroundColor: '#ffffff',
        hoverColor: '#F8F4F1',
        selectedColor: '#B89B7A',
      },
    },
    {
      id: 'option-2-step11',
      type: 'quiz-option',
      properties: {
        optionId: 'smart-casual',
        label: 'Smart casual - elegante mas descontraída',
        value: 'smart-casual',
        points: {
          elegante: 2,
          casual: 2,
          criativo: 2,
          classico: 2,
          romantico: 2,
          minimalista: 3,
          boho: 1,
          spacing: 'small',
          marginTop: 0,
          marginBottom: 0,
        },

        variant: 'default',
        size: 'large',
        textAlign: 'text-left',
        marginBottom: 12,
        borderRadius: 'rounded-lg',
        backgroundColor: '#ffffff',
        hoverColor: '#F8F4F1',
        selectedColor: '#B89B7A',
      },
    },
    {
      id: 'option-3-step11',
      type: 'quiz-option',
      properties: {
        optionId: 'feminina-profissional',
        label: 'Feminina e profissional',
        value: 'feminina-profissional',
        points: {
          elegante: 2,
          casual: 1,
          criativo: 1,
          classico: 3,
          romantico: 3,
          minimalista: 2,
          boho: 1,
          spacing: 'small',
          marginTop: 0,
          marginBottom: 0,
        },

        variant: 'default',
        size: 'large',
        textAlign: 'text-left',
        marginBottom: 12,
        borderRadius: 'rounded-lg',
        backgroundColor: '#ffffff',
        hoverColor: '#F8F4F1',
        selectedColor: '#B89B7A',
      },
    },
    {
      id: 'option-4-step11',
      type: 'quiz-option',
      properties: {
        optionId: 'criativa-autentica',
        label: 'Criativa e autêntica',
        value: 'criativa-autentica',
        points: {
          elegante: 1,
          casual: 2,
          criativo: 3,
          classico: 1,
          romantico: 1,
          minimalista: 1,
          boho: 3,
          spacing: 'small',
          marginTop: 0,
          marginBottom: 0,
        },

        variant: 'default',
        size: 'large',
        textAlign: 'text-left',
        marginBottom: 12,
        borderRadius: 'rounded-lg',
        backgroundColor: '#ffffff',
        hoverColor: '#F8F4F1',
        selectedColor: '#B89B7A',
      },
    },

    // 🎯 BOTÃO CONTINUAR
    {
      id: 'continue-button-step11',
      type: 'button-inline',
      properties: {
        text: 'Continuar →',
        variant: 'primary',
        size: 'large',
        fullWidth: true,
        backgroundColor: '#B89B7A',
        textColor: '#ffffff',
        requiresSelection: true,
        textAlign: 'text-center',
        borderRadius: 'rounded-full',
        padding: 'py-3 px-6',
        fontSize: 'text-base',
        fontWeight: 'font-semibold',
        marginTop: 24,
        disabled: true,
        spacing: 'small',
        marginBottom: 0,
      },
    },
  ];
};
