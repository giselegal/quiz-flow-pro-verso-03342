/**/**/**

 * 🎭 DYNAMIC PROPERTIES PANEL - Orquestrador de Painéis Modulares

 */ * 🎭 DYNAMIC PROPERTIES PANEL - Orquestrador de Painéis Modulares * 🎨 DYNAMIC PROPERTIES PANEL



import React, { useState, useCallback, useEffect } from 'react';    *  * 

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button'; * Componente inteligente que: * Painel de propriedades que adapta seu conteúdo baseado no tipo do step selecionado.

import { ScrollArea } from '@/components/ui/scroll-area';

import { Badge } from '@/components/ui/badge'; * 1. Detecta o tipo de step selecionado * Fornece formulários específicos para cada tipo de componente editável.

import { Separator } from '@/components/ui/separator';

import { X, Settings, Trash2, Copy, Eye, EyeOff, AlertCircle } from 'lucide-react'; * 2. Resolve o painel apropriado via PropertiesPanelRegistry */

import { cn } from '@/lib/utils';

import { PropertiesPanelRegistry } from './PropertiesPanelRegistry';    * 3. Renderiza o painel com as props corretas

import { Alert, AlertDescription } from '@/components/ui/alert';

        * 4. Gerencia estado e comunicação com a facadeimport React from 'react';

// Imports dos painéis

import { QuestionPropertiesPanelDefinition, StrategicQuestionPropertiesPanelDefinition } from './QuestionPropertiesPanel'; */

import { ResultPropertiesPanelDefinition, TransitionResultPropertiesPanelDefinition } from './ResultPropertiesPanel';

import { OfferPropertiesPanelDefinition } from './OfferPropertiesPanel';export interface DynamicPropertiesPanelProps {

import { CommonPropertiesPanelDefinition, IntroPropertiesPanelDefinition, TransitionPropertiesPanelDefinition } from './CommonPropertiesPanel';

import React, { useState, useCallback, useEffect } from 'react'; selectedStep: any;

// Registrar painéis

PropertiesPanelRegistry.registerMany([import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; onUpdate: (updates: any) => void;

    QuestionPropertiesPanelDefinition,

    StrategicQuestionPropertiesPanelDefinition,import { Button } from '@/components/ui/button'; onDelete: () => void;

    ResultPropertiesPanelDefinition,

    TransitionResultPropertiesPanelDefinition,import { ScrollArea } from '@/components/ui/scroll-area';}

    OfferPropertiesPanelDefinition,

    IntroPropertiesPanelDefinition,import { Badge } from '@/components/ui/badge';

    TransitionPropertiesPanelDefinition,

]);import { Separator } from '@/components/ui/separator'; const DynamicPropertiesPanel: React.FC<DynamicPropertiesPanelProps> = ({

PropertiesPanelRegistry.setFallback(CommonPropertiesPanelDefinition);

    import { selectedStep,

export interface DynamicPropertiesPanelProps {

    selectedStep: any | null;        X, onUpdate,

    onUpdateStep: (stepId: string, updates: any) => void;

    onClose: () => void;        Settings, onDelete

    onDeleteStep?: (stepId: string) => void;

    onDuplicateStep?: (stepId: string) => void;    Trash2, }) => {

    isPreviewMode?: boolean;

    onTogglePreview?: () => void;    Copy,     if (!selectedStep) {

    className?: string;

}        Eye,         return (



export const DynamicPropertiesPanel: React.FC<DynamicPropertiesPanelProps> = ({            EyeOff, <div style={{ padding: '16px' }}>

    selectedStep,

    onUpdateStep,                AlertCircle                 <p style={{ color: 'hsl(var(--muted-foreground))', fontStyle: 'italic' }}>

    onClose,

    onDeleteStep,} from 'lucide-react';                    Selecione uma etapa para editar suas propriedades

    onDuplicateStep,

    isPreviewMode = false,                    import {cn} from '@/lib/utils';                </p>

    onTogglePreview,

    className = ''                import {PropertiesPanelRegistry} from './PropertiesPanelRegistry';            </div>

}) => {

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);import { Alert, AlertDescription } from '@/components/ui/alert';        );



    useEffect(() => {    }

        setHasUnsavedChanges(false);

    }, [selectedStep?.id]);    // ============================================================



    const handleUpdate = useCallback((updates: any) => {    // IMPORTS DOS PAINÉIS (para auto-registro)    const handleChange = (field: string, value: any) => {

        if (selectedStep) {

            onUpdateStep(selectedStep.id, updates);    // ============================================================        onUpdate({

            setHasUnsavedChanges(false);

        }    import {             ...selectedStep,

    }, [selectedStep, onUpdateStep]);

        QuestionPropertiesPanelDefinition,             [field]: value

    const handleDelete = useCallback(() => {

        if (selectedStep && onDeleteStep) {    StrategicQuestionPropertiesPanelDefinition

            if (confirm(`Deletar "${selectedStep.title || selectedStep.questionText || selectedStep.id}"?`)) {});

                onDeleteStep(selectedStep.id);

            }} from './QuestionPropertiesPanel';    };

        }

    }, [selectedStep, onDeleteStep]);import {



    const handleDuplicate = useCallback(() => {    ResultPropertiesPanelDefinition,     const inputStyle = {

        if (selectedStep && onDuplicateStep) {

            onDuplicateStep(selectedStep.id);        TransitionResultPropertiesPanelDefinition         width: '100%',

        }

    }, [selectedStep, onDuplicateStep]);    } from './ResultPropertiesPanel'; padding: '8px 12px',



    if (!selectedStep) {import { OfferPropertiesPanelDefinition } from './OfferPropertiesPanel'; border: '1px solid hsl(var(--border))',

        return (

            <Card className={cn('h-full', className)}>import {

                <CardContent className="flex items-center justify-center h-full">    borderRadius: '6px',

                    <div className="text-center space-y-4 text-muted-foreground">

                        <Settings className="w-12 h-12 mx-auto opacity-50" />    CommonPropertiesPanelDefinition, fontSize: '14px',

                        <div>

                            <h3 className="font-medium text-lg">Painel de Propriedades</h3>    IntroPropertiesPanelDefinition, background: 'hsl(var(--background))',

                            <p className="text-sm">Selecione um step para editar</p>

                        </div>    TransitionPropertiesPanelDefinition        color: 'hsl(var(--foreground))'

                    </div>

                </CardContent>} from './CommonPropertiesPanel';    };

            </Card>

        );

    }

// ============================================================    const labelStyle = {

    const stepType = selectedStep.type || 'common';

    const panelDefinition = PropertiesPanelRegistry.resolve(stepType);// AUTO-REGISTRO DOS PAINÉIS        display: 'block',



    if (!panelDefinition) {// ============================================================        marginBottom: '6px',

        return (

            <Card className={cn('h-full flex flex-col', className)}>fontSize: '13px',

                <CardHeader>

                    <div className="flex items-center justify-between">    // Registrar todos os painéis no startup        fontWeight: 'bold' as const,

                        <CardTitle>Erro no Painel</CardTitle>

                        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">    PropertiesPanelRegistry.registerMany([color: 'hsl(var(--foreground))'

                            <X className="w-4 h-4" />

                        </Button>    QuestionPropertiesPanelDefinition,    };

                    </div>

                </CardHeader>StrategicQuestionPropertiesPanelDefinition,

                <CardContent>

                    <Alert variant="destructive">    ResultPropertiesPanelDefinition,    const sectionStyle = {

                        <AlertCircle className="h-4 w-4" />

                        <AlertDescription>        TransitionResultPropertiesPanelDefinition, marginBottom: '16px',

                            Nenhum painel encontrado para o tipo <strong>"{stepType}"</strong>

                        </AlertDescription>        OfferPropertiesPanelDefinition, paddingBottom: '16px',

                    </Alert>

                </CardContent>        IntroPropertiesPanelDefinition, borderBottom: '1px solid hsl(var(--border))'

            </Card>

        );    TransitionPropertiesPanelDefinition,

    }    };



    const PanelComponent = panelDefinition.component;]);

    

    return (// Renderizar campos específicos baseado no tipo

        <Card className={cn('h-full flex flex-col', className)}>

            <CardHeader className="flex-shrink-0 pb-3">// Definir fallback    const renderTypeSpecificFields = () => {

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">PropertiesPanelRegistry.setFallback(CommonPropertiesPanelDefinition); switch (selectedStep.type) {

                        <CardTitle className="text-lg">Propriedades</CardTitle>

                        <Badge variant="secondary">    case 'intro':

                            {panelDefinition.icon} {panelDefinition.label}

                        </Badge>        console.log('[DynamicPropertiesPanel] Panels auto-registered:', PropertiesPanelRegistry.list().length); return (

                    </div>

                                <>

                    <div className="flex items-center gap-1">

                        {onTogglePreview && (// ============================================================                        <div style={sectionStyle}>

                            <Button variant="ghost" size="sm" onClick={onTogglePreview} className="h-8 w-8 p-0">

                                {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}// INTERFACES                            <label style={labelStyle}>Título Principal:</label>

                            </Button>

                        )}// ============================================================                            <textarea

                        {onDuplicateStep && (

                            <Button variant="ghost" size="sm" onClick={handleDuplicate} className="h-8 w-8 p-0">                        value={selectedStep.title || ''}

                                <Copy className="w-4 h-4" />

                            </Button>                        export interface DynamicPropertiesPanelProps {                                onChange = {(e) => handleChange('title', e.target.value)}

                        )}

                        {onDeleteStep && (    /** Step selecionado para edição */                                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}

                            <Button variant="ghost" size="sm" onClick={handleDelete} className="h-8 w-8 p-0 text-destructive">

                                <Trash2 className="w-4 h-4" />                    selectedStep: any | null;                                placeholder="Digite o título principal..."

                            </Button>

                        )}                                />

                        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">

                            <X className="w-4 h-4" />    /** Callback para atualizar propriedades do step */                        </div>

                        </Button>

                    </div>    onUpdateStep: (stepId: string, updates: any) => void;

                </div>

                <div className="text-xs text-muted-foreground">ID: {selectedStep.id}</div>                <div style={sectionStyle}>

            </CardHeader>

    /** Callback para fechar o painel */                            <label style={labelStyle}>Pergunta do Formulário:</label>

            <Separator />

    onClose: () => void;                            <input

            <CardContent className="flex-1 overflow-hidden p-0">

                <ScrollArea className="h-full px-6 py-6">                        type="text"

                    <PanelComponent

                        stepId={selectedStep.id}    /** Callback para deletar o step */ value={selectedStep.formQuestion || ''}

                        stepType={stepType}

                        stepData={selectedStep}                        onDeleteStep?: (stepId: string) => void;                                onChange={(e) => handleChange('formQuestion', e.target.value)}

                        onUpdate={handleUpdate}

                        onDelete={onDeleteStep ? handleDelete : undefined}                    style={inputStyle}

                    />

                </ScrollArea>    /** Callback para duplicar o step */                                placeholder="Ex: Como posso te chamar?"

            </CardContent>

        </Card>    onDuplicateStep?: (stepId: string) => void;                            />

    );

};                </div>



export default DynamicPropertiesPanel;    /** Se está no modo preview */


                isPreviewMode?: boolean;                        <div style={sectionStyle}>

                    <label style={labelStyle}>Placeholder do Input:</label>

    /** Callback para alternar preview */                            <input

                        onTogglePreview?: () => void;                                type="text"

                    value={selectedStep.placeholder || ''}

    /** Classes CSS adicionais */                                onChange={(e) => handleChange('placeholder', e.target.value)}

                    className?: string;                                style={inputStyle}

}                                placeholder="Ex: Digite seu nome..."

                            />

// ============================================================                        </div>

// COMPONENTE PRINCIPAL

// ============================================================                        <div style={sectionStyle}>

                    <label style={labelStyle}>Texto do Botão:</label>

                    export const DynamicPropertiesPanel: React.FC<DynamicPropertiesPanelProps> = ({<input

                        selectedStep, type = "text"

    onUpdateStep,                                value={selectedStep.buttonText || ''}

                        onClose,                                onChange={(e) => handleChange('buttonText', e.target.value)}

                        onDeleteStep,                                style={inputStyle}

                        onDuplicateStep,                                placeholder="Ex: Continuar"

    isPreviewMode = false,                            />

                        onTogglePreview,                        </div>

                className = ''

}) => {<div style={sectionStyle}>

                    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);                            <label style={labelStyle}>URL da Imagem:</label>

                    <input

                        // Resetar estado quando step muda                                type="url"

                        useEffect(() => {value = { selectedStep.image || '' }

        setHasUnsavedChanges(false);                                onChange={(e) => handleChange('image', e.target.value)}

    }, [selectedStep?.id]);                                style={inputStyle}

                    placeholder="https://..."

    // Handler para atualizar step                            />

    const handleUpdate = useCallback((updates: any) => {                        </div>

        if (selectedStep) {                    </>

            onUpdateStep(selectedStep.id, updates);                );

        setHasUnsavedChanges(false);

        console.log(`[DynamicPropertiesPanel] Updated step ${selectedStep.id}`, updates); case 'question':

}                return (

    }, [selectedStep, onUpdateStep]); <>

    <div style={sectionStyle}>

    // Handler para deletar                            <label style={labelStyle}>Número da Questão:</label>

    const handleDelete = useCallback(() => {<input

            if (selectedStep && onDeleteStep) {type = "text"

            if (confirm(`Tem certeza que deseja deletar o step "${selectedStep.title || selectedStep.questionText || selectedStep.id}"?`)) {value = { selectedStep.questionNumber || '' }

                onDeleteStep(selectedStep.id);                                onChange={(e) => handleChange('questionNumber', e.target.value)}

        console.log(`[DynamicPropertiesPanel] Deleted step ${selectedStep.id}`);                                style={inputStyle}

            }                                placeholder="Ex: 1/10"

        }                            />

    }, [selectedStep, onDeleteStep]);                        </div>



    // Handler para duplicar                        <div style={sectionStyle}>

    const handleDuplicate = useCallback(() => {<label style={labelStyle}>Texto da Pergunta:</label>

        if (selectedStep && onDuplicateStep) {<textarea

            onDuplicateStep(selectedStep.id);                                value={selectedStep.questionText || ''}

        console.log(`[DynamicPropertiesPanel] Duplicated step ${selectedStep.id}`);                                onChange={(e) => handleChange('questionText', e.target.value)}

        }                                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}

    }, [selectedStep, onDuplicateStep]);                                placeholder="Digite a pergunta..."

                            />

    // Se não há step selecionado                        </div>

    if (!selectedStep) {

        return (                        <div style={sectionStyle}>

        <Card className={cn('h-full', className)}>                            <label style={labelStyle}>Seleções Obrigatórias:</label>

            <CardContent className="flex items-center justify-center h-full">                            <input

                <div className="text-center space-y-4 text-muted-foreground">                                type="number"

                <Settings className="w-12 h-12 mx-auto opacity-50" />                                value={selectedStep.requiredSelections || 1}

                <div>                                onChange={(e) => handleChange('requiredSelections', parseInt(e.target.value) || 1)}

                    <h3 className="font-medium text-lg">Painel de Propriedades</h3>                                style={inputStyle}

                    <p className="text-sm">Selecione um step para editar suas propriedades</p>                                min="1"

                </div>                            />

            </div>                        </div>

        </CardContent>

    </Card>                        <div style={sectionStyle}>

        );                            <label style={labelStyle}>Opções:</label>

    }                            <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', margin: '4px 0 8px 0' }}>

            {selectedStep.options?.length || 0} opções configuradas

    // Resolver painel apropriado                            </p>

        const stepType = selectedStep.type || 'common';                            <button

            const panelDefinition= PropertiesPanelRegistry.resolve(stepType);                                onClick={() => {

                const newOption = {

                    if(!panelDefinition) {
                        id: `opt-${Date.now()}`,

        return (text: 'Nova opção',

            <Card className = { cn('h-full flex flex-col', className)}> image: ''

        <CardHeader>                                    };

            <div className="flex items-center justify-between">                                    const currentOptions = selectedStep.options || [];

                <CardTitle>Erro no Painel</CardTitle>                                    handleChange('options', [...currentOptions, newOption]);

                <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">                                }}

                    <X className="w-4 h-4" />                                style={{

                        </Button>                                    padding: '8px 16px',

            </div>                                    background: 'hsl(var(--primary))',

        </CardHeader>                                    color: 'hsl(var(--primary-foreground))',

        <CardContent>                                    border: 'none',

            <Alert variant="destructive">                                    borderRadius: '6px',

                <AlertCircle className="h-4 w-4" />                                    cursor: 'pointer',

                <AlertDescription>                                    fontSize: '13px'

                    Nenhum painel encontrado para o tipo <strong>"{stepType}"</strong>.                                }}

                            Verifique o PropertiesPanelRegistry.                            >

                </AlertDescription>                                + Adicionar Opção

            </Alert>                            </button>

    </CardContent>                        </div >

            </Card >                    </>

        );                );

    }

            case 'transition':

const PanelComponent = panelDefinition.component;            case 'transition-result':

return (

    const stepTypeLabels: Record<string, string> = {                    <>

        'intro': 'Introdução',                        <div style = { sectionStyle } >

        'question': 'Pergunta',                            <label style = { labelStyle } > Mensagem Principal:</label>

            'strategic-question': 'Pergunta Estratégica', <textarea

        'transition': 'Transição', value = { selectedStep.message || '' }

'transition-result': 'Transição com Resultado', onChange = {(e) => handleChange('message', e.target.value)}

'result': 'Resultado', style = {{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}

'offer': 'Oferta'                                placeholder = "Digite a mensagem de transição..."

    };                            />

                        </div >

    return (

    <Card className={cn('h-full flex flex-col', className)}>                        <div style={sectionStyle}>

        {/* Header */}                            <label style={labelStyle}>Duração (segundos):</label>

        <CardHeader className="flex-shrink-0 pb-3">                            <input

            <div className="flex items-center justify-between">                                type="number"

            <div className="flex items-center gap-2">                                value={selectedStep.duration || 3}

                <CardTitle className="text-lg">Propriedades</CardTitle>                                onChange={(e) => handleChange('duration', parseInt(e.target.value) || 3)}

                <Badge variant="secondary">                                style={inputStyle}

                    {panelDefinition.icon} {stepTypeLabels[stepType] || stepType}                                min="1"

                </Badge>                                max="10"

            </div>                            />

        </div>

            <div className="flex items-center gap-1">                    </>

            {/* Preview Toggle */}                );

            {onTogglePreview && (

                <Button case 'result':

            variant="ghost"                return (

            size="sm"                    <>

                onClick={onTogglePreview}                        <div style={sectionStyle}>

                    className="h-8 w-8 p-0"                            <label style={labelStyle}>Título do Resultado:</label>

                    title={isPreviewMode ? 'Modo Edição' : 'Modo Preview'}                            <input

                    >                                type="text"

                        {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}                                value={selectedStep.title || ''}

                    </Button>                                onChange={(e) => handleChange('title', e.target.value)}

                        )}                                style={inputStyle}

                    placeholder="Ex: Seu resultado está pronto!"

                    {/* Duplicate Button */}                            />

                    {onDuplicateStep && (                        </div>

                <Button

                    variant="ghost"                        <div style={sectionStyle}>

                    size="sm"                            <label style={labelStyle}>Descrição:</label>

                    onClick={handleDuplicate}                            <textarea

                        className="h-8 w-8 p-0" value={selectedStep.description || ''}

                        title="Duplicar Step" onChange={(e) => handleChange('description', e.target.value)}

                    >                                style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}

                        <Copy className="w-4 h-4" />                                placeholder="Descreva o resultado..."

                    </Button>                            />

                        )}                        </div>



                {/* Delete Button */}                        <div style={sectionStyle}>

                    {onDeleteStep && (                            <label style={labelStyle}>Estilo Calculado:</label>

                            <Button                            <input

                                variant="ghost"                                type="text"

                                size="sm"                                value={selectedStep.styleType || ''}

                                onClick={handleDelete}                                onChange={(e) => handleChange('styleType', e.target.value)}

                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"                                style={inputStyle}

                                title="Deletar Step"                                placeholder="Ex: Natural, Romântico, etc."

                            >                                disabled

                                <Trash2 className="w-4 h-4" />                            />

                            </Button>                            <p style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', margin: '4px 0 0 0' }}>

                        )}                                (Calculado automaticamente)

                            </p>

                        {/* Close Button */}                        </div>

                <Button                    </>

            variant="ghost"                );

            size="sm"

            onClick={onClose}            case 'offer':

            className="h-8 w-8 p-0"                return (

            title="Fechar Painel"                    <>

                        >                        <div style={sectionStyle}>

                    <X className="w-4 h-4" />                            <label style={labelStyle}>Título da Oferta:</label>

                </Button>                            <input

                    </div>                                type="text"

    </div>                                value={selectedStep.title || ''}

        onChange={(e) => handleChange('title', e.target.value)}

        {/* Step ID */}                                style={inputStyle}

        <div className="text-xs text-muted-foreground flex items-center justify-between">                                placeholder="Ex: Oferta Especial"

            <span>ID: {selectedStep.id}</span>                            />

            {hasUnsavedChanges && (                        </div>

        <Badge variant="outline" className="text-[10px] py-0">

            Alterações não salvas                        <div style={sectionStyle}>

        </Badge>                            <label style={labelStyle}>Descrição:</label>

                    )}                            <textarea

                </div>                                value = { selectedStep.description || '' }

            </CardHeader > onChange={ (e) => handleChange('description', e.target.value) }

style = {{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}

<Separator />                                placeholder = "Descreva a oferta..."

    />

    {/* Content - Painel Dinâmico */ }                        </div >

        <CardContent className="flex-1 overflow-hidden p-0">

            <ScrollArea className="h-full px-6 py-6">                        <div style={sectionStyle}>

                <PanelComponent                            <label style={labelStyle}>Preço:</label>

                stepId={selectedStep.id}                            <input

                    stepType={stepType} type="text"

                    stepData={selectedStep} value={selectedStep.price || ''}

                    onUpdate={handleUpdate} onChange={(e) => handleChange('price', e.target.value)}

                    onDelete={onDeleteStep ? handleDelete : undefined} style={inputStyle}

                />                                placeholder="Ex: R$ 197,00"

            </ScrollArea>                            />

        </CardContent>                        </div >

        </Card >

    ); <div style={sectionStyle}>

};                            <label style={labelStyle}>Link do Botão:</label>

    <input

        export default DynamicPropertiesPanel;                                type="url"

    value={selectedStep.buttonLink || ''}
    onChange={(e) => handleChange('buttonLink', e.target.value)}
    style={inputStyle}
    placeholder="https://..."
                            />
</div>
                    </>
                );

            default:
return (
    <div style={sectionStyle}>
        <p style={{ color: 'hsl(var(--muted-foreground))' }}>
            Propriedades para o tipo "{selectedStep.type}" ainda não foram implementadas.
        </p>
    </div>
);
        }
    };

return (
    <div style={{ padding: '16px' }}>
        <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '2px solid hsl(var(--border))' }}>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 'bold', color: 'hsl(var(--foreground))' }}>
                {selectedStep.title || selectedStep.name || 'Propriedades'}
            </h4>
            <p style={{ margin: 0, fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                Tipo: <strong>{selectedStep.type}</strong>
            </p>
        </div>

        {renderTypeSpecificFields()}

        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid hsl(var(--border))' }}>
            <button
                onClick={onDelete}
                style={{
                    width: '100%',
                    padding: '10px',
                    background: 'hsl(var(--destructive))',
                    color: 'hsl(var(--destructive-foreground))',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                }}
            >
                🗑️ Excluir Etapa
            </button>
        </div>
    </div>
);
};

export default DynamicPropertiesPanel;
