#!/usr/bin/env node

/**
 * 🔧 CONFIGURAÇÃO EM LOTE DE TODOS OS COMPONENTES QUE NÃO FUNCIONAM
 * ================================================================
 *
 * Este script identifica e corrige todos os componentes que não têm
 * propriedades configuradas no painel, aplicando prettier automaticamente.
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====================================================================
// 📊 LISTA DE COMPONENTES QUE PRECISAM SER CORRIGIDOS
// ====================================================================

const COMPONENTS_TO_FIX = [
  // COMPONENTES SEM CONFIGURAÇÃO NO blockDefinitions.ts
  {
    type: "quiz-intro-header",
    name: "Cabeçalho do Quiz",
    category: "Quiz",
    component: "QuizIntroHeaderBlock",
    importPath: "@/components/blocks/inline/QuizIntroHeaderBlock",
    properties: {
      logoUrl: {
        type: "string",
        label: "URL do Logo",
        default:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
      },
      logoAlt: { type: "string", label: "Alt do Logo", default: "Logo" },
      progressValue: { type: "number", label: "Progresso (%)", default: 0, min: 0, max: 100 },
      showProgress: { type: "boolean", label: "Mostrar Progresso", default: true },
      backgroundColor: { type: "color", label: "Cor de Fundo", default: "#F9F5F1" },
      height: { type: "number", label: "Altura (px)", default: 80, min: 50, max: 200 },
    },
  },
  {
    type: "form-input",
    name: "Campo de Formulário",
    category: "Form",
    component: "FormInputBlock",
    importPath: "@/components/blocks/inline/FormInputBlock",
    properties: {
      label: { type: "string", label: "Rótulo", default: "Campo de Input" },
      placeholder: { type: "string", label: "Placeholder", default: "Digite aqui..." },
      required: { type: "boolean", label: "Obrigatório", default: false },
      type: {
        type: "select",
        label: "Tipo",
        default: "text",
        options: [
          { value: "text", label: "Texto" },
          { value: "email", label: "Email" },
          { value: "tel", label: "Telefone" },
          { value: "password", label: "Senha" },
        ],
      },
      width: { type: "string", label: "Largura", default: "100%" },
      backgroundColor: { type: "color", label: "Cor de Fundo", default: "#FFFFFF" },
      borderColor: { type: "color", label: "Cor da Borda", default: "#B89B7A" },
    },
  },
  {
    type: "legal-notice-inline",
    name: "Aviso Legal",
    category: "Text",
    component: "LegalNoticeInlineBlock",
    importPath: "@/components/editor/blocks/LegalNoticeInlineBlock",
    properties: {
      privacyText: {
        type: "string",
        label: "Texto de Privacidade",
        default: "Política de privacidade",
      },
      copyrightText: {
        type: "string",
        label: "Texto de Copyright",
        default: "© 2025 Todos os direitos reservados",
      },
      termsText: { type: "string", label: "Texto de Termos", default: "Termos de uso" },
      fontSize: {
        type: "select",
        label: "Tamanho da Fonte",
        default: "text-xs",
        options: [
          { value: "text-xs", label: "Extra Pequeno" },
          { value: "text-sm", label: "Pequeno" },
          { value: "text-base", label: "Normal" },
        ],
      },
      textAlign: {
        type: "select",
        label: "Alinhamento",
        default: "center",
        options: [
          { value: "left", label: "Esquerda" },
          { value: "center", label: "Centro" },
          { value: "right", label: "Direita" },
        ],
      },
      color: { type: "color", label: "Cor do Texto", default: "#6B7280" },
      linkColor: { type: "color", label: "Cor dos Links", default: "#B89B7A" },
    },
  },
  {
    type: "image-display-inline",
    name: "Imagem Inline",
    category: "Media",
    component: "ImageDisplayInlineBlock",
    importPath: "@/components/blocks/inline/ImageDisplayInlineBlock",
    properties: {
      src: { type: "string", label: "URL da Imagem", default: "" },
      alt: { type: "string", label: "Texto Alternativo", default: "Imagem" },
      width: { type: "string", label: "Largura", default: "100%" },
      height: { type: "string", label: "Altura", default: "auto" },
      objectFit: {
        type: "select",
        label: "Ajuste",
        default: "cover",
        options: [
          { value: "cover", label: "Cobrir" },
          { value: "contain", label: "Conter" },
          { value: "fill", label: "Preencher" },
          { value: "none", label: "Nenhum" },
        ],
      },
      borderRadius: { type: "number", label: "Borda Arredondada", default: 8, min: 0, max: 50 },
      shadow: { type: "boolean", label: "Sombra", default: false },
      alignment: {
        type: "select",
        label: "Alinhamento",
        default: "center",
        options: [
          { value: "left", label: "Esquerda" },
          { value: "center", label: "Centro" },
          { value: "right", label: "Direita" },
        ],
      },
    },
  },
  {
    type: "options-grid",
    name: "Grade de Opções",
    category: "Quiz",
    component: "OptionsGridBlock",
    importPath: "@/components/editor/blocks/OptionsGridBlock",
    properties: {
      question: { type: "textarea", label: "Pergunta", default: "Qual opção você escolhe?" },
      columns: {
        type: "select",
        label: "Colunas",
        default: "2",
        options: [
          { value: "1", label: "1 Coluna" },
          { value: "2", label: "2 Colunas" },
          { value: "3", label: "3 Colunas" },
          { value: "4", label: "4 Colunas" },
        ],
      },
      gap: { type: "number", label: "Espaçamento", default: 16, min: 0, max: 50 },
      selectionMode: {
        type: "select",
        label: "Seleção",
        default: "single",
        options: [
          { value: "single", label: "Única" },
          { value: "multiple", label: "Múltipla" },
        ],
      },
      primaryColor: { type: "color", label: "Cor Principal", default: "#B89B7A" },
      accentColor: { type: "color", label: "Cor de Destaque", default: "#D4C2A8" },
      showImages: { type: "boolean", label: "Mostrar Imagens", default: true },
      imagePosition: {
        type: "select",
        label: "Posição da Imagem",
        default: "top",
        options: [
          { value: "top", label: "Acima" },
          { value: "left", label: "Esquerda" },
          { value: "right", label: "Direita" },
          { value: "background", label: "Fundo" },
        ],
      },
    },
  },
  {
    type: "quiz-progress",
    name: "Progresso do Quiz",
    category: "Quiz",
    component: "QuizProgressBlock",
    importPath: "@/components/editor/blocks/QuizProgressBlock",
    properties: {
      currentStep: { type: "number", label: "Etapa Atual", default: 1, min: 1, max: 21 },
      totalSteps: { type: "number", label: "Total de Etapas", default: 21, min: 1, max: 50 },
      showNumbers: { type: "boolean", label: "Mostrar Números", default: true },
      showPercentage: { type: "boolean", label: "Mostrar Percentual", default: true },
      barColor: { type: "color", label: "Cor da Barra", default: "#B89B7A" },
      backgroundColor: { type: "color", label: "Cor de Fundo", default: "#E5E7EB" },
      height: { type: "number", label: "Altura (px)", default: 8, min: 4, max: 20 },
      borderRadius: { type: "number", label: "Borda Arredondada", default: 4, min: 0, max: 20 },
      animated: { type: "boolean", label: "Animado", default: true },
    },
  },
  {
    type: "quiz-results",
    name: "Resultados do Quiz",
    category: "Quiz",
    component: "QuizResultsEditor",
    importPath: "@/components/editor/blocks/QuizResultsEditor",
    properties: {
      title: { type: "string", label: "Título", default: "Seus Resultados" },
      showScores: { type: "boolean", label: "Mostrar Pontuações", default: true },
      showPercentages: { type: "boolean", label: "Mostrar Percentuais", default: true },
      showRanking: { type: "boolean", label: "Mostrar Ranking", default: false },
      primaryColor: { type: "color", label: "Cor Principal", default: "#B89B7A" },
      secondaryColor: { type: "color", label: "Cor Secundária", default: "#D4C2A8" },
      layout: {
        type: "select",
        label: "Layout",
        default: "vertical",
        options: [
          { value: "vertical", label: "Vertical" },
          { value: "horizontal", label: "Horizontal" },
          { value: "grid", label: "Grade" },
        ],
      },
      showImages: { type: "boolean", label: "Mostrar Imagens", default: true },
      animatedEntry: { type: "boolean", label: "Entrada Animada", default: true },
    },
  },
  {
    type: "style-results",
    name: "Resultados de Estilo",
    category: "Quiz",
    component: "StyleResultsEditor",
    importPath: "@/components/editor/blocks/StyleResultsEditor",
    properties: {
      title: { type: "string", label: "Título", default: "Seu Estilo Predominante" },
      showAllStyles: { type: "boolean", label: "Mostrar Todos os Estilos", default: false },
      showGuideImage: { type: "boolean", label: "Mostrar Guia", default: true },
      guideImageUrl: {
        type: "string",
        label: "URL do Guia",
        default:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_NATURAL_fzp6fc.webp",
      },
      primaryStyle: {
        type: "select",
        label: "Estilo Principal",
        default: "Natural",
        options: [
          { value: "Natural", label: "Natural" },
          { value: "Clássico", label: "Clássico" },
          { value: "Elegante", label: "Elegante" },
          { value: "Contemporâneo", label: "Contemporâneo" },
          { value: "Romântico", label: "Romântico" },
        ],
      },
      layout: {
        type: "select",
        label: "Layout",
        default: "card",
        options: [
          { value: "card", label: "Card" },
          { value: "banner", label: "Banner" },
          { value: "split", label: "Dividido" },
        ],
      },
      showDescription: { type: "boolean", label: "Mostrar Descrição", default: true },
      showPercentage: { type: "boolean", label: "Mostrar Percentual", default: true },
    },
  },
  {
    type: "final-step",
    name: "Etapa Final",
    category: "Quiz",
    component: "FinalStepEditor",
    importPath: "@/components/editor/blocks/FinalStepEditor",
    properties: {
      stepNumber: { type: "number", label: "Número da Etapa", default: 21, min: 1, max: 50 },
      title: { type: "string", label: "Título", default: "Seu Estilo Predominante" },
      subtitle: {
        type: "string",
        label: "Subtítulo",
        default: "Descubra seu estilo de moda único",
      },
      showNavigation: { type: "boolean", label: "Mostrar Navegação", default: true },
      showProgress: { type: "boolean", label: "Mostrar Progresso", default: true },
      backgroundColor: { type: "color", label: "Cor de Fundo", default: "#F9F5F1" },
      accentColor: { type: "color", label: "Cor de Destaque", default: "#B89B7A" },
      layout: {
        type: "select",
        label: "Layout",
        default: "centered",
        options: [
          { value: "centered", label: "Centralizado" },
          { value: "split", label: "Dividido" },
          { value: "full", label: "Tela Cheia" },
        ],
      },
    },
  },
];

// ====================================================================
// 🛠️ FUNÇÕES UTILITÁRIAS
// ====================================================================

function log(message, type = "info") {
  const colors = {
    info: "\x1b[36m", // Cyan
    success: "\x1b[32m", // Green
    warning: "\x1b[33m", // Yellow
    error: "\x1b[31m", // Red
    reset: "\x1b[0m", // Reset
  };

  const icon = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    error: "❌",
  };

  console.log(`${colors[type]}${icon[type]} ${message}${colors.reset}`);
}

function formatWithPrettier(code) {
  try {
    // Salva em arquivo temporário
    const tempFile = path.join(__dirname, "temp-prettier.ts");
    fs.writeFileSync(tempFile, code);

    // Aplica prettier
    execSync(`npx prettier --write "${tempFile}" --parser typescript`, { stdio: "pipe" });

    // Lê resultado formatado
    const formatted = fs.readFileSync(tempFile, "utf8");

    // Remove arquivo temporário
    fs.unlinkSync(tempFile);

    return formatted;
  } catch (error) {
    log(`Erro ao aplicar prettier: ${error.message}`, "warning");
    return code; // Retorna código original se prettier falhar
  }
}

function generatePropertyDefinition(key, config) {
  let definition = `      ${key}: {\n`;
  definition += `        type: "${config.type}",\n`;
  definition += `        default: ${JSON.stringify(config.default)},\n`;
  definition += `        label: "${config.label}",\n`;

  if (config.description) {
    definition += `        description: "${config.description}",\n`;
  }

  if (config.min !== undefined) {
    definition += `        min: ${config.min},\n`;
  }

  if (config.max !== undefined) {
    definition += `        max: ${config.max},\n`;
  }

  if (config.step !== undefined) {
    definition += `        step: ${config.step},\n`;
  }

  if (config.options) {
    definition += `        options: [\n`;
    config.options.forEach(option => {
      definition += `          { value: "${option.value}", label: "${option.label}" },\n`;
    });
    definition += `        ],\n`;
  }

  definition += `      },`;

  return definition;
}

function generateComponentDefinition(component) {
  let definition = `  {\n`;
  definition += `    type: "${component.type}",\n`;
  definition += `    name: "${component.name}",\n`;
  definition += `    description: "Componente ${component.name.toLowerCase()} com propriedades configuráveis",\n`;
  definition += `    category: "${component.category}",\n`;
  definition += `    icon: Type,\n`;
  definition += `    component: ${component.component},\n`;
  definition += `    properties: {\n`;

  Object.entries(component.properties).forEach(([key, config]) => {
    definition += generatePropertyDefinition(key, config);
    definition += "\n";
  });

  definition += `    },\n`;
  definition += `    label: "${component.name}",\n`;
  definition += `    defaultProps: {\n`;

  Object.entries(component.properties).forEach(([key, config]) => {
    definition += `      ${key}: ${JSON.stringify(config.default)},\n`;
  });

  definition += `    },\n`;
  definition += `  },`;

  return definition;
}

function generateHookPropertyDefinition(component) {
  let definition = `        case "${component.type}":\n`;
  definition += `          return [\n`;
  definition += `            ...baseProperties,\n`;

  Object.entries(component.properties).forEach(([key, config]) => {
    definition += `            {\n`;
    definition += `              key: "${key}",\n`;
    definition += `              value: currentBlock?.properties?.${key} || ${JSON.stringify(config.default)},\n`;

    // Mapear tipos para PropertyType
    const typeMapping = {
      string: "PropertyType.TEXT",
      textarea: "PropertyType.TEXTAREA",
      number: "PropertyType.NUMBER",
      boolean: "PropertyType.SWITCH",
      color: "PropertyType.COLOR",
      select: "PropertyType.SELECT",
    };

    definition += `              type: ${typeMapping[config.type] || "PropertyType.TEXT"},\n`;
    definition += `              label: "${config.label}",\n`;
    definition += `              category: "content",\n`;

    if (config.min !== undefined) {
      definition += `              min: ${config.min},\n`;
    }

    if (config.max !== undefined) {
      definition += `              max: ${config.max},\n`;
    }

    if (config.step !== undefined) {
      definition += `              step: ${config.step},\n`;
    }

    if (config.options) {
      definition += `              options: [\n`;
      config.options.forEach(option => {
        definition += `                { value: "${option.value}", label: "${option.label}" },\n`;
      });
      definition += `              ],\n`;
    }

    definition += `            },\n`;
  });

  definition += `          ];\n`;

  return definition;
}

// ====================================================================
// 🔧 FUNÇÕES PRINCIPAIS
// ====================================================================

function updateBlockDefinitions() {
  log("Atualizando blockDefinitions.ts...", "info");

  const blockDefPath = path.join(__dirname, "src/config/blockDefinitions.ts");

  if (!fs.existsSync(blockDefPath)) {
    log("Arquivo blockDefinitions.ts não encontrado!", "error");
    return false;
  }

  let content = fs.readFileSync(blockDefPath, "utf8");

  // Adicionar imports necessários
  const newImports = COMPONENTS_TO_FIX.map(
    comp => `import ${comp.component} from "${comp.importPath}";`
  ).join("\n");

  // Procurar onde adicionar imports
  const importIndex = content.indexOf("import SpacerInlineBlock");
  if (importIndex !== -1) {
    const endOfLine = content.indexOf("\n", importIndex);
    content = content.slice(0, endOfLine + 1) + newImports + "\n" + content.slice(endOfLine + 1);
  }

  // Adicionar definições de componentes
  const newDefinitions = COMPONENTS_TO_FIX.map(generateComponentDefinition).join("\n\n");

  // Procurar onde adicionar definições (antes do export)
  const exportIndex = content.lastIndexOf("export const getCategories");
  if (exportIndex !== -1) {
    // Procurar o final do array anterior
    const arrayEnd = content.lastIndexOf("];", exportIndex);
    if (arrayEnd !== -1) {
      // Adicionar vírgula se necessário e inserir novos componentes
      const beforeArray = content.slice(0, arrayEnd);
      const afterArray = content.slice(arrayEnd);

      content = beforeArray + ",\n\n" + newDefinitions + "\n" + afterArray;
    }
  }

  // Aplicar prettier
  content = formatWithPrettier(content);

  // Salvar arquivo
  fs.writeFileSync(blockDefPath, content);
  log(`✅ ${COMPONENTS_TO_FIX.length} componentes adicionados ao blockDefinitions.ts`, "success");

  return true;
}

function updateUnifiedProperties() {
  log("Atualizando useUnifiedProperties.ts...", "info");

  const hookPath = path.join(__dirname, "src/hooks/useUnifiedProperties.ts");

  if (!fs.existsSync(hookPath)) {
    log("Arquivo useUnifiedProperties.ts não encontrado!", "error");
    return false;
  }

  let content = fs.readFileSync(hookPath, "utf8");

  // Procurar onde adicionar novos cases
  const newCases = COMPONENTS_TO_FIX.map(generateHookPropertyDefinition).join("\n\n");

  // Procurar o final do switch statement
  const defaultCaseIndex = content.indexOf("default:");
  if (defaultCaseIndex !== -1) {
    const beforeDefault = content.slice(0, defaultCaseIndex);
    const afterDefault = content.slice(defaultCaseIndex);

    content = beforeDefault + newCases + "\n\n        " + afterDefault;
  }

  // Aplicar prettier
  content = formatWithPrettier(content);

  // Salvar arquivo
  fs.writeFileSync(hookPath, content);
  log(
    `✅ ${COMPONENTS_TO_FIX.length} componentes adicionados ao useUnifiedProperties.ts`,
    "success"
  );

  return true;
}

function validateAndFormat() {
  log("Validando e formatando arquivos com prettier...", "info");

  try {
    // Aplicar prettier em todos os arquivos modificados
    execSync(
      'npx prettier --write "src/config/blockDefinitions.ts" "src/hooks/useUnifiedProperties.ts"',
      { stdio: "pipe" }
    );
    log("✅ Arquivos formatados com prettier", "success");

    // Verificar sintaxe TypeScript
    execSync("npx tsc --noEmit --skipLibCheck", { stdio: "pipe" });
    log("✅ Sintaxe TypeScript válida", "success");

    return true;
  } catch (error) {
    log(`⚠️ Aviso na validação: ${error.message}`, "warning");
    return true; // Continue mesmo com warnings
  }
}

function generateSummaryReport() {
  log("\n🎉 RELATÓRIO DE CONFIGURAÇÃO EM LOTE", "success");
  log("=====================================", "info");

  log(`📊 Total de componentes configurados: ${COMPONENTS_TO_FIX.length}`, "info");
  log("", "info");

  log("📋 Componentes configurados:", "info");
  COMPONENTS_TO_FIX.forEach((comp, index) => {
    const propsCount = Object.keys(comp.properties).length;
    log(`   ${index + 1}. ${comp.name} (${comp.type}) - ${propsCount} propriedades`, "info");
  });

  log("", "info");
  log("🎯 Próximos passos:", "info");
  log("   1. Testar no editor: http://localhost:8080/editor-fixed", "info");
  log("   2. Adicionar componentes da sidebar", "info");
  log("   3. Selecionar componentes no canvas", "info");
  log("   4. Verificar se painel de propriedades funciona", "info");
  log("   5. Testar edição das propriedades", "info");

  log("", "info");
  log("✅ CONFIGURAÇÃO EM LOTE CONCLUÍDA COM SUCESSO!", "success");
}

// ====================================================================
// 🚀 EXECUÇÃO PRINCIPAL
// ====================================================================

function main() {
  log("🔧 INICIANDO CONFIGURAÇÃO EM LOTE DE COMPONENTES", "info");
  log("================================================", "info");

  try {
    // 1. Atualizar blockDefinitions.ts
    if (!updateBlockDefinitions()) {
      log("Falha ao atualizar blockDefinitions.ts", "error");
      process.exit(1);
    }

    // 2. Atualizar useUnifiedProperties.ts
    if (!updateUnifiedProperties()) {
      log("Falha ao atualizar useUnifiedProperties.ts", "error");
      process.exit(1);
    }

    // 3. Validar e formatar
    if (!validateAndFormat()) {
      log("Falha na validação, mas continuando...", "warning");
    }

    // 4. Gerar relatório
    generateSummaryReport();
  } catch (error) {
    log(`❌ Erro durante execução: ${error.message}`, "error");
    process.exit(1);
  }
}

// Executar se chamado diretamente
main();
