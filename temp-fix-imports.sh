#!/bin/bash

# Fazer backup dos arquivos principais
cp src/pages/MainEditor.tsx src/pages/MainEditor.tsx.backup

# Substituir imports @ por caminhos relativos
echo "Corrigindo imports em MainEditor.tsx..."
sed -i 's|import { EditorPro } from "@/components/editor/EditorPro";|import { EditorPro } from "../components/editor/EditorPro";|g' src/pages/MainEditor.tsx
sed -i 's|import { EditorProvider } from "@/components/editor/EditorProvider";|import { EditorProvider } from "../components/editor/EditorProvider";|g' src/pages/MainEditor.tsx  
sed -i 's|import { ErrorBoundary } from "@/components/ui/ErrorBoundary";|import { ErrorBoundary } from "../components/ui/ErrorBoundary";|g' src/pages/MainEditor.tsx

echo "Imports corrigidos em MainEditor.tsx"
cat src/pages/MainEditor.tsx | head -10
