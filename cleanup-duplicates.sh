#!/bin/bash

# 🧹 Script de Limpeza de Duplicidades - Quiz Quest Challenge Verse
# Baseado na análise detalhada de duplicidades em rotas e códigos

echo "🧹 INICIANDO LIMPEZA DE DUPLICIDADES"
echo "===================================="

# Verificar se estamos no diretório correto
if [[ ! -f "package.json" ]]; then
    echo "❌ Erro: Execute este script na raiz do projeto"
    exit 1
fi

# Criar backup antes da limpeza
BACKUP_DIR="cleanup-backup-$(date +%Y%m%d_%H%M%S)"
echo "📦 Criando backup em: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# Backup de arquivos que serão removidos
echo "📋 Fazendo backup dos arquivos que serão removidos..."

# 1. ARQUIVOS DE EDITOR REDUNDANTES
EDITOR_FILES=(
    "src/pages/MainEditor-new.tsx"
    "src/pages/EditorProSimpleTest.tsx"
    "src/pages/EditorTeste.tsx"
    "src/pages/QuizEditorShowcase.tsx"
    "src/pages/EditorProTestPage.tsx"
    "src/pages/EditorWithPreview.tsx"
    "src/pages/EditorWithPreview-FINAL.tsx"
    "src/pages/QuizEditorProDemo.tsx"
    "src/pages/EditorProTestFixed.tsx"
    "src/pages/EditorWithPreview-clean.tsx"
)

echo "💻 Fazendo backup de arquivos de editor redundantes..."
for file in "${EDITOR_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "   📄 Backup: $file"
        cp "$file" "$BACKUP_DIR/"
    fi
done

# 2. CONFIGURAÇÕES DUPLICADAS
CONFIG_FILES=(
    "vite.config.js"
)

echo "⚙️ Fazendo backup de configurações duplicadas..."
for file in "${CONFIG_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "   📄 Backup: $file"
        cp "$file" "$BACKUP_DIR/"
    fi
done

# Função para confirmação interativa
ask_confirmation() {
    local message="$1"
    local default="${2:-n}"
    
    if [[ "$default" == "y" ]]; then
        prompt="$message [Y/n]: "
    else
        prompt="$message [y/N]: "
    fi
    
    read -p "$prompt" response
    response=${response:-$default}
    
    case "$response" in
        [yY]|[yY][eE][sS]) return 0 ;;
        *) return 1 ;;
    esac
}

echo ""
echo "🔍 ANÁLISE COMPLETA - RESUMO:"
echo "   • Arquivos de editor redundantes: ${#EDITOR_FILES[@]}"
echo "   • Configurações duplicadas: ${#CONFIG_FILES[@]}"
echo "   • Backup criado em: $BACKUP_DIR"

if ask_confirmation "🚀 Continuar com a limpeza?"; then
    echo ""
    echo "🧹 INICIANDO LIMPEZA..."
    
    # FASE 1: Remover arquivos de editor redundantes
    if ask_confirmation "📂 Remover arquivos de editor redundantes?"; then
        echo "💻 Removendo arquivos de editor redundantes..."
        for file in "${EDITOR_FILES[@]}"; do
            if [[ -f "$file" ]]; then
                echo "   🗑️ Removendo: $file"
                rm "$file"
            else
                echo "   ⚠️ Arquivo não encontrado: $file"
            fi
        done
        echo "✅ Arquivos de editor redundantes removidos!"
    fi
    
    # FASE 2: Remover configurações duplicadas
    if ask_confirmation "⚙️ Remover configurações duplicadas?"; then
        echo "⚙️ Removendo configurações duplicadas..."
        for file in "${CONFIG_FILES[@]}"; do
            if [[ -f "$file" ]]; then
                echo "   🗑️ Removendo: $file (mantendo .ts)"
                rm "$file"
            else
                echo "   ⚠️ Arquivo não encontrado: $file"
            fi
        done
        echo "✅ Configurações duplicadas removidas!"
    fi
    
    # FASE 3: Resolver conflito do vitest.config.ts duplicado
    if ask_confirmation "🔧 Resolver conflito de vitest.config.ts duplicado?"; then
        if [[ -f "vitest.config.ts" && -f "vitest.config.ts        (edit)" ]]; then
            echo "   🔧 Removendo arquivo duplicado: vitest.config.ts (edit)"
            rm "vitest.config.ts        (edit)" 2>/dev/null || echo "   ⚠️ Arquivo já foi removido"
        fi
        echo "✅ Conflito de vitest.config.ts resolvido!"
    fi
    
    # FASE 4: Limpeza de arquivos de debug/teste na raiz
    if ask_confirmation "🧪 Remover arquivos de debug/teste na raiz?"; then
        echo "🧪 Removendo arquivos de debug/teste..."
        
        DEBUG_FILES=(
            "debug-*.sh"
            "debug-*.js"
            "test-*.js"
            "test-*.html"
            "teste-*.js"
            "*diagnostico*.js"
            "DIAGNOSTICO_*.js"
        )
        
        for pattern in "${DEBUG_FILES[@]}"; do
            for file in $pattern; do
                if [[ -f "$file" && "$file" != "$pattern" ]]; then
                    echo "   🗑️ Removendo: $file"
                    cp "$file" "$BACKUP_DIR/" 2>/dev/null
                    rm "$file"
                fi
            done
        done
        echo "✅ Arquivos de debug/teste removidos!"
    fi
    
    # VERIFICAÇÃO FINAL
    echo ""
    echo "✅ LIMPEZA CONCLUÍDA!"
    echo "===================="
    echo "📊 Resumo:"
    echo "   • Backup criado em: $BACKUP_DIR"
    echo "   • Arquivos de editor redundantes removidos: ${#EDITOR_FILES[@]}"
    echo "   • Configurações duplicadas removidas: ${#CONFIG_FILES[@]}"
    
    # Verificar se ainda há problemas
    echo ""
    echo "🔍 Verificação pós-limpeza:"
    
    # Verificar build
    if ask_confirmation "🔨 Executar build para verificar integridade?"; then
        echo "🔨 Executando build..."
        if npm run build; then
            echo "✅ Build bem-sucedido!"
        else
            echo "❌ Erro no build - verifique os logs"
            echo "💡 Para restaurar backup: cp $BACKUP_DIR/* src/pages/"
        fi
    fi
    
    # Verificar TypeScript
    if ask_confirmation "📝 Executar verificação TypeScript?"; then
        echo "📝 Verificando TypeScript..."
        if npx tsc --noEmit; then
            echo "✅ TypeScript sem erros!"
        else
            echo "❌ Erros TypeScript encontrados"
        fi
    fi
    
    echo ""
    echo "🎯 PRÓXIMOS PASSOS RECOMENDADOS:"
    echo "1. Testar a aplicação: npm run dev"
    echo "2. Verificar todas as rotas funcionam"
    echo "3. Executar testes: npm test"
    echo "4. Commit das mudanças: git add . && git commit -m 'cleanup: remove duplicate files'"
    echo "5. Remover backup se tudo estiver ok: rm -rf $BACKUP_DIR"
    
else
    echo "🔄 Limpeza cancelada pelo usuário"
    echo "📦 Backup criado em: $BACKUP_DIR (pode ser removido)"
fi

echo ""
echo "🏁 Script finalizado!"
