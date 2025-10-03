/**
 * 📝 QUIZ PROPERTIES PANEL - Painel de Propriedades para Quiz Steps
 * 
 * Painel lateral dedicado para edição de propriedades dos steps do quiz,
 * substituindo a edição inline por uma interface mais organizada e precisa.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
    X, 
    Save, 
    Copy, 
    Trash2, 
    Plus, 
    Minus,
    Settings,
    Eye,
    EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizPropertiesPanelProps {
    /** Step selecionado para edição */
    selectedStep: any | null;
    /** Callback para atualizar propriedades do step */
    onUpdateStep: (stepId: string, updates: any) => void;
    /** Callback para fechar o painel */
    onClose: () => void;
    /** Callback para deletar o step */
    onDeleteStep?: (stepId: string) => void;
    /** Callback para duplicar o step */
    onDuplicateStep?: (stepId: string) => void;
    /** Se está no modo preview */
    isPreviewMode?: boolean;
    /** Callback para alternar preview */
    onTogglePreview?: () => void;
    /** Classes CSS adicionais */
    className?: string;
}

export const QuizPropertiesPanel: React.FC<QuizPropertiesPanelProps> = ({
    selectedStep,
    onUpdateStep,
    onClose,
    onDeleteStep,
    onDuplicateStep,
    isPreviewMode = false,
    onTogglePreview,
    className = ''
}) => {
    const [localProperties, setLocalProperties] = useState<any>({});
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Sincronizar propriedades locais com step selecionado
    useEffect(() => {
        if (selectedStep) {
            setLocalProperties({ ...selectedStep });
            setHasUnsavedChanges(false);
        }
    }, [selectedStep]);

    const handlePropertyChange = useCallback((key: string, value: any) => {
        setLocalProperties(prev => ({
            ...prev,
            [key]: value
        }));
        setHasUnsavedChanges(true);
    }, []);

    const handleNestedPropertyChange = useCallback((parentKey: string, childKey: string, value: any) => {
        setLocalProperties(prev => ({
            ...prev,
            [parentKey]: {
                ...prev[parentKey],
                [childKey]: value
            }
        }));
        setHasUnsavedChanges(true);
    }, []);

    const handleSave = useCallback(() => {
        if (selectedStep && hasUnsavedChanges) {
            onUpdateStep(selectedStep.id, localProperties);
            setHasUnsavedChanges(false);
        }
    }, [selectedStep, localProperties, hasUnsavedChanges, onUpdateStep]);

    const handleReset = useCallback(() => {
        if (selectedStep) {
            setLocalProperties({ ...selectedStep });
            setHasUnsavedChanges(false);
        }
    }, [selectedStep]);

    const handleOptionAdd = useCallback((optionsKey: string) => {
        const currentOptions = localProperties[optionsKey] || [];
        const newOption = {
            id: `opt-${Date.now()}`,
            text: 'Nova opção'
        };
        handlePropertyChange(optionsKey, [...currentOptions, newOption]);
    }, [localProperties, handlePropertyChange]);

    const handleOptionRemove = useCallback((optionsKey: string, optionId: string) => {
        const currentOptions = localProperties[optionsKey] || [];
        const updatedOptions = currentOptions.filter((opt: any) => opt.id !== optionId);
        handlePropertyChange(optionsKey, updatedOptions);
    }, [localProperties, handlePropertyChange]);

    const handleOptionUpdate = useCallback((optionsKey: string, optionId: string, text: string) => {
        const currentOptions = localProperties[optionsKey] || [];
        const updatedOptions = currentOptions.map((opt: any) => 
            opt.id === optionId ? { ...opt, text } : opt
        );
        handlePropertyChange(optionsKey, updatedOptions);
    }, [localProperties, handlePropertyChange]);

    // Se não há step selecionado
    if (!selectedStep) {
        return (
            <Card className={cn('h-full', className)}>
                <CardContent className="flex items-center justify-center h-full">
                    <div className="text-center space-y-4 text-muted-foreground">
                        <Settings className="w-12 h-12 mx-auto opacity-50" />
                        <div>
                            <h3 className="font-medium text-lg">Painel de Propriedades</h3>
                            <p className="text-sm">Selecione um step para editar suas propriedades</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const stepType = localProperties.type;
    const stepTypeLabels = {
        'intro': 'Introdução',
        'question': 'Pergunta',
        'strategic-question': 'Pergunta Estratégica',
        'transition': 'Transição',
        'transition-result': 'Transição com Resultado',
        'result': 'Resultado',
        'offer': 'Oferta'
    };

    return (
        <Card className={cn('h-full flex flex-col', className)}>
            {/* Header */}
            <CardHeader className="flex-shrink-0 pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">Propriedades</CardTitle>
                        <Badge variant="secondary">
                            {stepTypeLabels[stepType] || stepType}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                        {/* Preview Toggle */}
                        {onTogglePreview && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onTogglePreview}
                                className="h-8 w-8 p-0"
                            >
                                {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                        )}
                        
                        {/* Close Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                
                {/* Step ID */}
                <div className="text-xs text-muted-foreground">
                    ID: {selectedStep.id}
                </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full px-6">
                    <div className="space-y-6 pb-6">
                        
                        {/* Common Properties */}
                        <div className="space-y-4">
                            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                                Propriedades Gerais
                            </h4>
                            
                            {/* Title (for intro, transition, result) */}
                            {(['intro', 'transition', 'transition-result', 'result'].includes(stepType)) && (
                                <div className="space-y-2">
                                    <Label htmlFor="title">Título</Label>
                                    <Input
                                        id="title"
                                        value={localProperties.title || ''}
                                        onChange={(e) => handlePropertyChange('title', e.target.value)}
                                        placeholder="Digite o título..."
                                    />
                                </div>
                            )}

                            {/* Question Text (for question types) */}
                            {(['question', 'strategic-question'].includes(stepType)) && (
                                <div className="space-y-2">
                                    <Label htmlFor="questionText">Pergunta</Label>
                                    <Textarea
                                        id="questionText"
                                        value={localProperties.questionText || ''}
                                        onChange={(e) => handlePropertyChange('questionText', e.target.value)}
                                        placeholder="Digite a pergunta..."
                                        rows={3}
                                    />
                                </div>
                            )}

                            {/* Form Question (for intro) */}
                            {stepType === 'intro' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="formQuestion">Pergunta do Formulário</Label>
                                        <Input
                                            id="formQuestion"
                                            value={localProperties.formQuestion || ''}
                                            onChange={(e) => handlePropertyChange('formQuestion', e.target.value)}
                                            placeholder="Como posso te chamar?"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="placeholder">Placeholder</Label>
                                        <Input
                                            id="placeholder"
                                            value={localProperties.placeholder || ''}
                                            onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
                                            placeholder="Seu nome..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="buttonText">Texto do Botão</Label>
                                        <Input
                                            id="buttonText"
                                            value={localProperties.buttonText || ''}
                                            onChange={(e) => handlePropertyChange('buttonText', e.target.value)}
                                            placeholder="Começar"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Text (for transition) */}
                            {(['transition', 'transition-result'].includes(stepType)) && (
                                <div className="space-y-2">
                                    <Label htmlFor="text">Texto</Label>
                                    <Textarea
                                        id="text"
                                        value={localProperties.text || ''}
                                        onChange={(e) => handlePropertyChange('text', e.target.value)}
                                        placeholder="Digite o texto..."
                                        rows={3}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Options (for question types) */}
                        {(['question', 'strategic-question'].includes(stepType)) && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                                        Opções de Resposta
                                    </h4>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleOptionAdd('options')}
                                        className="h-8"
                                    >
                                        <Plus className="w-3 h-3 mr-1" />
                                        Adicionar
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    {(localProperties.options || []).map((option: any, index: number) => (
                                        <div key={option.id} className="flex items-center gap-2">
                                            <div className="flex-1">
                                                <Input
                                                    value={option.text}
                                                    onChange={(e) => handleOptionUpdate('options', option.id, e.target.value)}
                                                    placeholder={`Opção ${index + 1}`}
                                                />
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleOptionRemove('options', option.id)}
                                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                {stepType === 'question' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="requiredSelections">Seleções Obrigatórias</Label>
                                        <Input
                                            id="requiredSelections"
                                            type="number"
                                            min="1"
                                            value={localProperties.requiredSelections || 1}
                                            onChange={(e) => handlePropertyChange('requiredSelections', parseInt(e.target.value))}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        <Separator />

                        {/* Navigation */}
                        <div className="space-y-4">
                            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                                Navegação
                            </h4>
                            <div className="space-y-2">
                                <Label htmlFor="nextStep">Próximo Step</Label>
                                <Input
                                    id="nextStep"
                                    value={localProperties.nextStep || ''}
                                    onChange={(e) => handlePropertyChange('nextStep', e.target.value)}
                                    placeholder="ID do próximo step"
                                />
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </CardContent>

            {/* Footer Actions */}
            <div className="flex-shrink-0 p-4 border-t bg-muted/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* Duplicate */}
                        {onDuplicateStep && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onDuplicateStep(selectedStep.id)}
                            >
                                <Copy className="w-3 h-3 mr-1" />
                                Duplicar
                            </Button>
                        )}
                        
                        {/* Delete */}
                        {onDeleteStep && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onDeleteStep(selectedStep.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Deletar
                            </Button>
                        )}
                    </div>

                    {/* Save Actions */}
                    <div className="flex items-center gap-2">
                        {hasUnsavedChanges && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleReset}
                            >
                                Cancelar
                            </Button>
                        )}
                        
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={!hasUnsavedChanges}
                        >
                            <Save className="w-3 h-3 mr-1" />
                            {hasUnsavedChanges ? 'Salvar' : 'Salvo'}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default QuizPropertiesPanel;