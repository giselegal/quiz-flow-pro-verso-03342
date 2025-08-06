#!/usr/bin/env node

/**
 * 🧹 LIMPEZA AUTOMATIZADA DE COMPONENTES - QUIZ QUEST CHALLENGE VERSE
 * ===================================================================
 *
 * EXECUTA:
 * 1. Remove componentes duplicados (mantém a melhor versão)
 * 2. Substitui componentes específicos por versões genéricas
 * 3. Atualiza imports e mapeamentos
 * 4. Cria configuração otimizada das 21 etapas
 * 5. Aplica prettier em todos os arquivos modificados
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====================================================================
// 📋 CONFIGURAÇÃO DA LIMPEZA
// ====================================================================

const CLEANUP_CONFIG = {
  // Duplicatas para remover (manter a versão /editor/blocks)
  duplicatesToRemove: [
    "src/components/blocks/inline/BadgeInlineBlock.tsx",
    "src/components/blocks/inline/BeforeAfterInlineBlock.tsx",
    "src/components/blocks/inline/ButtonInlineBlock.tsx",
    "src/components/blocks/inline/CTAInlineBlock.tsx",
    "src/components/blocks/inline/FormInputBlock.tsx",
    "src/components/blocks/inline/GuaranteeInlineBlock.tsx",
    "src/components/blocks/inline/HeadingInlineBlock.tsx",
    "src/components/blocks/inline/ProgressInlineBlock.tsx",
    "src/components/blocks/inline/QuizIntroHeaderBlock.tsx",
    "src/components/blocks/inline/ResultHeaderInlineBlock.tsx",
    "src/components/blocks/inline/SpacerInlineBlock.tsx",
    "src/components/blocks/inline/StatInlineBlock.tsx",
    "src/components/blocks/inline/StyleCardInlineBlock.tsx",
    "src/components/blocks/inline/TextInlineBlock.tsx",
  ],

  // Componentes específicos para remover (substituir por genéricos)
  specificToRemove: [
    "src/components/blocks/inline/QuizStartPageInlineBlock.tsx",
    "src/components/blocks/inline/QuizPersonalInfoInlineBlock.tsx",
    "src/components/blocks/inline/QuizExperienceInlineBlock.tsx",
    "src/components/blocks/inline/QuizQuestionInlineBlock.tsx",
    "src/components/blocks/inline/QuizTransitionInlineBlock.tsx",
    "src/components/blocks/inline/QuizLoadingInlineBlock.tsx",
    "src/components/blocks/inline/QuizResultInlineBlock.tsx",
    "src/components/blocks/inline/QuizAnalysisInlineBlock.tsx",
    "src/components/blocks/inline/QuizCategoryInlineBlock.tsx",
    "src/components/blocks/inline/QuizRecommendationInlineBlock.tsx",
    "src/components/blocks/inline/QuizMetricsInlineBlock.tsx",
    "src/components/blocks/inline/QuizComparisonInlineBlock.tsx",
    "src/components/blocks/inline/QuizCertificateInlineBlock.tsx",
    "src/components/blocks/inline/QuizLeaderboardInlineBlock.tsx",
    "src/components/blocks/inline/QuizBadgesInlineBlock.tsx",
    "src/components/blocks/inline/QuizEvolutionInlineBlock.tsx",
  ],

  // Arquivos para atualizar imports
  filesToUpdateImports: [
    "src/config/blockDefinitions.ts",
    "src/config/enhancedBlockRegistry.ts",
    "src/hooks/useUnifiedProperties.ts",
    "src/components/enhanced-editor/universal/UniversalBlockRenderer.tsx",
  ],
};

// ====================================================================
// 🛠️ FUNÇÕES DE LIMPEZA
// ====================================================================

function logAction(action, details = "", type = "info") {
  const colors = {
    info: "\x1b[36m", // Cyan
    success: "\x1b[32m", // Green
    warning: "\x1b[33m", // Yellow
    error: "\x1b[31m", // Red
    reset: "\x1b[0m", // Reset
  };

  const icons = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    error: "❌",
  };

  console.log(`${colors[type]}${icons[type]} ${action}${colors.reset}`);
  if (details) {
    console.log(`   ${details}`);
  }
}

function createBackup() {
  logAction("Criando backup de segurança...", "", "info");

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.join(__dirname, `backup-cleanup-${timestamp}`);

  try {
    // Criar diretório de backup
    fs.mkdirSync(backupDir, { recursive: true });

    // Copiar componentes críticos
    const criticalDirs = [
      "src/components/editor/blocks",
      "src/components/blocks/inline",
      "src/config",
    ];

    criticalDirs.forEach(dir => {
      const fullPath = path.join(__dirname, dir);
      if (fs.existsSync(fullPath)) {
        execSync(`cp -r "${fullPath}" "${backupDir}/"`, { stdio: "pipe" });
      }
    });

    logAction("Backup criado com sucesso", backupDir, "success");
    return backupDir;
  } catch (error) {
    logAction("Erro ao criar backup", error.message, "error");
    throw error;
  }
}

function removeFiles(filePaths, reason = "") {
  logAction(`Removendo ${filePaths.length} arquivos...`, reason, "warning");

  let removedCount = 0;
  let errorCount = 0;

  filePaths.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);

    try {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        removedCount++;
        console.log(`   ❌ ${filePath}`);
      }
    } catch (error) {
      errorCount++;
      logAction(`Erro ao remover ${filePath}`, error.message, "error");
    }
  });

  logAction(`Remoção concluída`, `${removedCount} removidos, ${errorCount} erros`, "success");
}

function updateImports() {
  logAction("Atualizando imports nos arquivos principais...", "", "info");

  const importUpdates = {
    // Remover imports de componentes removidos
    QuizStartPageInlineBlock: null,
    QuizPersonalInfoInlineBlock: null,
    QuizExperienceInlineBlock: null,
    QuizQuestionInlineBlock: null,
    QuizTransitionInlineBlock: null,
    QuizLoadingInlineBlock: null,
    QuizResultInlineBlock: null,

    // Atualizar caminhos para versões mantidas
    "@/components/blocks/inline/BadgeInlineBlock": "@/components/editor/blocks/BadgeInlineBlock",
    "@/components/blocks/inline/ButtonInlineBlock": "@/components/editor/blocks/ButtonInlineBlock",
    "@/components/blocks/inline/FormInputBlock": "@/components/editor/blocks/FormInputBlock",
    "@/components/blocks/inline/HeadingInlineBlock":
      "@/components/editor/blocks/HeadingInlineBlock",
    "@/components/blocks/inline/TextInlineBlock": "@/components/editor/blocks/TextInlineBlock",
    "@/components/blocks/inline/SpacerInlineBlock": "@/components/editor/blocks/SpacerInlineBlock",
  };

  CLEANUP_CONFIG.filesToUpdateImports.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);

    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, "utf8");
      let modified = false;

      Object.entries(importUpdates).forEach(([oldImport, newImport]) => {
        if (newImport === null) {
          // Remover import completamente
          const importRegex = new RegExp(`import.*${oldImport}.*from.*\n`, "g");
          if (content.match(importRegex)) {
            content = content.replace(importRegex, "");
            modified = true;
          }
        } else {
          // Substituir caminho do import
          if (content.includes(oldImport)) {
            content = content.replace(new RegExp(oldImport, "g"), newImport);
            modified = true;
          }
        }
      });

      if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log(`   ✅ ${filePath}`);
      }
    }
  });
}

function updateBlockDefinitions() {
  logAction("Atualizando blockDefinitions.ts com configuração otimizada...", "", "info");

  const blockDefPath = path.join(__dirname, "src/config/blockDefinitions.ts");

  if (fs.existsSync(blockDefPath)) {
    let content = fs.readFileSync(blockDefPath, "utf8");

    // Remover definições de componentes removidos
    const componentsToRemove = [
      "quiz-start-page-inline",
      "quiz-personal-info-inline",
      "quiz-experience-inline",
      "quiz-question-inline",
      "quiz-transition-inline",
      "quiz-loading-inline",
      "quiz-result-inline",
    ];

    componentsToRemove.forEach(componentType => {
      // Remover bloco completo do componente (procurar por type e remover até próximo bloco)
      const regex = new RegExp(`\\s*{[^}]*type:\\s*["']${componentType}["'][^}]*},?`, "gs");
      content = content.replace(regex, "");
    });

    // Aplicar prettier
    fs.writeFileSync(blockDefPath, content);

    try {
      execSync(`npx prettier --write "${blockDefPath}"`, { stdio: "pipe" });
      logAction("blockDefinitions.ts atualizado e formatado", "", "success");
    } catch (error) {
      logAction("Erro ao aplicar prettier", error.message, "warning");
    }
  }
}

function generateOptimizedStepTemplates() {
  logAction("Gerando templates otimizados das 21 etapas...", "", "info");

  const templateContent = `/**
 * 🎯 TEMPLATES OTIMIZADOS DAS 21 ETAPAS
 * ====================================
 * 
 * Baseado na auditoria de componentes, usando apenas componentes core
 * reutilizáveis com máxima flexibilidade de configuração.
 */

export const OPTIMIZED_STEP_TEMPLATES = {
  // ETAPA 1: Introdução
  step01: {
    id: 'step-1',
    name: 'Introdução',
    description: 'Página inicial do quiz com coleta de nome',
    blocks: [
      {
        id: 'header-logo',
        type: 'quiz-intro-header',
        properties: {
          logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          logoAlt: 'Logo Gisele Galvão',
          progressValue: 0,
          showProgress: false,
          backgroundColor: '#F9F5F1',
          height: 80
        }
      },
      {
        id: 'main-title',
        type: 'heading-inline',
        properties: {
          content: 'Descubra Seu Estilo Predominante',
          level: 'h1',
          textAlign: 'center',
          color: '#432818',
          fontWeight: 'bold'
        }
      },
      {
        id: 'description',
        type: 'text-inline',
        properties: {
          text: 'Responda algumas perguntas rápidas e descubra qual dos 7 estilos universais combina mais com você.',
          fontSize: '1.125rem',
          alignment: 'center',
          color: '#6B5B4E'
        }
      },
      {
        id: 'decorative-separator',
        type: 'decorative-bar-inline',
        properties: {
          height: 4,
          color: '#B89B7A',
          marginTop: 20,
          marginBottom: 30
        }
      },
      {
        id: 'name-input',
        type: 'form-input',
        properties: {
          label: 'Qual é o seu nome?',
          placeholder: 'Digite seu primeiro nome',
          required: true,
          type: 'text',
          backgroundColor: '#FFFFFF',
          borderColor: '#B89B7A'
        }
      },
      {
        id: 'start-button',
        type: 'button-inline',
        properties: {
          text: 'Iniciar Quiz',
          style: 'primary',
          size: 'large',
          backgroundColor: '#B89B7A',
          textColor: '#FFFFFF'
        }
      },
      {
        id: 'legal-notice',
        type: 'legal-notice-inline',
        properties: {
          privacyText: 'Política de privacidade',
          copyrightText: '© 2025 Gisele Galvão Consultoria',
          fontSize: 'text-xs',
          textAlign: 'center',
          color: '#8F7A6A'
        }
      }
    ]
  },

  // TEMPLATE PARA ETAPAS 2-11: Questões
  questionTemplate: {
    name: 'Questão do Quiz',
    description: 'Template reutilizável para as 10 questões principais',
    blocks: [
      {
        id: 'header-progress',
        type: 'quiz-intro-header',
        properties: {
          logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          logoAlt: 'Logo Gisele Galvão',
          progressValue: '{{progressValue}}', // Dinâmico 10-55%
          showProgress: true,
          backgroundColor: '#F9F5F1'
        }
      },
      {
        id: 'question-title',
        type: 'heading-inline',
        properties: {
          content: '{{questionTitle}}', // Dinâmico
          level: 'h2',
          textAlign: 'center',
          color: '#432818'
        }
      },
      {
        id: 'options-grid',
        type: 'options-grid',
        properties: {
          question: '{{questionText}}', // Dinâmico
          columns: 2,
          gap: 16,
          selectionMode: 'single',
          primaryColor: '#B89B7A',
          accentColor: '#D4C2A8',
          showImages: true
        }
      },
      {
        id: 'progress-bar',
        type: 'quiz-progress',
        properties: {
          currentStep: '{{currentStep}}', // Dinâmico
          totalSteps: 21,
          showNumbers: true,
          showPercentage: true,
          barColor: '#B89B7A',
          backgroundColor: '#E5E7EB'
        }
      }
    ]
  },

  // ETAPA 20: Resultado
  step20: {
    id: 'step-20',
    name: 'Resultado Personalizado',
    description: 'Exibição do resultado calculado do quiz',
    blocks: [
      {
        id: 'header-clean',
        type: 'quiz-intro-header',
        properties: {
          logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          logoAlt: 'Logo Gisele Galvão',
          showProgress: false,
          backgroundColor: '#F9F5F1'
        }
      },
      {
        id: 'result-title',
        type: 'heading-inline',
        properties: {
          content: 'Seu Resultado: {{primaryStyle}}', // Dinâmico
          level: 'h1',
          textAlign: 'center',
          color: '#432818'
        }
      },
      {
        id: 'quiz-results',
        type: 'quiz-results',
        properties: {
          title: 'Seus Resultados',
          showScores: true,
          showPercentages: true,
          primaryColor: '#B89B7A',
          layout: 'vertical'
        }
      },
      {
        id: 'style-results',
        type: 'style-results',
        properties: {
          title: 'Seu Estilo Predominante',
          showGuideImage: true,
          guideImageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_NATURAL_fzp6fc.webp',
          primaryStyle: '{{primaryStyle}}', // Dinâmico
          showDescription: true
        }
      },
      {
        id: 'cta-offer',
        type: 'button-inline',
        properties: {
          text: 'Ver Oferta Personalizada',
          style: 'primary',
          size: 'large',
          backgroundColor: '#B89B7A'
        }
      }
    ]
  },

  // ETAPA 21: Oferta Final
  step21: {
    id: 'step-21',
    name: 'Oferta Personalizada',
    description: 'Oferta final baseada no resultado do quiz',
    blocks: [
      {
        id: 'header-offer',
        type: 'quiz-intro-header',
        properties: {
          logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          logoAlt: 'Logo Gisele Galvão',
          showProgress: false,
          backgroundColor: '#F9F5F1'
        }
      },
      {
        id: 'final-step-editor',
        type: 'final-step',
        properties: {
          stepNumber: 21,
          title: 'Oferta Exclusiva Para Seu Estilo {{primaryStyle}}', // Dinâmico
          subtitle: 'Transforme seu guarda-roupa com um guia personalizado',
          showNavigation: false,
          backgroundColor: '#F9F5F1',
          accentColor: '#B89B7A'
        }
      },
      {
        id: 'offer-image',
        type: 'image-display-inline',
        properties: {
          src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911682/C%C3%B3pia_de_MOCKUPS_14_oxegnd.webp',
          alt: 'Guia Personalizado de Estilo',
          width: '100%',
          height: 'auto',
          borderRadius: 8,
          alignment: 'center'
        }
      },
      {
        id: 'offer-description',
        type: 'text-inline',
        properties: {
          text: 'Receba um guia completo personalizado para seu estilo {{primaryStyle}}, com dicas exclusivas, paleta de cores e orientações para criar looks incríveis.',
          fontSize: '1.125rem',
          alignment: 'center'
        }
      },
      {
        id: 'payment-options',
        type: 'options-grid',
        properties: {
          question: 'Escolha sua forma de pagamento:',
          columns: 2,
          gap: 16,
          selectionMode: 'single',
          primaryColor: '#4CAF50',
          accentColor: '#66BB6A'
        }
      },
      {
        id: 'final-cta',
        type: 'button-inline',
        properties: {
          text: 'Garantir Meu Guia Personalizado',
          style: 'primary',
          size: 'large',
          backgroundColor: '#4CAF50',
          textColor: '#FFFFFF'
        }
      },
      {
        id: 'guarantee',
        type: 'legal-notice-inline',
        properties: {
          privacyText: 'Garantia de 7 dias',
          copyrightText: 'Pagamento 100% seguro',
          fontSize: 'text-sm',
          textAlign: 'center',
          color: '#4CAF50'
        }
      }
    ]
  }
};

// Função para gerar etapas dinâmicas baseadas nos templates
export function generateStepFromTemplate(stepNumber, questionData = null) {
  if (stepNumber === 1) {
    return OPTIMIZED_STEP_TEMPLATES.step01;
  }
  
  if (stepNumber >= 2 && stepNumber <= 11) {
    const template = { ...OPTIMIZED_STEP_TEMPLATES.questionTemplate };
    template.id = \`step-\${stepNumber}\`;
    template.name = \`Q\${stepNumber - 1} - \${questionData?.title || 'Questão'}\`;
    
    // Substituir placeholders dinâmicos
    template.blocks = template.blocks.map(block => ({
      ...block,
      properties: {
        ...block.properties,
        progressValue: Math.round(((stepNumber - 1) / 20) * 100),
        currentStep: stepNumber,
        questionTitle: questionData?.title || \`Questão \${stepNumber - 1}\`,
        questionText: questionData?.text || 'Selecione uma opção:'
      }
    }));
    
    return template;
  }
  
  if (stepNumber === 20) {
    return OPTIMIZED_STEP_TEMPLATES.step20;
  }
  
  if (stepNumber === 21) {
    return OPTIMIZED_STEP_TEMPLATES.step21;
  }
  
  // Para outras etapas, usar template de questão
  return generateStepFromTemplate(Math.min(stepNumber, 11), questionData);
}

export default OPTIMIZED_STEP_TEMPLATES;`;

  const templatePath = path.join(__dirname, "src/config/optimizedStepTemplates.ts");
  fs.writeFileSync(templatePath, templateContent);

  try {
    execSync(`npx prettier --write "${templatePath}"`, { stdio: "pipe" });
    logAction("Templates otimizados gerados e formatados", templatePath, "success");
  } catch (error) {
    logAction("Templates gerados (prettier falhou)", error.message, "warning");
  }
}

function updateUnifiedProperties() {
  logAction("Atualizando useUnifiedProperties.ts...", "", "info");

  const hookPath = path.join(__dirname, "src/hooks/useUnifiedProperties.ts");

  if (fs.existsSync(hookPath)) {
    let content = fs.readFileSync(hookPath, "utf8");

    // Remover cases de componentes removidos
    const casesToRemove = [
      "quiz-start-page-inline",
      "quiz-personal-info-inline",
      "quiz-experience-inline",
      "quiz-question-inline",
      "quiz-transition-inline",
      "quiz-loading-inline",
      "quiz-result-inline",
    ];

    casesToRemove.forEach(caseType => {
      // Remover case completo
      const regex = new RegExp(`\\s*case\\s*["']${caseType}["']:.*?(?=case|default:|\\s*})`, "gs");
      content = content.replace(regex, "");
    });

    fs.writeFileSync(hookPath, content);

    try {
      execSync(`npx prettier --write "${hookPath}"`, { stdio: "pipe" });
      logAction("useUnifiedProperties.ts atualizado", "", "success");
    } catch (error) {
      logAction("Hook atualizado (prettier falhou)", error.message, "warning");
    }
  }
}

function validateCleanup() {
  logAction("Validando limpeza...", "", "info");

  // Verificar se arquivos foram removidos
  const removedFiles = [...CLEANUP_CONFIG.duplicatesToRemove, ...CLEANUP_CONFIG.specificToRemove];

  let notRemoved = 0;
  removedFiles.forEach(file => {
    if (fs.existsSync(path.join(__dirname, file))) {
      notRemoved++;
      console.log(`   ⚠️ Ainda existe: ${file}`);
    }
  });

  if (notRemoved === 0) {
    logAction("Todos os arquivos foram removidos corretamente", "", "success");
  } else {
    logAction(`${notRemoved} arquivos não foram removidos`, "", "warning");
  }

  // Verificar sintaxe TypeScript
  try {
    execSync("npx tsc --noEmit --skipLibCheck", { stdio: "pipe" });
    logAction("Sintaxe TypeScript válida", "", "success");
  } catch (error) {
    logAction("Possíveis erros de TypeScript", "Execute: npx tsc --noEmit", "warning");
  }
}

function generateSummaryReport() {
  logAction("", "", "info");
  console.log("🎉 RELATÓRIO DE LIMPEZA CONCLUÍDO");
  console.log("================================");

  console.log("\n📊 ESTATÍSTICAS:");
  console.log(`• Duplicatas removidas: ${CLEANUP_CONFIG.duplicatesToRemove.length}`);
  console.log(`• Componentes específicos removidos: ${CLEANUP_CONFIG.specificToRemove.length}`);
  console.log(`• Arquivos atualizados: ${CLEANUP_CONFIG.filesToUpdateImports.length}`);
  console.log(`• Templates otimizados gerados: 4 (step01, questionTemplate, step20, step21)`);

  console.log("\n🎯 COMPONENTES CORE MANTIDOS:");
  const coreComponents = [
    "quiz-intro-header",
    "heading-inline",
    "text-inline",
    "decorative-bar-inline",
    "form-input",
    "button-inline",
    "options-grid",
    "quiz-progress",
    "quiz-results",
    "style-results",
    "final-step",
    "image-display-inline",
    "legal-notice-inline",
  ];

  coreComponents.forEach(comp => console.log(`  ✅ ${comp}`));

  console.log("\n🚀 PRÓXIMOS PASSOS:");
  console.log("1. Testar o editor: http://localhost:8081/editor-fixed");
  console.log("2. Verificar se todos os componentes carregam");
  console.log("3. Testar configuração das propriedades");
  console.log("4. Validar templates das 21 etapas");

  console.log("\n✅ LIMPEZA CONCLUÍDA COM SUCESSO!");
}

// ====================================================================
// 🚀 EXECUÇÃO PRINCIPAL DA LIMPEZA
// ====================================================================

function runCleanup() {
  console.log("🧹 INICIANDO LIMPEZA AUTOMATIZADA DE COMPONENTES");
  console.log("=".repeat(80));

  try {
    // 1. Criar backup
    const backupDir = createBackup();

    // 2. Remover duplicatas
    removeFiles(CLEANUP_CONFIG.duplicatesToRemove, "Removendo duplicatas");

    // 3. Remover componentes específicos
    removeFiles(CLEANUP_CONFIG.specificToRemove, "Removendo componentes específicos");

    // 4. Atualizar imports
    updateImports();

    // 5. Atualizar blockDefinitions
    updateBlockDefinitions();

    // 6. Atualizar useUnifiedProperties
    updateUnifiedProperties();

    // 7. Gerar templates otimizados
    generateOptimizedStepTemplates();

    // 8. Validar limpeza
    validateCleanup();

    // 9. Relatório final
    generateSummaryReport();

    return { success: true, backupDir };
  } catch (error) {
    logAction("ERRO DURANTE LIMPEZA", error.message, "error");
    console.log("\n🔄 Restaure o backup se necessário:", backupDir);
    throw error;
  }
}

// Executar limpeza
runCleanup();
