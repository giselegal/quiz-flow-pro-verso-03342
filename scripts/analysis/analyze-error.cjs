const fs = require('fs');
const path = require('path');

// Ler o arquivo
const filePath = path.join(__dirname, 'src/templates/quiz21StepsComplete.ts');
const fileContent = fs.readFileSync(filePath, 'utf8');

// Linha específica do erro relatado
const lineNumber = 895;

// Dividir o conteúdo em linhas
const lines = fileContent.split('\n');

// Mostrar contexto ao redor da linha com erro
console.log('Contexto do erro:');
for (let i = Math.max(0, lineNumber - 10); i < Math.min(lines.length, lineNumber + 10); i++) {
  const isErrorLine = i === lineNumber - 1;
  console.log(`${i + 1}${isErrorLine ? ' (ERROR)' : ''}:\t${lines[i]}`);
}

// Tentar localizar outras regiões similares no código para comparação
console.log('\n\nBuscando padrões similares para comparação:');
let pattern = lines[lineNumber - 1].trim();
const matches = [];

for (let i = 0; i < lines.length; i++) {
  if (i !== lineNumber - 1 && lines[i].trim() === pattern) {
    matches.push({ line: i + 1, context: lines.slice(Math.max(0, i - 5), i + 6).join('\n') });
  }
}

matches.forEach((match, idx) => {
  console.log(`\nOcorrência similar #${idx + 1} na linha ${match.line}:`);
  console.log(match.context);
});
