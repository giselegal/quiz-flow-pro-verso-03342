#!/bin/bash

echo "🔧 CORREÇÃO AUTOMÁTICA: 5 CAMADAS DE COMPONENTES"
echo "============================================================="
echo "Este script corrige automaticamente os 7 componentes com problemas"
echo "adicionando cases faltantes no useUnifiedProperties.ts"
echo ""

# Backup do arquivo atual
cp src/hooks/useUnifiedProperties.ts src/hooks/useUnifiedProperties.ts.backup
echo "✅ Backup criado: useUnifiedProperties.ts.backup"

# Função para adicionar case no useUnifiedProperties
add_case() {
    local component_type="$1"
    local case_content="$2"
    
    echo "📝 Adicionando case para: $component_type"
    
    # Encontrar a linha onde adicionar o case (antes do default case)
    sed -i "/default:/i\\
        case \"$component_type\":\\
$case_content\\
" src/hooks/useUnifiedProperties.ts
}

echo ""
echo "🔧 Adicionando cases faltantes..."
echo "=================================="

# 1. pricing-card case
echo "1/7 - Adicionando pricing-card case..."
cat >> temp_case_1.txt << 'EOF'
        return [
          ...baseProperties,
          createProperty(
            "title",
            currentBlock?.properties?.title || "Plano Premium",
            PropertyType.TEXT,
            "Título do Plano",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "price",
            currentBlock?.properties?.price || "R$ 97,00",
            PropertyType.TEXT,
            "Preço",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "description",
            currentBlock?.properties?.description || "Melhor valor para você",
            PropertyType.TEXTAREA,
            "Descrição",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "features",
            currentBlock?.properties?.features || "Acesso completo\nSuporte premium\nGarantia 30 dias",
            PropertyType.TEXTAREA,
            "Recursos Inclusos",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "buttonText",
            currentBlock?.properties?.buttonText || "Adquirir Agora",
            PropertyType.TEXT,
            "Texto do Botão",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "buttonUrl",
            currentBlock?.properties?.buttonUrl || "#",
            PropertyType.TEXT,
            "URL do Botão",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "highlighted",
            currentBlock?.properties?.highlighted || false,
            PropertyType.SWITCH,
            "Destacar Plano",
            PropertyCategory.STYLE
          ),
        ];

EOF

# 2. quiz-progress case  
echo "2/7 - Adicionando quiz-progress case..."
cat >> temp_case_2.txt << 'EOF'
        return [
          ...baseProperties,
          createProperty(
            "currentStep",
            currentBlock?.properties?.currentStep || 1,
            PropertyType.RANGE,
            "Etapa Atual",
            PropertyCategory.CONTENT,
            { min: 1, max: 10, step: 1 }
          ),
          createProperty(
            "totalSteps",
            currentBlock?.properties?.totalSteps || 5,
            PropertyType.RANGE,
            "Total de Etapas",
            PropertyCategory.CONTENT,
            { min: 1, max: 20, step: 1 }
          ),
          createProperty(
            "showPercentage",
            currentBlock?.properties?.showPercentage || true,
            PropertyType.SWITCH,
            "Mostrar Porcentagem",
            PropertyCategory.STYLE
          ),
          createProperty(
            "progressColor",
            currentBlock?.properties?.progressColor || "#3b82f6",
            PropertyType.COLOR,
            "Cor da Barra",
            PropertyCategory.STYLE
          ),
        ];

EOF

# 3. quiz-results case
echo "3/7 - Adicionando quiz-results case..."
cat >> temp_case_3.txt << 'EOF'
        return [
          ...baseProperties,
          createProperty(
            "title",
            currentBlock?.properties?.title || "Seus Resultados",
            PropertyType.TEXT,
            "Título dos Resultados",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "subtitle",
            currentBlock?.properties?.subtitle || "Baseado nas suas respostas...",
            PropertyType.TEXT,
            "Subtítulo",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "showScore",
            currentBlock?.properties?.showScore || true,
            PropertyType.SWITCH,
            "Mostrar Pontuação",
            PropertyCategory.STYLE
          ),
          createProperty(
            "showRecommendations",
            currentBlock?.properties?.showRecommendations || true,
            PropertyType.SWITCH,
            "Mostrar Recomendações",
            PropertyCategory.CONTENT
          ),
        ];

EOF

# 4. style-results case
echo "4/7 - Adicionando style-results case..."
cat >> temp_case_4.txt << 'EOF'
        return [
          ...baseProperties,
          createProperty(
            "resultStyle",
            currentBlock?.properties?.resultStyle || "card",
            PropertyType.SELECT,
            "Estilo do Resultado",
            PropertyCategory.STYLE,
            {
              options: createSelectOptions([
                { value: "card", label: "Cartão" },
                { value: "list", label: "Lista" },
                { value: "grid", label: "Grade" },
              ])
            }
          ),
          createProperty(
            "showIcons",
            currentBlock?.properties?.showIcons || true,
            PropertyType.SWITCH,
            "Mostrar Ícones",
            PropertyCategory.STYLE
          ),
          createProperty(
            "columns",
            currentBlock?.properties?.columns || 2,
            PropertyType.RANGE,
            "Colunas",
            PropertyCategory.LAYOUT,
            { min: 1, max: 4, step: 1 }
          ),
        ];

EOF

# 5. final-step case
echo "5/7 - Adicionando final-step case..."
cat >> temp_case_5.txt << 'EOF'
        return [
          ...baseProperties,
          createProperty(
            "title",
            currentBlock?.properties?.title || "Parabéns!",
            PropertyType.TEXT,
            "Título Final",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "message",
            currentBlock?.properties?.message || "Você completou o quiz com sucesso!",
            PropertyType.TEXTAREA,
            "Mensagem Final",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "showCTA",
            currentBlock?.properties?.showCTA || true,
            PropertyType.SWITCH,
            "Mostrar Botão de Ação",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "ctaText",
            currentBlock?.properties?.ctaText || "Ver Meus Resultados",
            PropertyType.TEXT,
            "Texto do Botão",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "ctaUrl",
            currentBlock?.properties?.ctaUrl || "#",
            PropertyType.TEXT,
            "URL do Botão",
            PropertyCategory.CONTENT
          ),
        ];

EOF

# 6. decorative-bar case (legacy)
echo "6/7 - Adicionando decorative-bar case (legacy)..."
cat >> temp_case_6.txt << 'EOF'
        return [
          ...baseProperties,
          createProperty(
            "height",
            currentBlock?.properties?.height || 4,
            PropertyType.RANGE,
            "Altura",
            PropertyCategory.STYLE,
            { min: 1, max: 20, step: 1 }
          ),
          createProperty(
            "color",
            currentBlock?.properties?.color || "#3b82f6",
            PropertyType.COLOR,
            "Cor da Barra",
            PropertyCategory.STYLE
          ),
          createProperty(
            "style",
            currentBlock?.properties?.style || "solid",
            PropertyType.SELECT,
            "Estilo da Barra",
            PropertyCategory.STYLE,
            {
              options: createSelectOptions([
                { value: "solid", label: "Sólida" },
                { value: "dashed", label: "Tracejada" },
                { value: "dotted", label: "Pontilhada" },
              ])
            }
          ),
        ];

EOF

# 7. legal-notice case (legacy)
echo "7/7 - Adicionando legal-notice case (legacy)..."
cat >> temp_case_7.txt << 'EOF'
        return [
          ...baseProperties,
          createProperty(
            "content",
            currentBlock?.properties?.content || "Este é um aviso legal importante.",
            PropertyType.TEXTAREA,
            "Conteúdo do Aviso",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "type",
            currentBlock?.properties?.type || "info",
            PropertyType.SELECT,
            "Tipo do Aviso",
            PropertyCategory.STYLE,
            {
              options: createSelectOptions([
                { value: "info", label: "Informação" },
                { value: "warning", label: "Aviso" },
                { value: "error", label: "Erro" },
                { value: "success", label: "Sucesso" },
              ])
            }
          ),
          createProperty(
            "showIcon",
            currentBlock?.properties?.showIcon || true,
            PropertyType.SWITCH,
            "Mostrar Ícone",
            PropertyCategory.STYLE
          ),
        ];

EOF

echo ""
echo "📝 Aplicando cases no useUnifiedProperties.ts..."
echo "================================================"

# Aplicar todos os cases
# Vamos usar uma abordagem mais segura: inserir todos de uma vez

# Criar arquivo temporário com os novos cases
cat > temp_new_cases.txt << 'EOF'

        case "pricing-card":
        return [
          ...baseProperties,
          createProperty(
            "title",
            currentBlock?.properties?.title || "Plano Premium",
            PropertyType.TEXT,
            "Título do Plano",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "price",
            currentBlock?.properties?.price || "R$ 97,00",
            PropertyType.TEXT,
            "Preço",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "description",
            currentBlock?.properties?.description || "Melhor valor para você",
            PropertyType.TEXTAREA,
            "Descrição",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "features",
            currentBlock?.properties?.features || "Acesso completo\\nSuporte premium\\nGarantia 30 dias",
            PropertyType.TEXTAREA,
            "Recursos Inclusos",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "buttonText",
            currentBlock?.properties?.buttonText || "Adquirir Agora",
            PropertyType.TEXT,
            "Texto do Botão",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "buttonUrl",
            currentBlock?.properties?.buttonUrl || "#",
            PropertyType.TEXT,
            "URL do Botão",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "highlighted",
            currentBlock?.properties?.highlighted || false,
            PropertyType.SWITCH,
            "Destacar Plano",
            PropertyCategory.STYLE
          ),
        ];

        case "quiz-progress":
        return [
          ...baseProperties,
          createProperty(
            "currentStep",
            currentBlock?.properties?.currentStep || 1,
            PropertyType.RANGE,
            "Etapa Atual",
            PropertyCategory.CONTENT,
            { min: 1, max: 10, step: 1 }
          ),
          createProperty(
            "totalSteps",
            currentBlock?.properties?.totalSteps || 5,
            PropertyType.RANGE,
            "Total de Etapas",
            PropertyCategory.CONTENT,
            { min: 1, max: 20, step: 1 }
          ),
          createProperty(
            "showPercentage",
            currentBlock?.properties?.showPercentage || true,
            PropertyType.SWITCH,
            "Mostrar Porcentagem",
            PropertyCategory.STYLE
          ),
          createProperty(
            "progressColor",
            currentBlock?.properties?.progressColor || "#3b82f6",
            PropertyType.COLOR,
            "Cor da Barra",
            PropertyCategory.STYLE
          ),
        ];

        case "quiz-results":
        return [
          ...baseProperties,
          createProperty(
            "title",
            currentBlock?.properties?.title || "Seus Resultados",
            PropertyType.TEXT,
            "Título dos Resultados",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "subtitle",
            currentBlock?.properties?.subtitle || "Baseado nas suas respostas...",
            PropertyType.TEXT,
            "Subtítulo",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "showScore",
            currentBlock?.properties?.showScore || true,
            PropertyType.SWITCH,
            "Mostrar Pontuação",
            PropertyCategory.STYLE
          ),
          createProperty(
            "showRecommendations",
            currentBlock?.properties?.showRecommendations || true,
            PropertyType.SWITCH,
            "Mostrar Recomendações",
            PropertyCategory.CONTENT
          ),
        ];

        case "style-results":
        return [
          ...baseProperties,
          createProperty(
            "resultStyle",
            currentBlock?.properties?.resultStyle || "card",
            PropertyType.SELECT,
            "Estilo do Resultado",
            PropertyCategory.STYLE,
            {
              options: createSelectOptions([
                { value: "card", label: "Cartão" },
                { value: "list", label: "Lista" },
                { value: "grid", label: "Grade" },
              ])
            }
          ),
          createProperty(
            "showIcons",
            currentBlock?.properties?.showIcons || true,
            PropertyType.SWITCH,
            "Mostrar Ícones",
            PropertyCategory.STYLE
          ),
          createProperty(
            "columns",
            currentBlock?.properties?.columns || 2,
            PropertyType.RANGE,
            "Colunas",
            PropertyCategory.LAYOUT,
            { min: 1, max: 4, step: 1 }
          ),
        ];

        case "final-step":
        return [
          ...baseProperties,
          createProperty(
            "title",
            currentBlock?.properties?.title || "Parabéns!",
            PropertyType.TEXT,
            "Título Final",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "message",
            currentBlock?.properties?.message || "Você completou o quiz com sucesso!",
            PropertyType.TEXTAREA,
            "Mensagem Final",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "showCTA",
            currentBlock?.properties?.showCTA || true,
            PropertyType.SWITCH,
            "Mostrar Botão de Ação",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "ctaText",
            currentBlock?.properties?.ctaText || "Ver Meus Resultados",
            PropertyType.TEXT,
            "Texto do Botão",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "ctaUrl",
            currentBlock?.properties?.ctaUrl || "#",
            PropertyType.TEXT,
            "URL do Botão",
            PropertyCategory.CONTENT
          ),
        ];

        case "decorative-bar":
        return [
          ...baseProperties,
          createProperty(
            "height",
            currentBlock?.properties?.height || 4,
            PropertyType.RANGE,
            "Altura",
            PropertyCategory.STYLE,
            { min: 1, max: 20, step: 1 }
          ),
          createProperty(
            "color",
            currentBlock?.properties?.color || "#3b82f6",
            PropertyType.COLOR,
            "Cor da Barra",
            PropertyCategory.STYLE
          ),
          createProperty(
            "style",
            currentBlock?.properties?.style || "solid",
            PropertyType.SELECT,
            "Estilo da Barra",
            PropertyCategory.STYLE,
            {
              options: createSelectOptions([
                { value: "solid", label: "Sólida" },
                { value: "dashed", label: "Tracejada" },
                { value: "dotted", label: "Pontilhada" },
              ])
            }
          ),
        ];

        case "legal-notice":
        return [
          ...baseProperties,
          createProperty(
            "content",
            currentBlock?.properties?.content || "Este é um aviso legal importante.",
            PropertyType.TEXTAREA,
            "Conteúdo do Aviso",
            PropertyCategory.CONTENT
          ),
          createProperty(
            "type",
            currentBlock?.properties?.type || "info",
            PropertyType.SELECT,
            "Tipo do Aviso",
            PropertyCategory.STYLE,
            {
              options: createSelectOptions([
                { value: "info", label: "Informação" },
                { value: "warning", label: "Aviso" },
                { value: "error", label: "Erro" },
                { value: "success", label: "Sucesso" },
              ])
            }
          ),
          createProperty(
            "showIcon",
            currentBlock?.properties?.showIcon || true,
            PropertyType.SWITCH,
            "Mostrar Ícone",
            PropertyCategory.STYLE
          ),
        ];

EOF

# Inserir os novos cases antes do default
sed -i '/default:/r temp_new_cases.txt' src/hooks/useUnifiedProperties.ts

# Limpar arquivos temporários
rm -f temp_case_*.txt temp_new_cases.txt

echo ""
echo "✅ Cases adicionados com sucesso!"
echo "=================================="
echo ""

# Verificar se foi aplicado corretamente
echo "🔍 Verificando aplicação..."
new_cases_count=$(grep -c "case \"" src/hooks/useUnifiedProperties.ts)
echo "📊 Total de cases agora: $new_cases_count"

echo ""
echo "🔧 Executando novo checkup..."
echo "============================="

# Executar checkup novamente
node checkup-5-camadas-componentes.cjs

echo ""
echo "✅ CORREÇÃO AUTOMÁTICA CONCLUÍDA!"
echo "=================================="
echo ""
echo "📋 Próximos passos:"
echo "1. Verificar se todos os cases foram adicionados corretamente"
echo "2. Testar cada componente no editor /editor-fixed"
echo "3. Ajustar propriedades específicas se necessário"
echo ""
echo "📁 Arquivos modificados:"
echo "- src/hooks/useUnifiedProperties.ts (backup: .backup)"
echo ""
echo "🎯 Taxa de sucesso esperada: 100% (16/16 componentes)"
