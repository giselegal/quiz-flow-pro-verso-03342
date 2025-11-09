import fs from 'fs';

// Ler o arquivo TypeScript
const content = fs.readFileSync('./src/templates/quiz21StepsComplete.ts', 'utf8');

// Encontrar o início da exportação do template
const templateStart = content.indexOf('export const QUIZ_STYLE_21_STEPS_TEMPLATE: Record<string, Block[]> = IS_TEST ? MINIMAL_TEST_TEMPLATE : {');
const dataStart = content.indexOf('{', templateStart);

// Encontrar o final (último });
let braceCount = 0;
let dataEnd = dataStart;
for (let i = dataStart; i < content.length; i++) {
  if (content[i] === '{') braceCount++;
  if (content[i] === '}') braceCount--;
  if (braceCount === 0) {
    dataEnd = i + 1;
    break;
  }
}

// Extrair apenas a parte de dados
const templateData = content.substring(dataStart, dataEnd);

// Mostrar informações básicas
console.log('📦 ESTRUTURA DO TEMPLATE quiz21StepsComplete.ts:\n');

// Contar as etapas
const stepMatches = templateData.match(/'step-\d+'/g) || [];
const uniqueSteps = [...new Set(stepMatches)];
console.log(`🎯 Total de etapas: ${uniqueSteps.length}`);
console.log(`📋 Etapas encontradas: ${uniqueSteps.sort().join(', ')}\n`);

// Extrair informação de cada etapa
uniqueSteps.sort().forEach(step => {
  const stepNum = step.replace(/[']/g, '');
  const stepRegex = new RegExp(`${step}:\\s*\\[(.*?)(?=\\s*'step-|\\s*}\\s*;)`, 's');
  const match = templateData.match(stepRegex);
  
  if (match) {
    const stepContent = match[1];
    // Contar blocos (procurar por objetos com id)
    const blockMatches = stepContent.match(/{\s*id:\s*['"][^'"]*['"]/g) || [];
    console.log(`${stepNum}: ${blockMatches.length} blocos`);
    
    // Extrair IDs dos blocos
    const ids = blockMatches.map(match => {
      const idMatch = match.match(/id:\s*['"]([^'"]*)['"]/);
      return idMatch ? idMatch[1] : 'unknown';
    });
    console.log(`   IDs: ${ids.join(', ')}`);
    
    // Extrair tipos dos blocos
    const typeMatches = stepContent.match(/type:\s*['"][^'"]*['"]/g) || [];
    const types = typeMatches.map(match => {
      const typeMatch = match.match(/type:\s*['"]([^'"]*)['"]/);
      return typeMatch ? typeMatch[1] : 'unknown';
    });
    console.log(`   Tipos: ${[...new Set(types)].join(', ')}\n`);
  }
});

console.log('🔍 EXEMPLO - ESTRUTURA DA ETAPA 1:');
const step1Regex = /'step-1':\s*\[(.*?)(?=\s*'step-2'|\s*})/s;
const step1Match = templateData.match(step1Regex);
if (step1Match) {
  const step1Data = step1Match[1];
  console.log('```json');
  // Tentar converter para JSON (simplificado)
  try {
    // Remover comentários
    const cleaned = step1Data.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    console.log('Step-1 tem aproximadamente', cleaned.split('{').length - 1, 'objetos');
  } catch (e) {
    console.log('Conteúdo muito complexo para parsing automático');
  }
  console.log('```\n');
}

