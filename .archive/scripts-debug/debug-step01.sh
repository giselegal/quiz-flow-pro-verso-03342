#!/bin/bash
# Debug da imagem do Step-01

echo "🔍 DEBUG - Imagem do Step-01"
echo "═══════════════════════════════════════════════════════════════"
echo ""

if ! curl -s http://localhost:8080 > /dev/null; then
    echo "❌ Servidor não está rodando"
    echo "Execute: npm run dev"
    exit 1
fi

echo "✅ Servidor rodando"
echo ""
echo "📋 OPÇÕES DE DEBUG:"
echo ""
echo "1️⃣  Página de Debug Interativa (RECOMENDADO)"
echo "    URL: http://localhost:8080/debug-step01-image.html"
echo "    • Interface visual completa"
echo "    • Verifica JSON e DOM automaticamente"
echo "    • Mostra todos os detalhes da imagem"
echo ""
echo "2️⃣  Script de Console (Manual)"
echo "    • Abra: http://localhost:8080/editor?template=quiz21StepsComplete"
echo "    • Pressione F12 (DevTools)"
echo "    • Vá para a aba Console"
echo "    • Cole e execute:"
echo ""
echo "    const script = document.createElement('script');"
echo "    script.src = '/debug-step01-console.js';"
echo "    document.head.appendChild(script);"
echo ""
echo "3️⃣  Verificação Rápida (Console)"
echo "    • Abra o editor (F12 → Console)"
echo "    • Execute:"
echo ""
echo "    const img = document.querySelector('[alt=\"Descubra seu estilo predominante\"]');"
echo "    console.log('Imagem encontrada?', !!img);"
echo "    console.log('URL:', img?.src);"
echo "    console.log('Visível?', img?.offsetWidth > 0 && img?.offsetHeight > 0);"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Opções interativas
PS3='Escolha uma opção: '
options=("Abrir Página de Debug" "Abrir Editor" "Verificar JSON" "Sair")
select opt in "${options[@]}"
do
    case $opt in
        "Abrir Página de Debug")
            echo ""
            echo "🌐 Abrindo página de debug..."
            "$BROWSER" "http://localhost:8080/debug-step01-image.html"
            break
            ;;
        "Abrir Editor")
            echo ""
            echo "📝 Abrindo editor..."
            echo "💡 Lembre-se de abrir o Console (F12) e executar o script de debug"
            "$BROWSER" "http://localhost:8080/editor?template=quiz21StepsComplete"
            break
            ;;
        "Verificar JSON")
            echo ""
            echo "📦 Verificando JSON do step-01..."
            echo ""
            curl -s http://localhost:8080/templates/blocks/step-01.json | jq '{
                id: .id,
                title: .title,
                totalBlocks: (.blocks | length),
                blockTypes: [.blocks[].type],
                hasIntroImage: ([.blocks[].type] | contains(["intro-image"])),
                imageBlock: (.blocks[] | select(.type == "intro-image") | {
                    type: .type,
                    imageUrl: .content.imageUrl,
                    alt: .content.alt,
                    width: .content.width
                })
            }'
            echo ""
            echo "✅ Verificação completa"
            echo ""
            break
            ;;
        "Sair")
            echo "👋 Até logo!"
            break
            ;;
        *) echo "Opção inválida $REPLY";;
    esac
done

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "📚 RECURSOS DISPONÍVEIS:"
echo ""
echo "• Página de Debug: /debug-step01-image.html"
echo "• Script de Console: /debug-step01-console.js"
echo "• Documentação: ANALISE_STEP_01_CORRETO.md"
echo ""
