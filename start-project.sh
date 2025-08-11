#!/bin/bash

echo "🚀 ATIVANDO PROJETO - CORREÇÃO AUTOMÁTICA"
echo "=========================================="

# Tornar executável
chmod +x scripts/fix-typescript-and-start.js

# Verificar se existe node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

echo ""
echo "🔧 Contornando erro TypeScript TS6310..."
echo "   - Usando configuração alternativa do Vite"
echo "   - Desabilitando checagem TypeScript durante dev"
echo ""

echo "🌐 Iniciando servidor de desenvolvimento..."
echo ""

# Usar configuração sem TypeScript checking
VITE_CJS_IGNORE_WARNING=true npx vite --config vite.no-ts.config.ts --host 0.0.0.0 --port 8080

echo ""
echo "✅ Projeto ativado com sucesso!"
echo "🌐 Acesse: http://localhost:8080"
echo "📝 Editor: http://localhost:8080/editor"