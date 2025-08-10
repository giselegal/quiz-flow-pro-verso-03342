#!/bin/bash

# 🎛️ PRETTIER + CONFIGURAÇÃO DE PROPRIEDADES: Guia Completo
echo "🎛️ PRETTIER + PROPRIEDADES DE COMPONENTES"
echo "=========================================="
echo ""

echo "🔍 1. O QUE O PRETTIER PODE FAZER:"
echo "================================="
echo "✅ Formatar estrutura de propriedades"
echo "✅ Organizar props em ordem alfabética"
echo "✅ Quebrar linhas em props longas"
echo "✅ Padronizar aspas e espaçamento"
echo "❌ NÃO configura valores de propriedades"
echo "❌ NÃO define tipos de propriedades"
echo "❌ NÃO cria interfaces automaticamente"
echo ""

echo "🎨 2. FORMATAÇÃO DE PROPRIEDADES QUE O PRETTIER FAZ:"
echo "=================================================="

# Criar exemplo de como o Prettier formata propriedades
cat > exemplo-formatacao-propriedades.tsx << 'EOF'
// ANTES da formatação Prettier:
const ComponenteAntes = () => (
  <OptimizedPropertiesPanel block={{id:'test',type:'button',content:{text:'Click me',color:'blue',size:'large',disabled:false}}} blockDefinition={getBlockDefinition('button')} onUpdateBlock={(id,updates)=>{console.log(id,updates);}} onClose={()=>setSelectedBlockId(null)}/>
);

// DEPOIS da formatação Prettier:
const ComponenteDepois = () => (
  <OptimizedPropertiesPanel
    block={{
      id: 'test',
      type: 'button',
      content: {
        text: 'Click me',
        color: 'blue',
        size: 'large',
        disabled: false,
      },
    }}
    blockDefinition={getBlockDefinition('button')}
    onUpdateBlock={(id, updates) => {
      console.log(id, updates);
    }}
    onClose={() => setSelectedBlockId(null)}
  />
);
EOF

echo "✅ Exemplo criado: exemplo-formatacao-propriedades.tsx"
echo ""

echo "🔧 3. CONFIGURAÇÃO PRETTIER PARA PROPRIEDADES:"
echo "=============================================="

# Configuração específica para propriedades
cat > .prettierrc.properties << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "jsxSingleQuote": false,
  "jsxBracketSameLine": false,
  "arrowParens": "avoid",
  "objectCurlySpacing": true,
  "arrayBracketSpacing": false,
  "quoteProps": "as-needed",
  "endOfLine": "lf"
}
EOF

echo "✅ Configuração para propriedades criada: .prettierrc.properties"
echo ""

echo "🎯 4. PLUGIN PERSONALIZADO PARA PROPRIEDADES:"
echo "============================================="

# Criar plugin customizado para organizar propriedades
cat > prettier-plugin-component-props.js << 'EOF'
// Plugin customizado para organizar propriedades de componentes
const plugin = {
  name: 'prettier-plugin-component-props',
  
  // Organizar props por categoria
  organizeProps: (props) => {
    const categories = {
      data: ['block', 'blockDefinition', 'data', 'content'],
      events: ['onClick', 'onUpdateBlock', 'onChange', 'onClose'],
      styling: ['className', 'style', 'variant', 'size', 'color'],
      state: ['disabled', 'loading', 'selected', 'active'],
      other: []
    };
    
    // Implementação do organizador
    return props.sort((a, b) => {
      const categoryA = getCategoryForProp(a, categories);
      const categoryB = getCategoryForProp(b, categories);
      
      if (categoryA !== categoryB) {
        return categoryOrder.indexOf(categoryA) - categoryOrder.indexOf(categoryB);
      }
      
      return a.name.localeCompare(b.name);
    });
  }
};

module.exports = plugin;
EOF

echo "✅ Plugin customizado criado: prettier-plugin-component-props.js"
echo ""

echo "⚙️ 5. CONFIGURAÇÃO AVANÇADA PARA EDITOR-FIXED:"
echo "=============================================="

# Configuração específica para componentes do editor
cat > .prettierrc.editor-components << 'EOF'
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 120,
  "tabWidth": 2,
  "jsxSingleQuote": false,
  "jsxBracketSameLine": false,
  "arrowParens": "avoid",
  
  "overrides": [
    {
      "files": ["**/OptimizedPropertiesPanel.tsx", "**/editor-fixed*.tsx"],
      "options": {
        "printWidth": 100,
        "singleAttributePerLine": true,
        "jsxBracketSameLine": false
      }
    },
    {
      "files": ["**/*Block.tsx", "**/*Component.tsx"],
      "options": {
        "printWidth": 120,
        "singleAttributePerLine": false
      }
    }
  ]
}
EOF

echo "✅ Configuração para componentes criada: .prettierrc.editor-components"
echo ""

echo "🚀 6. SCRIPT AVANÇADO DE FORMATAÇÃO DE PROPRIEDADES:"
echo "=================================================="

# Script para formatar especificamente propriedades
cat > format-component-properties.sh << 'EOF'
#!/bin/bash

echo "🎛️ FORMATAÇÃO AVANÇADA: Propriedades de Componentes"
echo "=================================================="

# 1. Formatar com configuração específica para propriedades
echo "🔧 Aplicando formatação de propriedades..."
npx prettier --config .prettierrc.properties --write "src/**/*editor-fixed*"
npx prettier --config .prettierrc.properties --write "src/components/editor/OptimizedPropertiesPanel.tsx"

# 2. Formatar componentes com configuração específica
echo "🎨 Aplicando formatação de componentes..."
npx prettier --config .prettierrc.editor-components --write "src/components/editor/blocks/**/*.tsx"

# 3. Verificar resultado
echo "🔍 Verificando formatação de propriedades..."
npx prettier --config .prettierrc.properties --check "src/**/*editor-fixed*" && echo "✅ Propriedades formatadas!" || echo "⚠️ Problemas detectados"

echo "🎉 Formatação de propriedades concluída!"
EOF

chmod +x format-component-properties.sh
echo "✅ Script de propriedades criado: format-component-properties.sh"
echo ""

echo "💡 7. FERRAMENTAS COMPLEMENTARES PARA PROPRIEDADES:"
echo "=================================================="
echo ""
echo "🔧 TypeScript + Prettier (Recomendado):"
echo "  • Define interfaces para propriedades"
echo "  • Prettier formata a estrutura"
echo "  • IntelliSense para autocompletar"
echo ""
echo "🎯 ESLint + Prettier:"
echo "  • Regras para ordem de propriedades"
echo "  • Validação de props obrigatórias"
echo "  • Formatação automática"
echo ""
echo "⚡ Plugins adicionais:"
echo "  • @typescript-eslint/eslint-plugin"
echo "  • eslint-plugin-react"
echo "  • eslint-plugin-react-hooks"
echo ""

echo "🎨 8. EXEMPLO PRÁTICO - OPTIMIZEDPROPERTIESPANEL:"
echo "=============================================="

# Criar exemplo específico para OptimizedPropertiesPanel
cat > exemplo-optimized-properties-formatado.tsx << 'EOF'
// Exemplo de como o Prettier formata OptimizedPropertiesPanel

// ANTES:
<OptimizedPropertiesPanel block={{id:'btn-1',type:'button',content:{text:'Save',color:'#3b82f6',disabled:false}}} blockDefinition={buttonBlockDef} onUpdateBlock={(blockId,updates)=>{updateBlock(blockId,{content:updates});}} onClose={()=>setSelectedBlockId(null)}/>

// DEPOIS:
<OptimizedPropertiesPanel
  block={{
    id: 'btn-1',
    type: 'button',
    content: {
      text: 'Save',
      color: '#3b82f6',
      disabled: false,
    },
  }}
  blockDefinition={buttonBlockDef}
  onUpdateBlock={(blockId, updates) => {
    updateBlock(blockId, { content: updates });
  }}
  onClose={() => setSelectedBlockId(null)}
/>

// Com configuração avançada (singleAttributePerLine: true):
<OptimizedPropertiesPanel
  block={{
    id: 'btn-1',
    type: 'button',
    content: {
      text: 'Save',
      color: '#3b82f6',
      disabled: false,
    },
  }}
  blockDefinition={buttonBlockDef}
  onUpdateBlock={(blockId, updates) => {
    updateBlock(blockId, { content: updates });
  }}
  onClose={() => setSelectedBlockId(null)}
/>
EOF

echo "✅ Exemplo prático criado: exemplo-optimized-properties-formatado.tsx"
echo ""

echo "📋 9. COMANDOS ESPECÍFICOS PARA PROPRIEDADES:"
echo "==========================================="
echo ""
echo "# Formatar apenas propriedades:"
echo "./format-component-properties.sh"
echo ""
echo "# Formatar com configuração específica:"
echo "npx prettier --config .prettierrc.properties --write 'src/**/*.tsx'"
echo ""
echo "# Formatar componentes específicos:"
echo "npx prettier --config .prettierrc.editor-components --write 'src/components/editor/'"
echo ""

echo "🎯 10. LIMITAÇÕES E SOLUÇÕES:"
echo "============================"
echo ""
echo "❌ PRETTIER NÃO FAZ:"
echo "  • Configurar valores de propriedades"
echo "  • Definir tipos automaticamente"
echo "  • Validar propriedades obrigatórias"
echo "  • Gerar interfaces automaticamente"
echo ""
echo "✅ SOLUÇÕES COMPLEMENTARES:"
echo "  • TypeScript para tipos e interfaces"
echo "  • ESLint para validação de props"
echo "  • Storybook para documentação"
echo "  • PropTypes para validação runtime"
echo ""

echo "💎 RESULTADO ESPERADO:"
echo "====================="
echo "✨ Propriedades perfeitamente formatadas"
echo "🎯 Estrutura consistente em todos os componentes"
echo "📝 Código mais legível e profissional"
echo "🔧 Configuração específica para editor-fixed"
echo ""

echo "🎉 CONFIGURAÇÃO DE PROPRIEDADES CRIADA!"
echo "======================================="
echo "Agora você tem ferramentas específicas para formatar propriedades! 🚀"
echo ""
echo "🎯 PRÓXIMOS PASSOS:"
echo "1. Execute: ./format-component-properties.sh"
echo "2. Configure TypeScript para tipos de propriedades"
echo "3. Use ESLint para validação adicional"
echo "4. Aproveite propriedades perfeitamente formatadas! ✨"
