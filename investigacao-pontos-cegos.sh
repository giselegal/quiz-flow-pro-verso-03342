#!/bin/bash

echo "🔍 INVESTIGAÇÃO COMPLETA DOS PONTOS CEGOS DO SISTEMA"
echo "==============================================="

echo "📁 1. VERIFICANDO ESTRUTURA DE ARQUIVOS:"
echo "-------------------------------------------"

# Verificar se todos os 21 templates existem
echo "🔢 Templates das etapas:"
for i in {1..21}; do
    if [ -f "src/components/steps/Step$(printf "%02d" $i)Template.tsx" ]; then
        echo "  ✅ Step$(printf "%02d" $i)Template.tsx"
    else
        echo "  ❌ Step$(printf "%02d" $i)Template.tsx - AUSENTE"
    fi
done

echo ""
echo "🔗 2. VERIFICANDO MAPEAMENTOS:"
echo "-------------------------------------------"

# Verificar se o mapeamento está correto
echo "📋 STEP_TEMPLATES_MAPPING:"
if grep -q "STEP_TEMPLATES_MAPPING" src/config/stepTemplatesMapping.ts; then
    echo "  ✅ STEP_TEMPLATES_MAPPING definido"
    
    # Contar quantas etapas estão mapeadas
    mapped_steps=$(grep -o '[0-9]*:' src/config/stepTemplatesMapping.ts | grep -v '//' | wc -l)
    echo "  📊 Etapas mapeadas: $mapped_steps/21"
    
    if [ "$mapped_steps" -eq 21 ]; then
        echo "  ✅ Todas as 21 etapas mapeadas"
    else
        echo "  ⚠️ Inconsistência: $mapped_steps etapas mapeadas de 21 esperadas"
    fi
else
    echo "  ❌ STEP_TEMPLATES_MAPPING não encontrado"
fi

echo ""
echo "🌐 3. VERIFICANDO ROTAS:"
echo "-------------------------------------------"

echo "📍 Rotas individuais de steps:"
if grep -q "step\d+-" src/App.tsx; then
    echo "  ⚠️ Rotas individuais encontradas (pode ser problema)"
    grep "step\d+-" src/App.tsx | head -5
else
    echo "  ✅ Sem rotas individuais conflitantes"
fi

echo "📍 Rota principal do editor:"
if grep -q "editor-fixed" src/App.tsx; then
    echo "  ✅ Rota /editor-fixed encontrada"
else
    echo "  ❌ Rota /editor-fixed não encontrada"
fi

echo ""
echo "🔧 4. VERIFICANDO REGISTROS DE COMPONENTES:"
echo "-------------------------------------------"

echo "🧩 enhancedBlockRegistry:"
if grep -q "options-grid.*QuizOptionsGridBlock" src/config/enhancedBlockRegistry.ts; then
    echo "  ✅ options-grid → QuizOptionsGridBlock mapeado"
else
    echo "  ❌ options-grid não mapeado corretamente"
fi

if grep -q "quiz-intro-header" src/config/enhancedBlockRegistry.ts; then
    echo "  ✅ quiz-intro-header mapeado"
else
    echo "  ❌ quiz-intro-header não mapeado"
fi

if grep -q "text-inline" src/config/enhancedBlockRegistry.ts; then
    echo "  ✅ text-inline mapeado"
else
    echo "  ❌ text-inline não mapeado"
fi

echo ""
echo "📊 5. VERIFICANDO STEP02 ESPECÍFICO:"
echo "-------------------------------------------"

echo "🎯 Step02 Template:"
if grep -q "step02-clothing-options" src/components/steps/Step02Template.tsx; then
    echo "  ✅ step02-clothing-options ID encontrado"
    
    # Verificar se tem o tipo correto
    if grep -A 5 "step02-clothing-options" src/components/steps/Step02Template.tsx | grep -q 'type: "options-grid"'; then
        echo "  ✅ tipo options-grid correto"
    else
        echo "  ❌ tipo options-grid não encontrado"
    fi
    
    # Verificar se tem opções
    options_count=$(grep -A 300 "step02-clothing-options" src/components/steps/Step02Template.tsx | grep "id: \"[0-9]" | wc -l)
    echo "  📊 Opções encontradas: $options_count"
    
    if [ "$options_count" -ge 8 ]; then
        echo "  ✅ Quantidade adequada de opções"
    else
        echo "  ⚠️ Poucas opções encontradas"
    fi
    
else
    echo "  ❌ step02-clothing-options ID não encontrado"
fi

echo ""
echo "🚀 6. VERIFICANDO CONTEXTO E PROVIDERS:"
echo "-------------------------------------------"

echo "🌐 EditorContext:"
if grep -q "EditorProvider" src/App.tsx; then
    echo "  ✅ EditorProvider configurado no App.tsx"
else
    echo "  ❌ EditorProvider não encontrado no App.tsx"
fi

if grep -q "getStepTemplate" src/context/EditorContext.tsx; then
    echo "  ✅ getStepTemplate usado no EditorContext"
else
    echo "  ❌ getStepTemplate não usado no EditorContext"
fi

echo ""
echo "⚡ 7. VERIFICANDO BUILDS E ERROS:"
echo "-------------------------------------------"

echo "🔨 Verificando se há erros de TypeScript:"
if command -v npx >/dev/null 2>&1; then
    echo "  🔍 Executando verificação rápida..."
    cd /workspaces/quiz-quest-challenge-verse
    
    # Verificar apenas os arquivos críticos
    npx tsc --noEmit --skipLibCheck src/components/steps/Step02Template.tsx 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "  ✅ Step02Template.tsx sem erros de TypeScript"
    else
        echo "  ⚠️ Step02Template.tsx com possíveis erros de TypeScript"
    fi
    
    npx tsc --noEmit --skipLibCheck src/config/stepTemplatesMapping.ts 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "  ✅ stepTemplatesMapping.ts sem erros de TypeScript"
    else
        echo "  ⚠️ stepTemplatesMapping.ts com possíveis erros de TypeScript"
    fi
    
else
    echo "  ⚠️ npx não disponível para verificação de TypeScript"
fi

echo ""
echo "🎯 RESUMO DOS PONTOS CEGOS ENCONTRADOS:"
echo "======================================="

# Resumo dos problemas críticos
problems=0

# 1. Verificar rota fantasma
if curl -s http://localhost:8083/step02-clothing-options | grep -q "<!DOCTYPE html>"; then
    echo "❌ PROBLEMA CRÍTICO: Rota fantasma /step02-clothing-options existe e retorna HTML"
    echo "   Isso pode estar causando conflito com o sistema de templates"
    problems=$((problems + 1))
else
    echo "✅ Sem rota fantasma conflitante"
fi

# 2. Verificar se o mapeamento está completo
mapped_steps_final=$(grep -o '[0-9]*:' src/config/stepTemplatesMapping.ts | grep -v '//' | wc -l)
if [ "$mapped_steps_final" -ne 21 ]; then
    echo "❌ PROBLEMA: Mapeamento incompleto ($mapped_steps_final/21 etapas)"
    problems=$((problems + 1))
fi

# 3. Verificar se todas as importações estão corretas
if ! grep -q "import.*getStep02Template.*Step02Template" src/config/stepTemplatesMapping.ts; then
    echo "❌ PROBLEMA: Import do Step02Template pode estar incorreto"
    problems=$((problems + 1))
fi

if [ "$problems" -eq 0 ]; then
    echo "🎉 ESTRUTURA APARENTEMENTE CORRETA - Investigar problemas de runtime"
    echo ""
    echo "🔍 PRÓXIMOS PASSOS RECOMENDADOS:"
    echo "1. Verificar logs do navegador em /quiz-builder"
    echo "2. Verificar se as propriedades estão sendo passadas corretamente"
    echo "3. Investigar timing de inicialização do EditorContext"
else
    echo "⚠️ $problems PROBLEMA(S) CRÍTICO(S) ENCONTRADO(S)"
fi

echo ""
echo "🏁 INVESTIGAÇÃO CONCLUÍDA"
