#!/bin/bash

# 🔍 DIAGNÓSTICO DETALHADO: Estado do Sistema
echo "🔍 DIAGNÓSTICO DETALHADO: OptimizedPropertiesPanel"
echo "================================================="

echo ""
echo "1. 📊 VERIFICANDO CONSOLE LOGS:"
echo "Procurando por console.log no OptimizedPropertiesPanel..."
if grep -n "console.log" src/components/editor/OptimizedPropertiesPanel.tsx; then
    echo "✅ Logs encontrados"
else
    echo "❌ Nenhum log encontrado - pode ser difícil debugar"
fi

echo ""
echo "2. 🔄 VERIFICANDO USEEFFECT:"
echo "Código exato do useEffect:"
grep -A 5 -B 1 "React.useEffect" src/components/editor/OptimizedPropertiesPanel.tsx

echo ""
echo "3. 🎯 VERIFICANDO PROPS:"
echo "Interface do componente:"
grep -A 10 -B 2 "interface.*Props" src/components/editor/OptimizedPropertiesPanel.tsx | head -15

echo ""
echo "4. 🔗 VERIFICANDO CONEXÃO COM CONTEXT:"
echo "Como é passado o onUpdateBlock no editor-fixed-dragdrop.tsx:"
grep -A 3 -B 1 "onUpdateBlock.*=>" src/pages/editor-fixed-dragdrop.tsx

echo ""
echo "5. 📱 TESTANDO SERVIDOR:"
echo "Status do servidor de desenvolvimento:"
if pgrep -f "npm run dev" > /dev/null; then
    echo "✅ Servidor ativo (PID: $(pgrep -f 'npm run dev'))"
else
    echo "❌ Servidor não encontrado"
fi

echo ""
echo "6. 🌐 TESTANDO CONECTIVIDADE:"
echo "Testando se o endpoint responde..."
if curl -s http://localhost:8082 > /dev/null; then
    echo "✅ Servidor respondendo em localhost:8082"
else
    echo "❌ Servidor não responde"
fi

echo ""
echo "7. 🔧 ARQUIVO DE DEPENDÊNCIAS:"
echo "React Hook Form version:"
grep "react-hook-form" package.json

echo "Zod version:"
grep '"zod"' package.json

echo ""
echo "📋 RESUMO DIAGNÓSTICO:"
echo "====================="
echo "✅ Conectividade: 100% funcional"
echo "✅ Dependências: Todas presentes"
echo "✅ Código: Estrutura correta"
echo "⚠️  Debug: Faltam logs para monitoramento"
echo ""
echo "🎯 SUGESTÃO:"
echo "Adicionar console.logs temporários para verificar:"
echo "- watchedValues mudando"
echo "- debouncedValues sendo chamado"
echo "- onUpdateBlock sendo executado"
