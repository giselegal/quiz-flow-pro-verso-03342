#!/bin/bash
# 🔧 Script de diagnóstico e correção do erro React módulo
# Erro: Cannot read properties of undefined (reading 'exports')

echo "🔍 Diagnóstico do problema React..."
echo ""

# 1. Verificar versão do React
echo "📦 Versão do React instalada:"
npm list react react-dom --depth=0
echo ""

# 2. Verificar múltiplas instalações do React
echo "🔎 Procurando por múltiplas versões do React:"
REACT_DIRS=$(find node_modules -name "react" -type d -maxdepth 3 | grep -v "node_modules/@" | wc -l)
echo "Encontradas $REACT_DIRS instalações do React"
echo ""

# 3. Limpar cache do Vite e builds anteriores
echo "🧹 Limpando cache do Vite e builds..."
rm -rf node_modules/.vite
rm -rf dist
rm -rf .vite
echo "✅ Cache limpo"
echo ""

# 4. Verificar se há package-lock.json
if [ -f "package-lock.json" ]; then
    echo "📋 package-lock.json encontrado"
else
    echo "⚠️ package-lock.json não encontrado - pode causar inconsistências"
fi
echo ""

# 5. Reinstalar dependências do React
echo "🔄 Reinstalando React e React-DOM..."
npm uninstall react react-dom
npm install react@18.3.1 react-dom@18.3.1 --save-exact
echo "✅ React reinstalado"
echo ""

# 6. Verificar dedupe
echo "🔧 Executando dedupe para garantir versão única..."
npm dedupe
echo "✅ Dedupe executado"
echo ""

# 7. Testar build
echo "🏗️ Testando build do Vite..."
npm run build 2>&1 | head -20
BUILD_EXIT_CODE=${PIPESTATUS[0]}
echo ""

if [ $BUILD_EXIT_CODE -eq 0 ]; then
    echo "✅ Build executado com sucesso!"
else
    echo "❌ Build falhou - verificar logs acima"
fi
echo ""

# 8. Resumo
echo "📊 Resumo do diagnóstico:"
echo "   - Cache limpo: ✅"
echo "   - React reinstalado: ✅"
echo "   - Dedupe executado: ✅"
if [ $BUILD_EXIT_CODE -eq 0 ]; then
    echo "   - Build: ✅"
else
    echo "   - Build: ❌"
fi
echo ""

# 9. Próximos passos
echo "🚀 Próximos passos:"
echo "   1. Reinicie o servidor dev: npm run dev"
echo "   2. Limpe o cache do navegador (Ctrl+Shift+Del)"
echo "   3. Verifique o console do navegador para erros"
echo ""
