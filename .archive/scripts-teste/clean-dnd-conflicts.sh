#!/bin/bash
# 🧹 LIMPEZA CIRÚRGICA - EDITORES CONFLITANTES
# Remove apenas editores que conflitam com DnD

echo "🧹 REMOVENDO EDITORES CONFLITANTES COM DND..."

# 1. Editores principais conflitantes
rm -f src/components/editor/QuizEditorPro.tsx
rm -f src/components/editor/EditorUnified.tsx  
rm -f src/components/editor/EditorUnifiedV2.tsx
rm -f src/components/editor/EditorPro-WORKING.tsx

# 2. Editores experimentais/teste
rm -f src/components/editor/EnhancedEditor.tsx
rm -f src/components/editor/AdvancedEditor.tsx
rm -f src/components/editor/ImprovedEditor.tsx
rm -f src/components/editor/SimpleEditorTest.tsx

# 3. Canvas duplicados com DnD
rm -f src/components/editor/EditorCanvas_new.tsx
rm -f src/components/editor/components/EditorCanvas.tsx

# 4. Verificar se algum ainda tem DndContext
echo "🔍 VERIFICANDO DndContext RESTANTES..."
grep -r "DndContext" src/components/editor/ | grep -v EditorPro.tsx | head -5

echo "✅ LIMPEZA CONCLUÍDA"
