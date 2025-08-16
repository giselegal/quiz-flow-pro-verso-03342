#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Padrão de melhoria para aplicar nos componentes
const PATTERN_IMPORTS = `import React from "react";
import { cn } from "../../../lib/utils";
import type { BlockComponentProps } from "../../../types/blocks";`;

const PATTERN_INTERFACE = `interface COMPONENT_NAMEProps extends BlockComponentProps {
  disabled?: boolean;
}`;

const PATTERN_COMPONENT_START = `const COMPONENT_NAME: React.FC<COMPONENT_NAMEProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  disabled = false,
  className,
}) => {
  // Verificação de segurança para evitar erro de undefined
  if (!block || !block.properties) {
    return (
      <div className="p-4 border-2 border-red-300 bg-red-50 rounded-lg">
        <p className="text-red-600">Erro: Bloco não encontrado ou propriedades indefinidas</p>
      </div>
    );
  }

  // Debug das propriedades recebidas
  console.log("🔍 [COMPONENT_NAME] Propriedades recebidas:", block.properties);

  const {
    // Extrair propriedades do block.properties aqui
  } = block?.properties || {};

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };`;

const PATTERN_WRAPPER_START = `  return (
    <div
      className={cn(
        "relative w-full p-4 rounded-lg border-2 border-dashed",
        isSelected ? "border-[#B89B7A] bg-[#B89B7A]/10" : "border-gray-300 bg-white",
        "cursor-pointer hover:border-gray-400 transition-colors",
        className
      )}
      onClick={onClick}
    >`;

const PATTERN_WRAPPER_END = `    </div>
  );
};

export default COMPONENT_NAME;`;

// Lista de componentes a serem atualizados
const componentsToUpdate = [
  "VideoBlock",
  "FAQBlock",
  "GuaranteeBlock",
  "CTAInlineBlock",
  "CountdownTimerBlock",
  "ConfettiBlock",
  "MarqueeBlock",
  "StatsMetricsBlock",
  "QuizTitleBlock",
  "FinalCTABlock",
  "QuizOfferFinalCTABlock",
  "QuizOfferTestimonialsBlock",
  "ResultHeaderBlock",
  "QuizStartPageBlock",
  "InteractiveQuizBlock",
  "StrategicQuestionBlock",
  "OptionsGridBlock",
  "QuizStepBlock",
];

function updateComponent(componentName) {
  const filePath = path.join(
    __dirname,
    "src",
    "components",
    "editor",
    "blocks",
    `${componentName}.tsx`
  );

  if (!fs.existsSync(filePath)) {
    console.log(`❌ Arquivo não encontrado: ${filePath}`);
    return false;
  }

  try {
    let content = fs.readFileSync(filePath, "utf8");

    // Se o arquivo está vazio, criar um componente básico
    if (content.trim() === "") {
      content = createBasicComponent(componentName);
    } else {
      // Verificar se já está atualizado
      if (content.includes("BlockComponentProps")) {
        console.log(`✅ ${componentName} já está atualizado`);
        return true;
      }

      // Aplicar melhorias ao componente existente
      content = applyImprovements(content, componentName);
    }

    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ ${componentName} atualizado com sucesso`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao atualizar ${componentName}:`, error.message);
    return false;
  }
}

function createBasicComponent(componentName) {
  return `import React from "react";
import { cn } from "../../../lib/utils";
import type { BlockComponentProps } from "../../../types/blocks";

interface ${componentName}Props extends BlockComponentProps {
  disabled?: boolean;
}

const ${componentName}: React.FC<${componentName}Props> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  disabled = false,
  className,
}) => {
  // Verificação de segurança para evitar erro de undefined
  if (!block || !block.properties) {
    return (
      <div className="p-4 border-2 border-red-300 bg-red-50 rounded-lg">
        <p className="text-red-600">Erro: Bloco não encontrado ou propriedades indefinidas</p>
      </div>
    );
  }

  // Debug das propriedades recebidas
  console.log("🔍 [${componentName}] Propriedades recebidas:", block.properties);

  const {
    title = "${componentName} Título",
    content = "Conteúdo do ${componentName}",
  } = block?.properties || {};

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  return (
    <div
      className={cn(
        "relative w-full p-4 rounded-lg border-2 border-dashed",
        isSelected ? "border-[#B89B7A] bg-[#B89B7A]/10" : "border-gray-300 bg-white",
        "cursor-pointer hover:border-gray-400 transition-colors",
        className
      )}
      onClick={onClick}
    >
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#aa6b5d] mb-4">{title}</h3>
        <p className="text-[#432818]">{content}</p>
      </div>
    </div>
  );
};

export default ${componentName};
`;
}

function applyImprovements(content, componentName) {
  // Esta função aplicaria melhorias mais sofisticadas em componentes existentes
  // Por ora, vamos apenas garantir que tenha as importações corretas
  if (!content.includes("BlockComponentProps")) {
    // Adicionar import do tipo se não existir
    content = content.replace(
      /import React from ["']react["'];/,
      `import React from "react";
import type { BlockComponentProps } from "../../../types/blocks";`
    );
  }

  return content;
}

// Executar atualizações
console.log("🚀 Iniciando aplicação de melhorias em lote nos componentes...\n");

let successCount = 0;
let totalCount = componentsToUpdate.length;

componentsToUpdate.forEach(componentName => {
  if (updateComponent(componentName)) {
    successCount++;
  }
});

console.log(`\n📊 Resumo:`);
console.log(`✅ Componentes atualizados: ${successCount}/${totalCount}`);
console.log(`❌ Componentes com erro: ${totalCount - successCount}/${totalCount}`);

if (successCount === totalCount) {
  console.log("\n🎉 Todas as melhorias foram aplicadas com sucesso!");
} else {
  console.log("\n⚠️  Algumas melhorias falharam. Verifique os logs acima.");
}
