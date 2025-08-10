// remove-duplicates.cjs
const fs = require("fs");

// Ler o arquivo
const filePath = "src/hooks/useUnifiedProperties.ts";
let content = fs.readFileSync(filePath, "utf8");

// Localizar e remover seções duplicadas específicas
const duplicatesToRemove = [
  // badge (segunda ocorrência)
  {
    start: 'case "badge":',
    end: 'case "cta":',
    startLine: 1918,
    description: "badge duplicado",
  },
  // cta (segunda ocorrência)
  {
    start: 'case "cta":',
    end: 'case "progress":',
    startLine: 1945,
    description: "cta duplicado",
  },
  // progress (segunda ocorrência)
  {
    start: 'case "progress":',
    end: 'case "stat":',
    startLine: 1979,
    description: "progress duplicado",
  },
  // stat (segunda ocorrência)
  {
    start: 'case "stat":',
    end: 'case "image-display-inline":',
    startLine: 2009,
    description: "stat duplicado",
  },
  // image-display-inline (segunda ocorrência)
  {
    start: 'case "image-display-inline":',
    end: 'case "pricing-card":',
    startLine: 2036,
    description: "image-display-inline duplicado",
  },
  // pricing-card (segunda ocorrência)
  {
    start: 'case "pricing-card":',
    end: 'case "quiz-progress":',
    startLine: 2081,
    description: "pricing-card duplicado",
  },
  // quiz-intro-header (segunda ocorrência)
  {
    start: 'case "quiz-intro-header":',
    end: 'case "form-input":',
    startLine: 2301,
    description: "quiz-intro-header duplicado",
  },
  // form-input (segunda ocorrência)
  {
    start: 'case "form-input":',
    end: 'case "legal-notice-inline":',
    startLine: 2354,
    description: "form-input duplicado",
  },
];

console.log("Removendo duplicatas...");

// Dividir em linhas para processamento
const lines = content.split("\n");

// Identificar seções duplicadas para remoção
const linesToRemove = new Set();

// Adicionar linhas específicas que sabemos serem duplicadas
const duplicateRanges = [
  [1917, 1944], // badge duplicado
  [1944, 1978], // cta duplicado
  [1978, 2008], // progress duplicado
  [2008, 2035], // stat duplicado
  [2035, 2080], // image-display-inline duplicado
  [2080, 2212], // pricing-card duplicado
  [2300, 2353], // quiz-intro-header duplicado
  [2353, 2413], // form-input duplicado
  [2412, 2472], // legal-notice-inline duplicado
  [2553, 2608], // options-grid duplicado
  [2632, 2706], // quiz-progress duplicado
  [2705, 2774], // quiz-results duplicado
  [2773, 2846], // style-results duplicado
  [2856, 2915], // final-step duplicado (se existir)
];

// Marcar linhas para remoção
duplicateRanges.forEach(([start, end]) => {
  for (let i = start - 1; i < end; i++) {
    // -1 porque array é 0-indexed
    if (i < lines.length) {
      linesToRemove.add(i);
    }
  }
});

// Filtrar linhas
const filteredLines = lines.filter((line, index) => !linesToRemove.has(index));

// Escrever o arquivo corrigido
const correctedContent = filteredLines.join("\n");
fs.writeFileSync(filePath, correctedContent, "utf8");

console.log(`Removidas ${linesToRemove.size} linhas duplicadas.`);
console.log("Arquivo corrigido!");
