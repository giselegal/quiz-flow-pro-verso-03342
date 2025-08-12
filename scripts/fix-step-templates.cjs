#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Função para gerar o template corrigido para cada step
function generateStepTemplate(stepNumber) {
  const stepNum = String(stepNumber).padStart(2, "0");

  return `import React, { useEffect } from "react";

/**
 * Step${stepNum}Template - Componente para Etapa ${stepNumber} do Quiz
 * 
 * Template para questão ${stepNumber - 1}: Configurável via painel de propriedades
 * Integração com sistema de quiz e editor de propriedades
 */

// ✅ INTERFACE OBRIGATÓRIA PARA O EDITOR
interface Step${stepNum}TemplateProps {
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
export const Step${stepNum}Template: React.FC<Step${stepNum}TemplateProps> = ({
  id,
  className = "",
  style = {},
  properties = {
    enabled: true,
    title: "QUESTÃO ${stepNumber - 1} - CONFIGURAR NO PAINEL",
    subtitle: "",
    questionCounter: "Questão ${stepNumber - 1} de 10",
    backgroundColor: "#FEFEFE",
    textColor: "#432818",
    showProgress: true,
    progressValue: ${stepNumber * 5},
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
      console.log(\`Step${stepNum}Template \${id} entered editing mode\`);
    }
  }, [isEditing, id]);

  useEffect(() => {
    console.log(\`Step${stepNum}Template \${id} properties updated:\`, properties);
  }, [properties, id]);

  // ✅ FUNÇÃO DE CLIQUE
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
    
    if (isEditing) {
      console.log(\`Step${stepNum}Template \${id} clicked in editing mode\`);
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
      className={\`step${stepNum.toLowerCase()}-template \${className} \${isEditing ? "editing-mode" : ""}\`}
      style={containerStyles}
      onClick={handleClick}
    >
      {/* Header com Progresso */}
      {properties.showProgress && (
        <div className="step-header mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-[#B89B7A] h-2 rounded-full transition-all duration-500"
              style={{ width: \`\${properties.progressValue}%\` }}
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
            📝 Conteúdo da Etapa ${stepNumber} - Configure no painel de propriedades
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
            Step ${stepNum}
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
export const getStep${stepNum}Template = () => {`;
}

// Lista de arquivos para processar
const stepsToProcess = [];
for (let i = 3; i <= 21; i++) {
  stepsToProcess.push(i);
}

console.log("🚀 Iniciando correção em lote dos Step Templates...");

stepsToProcess.forEach(stepNumber => {
  const stepNum = String(stepNumber).padStart(2, "0");
  const filePath = path.join(
    __dirname,
    "..",
    "src",
    "components",
    "steps",
    `Step${stepNum}Template.tsx`
  );

  try {
    console.log(`📝 Processando Step${stepNum}Template.tsx...`);

    // Verifica se o arquivo existe
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Arquivo Step${stepNum}Template.tsx não encontrado, pulando...`);
      return;
    }

    // Lê o conteúdo atual
    const currentContent = fs.readFileSync(filePath, "utf8");

    // Gera o novo template
    const newTemplate = generateStepTemplate(stepNumber);

    // Encontra onde termina o template atual e mantém o resto
    const exportMatch = currentContent.match(/export const getStep\d+Template = \(\) => \{/);
    let remainingContent = "";

    if (exportMatch) {
      const exportIndex = currentContent.indexOf(exportMatch[0]);
      remainingContent = currentContent.substring(exportIndex);
    } else {
      // Se não encontrar, mantém apenas um template básico
      remainingContent = `  return [
    {
      id: "step${stepNum}-placeholder",
      type: "text-inline",
      properties: {
        content: "Template Step ${stepNumber} - Configure no editor",
        fontSize: "text-lg",
        textAlign: "text-center",
        color: "#432818",
        marginBottom: 16,
      },
    },
  ];
};

export default getStep${stepNum}Template;`;
    }

    // Combina o novo template com o conteúdo existente
    const finalContent = newTemplate + remainingContent;

    // Escreve o arquivo
    fs.writeFileSync(filePath, finalContent, "utf8");

    console.log(`✅ Step${stepNum}Template.tsx corrigido com sucesso!`);
  } catch (error) {
    console.error(`❌ Erro ao processar Step${stepNum}Template.tsx:`, error.message);
  }
});

console.log("🎉 Correção em lote finalizada!");
console.log("📋 Próximo passo: Aplicar prettier em todos os arquivos corrigidos");
