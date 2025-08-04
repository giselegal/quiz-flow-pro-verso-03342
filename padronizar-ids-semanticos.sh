#!/bin/bash

# 🎯 SCRIPT: PADRONIZAÇÃO SEMÂNTICA COMPLETA DOS IDS
# Implementar IDs 100% semânticos em todas as Steps 01-21

echo "🚀 INICIANDO PADRONIZAÇÃO SEMÂNTICA DOS IDS..."

# Função para aplicar correções semânticas
apply_semantic_fixes() {
    echo "🔧 Aplicando correções semânticas..."
    
    # Step02 - Questão sobre tipo de roupa
    echo "📝 Corrigindo Step02 (Questão roupas)..."
    sed -i 's/id: "step02-title"/id: "step02-question-title"/g' src/components/steps/Step02Template.tsx
    sed -i 's/id: "step02-text"/id: "step02-question-counter"/g' src/components/steps/Step02Template.tsx
    sed -i 's/id: "step02-image"/id: "step02-clothing-image"/g' src/components/steps/Step02Template.tsx
    sed -i 's/id: "step02-options"/id: "step02-clothing-options"/g' src/components/steps/Step02Template.tsx
    sed -i 's/id: "step02-button"/id: "step02-continue-button"/g' src/components/steps/Step02Template.tsx
    
    # Step03 - Questão personalidade
    echo "📝 Corrigindo Step03 (Personalidade)..."
    sed -i 's/id: "step03-title"/id: "step03-question-title"/g' src/components/steps/Step03Template.tsx
    sed -i 's/id: "step03-text"/id: "step03-question-counter"/g' src/components/steps/Step03Template.tsx
    sed -i 's/id: "step03-options"/id: "step03-personality-options"/g' src/components/steps/Step03Template.tsx
    sed -i 's/id: "step03-button"/id: "step03-continue-button"/g' src/components/steps/Step03Template.tsx
    
    # Step04 - Visual
    echo "📝 Corrigindo Step04 (Visual)..."
    sed -i 's/id: "step04-title"/id: "step04-question-title"/g' src/components/steps/Step04Template.tsx
    sed -i 's/id: "step04-text"/id: "step04-question-counter"/g' src/components/steps/Step04Template.tsx
    sed -i 's/id: "step04-options"/id: "step04-visual-options"/g' src/components/steps/Step04Template.tsx
    sed -i 's/id: "step04-button"/id: "step04-continue-button"/g' src/components/steps/Step04Template.tsx
    
    # Step05 - Detalhes
    echo "📝 Corrigindo Step05 (Detalhes)..."
    sed -i 's/id: "step05-title"/id: "step05-question-title"/g' src/components/steps/Step05Template.tsx
    sed -i 's/id: "step05-text"/id: "step05-question-counter"/g' src/components/steps/Step05Template.tsx
    sed -i 's/id: "step05-options"/id: "step05-details-options"/g' src/components/steps/Step05Template.tsx
    sed -i 's/id: "step05-button"/id: "step05-continue-button"/g' src/components/steps/Step05Template.tsx
    
    # Step06 - Estampas
    echo "📝 Corrigindo Step06 (Estampas)..."
    sed -i 's/id: "step06-title"/id: "step06-question-title"/g' src/components/steps/Step06Template.tsx
    sed -i 's/id: "step06-text"/id: "step06-question-counter"/g' src/components/steps/Step06Template.tsx
    sed -i 's/id: "step06-options"/id: "step06-pattern-options"/g' src/components/steps/Step06Template.tsx
    sed -i 's/id: "step06-button"/id: "step06-continue-button"/g' src/components/steps/Step06Template.tsx
    
    # Step07 - Casacos
    echo "📝 Corrigindo Step07 (Casacos)..."
    sed -i 's/id: "step07-title"/id: "step07-question-title"/g' src/components/steps/Step07Template.tsx
    sed -i 's/id: "step07-text"/id: "step07-question-counter"/g' src/components/steps/Step07Template.tsx
    sed -i 's/id: "step07-options"/id: "step07-jacket-options"/g' src/components/steps/Step07Template.tsx
    sed -i 's/id: "step07-button"/id: "step07-continue-button"/g' src/components/steps/Step07Template.tsx
    
    # Step08 - Calças
    echo "📝 Corrigindo Step08 (Calças)..."
    sed -i 's/id: "step08-title"/id: "step08-question-title"/g' src/components/steps/Step08Template.tsx
    sed -i 's/id: "step08-text"/id: "step08-question-counter"/g' src/components/steps/Step08Template.tsx
    sed -i 's/id: "step08-options"/id: "step08-pants-options"/g' src/components/steps/Step08Template.tsx
    sed -i 's/id: "step08-button"/id: "step08-continue-button"/g' src/components/steps/Step08Template.tsx
    
    # Step09 - Sapatos
    echo "📝 Corrigindo Step09 (Sapatos)..."
    sed -i 's/id: "step09-title"/id: "step09-question-title"/g' src/components/steps/Step09Template.tsx
    sed -i 's/id: "step09-text"/id: "step09-question-counter"/g' src/components/steps/Step09Template.tsx
    sed -i 's/id: "step09-options"/id: "step09-shoes-options"/g' src/components/steps/Step09Template.tsx
    sed -i 's/id: "step09-button"/id: "step09-continue-button"/g' src/components/steps/Step09Template.tsx
    
    # Step10 - Acessórios
    echo "📝 Corrigindo Step10 (Acessórios)..."
    sed -i 's/id: "step10-title"/id: "step10-question-title"/g' src/components/steps/Step10Template.tsx
    sed -i 's/id: "step10-text"/id: "step10-question-counter"/g' src/components/steps/Step10Template.tsx
    sed -i 's/id: "step10-options"/id: "step10-accessories-options"/g' src/components/steps/Step10Template.tsx
    sed -i 's/id: "step10-button"/id: "step10-continue-button"/g' src/components/steps/Step10Template.tsx
    
    # Step11 - Tecidos
    echo "📝 Corrigindo Step11 (Tecidos)..."
    sed -i 's/id: "step11-title"/id: "step11-question-title"/g' src/components/steps/Step11Template.tsx
    sed -i 's/id: "step11-text"/id: "step11-question-counter"/g' src/components/steps/Step11Template.tsx
    sed -i 's/id: "step11-options"/id: "step11-fabrics-options"/g' src/components/steps/Step11Template.tsx
    sed -i 's/id: "step11-button"/id: "step11-continue-button"/g' src/components/steps/Step11Template.tsx
    
    # Step12 - Transição
    echo "📝 Corrigindo Step12 (Transição)..."
    sed -i 's/id: "step12-title"/id: "step12-transition-title"/g' src/components/steps/Step12Template.tsx
    sed -i 's/id: "step12-text"/id: "step12-transition-text"/g' src/components/steps/Step12Template.tsx
    sed -i 's/id: "step12-button"/id: "step12-continue-button"/g' src/components/steps/Step12Template.tsx
    
    # Step13 - Guarda-roupa
    echo "📝 Corrigindo Step13 (Guarda-roupa)..."
    sed -i 's/id: "step13-title"/id: "step13-question-title"/g' src/components/steps/Step13Template.tsx
    sed -i 's/id: "step13-text"/id: "step13-question-counter"/g' src/components/steps/Step13Template.tsx
    sed -i 's/id: "step13-options"/id: "step13-wardrobe-options"/g' src/components/steps/Step13Template.tsx
    sed -i 's/id: "step13-button"/id: "step13-continue-button"/g' src/components/steps/Step13Template.tsx
    
    # Step14-18 - Questões finais
    for i in {14..18}; do
        echo "📝 Corrigindo Step$i (Questão final)..."
        sed -i "s/id: \"step$i-title\"/id: \"step$i-question-title\"/g" src/components/steps/Step${i}Template.tsx
        sed -i "s/id: \"step$i-text\"/id: \"step$i-question-counter\"/g" src/components/steps/Step${i}Template.tsx
        sed -i "s/id: \"step$i-options\"/id: \"step$i-final-options\"/g" src/components/steps/Step${i}Template.tsx
        sed -i "s/id: \"step$i-button\"/id: \"step$i-continue-button\"/g" src/components/steps/Step${i}Template.tsx
    done
    
    # Step19 - Preparação resultado
    echo "📝 Corrigindo Step19 (Preparação resultado)..."
    sed -i 's/id: "step19-title"/id: "step19-thank-you-title"/g' src/components/steps/Step19Template.tsx
    sed -i 's/id: "step19-text"/id: "step19-thank-you-text"/g' src/components/steps/Step19Template.tsx
    sed -i 's/id: "step19-text-2"/id: "step19-reveal-text"/g' src/components/steps/Step19Template.tsx
    sed -i 's/id: "step19-text-3"/id: "step19-surprise-text"/g' src/components/steps/Step19Template.tsx
    sed -i 's/id: "step19-button"/id: "step19-show-result-button"/g' src/components/steps/Step19Template.tsx
    
    # Step20 - Resultado
    echo "📝 Corrigindo Step20 (Resultado)..."
    sed -i 's/id: "step20-result-header"/id: "step20-congratulations-header"/g' src/components/steps/Step20Template.tsx
    sed -i 's/id: "step20-result-card"/id: "step20-style-result-card"/g' src/components/steps/Step20Template.tsx
    sed -i 's/id: "step20-button"/id: "step20-view-offer-button"/g' src/components/steps/Step20Template.tsx
    
    # Step21 - Finalização
    echo "📝 Corrigindo Step21 (Finalização)..."
    sed -i 's/id: "step21-title"/id: "step21-final-title"/g' src/components/steps/Step21Template.tsx
    sed -i 's/id: "step21-text"/id: "step21-final-text"/g' src/components/steps/Step21Template.tsx
    sed -i 's/id: "step21-button"/id: "step21-final-button"/g' src/components/steps/Step21Template.tsx
    
    echo "✅ Correções semânticas aplicadas!"
}

# Executar correções
apply_semantic_fixes

echo ""
echo "🎯 VERIFICANDO RESULTADOS..."

# Verificar algumas correções
echo ""
echo "📊 AMOSTRA DOS NOVOS IDS SEMÂNTICOS:"
echo ""

echo "Step02 (Roupas):"
grep 'id: "step02' src/components/steps/Step02Template.tsx | head -3

echo ""
echo "Step09 (Sapatos):"
grep 'id: "step09' src/components/steps/Step09Template.tsx | head -3

echo ""
echo "Step19 (Preparação):"
grep 'id: "step19' src/components/steps/Step19Template.tsx | head -3

echo ""
echo "Step20 (Resultado):"
grep 'id: "step20' src/components/steps/Step20Template.tsx

echo ""
echo "🎉 PADRONIZAÇÃO SEMÂNTICA COMPLETA!"
echo ""
echo "✅ BENEFÍCIOS IMPLEMENTADOS:"
echo "   - IDs descritivos e contextuais"
echo "   - Fácil identificação da função"
echo "   - Melhor manutenibilidade"
echo "   - Debug mais eficiente"
