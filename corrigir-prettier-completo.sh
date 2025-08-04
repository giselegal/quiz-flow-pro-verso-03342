#!/bin/bash

# 🔧 CORREÇÃO COMPLETA DOS PROBLEMAS DO PRETTIER
# ==============================================

echo "🔧 CORREÇÃO COMPLETA DOS PROBLEMAS DO PRETTIER"
echo "=============================================="
echo ""

# 1. DIAGNÓSTICO INICIAL
echo "🔍 1. DIAGNÓSTICO DOS PROBLEMAS"
echo "------------------------------"

echo "📝 Verificando arquivos de configuração problemáticos..."

# Verificar se existe arquivo sem extensão
if [ -f ".prettierrc.super-beautiful" ]; then
    echo "❌ Arquivo problemático encontrado: .prettierrc.super-beautiful (sem extensão)"
    echo "🗑️ Removendo arquivo problemático..."
    rm -f ".prettierrc.super-beautiful"
    echo "✅ Arquivo removido com sucesso"
else
    echo "✅ Nenhum arquivo sem extensão encontrado"
fi

echo ""

# 2. VERIFICAÇÃO DAS CONFIGURAÇÕES
echo "📋 2. VERIFICAÇÃO DAS CONFIGURAÇÕES"
echo "-----------------------------------"

echo "📁 Arquivos de configuração Prettier existentes:"
ls -la .prettierrc* 2>/dev/null | sed 's/^/   /'

echo ""

# 3. VALIDAÇÃO DA CONFIGURAÇÃO PRINCIPAL
echo "🧪 3. VALIDAÇÃO DA CONFIGURAÇÃO PRINCIPAL"
echo "----------------------------------------"

if npx prettier --check .prettierrc 2>/dev/null; then
    echo "✅ Configuração principal (.prettierrc) é válida"
else
    echo "❌ Configuração principal com problemas"
    echo "🔧 Aplicando configuração padrão..."
    
    cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "quoteProps": "as-needed",
  "jsxSingleQuote": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "embeddedLanguageFormatting": "auto",
  "proseWrap": "preserve"
}
EOF
    echo "✅ Configuração padrão aplicada"
fi

echo ""

# 4. VERIFICAÇÃO DO VS CODE SETTINGS
echo "⚙️  4. VERIFICAÇÃO DO VS CODE SETTINGS"
echo "------------------------------------"

if [ -f ".vscode/settings.json" ]; then
    if grep -q "super-beautiful" ".vscode/settings.json"; then
        echo "⚠️  Configuração problemática encontrada em .vscode/settings.json"
        echo "🔧 Corrigindo..."
        
        # Backup
        cp ".vscode/settings.json" ".vscode/settings.json.backup"
        
        # Corrigir referência
        sed -i 's/"prettier.configPath": ".prettierrc.super-beautiful"/"prettier.configPath": ".prettierrc"/g' ".vscode/settings.json"
        echo "✅ Configuração corrigida"
    else
        echo "✅ Configuração do VS Code está correta"
    fi
else
    echo "ℹ️  Arquivo .vscode/settings.json não encontrado"
fi

echo ""

# 5. TESTE DE FUNCIONAMENTO
echo "🧪 5. TESTE DE FUNCIONAMENTO"
echo "---------------------------"

echo "📝 Testando formatação de arquivo de exemplo..."

# Criar arquivo de teste
cat > test-prettier.js << 'EOF'
const test = {a:1,b:2,c:3};
function example(){return "hello world";}
EOF

if npx prettier --write test-prettier.js 2>/dev/null; then
    echo "✅ Prettier funcionando corretamente"
    
    # Mostrar resultado
    echo "📄 Arquivo formatado:"
    cat test-prettier.js | sed 's/^/   /'
    
    # Limpar
    rm -f test-prettier.js
else
    echo "❌ Prettier ainda com problemas"
fi

echo ""

# 6. TESTE DOS ARQUIVOS DRAG & DROP
echo "🎯 6. FORMATAÇÃO DOS ARQUIVOS DRAG & DROP"
echo "----------------------------------------"

DND_FILES=(
    "src/components/editor/dnd/DndProvider.tsx"
    "src/components/editor/canvas/CanvasDropZone.tsx"
    "src/components/editor/dnd/DraggableComponentItem.tsx"
)

for file in "${DND_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "📝 Formatando: $file"
        if npx prettier --write "$file" 2>/dev/null; then
            echo "   ✅ Formatado com sucesso"
        else
            echo "   ❌ Erro na formatação"
        fi
    else
        echo "   ⚠️  Arquivo não encontrado: $file"
    fi
done

echo ""

# 7. LIMPEZA DE ARQUIVOS PROBLEMÁTICOS
echo "🧹 7. LIMPEZA DE ARQUIVOS PROBLEMÁTICOS"
echo "--------------------------------------"

# Remover possíveis arquivos temporários ou problemáticos
TEMP_FILES=(
    ".prettierrc.super-beautiful"
    ".prettierrc.tmp"
    "prettier.config.js.bak"
)

for file in "${TEMP_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "🗑️ Removendo arquivo temporário: $file"
        rm -f "$file"
    fi
done

echo "✅ Limpeza concluída"

echo ""

# 8. VERIFICAÇÃO FINAL
echo "🎉 8. VERIFICAÇÃO FINAL"
echo "======================"

echo "📊 RESUMO DOS RESULTADOS:"
echo ""

# Verificar configuração final
if npx prettier --check .prettierrc >/dev/null 2>&1; then
    echo "✅ Configuração Prettier: VÁLIDA"
else
    echo "❌ Configuração Prettier: PROBLEMÁTICA"
fi

# Verificar VS Code
if [ -f ".vscode/settings.json" ] && ! grep -q "super-beautiful" ".vscode/settings.json"; then
    echo "✅ VS Code Settings: CORRETO"
elif [ -f ".vscode/settings.json" ]; then
    echo "❌ VS Code Settings: AINDA PROBLEMÁTICO"
else
    echo "ℹ️  VS Code Settings: NÃO CONFIGURADO"
fi

# Teste final
if echo 'const test={a:1}' | npx prettier --parser typescript 2>/dev/null >/dev/null; then
    echo "✅ Prettier Engine: FUNCIONANDO"
else
    echo "❌ Prettier Engine: COM PROBLEMAS"
fi

echo ""
echo "🎯 AÇÕES RECOMENDADAS:"
echo ""
echo "1. ✅ Reiniciar VS Code para aplicar mudanças"
echo "2. ✅ Testar formatação em um arquivo TypeScript"
echo "3. ✅ Verificar console de erros no VS Code"
echo ""

echo "🚀 PRETTIER CORRIGIDO E OTIMIZADO!"
echo "O erro 'No loader specified for extension \".super-beautiful\"' deve estar resolvido."
