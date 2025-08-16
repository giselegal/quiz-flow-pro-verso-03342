#!/bin/bash

echo "🔍 ANÁLISE DE CONTROLES DE TAMANHO DOS CONTAINERS - COMPONENTES"
echo "================================================================"

# Criar arquivo de análise
cat > ANALISE_CONTROLES_TAMANHO.md << 'EOF'
# ANÁLISE DE CONTROLES DE TAMANHO DOS CONTAINERS

## Componentes com Controles de Width/Height RANGE Existentes

EOF

# Função para analisar componentes
analyze_size_controls() {
    echo "## 1. COMPONENTES COM CONTROLES WIDTH" >> ANALISE_CONTROLES_TAMANHO.md
    echo "### Barras deslizantes já configuradas:" >> ANALISE_CONTROLES_TAMANHO.md
    echo "" >> ANALISE_CONTROLES_TAMANHO.md
    
    # Buscar controles de width no useUnifiedProperties
    grep -n -A 10 -B 5 "width.*PropertyType\.RANGE" src/hooks/useUnifiedProperties.ts | while read line; do
        if [[ $line == *"case"* ]]; then
            component=$(echo "$line" | sed 's/.*case "\([^"]*\)".*/\1/')
            echo "- **$component**: width com RANGE" >> ANALISE_CONTROLES_TAMANHO.md
        fi
    done
    
    echo "" >> ANALISE_CONTROLES_TAMANHO.md
    echo "## 2. COMPONENTES COM CONTROLES HEIGHT" >> ANALISE_CONTROLES_TAMANHO.md
    echo "### Barras deslizantes já configuradas:" >> ANALISE_CONTROLES_TAMANHO.md
    echo "" >> ANALISE_CONTROLES_TAMANHO.md
    
    # Buscar controles de height no useUnifiedProperties
    grep -n -A 10 -B 5 "height.*PropertyType\.RANGE" src/hooks/useUnifiedProperties.ts | while read line; do
        if [[ $line == *"case"* ]]; then
            component=$(echo "$line" | sed 's/.*case "\([^"]*\)".*/\1/')
            echo "- **$component**: height com RANGE" >> ANALISE_CONTROLES_TAMANHO.md
        fi
    done
}

# Função para listar todos os componentes registrados
list_all_components() {
    echo "" >> ANALISE_CONTROLES_TAMANHO.md
    echo "## 3. TODOS OS COMPONENTES REGISTRADOS" >> ANALISE_CONTROLES_TAMANHO.md
    echo "### Lista completa do enhancedBlockRegistry:" >> ANALISE_CONTROLES_TAMANHO.md
    echo "" >> ANALISE_CONTROLES_TAMANHO.md
    
    # Extrair nomes dos componentes do registry
    grep -o '"[^"]*": [A-Z][A-Za-z]*' src/lib/enhancedBlockRegistry.ts | while read line; do
        component_key=$(echo "$line" | cut -d'"' -f2)
        component_name=$(echo "$line" | awk '{print $2}')
        echo "- **$component_key** → $component_name" >> ANALISE_CONTROLES_TAMANHO.md
    done
}

# Função para identificar gaps (componentes sem controles)
identify_gaps() {
    echo "" >> ANALISE_CONTROLES_TAMANHO.md
    echo "## 4. COMPONENTES SEM CONTROLES DE TAMANHO" >> ANALISE_CONTROLES_TAMANHO.md
    echo "### Identificados automaticamente:" >> ANALISE_CONTROLES_TAMANHO.md
    echo "" >> ANALISE_CONTROLES_TAMANHO.md
    
    # Buscar componentes sem propriedades width/height RANGE
    while read component; do
        component_key=$(echo "$component" | cut -d'"' -f2)
        
        # Verificar se tem controles width ou height
        has_width=$(grep -A 30 "case \"$component_key\"" src/hooks/useUnifiedProperties.ts | grep -c "width.*PropertyType\.RANGE")
        has_height=$(grep -A 30 "case \"$component_key\"" src/hooks/useUnifiedProperties.ts | grep -c "height.*PropertyType\.RANGE")
        
        if [[ $has_width -eq 0 && $has_height -eq 0 ]]; then
            echo "- **$component_key**: ❌ SEM controles de width/height" >> ANALISE_CONTROLES_TAMANHO.md
        elif [[ $has_width -eq 0 ]]; then
            echo "- **$component_key**: ⚠️ SEM controle de width" >> ANALISE_CONTROLES_TAMANHO.md
        elif [[ $has_height -eq 0 ]]; then
            echo "- **$component_key**: ⚠️ SEM controle de height" >> ANALISE_CONTROLES_TAMANHO.md
        else
            echo "- **$component_key**: ✅ Com controles width + height" >> ANALISE_CONTROLES_TAMANHO.md
        fi
    done < <(grep -o '"[^"]*": [A-Z][A-Za-z]*' src/lib/enhancedBlockRegistry.ts)
}

# Executar análises
echo "📊 Analisando controles de width..."
analyze_size_controls

echo "📋 Listando todos os componentes..."
list_all_components

echo "🔍 Identificando gaps..."
identify_gaps

# Adicionar sumário final
cat >> ANALISE_CONTROLES_TAMANHO.md << 'EOF'

## 5. SUMÁRIO E RECOMENDAÇÕES

### Estatísticas:
- Total de componentes registrados: X
- Componentes com width RANGE: Y
- Componentes com height RANGE: Z
- Componentes sem controles: W

### Próximos Passos:
1. Implementar PropertyType.RANGE para width nos componentes marcados com ❌ ou ⚠️
2. Implementar PropertyType.RANGE para height nos componentes marcados com ❌ ou ⚠️
3. Testar todos os controles de tamanho no painel de propriedades
4. Verificar se os componentes aplicam corretamente as propriedades de tamanho

### Template para Implementação:
```typescript
{
  key: "width",
  type: PropertyType.RANGE,
  label: "Largura",
  value: currentBlock?.properties?.width || 300,
  min: 100,
  max: 800,
  step: 10,
  unit: "px"
},
{
  key: "height", 
  type: PropertyType.RANGE,
  label: "Altura",
  value: currentBlock?.properties?.height || 200,
  min: 50,
  max: 600,
  step: 10,
  unit: "px"
}
```

EOF

echo "✅ Análise completa salva em ANALISE_CONTROLES_TAMANHO.md"
echo ""
echo "📄 Visualizando resumo:"
echo "========================"
head -50 ANALISE_CONTROLES_TAMANHO.md
