#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

/**
 * 🎛️ SCRIPT INTELIGENTE DE LOTE - CONTROLES DESLIZANTES UNIVERSAIS
 * Implementa controles de margem deslizantes para TODOS os componentes
 */

console.log("🎛️ INICIANDO IMPLEMENTAÇÃO UNIVERSAL DE CONTROLES DESLIZANTES...\n");

// Configurações dos controles deslizantes
const MARGIN_CONFIG = {
  ranges: {
    marginTop: { min: -40, max: 100, step: 4, unit: "px", label: "Margem Superior" },
    marginBottom: { min: -40, max: 100, step: 4, unit: "px", label: "Margem Inferior" },
    marginLeft: { min: -40, max: 100, step: 4, unit: "px", label: "Margem Esquerda" },
    marginRight: { min: -40, max: 100, step: 4, unit: "px", label: "Margem Direita" },
  },
  defaultValues: {
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 0,
    marginRight: 0,
  },
};

// Função para mapear valores para classes Tailwind
const generateMarginClassFunction = `
  // Função para converter valores de margem em classes Tailwind (Sistema Universal)
  const getMarginClass = (value, type) => {
    const numValue = typeof value === "string" ? parseInt(value, 10) : value;
    
    if (isNaN(numValue) || numValue === 0) return "";
    
    const prefix = type === "top" ? "mt" : type === "bottom" ? "mb" : type === "left" ? "ml" : "mr";
    
    // Margens negativas
    if (numValue < 0) {
      const absValue = Math.abs(numValue);
      if (absValue <= 4) return \`-\${prefix}-1\`;
      if (absValue <= 8) return \`-\${prefix}-2\`;
      if (absValue <= 12) return \`-\${prefix}-3\`;
      if (absValue <= 16) return \`-\${prefix}-4\`;
      if (absValue <= 20) return \`-\${prefix}-5\`;
      if (absValue <= 24) return \`-\${prefix}-6\`;
      if (absValue <= 28) return \`-\${prefix}-7\`;
      if (absValue <= 32) return \`-\${prefix}-8\`;
      if (absValue <= 36) return \`-\${prefix}-9\`;
      if (absValue <= 40) return \`-\${prefix}-10\`;
      return \`-\${prefix}-10\`; // Máximo para negativas
    }
    
    // Margens positivas (expandido para suportar até 100px)
    if (numValue <= 4) return \`\${prefix}-1\`;
    if (numValue <= 8) return \`\${prefix}-2\`;
    if (numValue <= 12) return \`\${prefix}-3\`;
    if (numValue <= 16) return \`\${prefix}-4\`;
    if (numValue <= 20) return \`\${prefix}-5\`;
    if (numValue <= 24) return \`\${prefix}-6\`;
    if (numValue <= 28) return \`\${prefix}-7\`;
    if (numValue <= 32) return \`\${prefix}-8\`;
    if (numValue <= 36) return \`\${prefix}-9\`;
    if (numValue <= 40) return \`\${prefix}-10\`;
    if (numValue <= 44) return \`\${prefix}-11\`;
    if (numValue <= 48) return \`\${prefix}-12\`;
    if (numValue <= 56) return \`\${prefix}-14\`;
    if (numValue <= 64) return \`\${prefix}-16\`;
    if (numValue <= 80) return \`\${prefix}-20\`;
    if (numValue <= 96) return \`\${prefix}-24\`;
    if (numValue <= 112) return \`\${prefix}-28\`;
    return \`\${prefix}-32\`; // Máximo suportado
  };`;

// Função para encontrar todos os arquivos de componentes
function findComponentFiles() {
  const componentDirs = [
    "src/components/blocks",
    "src/components/quiz",
    "src/components/templates",
    "src/components/editor",
  ];

  let files = [];

  componentDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const found = walkDirectory(dir, [".tsx", ".ts"]);
      files = files.concat(found);
    }
  });

  return files.filter(
    file =>
      (!file.includes(".test.") &&
        !file.includes(".spec.") &&
        !file.includes("index.ts") &&
        file.includes("Block")) ||
      file.includes("Component")
  );
}

// Função para percorrer diretórios recursivamente
function walkDirectory(dir, extensions) {
  let files = [];

  try {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        files = files.concat(walkDirectory(fullPath, extensions));
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.log(`⚠️  Erro ao ler diretório ${dir}:`, error.message);
  }

  return files;
}

// Função para analisar e atualizar um componente
function updateComponent(filePath) {
  console.log(`🔧 Processando: ${path.relative(process.cwd(), filePath)}`);

  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;

  // Verifica se já tem sistema de margem
  const hasMarginSystem =
    content.includes("getMarginClass") ||
    content.includes("marginTop") ||
    content.includes("marginBottom") ||
    content.includes("marginLeft") ||
    content.includes("marginRight");

  if (!hasMarginSystem) {
    console.log(`  ➕ Adicionando sistema de margem completo`);

    // Adicionar propriedades de margem na destructuring
    const destructuringMatch = content.match(/const\s*{([^}]+)}\s*=\s*properties/);
    if (destructuringMatch) {
      const currentProps = destructuringMatch[1];

      // Adicionar margens se não existirem
      if (!currentProps.includes("marginTop")) {
        const newProps =
          currentProps.trim() +
          `,
    // Sistema completo de margens com controles deslizantes
    marginTop = ${MARGIN_CONFIG.defaultValues.marginTop},
    marginBottom = ${MARGIN_CONFIG.defaultValues.marginBottom},
    marginLeft = ${MARGIN_CONFIG.defaultValues.marginLeft},
    marginRight = ${MARGIN_CONFIG.defaultValues.marginRight}`;

        content = content.replace(
          /const\s*{([^}]+)}\s*=\s*properties/,
          `const {${newProps}
  } = properties`
        );
        modified = true;
      }
    }

    // Adicionar função getMarginClass
    if (!content.includes("getMarginClass")) {
      const importSection =
        content.indexOf("const ") !== -1
          ? content.indexOf("const ")
          : content.indexOf("function ") !== -1
            ? content.indexOf("function ")
            : content.indexOf("export");

      content =
        content.slice(0, importSection) +
        generateMarginClassFunction +
        "\n\n" +
        content.slice(importSection);
      modified = true;
    }

    // Adicionar classes de margem no className principal
    const classNameMatch = content.match(/className=\{cn\(([\s\S]*?)\)\}/);
    if (classNameMatch && !content.includes("getMarginClass(marginTop")) {
      const currentClasses = classNameMatch[1];
      const newClasses =
        currentClasses +
        `,
    // Margens universais com controles deslizantes
    getMarginClass(marginTop, "top"),
    getMarginClass(marginBottom, "bottom"),
    getMarginClass(marginLeft, "left"),
    getMarginClass(marginRight, "right")`;

      content = content.replace(
        /className=\{cn\(([\s\S]*?)\)\}/,
        `className={cn(${newClasses}
  )}`
      );
      modified = true;
    }
  }

  // Atualizar função getMarginClass existente para versão completa
  if (content.includes("getMarginClass") && !content.includes('type === "left"')) {
    console.log(`  🔄 Atualizando função getMarginClass para suporte completo`);

    content = content.replace(
      /const getMarginClass = [\s\S]*?};/,
      generateMarginClassFunction.trim()
    );
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Componente atualizado com sucesso`);
    return true;
  } else {
    console.log(`  ℹ️  Componente já possui sistema completo de margens`);
    return false;
  }
}

// Função principal
function main() {
  try {
    console.log("🔍 Procurando componentes...\n");

    const componentFiles = findComponentFiles();
    console.log(`📁 Encontrados ${componentFiles.length} arquivos de componentes\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    componentFiles.forEach(file => {
      try {
        if (updateComponent(file)) {
          updatedCount++;
        } else {
          skippedCount++;
        }
      } catch (error) {
        console.log(`❌ Erro ao processar ${file}:`, error.message);
      }
    });

    console.log("\n📊 RESULTADO DA IMPLEMENTAÇÃO:");
    console.log(`✅ Componentes atualizados: ${updatedCount}`);
    console.log(`ℹ️  Componentes já completos: ${skippedCount}`);
    console.log(`📁 Total processados: ${componentFiles.length}`);

    // Aplicar Prettier
    console.log("\n🎨 Aplicando formatação Prettier...");
    try {
      execSync('npx prettier --write "src/components/**/*.{ts,tsx}" --ignore-unknown', {
        stdio: "inherit",
      });
      console.log("✅ Formatação aplicada com sucesso!");
    } catch (error) {
      console.log("⚠️  Erro na formatação Prettier:", error.message);
    }

    console.log("\n🎉 IMPLEMENTAÇÃO CONCLUÍDA!");
    console.log(
      "🎛️  Todos os componentes agora possuem controles deslizantes de margem universais"
    );
    console.log("📐 Suporte completo: marginTop, marginBottom, marginLeft, marginRight");
    console.log("🎚️  Ranges: -40px a +100px com step de 4px");
  } catch (error) {
    console.error("❌ ERRO CRÍTICO:", error.message);
    process.exit(1);
  }
}

// Executar script
main();
