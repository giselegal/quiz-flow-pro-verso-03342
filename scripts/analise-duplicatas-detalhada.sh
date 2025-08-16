#!/bin/bash

echo "🎯 ANÁLISE DETALHADA: COMPONENTES INLINE DUPLICADOS"
echo "=================================================="

# Definir caminhos corretos dos diretórios
DIR_CORRETO="src/components/blocks/inline"
DIR_DUPLICADO="src/components/editor/blocks/inline"

echo "📊 CONTAGEM DE ARQUIVOS:"
echo "✅ $DIR_CORRETO: $(ls $DIR_CORRETO/*.tsx 2>/dev/null | wc -l) componentes"
echo "❌ $DIR_DUPLICADO: $(ls $DIR_DUPLICADO/*.tsx 2>/dev/null | wc -l) componentes"

echo -e "\n📋 LISTANDO COMPONENTES NO DIRETÓRIO CORRETO:"
ls -1 "$DIR_CORRETO"/*.tsx 2>/dev/null | xargs -I {} basename {} .tsx | sort

echo -e "\n📋 LISTANDO COMPONENTES NO DIRETÓRIO DUPLICADO:"
ls -1 "$DIR_DUPLICADO"/*.tsx 2>/dev/null | xargs -I {} basename {} .tsx | sort

echo -e "\n🔍 ANALISANDO DUPLICATAS ENCONTRADAS:"

# Comparar arquivos que existem em ambos os diretórios
for arquivo_correto in "$DIR_CORRETO"/*.tsx; do
    if [[ -f "$arquivo_correto" ]]; then
        nome_componente=$(basename "$arquivo_correto" .tsx)
        arquivo_duplicado="$DIR_DUPLICADO/${nome_componente}.tsx"
        
        if [[ -f "$arquivo_duplicado" ]]; then
            echo -e "\n🔄 DUPLICATA ENCONTRADA: $nome_componente"
            
            # Comparar tamanhos
            tamanho_correto=$(wc -l < "$arquivo_correto")
            tamanho_duplicado=$(wc -l < "$arquivo_duplicado")
            
            echo "   📏 Linhas - Correto: $tamanho_correto | Duplicado: $tamanho_duplicado"
            
            # Verificar se são idênticos
            if diff -q "$arquivo_correto" "$arquivo_duplicado" > /dev/null 2>&1; then
                echo "   ✅ ARQUIVOS IDÊNTICOS - Pode remover duplicata"
            else
                echo "   ⚠️  ARQUIVOS DIFERENTES - Análise manual necessária"
                
                # Mostrar algumas diferenças principais
                echo "   🔍 Primeiras diferenças encontradas:"
                diff "$arquivo_correto" "$arquivo_duplicado" | head -5 | sed 's/^/      /'
            fi
        fi
    fi
done

echo -e "\n📂 COMPONENTES ÚNICOS EM CADA DIRETÓRIO:"

echo -e "\n✅ ÚNICOS NO DIRETÓRIO CORRETO:"
for arquivo in "$DIR_CORRETO"/*.tsx; do
    if [[ -f "$arquivo" ]]; then
        nome=$(basename "$arquivo" .tsx)
        if [[ ! -f "$DIR_DUPLICADO/${nome}.tsx" ]]; then
            echo "   - $nome"
        fi
    fi
done

echo -e "\n❌ ÚNICOS NO DIRETÓRIO DUPLICADO (DEVEM SER MOVIDOS OU REMOVIDOS):"
for arquivo in "$DIR_DUPLICADO"/*.tsx; do
    if [[ -f "$arquivo" ]]; then
        nome=$(basename "$arquivo" .tsx)
        if [[ ! -f "$DIR_CORRETO/${nome}.tsx" ]]; then
            echo "   - $nome"
        fi
    fi
done

echo -e "\n🔧 VERIFICANDO IMPORTS NO REGISTRY..."
registry_file="src/components/blocks/enhancedBlockRegistry.ts"

if [[ -f "$registry_file" ]]; then
    echo "✅ Registry encontrado!"
    echo "📊 Imports que referenciam o diretório correto:"
    grep -n "from.*$DIR_CORRETO" "$registry_file" | wc -l
    
    echo "❌ Imports que referenciam o diretório duplicado:"
    grep -n "from.*$DIR_DUPLICADO" "$registry_file" | wc -l
    
    echo -e "\n📋 Exemplos de imports encontrados:"
    grep "from.*components.*blocks.*inline" "$registry_file" | head -3
else
    echo "❌ Registry não encontrado!"
fi

echo -e "\n🎯 PLANO DE AÇÃO RECOMENDADO:"
echo "1. ✅ MANTER todos os componentes em: $DIR_CORRETO"
echo "2. 🔍 ANALISAR componentes diferentes para preservar funcionalidades"
echo "3. ➡️  MOVER componentes únicos do duplicado para o correto"
echo "4. ❌ REMOVER componentes idênticos do diretório duplicado"
echo "5. 🔧 ATUALIZAR registry para importar apenas do diretório correto"
echo "6. 🎨 APLICAR identidade visual (#432818, #B89B7A) em todos"
echo "7. 🚫 REMOVER edição inline de todos os componentes"
