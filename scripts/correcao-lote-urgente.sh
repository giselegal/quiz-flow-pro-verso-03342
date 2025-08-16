#!/bin/bash

echo "🚨 CORREÇÃO EM LOTE URGENTE - REMOVENDO TODAS AS REFERÊNCIAS INVÁLIDAS"
echo "======================================================================="

cd /workspaces/quiz-quest-challenge-verse

echo "🔧 1. Removendo todos os 'export default Step' dos templates..."
find src/components/steps/ -name "Step*Template.tsx" -exec sed -i '/export default Step/d' {} \;

echo "🔧 2. Removendo linhas vazias extras no final dos arquivos..."
find src/components/steps/ -name "Step*Template.tsx" -exec sed -i -e :a -e '/^\s*$/N; ba; s/\n\s*$/\n/' {} \;

echo "🔧 3. Garantindo que todos terminam apenas com };"
for file in src/components/steps/Step*Template.tsx; do
    if [ -f "$file" ]; then
        # Se a última linha não for }; adicionar
        if ! tail -1 "$file" | grep -q "^};$"; then
            # Remover linhas vazias do final
            sed -i -e :a -e '/^\s*$/N; ba; s/\n\s*$/\n/' "$file"
            # Se não termina com }; adicionar
            if ! tail -1 "$file" | grep -q "};"; then
                echo "};" >> "$file"
            fi
        fi
    fi
done

echo "🔧 4. Removendo imports React desnecessários..."
for file in src/components/steps/Step*Template.tsx; do
    if [ -f "$file" ]; then
        # Se tem import React mas não usa React. ou JSX, remover
        if grep -q "^import React" "$file" && ! grep -q "React\.\|<.*>" "$file"; then
            sed -i '/^import React/d' "$file"
        fi
    fi
done

echo "🔧 5. Removendo imports de hooks desnecessários..."
find src/components/steps/ -name "Step*Template.tsx" -exec sed -i '/import.*useContainerProperties\|import.*useDebounce\|import.*usePerformanceOptimization/d' {} \;

echo ""
echo "✅ VERIFICAÇÃO FINAL:"
echo "===================="

problems=0
for i in {01..21}; do
    file="src/components/steps/Step${i}Template.tsx"
    if [ -f "$file" ]; then
        # Verificar se tem export default inválido
        if grep -q "export default Step" "$file"; then
            echo "❌ $file ainda tem export default inválido"
            problems=$((problems + 1))
        fi
        
        # Verificar se tem função getStepTemplate
        if ! grep -q "export const getStep.*Template" "$file"; then
            echo "❌ $file não tem função getStepTemplate"
            problems=$((problems + 1))
        fi
        
        # Verificar se termina corretamente
        if ! tail -1 "$file" | grep -q "^};$"; then
            echo "❌ $file não termina corretamente"
            problems=$((problems + 1))
        fi
        
        # Contar linhas para detectar arquivos muito pequenos
        lines=$(wc -l < "$file")
        if [ "$lines" -lt 10 ]; then
            echo "⚠️ $file parece muito pequeno ($lines linhas)"
            problems=$((problems + 1))
        fi
    else
        echo "❌ $file não existe"
        problems=$((problems + 1))
    fi
done

echo ""
if [ "$problems" -eq 0 ]; then
    echo "🎉 TODOS OS 21 TEMPLATES CORRIGIDOS COM SUCESSO!"
    echo ""
    echo "📋 Executando build de teste..."
    npm run build
else
    echo "⚠️ $problems problemas encontrados"
fi

echo "🏁 CORREÇÃO EM LOTE CONCLUÍDA"
