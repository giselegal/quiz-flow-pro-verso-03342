#!/bin/bash

# 🔧 SCRIPT: CORREÇÃO COMPLETA DE IDS NAS STEPS 01-21
# Adiciona IDs únicos e consistentes para cada bloco em todos os templates

echo "🚀 INICIANDO CORREÇÃO DE IDS NAS STEPS 01-21..."

# Lista dos arquivos de template das Steps
STEP_FILES=(
  "src/components/steps/Step01Template.tsx"
  "src/components/steps/Step02Template.tsx"
  "src/components/steps/Step03Template.tsx"
  "src/components/steps/Step04Template.tsx"
  "src/components/steps/Step05Template.tsx"
  "src/components/steps/Step06Template.tsx"
  "src/components/steps/Step07Template.tsx"
  "src/components/steps/Step08Template.tsx"
  "src/components/steps/Step09Template.tsx"
  "src/components/steps/Step10Template.tsx"
  "src/components/steps/Step11Template.tsx"
  "src/components/steps/Step12Template.tsx"
  "src/components/steps/Step13Template.tsx"
  "src/components/steps/Step14Template.tsx"
  "src/components/steps/Step15Template.tsx"
  "src/components/steps/Step16Template.tsx"
  "src/components/steps/Step17Template.tsx"
  "src/components/steps/Step18Template.tsx"
  "src/components/steps/Step19Template.tsx"
  "src/components/steps/Step20Template.tsx"
  "src/components/steps/Step21Template.tsx"
)

echo "📊 ANÁLISE: Verificando estrutura atual dos templates..."

# Função para analisar um arquivo
analyze_step_file() {
  local file=$1
  local step_num=$(echo $file | grep -o 'Step[0-9]\+' | grep -o '[0-9]\+')
  
  echo "📝 Analisando Step${step_num}Template.tsx:"
  
  # Contar blocos sem ID
  local blocks_without_id=$(grep -c "type: \"" $file)
  local blocks_with_id=$(grep -c "id: \"" $file)
  
  echo "   - Blocos encontrados: $blocks_without_id"
  echo "   - Blocos com ID: $blocks_with_id"
  echo "   - Blocos sem ID: $((blocks_without_id - blocks_with_id))"
  
  # Listar tipos de bloco
  echo "   - Tipos de bloco encontrados:"
  grep "type: \"" $file | sed 's/.*type: "\([^"]*\)".*/     \1/' | sort | uniq -c
  echo ""
}

# Analisar todos os arquivos
for file in "${STEP_FILES[@]}"; do
  if [ -f "$file" ]; then
    analyze_step_file "$file"
  else
    echo "❌ ARQUIVO NÃO ENCONTRADO: $file"
  fi
done

echo "🎯 RESUMO DA ANÁLISE:"
echo "✅ Templates encontrados: $(find src/components/steps/ -name "Step*Template.tsx" | wc -l)"
echo "📋 Próximos passos: Adicionar IDs únicos para cada bloco"

echo "🔧 GERANDO EXEMPLOS DE IDs PADRÃO..."

# Exemplo de padrão de ID para Step01
echo "
📝 PADRÃO DE IDS SUGERIDO PARA STEP01:
- step01-header-logo
- step01-decorative-bar  
- step01-main-title
- step01-description-text
- step01-hero-image
- step01-motivation-text
- step01-name-input
- step01-cta-button
- step01-legal-notice

📝 PADRÃO DE IDS SUGERIDO PARA STEP02:
- step02-header-logo
- step02-question-title
- step02-question-counter
- step02-question-image
- step02-options-grid

📝 PADRÃO GERAL:
- step{XX}-{component-type}-{specific-name}
- Sempre lowercase e com hífens
- Máximo de 3 partes separadas por hífen
- ID único por step + tipo + função
"

echo "✅ ANÁLISE COMPLETA! Pronto para implementar correções."
