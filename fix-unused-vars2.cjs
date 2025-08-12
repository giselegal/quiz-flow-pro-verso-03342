#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Lista de correções adicionais
const fixes = [
  {
    file: "src/components/funnel-blocks/data/styleQuizData.ts",
    fixes: [{ search: /import.*QuizQuestion.*from.*\n/, replace: "" }],
  },
  {
    file: "src/components/funnel-blocks/hooks/useFunnelNavigation.ts",
    fixes: [{ search: /\s+answers[^,\n}]+[,]?/, replace: "" }],
  },
  {
    file: "src/components/funnel-blocks/steps/FunnelIntroStep.tsx",
    fixes: [{ search: /\s+onPrevious[^,\n}]+[,]?/, replace: "" }],
  },
  {
    file: "src/components/funnel-blocks/steps/QuestionMultipleStep.tsx",
    fixes: [
      { search: /\s+id[^,\n}]+[,]?/, replace: "" },
      { search: /\s+multiSelect[^,\n}]+[,]?/, replace: "" },
    ],
  },
  {
    file: "src/components/live-editor/LiveQuizEditor.tsx",
    fixes: [{ search: /\s+onSave[^,\n}]+[,]?/, replace: "" }],
  },
  {
    file: "src/components/live-editor/property-editors/StyleResultPropertyEditor.tsx",
    fixes: [{ search: /\s+isEditable[^,\n}]+[,]?/, replace: "" }],
  },
  {
    file: "src/components/loaders/FileLoadingScreen.tsx",
    fixes: [
      { search: /\s+fileUrl[^,\n}]+[,]?/, replace: "" },
      { search: /\s+onError[^,\n}]+[,]?/, replace: "" },
    ],
  },
  {
    file: "src/components/pages/ModernResultPageComponent.tsx",
    fixes: [{ search: /\s+handlePropertyChange[^,\n}]+[,]?/, replace: "" }],
  },
  {
    file: "src/components/pages/PreviewQuizOfferPage.tsx",
    fixes: [
      { search: /import.*StrictMode.*from.*react.*\n/, replace: 'import React from "react";\n' },
      { search: /\s+Award[^,\n}]+[,]?/, replace: "" },
      { search: /\s+RatingStars[^,\n}]+[,]?/, replace: "" },
    ],
  },
  {
    file: "src/components/quiz-builder/ComponentsSidebar.tsx",
    fixes: [{ search: /import.*Button.*from.*ui\/button.*\n/, replace: "" }],
  },
  {
    file: "src/components/quiz-builder/PropertiesPanel.tsx",
    fixes: [{ search: /\s+onClose[^,\n}]+[,]?/, replace: "" }],
  },
  {
    file: "src/components/quiz-builder/QuizBuilder.tsx",
    fixes: [
      { search: /import.*useUnifiedProperties.*from.*\n/, replace: "" },
      { search: /import.*ComponentsSidebar.*from.*\n/, replace: "" },
      { search: /\s+moveComponent[^,\n}]+[,]?/, replace: "" },
      { search: /\s+moveStage[^,\n}]+[,]?/, replace: "" },
      { search: /\s+actions[^,\n}]+[,]?/, replace: "" },
      { search: /\s+mockQuizResult[^,\n}]+[,]?/, replace: "" },
      { search: /\s+handleBlockOperations[^,\n}]+[,]?/, replace: "" },
    ],
  },
];

console.log("🔧 Iniciando correções adicionais...\n");

let totalFixed = 0;

fixes.forEach(({ file, fixes: fileFixes }) => {
  const filePath = path.join(__dirname, file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Arquivo não encontrado: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, "utf8");
  let fileFixed = 0;

  fileFixes.forEach(({ search, replace }) => {
    if (content.match(search)) {
      content = content.replace(search, replace);
      fileFixed++;
      totalFixed++;
    }
  });

  if (fileFixed > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ ${file} - ${fileFixed} correções aplicadas`);
  } else {
    console.log(`ℹ️  ${file} - Nenhuma correção necessária`);
  }
});

console.log(`\n🎉 Total de correções aplicadas: ${totalFixed}`);
console.log("✨ Correções concluídas!");
