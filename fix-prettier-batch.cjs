const fs = require("fs");
const path = require("path");

// Lista de arquivos que precisam de correções do React import
const problematicFiles = [
  "src/components/debug/FunnelDebugPanel.tsx",
  "src/components/demo/FunnelActivationDemo.tsx", 
  "src/components/editor-fixed/examples/OfferPageExamples.tsx",
  "src/components/editor/canvas/CanvasDropZone.tsx",
  "src/components/editor/canvas/SortableBlockWrapper.tsx",
  "src/components/editor/dnd/DndProvider.tsx",
  "src/components/editor/dnd/DraggableComponentItem.tsx",
  "src/components/editor/quiz/QuizBlockRegistry.tsx",
  "src/components/editor/result/PreviewPanel.tsx",
  "src/components/editor/result/ResultPageBuilder.tsx",
  "src/components/funnel-blocks/VideoSection.tsx"
];

function addReactImport(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Arquivo não encontrado: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, "utf8");
  
  // Verifica se já tem import React
  if (content.includes("import React") || content.includes("import { React")) {
    console.log(`✅ Já tem React import: ${filePath}`);
    return false;
  }
  
  // Adiciona React import no início se usar React.
  if (content.includes("React.")) {
    const lines = content.split("\n");
    let insertIndex = 0;
    
    // Encontra onde inserir (depois de comentários do topo)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("//") || line.startsWith("/*") || line === "") {
        insertIndex = i + 1;
      } else {
        break;
      }
    }
    
    lines.splice(insertIndex, 0, 'import React from "react";');
    content = lines.join("\n");
    
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ React import adicionado: ${filePath}`);
    return true;
  }
  
  return false;
}

console.log("🔧 Iniciando correções em lote...");

let correctedFiles = 0;
problematicFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (addReactImport(fullPath)) {
    correctedFiles++;
  }
});

console.log(`\n✅ Correções concluídas: ${correctedFiles} arquivos corrigidos`);
