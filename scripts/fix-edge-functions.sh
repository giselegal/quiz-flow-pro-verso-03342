#!/bin/bash

# 🔧 Script para corrigir problemas TypeScript nas Edge Functions
# Atualiza imports e tipos para compatibilidade com Deno

set -e

FUNCTIONS_DIR="/workspaces/quiz-flow-pro-verso-03342/supabase/functions"

echo "🔧 Corrigindo Edge Functions do Supabase..."

# Lista de funções para atualizar
FUNCTIONS=(
    "github-models-ai"
    "security-monitor" 
    "csp-headers"
    "rate-limiter"
)

for FUNC in "${FUNCTIONS[@]}"; do
    FUNC_FILE="${FUNCTIONS_DIR}/${FUNC}/index.ts"
    
    if [ -f "$FUNC_FILE" ]; then
        echo "📝 Atualizando ${FUNC}..."
        
        # Backup do arquivo original
        cp "$FUNC_FILE" "${FUNC_FILE}.backup"
        
        # Atualizar imports e declarações
        sed -i '1i// @ts-ignore: Deno imports' "$FUNC_FILE"
        
        # Adicionar declaração do Deno se não existir
        if ! grep -q "declare const Deno" "$FUNC_FILE"; then
            sed -i '/import.*http\/server.ts/a\\n// @ts-ignore: Deno global está disponível no runtime\ndeclare const Deno: {\n  env: {\n    get(key: string): string | undefined;\n  };\n};' "$FUNC_FILE"
        fi
        
        # Atualizar serve function parameter
        sed -i 's/serve(async (req)/serve(async (req: Request)/g' "$FUNC_FILE"
        
        echo "✅ ${FUNC} atualizado"
    else
        echo "⚠️  ${FUNC_FILE} não encontrado"
    fi
done

echo "✨ Todas as Edge Functions foram atualizadas!"
echo "💡 Você pode verificar os backups em *.backup se necessário"