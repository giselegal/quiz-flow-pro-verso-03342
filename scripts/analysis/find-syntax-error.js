const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/templates/quiz21StepsComplete.ts');
const fileContent = fs.readFileSync(filePath, 'utf8');

const lines = fileContent.split('\n');

// Verificar cada linha
for (let i = 890; i < 900; i++) {
  console.log(`Line ${i + 1}: ${lines[i]}`);
}

// Procurar por possíveis problemas de sintaxe
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Verificar se tem vírgula após um objeto
  if (line.includes('maxSelections:')) {
    console.log(`Encontrado 'maxSelections:' na linha ${i + 1}: ${line}`);
    console.log(`Linha anterior: ${lines[i - 1]}`);
    console.log(`Próxima linha: ${lines[i + 1]}`);
  }
}
