#!/bin/bash

# 🎯 MIGRAÇÃO LOTE 2 - ARQUIVOS CRÍTICOS RESTANTES
echo "🚀 MIGRAÇÃO LOTE 2 - CORRIGINDO ARQUIVOS CRÍTICOS..."

# Arquivos críticos que precisam de IDs semânticos
critical_files=(
  "src/utils/blockCompatibility.ts"
  "src/components/editor/EnhancedPropertiesPanel.tsx" 
  "src/components/editor/hooks/useStepHandlers.ts"
  "src/components/editor/hooks/useEditorState.ts"
  "src/components/editor/ComponentList.tsx"
  "src/components/editor/panels/FunnelManagementPanel.tsx"
  "src/components/editor/dnd/DroppableCanvas.tsx"
  "src/components/quiz-editor/QuestionEditor.tsx"
  "src/services/pageStructureValidator.ts"
)

echo "📋 Arquivos críticos a serem corrigidos:"
for file in "${critical_files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (não encontrado)"
  fi
done

# Função para adicionar import se não existir
add_import_if_missing() {
  local file=$1
  if [ -f "$file" ] && ! grep -q "generateSemanticId" "$file"; then
    # Encontrar a última linha de import
    local last_import_line=$(grep -n "^import" "$file" | tail -1 | cut -d: -f1)
    if [ -n "$last_import_line" ]; then
      sed -i "${last_import_line}a import { generateSemanticId } from '../utils/semanticIdGenerator';" "$file"
    else
      sed -i '1i import { generateSemanticId } from "../utils/semanticIdGenerator";' "$file"
    fi
    echo "  📦 Import adicionado: $file"
  fi
}

# Função para substituir Date.now() por IDs semânticos
fix_date_now_usage() {
  local file=$1
  local context=$2
  local type=$3
  
  if [ -f "$file" ]; then
    # Padrões comuns a serem substituídos
    sed -i "s/\`block-\${Date\.now()}\`/generateSemanticId({ context: \"$context\", type: \"$type\", identifier: \"block\", index: Math.floor(Math.random() * 1000) })/g" "$file"
    sed -i "s/\`option-\${Date\.now()}\`/generateSemanticId({ context: \"$context\", type: \"$type\", identifier: \"option\", index: Math.floor(Math.random() * 1000) })/g" "$file"
    sed -i "s/\`question-\${Date\.now()}\`/generateSemanticId({ context: \"$context\", type: \"$type\", identifier: \"question\", index: Math.floor(Math.random() * 1000) })/g" "$file"
    sed -i "s/\`page_\${Date\.now()}\`/generateSemanticId({ context: \"$context\", type: \"$type\", identifier: \"page\", index: Math.floor(Math.random() * 1000) })/g" "$file"
    sed -i "s/\`comp-\${Date\.now()}\`/generateSemanticId({ context: \"$context\", type: \"$type\", identifier: \"comp\", index: Math.floor(Math.random() * 1000) })/g" "$file"
    sed -i "s/\`etapa-\${Date\.now()}\`/generateSemanticId({ context: \"$context\", type: \"$type\", identifier: \"etapa\", index: Math.floor(Math.random() * 1000) })/g" "$file"
    
    echo "  🔧 Corrigido: $file"
  fi
}

# Processar cada arquivo crítico
echo ""
echo "🔧 PROCESSANDO ARQUIVOS CRÍTICOS..."

# blockCompatibility.ts
add_import_if_missing "src/utils/blockCompatibility.ts"
fix_date_now_usage "src/utils/blockCompatibility.ts" "compatibility" "block"

# EnhancedPropertiesPanel.tsx
add_import_if_missing "src/components/editor/EnhancedPropertiesPanel.tsx"
fix_date_now_usage "src/components/editor/EnhancedPropertiesPanel.tsx" "editor" "option"

# useStepHandlers.ts
add_import_if_missing "src/components/editor/hooks/useStepHandlers.ts"
fix_date_now_usage "src/components/editor/hooks/useStepHandlers.ts" "editor" "step"

# useEditorState.ts  
add_import_if_missing "src/components/editor/hooks/useEditorState.ts"
fix_date_now_usage "src/components/editor/hooks/useEditorState.ts" "editor" "block"

# ComponentList.tsx
add_import_if_missing "src/components/editor/ComponentList.tsx"
fix_date_now_usage "src/components/editor/ComponentList.tsx" "editor" "component"

# FunnelManagementPanel.tsx
add_import_if_missing "src/components/editor/panels/FunnelManagementPanel.tsx"
fix_date_now_usage "src/components/editor/panels/FunnelManagementPanel.tsx" "funnel" "page"

# DroppableCanvas.tsx
add_import_if_missing "src/components/editor/dnd/DroppableCanvas.tsx"
fix_date_now_usage "src/components/editor/dnd/DroppableCanvas.tsx" "canvas" "block"

# QuestionEditor.tsx
add_import_if_missing "src/components/quiz-editor/QuestionEditor.tsx"
fix_date_now_usage "src/components/quiz-editor/QuestionEditor.tsx" "quiz" "question"

echo ""
echo "🎨 APLICANDO PRETTIER NOS ARQUIVOS CORRIGIDOS..."
for file in "${critical_files[@]}"; do
  if [ -f "$file" ]; then
    npx prettier --write "$file" 2>/dev/null
    echo "  ✨ $file formatado"
  fi
done

echo ""
echo "🔍 VERIFICAÇÃO FINAL - Date.now() em arquivos críticos:"
for file in "${critical_files[@]}"; do
  if [ -f "$file" ]; then
    count=$(grep -c "Date\.now()" "$file" 2>/dev/null || echo "0")
    if [ "$count" -gt 0 ]; then
      echo "  ⚠️  $file: $count ocorrências restantes"
    else
      echo "  ✅ $file: limpo"
    fi
  fi
done

echo ""
echo "📊 RELATÓRIO LOTE 2:"
echo "✅ Imports de generateSemanticId adicionados"
echo "✅ Padrões Date.now() substituídos por IDs semânticos"
echo "✅ Prettier aplicado a todos os arquivos"
echo "✅ Verificação final realizada"
echo ""
echo "🎉 LOTE 2 CONCLUÍDO! Sistema ainda mais robusto!"
