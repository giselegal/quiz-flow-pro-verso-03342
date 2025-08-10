#!/usr/bin/env node

/**
 * 🎯 CORREÇÃO INTELIGENTE EM MASSA
 *
 * Este script identifica diferentes padrões de componentes e aplica a correção apropriada:
 * 1. Componentes que usam block.properties.style
 * 2. Componentes que recebem props diretamente
 */

const fs = require("fs");
const path = require("path");

console.log("🎯 INICIANDO CORREÇÃO INTELIGENTE EM MASSA...\n");

// Lista dos arquivos problemáticos (sem BenefitsInlineBlock que já corrigimos)
const problematicFiles = [
  "src/components/blocks/inline/BonusListInlineBlock.tsx",
  "src/components/blocks/inline/PricingCardInlineBlock.tsx",
  "src/components/blocks/inline/SecondaryStylesInlineBlock.tsx",
  "src/components/blocks/inline/StepHeaderInlineBlock.tsx",
  "src/components/blocks/inline/StyleCharacteristicsInlineBlock.tsx",
  "src/components/blocks/inline/TestimonialCardInlineBlock.tsx",
  "src/components/blocks/inline/TestimonialsInlineBlock.tsx",
];

function identifyAndFixComponent(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return { status: "not_found", file: path.basename(filePath) };
    }

    let content = fs.readFileSync(filePath, "utf-8");
    const fileName = path.basename(filePath);

    // Verifica se já não está corrigido
    if (content.includes("marginTop =") || content.includes("marginTop:")) {
      return { status: "already_fixed", file: fileName };
    }

    // Padrão 1: Componentes que usam block.properties.style
    if (content.includes("block.properties") && content.includes("= style;")) {
      return fixBlockStylePattern(filePath, content);
    }

    // Padrão 2: Componentes que recebem props diretamente
    if (content.includes("React.FC<Props>") || content.includes("React.FC<InlineBlockProps>")) {
      return fixDirectPropsPattern(filePath, content);
    }

    return { status: "unknown_pattern", file: fileName };
  } catch (error) {
    return { status: "error", file: path.basename(filePath), error: error.message };
  }
}

function fixBlockStylePattern(filePath, content) {
  const fileName = path.basename(filePath);

  // Procura por padrões como: const { size = "md", theme = "default" } = style;
  const styleDestructuringPattern = /const\s*{\s*([^}]*?)\s*}\s*=\s*style;/g;
  const matches = [...content.matchAll(styleDestructuringPattern)];

  if (matches.length === 0) {
    return { status: "no_style_destructuring", file: fileName };
  }

  let wasFixed = false;

  for (const match of matches) {
    const fullMatch = match[0];
    const destructuredVars = match[1].trim();

    // Verifica se já não tem as variáveis de margem
    if (destructuredVars.includes("marginTop")) continue;

    let newDestructuring;
    if (destructuredVars === "") {
      // Destructuring vazio
      newDestructuring = `const { 
    marginTop = 0,
    marginBottom = 0,
    marginLeft = 0,
    marginRight = 0
  } = style;`;
    } else {
      // Adiciona as novas variáveis
      newDestructuring = `const { ${destructuredVars},
    marginTop = 0,
    marginBottom = 0,
    marginLeft = 0,
    marginRight = 0
  } = style;`;
    }

    content = content.replace(fullMatch, newDestructuring);
    wasFixed = true;
    break;
  }

  if (wasFixed) {
    // Também corrige a função getMarginClass se tiver tipos incorretos
    if (content.includes("const getMarginClass = (value, type)")) {
      content = content.replace(
        "const getMarginClass = (value, type) =>",
        "const getMarginClass = (value: number | string | undefined, type: string): string =>"
      );

      content = content.replace(
        'if (isNaN(numValue) || numValue === 0) return "";',
        'if (!numValue || isNaN(numValue) || numValue === 0) return "";'
      );
    }

    fs.writeFileSync(filePath, content, "utf-8");
    return { status: "fixed_block_style", file: fileName };
  }

  return { status: "failed_block_style", file: fileName };
}

function fixDirectPropsPattern(filePath, content) {
  const fileName = path.basename(filePath);

  // Procura pela declaração do componente funcional
  const componentPattern = /const\s+\w+:\s*React\.FC<[^>]+>\s*=\s*\(\{\s*([^}]*?)\s*\}\)\s*=>/s;
  const match = content.match(componentPattern);

  if (!match) {
    return { status: "no_component_pattern", file: fileName };
  }

  const fullMatch = match[0];
  const propsSection = match[1].trim();

  // Verifica se já não tem as variáveis de margem
  if (propsSection.includes("marginTop")) {
    return { status: "already_has_margin_props", file: fileName };
  }

  // Adiciona as props de margem
  let newPropsSection;
  if (propsSection.endsWith(",")) {
    newPropsSection = `${propsSection}
  marginTop = 0,
  marginBottom = 0,
  marginLeft = 0,
  marginRight = 0`;
  } else {
    newPropsSection = `${propsSection},
  marginTop = 0,
  marginBottom = 0,
  marginLeft = 0,
  marginRight = 0`;
  }

  const newComponentDeclaration = fullMatch.replace(propsSection, newPropsSection);
  content = content.replace(fullMatch, newComponentDeclaration);

  // Também corrige a função getMarginClass se necessário
  if (content.includes("const getMarginClass = (value, type)")) {
    content = content.replace(
      "const getMarginClass = (value, type) =>",
      "const getMarginClass = (value: number | string | undefined, type: string): string =>"
    );

    content = content.replace(
      'if (isNaN(numValue) || numValue === 0) return "";',
      'if (!numValue || isNaN(numValue) || numValue === 0) return "";'
    );
  }

  fs.writeFileSync(filePath, content, "utf-8");
  return { status: "fixed_direct_props", file: fileName };
}

// Processar arquivos
console.log(`📊 Processando ${problematicFiles.length} arquivos...\n`);

const results = {
  already_fixed: [],
  fixed_block_style: [],
  fixed_direct_props: [],
  not_found: [],
  unknown_pattern: [],
  no_style_destructuring: [],
  no_component_pattern: [],
  failed_block_style: [],
  error: [],
};

for (const file of problematicFiles) {
  const result = identifyAndFixComponent(file);
  results[result.status].push(result);

  const statusEmoji = {
    already_fixed: "✅",
    fixed_block_style: "🔧",
    fixed_direct_props: "🎯",
    not_found: "❓",
    unknown_pattern: "⚠️",
    no_style_destructuring: "⚠️",
    no_component_pattern: "⚠️",
    failed_block_style: "❌",
    error: "💥",
  };

  console.log(`${statusEmoji[result.status]} ${result.file}: ${result.status}`);
}

console.log(`\n📊 RESULTADOS FINAIS:`);
console.log(`✅ Já corrigidos: ${results.already_fixed.length}`);
console.log(`🔧 Corrigidos (block.style): ${results.fixed_block_style.length}`);
console.log(`🎯 Corrigidos (props diretas): ${results.fixed_direct_props.length}`);
console.log(
  `⚠️  Padrões não reconhecidos: ${results.unknown_pattern.length + results.no_style_destructuring.length + results.no_component_pattern.length}`
);
console.log(`❌ Falhas: ${results.failed_block_style.length + results.error.length}`);

const totalFixed = results.fixed_block_style.length + results.fixed_direct_props.length;
if (totalFixed > 0) {
  console.log(`\n🎉 ${totalFixed} componentes foram corrigidos com sucesso!`);
}
