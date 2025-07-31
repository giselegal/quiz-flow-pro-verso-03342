#!/bin/bash

# 🚀 Script de Automação - Sistema Drag & Drop
# Uso: ./dnd-commands.sh [comando]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para logging
log() {
    echo -e "${GREEN}[DnD Script]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Verificar se estamos no diretório correto
check_directory() {
    if [ ! -f "package.json" ]; then
        error "Execute este script na raiz do projeto (onde está o package.json)"
        exit 1
    fi
}

# Verificar dependências DnD
check_dnd_deps() {
    log "Verificando dependências @dnd-kit..."
    
    if npm list @dnd-kit/core @dnd-kit/sortable @dnd-kit/modifiers @dnd-kit/utilities > /dev/null 2>&1; then
        info "✅ Todas as dependências @dnd-kit estão instaladas"
    else
        warning "⚠️ Algumas dependências @dnd-kit podem estar faltando"
        npm list @dnd-kit/core @dnd-kit/sortable @dnd-kit/modifiers @dnd-kit/utilities || true
    fi
}

# Verificar estrutura de arquivos DnD
check_dnd_files() {
    log "Verificando arquivos do sistema Drag & Drop..."
    
    local files=(
        "src/components/editor/dnd/DndProvider.tsx"
        "src/components/editor/dnd/DroppableCanvas.tsx"
        "src/components/editor/dnd/DraggableComponentItem.tsx"
        "src/components/editor/dnd/SortableBlockItem.tsx"
        "src/pages/DragDropTestPage.tsx"
    )
    
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            info "✅ $file"
        else
            error "❌ $file não encontrado"
        fi
    done
}

# Iniciar desenvolvimento
start_dev() {
    log "Iniciando servidor de desenvolvimento..."
    info "🌐 Acesse: http://localhost:5173/drag-drop-test"
    npm run dev
}

# Build do projeto
build_project() {
    log "Fazendo build do projeto..."
    npm run build
    
    if [ $? -eq 0 ]; then
        info "✅ Build concluído com sucesso!"
        du -sh dist/
    else
        error "❌ Build falhou"
        exit 1
    fi
}

# Verificar erros TypeScript
check_types() {
    log "Verificando tipos TypeScript..."
    npx tsc --noEmit
    
    if [ $? -eq 0 ]; then
        info "✅ Nenhum erro de tipo encontrado"
    else
        warning "⚠️ Encontrados erros de tipo"
    fi
}

# Executar testes básicos
run_tests() {
    log "Executando verificações básicas..."
    
    check_dnd_deps
    check_dnd_files
    check_types
    
    log "Verificando imports DnD..."
    grep -r "import.*dnd" src/components/editor/ || warning "Nenhum import DnD encontrado"
    
    log "Verificando novo componente VerticalCanvasHeader..."
    if [ -f "src/components/editor/blocks/VerticalCanvasHeaderBlock.tsx" ]; then
        info "✅ VerticalCanvasHeaderBlock.tsx encontrado"
    else
        error "❌ VerticalCanvasHeaderBlock.tsx não encontrado"
    fi
    
    log "Verificando definição de bloco..."
    if grep -q "vertical-canvas-header" src/config/blockDefinitionsClean.ts; then
        info "✅ Definição 'vertical-canvas-header' encontrada em blockDefinitionsClean.ts"
    else
        error "❌ Definição 'vertical-canvas-header' não encontrada"
    fi
    
    log "Verificando integração no UniversalBlockRenderer..."
    if grep -q "VerticalCanvasHeaderBlock" src/components/editor/blocks/UniversalBlockRenderer.tsx; then
        info "✅ VerticalCanvasHeaderBlock integrado no UniversalBlockRenderer"
    else
        error "❌ VerticalCanvasHeaderBlock não integrado no UniversalBlockRenderer"
    fi
    
    info "✅ Verificações básicas concluídas"
}

# Criar commit com melhorias
commit_changes() {
    log "Criando commit das mudanças..."
    
    git add -A
    git status
    
    read -p "Digite a mensagem do commit: " commit_msg
    
    if [ -n "$commit_msg" ]; then
        git commit -m "feat(dnd): $commit_msg"
        info "✅ Commit criado: $commit_msg"
    else
        warning "Commit cancelado - mensagem vazia"
    fi
}

# Análise de performance
analyze_performance() {
    log "Analisando performance..."
    
    if command -v lighthouse > /dev/null; then
        lighthouse http://localhost:5173/drag-drop-test --only-categories=performance --output=json --output-path=./lighthouse-report.json
        info "📊 Relatório salvo em: lighthouse-report.json"
    else
        warning "Lighthouse não instalado. Instale com: npm install -g lighthouse"
    fi
}

# Menu de ajuda
show_help() {
    echo -e "${GREEN}🚀 Script de Automação - Sistema Drag & Drop${NC}"
    echo ""
    echo "Comandos disponíveis:"
    echo "  dev         - Iniciar servidor de desenvolvimento"
    echo "  build       - Fazer build do projeto"
    echo "  test        - Executar verificações básicas"
    echo "  types       - Verificar tipos TypeScript"
    echo "  check       - Verificar dependências e arquivos DnD"
    echo "  commit      - Criar commit interativo"
    echo "  perf        - Analisar performance"
    echo "  help        - Mostrar esta ajuda"
    echo ""
    echo "Exemplo: ./dnd-commands.sh dev"
}

# Menu principal
main() {
    check_directory
    
    case "${1:-help}" in
        "dev")
            start_dev
            ;;
        "build")
            build_project
            ;;
        "test")
            run_tests
            ;;
        "types")
            check_types
            ;;
        "check")
            check_dnd_deps
            check_dnd_files
            ;;
        "commit")
            commit_changes
            ;;
        "perf")
            analyze_performance
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Executar comando principal
main "$@"
