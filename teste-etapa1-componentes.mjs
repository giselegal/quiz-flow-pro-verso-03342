#!/usr/bin/env node

/**
 * TESTE DOS COMPONENTES DA ETAPA 1
 * Verifica se todos os componentes necessários estão disponíveis e funcionais
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🧪 TESTE DOS COMPONENTES DA ETAPA 1");
console.log("=====================================\n");

// Componentes necessários para a Etapa 1
const requiredComponents = [
  "quiz-intro-header",
  "decorative-bar-inline",
  "text-inline",
  "image-display-inline",
  "form-input",
  "button-inline",
  "legal-notice-inline",
];

// Caminhos dos arquivos de componentes
const componentPaths = {
  "quiz-intro-header": "src/components/editor/blocks/QuizIntroHeaderBlock.tsx",
  "decorative-bar-inline": "src/components/editor/blocks/DecorativeBarInlineBlock.tsx",
  "text-inline": "src/components/editor/blocks/TextInlineBlock.tsx",
  "image-display-inline": "src/components/editor/blocks/inline/ImageDisplayInlineBlock.tsx",
  "form-input": "src/components/editor/blocks/FormInputBlock.tsx",
  "button-inline": "src/components/editor/blocks/ButtonInlineBlock.tsx",
  "legal-notice-inline": "src/components/editor/blocks/LegalNoticeInlineBlock.tsx",
};

console.log("📂 Verificando arquivos de componentes...\n");

let allComponentsExist = true;

requiredComponents.forEach(componentType => {
  const filePath = componentPaths[componentType];
  const fullPath = path.join(process.cwd(), filePath);

  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${componentType}: ${filePath}`);
  } else {
    console.log(`❌ ${componentType}: ARQUIVO NÃO ENCONTRADO - ${filePath}`);
    allComponentsExist = false;
  }
});

console.log("\n📋 Verificando registry de componentes...\n");

// Verificar se os componentes estão registrados
const registryPath = path.join(
  process.cwd(),
  "src/components/editor/blocks/EnhancedBlockRegistry.tsx"
);
const configRegistryPath = path.join(process.cwd(), "src/config/enhancedBlockRegistry.ts");

if (fs.existsSync(registryPath)) {
  const registryContent = fs.readFileSync(registryPath, "utf8");

  requiredComponents.forEach(componentType => {
    if (registryContent.includes(`'${componentType}':`)) {
      console.log(`✅ ${componentType}: Registrado em EnhancedBlockRegistry.tsx`);
    } else {
      console.log(`⚠️  ${componentType}: NÃO registrado em EnhancedBlockRegistry.tsx`);
    }
  });
} else {
  console.log("❌ EnhancedBlockRegistry.tsx não encontrado");
}

console.log("\n📋 Verificando definições de componentes...\n");

if (fs.existsSync(configRegistryPath)) {
  const configContent = fs.readFileSync(configRegistryPath, "utf8");

  requiredComponents.forEach(componentType => {
    if (configContent.includes(`"${componentType}"`)) {
      console.log(`✅ ${componentType}: Definição encontrada em enhancedBlockRegistry.ts`);
    } else {
      console.log(`⚠️  ${componentType}: NÃO definido em enhancedBlockRegistry.ts`);
    }
  });
} else {
  console.log("❌ enhancedBlockRegistry.ts não encontrado");
}

console.log("\n🎯 Estrutura da Etapa 1:");
console.log("========================\n");

const etapa1Structure = [
  "1. quiz-intro-header (Logo + Progresso)",
  "2. decorative-bar-inline (Barra dourada)",
  "3. text-inline (Título principal)",
  "4. image-display-inline (Imagem hero)",
  "5. text-inline (Texto motivacional)",
  "6. form-input (Campo de nome)",
  "7. button-inline (Botão CTA)",
  "8. legal-notice-inline (Aviso legal)",
];

etapa1Structure.forEach(item => {
  console.log(`📝 ${item}`);
});

console.log("\n📊 RESUMO:");
console.log("==========");
console.log(
  `✅ Componentes encontrados: ${
    requiredComponents.filter(type => fs.existsSync(path.join(process.cwd(), componentPaths[type])))
      .length
  }/${requiredComponents.length}`
);

if (allComponentsExist) {
  console.log("🎉 TODOS OS COMPONENTES DA ETAPA 1 ESTÃO DISPONÍVEIS!");
  console.log("\n🚀 Próximos passos:");
  console.log("   1. Testar no editor (/editor-fixed)");
  console.log('   2. Carregar a Etapa 1 via botão "Carregar Etapa 1"');
  console.log("   3. Verificar renderização e propriedades");
} else {
  console.log("⚠️  Alguns componentes estão faltando. Verifique os arquivos acima.");
}

console.log("\n✨ Teste concluído!");
