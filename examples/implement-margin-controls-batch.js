#!/usr/bin/env node

/**
 * 🚀 Script Inteligente de Implementação de Controles de Margem em Lote
 *
 * Este script analisa todos os componentes React na pasta src/components/blocks/
 * e implementa automaticamente o sistema universal de controles de margem.
 *
 * Funcionalidades:
 * - ✅ Detecta componentes sem controles de margem completos
 * - ✅ Adiciona marginLeft, marginRight quando ausentes
 * - ✅ Implementa função getMarginClass universal
 * - ✅ Atualiza className containers com todas as margens
 * - ✅ Aplica Prettier automaticamente
 * - ✅ Preserva código existente e adiciona apenas o necessário
 *
 * Uso: node implement-margin-controls-batch.js
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// 🎯 Configurações
const BLOCKS_DIR = "./src/components/blocks";
const DRY_RUN = false; // Mude para true para apenas simular
const VERBOSE = true;

// 📋 Templates de código para injeção
const MARGIN_PROPERTIES_TEMPLATE = `    // Sistema completo de margens (positivas e negativas)
    marginTop = 0,
    marginBottom = 0,
    marginLeft = 0,
    marginRight = 0,`;

const MARGIN_FUNCTION_TEMPLATE = `  // Função para converter valores de margem em classes Tailwind (alinhada com useContainerProperties)
  const getMarginClass = (value: number | string, type: "top" | "bottom" | "left" | "right") => {
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

// 🔍 Classe para análise e modificação de componentes
class MarginControlsImplementer {
  constructor() {
    this.processedFiles = [];
    this.errors = [];
    this.stats = {
      total: 0,
      processed: 0,
      skipped: 0,
      errors: 0,
    };
  }

  // 📁 Encontra todos os arquivos .tsx recursivamente
  findTsxFiles(dir) {
    let results = [];
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        results = results.concat(this.findTsxFiles(filePath));
      } else if (file.endsWith(".tsx") && !file.includes(".test.") && !file.includes(".spec.")) {
        results.push(filePath);
      }
    }

    return results;
  }

  // 🧠 Analisa se o componente precisa de controles de margem
  analyzeComponent(content, filePath) {
    const analysis = {
      isReactComponent: false,
      hasBlockComponentProps: false,
      hasMarginTop: false,
      hasMarginBottom: false,
      hasMarginLeft: false,
      hasMarginRight: false,
      hasGetMarginClass: false,
      hasMarginInClassName: false,
      needsUpdate: false,
    };

    // Verifica se é um componente React
    analysis.isReactComponent =
      /export\s+(?:default\s+)?(?:const|function)\s+\w+.*React\.FC|React\.Component/i.test(content);

    // Verifica se usa BlockComponentProps
    analysis.hasBlockComponentProps = /BlockComponentProps/.test(content);

    // Verifica propriedades de margem existentes
    analysis.hasMarginTop = /marginTop\s*[=:]/.test(content);
    analysis.hasMarginBottom = /marginBottom\s*[=:]/.test(content);
    analysis.hasMarginLeft = /marginLeft\s*[=:]/.test(content);
    analysis.hasMarginRight = /marginRight\s*[=:]/.test(content);

    // Verifica se já tem função getMarginClass
    analysis.hasGetMarginClass = /getMarginClass\s*[=:]/.test(content);

    // Verifica se usa margens no className
    analysis.hasMarginInClassName = /getMarginClass|m[tlbr]-\d+/.test(content);

    // Determina se precisa de atualização
    analysis.needsUpdate =
      analysis.isReactComponent &&
      analysis.hasBlockComponentProps &&
      (!analysis.hasMarginLeft || !analysis.hasMarginRight || !analysis.hasGetMarginClass);

    if (VERBOSE) {
      console.log(`\n📊 Análise: ${path.basename(filePath)}`);
      console.log(`   React Component: ${analysis.isReactComponent}`);
      console.log(`   BlockComponentProps: ${analysis.hasBlockComponentProps}`);
      console.log(
        `   Margins: T:${analysis.hasMarginTop} B:${analysis.hasMarginBottom} L:${analysis.hasMarginLeft} R:${analysis.hasMarginRight}`
      );
      console.log(`   GetMarginClass: ${analysis.hasGetMarginClass}`);
      console.log(`   Needs Update: ${analysis.needsUpdate}`);
    }

    return analysis;
  }

  // ✏️ Implementa controles de margem no componente
  implementMarginControls(content, analysis, filePath) {
    let updatedContent = content;
    let changes = [];

    try {
      // 1. Adicionar marginLeft e marginRight nas propriedades se ausentes
      if (!analysis.hasMarginLeft || !analysis.hasMarginRight) {
        // Busca o padrão de destructuring de properties
        const destructuringMatch = content.match(/const\s*{\s*[\s\S]*?}\s*=\s*properties;/);

        if (destructuringMatch) {
          const existingDestructuring = destructuringMatch[0];

          // Verifica se já tem marginTop/Bottom para inserir na mesma seção
          if (analysis.hasMarginTop || analysis.hasMarginBottom) {
            // Adiciona marginLeft/Right perto das margens existentes
            if (!analysis.hasMarginLeft) {
              updatedContent = updatedContent.replace(/marginTop\s*=\s*[^,\n}]+,?/, match =>
                match.includes(",") ? match : match + ","
              );

              updatedContent = updatedContent.replace(
                /(marginTop\s*=\s*[^,\n}]+,?)/,
                "$1\n    marginLeft = 0,"
              );
              changes.push("Added marginLeft property");
            }

            if (!analysis.hasMarginRight) {
              updatedContent = updatedContent.replace(
                /margin(?:Bottom|Left)\s*=\s*[^,\n}]+,?/,
                match => (match.includes(",") ? match : match + ",")
              );

              updatedContent = updatedContent.replace(
                /(margin(?:Bottom|Left)\s*=\s*[^,\n}]+,?)/,
                "$1\n    marginRight = 0,"
              );
              changes.push("Added marginRight property");
            }
          } else {
            // Adiciona todas as margens se não existirem
            const insertPosition = existingDestructuring.lastIndexOf("}");
            const beforeClosing = existingDestructuring.substring(0, insertPosition);
            const afterClosing = existingDestructuring.substring(insertPosition);

            const newDestructuring =
              beforeClosing +
              (beforeClosing.trim().endsWith(",") ? "\n" : ",\n") +
              MARGIN_PROPERTIES_TEMPLATE +
              "\n" +
              afterClosing;

            updatedContent = updatedContent.replace(existingDestructuring, newDestructuring);
            changes.push("Added all margin properties");
          }
        }
      }

      // 2. Adicionar função getMarginClass se ausente
      if (!analysis.hasGetMarginClass) {
        // Busca onde inserir a função (após as constantes de classe/estilo)
        const insertPositions = [
          /(\n\s*\/\/.*[Cc]lasses?.*\n.*\n.*};)/,
          /(\n\s*const\s+\w+Classes\s*=[\s\S]*?};)/,
          /(\n\s*\/\/.*função|function.*\n)/i,
          /(\n\s*\/\/.*Usar className.*\n)/i,
        ];

        let inserted = false;
        for (const pattern of insertPositions) {
          if (pattern.test(updatedContent)) {
            updatedContent = updatedContent.replace(pattern, `$1\n\n${MARGIN_FUNCTION_TEMPLATE}\n`);
            changes.push("Added getMarginClass function");
            inserted = true;
            break;
          }
        }

        // Fallback: inserir antes do return
        if (!inserted) {
          updatedContent = updatedContent.replace(
            /(\n\s*\/\/.*container.*\n.*const\s+\w+.*cn\()/i,
            `\n${MARGIN_FUNCTION_TEMPLATE}\n\n$1`
          );
          changes.push("Added getMarginClass function (fallback position)");
        }
      }

      // 3. Atualizar className container para incluir todas as margens
      if (!analysis.hasMarginInClassName) {
        // Busca o cn() call principal do container
        const cnCallMatch = updatedContent.match(
          /const\s+\w*[Cc]ontainer\w*.*=\s*cn\(([\s\S]*?)\);/
        );

        if (cnCallMatch) {
          const cnContent = cnCallMatch[1];

          // Adiciona as margens no final antes do className
          const marginCalls = `    // Margens universais\n    getMarginClass(marginTop, "top"),\n    getMarginClass(marginBottom, "bottom"),\n    getMarginClass(marginLeft, "left"),\n    getMarginClass(marginRight, "right"),`;

          let updatedCnContent = cnContent;

          // Remove margens antigas se existirem
          updatedCnContent = updatedCnContent.replace(/getMarginClass\([^)]+\),?\n?/g, "");

          // Adiciona as novas margens antes do className no final
          if (updatedCnContent.includes("className")) {
            updatedCnContent = updatedCnContent.replace(
              /(\s*className[^,\n}]*)/m,
              `\n${marginCalls}\n$1`
            );
          } else {
            updatedCnContent = updatedCnContent.replace(/(\s*\);?\s*)$/, `\n${marginCalls}\n$1`);
          }

          updatedContent = updatedContent.replace(
            cnCallMatch[0],
            cnCallMatch[0].replace(cnContent, updatedCnContent)
          );
          changes.push("Updated className to include all margins");
        }
      }

      if (changes.length > 0) {
        console.log(`✅ ${path.basename(filePath)}: ${changes.join(", ")}`);
        return updatedContent;
      } else {
        console.log(`⏭️ ${path.basename(filePath)}: No changes needed`);
        return null;
      }
    } catch (error) {
      console.error(`❌ Error processing ${filePath}: ${error.message}`);
      this.errors.push({ file: filePath, error: error.message });
      return null;
    }
  }

  // 🎨 Aplica Prettier no código
  formatWithPrettier(content, filePath) {
    try {
      // Salva temporariamente o arquivo para usar Prettier
      const tempFile = filePath + ".temp";
      fs.writeFileSync(tempFile, content);

      // Aplica Prettier
      execSync(`npx prettier --write "${tempFile}"`, { stdio: "pipe" });

      const formattedContent = fs.readFileSync(tempFile, "utf8");
      fs.unlinkSync(tempFile);

      return formattedContent;
    } catch (error) {
      console.warn(`⚠️ Prettier formatting failed for ${filePath}: ${error.message}`);
      return content; // Retorna o conteúdo original se Prettier falhar
    }
  }

  // 🏃‍♂️ Processa um arquivo individual
  processFile(filePath) {
    this.stats.total++;

    try {
      const content = fs.readFileSync(filePath, "utf8");
      const analysis = this.analyzeComponent(content, filePath);

      if (!analysis.needsUpdate) {
        this.stats.skipped++;
        return;
      }

      const updatedContent = this.implementMarginControls(content, analysis, filePath);

      if (updatedContent && !DRY_RUN) {
        // Aplica Prettier antes de salvar
        const formattedContent = this.formatWithPrettier(updatedContent, filePath);

        fs.writeFileSync(filePath, formattedContent);
        this.processedFiles.push(filePath);
        this.stats.processed++;
      } else if (updatedContent) {
        console.log(`🔍 DRY RUN: Would update ${filePath}`);
        this.stats.processed++;
      } else {
        this.stats.skipped++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${filePath}: ${error.message}`);
      this.errors.push({ file: filePath, error: error.message });
      this.stats.errors++;
    }
  }

  // 🚀 Executa o processo completo
  run() {
    console.log("🚀 Iniciando implementação de controles de margem em lote...\n");

    if (DRY_RUN) {
      console.log("🔍 MODO DRY RUN - Nenhum arquivo será modificado\n");
    }

    const tsxFiles = this.findTsxFiles(BLOCKS_DIR);
    console.log(`📁 Encontrados ${tsxFiles.length} arquivos .tsx em ${BLOCKS_DIR}\n`);

    // Processa cada arquivo
    for (const filePath of tsxFiles) {
      this.processFile(filePath);
    }

    // Relatório final
    console.log("\n" + "=".repeat(60));
    console.log("📊 RELATÓRIO FINAL");
    console.log("=".repeat(60));
    console.log(`📁 Total de arquivos: ${this.stats.total}`);
    console.log(`✅ Processados: ${this.stats.processed}`);
    console.log(`⏭️ Ignorados: ${this.stats.skipped}`);
    console.log(`❌ Erros: ${this.stats.errors}`);

    if (this.processedFiles.length > 0) {
      console.log("\n🔧 Arquivos modificados:");
      this.processedFiles.forEach(file => {
        console.log(`   • ${path.relative(process.cwd(), file)}`);
      });
    }

    if (this.errors.length > 0) {
      console.log("\n❌ Erros encontrados:");
      this.errors.forEach(({ file, error }) => {
        console.log(`   • ${path.basename(file)}: ${error}`);
      });
    }

    console.log("\n🎉 Processo concluído!");

    if (!DRY_RUN && this.stats.processed > 0) {
      console.log("\n🔄 Executando verificação final com TypeScript...");
      try {
        execSync("npx tsc --noEmit", { stdio: "inherit" });
        console.log("✅ Verificação TypeScript passou!");
      } catch (error) {
        console.log(
          "⚠️ Verificação TypeScript encontrou problemas. Verifique os arquivos modificados."
        );
      }
    }
  }
}

// 🏁 Execução principal
if (require.main === module) {
  const implementer = new MarginControlsImplementer();
  implementer.run();
}

module.exports = MarginControlsImplementer;
