#!/bin/bash
# 🧪 TESTE MANUAL E2E - PAINEL DE PROPRIEDADES
# Execute este script e siga as instruções

echo "═══════════════════════════════════════════════════════════════════"
echo "🧪 TESTE E2E MANUAL - PAINEL DE PROPRIEDADES"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

# Verificar se o servidor está rodando
if ! pgrep -f "vite.*8080" > /dev/null; then
    echo "❌ ERRO: Servidor Vite não está rodando na porta 8080"
    echo "   Execute: npm run dev"
    exit 1
fi

echo "✅ Servidor Vite rodando"
echo ""

echo "📋 CHECKLIST DE TESTES:"
echo "─────────────────────────────────────────────────────────────────"
echo ""

# URL de teste
TEST_URL="http://localhost:8080/editor?resource=quiz21StepsComplete&step=2"

echo "1️⃣  ABRIR URL DE TESTE:"
echo "   $TEST_URL"
echo ""

echo "2️⃣  VERIFICAR ELEMENTOS NA TELA:"
echo "   [ ] Editor carregou (título 'Editor Modular')"
echo "   [ ] Template carregado (deve aparecer 'Template: quiz21StepsComplete')"
echo "   [ ] Canvas exibe blocos (lado esquerdo central)"
echo "   [ ] Painel de propriedades visível (lado direito)"
echo ""

echo "3️⃣  TESTAR SELEÇÃO DE BLOCO:"
echo "   [ ] Clicar em qualquer bloco no canvas"
echo "   [ ] Painel de propriedades atualiza"
echo "   [ ] Exibe ID do bloco selecionado"
echo "   [ ] Exibe tipo do bloco"
echo ""

echo "4️⃣  VERIFICAR CONSOLE DO NAVEGADOR (F12):"
echo "   [ ] Buscar por: '[PropertiesColumn] Estado Completo'"
echo "   [ ] Verificar se selectedBlockId não é null"
echo "   [ ] Verificar se blocks tem itens"
echo ""

echo "5️⃣  TESTAR EDIÇÃO:"
echo "   [ ] Editar campo de texto no painel"
echo "   [ ] Aparece indicador 'Alterações não salvas'"
echo "   [ ] Clicar em 'Salvar'"
echo "   [ ] Toast de sucesso aparece"
echo ""

echo "6️⃣  LOGS IMPORTANTES NO CONSOLE:"
echo "   🔍 [PropertiesColumn] Estado Completo"
echo "   🎯 [QuizModularEditor] Renderizando PropertiesColumn"
echo "   ✅ [PropertiesColumn] Usando selectedBlockProp: [blockId]"
echo ""

echo "─────────────────────────────────────────────────────────────────"
echo ""
echo "🚀 INICIAR TESTE AGORA:"
echo ""

# Tentar abrir no navegador padrão
if command -v xdg-open > /dev/null; then
    echo "   Abrindo navegador..."
    xdg-open "$TEST_URL" 2>/dev/null &
elif command -v open > /dev/null; then
    echo "   Abrindo navegador..."
    open "$TEST_URL" 2>/dev/null &
else
    echo "   ⚠️  Não foi possível abrir automaticamente"
fi

echo ""
echo "   URL: $TEST_URL"
echo ""
echo "📊 APÓS OS TESTES, REPORTE:"
echo ""
echo "   ✅ FUNCIONA - Todos os itens do checklist passaram"
echo "   ❌ NÃO FUNCIONA - Especifique qual item falhou"
echo "   ⚠️  PARCIAL - Alguns itens funcionam, outros não"
echo ""
echo "═══════════════════════════════════════════════════════════════════"
