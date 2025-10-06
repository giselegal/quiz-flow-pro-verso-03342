/**
 * 📝 QUESTION PROPERTIES PANEL - Painel Modular para Perguntas
 * 
 * Painel específico para edição de steps tipo 'question' e 'strategic-question'
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus } from 'lucide-react';
import { PropertiesPanelProps, createPanelDefinition } from './PropertiesPanelRegistry';

export const QuestionPropertiesPanel: React.FC<PropertiesPanelProps> = ({
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

    const handleOptionAdd = useCallback(() => {
        const options = localData.options || [];
        const newOption = {
            id: `opt-${Date.now()}`,
            text: 'Nova opção',
            value: `option-${options.length + 1}`
        };
        handleChange('options', [...options, newOption]);
    }, [localData, handleChange]);

    const handleOptionRemove = useCallback((optionId: string) => {
        const options = localData.options || [];
        handleChange('options', options.filter((opt: any) => opt.id !== optionId));
    }, [localData, handleChange]);

    const handleOptionUpdate = useCallback((optionId: string, text: string) => {
        const options = localData.options || [];
        handleChange('options', options.map((opt: any) =>
            opt.id === optionId ? { ...opt, text } : opt
        ));
    }, [localData, handleChange]);

    return (
        <div className="space-y-6">
            {/* Pergunta */}
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

            {/* Descrição Opcional */}
            <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Input
                    id="description"
                    value={localData.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Descrição adicional..."
                />
            </div>

            {/* Opções de Resposta */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Opções de Resposta</Label>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleOptionAdd}
                        className="h-8"
                    >
                        <Plus className="w-3 h-3 mr-1" />
                        Adicionar
                    </Button>
                </div>

                <div className="space-y-2">
                    {(localData.options || []).map((option: any, index: number) => (
                        <div key={option.id} className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                            <Input
                                value={option.text}
                                onChange={(e) => handleOptionUpdate(option.id, e.target.value)}
                                placeholder="Texto da opção..."
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOptionRemove(option.id)}
                                className="h-8 w-8 p-0 flex-shrink-0"
                            >
                                <Minus className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}

                    {(!localData.options || localData.options.length === 0) && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            Nenhuma opção adicionada. Clique em "Adicionar" para criar opções de resposta.
                        </p>
                    )}
                </div>
            </div>

            {/* Configurações Adicionais */}
            <div className="space-y-2">
                <Label htmlFor="buttonText">Texto do Botão</Label>
                <Input
                    id="buttonText"
                    value={localData.buttonText || 'Próxima'}
                    onChange={(e) => handleChange('buttonText', e.target.value)}
                    placeholder="Próxima"
                />
            </div>
        </div>
    );
};

// ============================================================
// DEFINIÇÃO DO PAINEL PARA REGISTRO
// ============================================================

export const QuestionPropertiesPanelDefinition = createPanelDefinition(
    'question',
    QuestionPropertiesPanel,
    {
        label: 'Pergunta',
        description: 'Painel para perguntas do quiz',
        icon: '❓',
        priority: 10
    }
);

export const StrategicQuestionPropertiesPanelDefinition = createPanelDefinition(
    'strategic-question',
    QuestionPropertiesPanel,
    {
        label: 'Pergunta Estratégica',
        description: 'Painel para perguntas estratégicas',
        icon: '🎯',
        priority: 9
    }
);
