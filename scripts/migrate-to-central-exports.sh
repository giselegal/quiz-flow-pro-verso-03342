#!/bin/bash

# Script para migrar imports para usar exports centralizados
# Prioridade: useEditor, useEditorAdapter, services principais

set -e

echo "🔄 Migrando imports para src/core/exports/index.ts..."

# Função para substituir imports
replace_imports() {
  local pattern=$1
  local replacement=$2
  local description=$3
  
  echo ""
  echo "📝 $description"
  
  # Find e replace usando sed
  find src -type f \( -name "*.ts" -o -name "*.tsx" \) \
    ! -path "*/node_modules/*" \
    ! -path "*/__tests__/*" \
    ! -path "*/core/exports/*" \
    -exec grep -l "$pattern" {} \; | while read -r file; do
    
    # Backup
    cp "$file" "$file.bak"
    
    # Replace
    sed -i "s|$pattern|$replacement|g" "$file"
    
    # Verify change
    if ! diff -q "$file" "$file.bak" > /dev/null 2>&1; then
      echo "  ✅ $file"
      rm "$file.bak"
    else
      # Revert if no change
      mv "$file.bak" "$file"
    fi
  done
}

# 1. Migrar useEditor
echo ""
echo "=== Fase 1: Migrando useEditor ==="
replace_imports \
  "import { useEditor } from '@/hooks/useEditor'" \
  "import { useEditor } from '@/core/exports'" \
  "useEditor de @/hooks/useEditor"

replace_imports \
  "import { useEditor } from '@/contexts/editor/EditorContext'" \
  "import { useEditorContext as useEditor } from '@/core/exports'" \
  "useEditor de @/contexts/editor/EditorContext"

# 2. Migrar useEditorAdapter
echo ""
echo "=== Fase 2: Migrando useEditorAdapter ==="
replace_imports \
  "import { useEditorAdapter } from '@/hooks/useEditorAdapter'" \
  "import { useEditorAdapter } from '@/core/exports'" \
  "useEditorAdapter de @/hooks/useEditorAdapter"

replace_imports \
  "import { useEditorAdapter } from '@/hooks/editor/useEditorAdapter'" \
  "import { useEditorAdapter } from '@/core/exports'" \
  "useEditorAdapter de @/hooks/editor/useEditorAdapter"

# 3. Migrar stores
echo ""
echo "=== Fase 3: Migrando stores ==="
replace_imports \
  "import { useQuizStore } from '@/store/quiz/useQuizStore'" \
  "import { useQuizStore } from '@/core/exports'" \
  "useQuizStore"

replace_imports \
  "import { useEditorStore } from '@/store/editorStore'" \
  "import { useEditorStore } from '@/core/exports'" \
  "useEditorStore"

# 4. Verificar compilação
echo ""
echo "=== Verificando compilação ==="
npm run typecheck || {
  echo "❌ Erros de compilação detectados"
  echo "Revise os arquivos modificados"
  exit 1
}

echo ""
echo "✅ Migração concluída com sucesso!"
echo ""
echo "📊 Estatísticas:"
find src -name "*.bak" 2>/dev/null | wc -l | xargs echo "  Arquivos modificados:"
echo ""
echo "💡 Próximos passos:"
echo "  1. Revisar mudanças: git diff"
echo "  2. Testar aplicação: npm run dev"
echo "  3. Commitar: git add . && git commit -m 'refactor: consolidate imports to central exports'"
