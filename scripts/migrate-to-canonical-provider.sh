#!/bin/bash

# 🔄 SCRIPT DE MIGRAÇÃO AUTOMÁTICA - FASE 1
# Migra imports de providers antigos para EditorProviderCanonical

echo "🚀 INICIANDO MIGRAÇÃO PARA EDITORPROVIDERCANONICAL"
echo "=================================================="

# Contador de arquivos modificados
count=0

# Função para processar arquivos
migrate_file() {
    local file="$1"
    local changed=false
    
    # Backup do arquivo original
    cp "$file" "$file.bak"
    
    # 1. Migrar import de EditorProviderUnified
    if grep -q "from.*EditorProviderUnified" "$file"; then
        sed -i "s/from '@\/components\/editor\/EditorProviderUnified'/from '@\/components\/editor\/EditorProviderCanonical'/g" "$file"
        sed -i "s/from \"@\/components\/editor\/EditorProviderUnified\"/from \"@\/components\/editor\/EditorProviderCanonical\"/g" "$file"
        changed=true
        echo "  ✓ Migrado import EditorProviderUnified → EditorProviderCanonical"
    fi
    
    # 2. Migrar import de EditorProviderAdapter
    if grep -q "from.*EditorProviderAdapter" "$file"; then
        sed -i "s/from '@\/components\/editor\/EditorProviderAdapter'/from '@\/components\/editor\/EditorProviderCanonical'/g" "$file"
        sed -i "s/from \"@\/components\/editor\/EditorProviderAdapter\"/from \"@\/components\/editor\/EditorProviderCanonical\"/g" "$file"
        changed=true
        echo "  ✓ Migrado import EditorProviderAdapter → EditorProviderCanonical"
    fi
    
    # 3. Migrar import de EditorProviderMigrationAdapter
    if grep -q "from.*EditorProviderMigrationAdapter" "$file"; then
        sed -i "s/from '@\/components\/editor\/EditorProviderMigrationAdapter'/from '@\/components\/editor\/EditorProviderCanonical'/g" "$file"
        sed -i "s/from \"@\/components\/editor\/EditorProviderMigrationAdapter\"/from \"@\/components\/editor\/EditorProviderCanonical\"/g" "$file"
        changed=true
        echo "  ✓ Migrado import EditorProviderMigrationAdapter → EditorProviderCanonical"
    fi
    
    # 4. Substituir uso dos componentes
    if grep -q "<EditorProviderUnified" "$file"; then
        sed -i "s/<EditorProviderUnified/<EditorProviderCanonical/g" "$file"
        sed -i "s/<\/EditorProviderUnified>/<\/EditorProviderCanonical>/g" "$file"
        changed=true
        echo "  ✓ Substituído uso <EditorProviderUnified> → <EditorProviderCanonical>"
    fi
    
    if grep -q "<EditorProviderAdapter" "$file"; then
        sed -i "s/<EditorProviderAdapter/<EditorProviderCanonical/g" "$file"
        sed -i "s/<\/EditorProviderAdapter>/<\/EditorProviderCanonical>/g" "$file"
        changed=true
        echo "  ✓ Substituído uso <EditorProviderAdapter> → <EditorProviderCanonical>"
    fi
    
    if grep -q "<MigrationEditorProvider" "$file"; then
        sed -i "s/<MigrationEditorProvider/<EditorProviderCanonical/g" "$file"
        sed -i "s/<\/MigrationEditorProvider>/<\/EditorProviderCanonical>/g" "$file"
        changed=true
        echo "  ✓ Substituído uso <MigrationEditorProvider> → <EditorProviderCanonical>"
    fi
    
    if [ "$changed" = true ]; then
        ((count++))
        echo "✅ Migrado: $file"
    else
        # Remover backup se não houve mudanças
        rm "$file.bak"
    fi
}

# Buscar e processar arquivos TypeScript/TSX
echo ""
echo "🔍 Procurando arquivos para migrar..."
echo ""

# Processar arquivos em src/
while IFS= read -r file; do
    if [ -f "$file" ]; then
        migrate_file "$file"
    fi
done < <(find src -name "*.tsx" -o -name "*.ts" | grep -v node_modules | grep -v dist | grep -v backup)

echo ""
echo "=================================================="
echo "✨ MIGRAÇÃO CONCLUÍDA"
echo "   Total de arquivos migrados: $count"
echo ""
echo "📋 Próximos passos:"
echo "   1. Revisar mudanças: git diff"
echo "   2. Testar aplicação: npm run dev"
echo "   3. Se tudo OK, commit: git add . && git commit -m 'migrate: EditorProviderCanonical'"
echo "   4. Se houver problemas, restaurar: find src -name '*.bak' -exec bash -c 'mv \"$0\" \"${0%.bak}\"' {} \;"
echo ""
echo "🗑️  Para remover backups após confirmar:"
echo "   find src -name '*.bak' -delete"
echo ""
