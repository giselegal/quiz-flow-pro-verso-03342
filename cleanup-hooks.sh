#!/bin/bash

# 🧹 SCRIPT DE LIMPEZA DE HOOKS DUPLICADOS

echo "🔍 Analisando hooks duplicados..."

# Remover hooks duplicados óbvios
echo "🗑️ Removendo duplicatas diretas..."

# Mobile hooks - manter apenas o .ts
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/use-mobile.tsx

# Editor hooks duplicados - manter apenas useEditor.ts principal
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useSchemaEditor.ts
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useSchemaEditorFixed.ts  
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useSchemaEditorSimple.ts
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useLiveEditor.ts
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useSimpleEditor.ts
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useSupabaseEditor.ts
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useResultPageEditor.ts
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useSalesPageEditor.ts
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useUnifiedEditor.ts

# Quiz hooks duplicados - manter apenas os essenciais
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useQuizStages.enhanced.ts
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useQuizHooks.ts
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useQuizComponents.ts
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useTypeformQuizBuilder.ts

# DynamicEditorData duplicados
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useDynamicEditorData.tsx

# Outros duplicados/obsoletos
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useAutosave.ts # Manter useAutoSaveDebounce.ts
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useBlocks.ts # Funcionalidade no useEditor.ts
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useBuilderContent.ts
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useCanvasConfiguration.ts
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useFunnelData.ts
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useFunnelManager.ts
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useGlobalStyles.ts
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useHistory.ts # Manter usePropertyHistory.ts
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useInlineBlock.ts
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useInlineEdit.ts
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useLoadingState.ts
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/usePageConfig.ts
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useQuestionScroll.ts
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useResultPageConfig.ts
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useScrollTracking.ts
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useStandardConfig.ts
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useStandardDesign.ts
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useTransformation.ts
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useUniversalNavigation.tsx
rm -f /workspaces/quiz-quest-challenge-verse/src/hooks/useVersionManager.ts

echo "✅ Hooks duplicados removidos!"

# Contar hooks restantes
REMAINING=$(find /workspaces/quiz-quest-challenge-verse/src/hooks/ -name "*.ts" -o -name "*.tsx" | wc -l)
echo "📊 Hooks restantes: $REMAINING"

echo "🎯 Consolidação concluída!"
