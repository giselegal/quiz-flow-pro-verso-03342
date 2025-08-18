#!/bin/bash

echo "🔍 TESTE REAL - Verificando se o problema foi resolvido"
echo "=================================================="

# 1. Verificar se não há erros de compilação
echo "1️⃣ Verificando erros de TypeScript..."
cd /workspaces/quiz-quest-challenge-verse
npx tsc --noEmit 2>&1 | head -10

echo ""
echo "2️⃣ Verificando estrutura de arquivos críticos..."

# 2. Verificar se os arquivos existem
echo "✅ quiz21StepsComplete.ts existe:" $(test -f src/templates/quiz21StepsComplete.ts && echo "SIM" || echo "NÃO")
echo "✅ stepTemplatesMapping.ts existe:" $(test -f src/config/stepTemplatesMapping.ts && echo "SIM" || echo "NÃO")
echo "✅ Quiz21StepsProvider.tsx existe:" $(test -f src/components/quiz/Quiz21StepsProvider.tsx && echo "SIM" || echo "NÃO")
echo "✅ FunnelsContext.tsx existe:" $(test -f src/context/FunnelsContext.tsx && echo "SIM" || echo "NÃO")

echo ""
echo "3️⃣ Verificando conteúdo crítico..."

# 3. Verificar se totalSteps foi corrigido
echo "📊 totalSteps no Quiz21StepsProvider:"
grep -n "totalSteps.*=" src/components/quiz/Quiz21StepsProvider.tsx || echo "❌ Não encontrado"

echo ""
echo "📊 QUIZ_QUESTIONS_COMPLETE keys:"
grep -A5 "QUIZ_QUESTIONS_COMPLETE.*=" src/templates/quiz21StepsComplete.ts | head -5

echo ""
echo "📊 useFunnels no Quiz21StepsProvider:"
grep -n "useFunnels" src/components/quiz/Quiz21StepsProvider.tsx || echo "❌ Não encontrado"

echo ""
echo "4️⃣ Verificando se servidor está respondendo..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/ || echo "❌ Servidor não responde"

echo ""
echo "🎯 RESULTADO: Se tudo acima mostra '✅' e não há erros, o problema PODE estar resolvido."
echo "🔍 PRÓXIMO PASSO: Abrir http://localhost:8080/editor e verificar console do navegador."
