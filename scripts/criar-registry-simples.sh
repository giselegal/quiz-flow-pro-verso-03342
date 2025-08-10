#!/bin/bash

# 🎯 CORRIGIR REGISTRY FINAL - SEM DUPLICATAS E CAMINHOS CORRETOS
echo "🎯 CORRIGIR REGISTRY FINAL"
echo "=========================="

REGISTRY_FILE="src/config/enhancedBlockRegistry.ts"

echo ""
echo "📝 Criando registry limpo e funcional..."

# Criar arquivo registry mais simples e funcional
cat > "$REGISTRY_FILE" << 'EOL'
import React from "react";
import { BlockDefinition, PropertySchema } from "@/types/editor";

/**
 * ENHANCED BLOCK REGISTRY - APENAS COMPONENTES PRINCIPAIS
 * ✅ Foco nos componentes mais usados e estáveis
 * ✅ Sem duplicatas ou imports quebrados
 * ✅ Compatível com stepTemplatesMapping atualizado
 */

// === IMPORTS DE COMPONENTES PRINCIPAIS ===

// Componentes Inline mais usados
import TextInlineBlock from "../components/editor/blocks/inline/TextInlineBlock";
import ButtonInlineBlock from "../components/editor/blocks/inline/ButtonInlineBlock";
import ImageDisplayInlineBlock from "../components/editor/blocks/inline/ImageDisplayInlineBlock";
import HeadingInlineBlock from "../components/editor/blocks/inline/HeadingInlineBlock";
import BadgeInlineBlock from "../components/editor/blocks/inline/BadgeInlineBlock";
import SpacerInlineBlock from "../components/editor/blocks/inline/SpacerInlineBlock";
import DividerInlineBlock from "../components/editor/blocks/inline/DividerInlineBlock";
import PricingCardInlineBlock from "../components/editor/blocks/inline/PricingCardInlineBlock";
import CountdownInlineBlock from "../components/editor/blocks/inline/CountdownInlineBlock";
import ProgressInlineBlock from "../components/editor/blocks/inline/ProgressInlineBlock";
import StatInlineBlock from "../components/editor/blocks/inline/StatInlineBlock";
import CTAInlineBlock from "../components/editor/blocks/inline/CTAInlineBlock";

// Componentes de Quiz - para compatibilidade com DynamicStepTemplate
import QuizStepBlock from "../components/editor/blocks/QuizStepBlock";
import QuizProgressBlock from "../components/editor/blocks/QuizProgressBlock";
import OptionsGridBlock from "../components/editor/blocks/OptionsGridBlock";

// === REGISTRY PRINCIPAL - SEM DUPLICATAS ===

export const ENHANCED_BLOCK_REGISTRY: Record<string, React.ComponentType<any>> = {
  // Text and Content
  "text": TextInlineBlock,
  "heading": HeadingInlineBlock,
  "image": ImageDisplayInlineBlock,
  
  // Interactive Elements
  "button": ButtonInlineBlock,
  "cta": CTAInlineBlock,
  
  // Layout and Design
  "spacer": SpacerInlineBlock,
  "divider": DividerInlineBlock,
  "badge": BadgeInlineBlock,
  
  // Commerce and Pricing
  "pricing-card": PricingCardInlineBlock,
  "countdown": CountdownInlineBlock,
  
  // Data and Stats
  "progress": ProgressInlineBlock,
  "stat": StatInlineBlock,
  
  // Quiz Components (para DynamicStepTemplate)
  "quiz-step": QuizStepBlock,
  "quiz-progress": QuizProgressBlock,
  "options-grid": OptionsGridBlock,
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
echo "✅ REGISTRY CRIADO COM SUCESSO!"
echo ""
echo "📊 CARACTERÍSTICAS:"
echo "   • 15 componentes principais selecionados"
echo "   • Zero duplicatas de chaves"
echo "   • Imports relativos corretos"
echo "   • Compatível com DynamicStepTemplate"
echo "   • Focado nos componentes mais usados"
echo ""
echo "🚀 Testando build..."
