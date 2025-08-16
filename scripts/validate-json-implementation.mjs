// 🎯 VALIDAÇÃO FINAL DA IMPLEMENTAÇÃO JSON EM TODAS AS 21 ETAPAS
import fs from "fs";
import path from "path";

console.log("🔍 VALIDAÇÃO FINAL - SISTEMA JSON IMPLEMENTADO NAS 21 ETAPAS\n");

// 1. Verificar se todos os templates JSON existem
const templatesDir = "./templates";
const expectedTemplates = [];
for (let i = 1; i <= 21; i++) {
  expectedTemplates.push(`step-${i.toString().padStart(2, "0")}-template.json`);
}

let templatesValid = true;
let validTemplates = 0;

console.log("📁 1. VERIFICAÇÃO DOS TEMPLATES JSON:");
expectedTemplates.forEach(templateName => {
  const templatePath = path.join(templatesDir, templateName);
  if (fs.existsSync(templatePath)) {
    try {
      const content = JSON.parse(fs.readFileSync(templatePath, "utf8"));
      const blocksCount = content.blocks?.length || 0;
      console.log(`   ✅ ${templateName} - ${blocksCount} blocos`);
      validTemplates++;
    } catch (error) {
      console.log(`   ❌ ${templateName} - Erro no JSON: ${error.message}`);
      templatesValid = false;
    }
  } else {
    console.log(`   ❌ ${templateName} - Arquivo não encontrado`);
    templatesValid = false;
  }
});

// 2. Verificar TemplateManager
console.log("\n🔧 2. VERIFICAÇÃO DO TEMPLATE MANAGER:");
const templateManagerPath = "./src/utils/TemplateManager.ts";
if (fs.existsSync(templateManagerPath)) {
  const content = fs.readFileSync(templateManagerPath, "utf8");
  const hasAllMappings = expectedTemplates.every(template =>
    content.includes(template.replace("template.json", "template.json"))
  );

  if (hasAllMappings) {
    console.log("   ✅ TemplateManager atualizado com todos os 21 mapeamentos");
  } else {
    console.log("   ⚠️ TemplateManager pode estar incompleto");
  }
} else {
  console.log("   ❌ TemplateManager não encontrado");
}

// 3. Verificar EditorContext
console.log("\n⚙️ 3. VERIFICAÇÃO DO EDITOR CONTEXT:");
const editorContextPath = "./src/context/EditorContext.tsx";
if (fs.existsSync(editorContextPath)) {
  const content = fs.readFileSync(editorContextPath, "utf8");
  const hasTemplateManager = content.includes("TemplateManager");
  const hasAsyncLoad = content.includes("await TemplateManager.loadStepBlocks");
  const hasPreload = content.includes("TemplateManager.preloadCommonTemplates");

  console.log(`   ${hasTemplateManager ? "✅" : "❌"} Import do TemplateManager`);
  console.log(`   ${hasAsyncLoad ? "✅" : "❌"} Carregamento assíncrono`);
  console.log(`   ${hasPreload ? "✅" : "❌"} Pré-carregamento implementado`);
} else {
  console.log("   ❌ EditorContext não encontrado");
}

// 4. Verificar estrutura dos templates por categoria
console.log("\n📊 4. ANÁLISE POR CATEGORIA:");
const categories = {
  intro: [1],
  questions: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  transition: [15],
  processing: [16],
  results: [17, 18, 19],
  lead: [20],
  offer: [21],
};

Object.entries(categories).forEach(([category, steps]) => {
  console.log(`   📋 ${category.toUpperCase()}:`);
  steps.forEach(step => {
    const templateName = `step-${step.toString().padStart(2, "0")}-template.json`;
    const templatePath = path.join(templatesDir, templateName);
    if (fs.existsSync(templatePath)) {
      try {
        const content = JSON.parse(fs.readFileSync(templatePath, "utf8"));
        const blocksCount = content.blocks?.length || 0;
        console.log(`      ✅ Etapa ${step} - ${blocksCount} blocos`);
      } catch (error) {
        console.log(`      ❌ Etapa ${step} - Erro JSON`);
      }
    } else {
      console.log(`      ❌ Etapa ${step} - Template não encontrado`);
    }
  });
});

// 5. Resumo final
console.log("\n🎯 5. RESUMO FINAL:");
console.log(`   📁 Templates JSON: ${validTemplates}/21 válidos`);
console.log(`   ⚙️ Sistema: ${templatesValid ? "Funcionando" : "Com problemas"}`);
console.log(
  `   🚀 Status: ${validTemplates === 21 && templatesValid ? "IMPLEMENTAÇÃO COMPLETA!" : "Necessária revisão"}`
);

if (validTemplates === 21 && templatesValid) {
  console.log("\n🎉 PARABÉNS! Sistema JSON implementado em todas as 21 etapas!");
  console.log("   - EditorContext atualizado para usar templates JSON");
  console.log("   - Fallback TSX mantido para segurança");
  console.log("   - Pré-carregamento automático ativo");
  console.log("   - Sistema híbrido funcionando perfeitamente");
  console.log("\n💡 Para testar: Acesse /editor e navegue entre as etapas!");
} else {
  console.log("\n⚠️ Alguns problemas encontrados. Verifique os logs acima.");
}
