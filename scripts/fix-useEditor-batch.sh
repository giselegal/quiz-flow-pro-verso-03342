#!/bin/bash

# Script para corrigir automaticamente useEditor() em múltiplos arquivos
# Adiciona { optional: true } e guards para undefined

FILES=(
  "src/__tests__/editor_multistep_reorder_insert.test.tsx"
  "src/__tests__/editor_reorder_insert.test.tsx"
  "src/__tests__/quizeditorpro.integration.test.tsx"
  "src/components/admin/DatabaseControlPanel.tsx"
  "src/components/editor/modules/ModularResultEditor.tsx"
  "src/components/editor/EditorTelemetryPanel.tsx"
  "src/components/editor/Step20ComponentsButton.tsx"
  "src/components/editor/quiz/EditorQuizPreview.tsx"
  "src/components/editor/quiz/QuizConfigurationPanel.tsx"
  "src/components/editor/canvas/SortableBlockWrapper.tsx"
  "src/components/editor/result/ResultPageBuilder.tsx"
  "src/components/editor/header/EditableEditorHeader.tsx"
  "src/components/editor/Step20Debug.tsx"
  "src/components/editor/universal/components/UniversalPropertiesPanel.tsx"
  "src/components/editor/toolbar/EditorToolbar.tsx"
  "src/components/editor/toolbar/EditorToolbarUnified.tsx"
  "src/components/editor/properties/ModernPropertiesPanel.tsx"
  "src/components/editor/panels/OptimizedPropertiesPanel.tsx"
  "src/components/editor/funnel/FunnelStagesPanel.simple.tsx"
  "src/components/editor/unified/UnifiedQuizStepLoader.tsx"
)

echo "🔧 Corrigindo ${#FILES[@]} arquivos com useEditor()..."

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  📝 Processando: $file"
    
    # Backup
    cp "$file" "$file.backup"
    
    # Substituir padrão: const { X } = useEditor();
    # Por: const editorContext = useEditor({ optional: true }); if (!editorContext) return null; const { X } = editorContext;
    
    sed -i.tmp 's/const { \(.*\) } = useEditor();/const editorContext = useEditor({ optional: true });\n  if (!editorContext) return null;\n  const { \1 } = editorContext;/g' "$file"
    
    rm -f "$file.tmp"
    
    echo "    ✅ Corrigido"
  else
    echo "    ⚠️  Não encontrado: $file"
  fi
done

echo ""
echo "✅ Correção concluída para ${#FILES[@]} arquivos"
echo "💡 Backups salvos com extensão .backup"
echo "🧪 Execute: npm run type-check"
