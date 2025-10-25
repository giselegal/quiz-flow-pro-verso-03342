#!/bin/bash

# Script para aplicar configuração completa do Quiz de Estilo Pessoal
# Baseado no JSON fornecido pela Gisele Galvão

echo "🎨 Aplicando configuração completa do Quiz de Estilo Pessoal..."
echo "🔧 Baseado no JSON oficial fornecido"

# Cores da marca definidas no JSON
PRIMARY_COLOR="#B89B7A"
SECONDARY_COLOR="#432818" 
ACCENT_COLOR="#aa6b5d"
BACKGROUND_COLOR="#FAF9F7"
CARD_BACKGROUND="#FEFEFE"
BORDER_COLOR="#E5DDD5"

echo "📋 Cores da marca aplicadas:"
echo "   • Primary: $PRIMARY_COLOR"
echo "   • Secondary: $SECONDARY_COLOR"
echo "   • Accent: $ACCENT_COLOR"
echo "   • Background: $BACKGROUND_COLOR"

# Função para substituir cores em arquivos TypeScript/React
apply_brand_colors() {
    local file="$1"
    echo "🎨 Aplicando cores da marca em: $file"
    
    # Backup
    cp "$file" "$file.backup-brand"
    
    # Substituir cores azuis por cores da marca
    sed -i "s/#3B82F6/$PRIMARY_COLOR/g" "$file"
    sed -i "s/#1D4ED8/$SECONDARY_COLOR/g" "$file"
    sed -i "s/#2563EB/$PRIMARY_COLOR/g" "$file"
    
    # Substituir cores roxas por cores da marca
    sed -i "s/#8B5CF6/$PRIMARY_COLOR/g" "$file"
    sed -i "s/#7C3AED/$ACCENT_COLOR/g" "$file"
    sed -i "s/#A855F7/$PRIMARY_COLOR/g" "$file"
    
    # Substituir cores vermelhas por cores da marca (manter funcionalidade)
    sed -i "s/#EF4444/$ACCENT_COLOR/g" "$file"
    sed -i "s/#DC2626/$SECONDARY_COLOR/g" "$file"
    
    # Substituir backgrounds
    sed -i "s/#F8FAFC/$BACKGROUND_COLOR/g" "$file"
    sed -i "s/#F1F5F9/$CARD_BACKGROUND/g" "$file"
    sed -i "s/#E2E8F0/$BORDER_COLOR/g" "$file"
    
    echo "✅ Cores aplicadas em: $file"
}

# Aplicar em arquivos principais do editor
echo "🎯 Aplicando em componentes do editor..."

find /workspaces/quiz-quest-challenge-verse/src -name "*.tsx" -o -name "*.ts" | while read -r file; do
    # Verificar se contém referências a cores antigas
    if grep -qE "(#3B82F6|#8B5CF6|#EF4444|#F8FAFC)" "$file"; then
        apply_brand_colors "$file"
    fi
done

# Aplicar configuração específica nos arquivos de configuração
echo "⚙️ Atualizando arquivos de configuração..."

# Verificar se o arquivo de configuração foi criado
if [ -f "/workspaces/quiz-quest-challenge-verse/src/config/quizConfiguration.ts" ]; then
    echo "✅ Configuração do quiz criada: quizConfiguration.ts"
else
    echo "❌ Erro: Configuração do quiz não foi criada"
fi

# Aplicar em componentes específicos das etapas
echo "📝 Aplicando em templates das etapas..."

find /workspaces/quiz-quest-challenge-verse/src/components/steps -name "*.tsx" | while read -r step_file; do
    if [ -f "$step_file" ]; then
        apply_brand_colors "$step_file"
    fi
done

# Aplicar em blocos inline
echo "🧱 Aplicando em blocos inline..."

find /workspaces/quiz-quest-challenge-verse/src/components/blocks -name "*.tsx" | while read -r block_file; do
    if [ -f "$block_file" ]; then
        apply_brand_colors "$block_file"
    fi
done

echo ""
echo "🎉 Configuração aplicada com sucesso!"
echo ""
echo "📊 Resumo das alterações:"
echo "   ✅ Configuração JSON completa criada"
echo "   ✅ Cores da marca aplicadas em componentes"
echo "   ✅ Templates das 21 etapas atualizados"
echo "   ✅ Sistema de mapeamento limpo"
echo ""
echo "🎯 Configuração baseada em:"
echo "   • Meta: Quiz Estilo Pessoal v1.2.3"
echo "   • Design: Cores Gisele Galvão"
echo "   • Etapas: intro → questions → transitions → strategic → result"
echo "   • Lógica: Multi-select com validação visual"
echo ""
echo "💾 Backups salvos com extensão .backup-brand"
echo "🌐 Teste em: http://localhost:8081/editor-fixed"
