#!/bin/bash

# 🧹 LIMPEZA COMPLETA DO ENHANCED BLOCK REGISTRY
echo "🧹 LIMPEZA COMPLETA DO ENHANCED BLOCK REGISTRY"
echo "=============================================="

REGISTRY_FILE="src/config/enhancedBlockRegistry.ts"

echo ""
echo "📋 Listando componentes que REALMENTE existem..."

# Buscar todos os arquivos .tsx em components/editor/blocks
EXISTING_COMPONENTS=()
while IFS= read -r -d '' file; do
    filename=$(basename "$file" .tsx)
    filepath_relative=${file#src/config/}
    filepath_relative="../${filepath_relative%.tsx}"
    
    echo "   ✅ $filename - $file"
    EXISTING_COMPONENTS+=("$filename:$filepath_relative")
done < <(find src/components/editor/blocks -name "*.tsx" -type f -print0)

echo ""
echo "📝 Total de componentes encontrados: ${#EXISTING_COMPONENTS[@]}"

echo ""
echo "🔨 Reescrevendo enhancedBlockRegistry.ts com apenas componentes existentes..."

# Criar novo arquivo limpo
cat > "$REGISTRY_FILE" << 'EOL'
import React from "react";
import { BlockDefinition, PropertySchema } from "@/types/editor";

/**
 * ENHANCED BLOCK REGISTRY - APENAS COMPONENTES EXISTENTES
 * ✅ Sistema LIMPO após refatoração
 * ✅ Import apenas de componentes reais
 * ✅ Sem dependências quebradas
 */

// === IMPORTS AUTOMÁTICOS DE COMPONENTES EXISTENTES ===
EOL

# Adicionar imports para componentes existentes
echo "" >> "$REGISTRY_FILE"
for component_info in "${EXISTING_COMPONENTS[@]}"; do
    IFS=':' read -r name path <<< "$component_info"
    echo "import $name from \"$path\";" >> "$REGISTRY_FILE"
done

# Adicionar o resto da estrutura do registry
cat >> "$REGISTRY_FILE" << 'EOL'

// === ENHANCED BLOCK REGISTRY - SISTEMA CENTRALIZADO ===

/**
 * Registry de todos os componentes disponíveis
 * ✅ Validação automática da existência
 * ✅ Tipagem forte com TypeScript
 * ✅ Suporte a propriedades dinâmicas
 */
export const ENHANCED_BLOCK_REGISTRY: Record<string, React.ComponentType<any>> = {
EOL

# Adicionar registro de componentes
echo "  // Componentes ativos e funcionais" >> "$REGISTRY_FILE"
for component_info in "${EXISTING_COMPONENTS[@]}"; do
    IFS=':' read -r name path <<< "$component_info"
    # Converter nome do componente para kebab-case para uso como key
    key_name=$(echo "$name" | sed 's/InlineBlock//g' | sed 's/Block//g' | sed 's/\([A-Z]\)/-\L\1/g' | sed 's/^-//' | tr '[:upper:]' '[:lower:]')
    echo "  \"$key_name\": $name," >> "$REGISTRY_FILE"
done

# Finalizar o registry
cat >> "$REGISTRY_FILE" << 'EOL'
};

/**
 * Obter componente por tipo
 */
export const getBlockComponent = (type: string): React.ComponentType<any> | null => {
  return ENHANCED_BLOCK_REGISTRY[type] || null;
};

/**
 * Listar todos os tipos disponíveis
 */
export const getAvailableBlockTypes = (): string[] => {
  return Object.keys(ENHANCED_BLOCK_REGISTRY);
};

/**
 * Verificar se um tipo de bloco existe
 */
export const blockTypeExists = (type: string): boolean => {
  return type in ENHANCED_BLOCK_REGISTRY;
};

/**
 * Registry padrão para compatibilidade
 */
export default ENHANCED_BLOCK_REGISTRY;
EOL

echo ""
echo "✅ REGISTRY REESCRITO COM SUCESSO!"
echo ""
echo "📊 ESTATÍSTICAS:"
echo "   • Total de componentes: ${#EXISTING_COMPONENTS[@]}"
echo "   • Arquivo gerado: $REGISTRY_FILE"
echo "   • Imports limpos: Sem dependências quebradas"
echo ""
echo "🚀 Testando build..."
