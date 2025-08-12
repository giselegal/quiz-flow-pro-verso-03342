#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🔧 Corrigindo erros de variáveis não utilizadas...\n");

// Função para remover imports/variáveis não utilizadas
function fixUnusedVariables() {
  const fixes = [
    // Arquivos do diretório result/
    {
      file: "src/components/result/ErrorState.tsx",
      removals: [{ type: "destructured", name: "location" }],
    },
    {
      file: "src/components/result/PerformanceMonitor.tsx",
      removals: [{ type: "destructured", name: "metrics" }],
    },
    {
      file: "src/components/result/ResourcePreloader.tsx",
      removals: [{ type: "parameter", name: "index" }],
    },
    {
      file: "src/components/result/ResultSkeleton.tsx",
      removals: [
        { type: "import", name: "OptimizedImage" },
        { type: "variable", name: "mainImageSrc" },
        { type: "variable", name: "BASE_HEIGHT" },
      ],
    },
    {
      file: "src/components/result/SecondaryStylesSection.tsx",
      removals: [{ type: "import", name: "React" }],
    },

    // Arquivos do diretório result/blocks/
    {
      file: "src/components/result/blocks/BonusSection.tsx",
      removals: [{ type: "import", name: "React" }],
    },
    {
      file: "src/components/result/blocks/GuaranteeSection.tsx",
      removals: [{ type: "import", name: "React" }],
    },
    {
      file: "src/components/result/blocks/MotivationSection.tsx",
      removals: [{ type: "import", name: "React" }],
    },
    {
      file: "src/components/result/blocks/TestimonialsBlock.tsx",
      removals: [{ type: "import", name: "React" }],
    },
    {
      file: "src/components/result/blocks/TransformationsBlock.tsx",
      removals: [{ type: "import", name: "React" }],
    },

    // Arquivos do diretório settings/
    {
      file: "src/components/settings/FacebookAdsTab.tsx",
      removals: [{ type: "import", name: "React" }],
    },
    {
      file: "src/components/settings/UtmSettingsTab.tsx",
      removals: [{ type: "destructured", name: "domain" }],
    },

    // Arquivos do diretório steps/
    {
      file: "src/components/steps/step01/IntroBlock.tsx",
      removals: [
        { type: "destructured", name: "isSelected" },
        { type: "destructured", name: "onClick" },
        { type: "variable", name: "jsonConfig" },
      ],
    },

    // Arquivos do diretório templates/
    {
      file: "src/components/templates/ImprovedQuizResultSalesPage.tsx",
      removals: [
        { type: "import", name: "Heart" },
        { type: "destructured", name: "imagesLoaded" },
        { type: "destructured", name: "setImagesLoaded" },
      ],
    },
    {
      file: "src/components/templates/TemplateSelector.tsx",
      removals: [
        { type: "import", name: "useMemo" },
        { type: "destructured", name: "setIsSelected" },
      ],
    },

    // Arquivos do diretório testing/
    {
      file: "src/components/testing/CanvasConfigurationTester.tsx",
      removals: [
        { type: "import", name: "CanvasConfiguration" },
        { type: "destructured", name: "updateConfiguration" },
        { type: "variable", name: "config" },
      ],
    },
    {
      file: "src/components/testing/CanvasConfigurationTesterFixed.tsx",
      removals: [
        { type: "variable", name: "updateConfiguration" },
        { type: "variable", name: "addComponent" },
        { type: "variable", name: "removeComponent" },
      ],
    },
    {
      file: "src/components/testing/SystemIntegrationTest.tsx",
      removals: [
        { type: "import", name: "useEffect" },
        { type: "import-line", pattern: /^import.*from\s+["']@\/types\/quiz["'];?\s*$/m },
      ],
    },

    // Arquivos do diretório ui/
    {
      file: "src/components/ui/ColorPicker.tsx",
      removals: [{ type: "variable", name: "presetColors" }],
    },
    {
      file: "src/components/ui/OptimizedAutoFixedImages.tsx",
      removals: [{ type: "parameter", name: "mutations" }],
    },
    {
      file: "src/components/ui/OptimizedImage.tsx",
      removals: [{ type: "import", name: "optimizeCloudinaryUrl" }],
    },
    {
      file: "src/components/ui/PropertyGroup.tsx",
      removals: [
        { type: "import", name: "Button" },
        { type: "destructured", name: "variant" },
      ],
    },
    {
      file: "src/components/ui/SecurePurchaseElement.tsx",
      removals: [{ type: "import", name: "Lock" }],
    },
    {
      file: "src/components/ui/calendar.tsx",
      removals: [
        { type: "parameter", name: "_props", replace: "_" },
        { type: "parameter", name: "_props", replace: "_" },
      ],
    },
    {
      file: "src/components/ui/color-picker.tsx",
      removals: [{ type: "import", name: "React" }],
    },
    {
      file: "src/components/ui/error-boundary.tsx",
      removals: [{ type: "import", name: "React" }],
    },
    {
      file: "src/components/ui/loading-state.tsx",
      removals: [{ type: "import", name: "LoadingSpinner" }],
    },

    // Outros diretórios
    {
      file: "src/components/unified-editor/UnifiedVisualEditor.tsx",
      removals: [
        { type: "destructured", name: "onSave" },
        { type: "destructured", name: "initialData" },
      ],
    },
    {
      file: "src/components/unified/UnifiedComponents.tsx",
      removals: [{ type: "destructured", name: "variant" }],
    },
    {
      file: "src/components/universal/PropertyChangeIndicator.tsx",
      removals: [{ type: "destructured", name: "debounceMs" }],
    },
    {
      file: "src/components/visual-controls/SizeSlider.tsx",
      removals: [{ type: "variable", name: "percentage" }],
    },

    // Arquivos de config/
    {
      file: "src/config/blockDefinitionsExamples.ts",
      removals: [
        { type: "import", name: "Palette" },
        { type: "import", name: "Settings" },
      ],
    },
    {
      file: "src/config/funnelBlockDefinitions.ts",
      removals: [
        { type: "import", name: "React" },
        { type: "import", name: "Radio" },
        { type: "import", name: "SlidersHorizontal" },
      ],
    },
  ];

  let totalFixed = 0;

  fixes.forEach(({ file, removals }) => {
    const filePath = path.join(__dirname, file);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Arquivo não encontrado: ${file}`);
      return;
    }

    let content = fs.readFileSync(filePath, "utf8");
    let originalContent = content;
    let fileFixed = 0;

    removals.forEach(({ type, name, pattern, replace }) => {
      switch (type) {
        case "import":
          // Remove import específico
          content = content.replace(new RegExp(`import\\s+${name}\\s+from[^;]+;\\s*\\n`, "g"), "");
          content = content.replace(new RegExp(`,\\s*${name}\\s*`, "g"), ",");
          content = content.replace(new RegExp(`{\\s*${name}\\s*,`, "g"), "{");
          content = content.replace(new RegExp(`,\\s*${name}\\s*}`, "g"), "}");
          content = content.replace(new RegExp(`{\\s*${name}\\s*}`, "g"), "");
          break;

        case "import-line":
          // Remove linha inteira de import
          content = content.replace(pattern, "");
          break;

        case "destructured":
          // Remove variável de desestruturação
          content = content.replace(new RegExp(`\\s*${name}[^,}]*[,]?`, "g"), "");
          break;

        case "variable":
          // Remove declaração de variável
          content = content.replace(new RegExp(`\\s*const\\s+${name}[^;\\n]*[;\\n]?`, "g"), "");
          content = content.replace(new RegExp(`\\s*let\\s+${name}[^;\\n]*[;\\n]?`, "g"), "");
          break;

        case "parameter":
          // Remove parâmetro ou substitui por underscore
          if (replace) {
            content = content.replace(new RegExp(`\\b${name}\\b`, "g"), replace);
          } else {
            content = content.replace(new RegExp(`\\s*,\\s*${name}\\b[^,)]*`, "g"), "");
            content = content.replace(new RegExp(`\\(\\s*${name}\\b[^,)]*\\s*,`, "g"), "(");
          }
          break;
      }
      fileFixed++;
    });

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ ${file} - ${fileFixed} correções aplicadas`);
      totalFixed++;
    } else {
      console.log(`ℹ️  ${file} - Nenhuma correção necessária`);
    }
  });

  return totalFixed;
}

const totalFixed = fixUnusedVariables();
console.log(`\n🎉 Total de arquivos corrigidos: ${totalFixed}`);
console.log("✨ Correções de variáveis não utilizadas concluídas!");
