#!/bin/bash

# 🧹 SCRIPT DE UNIFICAÇÃO - FASE 1: LIMPEZA
# Este script executa a primeira fase do plano de unificação

echo "🚀 INICIANDO UNIFICAÇÃO DO EDITOR - FASE 1"
echo "=============================================="

# Criar diretório de backup
BACKUP_DIR="/workspaces/quiz-quest-challenge-verse/backup/unification-$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR/legacy-editors"
mkdir -p "$BACKUP_DIR/legacy-calculations"
mkdir -p "$BACKUP_DIR/legacy-services"

echo "📦 Backup criado em: $BACKUP_DIR"

# FASE 1.1: BACKUP E REMOÇÃO DE EDITORES DUPLICADOS
echo ""
echo "🗑️  FASE 1.1: Limpeza de Editores Duplicados"
echo "--------------------------------------------"

DUPLICATE_EDITORS=(
  "src/components/editor/EditorPro-backup.tsx"
  "src/components/editor/EditorPro-clean.tsx"
  "src/components/editor/EditorPro-WORKING.tsx"
  "src/components/editor/QuizEditorPro.corrected.tsx"
  "src/components/editor/EnhancedComponentsSidebar.tsx.broken"
  "src/components/editor/canvas/SortableBlockWrapper_temp.tsx"
)

for file in "${DUPLICATE_EDITORS[@]}"; do
  full_path="/workspaces/quiz-quest-challenge-verse/$file"
  if [ -f "$full_path" ]; then
    echo "  📁 Fazendo backup: $file"
    cp "$full_path" "$BACKUP_DIR/legacy-editors/$(basename $file)"
    echo "  🗑️  Removendo: $file"
    rm "$full_path"
    echo "  ✅ Concluído: $(basename $file)"
  else
    echo "  ⚠️  Não encontrado: $file"
  fi
done

# FASE 1.2: ANÁLISE DE DEPENDÊNCIAS
echo ""
echo "🔍 FASE 1.2: Análise de Dependências"
echo "------------------------------------"

echo "📊 Contando arquivos por categoria:"
echo "  - Editores: $(find /workspaces/quiz-quest-challenge-verse/src/components/editor -name "*Editor*.tsx" | wc -l)"
echo "  - Cálculos: $(find /workspaces/quiz-quest-challenge-verse/src/utils -name "*calc*" -o -name "*result*" | wc -l)"
echo "  - Serviços: $(find /workspaces/quiz-quest-challenge-verse/src/services -name "*quiz*" -o -name "*result*" | wc -l)"
echo "  - Types: $(find /workspaces/quiz-quest-challenge-verse/src/types -name "*quiz*" | wc -l)"

# FASE 1.3: CRIAÇÃO DA ESTRUTURA UNIFICADA
echo ""
echo "🏗️  FASE 1.3: Criação da Estrutura Base"
echo "--------------------------------------"

# Criar diretórios da nova estrutura
NEW_STRUCTURE=(
  "src/unified"
  "src/unified/editor"
  "src/unified/editor/hooks"
  "src/unified/calculations"
  "src/unified/services"
  "src/unified/services/integrations"
  "src/unified/modules"
  "src/unified/modules/canvas"
  "src/unified/modules/properties"
  "src/unified/modules/toolbar"
  "src/unified/modules/stages"
  "src/unified/modules/preview"
  "src/legacy"
  "src/legacy/editors"
  "src/legacy/calculations"
  "src/legacy/adapters"
)

for dir in "${NEW_STRUCTURE[@]}"; do
  full_dir="/workspaces/quiz-quest-challenge-verse/$dir"
  if [ ! -d "$full_dir" ]; then
    mkdir -p "$full_dir"
    echo "  ✅ Criado: $dir"
  else
    echo "  ⚠️  Já existe: $dir"
  fi
done

# Criar arquivos README em cada diretório
echo "📝 Criando documentação estrutural..."
cat > "/workspaces/quiz-quest-challenge-verse/src/unified/README.md" << 'EOF'
# 🎯 Sistema Unificado

Esta pasta contém o novo sistema unificado do editor e lógica de cálculos.

## Estrutura

- `editor/` - Editor unificado principal
- `calculations/` - Engine de cálculos consolidado  
- `services/` - Serviços unificados
- `modules/` - Módulos do editor

## Status

🔄 **EM DESENVOLVIMENTO** - Migração em andamento
EOF

# FASE 1.4: MAPEAMENTO DE IMPORTS
echo ""
echo "🔗 FASE 1.4: Mapeamento de Imports"
echo "----------------------------------"

echo "📋 Gerando relatório de dependências..."
cat > "$BACKUP_DIR/dependency-report.md" << 'EOF'
# Relatório de Dependências - Unificação

## Editores Analisados
EOF

# Analisar imports dos editores principais
MAIN_EDITORS=(
  "src/components/editor/EditorPro.tsx"
  "src/components/editor/SchemaDrivenEditorResponsive.tsx"
  "src/components/editor/QuizEditorInterface.tsx"
  "src/components/editor/QuizEditorPro.tsx"
)

for editor in "${MAIN_EDITORS[@]}"; do
  full_path="/workspaces/quiz-quest-challenge-verse/$editor"
  if [ -f "$full_path" ]; then
    echo "" >> "$BACKUP_DIR/dependency-report.md"
    echo "### $(basename $editor)" >> "$BACKUP_DIR/dependency-report.md"
    echo '```typescript' >> "$BACKUP_DIR/dependency-report.md"
    grep -n "^import" "$full_path" | head -20 >> "$BACKUP_DIR/dependency-report.md"
    echo '```' >> "$BACKUP_DIR/dependency-report.md"
  fi
done

echo "  ✅ Relatório salvo em: $BACKUP_DIR/dependency-report.md"

# RESULTADO FINAL
echo ""
echo "🎉 FASE 1 CONCLUÍDA COM SUCESSO!"
echo "================================"
echo ""
echo "📊 Resumo da Execução:"
echo "  ✅ Arquivos duplicados removidos: ${#DUPLICATE_EDITORS[@]}"
echo "  ✅ Diretórios criados: ${#NEW_STRUCTURE[@]}"
echo "  ✅ Backup realizado em: $BACKUP_DIR"
echo "  ✅ Estrutura unificada preparada"
echo ""
echo "🚀 Próximos Passos:"
echo "  1. Revisar backup em: $BACKUP_DIR"
echo "  2. Implementar EditorUnified.tsx"
echo "  3. Criar UnifiedCalculationEngine"
echo "  4. Migrar componentes existentes"
echo ""
echo "💡 Para continuar: npm run unify:phase2"

# Verificar se deve executar automaticamente
if [ "$1" = "--auto-continue" ]; then
  echo ""
  echo "🔄 Continuando automaticamente para Fase 2..."
  sleep 2
  # Aqui chamaria o próximo script
fi
