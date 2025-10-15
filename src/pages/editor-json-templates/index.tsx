import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Save,
    Eye,
    FileJson,
    AlertCircle,
    CheckCircle,
    Upload,
    Download,
    Trash2,
    Copy,
    Edit3,
    RefreshCw
} from 'lucide-react';
import EditorLayout from '@/components/layout/EditorLayout';
import { QuizStepAdapter } from '@/adapters/QuizStepAdapter';

// Tipos
interface JsonTemplate {
    templateVersion: string;
    metadata: {
        id: string;
        name: string;
        description: string;
        category: string;
        tags: string[];
        createdAt: string;
        updatedAt: string;
    };
    layout: {
        containerWidth: string;
        spacing: string;
        backgroundColor: string;
        responsive: boolean;
    };
    validation: Record<string, any>;
    analytics: {
        events: string[];
        trackingId: string;
        utmParams: boolean;
        customEvents: string[];
    };
    blocks: Array<{
        id: string;
        type: string;
        position: number;
        properties: Record<string, any>;
    }>;
}

const EditorJsonTemplatesPage: React.FC = () => {
    const [templates, setTemplates] = useState<JsonTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<JsonTemplate | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Carregar templates do localStorage ou do /templates
    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        try {
            // Tentar carregar templates JSON dos arquivos
            const templatePromises = Array.from({ length: 21 }, (_, i) => {
                const stepNumber = String(i + 1).padStart(2, '0');
                return fetch(`/templates/step-${stepNumber}-v3.json`)
                    .then(res => res.ok ? res.json() : null)
                    .catch(() => null);
            });

            const loadedTemplates = await Promise.all(templatePromises);
            const validTemplates = loadedTemplates.filter(t => t !== null);

            setTemplates(validTemplates);

            if (validTemplates.length === 0) {
                console.warn('⚠️ Nenhum template encontrado, gerando templates padrão...');
                generateDefaultTemplates();
            }
        } catch (error) {
            console.error('❌ Erro ao carregar templates:', error);
            generateDefaultTemplates();
        }
    };

    const generateDefaultTemplates = () => {
        // Gerar templates básicos caso não existam
        const defaultTemplates: JsonTemplate[] = [];

        for (let i = 1; i <= 21; i++) {
            const stepNumber = String(i).padStart(2, '0');
            defaultTemplates.push({
                templateVersion: '2.0',
                metadata: {
                    id: `quiz-step-${stepNumber}`,
                    name: `Step ${stepNumber}`,
                    description: `Template para step ${i}`,
                    category: 'quiz-question',
                    tags: ['quiz', 'style', 'question'],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
                layout: {
                    containerWidth: 'full',
                    spacing: 'small',
                    backgroundColor: '#FAF9F7',
                    responsive: true,
                },
                validation: {},
                analytics: {
                    events: ['page_view', 'step_completed'],
                    trackingId: `step-${stepNumber}`,
                    utmParams: true,
                    customEvents: ['component_mounted', 'user_interaction'],
                },
                blocks: [],
            });
        }

        setTemplates(defaultTemplates);
    };

    const handleSelectTemplate = (template: JsonTemplate) => {
        setSelectedTemplate({ ...template });
        setIsEditing(false);
        setValidationError(null);
        setSuccessMessage(null);
    };

    const handleEditTemplate = () => {
        setIsEditing(true);
        setValidationError(null);
    };

    const handleSaveTemplate = async () => {
        if (!selectedTemplate) return;

        setIsSaving(true);
        setValidationError(null);
        setSuccessMessage(null);

        try {
            // Validar template usando QuizStepAdapter
            const stepNumber = parseInt(selectedTemplate.metadata.id.replace('quiz-step-', ''));

            // Testar conversão JSON → QuizStep
            QuizStepAdapter.fromJSON(selectedTemplate);

            // Salvar no localStorage (simulação - no real seria API)
            const savedTemplates = templates.map(t =>
                t.metadata.id === selectedTemplate.metadata.id ? selectedTemplate : t
            );
            setTemplates(savedTemplates);

            // Atualizar data de modificação
            selectedTemplate.metadata.updatedAt = new Date().toISOString();

            // Tentar salvar no arquivo (simulação - requer backend)
            await saveTemplateToFile(selectedTemplate);

            setSuccessMessage('✅ Template salvo com sucesso!');
            setIsEditing(false);

            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            console.error('❌ Erro ao salvar template:', error);
            setValidationError(
                error instanceof Error
                    ? error.message
                    : 'Erro ao validar template'
            );
        } finally {
            setIsSaving(false);
        }
    };

    const saveTemplateToFile = async (template: JsonTemplate) => {
        // Em produção, isso seria uma chamada API
        // Por enquanto, salvamos no localStorage
        const stepNumber = template.metadata.id.replace('quiz-step-', '');
        localStorage.setItem(
            `json-template-${stepNumber}`,
            JSON.stringify(template, null, 2)
        );

        console.log('💾 Template salvo no localStorage:', template.metadata.id);
    };

    const handleExportTemplate = () => {
        if (!selectedTemplate) return;

        const dataStr = JSON.stringify(selectedTemplate, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${selectedTemplate.metadata.id}.json`;
        link.click();

        URL.revokeObjectURL(url);
    };

    const handleImportTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target?.result as string);
                setSelectedTemplate(imported);
                setIsEditing(true);
                setSuccessMessage('✅ Template importado com sucesso!');
                setTimeout(() => setSuccessMessage(null), 3000);
            } catch (error) {
                setValidationError('❌ Erro ao importar: arquivo JSON inválido');
            }
        };
        reader.readAsText(file);
    };

    const handleDuplicateTemplate = () => {
        if (!selectedTemplate) return;

        const duplicated = {
            ...selectedTemplate,
            metadata: {
                ...selectedTemplate.metadata,
                id: `${selectedTemplate.metadata.id}-copy`,
                name: `${selectedTemplate.metadata.name} (Cópia)`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        };

        setTemplates([...templates, duplicated]);
        setSelectedTemplate(duplicated);
        setSuccessMessage('✅ Template duplicado!');
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const handleDeleteTemplate = () => {
        if (!selectedTemplate) return;

        const confirmed = window.confirm(
            `Tem certeza que deseja excluir o template "${selectedTemplate.metadata.name}"?`
        );

        if (!confirmed) return;

        const filtered = templates.filter(
            t => t.metadata.id !== selectedTemplate.metadata.id
        );
        setTemplates(filtered);
        setSelectedTemplate(null);
        setSuccessMessage('✅ Template excluído!');
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const handlePreviewTemplate = () => {
        if (!selectedTemplate) return;

        // Abrir preview em nova aba
        const stepNumber = selectedTemplate.metadata.id.replace('quiz-step-', '');
        window.open(`/quiz-estilo?step=${stepNumber}&preview=true`, '_blank');
    };

    const filteredTemplates = templates.filter(t =>
        t.metadata.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.metadata.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.metadata.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <EditorLayout
            title="Editor de Templates JSON"
            subtitle="Edite visualmente os templates do Quiz de Estilo"
        >
            <div className="flex gap-6 h-[calc(100vh-200px)]">
                {/* Lista de Templates */}
                <div className="w-80 flex flex-col gap-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Buscar templates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1"
                        />
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={loadTemplates}
                            title="Recarregar templates"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2">
                        {filteredTemplates.map((template) => (
                            <Card
                                key={template.metadata.id}
                                className={`cursor-pointer transition-all hover:shadow-md ${selectedTemplate?.metadata.id === template.metadata.id
                                    ? 'ring-2 ring-primary'
                                    : ''
                                    }`}
                                onClick={() => handleSelectTemplate(template)}
                            >
                                <CardHeader className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-sm">
                                                {template.metadata.name}
                                            </CardTitle>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {template.metadata.id}
                                            </p>
                                        </div>
                                        <FileJson className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex gap-1 mt-2">
                                        <Badge variant="secondary" className="text-xs">
                                            {template.blocks.length} blocos
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            {template.metadata.category}
                                        </Badge>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}

                        {filteredTemplates.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <FileJson className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Nenhum template encontrado</p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => document.getElementById('import-file')?.click()}
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Importar
                        </Button>
                        <input
                            id="import-file"
                            type="file"
                            accept=".json"
                            className="hidden"
                            onChange={handleImportTemplate}
                        />
                    </div>
                </div>

                {/* Editor do Template */}
                <div className="flex-1 flex flex-col gap-4">
                    {selectedTemplate ? (
                        <>
                            {/* Toolbar */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {selectedTemplate.metadata.name}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedTemplate.metadata.description}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    {!isEditing ? (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handlePreviewTemplate}
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                Preview
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleDuplicateTemplate}
                                            >
                                                <Copy className="h-4 w-4 mr-2" />
                                                Duplicar
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleExportTemplate}
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                Exportar
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={handleEditTemplate}
                                            >
                                                <Edit3 className="h-4 w-4 mr-2" />
                                                Editar
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setIsEditing(false)}
                                                disabled={isSaving}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={handleSaveTemplate}
                                                disabled={isSaving}
                                            >
                                                {isSaving ? (
                                                    <>
                                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                        Salvando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="h-4 w-4 mr-2" />
                                                        Salvar
                                                    </>
                                                )}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Mensagens */}
                            {validationError && (
                                <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
                                    <AlertCircle className="h-5 w-5" />
                                    <span className="text-sm">{validationError}</span>
                                </div>
                            )}

                            {successMessage && (
                                <div className="flex items-center gap-2 p-4 bg-green-500/10 text-green-600 rounded-lg">
                                    <CheckCircle className="h-5 w-5" />
                                    <span className="text-sm">{successMessage}</span>
                                </div>
                            )}

                            {/* Conteúdo do Editor */}
                            <Card className="flex-1 overflow-hidden">
                                <CardContent className="p-6 h-full overflow-y-auto">
                                    {isEditing ? (
                                        <div className="space-y-6">
                                            {/* Metadata */}
                                            <div>
                                                <h3 className="text-lg font-semibold mb-4">Metadata</h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-sm font-medium">Nome</label>
                                                        <Input
                                                            value={selectedTemplate.metadata.name}
                                                            onChange={(e) =>
                                                                setSelectedTemplate({
                                                                    ...selectedTemplate,
                                                                    metadata: {
                                                                        ...selectedTemplate.metadata,
                                                                        name: e.target.value,
                                                                    },
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium">Categoria</label>
                                                        <Input
                                                            value={selectedTemplate.metadata.category}
                                                            onChange={(e) =>
                                                                setSelectedTemplate({
                                                                    ...selectedTemplate,
                                                                    metadata: {
                                                                        ...selectedTemplate.metadata,
                                                                        category: e.target.value,
                                                                    },
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    <label className="text-sm font-medium">Descrição</label>
                                                    <Textarea
                                                        value={selectedTemplate.metadata.description}
                                                        onChange={(e) =>
                                                            setSelectedTemplate({
                                                                ...selectedTemplate,
                                                                metadata: {
                                                                    ...selectedTemplate.metadata,
                                                                    description: e.target.value,
                                                                },
                                                            })
                                                        }
                                                        rows={3}
                                                    />
                                                </div>
                                            </div>

                                            {/* Layout */}
                                            <div>
                                                <h3 className="text-lg font-semibold mb-4">Layout</h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-sm font-medium">Largura</label>
                                                        <Input
                                                            value={selectedTemplate.layout.containerWidth}
                                                            onChange={(e) =>
                                                                setSelectedTemplate({
                                                                    ...selectedTemplate,
                                                                    layout: {
                                                                        ...selectedTemplate.layout,
                                                                        containerWidth: e.target.value,
                                                                    },
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium">Cor de Fundo</label>
                                                        <Input
                                                            type="color"
                                                            value={selectedTemplate.layout.backgroundColor}
                                                            onChange={(e) =>
                                                                setSelectedTemplate({
                                                                    ...selectedTemplate,
                                                                    layout: {
                                                                        ...selectedTemplate.layout,
                                                                        backgroundColor: e.target.value,
                                                                    },
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* JSON Editor */}
                                            <div>
                                                <h3 className="text-lg font-semibold mb-4">
                                                    Editor JSON Avançado
                                                </h3>
                                                <Textarea
                                                    value={JSON.stringify(selectedTemplate, null, 2)}
                                                    onChange={(e) => {
                                                        try {
                                                            const parsed = JSON.parse(e.target.value);
                                                            setSelectedTemplate(parsed);
                                                            setValidationError(null);
                                                        } catch (err) {
                                                            setValidationError('JSON inválido');
                                                        }
                                                    }}
                                                    className="font-mono text-xs"
                                                    rows={20}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {/* Preview do Template */}
                                            <div>
                                                <h3 className="text-lg font-semibold mb-4">Preview</h3>
                                                <div
                                                    className="p-6 rounded-lg border-2 border-dashed"
                                                    style={{
                                                        backgroundColor: selectedTemplate.layout.backgroundColor,
                                                    }}
                                                >
                                                    <pre className="text-xs overflow-auto">
                                                        {JSON.stringify(selectedTemplate, null, 2)}
                                                    </pre>
                                                </div>
                                            </div>

                                            {/* Informações */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">
                                                        Blocos
                                                    </label>
                                                    <p className="text-2xl font-bold">
                                                        {selectedTemplate.blocks.length}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">
                                                        Versão
                                                    </label>
                                                    <p className="text-2xl font-bold">
                                                        {selectedTemplate.templateVersion}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">
                                                        Última Atualização
                                                    </label>
                                                    <p className="text-sm">
                                                        {new Date(
                                                            selectedTemplate.metadata.updatedAt
                                                        ).toLocaleString('pt-BR')}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">
                                                        Tags
                                                    </label>
                                                    <div className="flex gap-1 mt-1">
                                                        {selectedTemplate.metadata.tags.map((tag) => (
                                                            <Badge key={tag} variant="secondary" className="text-xs">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Ações de Perigo */}
                                            <div className="pt-6 border-t">
                                                <h3 className="text-lg font-semibold mb-4 text-destructive">
                                                    Zona de Perigo
                                                </h3>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={handleDeleteTemplate}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Excluir Template
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <FileJson className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                                <h3 className="text-lg font-semibold mb-2">
                                    Selecione um template
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Escolha um template da lista para visualizar e editar
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </EditorLayout>
    );
};

export default EditorJsonTemplatesPage;
