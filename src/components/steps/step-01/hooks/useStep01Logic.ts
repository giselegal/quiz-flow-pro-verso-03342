/**
 * 🪝 HOOK DE LÓGICA DO STEP 1 - INTRODUÇÃO
 * 
 * Concentra toda a lógica de negócio da etapa de introdução,
 * mantendo os componentes visuais limpos e focados na UI.
 */

import { useState, useCallback, useEffect } from 'react';
import { useQuizState } from '@/hooks/useQuizState';

interface UseStep01LogicProps {
    initialData?: {
        userName?: string;
        [key: string]: any;
    };
    onSave: (data: any) => void;
    onNext: () => void;
    funnelId?: string;
}

export const useStep01Logic = ({
    initialData,
    onSave,
    onNext,
    funnelId
}: UseStep01LogicProps) => {
    // Estado local do componente
    const [userName, setUserName] = useState(initialData?.userName || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Conectar com o sistema de quiz global (mesma lógica da produção)
    const { setUserName: setGlobalUserName } = useQuizState(funnelId);

    // Validação em tempo real
    const isValid = userName.trim().length >= 2;

    // Auto-save quando dados mudam (debounced)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (userName.trim()) {
                onSave({ userName: userName.trim() });
            }
        }, 500); // 500ms de debounce

        return () => clearTimeout(timeoutId);
    }, [userName, onSave]);

    // Função para atualizar nome
    const handleNameChange = useCallback((name: string) => {
        setUserName(name);
    }, []);

    // Função para submeter e avançar
    const handleSubmit = useCallback(async (name: string) => {
        if (!isValid || isSubmitting) return;

        setIsSubmitting(true);

        try {
            const trimmedName = name.trim();

            // Salvar localmente
            const stepData = {
                userName: trimmedName,
                completedAt: new Date().toISOString(),
                stepId: 'step-01'
            };
            onSave(stepData);

            // Salvar no estado global do quiz (mesma lógica da produção)
            setGlobalUserName(trimmedName);

            // Log para debug
            console.log('👤 Step01: Nome capturado:', {
                name: trimmedName,
                timestamp: new Date().toISOString(),
                funnelId
            });

            // Avançar para próximo step
            onNext();

        } catch (error) {
            console.error('❌ Erro ao processar nome no Step 1:', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [isValid, isSubmitting, onSave, setGlobalUserName, onNext, funnelId]);

    // Dados do step (compatível com sistema atual)
    const stepData = {
        type: 'intro',
        title: '<span style="color: #B89B7A; font-weight: 700;" class="playfair-display">Chega</span> <span class="playfair-display">de um guarda-roupa lotado e da sensação de que</span> <span style="color: #B89B7A; font-weight: 700;" class="playfair-display">nada combina com você.</span>',
        formQuestion: 'Como posso te chamar?',
        placeholder: 'Digite seu primeiro nome aqui...',
        buttonText: 'Quero Descobrir meu Estilo Agora!',
        image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.png',
        nextStep: 'step-2',
    };

    return {
        // Estado
        userName,
        isValid,
        isSubmitting,
        stepData,

        // Ações
        handleNameChange,
        handleSubmit,
        setUserName,

        // Dados computados
        progress: 0, // Step 1 = 0% de progresso
        canProceed: isValid && !isSubmitting,

        // Metadata
        metadata: {
            stepId: 'step-01',
            stepNumber: 1,
            totalSteps: 21,
            category: 'intro' as const,
            estimatedTime: 30 // segundos
        }
    };
};