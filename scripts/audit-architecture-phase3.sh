#!/bin/bash

# 🔍 AUDITORIA ARQUITETURAL AUTOMÁTICA - FASE 3.1
# Script para levantamento completo de arquivos para consolidação

echo "🎯 INICIANDO AUDITORIA ARQUITETURAL - FASE 3.1"
echo "================================================"

# Função para filtrar arquivos relevantes (excluindo backups, node_modules, dist)
filter_relevant() {
    grep -v -E "(node_modules|dist|backup|system-backup|cleanup-backup)" | \
    grep -v -E "\.d\.ts$" | \
    sort
}

# 1. EDITORES
echo ""
echo "📝 1. AUDITORIA DE EDITORES"
echo "----------------------------"
echo "Arquivos encontrados:"
find . -name "*[Ee]ditor*" -type f | grep -E "\.(tsx?|jsx?)$" | filter_relevant | nl

# 2. RENDERIZADORES
echo ""
echo "🖼️  2. AUDITORIA DE RENDERIZADORES"
echo "-----------------------------------"
echo "Arquivos encontrados:"
find . -name "*[Rr]enderer*" -type f | grep -E "\.(tsx?|jsx?)$" | filter_relevant | nl

# 3. REGISTRIES
echo ""
echo "📚 3. AUDITORIA DE REGISTRIES"
echo "------------------------------"
echo "Arquivos encontrados:"
find . -name "*[Rr]egistry*" -type f | grep -E "\.(tsx?|jsx?)$" | filter_relevant | nl

# 4. TEMPLATES
echo ""
echo "📋 4. AUDITORIA DE TEMPLATES"
echo "-----------------------------"
echo "Arquivos encontrados:"
find . -name "*[Tt]emplate*" -type f | grep -E "\.(tsx?|jsx?|json)$" | filter_relevant | nl
find . -name "*[Qq]uiz*" -type f | grep -E "template|config" -i | filter_relevant | nl

# 5. PAINÉIS DE PROPRIEDADES
echo ""
echo "🎛️  5. AUDITORIA DE PAINÉIS DE PROPRIEDADES"
echo "--------------------------------------------"
echo "Arquivos Properties:"
find . -name "*[Pp]roperties*" -type f | grep -E "\.(tsx?|jsx?)$" | filter_relevant | nl
echo ""
echo "Arquivos Panel:"
find . -name "*[Pp]anel*" -type f | grep -E "\.(tsx?|jsx?)$" | filter_relevant | nl

# 6. COMPONENTES PRINCIPAIS
echo ""
echo "🧩 6. AUDITORIA DE COMPONENTES PRINCIPAIS"
echo "------------------------------------------"
echo "MainEditor variants:"
find . -name "*MainEditor*" -type f | grep -E "\.(tsx?|jsx?)$" | filter_relevant | nl
echo ""
echo "QuizEditor variants:"
find . -name "*QuizEditor*" -type f | grep -E "\.(tsx?|jsx?)$" | filter_relevant | nl

# 7. CONTEXTOS
echo ""
echo "🔄 7. AUDITORIA DE CONTEXTOS"
echo "-----------------------------"
echo "Arquivos Context:"
find . -name "*[Cc]ontext*" -type f | grep -E "\.(tsx?|jsx?)$" | filter_relevant | nl

# 8. HOOKS
echo ""
echo "🪝 8. AUDITORIA DE HOOKS"
echo "------------------------"
echo "useEditor hooks:"
find . -name "*useEditor*" -type f | grep -E "\.(tsx?|jsx?)$" | filter_relevant | nl
echo ""
echo "Editor-related hooks:"
find . -path "./src/hooks/editor/*" -type f | grep -E "\.(tsx?|jsx?)$" | filter_relevant | nl

# 9. PÁGINAS
echo ""
echo "📄 9. AUDITORIA DE PÁGINAS"
echo "---------------------------"
echo "Editor pages:"
find . -path "./src/pages/*" -name "*[Ee]ditor*" -type f | grep -E "\.(tsx?|jsx?)$" | filter_relevant | nl

# 10. ESTATÍSTICAS RESUMIDAS
echo ""
echo "📊 10. ESTATÍSTICAS RESUMIDAS"
echo "==============================="

total_editors=$(find . -name "*[Ee]ditor*" -type f | grep -E "\.(tsx?|jsx?)$" | filter_relevant | wc -l)
total_renderers=$(find . -name "*[Rr]enderer*" -type f | grep -E "\.(tsx?|jsx?)$" | filter_relevant | wc -l)
total_registries=$(find . -name "*[Rr]egistry*" -type f | grep -E "\.(tsx?|jsx?)$" | filter_relevant | wc -l)
total_templates=$(find . -name "*[Tt]emplate*" -type f | grep -E "\.(tsx?|jsx?|json)$" | filter_relevant | wc -l)
total_properties=$(find . -name "*[Pp]roperties*" -type f | grep -E "\.(tsx?|jsx?)$" | filter_relevant | wc -l)
total_panels=$(find . -name "*[Pp]anel*" -type f | grep -E "\.(tsx?|jsx?)$" | filter_relevant | wc -l)

echo "📝 Editores: $total_editors arquivos"
echo "🖼️  Renderizadores: $total_renderers arquivos"
echo "📚 Registries: $total_registries arquivos"
echo "📋 Templates: $total_templates arquivos"
echo "🎛️  Properties: $total_properties arquivos"
echo "🎛️  Panels: $total_panels arquivos"

total_files=$((total_editors + total_renderers + total_registries + total_templates + total_properties + total_panels))
echo ""
echo "🎯 TOTAL DE ARQUIVOS PARA ANÁLISE: $total_files"

echo ""
echo "✅ AUDITORIA CONCLUÍDA - FASE 3.1"
echo "=================================="
echo "Próximo passo: Analisar duplicações e criar plano de consolidação"
