#!/usr/bin/env node

/**
 * 🔧 COMPLETAR 21 ETAPAS NO FUNIL OTIMIZADO
 * =========================================
 *
 * Adiciona as 12 etapas faltantes para completar
 * as 21 etapas do funil otimizado.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====================================================================
// 🎯 ETAPAS FALTANTES (5-11, 14-18)
// ====================================================================

const missingSteps = [
  // Etapas 5-11: Perguntas do quiz
  {
    id: "step-5",
    name: "Q4 - Ocasiões especiais",
    description: "Para que tipo de evento você gosta de se arrumar?",
    order: 5,
    type: "question",
    questionData: {
      id: "q4",
      title: "Ocasiões especiais",
      text: "Para que tipo de evento você gosta de se arrumar?",
      options: [
        {
          id: "a",
          text: "Eventos ao ar livre e casuais",
          score: { natural: 3, contemporaneo: 1 },
        },
        {
          id: "b",
          text: "Reuniões formais e corporativas",
          score: { classico: 3, elegante: 2 },
        },
        {
          id: "c",
          text: "Jantares românticos e festas",
          score: { romantico: 3, elegante: 1 },
        },
        {
          id: "d",
          text: "Eventos exclusivos e gala",
          score: { dramatico: 3, elegante: 2 },
        },
      ],
    },
  },
  {
    id: "step-6",
    name: "Q5 - Estilo de cabelo",
    description: "Qual tipo de penteado combina mais com você?",
    order: 6,
    type: "question",
    questionData: {
      id: "q5",
      title: "Estilo de cabelo",
      text: "Qual tipo de penteado combina mais com você?",
      options: [
        {
          id: "a",
          text: "Solto e natural",
          score: { natural: 3, romantico: 1 },
        },
        {
          id: "b",
          text: "Bem estruturado e arrumado",
          score: { classico: 3, elegante: 2 },
        },
        {
          id: "c",
          text: "Com ondas e textura",
          score: { romantico: 3, criativo: 1 },
        },
        {
          id: "d",
          text: "Liso e impecável",
          score: { dramatico: 2, elegante: 3 },
        },
      ],
    },
  },
  {
    id: "step-7",
    name: "Q6 - Acessórios favoritos",
    description: "Que tipo de acessórios você prefere?",
    order: 7,
    type: "question",
    questionData: {
      id: "q6",
      title: "Acessórios favoritos",
      text: "Que tipo de acessórios você prefere?",
      options: [
        {
          id: "a",
          text: "Minimalistas e funcionais",
          score: { natural: 2, classico: 2 },
        },
        {
          id: "b",
          text: "Clássicos e atemporais",
          score: { classico: 3, elegante: 1 },
        },
        {
          id: "c",
          text: "Delicados e femininos",
          score: { romantico: 3, natural: 1 },
        },
        {
          id: "d",
          text: "Marcantes e chamativos",
          score: { dramatico: 3, criativo: 2 },
        },
      ],
    },
  },
  {
    id: "step-8",
    name: "Q7 - Estampa preferida",
    description: "Que tipo de estampa mais te atrai?",
    order: 8,
    type: "question",
    questionData: {
      id: "q7",
      title: "Estampa preferida",
      text: "Que tipo de estampa mais te atrai?",
      options: [
        {
          id: "a",
          text: "Lisas ou com texturas sutis",
          score: { natural: 2, classico: 2 },
        },
        {
          id: "b",
          text: "Listras e xadrez clássicos",
          score: { classico: 3, contemporaneo: 1 },
        },
        {
          id: "c",
          text: "Florais e estampas delicadas",
          score: { romantico: 3, criativo: 1 },
        },
        {
          id: "d",
          text: "Geométricas e contrastantes",
          score: { dramatico: 3, contemporaneo: 2 },
        },
      ],
    },
  },
  {
    id: "step-9",
    name: "Q8 - Calçados preferidos",
    description: "Que tipo de sapato você mais usa?",
    order: 9,
    type: "question",
    questionData: {
      id: "q8",
      title: "Calçados preferidos",
      text: "Que tipo de sapato você mais usa?",
      options: [
        {
          id: "a",
          text: "Tênis e sapatos baixos",
          score: { natural: 3, contemporaneo: 1 },
        },
        {
          id: "b",
          text: "Scarpin e sapatos clássicos",
          score: { classico: 3, elegante: 2 },
        },
        {
          id: "c",
          text: "Sapatilhas e sandálias delicadas",
          score: { romantico: 3, natural: 1 },
        },
        {
          id: "d",
          text: "Botas e sapatos statement",
          score: { dramatico: 3, criativo: 1 },
        },
      ],
    },
  },
  {
    id: "step-10",
    name: "Q9 - Maquiagem preferida",
    description: "Como você gosta de usar maquiagem?",
    order: 10,
    type: "question",
    questionData: {
      id: "q9",
      title: "Maquiagem preferida",
      text: "Como você gosta de usar maquiagem?",
      options: [
        {
          id: "a",
          text: "Natural e minimalista",
          score: { natural: 3, classico: 1 },
        },
        {
          id: "b",
          text: "Bem feita e discreta",
          score: { classico: 3, elegante: 1 },
        },
        {
          id: "c",
          text: "Suave com destaque nos olhos",
          score: { romantico: 3, elegante: 1 },
        },
        {
          id: "d",
          text: "Marcante e impactante",
          score: { dramatico: 3, criativo: 2 },
        },
      ],
    },
  },
  {
    id: "step-11",
    name: "Q10 - Ambiente de trabalho",
    description: "Como é seu ambiente de trabalho?",
    order: 11,
    type: "question",
    questionData: {
      id: "q10",
      title: "Ambiente de trabalho",
      text: "Como é seu ambiente de trabalho?",
      options: [
        {
          id: "a",
          text: "Casual e flexível",
          score: { natural: 3, contemporaneo: 2 },
        },
        {
          id: "b",
          text: "Formal e corporativo",
          score: { classico: 3, elegante: 2 },
        },
        {
          id: "c",
          text: "Criativo e descontraído",
          score: { criativo: 3, contemporaneo: 1 },
        },
        {
          id: "d",
          text: "Executivo e sofisticado",
          score: { elegante: 3, dramatico: 1 },
        },
      ],
    },
  },
  // Etapas 14-18: Perguntas estratégicas e transições
  {
    id: "step-14",
    name: "Estratégica 2 - Idade",
    description: "Qual sua faixa etária?",
    order: 14,
    type: "strategic",
    questionData: {
      id: "s2",
      title: "Faixa etária",
      text: "Qual sua faixa etária?",
      options: [
        { id: "a", text: "18-25 anos", segment: "jovem" },
        { id: "b", text: "26-35 anos", segment: "adulta_jovem" },
        { id: "c", text: "36-45 anos", segment: "adulta" },
        { id: "d", text: "46+ anos", segment: "madura" },
      ],
    },
  },
  {
    id: "step-15",
    name: "Estratégica 3 - Profissão",
    description: "Qual área profissional você atua?",
    order: 15,
    type: "strategic",
    questionData: {
      id: "s3",
      title: "Área profissional",
      text: "Qual área profissional você atua?",
      options: [
        { id: "a", text: "Saúde/Educação", segment: "cuidado" },
        { id: "b", text: "Corporativo/Executivo", segment: "corporativo" },
        { id: "c", text: "Criativo/Artístico", segment: "criativo" },
        { id: "d", text: "Empreendedora/Autônoma", segment: "empreendedora" },
      ],
    },
  },
  {
    id: "step-16",
    name: "Estratégica 4 - Objetivos",
    description: "Qual seu principal objetivo com o estilo?",
    order: 16,
    type: "strategic",
    questionData: {
      id: "s4",
      title: "Objetivos com estilo",
      text: "Qual seu principal objetivo com o estilo?",
      options: [
        { id: "a", text: "Mais confiança", segment: "autoestima" },
        { id: "b", text: "Profissionalismo", segment: "carreira" },
        { id: "c", text: "Expressão pessoal", segment: "criatividade" },
        { id: "d", text: "Elegância", segment: "sofisticacao" },
      ],
    },
  },
  {
    id: "step-17",
    name: "Finalizando Análise",
    description: "Últimos ajustes na sua análise...",
    order: 17,
    type: "transition",
  },
  {
    id: "step-18",
    name: "Calculando Resultado",
    description: "Processando seu perfil completo...",
    order: 18,
    type: "processing",
  },
];

// ====================================================================
// 🔧 FUNÇÃO PARA COMPLETAR AS ETAPAS
// ====================================================================

function completeOptimizedSteps() {
  console.log("🔧 COMPLETANDO AS 21 ETAPAS DO FUNIL OTIMIZADO...");

  const configPath = path.join(__dirname, "src/config/optimized21StepsFunnel.ts");

  if (!fs.existsSync(configPath)) {
    console.log("  ❌ optimized21StepsFunnel.ts não encontrado");
    return false;
  }

  let content = fs.readFileSync(configPath, "utf8");

  // Função para gerar blocos padrão para uma etapa
  const generateStepBlocks = step => {
    const baseBlocks = [
      {
        id: "header-progress",
        type: "quiz-intro-header",
        properties: {
          logoUrl:
            "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          logoAlt: "Logo Gisele Galvão",
          progressValue: Math.round((step.order / 21) * 100),
          showProgress: true,
          backgroundColor: "#F9F5F1",
          height: 80,
        },
      },
    ];

    if (step.type === "question") {
      baseBlocks.push(
        {
          id: "question-title",
          type: "heading-inline",
          properties: {
            content: step.questionData.title,
            level: "h2",
            textAlign: "center",
            color: "#432818",
            fontWeight: "600",
          },
        },
        {
          id: "options-grid",
          type: "options-grid",
          properties: {
            question: step.questionData.text,
            columns: "2",
            gap: 16,
            selectionMode: "single",
            primaryColor: "#B89B7A",
            accentColor: "#D4C2A8",
            showImages: step.order <= 3,
            imagePosition: "top",
            options: step.questionData.options,
          },
        },
        {
          id: "progress-bar",
          type: "quiz-progress",
          properties: {
            currentStep: step.order,
            totalSteps: 21,
            showNumbers: true,
            showPercentage: true,
            barColor: "#B89B7A",
            backgroundColor: "#E5E7EB",
            height: 8,
            animated: true,
          },
        }
      );
    } else if (step.type === "strategic") {
      baseBlocks.push(
        {
          id: "question-title",
          type: "heading-inline",
          properties: {
            content: step.questionData.title,
            level: "h2",
            textAlign: "center",
            color: "#432818",
          },
        },
        {
          id: "options-grid",
          type: "options-grid",
          properties: {
            question: step.questionData.text,
            columns: "1",
            gap: 12,
            selectionMode: "single",
            primaryColor: "#B89B7A",
            accentColor: "#D4C2A8",
            showImages: false,
            options: step.questionData.options,
          },
        }
      );
    } else if (step.type === "transition") {
      baseBlocks.push(
        {
          id: "transition-title",
          type: "heading-inline",
          properties: {
            content: `Analisando suas respostas...`,
            level: "h2",
            textAlign: "center",
            color: "#432818",
          },
        },
        {
          id: "transition-text",
          type: "text-inline",
          properties: {
            text: "Estamos processando suas respostas para criar seu perfil personalizado.",
            fontSize: "1.125rem",
            alignment: "center",
            color: "#6B5B4E",
          },
        },
        {
          id: "continue-button",
          type: "button-inline",
          properties: {
            text: "Continuar",
            style: "primary",
            backgroundColor: "#B89B7A",
            textColor: "#FFFFFF",
          },
        }
      );
    } else if (step.type === "processing") {
      baseBlocks.push(
        {
          id: "processing-title",
          type: "heading-inline",
          properties: {
            content: "Calculando seu resultado...",
            level: "h2",
            textAlign: "center",
            color: "#432818",
          },
        },
        {
          id: "loading-progress",
          type: "quiz-progress",
          properties: {
            currentStep: step.order,
            totalSteps: 21,
            showNumbers: false,
            showPercentage: true,
            barColor: "#B89B7A",
            backgroundColor: "#E5E7EB",
            animated: true,
          },
        }
      );
    }

    return baseBlocks;
  };

  // Encontrar onde inserir as novas etapas
  const stepsArrayMatch = content.match(/steps: \[([\s\S]*?)\],\s*quizData:/);

  if (!stepsArrayMatch) {
    console.log("  ❌ Não foi possível encontrar o array de steps");
    return false;
  }

  let existingStepsContent = stepsArrayMatch[1];

  // Adicionar as etapas faltantes
  missingSteps.forEach(step => {
    const stepConfig = {
      ...step,
      blocks: generateStepBlocks(step),
    };

    const stepString = `,
    {
      id: "${stepConfig.id}",
      name: "${stepConfig.name}",
      description: "${stepConfig.description}",
      order: ${stepConfig.order},
      type: "${stepConfig.type}",${
        stepConfig.questionData
          ? `
      questionData: ${JSON.stringify(stepConfig.questionData, null, 8)},`
          : ""
      }
      blocks: ${JSON.stringify(stepConfig.blocks, null, 8)},
    }`;

    // Inserir antes da etapa 12 (análise parcial)
    if (stepConfig.order < 12) {
      const step12Index = existingStepsContent.indexOf('"step-12"');
      if (step12Index !== -1) {
        const insertIndex = existingStepsContent.lastIndexOf("},", step12Index);
        existingStepsContent =
          existingStepsContent.slice(0, insertIndex + 2) +
          stepString +
          existingStepsContent.slice(insertIndex + 2);
      }
    } else {
      // Inserir antes da etapa 19 (preparando resultado)
      const step19Index = existingStepsContent.indexOf('"step-19"');
      if (step19Index !== -1) {
        const insertIndex = existingStepsContent.lastIndexOf("},", step19Index);
        existingStepsContent =
          existingStepsContent.slice(0, insertIndex + 2) +
          stepString +
          existingStepsContent.slice(insertIndex + 2);
      }
    }

    console.log(`  ✅ Etapa ${stepConfig.order} (${stepConfig.name}) adicionada`);
  });

  // Atualizar quizData com as novas perguntas
  const newQuestions = missingSteps
    .filter(step => step.questionData && step.type === "question")
    .map(step => step.questionData);

  const newStrategicQuestions = missingSteps
    .filter(step => step.questionData && step.type === "strategic")
    .map(step => step.questionData);

  // Substituir o conteúdo
  const newContent = content.replace(
    /steps: \[([\s\S]*?)\],\s*quizData:/,
    `steps: [${existingStepsContent}],
  quizData:`
  );

  // Adicionar as novas perguntas ao quizData
  let finalContent = newContent;

  // Adicionar perguntas regulares
  if (newQuestions.length > 0) {
    newQuestions.forEach(question => {
      const questionString = `,
      ${JSON.stringify(question, null, 6)}`;

      const questionsArrayEnd = finalContent.indexOf("],\n    strategicQuestions:");
      if (questionsArrayEnd !== -1) {
        finalContent =
          finalContent.slice(0, questionsArrayEnd) +
          questionString +
          finalContent.slice(questionsArrayEnd);
      }
    });
  }

  // Adicionar perguntas estratégicas
  if (newStrategicQuestions.length > 0) {
    newStrategicQuestions.forEach(question => {
      const questionString = `,
      ${JSON.stringify(question, null, 6)}`;

      const strategicArrayEnd = finalContent.indexOf("],\n    styles:");
      if (strategicArrayEnd !== -1) {
        finalContent =
          finalContent.slice(0, strategicArrayEnd) +
          questionString +
          finalContent.slice(strategicArrayEnd);
      }
    });
  }

  // Atualizar metadata
  finalContent = finalContent.replace(/totalSteps: \d+/, "totalSteps: 21");

  fs.writeFileSync(configPath, finalContent);
  console.log("  ✅ Arquivo optimized21StepsFunnel.ts atualizado");

  return true;
}

function validateCompletion() {
  console.log("\n🔍 VALIDANDO COMPLETUDE DAS 21 ETAPAS...");

  const configPath = path.join(__dirname, "src/config/optimized21StepsFunnel.ts");
  const content = fs.readFileSync(configPath, "utf8");

  // Contar etapas
  const stepMatches = content.match(/"step-\d+"/g) || [];
  const uniqueSteps = [...new Set(stepMatches)];

  console.log(`  📊 Total de etapas encontradas: ${uniqueSteps.length}`);

  // Verificar se temos todas as 21 etapas
  const expectedSteps = Array.from({ length: 21 }, (_, i) => `"step-${i + 1}"`);
  const missingSteps = expectedSteps.filter(step => !uniqueSteps.includes(step));

  if (missingSteps.length === 0) {
    console.log("  ✅ Todas as 21 etapas estão presentes!");

    // Listar todas as etapas
    for (let i = 1; i <= 21; i++) {
      const stepPattern = new RegExp(`"step-${i}"[\\s\\S]*?name: "(.*?)"`, "g");
      const match = stepPattern.exec(content);
      if (match) {
        console.log(`    📋 Etapa ${i}: ${match[1]}`);
      }
    }

    return true;
  } else {
    console.log(`  ⚠️ Etapas faltando: ${missingSteps.join(", ")}`);
    return false;
  }
}

// ====================================================================
// 🚀 EXECUÇÃO PRINCIPAL
// ====================================================================

console.log("🔧 INICIANDO COMPLETAR DAS 21 ETAPAS");
console.log("=".repeat(80));

try {
  // Completar as etapas faltantes
  const success = completeOptimizedSteps();

  if (success) {
    // Validar se ficou completo
    const isComplete = validateCompletion();

    if (isComplete) {
      console.log("\n🎉 SUCESSO! 21 ETAPAS COMPLETADAS!");
      console.log("✅ Funil otimizado agora tem todas as etapas necessárias");
      console.log("✅ Configuração atualizada e validada");
      console.log("\n🔗 Próximos passos:");
      console.log("  1. Reiniciar o servidor (se necessário)");
      console.log("  2. Testar no browser: http://localhost:8081/editor-fixed");
      console.log("  3. Verificar navegação entre todas as 21 etapas");
    } else {
      console.log("\n⚠️ Algumas etapas ainda estão faltando");
    }
  } else {
    console.log("\n❌ Erro ao completar as etapas");
  }
} catch (error) {
  console.error("\n❌ ERRO:", error.message);
  console.error(error.stack);
  process.exit(1);
}
