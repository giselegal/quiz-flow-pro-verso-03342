#!/bin/bash

# 🚀 PRETTIER AVANÇADO: Tudo que você pode fazer para deixar o código MAIS BONITO
echo "🎨 PRETTIER AVANÇADO: CÓDIGO SUPER PROFISSIONAL"
echo "==============================================="
echo ""

echo "🌟 1. CONFIGURAÇÕES AVANÇADAS DE BELEZA:"
echo "========================================"

# Criar configuração SUPER otimizada
cat > .prettierrc.super-beautiful.json << 'EOF'
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "jsxSingleQuote": false,
  "quoteProps": "as-needed",
  "htmlWhitespaceSensitivity": "css",
  "vueIndentScriptAndStyle": false,
  "embeddedLanguageFormatting": "auto",
  "singleAttributePerLine": false,
  "bracketSameLine": false
}
EOF

echo "✅ Configuração SUPER BONITA criada: .prettierrc.super-beautiful.json"
echo ""

echo "🎯 2. PRETTIER + ESLINT (Combo Perfeito):"
echo "========================================"
echo "Instalar ESLint + Prettier juntos:"
echo "npm install --save-dev eslint-config-prettier eslint-plugin-prettier"
echo ""

echo "🔧 3. FORMATAÇÃO AUTOMÁTICA POR TIPO:"
echo "===================================="

# Scripts super específicos
echo "# Formatar apenas JSX/TSX (componentes React):"
echo "npx prettier --write 'src/**/*.{jsx,tsx}'"
echo ""
echo "# Formatar apenas TypeScript:"
echo "npx prettier --write 'src/**/*.{ts,tsx}'"
echo ""
echo "# Formatar apenas CSS/SCSS:"
echo "npx prettier --write 'src/**/*.{css,scss,less}'"
echo ""
echo "# Formatar apenas arquivos de configuração:"
echo "npx prettier --write '*.{json,js,ts}'"
echo ""

echo "🎨 4. FORMATAÇÃO COM PLUGINS ESPECIAIS:"
echo "====================================="
echo "# Plugin para Tailwind CSS (organizar classes):"
echo "npm install -D prettier-plugin-tailwindcss"
echo ""
echo "# Plugin para importações (organizar imports):"
echo "npm install -D @trivago/prettier-plugin-sort-imports"
echo ""

# Configuração com plugins
cat > .prettierrc.with-plugins << 'EOF'
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "plugins": [
    "prettier-plugin-tailwindcss",
    "@trivago/prettier-plugin-sort-imports"
  ],
  "importOrder": [
    "^react(.*)$",
    "^@/(.*)$",
    "^[./]"
  ],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true
}
EOF

echo "✅ Configuração com PLUGINS criada: .prettierrc.with-plugins"
echo ""

echo "⚡ 5. SCRIPTS AUTOMATIZADOS AVANÇADOS:"
echo "===================================="

# Criar package.json scripts avançados
echo "Adicione estes scripts ao seu package.json:"
cat << 'EOF'
{
  "scripts": {
    "format:super": "prettier --config .prettierrc.super-beautiful.json --write .",
    "format:react": "prettier --write 'src/**/*.{jsx,tsx}'",
    "format:styles": "prettier --write 'src/**/*.{css,scss,less}'",
    "format:config": "prettier --write '*.{json,js,ts}'",
    "format:check:all": "prettier --check .",
    "format:diff": "prettier --list-different .",
    "format:staged": "prettier --write $(git diff --cached --name-only --diff-filter=ACMR | grep -E '\\.(js|jsx|ts|tsx|css|scss|json)$')",
    "format:watch": "onchange 'src/**/*.{js,jsx,ts,tsx}' -- prettier --write {{changed}}"
  }
}
EOF
echo ""

echo "🔍 6. VALIDAÇÃO E QUALIDADE AVANÇADA:"
echo "===================================="
echo "# Verificar se há arquivos mal formatados:"
echo "npm run format:check:all"
echo ""
echo "# Listar arquivos que precisam ser formatados:"
echo "npm run format:diff"
echo ""
echo "# Formatar apenas arquivos staged no git:"
echo "npm run format:staged"
echo ""

echo "🎭 7. INTEGRAÇÃO COM GIT HOOKS:"
echo "============================="
echo "# Instalar husky para hooks automáticos:"
echo "npm install -D husky lint-staged"
echo ""

# Criar configuração lint-staged
cat > lint-staged.config.js << 'EOF'
module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'prettier --write',
    'eslint --fix'
  ],
  '*.{css,scss,less}': [
    'prettier --write'
  ],
  '*.{json,md}': [
    'prettier --write'
  ]
}
EOF

echo "✅ Configuração lint-staged criada"
echo ""

echo "🎨 8. CONFIGURAÇÕES POR LINGUAGEM:"
echo "================================="

# Configuração específica por arquivo
cat > .prettierrc.yaml << 'EOF'
# Configuração geral
semi: true
trailingComma: 'all'
singleQuote: true
printWidth: 100
tabWidth: 2

# Configurações específicas por tipo de arquivo
overrides:
  - files: "*.{js,jsx,ts,tsx}"
    options:
      printWidth: 100
      tabWidth: 2
      semi: true
      
  - files: "*.{css,scss,less}"
    options:
      printWidth: 120
      tabWidth: 2
      
  - files: "*.{json,yml,yaml}"
    options:
      printWidth: 80
      tabWidth: 2
      
  - files: "*.md"
    options:
      printWidth: 80
      proseWrap: "always"
EOF

echo "✅ Configuração YAML avançada criada"
echo ""

echo "🚀 9. FORMATAÇÃO EDITOR-FIXED PREMIUM:"
echo "====================================="

# Script específico para editor-fixed com configurações premium
cat > format-editor-premium.sh << 'EOF'
#!/bin/bash

echo "🎨 FORMATAÇÃO PREMIUM: Editor Fixed"
echo "==================================="

# 1. Backup antes da formatação
echo "📋 Criando backup..."
cp -r src/pages/editor-fixed* backup/ 2>/dev/null || mkdir -p backup && cp -r src/pages/editor-fixed* backup/
cp src/components/editor/OptimizedPropertiesPanel.tsx backup/ 2>/dev/null

# 2. Formatação com configuração premium
echo "✨ Aplicando formatação premium..."
prettier --config .prettierrc.super-beautiful.json --write "src/**/*editor-fixed*"
prettier --config .prettierrc.super-beautiful.json --write "src/components/editor/OptimizedPropertiesPanel.tsx"

# 3. Organizar imports (se plugin instalado)
echo "🔄 Organizando imports..."
prettier --config .prettierrc.with-plugins --write "src/**/*editor-fixed*" 2>/dev/null || echo "Plugin de imports não instalado"

# 4. Verificar resultado
echo "🔍 Verificando qualidade..."
prettier --check "src/**/*editor-fixed*" && echo "✅ Formatação perfeita!" || echo "⚠️ Alguns arquivos podem precisar de ajustes"

echo "🎉 Formatação premium concluída!"
EOF

chmod +x format-editor-premium.sh
echo "✅ Script premium criado: format-editor-premium.sh"
echo ""

echo "🎪 10. CONFIGURAÇÃO VS CODE PROFISSIONAL:"
echo "========================================"

# Configuração VS Code otimizada
mkdir -p .vscode
cat > .vscode/settings.json << 'EOF'
{
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "prettier.configPath": ".prettierrc.super-beautiful.json",
  "prettier.requireConfig": true,
  "editor.rulers": [100],
  "editor.wordWrap": "bounded",
  "editor.wordWrapColumn": 100,
  "files.associations": {
    "*.tsx": "typescriptreact",
    "*.ts": "typescript"
  },
  "typescript.preferences.organizeImports": true,
  "editor.suggest.insertMode": "replace",
  "editor.acceptSuggestionOnEnter": "on"
}
EOF

echo "✅ Configuração VS Code premium criada"
echo ""

echo "🌈 11. TEMAS E PERSONALIZAÇÕES:"
echo "=============================="
echo "Extensões VS Code recomendadas:"
echo "- Prettier - Code formatter"
echo "- ESLint"
echo "- Auto Rename Tag"
echo "- Bracket Pair Colorizer"
echo "- Indent Rainbow"
echo "- Material Icon Theme"
echo "- One Dark Pro (tema)"
echo ""

echo "🎯 12. COMANDOS MÁGICOS DISPONÍVEIS:"
echo "==================================="
echo "# Formatação super bonita:"
echo "./format-editor-premium.sh"
echo ""
echo "# Formatação com plugins:"
echo "npm run format:super"
echo ""
echo "# Formatação por tipo:"
echo "npm run format:react    # Apenas React"
echo "npm run format:styles   # Apenas CSS"
echo ""
echo "# Formatação inteligente:"
echo "npm run format:staged   # Apenas arquivos modificados"
echo ""

echo "💎 13. RESULTADO ESPERADO:"
echo "========================"
echo "✨ Código perfeitamente alinhado"
echo "🎨 Indentação consistente"
echo "🔄 Imports organizados automaticamente"
echo "🎯 Classes Tailwind ordenadas"
echo "📝 Comentários bem formatados"
echo "🚀 Performance de leitura melhorada"
echo "💫 Aparência profissional"
echo ""

echo "🎉 PRETTIER SUPER AVANÇADO CONFIGURADO!"
echo "======================================"
echo "Agora você tem o setup mais profissional possível! 🚀"
echo ""
echo "🎯 PRÓXIMOS PASSOS:"
echo "1. Execute: ./format-editor-premium.sh"
echo "2. Instale os plugins: npm install -D prettier-plugin-tailwindcss"
echo "3. Configure VS Code com as configurações criadas"
echo "4. Aproveite o código mais bonito do mundo! ✨"
