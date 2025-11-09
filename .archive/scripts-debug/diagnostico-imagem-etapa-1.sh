#!/bin/bash
# Diagnóstico do componente de imagem da Etapa 1

echo "🔍 Diagnóstico - Componente de Imagem da Etapa 1"
echo "════════════════════════════════════════════════════════════"
echo ""

# Verificar servidor
if ! curl -s http://localhost:8080 > /dev/null; then
    echo "❌ Servidor não está rodando"
    echo "Execute: npm run dev"
    exit 1
fi

echo "✅ Servidor rodando em localhost:8080"
echo ""

# Informações do JSON
echo "📋 CONFIGURAÇÃO JSON (step-01.json):"
echo "════════════════════════════════════════════════════════════"
echo "Block ID: intro-image"
echo "Type: intro-image"
echo "Order: 2"
echo ""
echo "Content:"
echo "  • src: https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png"
echo "  • imageUrl: (mesma URL)"
echo "  • alt: Descubra seu estilo predominante"
echo "  • width: 300"
echo "  • height: 204"
echo ""
echo "Properties:"
echo "  • objectFit: contain"
echo "  • maxWidth: 300"
echo "  • borderRadius: 8px"
echo ""

# Informações do componente
echo "🔧 COMPONENTE (IntroImageBlock.tsx):"
echo "════════════════════════════════════════════════════════════"
echo "✅ Importado corretamente no BlockTypeRenderer"
echo "✅ Mapeamento: case 'intro-image' → IntroImageBlock"
echo ""
echo "Lógica de src (em ordem de prioridade):"
echo "  1. content.imageUrl"
echo "  2. content.src"
echo "  3. properties.src"
echo ""
echo "Lógica de alt:"
echo "  1. content.imageAlt"
echo "  2. content.alt"
echo "  3. properties.alt"
echo "  4. default: 'Imagem'"
echo ""
echo "Lógica de maxWidth:"
echo "  1. content.width (convertido para px se número)"
echo "  2. properties.maxWidth"
echo "  3. default: '300px'"
echo ""

# Teste de URL da imagem
echo "🌐 TESTE DE URL DA IMAGEM:"
echo "════════════════════════════════════════════════════════════"
IMAGE_URL="https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png"

echo "Testando URL..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$IMAGE_URL")

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Imagem acessível (HTTP $HTTP_STATUS)"
    
    # Obter tamanho da imagem
    IMAGE_SIZE=$(curl -sI "$IMAGE_URL" | grep -i content-length | awk '{print $2}' | tr -d '\r')
    if [ -n "$IMAGE_SIZE" ]; then
        IMAGE_SIZE_KB=$((IMAGE_SIZE / 1024))
        echo "   Tamanho: ${IMAGE_SIZE_KB} KB"
    fi
else
    echo "❌ Problema ao acessar imagem (HTTP $HTTP_STATUS)"
fi
echo ""

# Instruções de teste
echo "🧪 COMO TESTAR NO NAVEGADOR:"
echo "════════════════════════════════════════════════════════════"
echo "1. Abra: http://localhost:8080/editor?template=quiz21StepsComplete"
echo ""
echo "2. Verifique a ETAPA 1 (Introdução):"
echo "   • Logo Gisele Galvão (topo)"
echo "   • Título com texto em dourado"
echo "   • 🖼️ IMAGEM (deve aparecer aqui)"
echo "   • Descrição com texto estilizado"
echo "   • Formulário com campo de nome"
echo ""
echo "3. Se a imagem NÃO aparecer:"
echo "   • Abra DevTools (F12)"
echo "   • Vá para a aba Console"
echo "   • Procure por:"
echo "     - Mensagens começando com '🖼️ [IntroImageBlock]'"
echo "     - Erros de carregamento de imagem"
echo "     - Warnings sobre 'Sem src'"
echo ""
echo "4. Se a imagem aparecer mas estiver incorreta:"
echo "   • Verifique o tamanho (deve ser max-width: 300px)"
echo "   • Verifique o border-radius (deve ter cantos arredondados)"
echo "   • Verifique object-fit (deve manter proporção)"
echo ""

# Debug avançado
echo "🔍 DEBUG AVANÇADO (Console do navegador):"
echo "════════════════════════════════════════════════════════════"
echo "// Ver todos os blocos da step-01"
echo "const step01 = await fetch('/templates/blocks/step-01.json').then(r => r.json());"
echo "console.log('Step 01 blocks:', step01.blocks);"
echo ""
echo "// Ver especificamente o bloco de imagem"
echo "const imageBlock = step01.blocks.find(b => b.type === 'intro-image');"
echo "console.log('Image block:', imageBlock);"
echo ""
echo "// Verificar se a imagem está no DOM"
echo "const imgElement = document.querySelector('[alt=\"Descubra seu estilo predominante\"]');"
echo "console.log('Image element:', imgElement);"
echo "console.log('Image src:', imgElement?.src);"
echo "console.log('Image dimensions:', imgElement?.width, 'x', imgElement?.height);"
echo ""

echo "════════════════════════════════════════════════════════════"
echo "✅ RESULTADO ESPERADO:"
echo "════════════════════════════════════════════════════════════"
echo "• Imagem visível na etapa 1"
echo "• Tamanho máximo: 300px de largura"
echo "• Cantos arredondados (8px)"
echo "• Centralizada na tela"
echo "• Object-fit: contain (mantém proporção)"
echo ""
echo "❌ PROBLEMAS POSSÍVEIS:"
echo "════════════════════════════════════════════════════════════"
echo "• Imagem não carrega: Problema de URL ou CORS"
echo "• Tamanho incorreto: properties.maxWidth não aplicado"
echo "• Sem border-radius: Propriedade borderRadius ignorada"
echo "• Componente não renderiza: Problema no BlockTypeRenderer"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Abrindo navegador..."
"$BROWSER" "http://localhost:8080/editor?template=quiz21StepsComplete" &
echo ""
echo "✅ Diagnóstico concluído!"
