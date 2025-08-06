#!/bin/bash

echo "🔍 ANÁLISE COMPLETA DE CONTROLES DE TAMANHO DOS CONTAINERS"
echo "=========================================================="

# Criar arquivo de análise detalhada
cat > ANALISE_CONTROLES_TAMANHO_COMPLETA.md << 'EOF'
# ANÁLISE COMPLETA DE CONTROLES DE TAMANHO DOS CONTAINERS

## 1. COMPONENTES COM CONTROLES RANGE EXISTENTES

### Width Controls (PropertyType.RANGE):
EOF

echo "📊 Analisando controles de width existentes..."

# Buscar todos os controles width RANGE
grep -n -A 3 -B 1 'key: ".*width.*"' src/hooks/useUnifiedProperties.ts | grep -A 5 -B 5 'PropertyType\.RANGE' | while IFS= read -r line; do
    if [[ $line == *"case"* ]]; then
        component=$(echo "$line" | grep -o 'case "[^"]*"' | sed 's/case "\([^"]*\)"/\1/')
        echo "- **$component**: width RANGE control" >> ANALISE_CONTROLES_TAMANHO_COMPLETA.md
    fi
done

echo "" >> ANALISE_CONTROLES_TAMANHO_COMPLETA.md
echo "### Height Controls (PropertyType.RANGE):" >> ANALISE_CONTROLES_TAMANHO_COMPLETA.md

echo "📊 Analisando controles de height existentes..."

# Buscar todos os controles height RANGE
grep -n -A 3 -B 1 'key: ".*height.*"' src/hooks/useUnifiedProperties.ts | grep -A 5 -B 5 'PropertyType\.RANGE' | while IFS= read -r line; do
    if [[ $line == *"case"* ]]; then
        component=$(echo "$line" | grep -o 'case "[^"]*"' | sed 's/case "\([^"]*\)"/\1/')
        echo "- **$component**: height RANGE control" >> ANALISE_CONTROLES_TAMANHO_COMPLETA.md
    fi
done

echo "" >> ANALISE_CONTROLES_TAMANHO_COMPLETA.md
echo "## 2. TODOS OS COMPONENTES REGISTRADOS" >> ANALISE_CONTROLES_TAMANHO_COMPLETA.md
echo "" >> ANALISE_CONTROLES_TAMANHO_COMPLETA.md

echo "📋 Extraindo componentes do registry..."

# Extrair componentes do registry
if [ -f "src/config/enhancedBlockRegistry.ts" ]; then
    grep -o '"[^"]*":[[:space:]]*[A-Z][A-Za-z]*' src/config/enhancedBlockRegistry.ts | while IFS= read -r line; do
        component_key=$(echo "$line" | cut -d'"' -f2)
        component_name=$(echo "$line" | sed 's/.*:[[:space:]]*//' | tr -d ',')
        echo "- **$component_key** → $component_name" >> ANALISE_CONTROLES_TAMANHO_COMPLETA.md
    done
fi

echo "" >> ANALISE_CONTROLES_TAMANHO_COMPLETA.md
echo "## 3. ANÁLISE DETALHADA POR COMPONENTE" >> ANALISE_CONTROLES_TAMANHO_COMPLETA.md
echo "" >> ANALISE_CONTROLES_TAMANHO_COMPLETA.md

echo "🔍 Analisando componente por componente..."

# Lista de componentes do registry para análise detalhada
if [ -f "src/config/enhancedBlockRegistry.ts" ]; then
    components=$(grep -o '"[^"]*":[[:space:]]*[A-Z][A-Za-z]*' src/config/enhancedBlockRegistry.ts | cut -d'"' -f2)
    
    for component in $components; do
        echo "### $component" >> ANALISE_CONTROLES_TAMANHO_COMPLETA.md
        
        # Verificar se tem case no useUnifiedProperties
        case_exists=$(grep -c "case \"$component\"" src/hooks/useUnifiedProperties.ts)
        
        if [ $case_exists -gt 0 ]; then
            # Verificar controles width
            width_range=$(grep -A 30 "case \"$component\"" src/hooks/useUnifiedProperties.ts | grep -c 'key: ".*width.*".*PropertyType\.RANGE')
            width_any=$(grep -A 30 "case \"$component\"" src/hooks/useUnifiedProperties.ts | grep -c 'key: ".*width.*"')
            
            # Verificar controles height  
            height_range=$(grep -A 30 "case \"$component\"" src/hooks/useUnifiedProperties.ts | grep -c 'key: ".*height.*".*PropertyType\.RANGE')
            height_any=$(grep -A 30 "case \"$component\"" src/hooks/useUnifiedProperties.ts | grep -c 'key: ".*height.*"')
            
            # Verificar outros controles de tamanho
            size_controls=$(grep -A 30 "case \"$component\"" src/hooks/useUnifiedProperties.ts | grep -c 'key: ".*size.*"')
            padding_controls=$(grep -A 30 "case \"$component\"" src/hooks/useUnifiedProperties.ts | grep -c 'key: ".*padding.*"')
            margin_controls=$(grep -A 30 "case \"$component\"" src/hooks/useUnifiedProperties.ts | grep -c 'key: ".*margin.*"')
            
            # Status do componente
            if [ $width_range -gt 0 ] && [ $height_range -gt 0 ]; then
                echo "**Status**: ✅ COMPLETO - width + height RANGE" >> ANALISE_CONTROLES_TAMANHO_COMPLETA.md
            elif [ $width_range -gt 0 ]; then
                echo "**Status**: ⚠️ PARCIAL - apenas width RANGE" >> ANALISE_CONTROLES_TAMANHO_COMPLETA.md
            elif [ $height_range -gt 0 ]; then
                echo "**Status**: ⚠️ PARCIAL - apenas height RANGE" >> ANALISE_CONTROLES_TAMANHO_COMPLETA.md
            elif [ $width_any -gt 0 ] || [ $height_any -gt 0 ]; then
                echo "**Status**: ⚠️ INCOMPLETO - tem width/height sem RANGE" >> ANALISE_CONTROLES_TAMANHO_COMPLETA.md
            else
                echo "**Status**: ❌ FALTANDO - sem controles de tamanho" >> ANALISE_CONTROLES_TAMANHO_COMPLETA.md
            fi
            
            # Detalhes dos controles
            echo "- Width RANGE: $width_range | Width total: $width_any" >> ANALISE_CONTROLES_TAMANHO_COMPLETA.md
            echo "- Height RANGE: $height_range | Height total: $height_any" >> ANALISE_CONTROLES_TAMANHO_COMPLETA.md
            echo "- Size controls: $size_controls" >> ANALISE_CONTROLES_TAMANHO_COMPLETA.md
            echo "- Padding controls: $padding_controls" >> ANALISE_CONTROLES_TAMANHO_COMPLETA.md
            echo "- Margin controls: $margin_controls" >> ANALISE_CONTROLES_TAMANHO_COMPLETA.md
            
        else
            echo "**Status**: ❌ SEM CONFIGURAÇÃO - não encontrado no useUnifiedProperties" >> ANALISE_CONTROLES_TAMANHO_COMPLETA.md
        fi
        
        echo "" >> ANALISE_CONTROLES_TAMANHO_COMPLETA.md
    done
fi

# Adicionar estatísticas finais
cat >> ANALISE_CONTROLES_TAMANHO_COMPLETA.md << 'EOF'

## 4. ESTATÍSTICAS GERAIS

EOF

# Contar estatísticas
total_components=$(grep -o '"[^"]*":[[:space:]]*[A-Z][A-Za-z]*' src/config/enhancedBlockRegistry.ts | wc -l)
width_range_count=$(grep -c 'key: ".*width.*".*PropertyType\.RANGE' src/hooks/useUnifiedProperties.ts)
height_range_count=$(grep -c 'key: ".*height.*".*PropertyType\.RANGE' src/hooks/useUnifiedProperties.ts)

echo "- **Total de componentes registrados**: $total_components" >> ANALISE_CONTROLES_TAMANHO_COMPLETA.md
echo "- **Componentes com width RANGE**: $width_range_count" >> ANALISE_CONTROLES_TAMANHO_COMPLETA.md  
echo "- **Componentes com height RANGE**: $height_range_count" >> ANALISE_CONTROLES_TAMANHO_COMPLETA.md

cat >> ANALISE_CONTROLES_TAMANHO_COMPLETA.md << 'EOF'

## 5. COMANDOS PARA IMPLEMENTAR CONTROLES FALTANTES

### Script para adicionar Width RANGE:
```bash
# Para cada componente sem width RANGE, adicionar:
# {
#   key: "width",
#   type: PropertyType.RANGE,
#   label: "Largura",
#   value: currentBlock?.properties?.width || 300,
#   min: 100,
#   max: 800,
#   step: 10,
#   unit: "px"
# }
```

### Script para adicionar Height RANGE:
```bash
# Para cada componente sem height RANGE, adicionar:
# {
#   key: "height",
#   type: PropertyType.RANGE,
#   label: "Altura", 
#   value: currentBlock?.properties?.height || 200,
#   min: 50,
#   max: 600,
#   step: 10,
#   unit: "px"
# }
```

EOF

echo "✅ Análise completa salva em ANALISE_CONTROLES_TAMANHO_COMPLETA.md"
echo ""
echo "📊 RESUMO EXECUTIVO:"
echo "==================="
echo "Total de componentes: $total_components"
echo "Width RANGE existentes: $width_range_count"  
echo "Height RANGE existentes: $height_range_count"
echo ""
echo "📄 Visualizando primeiras linhas da análise:"
head -30 ANALISE_CONTROLES_TAMANHO_COMPLETA.md
