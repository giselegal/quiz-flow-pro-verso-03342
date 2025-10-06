/**
 * 💎 OFFER PROPERTIES PANEL - Painel Modular para Telas de Oferta
 * 
 * Painel específico para edição de steps tipo 'offer'
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { PropertiesPanelProps, createPanelDefinition } from './PropertiesPanelRegistry';

export const OfferPropertiesPanel: React.FC<PropertiesPanelProps> = ({
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
            {/* Título da Oferta */}
            <div className="space-y-2">
                <Label htmlFor="title">Título da Oferta</Label>
                <Input
                    id="title"
                    value={localData.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Oferta Especial para Você!"
                />
            </div>

            {/* Subtítulo */}
            <div className="space-y-2">
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Input
                    id="subtitle"
                    value={localData.subtitle || ''}
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                    placeholder="Baseado no seu perfil"
                />
            </div>

            {/* Descrição da Oferta */}
            <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                    id="description"
                    value={localData.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Descubra como podemos ajudá-lo a alcançar seus objetivos..."
                    rows={4}
                    className="resize-none"
                />
            </div>

            {/* Preço */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Preço</Label>
                    <Input
                        id="price"
                        value={localData.price || ''}
                        onChange={(e) => handleChange('price', e.target.value)}
                        placeholder="R$ 497,00"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="originalPrice">Preço Original (opcional)</Label>
                    <Input
                        id="originalPrice"
                        value={localData.originalPrice || ''}
                        onChange={(e) => handleChange('originalPrice', e.target.value)}
                        placeholder="R$ 997,00"
                    />
                </div>
            </div>

            {/* Benefícios */}
            <div className="space-y-2">
                <Label htmlFor="benefits">Benefícios (um por linha)</Label>
                <Textarea
                    id="benefits"
                    value={(localData.benefits || []).join('\n')}
                    onChange={(e) => handleChange('benefits', e.target.value.split('\n').filter(Boolean))}
                    placeholder="✓ Acesso vitalício&#10;✓ Suporte dedicado&#10;✓ Atualizações gratuitas"
                    rows={5}
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
                    value={localData.buttonText || 'Garantir Minha Vaga'}
                    onChange={(e) => handleChange('buttonText', e.target.value)}
                    placeholder="Garantir Minha Vaga"
                />
            </div>

            {/* URL do Checkout */}
            <div className="space-y-2">
                <Label htmlFor="checkoutUrl">URL do Checkout</Label>
                <Input
                    id="checkoutUrl"
                    type="url"
                    value={localData.checkoutUrl || ''}
                    onChange={(e) => handleChange('checkoutUrl', e.target.value)}
                    placeholder="https://checkout.exemplo.com/..."
                />
            </div>

            {/* Urgência */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="showUrgency"
                        checked={localData.showUrgency || false}
                        onCheckedChange={(checked) => handleChange('showUrgency', checked)}
                    />
                    <Label
                        htmlFor="showUrgency"
                        className="text-sm font-normal cursor-pointer"
                    >
                        Mostrar contador de urgência
                    </Label>
                </div>

                {localData.showUrgency && (
                    <div className="space-y-2 pl-6">
                        <Label htmlFor="urgencyText">Texto de Urgência</Label>
                        <Input
                            id="urgencyText"
                            value={localData.urgencyText || ''}
                            onChange={(e) => handleChange('urgencyText', e.target.value)}
                            placeholder="⚡ Oferta expira em:"
                        />
                    </div>
                )}
            </div>

            {/* Garantia */}
            <div className="space-y-2">
                <Label htmlFor="guarantee">Garantia (opcional)</Label>
                <Input
                    id="guarantee"
                    value={localData.guarantee || ''}
                    onChange={(e) => handleChange('guarantee', e.target.value)}
                    placeholder="🛡️ Garantia de 30 dias ou seu dinheiro de volta"
                />
            </div>
        </div>
    );
};

// ============================================================
// DEFINIÇÃO DO PAINEL PARA REGISTRO
// ============================================================

export const OfferPropertiesPanelDefinition = createPanelDefinition(
    'offer',
    OfferPropertiesPanel,
    {
        label: 'Oferta',
        description: 'Painel para telas de oferta',
        icon: '💎',
        priority: 6
    }
);
