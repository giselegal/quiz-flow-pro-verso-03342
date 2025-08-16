#!/bin/bash

# 🔍 AUDITORIA COMPLETA DE COMPONENTES - ENCONTRAR PONTOS CEGOS

echo "🔍 INICIANDO AUDITORIA COMPLETA DE COMPONENTES..."
echo "=================================================="

# 1. ENCONTRAR TODOS OS COMPONENTES TSX/TS NO PROJETO
echo ""
echo "📁 1. MAPEANDO TODOS OS COMPONENTES..."
find /workspaces/quiz-quest-challenge-verse/src -name "*.tsx" -o -name "*.ts" | grep -E "(component|block|panel|editor)" | sort > /tmp/all_components.txt

echo "   Total de arquivos encontrados: $(wc -l < /tmp/all_components.txt)"
echo ""

# 2. ANALISAR CORES ANTIGAS EM TODOS OS COMPONENTES
echo "🎨 2. ANALISANDO CORES NÃO-BRAND..."
echo ""

# Buscar cores azuis
echo "   🔵 CORES AZUIS (devem ser cores da marca):"
grep -r "bg-blue-\|text-blue-\|border-blue-" /workspaces/quiz-quest-challenge-verse/src --include="*.tsx" --include="*.ts" | grep -v "backup" | wc -l
echo "      Instâncias encontradas: $(grep -r "bg-blue-\|text-blue-\|border-blue-" /workspaces/quiz-quest-challenge-verse/src --include="*.tsx" --include="*.ts" | grep -v backup | wc -l)"

# Buscar cores amarelas
echo "   🟡 CORES AMARELAS (devem ser neutras):"
grep -r "bg-yellow-\|text-yellow-\|border-yellow-" /workspaces/quiz-quest-challenge-verse/src --include="*.tsx" --include="*.ts" | grep -v backup | wc -l
echo "      Instâncias encontradas: $(grep -r "bg-yellow-\|text-yellow-\|border-yellow-" /workspaces/quiz-quest-challenge-verse/src --include="*.tsx" --include="*.ts" | grep -v backup | wc -l)"

# Buscar cores laranjas
echo "   🟠 CORES LARANJAS (devem ser cores da marca):"
grep -r "bg-orange-\|text-orange-\|border-orange-" /workspaces/quiz-quest-challenge-verse/src --include="*.tsx" --include="*.ts" | grep -v backup | wc -l
echo "      Instâncias encontradas: $(grep -r "bg-orange-\|text-orange-\|border-orange-" /workspaces/quiz-quest-challenge-verse/src --include="*.tsx" --include="*.ts" | grep -v backup | wc -l)"

# Buscar cores roxas
echo "   🟣 CORES ROXAS (devem ser cores da marca):"
grep -r "bg-purple-\|text-purple-\|border-purple-\|bg-indigo-\|text-indigo-" /workspaces/quiz-quest-challenge-verse/src --include="*.tsx" --include="*.ts" | grep -v backup | wc -l
echo "      Instâncias encontradas: $(grep -r "bg-purple-\|text-purple-\|border-purple-\|bg-indigo-\|text-indigo-" /workspaces/quiz-quest-challenge-verse/src --include="*.tsx" --include="*.ts" | grep -v backup | wc -l)"

echo ""

# 3. VERIFICAR PAINÉIS DE PROPRIEDADES
echo "🎛️ 3. ANALISANDO PAINÉIS DE PROPRIEDADES..."
echo ""

# Listar todos os painéis existentes
echo "   📋 PAINÉIS ENCONTRADOS:"
find /workspaces/quiz-quest-challenge-verse/src -name "*[Pp]roperties*" -o -name "*[Pp]anel*" | grep -E "\.tsx?$" | while read file; do
    echo "      • $(basename $file) - $(wc -l < "$file") linhas"
done

echo ""

# Verificar qual painel está sendo usado em cada editor
echo "   🔍 USO DE PAINÉIS POR EDITOR:"
for editor in "editor.tsx" "editor-fixed.tsx" "enhanced-editor.tsx" "QuizEditor.tsx"; do
    if [ -f "/workspaces/quiz-quest-challenge-verse/src/pages/$editor" ]; then
        panel=$(grep -o "[A-Za-z]*PropertiesPanel\|[A-Za-z]*PropertyPanel" "/workspaces/quiz-quest-challenge-verse/src/pages/$editor" | head -1)
        echo "      • $editor → ${panel:-'NENHUM PAINEL'}"
    elif [ -f "/workspaces/quiz-quest-challenge-verse/src/components/$editor" ]; then
        panel=$(grep -o "[A-Za-z]*PropertiesPanel\|[A-Za-z]*PropertyPanel" "/workspaces/quiz-quest-challenge-verse/src/components/$editor" | head -1)
        echo "      • $editor → ${panel:-'NENHUM PAINEL'}"
    fi
done

echo ""

# 4. VERIFICAR COMPONENTES SEM PADRONIZAÇÃO
echo "🔧 4. COMPONENTES SEM PADRONIZAÇÃO..."
echo ""

# Verificar componentes que não importam brandColors
echo "   ❌ COMPONENTES SEM IMPORT DE BRAND COLORS:"
find /workspaces/quiz-quest-challenge-verse/src/components -name "*.tsx" | while read file; do
    if ! grep -q "brandColors\|BRAND_COLORS" "$file" 2>/dev/null; then
        if grep -q "className.*bg-\|className.*text-\|className.*border-" "$file" 2>/dev/null; then
            echo "      • $(basename $file)"
        fi
    fi
done | head -10

echo ""

# 5. COMPONENTES COM PROBLEMAS CRÍTICOS
echo "🚨 5. PROBLEMAS CRÍTICOS ENCONTRADOS..."
echo ""

# Verificar componentes com props incorretas
echo "   ⚠️  COMPONENTES COM INTERFACES INCOMPATÍVEIS:"
grep -r "selectedBlock\|selectedBlockId" /workspaces/quiz-quest-challenge-verse/src/components --include="*.tsx" | grep -v backup | cut -d: -f1 | sort | uniq | while read file; do
    if [ -f "$file" ]; then
        echo "      • $(basename $file) - Interface pode estar incompatível"
    fi
done | head -5

echo ""

# 6. ESTATÍSTICAS GERAIS
echo "📊 6. ESTATÍSTICAS GERAIS..."
echo ""

total_components=$(find /workspaces/quiz-quest-challenge-verse/src/components -name "*.tsx" | wc -l)
components_with_brand=$(grep -r "B89B7A\|D4C2A8\|432818" /workspaces/quiz-quest-challenge-verse/src/components --include="*.tsx" | cut -d: -f1 | sort | uniq | wc -l)
percentage=$((components_with_brand * 100 / total_components))

echo "   📈 COMPONENTES TOTAIS: $total_components"
echo "   ✅ COM CORES DA MARCA: $components_with_brand"
echo "   📊 PERCENTUAL ATUALIZADO: $percentage%"
echo ""

# 7. GERAR LISTA DE AÇÃO
echo "🎯 7. LISTA DE AÇÃO PRIORITÁRIA..."
echo ""

echo "   🔥 AÇÕES IMEDIATAS NECESSÁRIAS:"
echo "      1. Padronizar interfaces de painéis de propriedades"
echo "      2. Aplicar cores da marca nos $(( total_components - components_with_brand )) componentes restantes"
echo "      3. Criar hook/API unificada para propriedades"
echo "      4. Implementar sistema de validação automática"
echo ""

echo "✅ AUDITORIA COMPLETA FINALIZADA!"
echo ""
echo "📋 PRÓXIMOS PASSOS SUGERIDOS:"
echo "   1. Executar script de padronização automática"
echo "   2. Criar sistema de hook unificado"
echo "   3. Implementar validação de componentes"
echo "   4. Configurar CI/CD para manter padrões"
