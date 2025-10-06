#!/bin/bash
# 🎛️ Script para gerenciar Feature Flags do Editor

set -e

PROJECT_DIR="/workspaces/quiz-quest-challenge-verse"
ENV_FILE="$PROJECT_DIR/.env.local"

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🎛️  Feature Flag Manager - Editor Unificado"
echo "=========================================="
echo

# Função para verificar status atual
check_status() {
    if [ -f "$ENV_FILE" ]; then
        if grep -q "VITE_ENABLE_UNIFIED_EDITOR_FACADE=true" "$ENV_FILE" || grep -q "VITE_FORCE_UNIFIED_EDITOR=true" "$ENV_FILE"; then
            echo -e "${GREEN}✅ Editor Unificado: ATIVO${NC}"
        else
            echo -e "${YELLOW}⚠️  Editor Unificado: INATIVO${NC}"
        fi
        echo
        echo "Configuração atual:"
        cat "$ENV_FILE"
    else
        echo -e "${RED}❌ Arquivo .env.local não encontrado${NC}"
    fi
}

# Função para ativar
enable() {
    cat > "$ENV_FILE" << 'EOF'
# 🚀 FEATURE FLAGS - EDITOR UNIFICADO
# Ativa o editor WYSIWYG com FunnelEditingFacade
VITE_ENABLE_UNIFIED_EDITOR_FACADE=true

# Força o uso do editor unificado (sobrescreve outras flags)
VITE_FORCE_UNIFIED_EDITOR=true
EOF
    echo -e "${GREEN}✅ Editor Unificado ativado!${NC}"
    echo
    echo "Reinicie o servidor de desenvolvimento para aplicar:"
    echo "  npm run dev"
}

# Função para desativar
disable() {
    cat > "$ENV_FILE" << 'EOF'
# 🚀 FEATURE FLAGS - EDITOR UNIFICADO
# Desativa o editor WYSIWYG com FunnelEditingFacade
VITE_ENABLE_UNIFIED_EDITOR_FACADE=false

# Força o uso do editor unificado (sobrescreve outras flags)
VITE_FORCE_UNIFIED_EDITOR=false
EOF
    echo -e "${YELLOW}⚠️  Editor Unificado desativado!${NC}"
    echo
    echo "Reinicie o servidor de desenvolvimento para aplicar:"
    echo "  npm run dev"
}

# Menu
case "${1:-}" in
    status|"")
        check_status
        ;;
    enable|on)
        enable
        ;;
    disable|off)
        disable
        ;;
    *)
        echo "Uso: $0 [status|enable|disable]"
        echo
        echo "Comandos:"
        echo "  status  - Mostra o status atual (padrão)"
        echo "  enable  - Ativa o editor unificado"
        echo "  disable - Desativa o editor unificado"
        exit 1
        ;;
esac
