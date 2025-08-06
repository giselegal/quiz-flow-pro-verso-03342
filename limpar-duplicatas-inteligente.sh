#!/bin/bash

echo "🧹 LIMPEZA INTELIGENTE DE COMPONENTES DUPLICADOS"
echo "================================================"

# Definir diretórios
DIR_CORRETO="src/components/blocks/inline"
DIR_DUPLICADO="src/components/editor/blocks/inline"

echo "📁 Analisando estrutura de diretórios..."
echo "✅ Diretório correto: $DIR_CORRETO ($(ls $DIR_CORRETO 2>/dev/null | wc -l) arquivos)"
echo "❌ Diretório duplicado: $DIR_DUPLICADO ($(ls $DIR_DUPLICADO 2>/dev/null | wc -l) arquivos)"

echo -e "\n🔍 ANALISANDO DUPLICATAS CONFIRMADAS..."

# Lista de componentes duplicados confirmados
DUPLICATAS=("ButtonInlineBlock" "ImageDisplayInlineBlock" "TextInlineBlock")

for componente in "${DUPLICATAS[@]}"; do
    arquivo_correto="$DIR_CORRETO/${componente}.tsx"
    arquivo_duplicado="$DIR_DUPLICADO/${componente}.tsx"
    
    echo -e "\n📝 Analisando: $componente"
    
    if [[ -f "$arquivo_correto" && -f "$arquivo_duplicado" ]]; then
        echo "   ✅ Arquivo correto encontrado: $arquivo_correto"
        echo "   ❌ Duplicata encontrada: $arquivo_duplicado"
        
        # Verificar se são realmente diferentes
        if diff -q "$arquivo_correto" "$arquivo_duplicado" > /dev/null; then
            echo "   📋 Arquivos são IDÊNTICOS - pode remover duplicata"
        else
            echo "   ⚠️  Arquivos são DIFERENTES - precisa análise manual"
            echo "   📊 Comparando diferenças..."
            echo "      Linhas no correto: $(wc -l < "$arquivo_correto")"
            echo "      Linhas no duplicado: $(wc -l < "$arquivo_duplicado")"
        fi
    else
        echo "   ❓ Status: Correto=$([ -f "$arquivo_correto" ] && echo "SIM" || echo "NÃO") | Duplicado=$([ -f "$arquivo_duplicado" ] && echo "SIM" || echo "NÃO")"
    fi
done

echo -e "\n🔍 BUSCANDO TODAS AS DUPLICATAS AUTOMÁTICAMENTE..."

# Buscar todos os arquivos no diretório correto
if [[ -d "$DIR_CORRETO" ]]; then
    for arquivo_correto in "$DIR_CORRETO"/*.tsx; do
        if [[ -f "$arquivo_correto" ]]; then
            nome_arquivo=$(basename "$arquivo_correto")
            arquivo_duplicado="$DIR_DUPLICADO/$nome_arquivo"
            
            if [[ -f "$arquivo_duplicado" ]]; then
                echo "🔄 DUPLICATA: $(basename "$arquivo_correto" .tsx)"
                
                # Verificar diferenças
                if diff -q "$arquivo_correto" "$arquivo_duplicado" > /dev/null; then
                    echo "   ✅ Idênticos - PODE REMOVER: $arquivo_duplicado"
                else
                    echo "   ⚠️  Diferentes - PRECISA ANÁLISE"
                fi
            fi
        fi
    done
fi

echo -e "\n📋 ANÁLISE DE IMPORTS NO REGISTRY..."

# Verificar onde o registry está importando
registry_file="src/components/blocks/enhancedBlockRegistry.ts"
if [[ -f "$registry_file" ]]; then
    echo "✅ Registry encontrado: $registry_file"
    echo "📊 Imports atuais no registry:"
    grep -n "from.*components.*blocks" "$registry_file" | head -10
else
    echo "❌ Registry não encontrado em: $registry_file"
fi

echo -e "\n🎯 RECOMENDAÇÕES INTELIGENTES:"
echo "1. ✅ MANTER: Todos os arquivos em $DIR_CORRETO"
echo "2. ❌ REMOVER: Duplicatas idênticas em $DIR_DUPLICADO"
echo "3. 🔍 ANALISAR: Duplicatas diferentes (verificar qual versão é a correta)"
echo "4. 📝 ATUALIZAR: Registry para importar apenas de $DIR_CORRETO"

echo -e "\n🚀 PRÓXIMOS PASSOS AUTOMATIZADOS:"
echo "1. Executar análise detalhada de cada duplicata"
echo "2. Comparar com padrões do QuizOfferPage.tsx"
echo "3. Remover edição inline dos componentes"
echo "4. Aplicar cores da identidade visual (#432818, #B89B7A)"
echo "5. Limpar duplicatas e rebuild do registry"
