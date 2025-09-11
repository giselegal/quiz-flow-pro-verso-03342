import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, Plus, Trash2, RotateCcw, Target, Info } from 'lucide-react';
import ContextualTooltip, { tooltipLibrary } from './ContextualTooltip';
import type { PropertyEditorProps } from './types';

/**
 * Editor especializado para configurações de pontuação de quiz (scoreValues)
 * Permite editar os valores de pontuação para cada estilo de forma visual
 */
const ScoreValuesEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => {
    const scoreValues = property.value || {};
    const [newStyleName, setNewStyleName] = useState('');

    // Lista padrão de estilos de moda mais comuns
    const defaultStyles = [
        'romantic',
        'classic',
        'dramatic',
        'natural',
        'gamine',
        'ingenue',
        'elegant',
        'bohemian'
    ];

    // Obter estilos atuais (combinando existentes + padrões)
    const existingStyles = Object.keys(scoreValues);
    const allStyles = [...new Set([...existingStyles, ...defaultStyles])];

    const updateStyleScore = (styleName: string, score: number) => {
        const newScoreValues = {
            ...scoreValues,
            [styleName]: score
        };
        onChange(property.key, newScoreValues);
    };

    const removeStyle = (styleName: string) => {
        const newScoreValues = { ...scoreValues };
        delete newScoreValues[styleName];
        onChange(property.key, newScoreValues);
    };

    const addNewStyle = () => {
        if (newStyleName.trim() && !scoreValues[newStyleName]) {
            updateStyleScore(newStyleName.trim(), 0);
            setNewStyleName('');
        }
    };

    const getTotalScore = () => {
        return Object.values(scoreValues).reduce((sum: number, score: any) => sum + (Number(score) || 0), 0);
    };

    const getStyleLabel = (styleName: string) => {
        const labels: Record<string, string> = {
            romantic: 'Romântico',
            classic: 'Clássico',
            dramatic: 'Dramático',
            natural: 'Natural',
            gamine: 'Gamine',
            ingenue: 'Ingênua',
            elegant: 'Elegante',
            bohemian: 'Boêmio'
        };
        return labels[styleName] || styleName.charAt(0).toUpperCase() + styleName.slice(1);
    };

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <CardTitle className="text-sm">{property.label}</CardTitle>
                        <ContextualTooltip info={tooltipLibrary.scoreValues} compact />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        Total: {getTotalScore()}
                    </Badge>
                </div>
                {property.description && (
                    <p className="text-xs text-muted-foreground">{property.description}</p>
                )}
            </CardHeader>

            <CardContent className="space-y-3">
                {/* Estilos existentes */}
                <div className="space-y-2">
                    {allStyles.map(styleName => {
                        const score = scoreValues[styleName] || 0;
                        const isActive = scoreValues.hasOwnProperty(styleName);

                        return (
                            <div key={styleName} className={`flex items-center gap-3 p-2 rounded ${isActive ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                                }`}>
                                <div className="flex-1">
                                    <Label className="text-sm font-medium">
                                        {getStyleLabel(styleName)}
                                    </Label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        value={score}
                                        onChange={e => updateStyleScore(styleName, Number(e.target.value) || 0)}
                                        className="w-20 h-8 text-center"
                                        min="0"
                                        max="10"
                                        step="1"
                                    />

                                    {isActive && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeStyle(styleName)}
                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Adicionar novo estilo */}
                <div className="flex items-center gap-2 pt-2 border-t">
                    <Input
                        value={newStyleName}
                        onChange={e => setNewStyleName(e.target.value)}
                        placeholder="Nome do novo estilo..."
                        className="flex-1 h-8 text-sm"
                        onKeyPress={e => e.key === 'Enter' && addNewStyle()}
                    />
                    <Button
                        onClick={addNewStyle}
                        size="sm"
                        className="h-8 px-3"
                        disabled={!newStyleName.trim() || scoreValues[newStyleName]}
                    >
                        <Plus className="w-3 h-3 mr-1" />
                        Adicionar
                    </Button>
                </div>

                {/* Dicas de uso */}
                <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
                    <strong>Dica:</strong> Os valores de pontuação determinam quanto cada opção contribui para cada estilo.
                    Use valores de 0-10, onde 10 = forte influência no estilo.
                </div>
            </CardContent>
        </Card>
    );
};

export default ScoreValuesEditor;
