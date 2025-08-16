#!/usr/bin/env node

/**
 * Script para verificar e corrigir imports no projeto
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Verifica se o componente EnhancedUniversalPropertiesPanel está importado corretamente
function checkAndFixImports() {
  console.log("🔍 Verificando imports dos componentes...");

  try {
    // Verifica os arquivos .tsx no diretório do editor
    const files = [
      "/workspaces/quiz-quest-challenge-verse/backup/editor-fixed-dragdrop.tsx",
      "/workspaces/quiz-quest-challenge-verse/src/pages/editor-fixed.tsx",
    ];

    files.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, "utf8");

        // Verifica e corrige o caminho de importação para EnhancedUniversalPropertiesPanel
        if (content.includes("@/components/editor/properties/EnhancedUniversalPropertiesPanel")) {
          content = content.replace(
            /@\/components\/editor\/properties\/EnhancedUniversalPropertiesPanel/g,
            "@/components/universal/EnhancedUniversalPropertiesPanel"
          );
          fs.writeFileSync(filePath, content, "utf8");
          console.log(`✅ Corrigido import em ${filePath}`);
        } else if (content.includes("@/components/universal/EnhancedUniversalPropertiesPanel")) {
          console.log(`✓ Import correto já presente em ${filePath}`);
        }
      }
    });

    console.log("✨ Verificação de imports concluída!");
  } catch (error) {
    console.error("❌ Erro ao verificar imports:", error);
    process.exit(1);
  }
}

// Executa a função principal
checkAndFixImports();
