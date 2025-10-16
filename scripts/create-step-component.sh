#!/bin/bash

# 🎨 SCRIPT DE CRIAÇÃO DE NOVO STEP COMPONENT
# Automatiza a criação de um novo step seguindo o padrão do IntroStep

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║         🎨 CRIADOR DE STEP COMPONENTS                   ║"
echo "║         Quiz Flow Pro - Gisele Galvão                   ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Verificar se está na raiz do projeto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script na raiz do projeto${NC}"
    exit 1
fi

# Coletar informações
echo -e "${YELLOW}📝 Vamos criar um novo step component...${NC}\n"

read -p "Nome do componente (ex: WelcomeStep): " COMPONENT_NAME
read -p "Tipo do step (ex: welcome): " STEP_TYPE
read -p "Step ID (ex: step-00): " STEP_ID
read -p "Título do step: " STEP_TITLE
read -p "Descrição: " STEP_DESCRIPTION

# Validações
if [ -z "$COMPONENT_NAME" ] || [ -z "$STEP_TYPE" ] || [ -z "$STEP_ID" ]; then
    echo -e "${RED}❌ Nome, tipo e ID são obrigatórios!${NC}"
    exit 1
fi

# Caminhos dos arquivos
COMPONENT_PATH="src/components/quiz/${COMPONENT_NAME}.tsx"
REGISTRY_PATH="src/components/step-registry/ProductionStepsRegistry.tsx"
DATA_PATH="src/data/quizSteps.ts"

echo -e "\n${BLUE}📂 Arquivos que serão criados/modificados:${NC}"
echo "  - ${COMPONENT_PATH}"
echo "  - ${REGISTRY_PATH}"
echo "  - ${DATA_PATH}"
echo ""

read -p "Continuar? (s/n): " CONFIRM
if [ "$CONFIRM" != "s" ]; then
    echo -e "${YELLOW}Operação cancelada.${NC}"
    exit 0
fi

# ============================================================================
# CRIAR COMPONENTE
# ============================================================================

echo -e "\n${BLUE}1️⃣ Criando componente ${COMPONENT_NAME}...${NC}"

cat > "$COMPONENT_PATH" << 'EOF'
'use client';

import React, { useState } from 'react';
import type { QuizStep } from '../../data/quizSteps';

/**
 * STEP_TYPE_UPPER STEP
 * 
 * STEP_DESCRIPTION
 */

interface COMPONENT_NAMEProps {
    data: QuizStep;
    onContinue?: () => void;
}

export default function COMPONENT_NAME({ data, onContinue }: COMPONENT_NAMEProps) {
    // ============================================================================
    // ESTADO LOCAL
    // ============================================================================
    const [isReady, setIsReady] = useState(false);

    // ============================================================================
    // FALLBACK DE DADOS
    // ============================================================================
    const safeData = data || {
        type: 'STEP_TYPE',
        title: 'STEP_TITLE',
        description: 'STEP_DESCRIPTION',
        buttonText: 'Continuar',
        image: '',
        backgroundColor: '#FAF9F7',
        textColor: '#432818',
        accentColor: '#B89B7A',
    };

    // ============================================================================
    // HANDLERS
    // ============================================================================
    const handleContinue = () => {
        if (!isReady) return;
        
        if (typeof onContinue === 'function') {
            try {
                onContinue();
            } catch (err) {
                console.error('❌ [COMPONENT_NAME] Erro ao executar onContinue:', err);
            }
        } else {
            console.warn('⚠️ [COMPONENT_NAME] onContinue não fornecido');
        }
    };

    // ============================================================================
    // RENDERIZAÇÃO
    // ============================================================================
    return (
        <main
            className="flex flex-col items-center justify-center min-h-screen px-4 py-8"
            style={{ 
                backgroundColor: safeData.backgroundColor,
                color: safeData.textColor 
            }}
        >
            <div className="w-full max-w-md mx-auto space-y-8">
                
                {/* Imagem */}
                {safeData.image && (
                    <div className="flex justify-center">
                        <img
                            src={safeData.image}
                            alt={safeData.title}
                            className="w-full max-w-sm rounded-lg shadow-lg"
                        />
                    </div>
                )}

                {/* Título */}
                <h1 
                    className="text-3xl font-bold text-center"
                    style={{ 
                        fontFamily: '"Playfair Display", serif',
                        color: safeData.accentColor 
                    }}
                >
                    {safeData.title}
                </h1>

                {/* Descrição */}
                {safeData.description && (
                    <p className="text-center text-base leading-relaxed opacity-80">
                        {safeData.description}
                    </p>
                )}

                {/* Checkbox */}
                <div className="flex items-center justify-center space-x-3">
                    <input
                        type="checkbox"
                        id="ready-checkbox"
                        checked={isReady}
                        onChange={(e) => setIsReady(e.target.checked)}
                        className="w-5 h-5 rounded border-2 cursor-pointer"
                        style={{ 
                            accentColor: safeData.accentColor,
                            borderColor: safeData.accentColor 
                        }}
                    />
                    <label 
                        htmlFor="ready-checkbox" 
                        className="text-sm font-medium cursor-pointer select-none"
                    >
                        Estou pronto(a)
                    </label>
                </div>

                {/* Botão */}
                <button
                    onClick={handleContinue}
                    disabled={!isReady}
                    className={`w-full py-4 px-6 text-lg font-semibold rounded-lg transition-all duration-300 ${
                        isReady
                            ? 'shadow-lg hover:shadow-xl hover:scale-105'
                            : 'opacity-50 cursor-not-allowed'
                    }`}
                    style={{
                        backgroundColor: isReady ? safeData.accentColor : '#cccccc',
                        color: '#ffffff'
                    }}
                >
                    {safeData.buttonText || 'Continuar'}
                </button>
            </div>

            {/* Footer */}
            <footer className="mt-auto pt-8 text-center">
                <p className="text-xs opacity-50">
                    © {new Date().getFullYear()} Todos os direitos reservados
                </p>
            </footer>
        </main>
    );
}
EOF

# Substituir placeholders
sed -i "s/STEP_TYPE_UPPER/${STEP_TYPE^^}/g" "$COMPONENT_PATH"
sed -i "s/COMPONENT_NAME/$COMPONENT_NAME/g" "$COMPONENT_PATH"
sed -i "s/STEP_TYPE/$STEP_TYPE/g" "$COMPONENT_PATH"
sed -i "s/STEP_TITLE/$STEP_TITLE/g" "$COMPONENT_PATH"
sed -i "s/STEP_DESCRIPTION/$STEP_DESCRIPTION/g" "$COMPONENT_PATH"

echo -e "${GREEN}✅ Componente criado em: $COMPONENT_PATH${NC}"

# ============================================================================
# INSTRUÇÕES MANUAIS
# ============================================================================

echo -e "\n${YELLOW}📋 PRÓXIMOS PASSOS MANUAIS:${NC}\n"

echo -e "${BLUE}2️⃣ Adicionar adapter em ProductionStepsRegistry.tsx:${NC}"
cat << EOF

// No início do arquivo, adicione:
import Original$COMPONENT_NAME from '@/components/quiz/$COMPONENT_NAME';

// Adicione o adapter:
const ${COMPONENT_NAME}Adapter: React.FC<BaseStepProps> = (props) => {
    const { stepId, onNext, onSave, data = {}, quizState, ...otherProps } = props as any;
    
    const adaptedProps = {
        data: { id: stepId, type: '$STEP_TYPE' as const, ...data },
        onContinue: () => {
            console.log('[$COMPONENT_NAME] Avançando');
            onSave({ ${STEP_TYPE}Confirmed: true });
            onNext();
        },
        ...otherProps
    };
    
    return <Original$COMPONENT_NAME {...adaptedProps} />;
};

// No export final, adicione:
export {
    IntroStepAdapter,
    QuestionStepAdapter,
    StrategicQuestionStepAdapter,
    TransitionStepAdapter,
    ResultStepAdapter,
    OfferStepAdapter,
    ${COMPONENT_NAME}Adapter, // ← NOVO
};
EOF

echo -e "\n${BLUE}3️⃣ Adicionar dados em quizSteps.ts:${NC}"
cat << EOF

export const QUIZ_STEPS: Record<string, QuizStep> = {
    '$STEP_ID': {
        type: '$STEP_TYPE',
        title: '$STEP_TITLE',
        description: '$STEP_DESCRIPTION',
        buttonText: 'Continuar',
        image: '',
        backgroundColor: '#FAF9F7',
        textColor: '#432818',
        accentColor: '#B89B7A',
        nextStep: 'step-01', // Ajustar conforme necessário
    },
    
    // ... outros steps
};

// Atualizar STEP_ORDER:
export const STEP_ORDER = [
    '$STEP_ID', // ← NOVO
    'step-01',
    // ... outros
];
EOF

echo -e "\n${BLUE}4️⃣ Configurar lazy loading em UnifiedStepRenderer.tsx:${NC}"
cat << EOF

const LazyStepComponents = {
    '$STEP_ID': lazy(() => 
        import('@/components/step-registry/ProductionStepsRegistry')
            .then(m => ({ default: m.${COMPONENT_NAME}Adapter }))
    ),
    
    // ... outros steps
};
EOF

echo -e "\n${BLUE}5️⃣ Registrar no StepRegistry (opcional):${NC}"
cat << EOF

export function registerProductionSteps() {
    stepRegistry.register('$STEP_ID', ${COMPONENT_NAME}Adapter, {
        name: '$COMPONENT_NAME',
        category: 'intro', // Ajustar categoria
        description: '$STEP_DESCRIPTION',
        icon: '🎯',
        version: '1.0.0'
    });
    
    // ... outros registros
}
EOF

# ============================================================================
# FINALIZAÇÃO
# ============================================================================

echo -e "\n${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                    ✨ CONCLUÍDO!                        ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}\n"

echo -e "${YELLOW}📚 Consulte o guia completo em:${NC}"
echo -e "   GUIA_CRIAR_COMPONENTES_SEPARADOS.md\n"

echo -e "${YELLOW}🧪 Para testar:${NC}"
echo -e "   1. Complete os passos manuais acima"
echo -e "   2. Execute: npm run dev"
echo -e "   3. Acesse: http://localhost:8080/quiz-estilo\n"

echo -e "${BLUE}Happy coding! 🚀${NC}\n"
