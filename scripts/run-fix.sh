#!/bin/bash

echo "🚀 Executando correção de erros TypeScript..."

# Tornar o script executável
chmod +x scripts/fix-ts-errors.js

# Executar o script
node scripts/fix-ts-errors.js

echo "✅ Correção concluída!"
echo "🎯 Agora o projeto deve funcionar sem erros de build."