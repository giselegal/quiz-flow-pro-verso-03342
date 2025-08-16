#!/bin/bash

echo "🎯 ANÁLISE CRÍTICA: CONFIGURAÇÃO CORRETA DO EDITOR-FIXED"
echo "======================================================="

echo "📋 VERIFICANDO ARQUIVOS CRÍTICOS DO SISTEMA..."

# 1. VERIFICAR EDITOR-FIXED PRINCIPAL
echo -e "\n🔍 1. EDITOR-FIXED-DRAGDROP.TSX"
editor_file="src/pages/editor-fixed-dragdrop.tsx"
if [[ -f "$editor_file" ]]; then
    echo "   ✅ Arquivo existe"
    echo "   📊 Linhas: $(wc -l < "$editor_file")"
    
    # Verificar imports críticos
    echo "   🔧 Imports críticos:"
    grep -n "import.*UniversalPropertiesPanel\|import.*enhancedBlockRegistry\|import.*EditorContext" "$editor_file" | head -5
    
    # Verificar se usa updateBlock corretamente
    updateblock_usage=$(grep -c "updateBlock\|onUpdate" "$editor_file")
    echo "   📝 Uso de updateBlock: $updateblock_usage ocorrências"
    
else
    echo "   ❌ Arquivo não encontrado!"
fi

# 2. VERIFICAR ENHANCED BLOCK REGISTRY
echo -e "\n🔍 2. ENHANCED BLOCK REGISTRY"
registry_file="src/config/enhancedBlockRegistry.ts"
if [[ -f "$registry_file" ]]; then
    echo "   ✅ Registry existe"
    echo "   📊 Linhas: $(wc -l < "$registry_file")"
    
    # Contar componentes registrados
    componentes_registrados=$(grep -c "type.*:" "$registry_file")
    echo "   📦 Componentes registrados: $componentes_registrados"
    
    # Verificar imports problemáticos
    imports_editor=$(grep -c "import.*editor.*blocks" "$registry_file")
    imports_corretos=$(grep -c "import.*components.*blocks.*inline" "$registry_file")
    echo "   🔧 Imports do editor: $imports_editor"
    echo "   ✅ Imports corretos: $imports_corretos"
    
    # Verificar função de geração de definições
    has_generate_function=$(grep -c "generateBlockDefinitions\|export.*function" "$registry_file")
    echo "   ⚙️  Função de geração: $has_generate_function"
    
else
    echo "   ❌ Registry não encontrado!"
fi

# 3. VERIFICAR SORTABLE BLOCK WRAPPER (CRÍTICO)
echo -e "\n🔍 3. SORTABLE BLOCK WRAPPER"
wrapper_file="src/components/editor/canvas/SortableBlockWrapper.tsx"
if [[ -f "$wrapper_file" ]]; then
    echo "   ✅ Wrapper existe"
    echo "   📊 Linhas: $(wc -l < "$wrapper_file")"
    
    # Verificar se tem handlePropertyChange
    has_handle_prop=$(grep -c "handlePropertyChange\|onPropertyChange" "$wrapper_file")
    echo "   🔧 Handler de propriedades: $has_handle_prop"
    
    # Verificar se preserva properties
    preserves_props=$(grep -c "\.\.\.block.*properties.*updatedProperties" "$wrapper_file")
    echo "   💾 Preserva propriedades: $preserves_props"
    
    # Verificar import do UniversalBlockRenderer
    uses_renderer=$(grep -c "UniversalBlockRenderer" "$wrapper_file")
    echo "   🎨 Usa renderer universal: $uses_renderer"
    
else
    echo "   ❌ Wrapper não encontrado!"
fi

# 4. VERIFICAR UNIVERSAL PROPERTIES PANEL
echo -e "\n🔍 4. UNIVERSAL PROPERTIES PANEL"
panel_file="src/components/universal/EnhancedUniversalPropertiesPanel.tsx"
if [[ -f "$panel_file" ]]; then
    echo "   ✅ Painel existe"
    echo "   📊 Linhas: $(wc -l < "$panel_file")"
    
    # Verificar se tem useUnifiedProperties
    has_unified_hook=$(grep -c "useUnifiedProperties" "$panel_file")
    echo "   🔧 Hook unificado: $has_unified_hook"
    
    # Verificar se processa todos os tipos de bloco
    handles_all_types=$(grep -c "switch.*type\|case.*:" "$panel_file")
    echo "   🎯 Processa tipos: $handles_all_types casos"
    
else
    echo "   ❌ Painel não encontrado!"
fi

# 5. VERIFICAR DIRETÓRIO DE COMPONENTES CORRETO
echo -e "\n🔍 5. COMPONENTES INLINE (DIRETÓRIO CORRETO)"
components_dir="src/components/blocks/inline"
if [[ -d "$components_dir" ]]; then
    componentes_corretos=$(ls "$components_dir"/*.tsx 2>/dev/null | wc -l)
    echo "   ✅ Diretório existe com $componentes_corretos componentes"
    
    echo "   📦 Componentes encontrados:"
    ls "$components_dir"/*.tsx 2>/dev/null | xargs -I {} basename {} .tsx | sed 's/^/      - /'
    
else
    echo "   ❌ Diretório de componentes não encontrado!"
fi

# 6. VERIFICAR COMPONENTES DUPLICADOS (PROBLEMA)
echo -e "\n🔍 6. COMPONENTES DUPLICADOS (VERIFICAÇÃO)"
duplicated_dir="src/components/editor/blocks/inline"
if [[ -d "$duplicated_dir" ]]; then
    componentes_duplicados=$(ls "$duplicated_dir"/*.tsx 2>/dev/null | wc -l)
    echo "   ⚠️  Diretório duplicado existe com $componentes_duplicados componentes"
    echo "   🚨 PROBLEMA: Registry pode estar importando do local errado!"
else
    echo "   ✅ Diretório duplicado não existe (bom!)"
fi

# 7. VERIFICAR INTERFACE BlockComponentProps
echo -e "\n🔍 7. INTERFACE BlockComponentProps"
types_file="src/types/blocks.ts"
if [[ -f "$types_file" ]]; then
    echo "   ✅ Arquivo de tipos existe"
    
    has_block_props=$(grep -c "BlockComponentProps\|interface.*Block.*Props" "$types_file")
    echo "   🔧 Interface BlockComponentProps: $has_block_props"
    
    has_onupdate=$(grep -c "onUpdate\|onPropertyChange" "$types_file")
    echo "   📝 Handler onUpdate: $has_onupdate"
    
else
    echo "   ❌ Arquivo de tipos não encontrado!"
fi

echo -e "\n🎯 DIAGNÓSTICO CRÍTICO:"
echo "======================="

# Verificar alinhamento crítico
echo "🔍 Verificando alinhamento entre arquivos..."

# 1. Registry vs Componentes disponíveis
echo -e "\n📊 ALINHAMENTO REGISTRY ↔ COMPONENTES:"
if [[ -f "$registry_file" && -d "$components_dir" ]]; then
    echo "   🔧 Componentes no Registry:"
    grep "import.*Block.*from" "$registry_file" | sed 's/.*import \(.*\) from.*/   - \1/' | sort
    
    echo "   📦 Componentes disponíveis:"
    ls "$components_dir"/*.tsx 2>/dev/null | xargs -I {} basename {} .tsx | sed 's/^/   - /' | sort
fi

# 2. Imports do Registry - onde está importando
echo -e "\n📍 LOCALIZAÇÃO DOS IMPORTS NO REGISTRY:"
if [[ -f "$registry_file" ]]; then
    grep "from.*components" "$registry_file" | head -5 | sed 's/^/   /'
fi

# 3. Verificar se componentes tem BlockComponentProps
echo -e "\n🔧 COMPONENTES COM INTERFACE CORRETA:"
component_count=0
correct_interface_count=0

for component_file in "$components_dir"/*.tsx; do
    if [[ -f "$component_file" ]]; then
        ((component_count++))
        component_name=$(basename "$component_file" .tsx)
        
        # Verificar se usa BlockComponentProps
        if grep -q "BlockComponentProps" "$component_file"; then
            echo "   ✅ $component_name - Usa BlockComponentProps"
            ((correct_interface_count++))
        else
            echo "   ❌ $component_name - NÃO usa BlockComponentProps"
        fi
    fi
done

echo -e "\n📊 RESUMO DE COMPATIBILIDADE:"
echo "   📦 Total de componentes: $component_count"
echo "   ✅ Com interface correta: $correct_interface_count"
echo "   ❌ Com problemas: $((component_count - correct_interface_count))"

echo -e "\n🎯 PLANO DE CORREÇÃO NECESSÁRIO:"
echo "================================"
echo "1. ✅ Verificar se Registry importa do diretório correto"
echo "2. ✅ Garantir que todos os componentes usam BlockComponentProps"
echo "3. ✅ Verificar se SortableBlockWrapper preserva propriedades"
echo "4. ✅ Confirmar que editor-fixed usa updateBlock corretamente"
echo "5. ✅ Testar comunicação entre painel e componentes"

echo -e "\n🔥 ARQUIVOS CRÍTICOS QUE DEVEM ESTAR ALINHADOS:"
echo "=============================================="
echo "   1. src/pages/editor-fixed-dragdrop.tsx"
echo "   2. src/config/enhancedBlockRegistry.ts"
echo "   3. src/components/editor/canvas/SortableBlockWrapper.tsx"
echo "   4. src/components/universal/EnhancedUniversalPropertiesPanel.tsx"
echo "   5. src/types/blocks.ts"
echo "   6. src/components/blocks/inline/*.tsx (todos os componentes)"
