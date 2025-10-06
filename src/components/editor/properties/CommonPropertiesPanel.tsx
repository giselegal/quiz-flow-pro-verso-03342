/**
 * ⚙️ COMMON PROPERTIES PANEL - Painel Genérico para Propriedades Comuns
 * 
 * Painel fallback para steps sem painel específico (intro, transition, etc)
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { PropertiesPanelProps, createPanelDefinition } from './PropertiesPanelRegistry';

export const CommonPropertiesPanel: React.FC<PropertiesPanelProps> = ({
    stepId,
    stepType,
    stepData,
    onUpdate,
}) => {
    const [localData, setLocalData] = useState(stepData);

    // Sincronizar com props
    useEffect(() => {
        setLocalData(stepData);
    }, [stepData]);

    const handleChange = useCallback((key: string, value: any) => {
        const updated = { ...localData, [key]: value };
        setLocalData(updated);
        onUpdate(updated);
    }, [localData, onUpdate]);

    const stepTypeLabels: Record<string, string> = {
        'intro': 'Introdução',
        'transition': 'Transição',
        'question': 'Pergunta',
        'strategic-question': 'Pergunta Estratégica',
        'result': 'Resultado',
        'offer': 'Oferta'
    };

    return (
        <div className="space-y-6">
            <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                    Painel genérico para <strong>{stepTypeLabels[stepType] || stepType}</strong>.
                    Edite as propriedades básicas abaixo.
                </AlertDescription>
            </Alert>

            {/* Título */}
            {!['question', 'strategic-question'].includes(stepType) && (
                <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                        id="title"
                        value={localData.title || ''}
                        onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="Digite o título..."
                    />
                </div>
            )}

            {/* Pergunta (para tipos de pergunta) */}
            {['question', 'strategic-question'].includes(stepType) && (
                <div className="space-y-2">
                    <Label htmlFor="questionText">Pergunta</Label>
                    <Textarea
                        id="questionText"
                        value={localData.questionText || ''}
                        onChange={(e) => handleChange('questionText', e.target.value)}
                        placeholder="Digite a pergunta..."
                        rows={3}
                        className="resize-none"
                    />
                </div>
            )}

            {/* Texto */}
            <div className="space-y-2">
                <Label htmlFor="text">Texto</Label>
                <Textarea
                    id="text"
                    value={localData.text || ''}
                    onChange={(e) => handleChange('text', e.target.value)}
                    placeholder="Digite o texto..."
                    rows={4}
                    className="resize-none"
                />
            </div>

            {/* Campos específicos para intro */}
            {stepType === 'intro' && (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="formQuestion">Pergunta do Formulário</Label>
                        <Input
                            id="formQuestion"
                            value={localData.formQuestion || ''}
                            onChange={(e) => handleChange('formQuestion', e.target.value)}
                            placeholder="Como posso te chamar?"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="placeholder">Placeholder</Label>
                        <Input
                            id="placeholder"
                            value={localData.placeholder || ''}
                            onChange={(e) => handleChange('placeholder', e.target.value)}
                            placeholder="Seu nome..."
                        />
                    </div>
                </>
            )}

            {/* Botão */}
            <div className="space-y-2">
                <Label htmlFor="buttonText">Texto do Botão</Label>
                <Input
                    id="buttonText"
                    value={localData.buttonText || ''}
                    onChange={(e) => handleChange('buttonText', e.target.value)}
                    placeholder="Próximo"
                />
            </div>

            {/* Debug: Mostrar todas as propriedades */}
            <details className="text-xs">
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                    🔍 Ver todas as propriedades (debug)
                </summary>
                <pre className="mt-2 p-2 bg-muted rounded text-[10px] overflow-auto max-h-40">
                    {JSON.stringify(localData, null, 2)}
                </pre>
            </details>
        </div>
    );
};

// ============================================================
// DEFINIÇÃO DO PAINEL PARA REGISTRO
// ============================================================

export const CommonPropertiesPanelDefinition = createPanelDefinition(
    'common',
    CommonPropertiesPanel,
    {
        label: 'Propriedades Comuns',
        description: 'Painel genérico para qualquer tipo de step',
        icon: '⚙️',
        priority: 0  // Menor prioridade - será usado como fallback
    }
);

// Definições específicas para intro e transition
export const IntroPropertiesPanelDefinition = createPanelDefinition(
    'intro',
    CommonPropertiesPanel,
    {
        label: 'Introdução',
        description: 'Painel para tela de introdução',
        icon: '🏠',
        priority: 5
    }
);

export const TransitionPropertiesPanelDefinition = createPanelDefinition(
    'transition',
    CommonPropertiesPanel,
    {
        label: 'Transição',
        description: 'Painel para telas de transição',
        icon: '➡️',
        priority: 4
    }
);
