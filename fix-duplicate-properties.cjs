const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/correctQuizQuestions.ts');

console.log('🔧 Corrigindo propriedades duplicadas no correctQuizQuestions.ts...');

let content = fs.readFileSync(filePath, 'utf8');

// Corrigir propriedades text duplicadas
content = content.replace(/text: "([^"]*)",\s*text: "([^"]*)",/g, 'text: "$2",');

// Corrigir outras possíveis duplicações
content = content.replace(/(\w+): "([^"]*)",\s*\1: "([^"]*)",/g, '$1: "$3",');

fs.writeFileSync(filePath, content);

console.log('✅ Propriedades duplicadas corrigidas!');
