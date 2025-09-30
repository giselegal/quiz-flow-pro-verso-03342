import React, { useState } from 'react';
import { Copy, Eye, Star, Search, Filter } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';

// Importação dos templates reais
import { AVAILABLE_TEMPLATES, TemplateService, TemplateConfig } from '../../config/templates';

const templatesFunis: TemplateConfig[] = AVAILABLE_TEMPLATES;

const TemplatesFunisPage: React.FC = () => {
    const [selectedSegment, setSelectedSegment] = useState('Todos');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [selectedDifficulty, setSelectedDifficulty] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');

    // DEBUG: Log dos templates para diagnóstico
    console.log('🔍 DEBUG TEMPLATES:', {
        AVAILABLE_TEMPLATES,
        totalTemplates: AVAILABLE_TEMPLATES.length,
        activeTemplates: TemplateService.getActiveTemplates(),
        quiz21Template: TemplateService.getTemplate('quiz-estilo-21-steps')
    });

    const filteredTemplates = React.useMemo(() => {
        // Começar sempre com apenas templates ativos
        let result = TemplateService.getActiveTemplates();

        if (selectedSegment !== 'Todos') {
            result = TemplateService.getTemplatesBySegment(selectedSegment);
            // Garantir que apenas templates ativos sejam mostrados
            result = result.filter(t => t.isActive);
        }

        if (selectedCategory !== 'Todos') {
            result = result.filter(t => t.category === selectedCategory);
        }

        if (selectedDifficulty !== 'Todos') {
            result = result.filter(t => t.difficulty === selectedDifficulty);
        }

        if (searchTerm.trim()) {
            result = result.filter(template =>
                template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        return result;
    }, [selectedSegment, selectedCategory, selectedDifficulty, searchTerm]);

    // DEBUG: Log dos templates filtrados
    console.log('🔍 DEBUG FILTERED:', {
        selectedSegment,
        selectedCategory,
        selectedDifficulty,
        searchTerm,
        filteredCount: filteredTemplates.length,
        filteredTemplates: filteredTemplates.map(t => ({ id: t.id, name: t.name, isActive: t.isActive }))
    });

    const handleUseTemplate = (templateId: string) => {
        console.log('Usando template:', templateId);
        window.open(`/editor?template=${templateId}`, '_blank');
    };

    const handlePreviewTemplate = (templateId: string) => {
        console.log('Preview do template:', templateId);
        window.open(`/templates/preview/${templateId}`, '_blank');
    };

    return (
        <div className="p-6 bg-white min-h-screen">
            {/* DEBUG INFO - Remover em produção */}
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">🔍 Informações de Debug</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <strong>Total Templates:</strong> {templatesFunis.length}
                    </div>
                    <div>
                        <strong>Templates Filtrados:</strong> {filteredTemplates.length}
                    </div>
                    <div>
                        <strong>Quiz21 Encontrado:</strong> {
                            TemplateService.getTemplate('quiz-estilo-21-steps') ? '✅' : '❌'
                        }
                    </div>
                    <div>
                        <strong>Templates Ativos:</strong> {TemplateService.getActiveTemplates().length}
                    </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                    Filtros: Segmento={selectedSegment}, Categoria={selectedCategory}, Dificuldade={selectedDifficulty}, Busca="{searchTerm}"
                </div>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#1A0F3D] mb-2">
                    Templates de Funis
                </h1>
                <p className="text-gray-600">
                    Escolha um template para começar seu funil de conversão
                </p>
            </div>

            <div className="mb-6">
                <div className="flex flex-wrap gap-4 items-center mb-4">
                    <div className="relative flex-1 min-w-80">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Buscar templates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <select
                            value={selectedSegment}
                            onChange={(e) => setSelectedSegment(e.target.value)}
                            className="px-3 py-2 border rounded-lg bg-white"
                        >
                            <option value="Todos">Todos os Segmentos</option>
                            <option value="E-commerce">E-commerce</option>
                            <option value="SaaS">SaaS</option>
                            <option value="Educação">Educação</option>
                            <option value="Saúde">Saúde</option>
                            <option value="Finanças">Finanças</option>
                        </select>
                    </div>

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 border rounded-lg bg-white"
                    >
                        <option value="Todos">Todas as Categorias</option>
                        <option value="Quiz">Quiz</option>
                        <option value="lead-generation">Geração de Leads</option>
                        <option value="product-quiz">Quiz de Produto</option>
                        <option value="survey">Pesquisa</option>
                        <option value="assessment">Avaliação</option>
                    </select>

                    <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="px-3 py-2 border rounded-lg bg-white"
                    >
                        <option value="Todos">Todas as Dificuldades</option>
                        <option value="Básico">Básico</option>
                        <option value="Intermediário">Intermediário</option>
                        <option value="Avançado">Avançado</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTemplates.map((template) => (
                    <Card key={template.id} className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-[#7C3AED]">
                        <CardHeader className="pb-3">
                            <div className="w-full h-32 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] rounded-lg mb-3 flex items-center justify-center">
                                <div className="text-white text-2xl font-bold">
                                    {template.name.charAt(0)}
                                </div>
                            </div>

                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg font-bold text-[#1A0F3D] mb-1">
                                        {template.name}
                                    </CardTitle>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline" className="text-xs">
                                            {template.category}
                                        </Badge>
                                        <Badge
                                            variant="secondary"
                                            className="text-xs"
                                            style={{
                                                backgroundColor: template.difficulty === 'Fácil' ? '#10B981' :
                                                    template.difficulty === 'Intermediário' ? '#F59E0B' : '#EF4444',
                                                color: 'white'
                                            }}
                                        >
                                            {template.difficulty}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <Star className="h-4 w-4 fill-current" />
                                    <span className="text-sm font-medium">{template.rating}</span>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                            <CardDescription className="text-sm text-gray-600 mb-4 line-clamp-3">
                                {template.description}
                            </CardDescription>

                            <div className="flex justify-between text-xs text-gray-500 mb-4">
                                <span>🎯 {85}% conversão</span>
                                <span>⚡ {'5 min'}</span>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-4">
                                {template.tags.slice(0, 3).map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="outline"
                                        className="text-xs px-2 py-0.5 bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/20"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                                {template.tags.length > 3 && (
                                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                                        +{template.tags.length - 3}
                                    </Badge>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleUseTemplate(template.id)}
                                    className="flex-1 bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                                    size="sm"
                                >
                                    <Copy className="h-4 w-4 mr-1" />
                                    Usar Template
                                </Button>

                                <Button
                                    onClick={() => handlePreviewTemplate(template.id)}
                                    variant="outline"
                                    size="sm"
                                    className="border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED]/10"
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-4xl mb-4">🔍</div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        Nenhum template encontrado
                    </h3>
                    <p className="text-gray-500">
                        Tente ajustar os filtros ou termo de busca
                    </p>
                </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>
                        Exibindo {filteredTemplates.length} de {templatesFunis.length} templates
                    </span>
                    <div className="flex items-center gap-4">
                        <span>💡 {templatesFunis.filter(t => t.difficulty === 'Fácil').length} Fáceis</span>
                        <span>⚡ {templatesFunis.filter(t => t.difficulty === 'Intermediário').length} Intermediários</span>
                        <span>🚀 {templatesFunis.filter(t => t.difficulty === 'Avançado').length} Avançados</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplatesFunisPage;
