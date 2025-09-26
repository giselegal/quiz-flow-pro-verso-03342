// 📋 Template Gallery - Sistema de Gerenciamento de Templates (Versão Otimizada)
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BlockData } from '@/types/blocks';
import {
    Clock,
    Copy,
    Download,
    Eye,
    Grid,
    Heart,
    LayoutTemplate,
    List,
    Plus,
    Search,
    SortAsc,
    SortDesc,
    Star,
    Trash2,
} from 'lucide-react';
import React, { useState } from 'react';
import OptimizedTemplateCard from './OptimizedTemplateCard';

// Tipos do Template
interface Template {
    id: string;
    name: string;
    description: string;
    category: 'intro' | 'question' | 'result' | 'custom';
    tags: string[];
    blocks: BlockData[];
    thumbnail?: string;
    isPublic: boolean;
    isFavorite: boolean;
    createdAt: Date;
    updatedAt: Date;
    author?: string;
    downloads?: number;
    rating?: number;
}

interface TemplateGalleryProps {
    onApplyTemplate: (template: Template) => void;
    currentBlocks: BlockData[];
    onSaveAsTemplate?: (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

// Templates predefinidos com imagens otimizadas
const PREDEFINED_TEMPLATES: Template[] = [
    {
        id: 'elegant-intro',
        name: 'Introdução Elegante',
        description: 'Template sofisticado para página inicial do quiz com design moderno',
        category: 'intro',
        isPublic: true,
        isFavorite: false,
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop&auto=format',
        author: 'Quiz Design Team',
        downloads: 42,
        rating: 4.8,
        tags: ['intro', 'elegante', 'moderno', 'profissional'],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20'),
        blocks: [
            {
                id: 'intro-header',
                type: 'quiz-intro-header',
                properties: {
                    logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
                    progressValue: 0,
                    showProgress: true,
                },
                content: {},
                order: 0,
            },
            {
                id: 'intro-title',
                type: 'heading-inline',
                properties: {
                    content: 'Descubra Seu Estilo Único',
                    level: 'h1',
                    textAlign: 'center',
                    color: '#432818',
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                },
                content: {},
                order: 1,
            }
        ]
    },
    {
        id: 'visual-question',
        name: 'Pergunta Visual',
        description: 'Layout otimizado para perguntas com imagens e opções visuais',
        category: 'question',
        isPublic: true,
        isFavorite: true,
        thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&auto=format',
        author: 'UX Team',
        downloads: 28,
        rating: 4.6,
        tags: ['pergunta', 'visual', 'imagem', 'options'],
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-18'),
        blocks: [
            {
                id: 'question-header',
                type: 'quiz-intro-header',
                properties: {
                    logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
                    progressValue: 50,
                    showProgress: true,
                },
                content: {},
                order: 0,
            },
            {
                id: 'question-image',
                type: 'image-display-inline',
                properties: {
                    src: 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=800&h=600&fit=crop&auto=format',
                    alt: 'Imagem da pergunta',
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                },
                content: {},
                order: 1,
            }
        ]
    },
    {
        id: 'result-celebration',
        name: 'Resultado Celebração',
        description: 'Template festivo para página de resultados com call-to-action',
        category: 'result',
        isPublic: true,
        isFavorite: false,
        thumbnail: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop&auto=format',
        author: 'Marketing Team',
        downloads: 35,
        rating: 4.9,
        tags: ['resultado', 'celebração', 'cta', 'conversão'],
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-22'),
        blocks: [
            {
                id: 'result-image',
                type: 'image-display-inline',
                properties: {
                    src: 'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=800&h=600&fit=crop&auto=format',
                    alt: 'Resultado do quiz',
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover',
                },
                content: {},
                order: 0,
            }
        ]
    }
];

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onApplyTemplate, currentBlocks, onSaveAsTemplate }) => {
    // Estados
    const [templates, setTemplates] = useState<Template[]>(PREDEFINED_TEMPLATES);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'name' | 'date' | 'popularity' | 'rating'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    // Estados do formulário de criação
    const [newTemplate, setNewTemplate] = useState({
        name: '',
        description: '',
        category: 'custom' as const,
        tags: '',
        isPublic: false,
    });

    // Filtrar e ordenar templates
    const filteredTemplates = templates.filter(template => {
        const matchesSearch =
            template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
        const matchesFavorites = !showFavoritesOnly || template.isFavorite;

        return matchesSearch && matchesCategory && matchesFavorites;
    });

    const sortedTemplates = [...filteredTemplates].sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
            case 'name':
                comparison = a.name.localeCompare(b.name);
                break;
            case 'date':
                comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
                break;
            case 'popularity':
                comparison = (a.downloads || 0) - (b.downloads || 0);
                break;
            case 'rating':
                comparison = (a.rating || 0) - (b.rating || 0);
                break;
        }

        return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Funções
    const handleApplyTemplate = (template: Template) => {
        onApplyTemplate(template);
    };

    const toggleFavorite = (templateId: string) => {
        setTemplates(prev =>
            prev.map(template =>
                template.id === templateId
                    ? { ...template, isFavorite: !template.isFavorite }
                    : template
            )
        );
    };

    const duplicateTemplate = (template: Template) => {
        const newTemplate: Template = {
            ...template,
            id: `${template.id}-copy-${Date.now()}`,
            name: `${template.name} (Cópia)`,
            isPublic: false,
            isFavorite: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            author: 'Você',
            downloads: 0,
        };

        setTemplates(prev => [...prev, newTemplate]);
    };

    const handleDeleteTemplate = (templateId: string) => {
        setTemplates(prev => prev.filter(template => template.id !== templateId));
    };

    const handleCreateTemplate = () => {
        if (!newTemplate.name.trim() || !newTemplate.description.trim()) return;

        const template: Template = {
            id: `custom-${Date.now()}`,
            name: newTemplate.name.trim(),
            description: newTemplate.description.trim(),
            category: newTemplate.category,
            tags: newTemplate.tags
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0),
            blocks: currentBlocks,
            isPublic: newTemplate.isPublic,
            isFavorite: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            author: 'Você',
            downloads: 0,
        };

        setTemplates(prev => [...prev, template]);
        setShowCreateDialog(false);
        setNewTemplate({
            name: '',
            description: '',
            category: 'custom',
            tags: '',
            isPublic: false,
        });

        if (onSaveAsTemplate) {
            onSaveAsTemplate(template);
        }
    };

    const categories = [
        { value: 'all', label: 'Todas as Categorias' },
        { value: 'intro', label: 'Introdução' },
        { value: 'question', label: 'Pergunta' },
        { value: 'result', label: 'Resultado' },
        { value: 'custom', label: 'Personalizados' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 style={{ color: '#432818' }}>Galeria de Templates</h2>
                <p style={{ color: '#6B4F43' }}>
                    Escolha um template para começar rapidamente ou crie seu próprio template personalizado
                </p>
            </div>

            {/* Controles e Filtros */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Busca */}
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Buscar templates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Filtros */}
                <div className="flex flex-wrap gap-2">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(category => (
                                <SelectItem key={category.value} value={category.value}>
                                    {category.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Ordenar por" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="date">Data</SelectItem>
                            <SelectItem value="name">Nome</SelectItem>
                            <SelectItem value="popularity">Popularidade</SelectItem>
                            <SelectItem value="rating">Avaliação</SelectItem>
                        </SelectContent>
                    </Select>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                                >
                                    {sortOrder === 'asc' ? (
                                        <SortAsc className="w-4 h-4" />
                                    ) : (
                                        <SortDesc className="w-4 h-4" />
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {sortOrder === 'asc' ? 'Crescente' : 'Decrescente'}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={showFavoritesOnly ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                                >
                                    <Heart className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {showFavoritesOnly ? 'Mostrar Todos' : 'Apenas Favoritos'}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}
                                >
                                    {viewMode === 'grid' ? (
                                        <Grid className="w-4 h-4" />
                                    ) : (
                                        <List className="w-4 h-4" />
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {viewMode === 'grid' ? 'Visualização em Grade' : 'Visualização em Lista'}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            {/* Grid/Lista de Templates */}
            <div
                className={
                    viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'
                }
            >
                {sortedTemplates.map(template => (
                    <OptimizedTemplateCard
                        key={template.id}
                        template={template}
                        viewMode={viewMode}
                        onApply={handleApplyTemplate}
                        onToggleFavorite={toggleFavorite}
                        onPreview={(template) => {
                            // Implementar modal de preview se necessário
                            console.log('Preview template:', template.id);
                        }}
                    />
                ))}
            </div>

            {/* Estado vazio */}
            {sortedTemplates.length === 0 && (
                <div className="text-center py-12">
                    <LayoutTemplate className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 style={{ color: '#432818' }}>Nenhum template encontrado</h3>
                    <p style={{ color: '#6B4F43' }}>
                        {searchTerm || selectedCategory !== 'all' || showFavoritesOnly
                            ? 'Tente ajustar os filtros de busca'
                            : 'Crie seu primeiro template personalizado'}
                    </p>
                    {!searchTerm && selectedCategory === 'all' && !showFavoritesOnly && (
                        <Button onClick={() => setShowCreateDialog(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Criar Template
                        </Button>
                    )}
                </div>
            )}

            {/* Dialog de Criação de Template */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Criar Novo Template</DialogTitle>
                        <DialogDescription>
                            Salve seus blocos atuais como um template reutilizável
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="template-name">Nome do Template</Label>
                            <Input
                                id="template-name"
                                value={newTemplate.name}
                                onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Ex: Meu Template Personalizado"
                            />
                        </div>

                        <div>
                            <Label htmlFor="template-description">Descrição</Label>
                            <Textarea
                                id="template-description"
                                value={newTemplate.description}
                                onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Descreva o propósito e características do template"
                                rows={3}
                            />
                        </div>

                        <div>
                            <Label htmlFor="template-category">Categoria</Label>
                            <Select
                                value={newTemplate.category}
                                onValueChange={(value: any) => setNewTemplate(prev => ({ ...prev, category: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="intro">Introdução</SelectItem>
                                    <SelectItem value="question">Pergunta</SelectItem>
                                    <SelectItem value="result">Resultado</SelectItem>
                                    <SelectItem value="custom">Personalizado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="template-tags">Tags (separadas por vírgula)</Label>
                            <Input
                                id="template-tags"
                                value={newTemplate.tags}
                                onChange={(e) => setNewTemplate(prev => ({ ...prev, tags: e.target.value }))}
                                placeholder="Ex: moderno, elegante, profissional"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="template-public"
                                checked={newTemplate.isPublic}
                                onChange={(e) => setNewTemplate(prev => ({ ...prev, isPublic: e.target.checked }))}
                            />
                            <Label htmlFor="template-public">Tornar público (outros usuários poderão usar)</Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleCreateTemplate} disabled={!newTemplate.name.trim() || !newTemplate.description.trim()}>
                            Criar Template
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TemplateGallery;