#!/bin/bash
# Script para corrigir blocos faltando properties ou content no embedded.ts

FILE="/workspaces/quiz-flow-pro-verso-03342/src/templates/embedded.ts"

# Backup
cp "$FILE" "$FILE.backup"

# Adicionar properties: {} vazio após content quando não existe
# Adicionar content: {} vazio após order quando não existe properties

node << 'EOF'
const fs = require('fs');
const file = '/workspaces/quiz-flow-pro-verso-03342/src/templates/embedded.ts';
let content = fs.readFileSync(file, 'utf8');

// Regex para encontrar blocos com content mas sem properties
// Padrão: "content": {...}, seguido por } (fim do bloco) sem "properties"
content = content.replace(
  /("content":\s*\{[^}]*\}),(\s*\})/g,
  '$1,$2\n      "properties": {}'
);

// Regex para encontrar blocos com properties mas sem content
// Padrão: "order": N, seguido diretamente por "properties" sem "content"
content = content.replace(
  /("order":\s*\d+),(\s*)"properties"/g,
  '$1,\n      "content": {},$2"properties"'
);

fs.writeFileSync(file, content);
console.log('✅ Arquivo corrigido!');
EOF

echo "✅ Correções aplicadas ao embedded.ts"
