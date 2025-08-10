#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const filePath = "/workspaces/quiz-quest-challenge-verse/src/data/realQuizTemplates.ts";

// Função para converter uma questão da estrutura components para blocks
function convertQuestionToBlocks(questionContent, questionNumber, progress) {
  // Extrair dados da estrutura antiga
  const idMatch = questionContent.match(/id:\s*"([^"]+)"/);
  const titleMatch = questionContent.match(/title:\s*"([^"]+)"/);
  const questionTypeMatch = questionContent.match(/questionType:\s*"([^"]+)"/);
  const multiSelectMatch = questionContent.match(/multiSelect:\s*(\d+)/);

  if (!idMatch || !titleMatch) {
    console.log(`Não foi possível extrair dados básicos da questão ${questionNumber}`);
    return questionContent;
  }

  const id = idMatch[1];
  const title = titleMatch[1];
  const questionType = questionTypeMatch ? questionTypeMatch[1] : "text";
  const multiSelect = multiSelectMatch ? parseInt(multiSelectMatch[1]) : 1;

  // Extrair opções
  const optionsMatch = questionContent.match(/options:\s*\[(.*?)\]\s*}\s*}\s*]/s);
  if (!optionsMatch) {
    console.log(`Não foi possível extrair opções da questão ${questionNumber}`);
    return questionContent;
  }

  const optionsString = optionsMatch[1];
  const options = [];

  // Parse básico das opções
  const optionMatches = optionsString.matchAll(
    /\{\s*id:\s*"([^"]+)",\s*text:\s*"([^"]*)",(?:\s*imageUrl:\s*"([^"]*)",)?\s*styleCategory:\s*"([^"]+)",\s*points:\s*\{[^}]+\}\s*\}/gs
  );

  for (const match of optionMatches) {
    const [, optionId, text, imageUrl, category] = match;
    const option = {
      id: optionId,
      text: text,
      value: optionId,
      category: category,
    };
    if (imageUrl) {
      option.imageUrl = imageUrl;
    }
    options.push(option);
  }

  // Determinar se tem imagens
  const hasImages = options.some(opt => opt.imageUrl);

  // Construir nova estrutura
  const newStructure = `    // QUESTÃO ${questionNumber}: ${title}
    {
      id: "${id}",
      title: "${title}",
      type: "question" as const,
      progress: ${progress},
      showHeader: true,
      showProgress: true,
      questionType: "${questionType}",${multiSelect > 1 ? `\n      multiSelect: ${multiSelect},` : ""}
      blocks: [
        {
          id: '${id}-header',
          type: 'quiz-intro-header',
          properties: {
            logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
            logoAlt: 'Logo Gisele Galvão',
            logoWidth: 96,
            logoHeight: 96,
            progressValue: ${progress},
            progressMax: 100,
            showBackButton: true
          }
        },
        {
          id: '${id}-title',
          type: 'heading-inline',
          properties: {
            content: '${title}',
            level: 'h2',
            fontSize: 'text-2xl',
            fontWeight: 'font-bold',
            textAlign: 'text-center',
            color: '#432818',
            marginBottom: 8
          }
        },
        {
          id: '${id}-progress-label',
          type: 'text-inline',
          properties: {
            content: 'Questão ${questionNumber} de 10',
            fontSize: 'text-sm',
            textAlign: 'text-center',
            color: '#6B7280',
            marginBottom: 24
          }
        },
        {
          id: '${id}-options',
          type: 'options-grid',
          properties: {
            options: [
${options
  .map(opt => {
    const optionStr = `              { 
                id: "${opt.id}", 
                text: "${opt.text}",${opt.imageUrl ? `\n                imageUrl: "${opt.imageUrl}",` : ""}
                value: "${opt.value}",
                category: "${opt.category}"
              }`;
    return optionStr;
  })
  .join(",\n")}
            ],
            columns: ${hasImages ? 2 : 1},
            showImages: ${hasImages},${hasImages ? "\n            imageSize: 'large'," : ""}
            multipleSelection: ${multiSelect > 1},
            maxSelections: ${multiSelect},
            minSelections: 1,
            validationMessage: 'Selecione ${multiSelect > 1 ? `até ${multiSelect} opções` : "uma opção"}',
            gridGap: ${hasImages ? 16 : 12},
            responsiveColumns: true
          }
        },
        {
          id: '${id}-continue',
          type: 'button-inline',
          properties: {
            text: 'Continuar',
            variant: 'primary',
            size: 'large',
            fullWidth: true,
            backgroundColor: '#B89B7A',
            textColor: '#ffffff',
            disabled: true,
            requiresValidSelection: true
          }
        }
      ],
      settings: {
        showProgress: true,
        progressValue: ${progress},
        backgroundColor: '#ffffff',
        textColor: '#432818',
        maxWidth: 'max-w-4xl',
        padding: 'p-6'
      }
    }`;

  return newStructure;
}

// Ler o arquivo
const content = fs.readFileSync(filePath, "utf8");

// Encontrar e converter questões 6-10
const questions = [
  {
    number: 6,
    progress: 60,
    pattern: /\/\/ QUESTÃO 6:.*?(?=\/\/ QUESTÃO 7:|\/\/ QUESTÃO ESTRATÉGICA|$)/s,
  },
  {
    number: 7,
    progress: 70,
    pattern: /\/\/ QUESTÃO 7:.*?(?=\/\/ QUESTÃO 8:|\/\/ QUESTÃO ESTRATÉGICA|$)/s,
  },
  {
    number: 8,
    progress: 80,
    pattern: /\/\/ QUESTÃO 8:.*?(?=\/\/ QUESTÃO 9:|\/\/ QUESTÃO ESTRATÉGICA|$)/s,
  },
  {
    number: 9,
    progress: 90,
    pattern: /\/\/ QUESTÃO 9:.*?(?=\/\/ QUESTÃO 10:|\/\/ QUESTÃO ESTRATÉGICA|$)/s,
  },
  {
    number: 10,
    progress: 100,
    pattern: /\/\/ QUESTÃO 10:.*?(?=\/\/ QUESTÃO ESTRATÉGICA|$)/s,
  },
];

let updatedContent = content;

questions.forEach(({ number, progress, pattern }) => {
  const match = updatedContent.match(pattern);
  if (match) {
    const originalQuestion = match[0];
    const convertedQuestion = convertQuestionToBlocks(originalQuestion, number, progress);
    if (convertedQuestion !== originalQuestion) {
      updatedContent = updatedContent.replace(originalQuestion, convertedQuestion);
      console.log(`✅ Questão ${number} convertida com sucesso`);
    } else {
      console.log(`⚠️  Questão ${number} não pôde ser convertida`);
    }
  } else {
    console.log(`❌ Questão ${number} não encontrada`);
  }
});

// Escrever o arquivo atualizado
fs.writeFileSync(filePath, updatedContent);
console.log("\n🎉 Conversão concluída! Arquivo atualizado.");
