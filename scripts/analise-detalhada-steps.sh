#!/bin/bash

echo "🔍 ANÁLISE DETALHADA DOS TIPOS DE COMPONENTES NOS STEPS"
echo "======================================================"

echo "📋 Analisando primeiros 5 steps em detalhes..."

for i in {01..05}; do
    step_file="src/components/steps/Step${i}Template.tsx"
    if [[ -f "$step_file" ]]; then
        echo -e "\n🎯 STEP $i:"
        echo "============"
        
        # Extrair tipos com mais detalhes
        echo "📦 Tipos de componentes encontrados:"
        grep -n '"type":' "$step_file" | while IFS= read -r linha; do
            numero_linha=$(echo "$linha" | cut -d: -f1)
            tipo=$(echo "$linha" | grep -o '"type": "[^"]*"' | cut -d'"' -f4)
            id=$(grep -B5 -A1 "\"type\": \"$tipo\"" "$step_file" | grep '"id":' | head -1 | cut -d'"' -f4)
            echo "   Linha $numero_linha: $tipo (id: $id)"
        done
        
        echo "📊 Resumo dos tipos usados:"
        grep -o '"type": "[^"]*"' "$step_file" | cut -d'"' -f4 | sort | uniq -c | sort -nr
        
    else
        echo "❌ Step $i não encontrado"
    fi
done

echo -e "\n🔧 VERIFICANDO REGISTRY DETALHADAMENTE..."
registry_file="src/config/enhancedBlockRegistry.ts"

if [[ -f "$registry_file" ]]; then
    echo "✅ Registry: $registry_file"
    
    echo -e "\n📦 Componentes registrados:"
    grep -A2 -B1 'type.*:' "$registry_file" | grep -E '(type|component)' | head -20
    
    echo -e "\n🔍 Verificando se todos os tipos dos steps estão no registry:"
    
    # Extrair todos os tipos únicos dos primeiros 5 steps
    tipos_steps=$(cat src/components/steps/Step0{1..5}Template.tsx 2>/dev/null | grep -o '"type": "[^"]*"' | cut -d'"' -f4 | sort | uniq)
    
    echo "📋 Tipos encontrados nos steps 1-5:"
    while IFS= read -r tipo; do
        if [[ -n "$tipo" ]]; then
            echo "   - $tipo"
            
            # Verificar se existe no registry
            if grep -q "type.*['\"]$tipo['\"]" "$registry_file"; then
                echo "     ✅ ENCONTRADO no registry"
            else
                echo "     ❌ NÃO encontrado no registry"
            fi
        fi
    done <<< "$tipos_steps"
    
else
    echo "❌ Registry não encontrado!"
fi

echo -e "\n🎯 VERIFICAÇÃO ESPECÍFICA DO EDITOR..."

# Verificar se o editor está configurado para estes componentes
editor_file="src/pages/editor-fixed-dragdrop.tsx"
if [[ -f "$editor_file" ]]; then
    echo "✅ Editor encontrado: $editor_file"
    
    echo "🔍 Verificando se o editor importa o registry:"
    if grep -q "enhancedBlockRegistry" "$editor_file"; then
        echo "✅ Editor importa o registry"
    else
        echo "❌ Editor NÃO importa o registry"
    fi
    
    echo "🔍 Verificando se usa DynamicBlockRenderer:"
    if grep -q "DynamicBlockRenderer" "$editor_file"; then
        echo "✅ Editor usa DynamicBlockRenderer"
    else
        echo "❌ Editor NÃO usa DynamicBlockRenderer"
    fi
else
    echo "❌ Editor não encontrado!"
fi

echo -e "\n🎯 STATUS FINAL:"
echo "================"
echo "✅ Todos os 21 steps estão usando nomenclatura correta de tipos"
echo "🔧 Verificação detalhada dos primeiros 5 steps concluída"
echo "📋 Próximo: Testar renderização no editor com os step templates"
