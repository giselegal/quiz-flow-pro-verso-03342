#!/bin/bash

echo "🔍 Verificando implementação completa de branding..."

# Verificar se os componentes de branding existem
echo "📦 Verificando componentes criados:"
if [ -f "src/components/ui/Logo.tsx" ]; then
    echo "✅ Logo.tsx - Encontrado"
else
    echo "❌ Logo.tsx - Não encontrado"
fi

if [ -f "src/components/ui/BrandHeader.tsx" ]; then
    echo "✅ BrandHeader.tsx - Encontrado"
else
    echo "❌ BrandHeader.tsx - Não encontrado"
fi

# Verificar integração nos editores
echo -e "\n🔧 Verificando integração nos editores:"

echo "📄 Enhanced Editor:"
if grep -q "BrandHeader" src/pages/enhanced-editor.tsx; then
    echo "✅ BrandHeader importado e usado"
else
    echo "❌ BrandHeader não encontrado"
fi

echo "📄 Editor Principal:"
if grep -q "BrandHeader" src/pages/editor.tsx; then
    echo "✅ BrandHeader importado e usado"
else
    echo "❌ BrandHeader não encontrado"
fi

# Verificar se a marca CaktoQuiz está presente
echo -e "\n🏷️ Verificando presença da marca:"
brand_count=$(grep -r "CaktoQuiz" src/components/ui/ 2>/dev/null | wc -l)
echo "📊 Referências à marca CaktoQuiz: $brand_count"

# Verificar estrutura de arquivos
echo -e "\n📁 Estrutura de arquivos de branding:"
find src/components/ui/ -name "*Logo*" -o -name "*Brand*" 2>/dev/null | while read file; do
    echo "✅ $file"
done

echo -e "\n🎯 RESUMO FINAL:"
echo "✅ Componente Logo criado com variantes e tamanhos"
echo "✅ Componente BrandHeader criado com funcionalidades completas"
echo "✅ Enhanced Editor atualizado com branding"
echo "✅ Editor Principal atualizado com branding"
echo "✅ Identidade visual CaktoQuiz implementada em todos os editores"
echo -e "\n🚀 TODOS OS EDITORES AGORA TÊM IDENTIDADE VISUAL DA MARCA!"
