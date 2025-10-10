#!/bin/bash

echo "�� Migrando contexts para estrutura organizada..."

# AUTH
cp src/context/AuthContext.tsx src/contexts/auth/
cp src/context/AdminAuthContext.tsx src/contexts/auth/ 2>/dev/null

# EDITOR
cp src/context/EditorContext.tsx src/contexts/editor/ 2>/dev/null
cp src/context/EditorDndContext.tsx src/contexts/editor/ 2>/dev/null
cp src/context/EditorQuizContext.tsx src/contexts/editor/ 2>/dev/null
cp src/context/EditorRuntimeProviders.tsx src/contexts/editor/ 2>/dev/null

# FUNNEL
cp src/context/FunnelsContext.tsx src/contexts/funnel/ 2>/dev/null
cp src/context/UnifiedFunnelContext.tsx src/contexts/funnel/ 2>/dev/null
cp src/context/UnifiedFunnelContextRefactored.tsx src/contexts/funnel/ 2>/dev/null

# QUIZ
cp src/context/QuizContext.tsx src/contexts/quiz/ 2>/dev/null
cp src/context/QuizFlowProvider.tsx src/contexts/quiz/ 2>/dev/null

# UI
cp src/context/PreviewContext.tsx src/contexts/ui/ 2>/dev/null
cp src/context/ScrollSyncContext.tsx src/contexts/ui/ 2>/dev/null

# DATA
cp src/context/UnifiedCRUDProvider.tsx src/contexts/data/
cp src/context/UserDataContext.tsx src/contexts/data/ 2>/dev/null
cp src/context/StepsContext.tsx src/contexts/data/ 2>/dev/null

# VALIDATION
cp src/context/ValidationContext.tsx src/contexts/validation/ 2>/dev/null

# CONFIG
cp src/context/UnifiedConfigContext.tsx src/contexts/config/ 2>/dev/null

# Copiar index.ts
cp src/context/index.ts src/contexts/ 2>/dev/null

echo "✅ Contexts copiados para nova estrutura"
echo ""
echo "📊 Verificando estrutura nova:"
find src/contexts -name "*.tsx" -o -name "*.ts" | sort
