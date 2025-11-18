#!/bin/bash
# 🧹 WAVE 3: Cleanup Deprecated Files
# 
# Remove arquivos obsoletos identificados em docs/SAFE_TO_DELETE.md
# ATENÇÃO: Cria backup antes de deletar!

set -e # Exit on error

PROJECT_ROOT="/workspaces/quiz-flow-pro-verso-03342"
BACKUP_DIR=".archive/wave3-cleanup-$(date +%Y%m%d-%H%M%S)"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         🧹 WAVE 3: DEPRECATED FILES CLEANUP                    ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Criar diretório de backup
echo "📦 Criando backup em: $BACKUP_DIR"
mkdir -p "$PROJECT_ROOT/$BACKUP_DIR"

# Contador
total_files=0
moved_files=0
errors=0

# ============================================================================
# FASE 1: Arquivos .archive (já deprecados, só mover para backup único)
# ============================================================================

echo ""
echo "📋 FASE 1: Arquivos em .archive (já deprecados)"
echo "────────────────────────────────────────────────────────────────"

ARCHIVE_DIRS=(
    ".archive/components-deprecated-20251031"
    ".archive/deprecated-phase2-20251031"
    ".archive/registries-deprecated-20251031"
    ".archive/services-deprecated-phase2-20251031"
    ".archive/templates-backup-20251031"
)

for dir in "${ARCHIVE_DIRS[@]}"; do
    if [ -d "$PROJECT_ROOT/$dir" ]; then
        echo "   📂 Movendo: $dir"
        mkdir -p "$PROJECT_ROOT/$BACKUP_DIR/$(dirname $dir)"
        mv "$PROJECT_ROOT/$dir" "$PROJECT_ROOT/$BACKUP_DIR/$dir"
        moved_files=$((moved_files + 1))
    fi
done

# ============================================================================
# FASE 2: Legacy Adapters (já substituídos por hooks canônicos)
# ============================================================================

echo ""
echo "📋 FASE 2: Legacy Adapters (substituídos por hooks canônicos)"
echo "────────────────────────────────────────────────────────────────"

LEGACY_ADAPTERS=(
    "src/hooks/loading/LegacyLoadingAdapters.ts"
)

for file in "${LEGACY_ADAPTERS[@]}"; do
    if [ -f "$PROJECT_ROOT/$file" ]; then
        # Verificar se ainda é importado
        imports=$(rg "import.*LegacyLoadingAdapters" "$PROJECT_ROOT/src" --count-matches 2>/dev/null || echo "0")
        
        if [ "$imports" -gt 1 ]; then
            echo "   ⚠️  SKIP: $file (ainda tem $imports imports)"
        else
            echo "   ✅ Movendo: $file"
            mkdir -p "$PROJECT_ROOT/$BACKUP_DIR/$(dirname $file)"
            mv "$PROJECT_ROOT/$file" "$PROJECT_ROOT/$BACKUP_DIR/$file"
            moved_files=$((moved_files + 1))
        fi
        total_files=$((total_files + 1))
    fi
done

# ============================================================================
# FASE 3: Scripts de Migração (já executados)
# ============================================================================

echo ""
echo "📋 FASE 3: Scripts de migração (já executados)"
echo "────────────────────────────────────────────────────────────────"

MIGRATION_SCRIPTS=(
    "scripts/migrate-providers.js"
    "scripts/migrate-services.js"
    "scripts/migrateUseEditor.ts"
    "scripts/migrateTemplatesV3_2.ts"
    "scripts/migration/find-legacy-imports.ts"
)

for file in "${MIGRATION_SCRIPTS[@]}"; do
    if [ -f "$PROJECT_ROOT/$file" ]; then
        echo "   📄 Movendo: $file"
        mkdir -p "$PROJECT_ROOT/$BACKUP_DIR/$(dirname $file)"
        mv "$PROJECT_ROOT/$file" "$PROJECT_ROOT/$BACKUP_DIR/$file"
        moved_files=$((moved_files + 1))
        total_files=$((total_files + 1))
    fi
done

# ============================================================================
# FASE 4: Documentos de migração (já concluídos)
# ============================================================================

echo ""
echo "📋 FASE 4: Documentos de migração (já concluídos)"
echo "────────────────────────────────────────────────────────────────"

MIGRATION_DOCS=(
    "docs/migrations/MIGRACAO_ARQUITETURA_100_MODULAR.md"
    "docs/archive/PLANO_REORGANIZACAO_INCREMENTAL.md"
)

for file in "${MIGRATION_DOCS[@]}"; do
    if [ -f "$PROJECT_ROOT/$file" ]; then
        echo "   📝 Movendo: $file"
        mkdir -p "$PROJECT_ROOT/$BACKUP_DIR/$(dirname $file)"
        mv "$PROJECT_ROOT/$file" "$PROJECT_ROOT/$BACKUP_DIR/$file"
        moved_files=$((moved_files + 1))
        total_files=$((total_files + 1))
    fi
done

# ============================================================================
# FASE 5: Arquivos .backup, .old (backups explícitos)
# ============================================================================

echo ""
echo "📋 FASE 5: Arquivos .backup e .old (backups explícitos)"
echo "────────────────────────────────────────────────────────────────"

# Buscar arquivos com extensão .backup ou .old
find "$PROJECT_ROOT" -type f \( -name "*.backup" -o -name "*.old" -o -name "*.backup.*" \) 2>/dev/null | while read file; do
    if [ -f "$file" ]; then
        rel_path="${file#$PROJECT_ROOT/}"
        echo "   🗂️  Movendo: $rel_path"
        mkdir -p "$PROJECT_ROOT/$BACKUP_DIR/$(dirname $rel_path)"
        mv "$file" "$PROJECT_ROOT/$BACKUP_DIR/$rel_path"
        moved_files=$((moved_files + 1))
        total_files=$((total_files + 1))
    fi
done

# ============================================================================
# RESUMO
# ============================================================================

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                        📊 RESUMO DA LIMPEZA                     ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "   📂 Total de arquivos processados: $total_files"
echo "   ✅ Arquivos movidos para backup:  $moved_files"
echo "   ❌ Erros:                          $errors"
echo ""
echo "   📦 Backup criado em: $BACKUP_DIR"
echo ""

# ============================================================================
# VALIDAÇÃO PÓS-LIMPEZA
# ============================================================================

echo "🧪 Executando validação pós-limpeza..."
echo ""

# Test TypeScript compilation
echo "   🔧 Verificando compilação TypeScript..."
cd "$PROJECT_ROOT"
if npm run typecheck 2>&1 | grep -q "error TS"; then
    echo "   ❌ ERRO: Falha na compilação TypeScript"
    echo "   ⚠️  Execute: npm run typecheck"
    exit 1
else
    echo "   ✅ TypeScript OK"
fi

# Test if dev server can start
echo "   🔧 Testando servidor de desenvolvimento..."
timeout 10s npm run dev > /dev/null 2>&1 &
DEV_PID=$!
sleep 3

if ps -p $DEV_PID > /dev/null 2>&1; then
    echo "   ✅ Dev server OK"
    kill $DEV_PID 2>/dev/null
else
    echo "   ❌ ERRO: Dev server falhou ao iniciar"
    exit 1
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    ✅ LIMPEZA CONCLUÍDA!                       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "🎯 Próximos passos:"
echo "   1. Testar aplicação: npm run dev"
echo "   2. Executar testes: npm test"
echo "   3. Commit incremental: git add . && git commit -m 'chore(wave3): cleanup deprecated files'"
echo ""
echo "📦 Para reverter: mv $BACKUP_DIR/* ./"
echo ""
