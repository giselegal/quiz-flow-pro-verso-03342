/**
 * 🎯 RESULT PROPERTIES PANEL - Painel Modular para Telas de Resultado
 * 
 * Painel específico para edição de steps tipo 'result' e 'transition-result'
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PropertiesPanelProps, createPanelDefinition } from './PropertiesPanelRegistry';

export const ResultPropertiesPanel: React.FC<PropertiesPanelProps> = ({
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

    return (
        <div className="space-y-6">
            {/* Título do Resultado */}
            <div className="space-y-2">
                <Label htmlFor="title">Título do Resultado</Label>
                <Input
                    id="title"
                    value={localData.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Seu Perfil Revelado!"
                />
            </div>

            {/* Subtítulo */}
            <div className="space-y-2">
                <Label htmlFor="subtitle">Subtítulo (opcional)</Label>
                <Input
                    id="subtitle"
                    value={localData.subtitle || ''}
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                    placeholder="Descubra mais sobre você"
                />
            </div>

            {/* Texto do Resultado */}
            <div className="space-y-2">
                <Label htmlFor="text">Texto do Resultado</Label>
                <Textarea
                    id="text"
                    value={localData.text || ''}
                    onChange={(e) => handleChange('text', e.target.value)}
                    placeholder="Baseado nas suas respostas, identificamos que..."
                    rows={5}
                    className="resize-none"
                />
            </div>

            {/* Lista de Insights */}
            <div className="space-y-2">
                <Label htmlFor="insights">Insights (um por linha)</Label>
                <Textarea
                    id="insights"
                    value={(localData.insights || []).join('\n')}
                    onChange={(e) => handleChange('insights', e.target.value.split('\n').filter(Boolean))}
                    placeholder="• Você valoriza organização&#10;• Busca soluções práticas&#10;• Prefere planejamento"
                    rows={4}
                    className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                    Cada linha será um item de lista
                </p>
            </div>

            {/* Botão CTA */}
            <div className="space-y-2">
                <Label htmlFor="buttonText">Texto do Botão</Label>
                <Input
                    id="buttonText"
                    value={localData.buttonText || 'Ver Recomendações'}
                    onChange={(e) => handleChange('buttonText', e.target.value)}
                    placeholder="Ver Recomendações"
                />
            </div>

            {/* URL do Botão */}
            <div className="space-y-2">
                <Label htmlFor="buttonUrl">URL do Botão (opcional)</Label>
                <Input
                    id="buttonUrl"
                    type="url"
                    value={localData.buttonUrl || ''}
                    onChange={(e) => handleChange('buttonUrl', e.target.value)}
                    placeholder="https://..."
                />
            </div>
        </div>
    );
};

// ============================================================
// DEFINIÇÃO DO PAINEL PARA REGISTRO
// ============================================================

export const ResultPropertiesPanelDefinition = createPanelDefinition(
    'result',
    ResultPropertiesPanel,
    {
        label: 'Resultado',
        description: 'Painel para telas de resultado',
        icon: '🎯',
        priority: 8
    }
);

export const TransitionResultPropertiesPanelDefinition = createPanelDefinition(
    'transition-result',
    ResultPropertiesPanel,
    {
        label: 'Transição com Resultado',
        description: 'Painel para transições com resultado',
        icon: '➡️',
        priority: 7
    }
);
