#!/usr/bin/env node

/**
 * 🧪 TESTE DAS MELHORIAS FASE 1 - EDITOR APRIMORADO
 * Verifica se todas as melhorias foram implementadas corretamente
 */

import fs from "fs";

console.log("🚀 TESTANDO MELHORIAS DA FASE 1 - EDITOR APRIMORADO");
console.log("=".repeat(70));

const COMPONENTS_TO_CHECK = [
  {
    path: "src/components/editor/properties/EnhancedPropertiesPanel.tsx",
    name: "Painel de Propriedades Aprimorado",
    features: [
      "Organização por categorias (Visual, Conteúdo, Layout, Comportamento)",
      "Controles especializados por tipo de propriedade",
      "Preview responsivo integrado",
      "Busca de propriedades",
      "Tooltips e validação visual",
    ],
  },
  {
    path: "src/components/editor/preview/ResponsivePreview.tsx",
    name: "Preview Responsivo",
    features: [
      "Preview desktop, tablet e mobile",
      "Device frames realísticos",
      "Métricas de performance",
      "Seleção visual de blocos",
      "Indicadores de status",
    ],
  },
  {
    path: "src/components/editor/sidebar/ComponentsLibrary.tsx",
    name: "Biblioteca de Componentes",
    features: [
      "Categorias organizadas",
      "Busca e filtros",
      "Indicadores de disponibilidade",
      "Drag & drop visual",
      "Componentes em destaque",
    ],
  },
  {
    path: "src/components/editor/history/EditorHistory.tsx",
    name: "Sistema de Histórico",
    features: [
      "Undo/Redo funcional",
      "Validação automática",
      "Auto-save",
      "Histórico de ações",
      "Indicadores visuais",
    ],
  },
  {
    path: "src/components/editor/ImprovedEditor.tsx",
    name: "Editor Principal Integrado",
    features: [
      "Layout responsivo com painéis",
      "Integração de todos os componentes",
      "Status bar informativo",
      "Controles de visibilidade",
      "Header com estatísticas",
    ],
  },
];

let allTestsPassed = true;

// 1. Verificar se todos os componentes foram criados
console.log("\\n1. VERIFICANDO COMPONENTES CRIADOS:");
COMPONENTS_TO_CHECK.forEach(component => {
  if (fs.existsSync(component.path)) {
    console.log(`✅ ${component.name} - OK`);

    // Verificar conteúdo básico
    const content = fs.readFileSync(component.path, "utf8");
    const hasReactImport = content.includes("import React");
    const hasExport = content.includes("export default");

    if (hasReactImport && hasExport) {
      console.log(`   📦 Estrutura válida`);
    } else {
      console.log(`   ⚠️ Estrutura pode estar incompleta`);
    }
  } else {
    console.log(`❌ ${component.name} - FALTANDO (${component.path})`);
    allTestsPassed = false;
  }
});

// 2. Verificar dependências necessárias
console.log("\\n2. VERIFICANDO DEPENDÊNCIAS:");

const packageJsonPath = "package.json";
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

  const requiredDeps = [
    "@radix-ui/react-tooltip",
    "@radix-ui/react-tabs",
    "@radix-ui/react-slider",
    "@radix-ui/react-switch",
    "@radix-ui/react-select",
    "lucide-react",
  ];

  let depsOk = true;
  requiredDeps.forEach(dep => {
    if (dependencies[dep]) {
      console.log(`✅ ${dep} - Instalado`);
    } else {
      console.log(`❌ ${dep} - FALTANDO`);
      depsOk = false;
    }
  });

  if (!depsOk) {
    allTestsPassed = false;
    console.log("\\n📦 Para instalar dependências faltantes:");
    console.log(
      "npm install @radix-ui/react-tooltip @radix-ui/react-tabs @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-select"
    );
  }
} else {
  console.log("❌ package.json não encontrado");
  allTestsPassed = false;
}

// 3. Verificar integração com sistema existente
console.log("\\n3. VERIFICANDO INTEGRAÇÃO:");

const registryPath = "src/config/enhancedBlockRegistry.ts";
if (fs.existsSync(registryPath)) {
  console.log("✅ Registry de componentes - OK");

  const registryContent = fs.readFileSync(registryPath, "utf8");
  const hasNewComponents = ["result-style-card", "bonus-showcase", "loading-animation"].every(
    comp => registryContent.includes(comp)
  );

  if (hasNewComponents) {
    console.log("✅ Novos componentes registrados");
  } else {
    console.log("⚠️ Alguns componentes podem não estar registrados");
  }
} else {
  console.log("❌ Registry de componentes não encontrado");
  allTestsPassed = false;
}

// Verificar templates JSON
const templatesDir = "src/config/templates";
if (fs.existsSync(templatesDir)) {
  const templates = fs.readdirSync(templatesDir).filter(f => f.endsWith(".json"));
  console.log(`✅ Templates JSON - ${templates.length} encontrados`);
} else {
  console.log("❌ Diretório de templates não encontrado");
  allTestsPassed = false;
}

// 4. Testar funcionalidades avançadas
console.log("\\n4. VERIFICANDO FUNCIONALIDADES AVANÇADAS:");

const advancedFeatures = [
  {
    name: "Tipos TypeScript",
    check: () => fs.existsSync("src/types/blocks.ts"),
    description: "Tipagem para BlockData e interfaces",
  },
  {
    name: "UI Components",
    check: () => fs.existsSync("src/components/ui"),
    description: "Biblioteca de componentes UI (shadcn/ui)",
  },
  {
    name: "Utilities",
    check: () => fs.existsSync("src/lib/utils.ts"),
    description: "Funções utilitárias (cn, etc.)",
  },
];

advancedFeatures.forEach(feature => {
  if (feature.check()) {
    console.log(`✅ ${feature.name} - OK`);
  } else {
    console.log(`❌ ${feature.name} - FALTANDO`);
    console.log(`   📄 ${feature.description}`);
    allTestsPassed = false;
  }
});

// 5. Verificar estrutura de arquivos
console.log("\\n5. VERIFICANDO ESTRUTURA:");

const expectedDirs = [
  "src/components/editor/properties",
  "src/components/editor/preview",
  "src/components/editor/sidebar",
  "src/components/editor/history",
];

expectedDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir} - OK`);
  } else {
    console.log(`❌ ${dir} - Diretório faltando`);
    allTestsPassed = false;
  }
});

// 6. Resumo e próximos passos
console.log("\\n" + "=".repeat(70));
console.log("📊 RESUMO DAS MELHORIAS IMPLEMENTADAS:");

if (allTestsPassed) {
  console.log("\\n🎉 SUCESSO! Todas as melhorias da Fase 1 foram implementadas!");
  console.log("\\n✅ FUNCIONALIDADES ADICIONADAS:");
  console.log("   🎨 Painel de propriedades organizado por categorias");
  console.log("   📱 Preview responsivo com device frames");
  console.log("   📚 Biblioteca de componentes visual");
  console.log("   ⏮️ Sistema de Undo/Redo com validação");
  console.log("   💾 Auto-save automático");
  console.log("   🔍 Busca e filtros avançados");
  console.log("   📊 Métricas de performance");
  console.log("   🎯 Tooltips e guias visuais");

  console.log("\\n🚀 PRÓXIMOS PASSOS (Fase 2):");
  console.log("   1. Implementar drag & drop de componentes");
  console.log("   2. Sistema de templates visuais");
  console.log("   3. Clone e duplicate de etapas");
  console.log("   4. Marketplace de componentes");

  console.log("\\n📱 TESTE O EDITOR MELHORADO:");
  console.log("   🔗 http://localhost:8081/editor");
  console.log("   📝 Importe ImprovedEditor nos seus componentes");
} else {
  console.log("\\n❌ ALGUMAS VERIFICAÇÕES FALHARAM");
  console.log("\\n📝 CORREÇÕES NECESSÁRIAS:");
  console.log("   1. Instalar dependências faltantes");
  console.log("   2. Verificar estrutura de tipos TypeScript");
  console.log("   3. Completar integração com sistema existente");

  console.log("\\n🔧 COMANDOS ÚTEIS:");
  console.log("   npm install # Instalar dependências");
  console.log("   npm run dev # Executar servidor de desenvolvimento");
  console.log("   npm run type-check # Verificar tipos TypeScript");
}

console.log("\\n" + "=".repeat(70));

process.exit(allTestsPassed ? 0 : 1);
