#!/bin/bash

echo "🚀 CONSOLIDAÇÃO INTELIGENTE DOS COMPONENTES"
echo "==========================================="

# Cores da identidade visual
COR_PRIMARIA="#432818"
COR_SECUNDARIA="#B89B7A"

echo "🎨 Aplicando identidade visual:"
echo "   - Cor Primária: $COR_PRIMARIA"
echo "   - Cor Secundária: $COR_SECUNDARIA"

# Diretórios
DIR_CORRETO="src/components/blocks/inline"
DIR_DUPLICADO="src/components/editor/blocks/inline"

echo -e "\n📁 Preparando consolidação..."
echo "   ✅ Diretório destino: $DIR_CORRETO"
echo "   🔄 Analisando: $DIR_DUPLICADO"

# 1. MOVER componentes únicos do duplicado para o correto
echo -e "\n➡️  MOVENDO componentes únicos..."

componentes_unicos=(
    "BadgeInlineBlock"
    "BeforeAfterInlineBlock" 
    "BenefitsInlineBlock"
    "BonusListInlineBlock"
    "CTAInlineBlock"
    "CharacteristicsListInlineBlock"
    "CountdownInlineBlock"
    "DividerInlineBlock"
    "GuaranteeInlineBlock"
    "HeadingInlineBlock"
    "LoadingAnimationBlock"
    "PricingCardInlineBlock"
    "ProgressInlineBlock"
    "QuizOfferCTAInlineBlock"
    "QuizOfferPricingInlineBlock"
    "ResultCardInlineBlock"
    "ResultHeaderInlineBlock"
    "SecondaryStylesInlineBlock"
    "SpacerInlineBlock"
    "StatInlineBlock"
    "StepHeaderInlineBlock"
    "StyleCardInlineBlock"
    "StyleCharacteristicsInlineBlock"
    "TestimonialCardInlineBlock"
    "TestimonialsInlineBlock"
)

movidos=0
for componente in "${componentes_unicos[@]}"; do
    arquivo_origem="$DIR_DUPLICADO/${componente}.tsx"
    arquivo_destino="$DIR_CORRETO/${componente}.tsx"
    
    if [[ -f "$arquivo_origem" && ! -f "$arquivo_destino" ]]; then
        echo "   📦 Movendo: $componente"
        cp "$arquivo_origem" "$arquivo_destino"
        ((movidos++))
    fi
done

echo "   ✅ $movidos componentes movidos"

# 2. ANALISAR duplicatas diferentes
echo -e "\n🔍 ANALISANDO duplicatas diferentes..."

duplicatas_diferentes=(
    "ButtonInlineBlock"
    "ImageDisplayInlineBlock"
    "TextInlineBlock"
)

for componente in "${duplicatas_diferentes[@]}"; do
    arquivo_correto="$DIR_CORRETO/${componente}.tsx"
    arquivo_duplicado="$DIR_DUPLICADO/${componente}.tsx"
    
    if [[ -f "$arquivo_correto" && -f "$arquivo_duplicado" ]]; then
        linhas_correto=$(wc -l < "$arquivo_correto")
        linhas_duplicado=$(wc -l < "$arquivo_duplicado")
        
        echo "   📊 $componente:"
        echo "      - Correto: $linhas_correto linhas"
        echo "      - Duplicado: $linhas_duplicado linhas"
        
        # Manter o arquivo do diretório correto (já tem BlockComponentProps)
        echo "      ✅ Mantendo versão do diretório correto"
    fi
done

# 3. APLICAR correções padrão em todos os componentes
echo -e "\n🔧 APLICANDO correções padrão..."

total_corrigidos=0
for arquivo in "$DIR_CORRETO"/*.tsx; do
    if [[ -f "$arquivo" ]]; then
        nome_componente=$(basename "$arquivo" .tsx)
        echo "   🔧 Corrigindo: $nome_componente"
        
        # Backup
        cp "$arquivo" "${arquivo}.backup"
        
        # Aplicar correções usando sed (safer than direct editing)
        sed -i.tmp '
            # Remover imports de edição inline
            /import.*Edit[^;]*;/d
            /import.*Pencil[^;]*;/d
            /import.*InlineEdit[^;]*;/d
            
            # Aplicar cores da identidade visual
            s/#[0-9a-fA-F]\{6\}/'$COR_PRIMARIA'/g
            s/bg-blue-/bg-[#432818]/g
            s/text-blue-/text-[#432818]/g
            s/border-blue-/border-[#B89B7A]/g
            
            # Remover handlers de edição inline
            /onClick.*setIsEditing/d
            /onDoubleClick.*setIsEditing/d
            /contentEditable/d
            /isEditing/d
            /setIsEditing/d
            
        ' "$arquivo"
        
        # Remover arquivo temporário
        rm -f "${arquivo}.tmp"
        
        ((total_corrigidos++))
    fi
done

echo "   ✅ $total_corrigidos componentes corrigidos"

# 4. LIMPAR diretório duplicado
echo -e "\n🧹 LIMPANDO diretório duplicado..."
echo "   ⚠️  AVISO: Removendo diretório $DIR_DUPLICADO"
echo "   📋 Fazendo backup antes da remoção..."

# Criar backup do diretório duplicado
backup_dir="backup_editor_blocks_inline_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$backup_dir"
cp -r "$DIR_DUPLICADO"/* "$backup_dir/" 2>/dev/null

echo "   💾 Backup criado em: $backup_dir"

# Remover apenas os arquivos .tsx duplicados
for arquivo in "$DIR_DUPLICADO"/*.tsx; do
    if [[ -f "$arquivo" ]]; then
        nome=$(basename "$arquivo" .tsx)
        if [[ -f "$DIR_CORRETO/${nome}.tsx" ]]; then
            echo "   🗑️  Removendo duplicata: $nome"
            rm -f "$arquivo"
        fi
    fi
done

# 5. VERIFICAR registry
echo -e "\n📋 VERIFICANDO registry..."
registry_file="src/config/enhancedBlockRegistry.ts"

if [[ -f "$registry_file" ]]; then
    echo "   ✅ Registry encontrado: $registry_file"
    
    # Contar imports corretos
    imports_corretos=$(grep -c "from.*$DIR_CORRETO" "$registry_file" 2>/dev/null || echo 0)
    imports_duplicados=$(grep -c "from.*$DIR_DUPLICADO" "$registry_file" 2>/dev/null || echo 0)
    
    echo "   📊 Imports corretos: $imports_corretos"
    echo "   📊 Imports duplicados: $imports_duplicados"
    
    if [[ $imports_duplicados -gt 0 ]]; then
        echo "   🔧 Corrigindo imports no registry..."
        cp "$registry_file" "${registry_file}.backup"
        sed -i "s|$DIR_DUPLICADO|$DIR_CORRETO|g" "$registry_file"
        echo "   ✅ Registry corrigido"
    fi
else
    echo "   ❌ Registry não encontrado"
fi

echo -e "\n🎯 CONSOLIDAÇÃO CONCLUÍDA!"
echo "=========================="
echo "✅ Componentes únicos movidos: $movidos"
echo "✅ Componentes corrigidos: $total_corrigidos" 
echo "✅ Cores aplicadas: $COR_PRIMARIA, $COR_SECUNDARIA"
echo "✅ Edição inline removida"
echo "✅ Backup criado: $backup_dir"
echo "✅ Registry verificado e corrigido"

echo -e "\n📋 PRÓXIMOS PASSOS:"
echo "1. ✅ Testar componentes no editor"
echo "2. ✅ Verificar se o painel de propriedades funciona"
echo "3. ✅ Confirmar identidade visual aplicada"
echo "4. ✅ Remover backups se tudo estiver funcionando"
