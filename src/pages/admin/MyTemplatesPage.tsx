/**
 * 🎨 PÁimport { 
  Edit, 
  Eye, 
  Trash2, 
  Plus, 
  Search, 
  FileText,
  Copy,
  Star,
  Calendar
} from 'lucide-react';MPLATES
 * 
 * Página dedicada para gerenciar templates personalizados criados/editados pelo usuário.
 * Separada de "Meus Funis" para manter organização clara entre funis e templates.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Edit,
    Eye,
    Trash2,
    Plus,
    Search,
    Filter,
    FileText,
    Copy,
    Download,
    Star,
    Calendar
} from 'lucide-react';
import { useLocation } from 'wouter';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';
import useMyTemplates, { UserTemplate } from '@/hooks/useMyTemplates';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

const TEMPLATE_CATEGORIES = {
    'custom': 'Personalizado',
    'quiz': 'Quiz',
    'lead-generation': 'Geração de Leads',
    'personality-test': 'Teste de Personalidade',
    'product-recommendation': 'Recomendação de Produto',
    'assessment': 'Avaliações',
    'offer-funnel': 'Funil de Oferta',
};

const MyTemplatesPage: React.FC = () => {
    const [, setLocation] = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [templateToDelete, setTemplateToDelete] = useState<UserTemplate | null>(null);

    // Hook para gerenciar templates personalizados
    const {
        templates,
        isLoading,
        error,
        deleteTemplate,
        incrementUsage,
        templatesCount,
        totalUsage,
    } = useMyTemplates();    // Filtrar templates
    const filteredTemplates = templates.filter(template => {
        const matchesSearch =
            template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    /**
     * Editar template - abre no editor
     */
    const handleEditTemplate = async (template: UserTemplate) => {
        console.log('✏️ Editando template:', template.id);

        try {
            // Incrementar contador de uso
            await incrementUsage(template.id);

            // Navegar para o editor com o template
            setLocation(`/editor?template=${encodeURIComponent(template.id)}&context=my-templates`);
        } catch (error) {
            console.error('❌ Erro ao editar template:', error);
        }
    };

    /**
     * Usar template - cria novo funil baseado no template
     */
    const handleUseTemplate = async (template: UserTemplate) => {
        console.log('🚀 Usando template para criar novo funil:', template.id);

        try {
            // Incrementar contador de uso
            await incrementUsage(template.id);

            // Criar novo funil baseado no template
            const newFunnelId = `funnel-from-template-${Date.now()}`;

            // Navegar para o editor criando um novo funil
            setLocation(`/editor?template=${encodeURIComponent(template.id)}&funnel=${newFunnelId}&context=my-funnels&mode=create`);
        } catch (error) {
            console.error('❌ Erro ao usar template:', error);
        }
    };

    /**
     * Visualizar template
     */
    const handlePreviewTemplate = async (template: UserTemplate) => {
        console.log('👁️ Visualizando template:', template.id);

        try {
            // Incrementar contador de uso
            await incrementUsage(template.id);

            // Navegar para preview
            setLocation(`/preview?template=${encodeURIComponent(template.id)}&context=my-templates`);
        } catch (error) {
            console.error('❌ Erro ao visualizar template:', error);
        }
    };

    /**
     * Duplicar template
     */
    const handleDuplicateTemplate = async (template: UserTemplate) => {
        console.log('📋 Duplicando template:', template.id);

        try {
            // Navegar para editor com template duplicado
            setLocation(`/editor?duplicate=${encodeURIComponent(template.id)}&context=my-templates`);
        } catch (error) {
            console.error('❌ Erro ao duplicar template:', error);
        }
    };    /**
     * Confirmar exclusão de template
     */
    const handleDeleteTemplate = async () => {
        if (!templateToDelete) return;

        console.log('🗑️ Deletando template:', templateToDelete.id);

        try {
            const success = await deleteTemplate(templateToDelete.id);
            if (success) {
                console.log('✅ Template deletado com sucesso');
            }
        } catch (error) {
            console.error('❌ Erro ao deletar template:', error);
        } finally {
            setTemplateToDelete(null);
        }
    };

    /**
     * Ir para o editor para criar novo template
     */
    const createNewTemplate = () => {
        setLocation('/editor?context=my-templates&mode=create-template');
    };

    if (error) {
        return (
            <div className="container mx-auto py-8">
                <div className="text-center text-red-600">
                    <p>Erro ao carregar templates: {error}</p>
                    <Button onClick={() => window.location.reload()} className="mt-4">
                        Tentar Novamente
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <AdminBreadcrumbs
                items={[
                    { label: 'Dashboard', href: '/admin' },
                    { label: 'Meus Templates', href: '/admin/meus-templates' }
                ]}
            />

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        🎨 Meus Templates
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Templates personalizados criados e editados por você
                    </p>
                </div>

                <Button onClick={createNewTemplate} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Template
                </Button>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Total de Templates</p>
                                <p className="text-2xl font-bold">{templatesCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Copy className="h-5 w-5 text-green-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Total de Usos</p>
                                <p className="text-2xl font-bold">{totalUsage}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Contexto</p>
                                <p className="text-lg font-semibold">MY_TEMPLATES</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Buscar templates..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas as Categorias</SelectItem>
                        {Object.entries(TEMPLATE_CATEGORIES).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Lista de Templates */}
            {isLoading ? (
                <div className="text-center py-8">
                    <p>Carregando templates...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map((template) => (
                        <Card key={template.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span className="truncate">{template.name}</span>
                                    <Badge variant="secondary">
                                        {TEMPLATE_CATEGORIES[template.category as keyof typeof TEMPLATE_CATEGORIES] || template.category}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {template.description}
                                    </p>

                                    {/* Tags */}
                                    {template.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {template.tags.slice(0, 3).map(tag => (
                                                <Badge key={tag} variant="outline" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                            {template.tags.length > 3 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{template.tags.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                    )}

                                    {/* Metadados */}
                                    <div className="text-xs text-muted-foreground space-y-1">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            Criado: {new Date(template.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Copy className="h-3 w-3" />
                                            Usos: {template.usageCount}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FileText className="h-3 w-3" />
                                            Componentes: {template.stepCount}
                                        </div>
                                    </div>

                                    {/* Ações */}
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={() => handleUseTemplate(template)}
                                            className="flex items-center gap-1 flex-1"
                                        >
                                            <Copy className="h-3 w-3" />
                                            Usar
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEditTemplate(template)}
                                            className="flex items-center gap-1"
                                        >
                                            <Edit className="h-3 w-3" />
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePreviewTemplate(template)}
                                            className="flex items-center gap-1"
                                        >
                                            <Eye className="h-3 w-3" />
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDuplicateTemplate(template)}
                                            className="flex items-center gap-1"
                                        >
                                            <Copy className="h-3 w-3" />
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setTemplateToDelete(template)}
                                            className="flex items-center gap-1 text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Estado vazio */}
            {filteredTemplates.length === 0 && !isLoading && (
                <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-4">
                        {searchTerm || selectedCategory !== 'all'
                            ? 'Nenhum template encontrado'
                            : 'Nenhum template personalizado'
                        }
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                        {searchTerm || selectedCategory !== 'all'
                            ? 'Tente ajustar os filtros de busca'
                            : 'Comece criando seu primeiro template personalizado'
                        }
                    </p>
                    <Button onClick={createNewTemplate} className="flex items-center gap-2 mx-auto">
                        <Plus className="h-4 w-4" />
                        Criar Primeiro Template
                    </Button>
                </div>
            )}

            {/* Dialog de confirmação de exclusão */}
            <Dialog open={!!templateToDelete} onOpenChange={(open) => !open && setTemplateToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar Exclusão</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir o template "{templateToDelete?.name}"?
                            Esta ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setTemplateToDelete(null)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteTemplate}>
                            Excluir Template
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MyTemplatesPage;
