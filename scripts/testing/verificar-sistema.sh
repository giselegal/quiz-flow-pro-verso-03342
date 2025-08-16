#!/bin/bash

# 🧪 SCRIPT DE VERIFICAÇÃO AUTOMATIZADA
# Testa se todos os componentes principais estão funcionando

echo "🚀 INICIANDO VERIFICAÇÃO COMPLETA DO SISTEMA..."
echo "Data: $(date)"
echo "=========================================="

# Verificar se o servidor está rodando
echo ""
echo "🔍 1. VERIFICANDO SERVIDOR..."
if curl -s http://localhost:8080 > /dev/null; then
    echo "✅ Servidor frontend rodando na porta 8080"
else
    echo "❌ Servidor frontend não responde na porta 8080"
    echo "   Execute: npm run dev"
    exit 1
fi

# Verificar rota do dashboard
echo ""
echo "🔍 2. VERIFICANDO DASHBOARD..."
DASHBOARD_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/admin)
if [ "$DASHBOARD_STATUS" = "200" ]; then
    echo "✅ Dashboard acessível em /admin"
else
    echo "❌ Dashboard não responde (Status: $DASHBOARD_STATUS)"
fi

# Verificar rota do editor
echo ""
echo "🔍 3. VERIFICANDO EDITOR..."
EDITOR_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/editor)
if [ "$EDITOR_STATUS" = "200" ]; then
    echo "✅ Editor acessível em /editor"
else
    echo "❌ Editor não responde (Status: $EDITOR_STATUS)"
fi

# Verificar arquivos principais
echo ""
echo "🔍 4. VERIFICANDO ARQUIVOS PRINCIPAIS..."

FILES_TO_CHECK=(
    "src/pages/admin/FunnelPanelPage.tsx"
    "src/pages/SchemaDrivenEditorPage.tsx"
    "src/components/editor/SchemaDrivenEditorResponsive.tsx"
    "src/services/schemaDrivenFunnelService.ts"
    "src/App.tsx"
)

for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (arquivo não encontrado)"
    fi
done

# Verificar se há erros de build
echo ""
echo "🔍 5. VERIFICANDO BUILD..."
if npm run build:dev > /tmp/build.log 2>&1; then
    echo "✅ Build executado sem erros"
else
    echo "❌ Erros encontrados no build:"
    tail -10 /tmp/build.log
fi

# Verificar dependências principais
echo ""
echo "🔍 6. VERIFICANDO DEPENDÊNCIAS..."
DEPENDENCIES=(
    "@dnd-kit/core"
    "@radix-ui/react-dialog"
    "wouter"
    "lucide-react"
)

for dep in "${DEPENDENCIES[@]}"; do
    if npm list "$dep" > /dev/null 2>&1; then
        echo "✅ $dep instalado"
    else
        echo "❌ $dep não encontrado"
    fi
done

# Verificar estrutura de pastas críticas
echo ""
echo "🔍 7. VERIFICANDO ESTRUTURA..."
FOLDERS_TO_CHECK=(
    "src/components/editor"
    "src/components/blocks"
    "src/components/ui"
    "src/pages/admin"
    "src/services"
    "src/hooks"
)

for folder in "${FOLDERS_TO_CHECK[@]}"; do
    if [ -d "$folder" ]; then
        file_count=$(find "$folder" -name "*.tsx" -o -name "*.ts" | wc -l)
        echo "✅ $folder ($file_count arquivos)"
    else
        echo "❌ $folder (pasta não encontrada)"
    fi
done

echo ""
echo "=========================================="
echo "🎯 VERIFICAÇÃO CONCLUÍDA!"
echo ""
echo "📋 PRÓXIMOS PASSOS PARA TESTE MANUAL:"
echo "1. Acesse: http://localhost:8080/admin"
echo "2. Teste criação de funil no dashboard"
echo "3. Verifique navegação para o editor"
echo "4. Teste funcionalidades do editor"
echo ""
echo "📖 Consulte: GUIA_TESTE_COMPLETO_FUNCIONALIDADES.md"
