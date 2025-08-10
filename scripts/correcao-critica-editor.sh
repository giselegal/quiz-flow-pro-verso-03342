#!/bin/bash

echo "🔧 PLANO DE CORREÇÃO CRÍTICA - EDITOR-FIXED"
echo "=========================================="

echo "🚨 PROBLEMAS IDENTIFICADOS:"
echo "1. ❌ Registry importa do diretório ERRADO (editor/blocks/inline)"
echo "2. ❌ 12 componentes SEM BlockComponentProps"
echo "3. ❌ SortableBlockWrapper NÃO preserva propriedades"
echo "4. ⚠️  29 componentes duplicados em local errado"

echo -e "\n🎯 CORREÇÃO 1: CORRIGIR IMPORTS DO REGISTRY"
echo "============================================"

registry_file="src/config/enhancedBlockRegistry.ts"
echo "📝 Corrigindo imports no registry..."

# Backup do registry atual
cp "$registry_file" "${registry_file}.backup.$(date +%Y%m%d_%H%M%S)"

# Corrigir imports - trocar editor/blocks/inline por blocks/inline
sed -i 's|components/editor/blocks/inline|components/blocks/inline|g' "$registry_file"
sed -i 's|components/editor/blocks/|components/blocks/|g' "$registry_file"

echo "✅ Registry corrigido"

echo -e "\n🎯 CORREÇÃO 2: VERIFICAR SORTABLEWRAPPER"
echo "========================================"

wrapper_file="src/components/editor/canvas/SortableBlockWrapper.tsx"
echo "📝 Verificando SortableBlockWrapper..."

# Verificar se tem a correção de propriedades
if grep -q "...block, properties: updatedProperties" "$wrapper_file"; then
    echo "✅ SortableBlockWrapper já preserva propriedades"
else
    echo "❌ SortableBlockWrapper PRECISA ser corrigido"
    echo "   💡 Deve ter: onUpdate({ ...block, properties: updatedProperties })"
fi

echo -e "\n🎯 CORREÇÃO 3: COMPONENTES SEM BlockComponentProps"
echo "==============================================="

components_dir="src/components/blocks/inline"
echo "📝 Corrigindo componentes sem interface correta..."

# Lista de componentes que precisam de correção
componentes_problematicos=(
    "BadgeInlineBlock"
    "BenefitsInlineBlock"
    "CTAInlineBlock"
    "CountdownInlineBlock"
    "DividerInlineBlock"
    "GuaranteeInlineBlock"
    "HeadingInlineBlock"
    "LoadingAnimationBlock"
    "PricingCardInlineBlock"
    "ProgressInlineBlock"
    "SpacerInlineBlock"
    "StatInlineBlock"
)

corrigidos=0
for componente in "${componentes_problematicos[@]}"; do
    arquivo="$components_dir/${componente}.tsx"
    
    if [[ -f "$arquivo" ]]; then
        echo "🔧 Corrigindo: $componente"
        
        # Backup
        cp "$arquivo" "${arquivo}.backup"
        
        # Verificar se já tem BlockComponentProps
        if ! grep -q "BlockComponentProps" "$arquivo"; then
            # Adicionar import se não existir
            if ! grep -q "import.*BlockComponentProps" "$arquivo"; then
                # Adicionar import após outros imports
                sed -i '/^import.*React/a import type { BlockComponentProps } from "@/types/blocks";' "$arquivo"
            fi
            
            # Corrigir interface do componente
            # Procurar por interface Props e substituir por BlockComponentProps
            sed -i 's/interface.*Props[^{]*{/interface Props extends BlockComponentProps {/' "$arquivo"
            
            # Se não tem interface, criar uma básica
            if ! grep -q "interface.*Props" "$arquivo"; then
                sed -i '/^import/a \\ninterface Props extends BlockComponentProps {\n  // Props específicas do componente\n}' "$arquivo"
            fi
            
            ((corrigidos++))
            echo "   ✅ $componente corrigido"
        else
            echo "   ✅ $componente já tem BlockComponentProps"
        fi
    else
        echo "   ❌ $componente não encontrado"
    fi
done

echo "✅ $corrigidos componentes corrigidos"

echo -e "\n🎯 CORREÇÃO 4: LIMPAR DUPLICATAS"
echo "==============================="

duplicated_dir="src/components/editor/blocks/inline"
backup_duplicated="backup_duplicated_$(date +%Y%m%d_%H%M%S)"

if [[ -d "$duplicated_dir" ]]; then
    echo "📝 Fazendo backup e limpando duplicatas..."
    
    # Backup completo
    mkdir -p "$backup_duplicated"
    cp -r "$duplicated_dir"/* "$backup_duplicated/" 2>/dev/null
    
    echo "💾 Backup criado em: $backup_duplicated"
    
    # Mover componentes únicos para o local correto antes de limpar
    for arquivo in "$duplicated_dir"/*.tsx; do
        if [[ -f "$arquivo" ]]; then
            nome=$(basename "$arquivo")
            destino="$components_dir/$nome"
            
            # Se não existe no local correto, mover
            if [[ ! -f "$destino" ]]; then
                echo "➡️  Movendo: $nome"
                cp "$arquivo" "$destino"
            fi
        fi
    done
    
    # Remover diretório duplicado
    echo "🗑️  Removendo diretório duplicado..."
    rm -rf "$duplicated_dir"
    
    echo "✅ Duplicatas limpas"
else
    echo "✅ Diretório duplicado não existe"
fi

echo -e "\n🎯 VERIFICAÇÃO FINAL"
echo "=================="

echo "📊 Verificando estado pós-correção..."

# Verificar registry
if grep -q "components/blocks/inline" "$registry_file"; then
    echo "✅ Registry importa do local correto"
else
    echo "❌ Registry ainda tem problemas"
fi

# Contar componentes com BlockComponentProps
componentes_corretos=0
total_componentes=0

for arquivo in "$components_dir"/*.tsx; do
    if [[ -f "$arquivo" ]]; then
        ((total_componentes++))
        if grep -q "BlockComponentProps" "$arquivo"; then
            ((componentes_corretos++))
        fi
    fi
done

echo "📦 Componentes com BlockComponentProps: $componentes_corretos/$total_componentes"

# Verificar se SortableWrapper está correto
if grep -q "...block, properties: updatedProperties" "$wrapper_file"; then
    echo "✅ SortableBlockWrapper preserva propriedades"
else
    echo "❌ SortableBlockWrapper precisa de correção manual"
fi

echo -e "\n🎯 PRÓXIMOS PASSOS MANUAIS:"
echo "========================="
echo "1. 🔧 Verificar SortableBlockWrapper.tsx manualmente"
echo "2. 🧪 Testar editor-fixed-dragdrop.tsx"
echo "3. 🎨 Verificar renderização dos componentes"
echo "4. 📝 Testar painel de propriedades"
echo "5. 🚀 Executar npm run dev para testar"

echo -e "\n✅ CORREÇÃO AUTOMÁTICA COMPLETA!"
echo "Verificar resultado e testar funcionamento."
