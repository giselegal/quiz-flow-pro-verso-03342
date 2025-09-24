import React from 'react';
import { Copy, Eye, Download, Star } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

// Templates de funis reais e práticos disponíveis
const templatesFunis = [
    {
        id: 'template-quiz-personalidade',
        name: 'Quiz de Personalidade',
        description: 'Descubra seu estilo pessoal em 5 perguntas simples. Perfeito para engajamento e geração de leads.',
        category: 'Quiz',
        difficulty: 'Fácil',
        questions: 5,
        avgTime: '3 min',
        rating: 4.8,
        downloads: 3250,
        tags: ['Personalidade', 'Engajamento', 'Lead Generation'],
        preview: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=Quiz+Personalidade',
        features: ['Resultados personalizados', 'Captura de email', 'Compartilhamento social']
    },
    {
        id: 'template-lead-magnet',
        name: 'Lead Magnet com E-book',
        description: 'Capture leads qualificados oferecendo conteúdo de valor em troca do contato.',
        category: 'Lead Generation',
        difficulty: 'Fácil',
        questions: 3,
        avgTime: '2 min',
        rating: 4.9,
        downloads: 5890,
        tags: ['Lead Magnet', 'E-book', 'Captura'],
        preview: 'https://via.placeholder.com/300x200/10b981/ffffff?text=Lead+Magnet',
        features: ['Formulário otimizado', 'Entrega automática', 'Integração email']
    },
    {
        id: 'template-pesquisa-nps',
        name: 'Pesquisa NPS',
        description: 'Meça a satisfação dos clientes com Net Promoter Score de forma simples e eficaz.',
        category: 'Pesquisa',
        difficulty: 'Fácil',
        questions: 4,
        avgTime: '2 min',
        rating: 4.7,
        downloads: 2100,
        tags: ['NPS', 'Satisfação', 'Feedback'],
        preview: 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=NPS+Survey',
        features: ['Cálculo automático do NPS', 'Segmentação de respostas', 'Relatórios visuais']
    },
    {
        id: 'template-calculadora-roi',
        name: 'Calculadora de ROI',
        description: 'Ferramenta interativa para demonstrar o retorno do investimento em seus serviços.',
        category: 'Calculadora',
        difficulty: 'Intermediário',
        questions: 6,
        avgTime: '5 min',
        rating: 4.6,
        downloads: 1750,
        tags: ['ROI', 'Vendas', 'Calculadora'],
        preview: 'https://via.placeholder.com/300x200/ef4444/ffffff?text=ROI+Calculator',
        features: ['Cálculos automáticos', 'Resultados visuais', 'PDF de proposta']
    },
    {
        id: 'template-qualificacao-lead',
        name: 'Qualificação de Leads B2B',
        description: 'Identifique e qualifique leads empresariais com perguntas estratégicas.',
        category: 'B2B',
        difficulty: 'Avançado',
        questions: 8,
        avgTime: '7 min',
        rating: 4.8,
        downloads: 890,
        tags: ['B2B', 'Qualificação', 'Vendas'],
        preview: 'https://via.placeholder.com/300x200/8b5cf6/ffffff?text=B2B+Qualification',
        features: ['Scoring automático', 'Segmentação avançada', 'Integração CRM']
    },
    {
        id: 'template-onboarding',
        name: 'Onboarding de Clientes',
        description: 'Colete informações essenciais para personalizar a experiência do novo cliente.',
        category: 'Onboarding',
        difficulty: 'Intermediário',
        questions: 6,
        avgTime: '4 min',
        rating: 4.5,
        downloads: 950,
        tags: ['Onboarding', 'Personalização', 'Experiência'],
        preview: 'https://via.placeholder.com/300x200/06b6d4/ffffff?text=Onboarding',
        features: ['Coleta de preferências', 'Setup personalizado', 'Jornada guiada']
    },
    {
        id: 'template-evento-inscricao',
        name: 'Inscrição para Eventos',
        description: 'Formulário completo para inscrições em webinars, workshops e eventos.',
        category: 'Eventos',
        difficulty: 'Fácil',
        questions: 5,
        avgTime: '3 min',
        rating: 4.4,
        downloads: 1320,
        tags: ['Eventos', 'Inscrição', 'Webinar'],
        preview: 'https://via.placeholder.com/300x200/f97316/ffffff?text=Event+Registration',
        features: ['Agenda automática', 'Lembretes por email', 'Link de acesso']
    },
    {
        id: 'template-pesquisa-mercado',
        name: 'Pesquisa de Mercado',
        description: 'Colete insights valiosos sobre seu público e validar ideias de produtos.',
        category: 'Pesquisa',
        difficulty: 'Intermediário',
        questions: 10,
        avgTime: '6 min',
        rating: 4.3,
        downloads: 680,
        tags: ['Pesquisa', 'Mercado', 'Insights'],
        preview: 'https://via.placeholder.com/300x200/84cc16/ffffff?text=Market+Research',
        features: ['Análise estatística', 'Gráficos automáticos', 'Exportação de dados']
    }
]; const categories = ['Todos', 'Quiz', 'Lead Generation', 'Pesquisa', 'Calculadora', 'B2B', 'Onboarding', 'Eventos'];
const difficulties = ['Todos', 'Fácil', 'Intermediário', 'Avançado'];

const TemplatesFunisPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = React.useState('Todos');
    const [selectedDifficulty, setSelectedDifficulty] = React.useState('Todos');
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredTemplates = templatesFunis.filter(template => {
        const matchesCategory = selectedCategory === 'Todos' || template.category === selectedCategory;
        const matchesDifficulty = selectedDifficulty === 'Todos' || template.difficulty === selectedDifficulty;
        const matchesSearch = searchTerm === '' ||
            template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesCategory && matchesDifficulty && matchesSearch;
    });

    const handleUseTemplate = (templateId: string) => {
        console.log(`Usando template: ${templateId}`);
        // Aqui integraria com a lógica do editor para carregar o template
    };

    const handlePreviewTemplate = (templateId: string) => {
        console.log(`Visualizando template: ${templateId}`);
        // Aqui abriria um modal ou nova página com preview
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Modelos de Funis
                </h1>
                <p className="text-gray-600">
                    Templates profissionais e testados para diferentes objetivos de negócio
                </p>
            </div>            {/* Filtros */}
            <div className="mb-6 space-y-4">
                {/* Search */}
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Buscar templates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Filtros */}
                <div className="flex flex-wrap gap-4">
                    {/* Categories */}
                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-medium text-gray-700 mr-2">Categoria:</span>
                        {categories.map(category => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(category)}
                                className="text-xs"
                            >
                                {category}
                            </Button>
                        ))}
                    </div>

                    {/* Difficulties */}
                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-medium text-gray-700 mr-2">Dificuldade:</span>
                        {difficulties.map(difficulty => (
                            <Button
                                key={difficulty}
                                variant={selectedDifficulty === difficulty ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedDifficulty(difficulty)}
                                className="text-xs"
                            >
                                {difficulty}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="mb-6">
                <p className="text-sm text-gray-600">
                    Mostrando {filteredTemplates.length} de {templatesFunis.length} templates
                </p>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map(template => (
                    <Card key={template.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                            {/* Preview Image */}
                            <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                                <img
                                    src={template.preview}
                                    alt={template.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <CardTitle className="text-lg">{template.name}</CardTitle>
                            <CardDescription className="text-sm line-clamp-2">
                                {template.description}
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {/* Badges */}
                            <div className="flex flex-wrap gap-1 mb-3">
                                <Badge variant="secondary" className="text-xs">
                                    {template.category}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                    {template.difficulty}
                                </Badge>
                                {template.tags.slice(0, 2).map(tag => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>

                            {/* Stats */}
                            <div className="flex justify-between text-sm text-gray-600 mb-4">
                                <div className="flex items-center gap-4">
                                    <span>{template.questions} perguntas</span>
                                    <span>{template.avgTime}</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-sm text-gray-600 mb-4">
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-500" />
                                    <span>{template.rating}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Download className="w-3 h-3" />
                                    <span>{template.downloads.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Features */}
                            {template.features && (
                                <div className="mb-4">
                                    <p className="text-xs font-medium text-gray-700 mb-2">Recursos:</p>
                                    <div className="space-y-1">
                                        {template.features.slice(0, 3).map((feature, index) => (
                                            <div key={index} className="flex items-center text-xs text-gray-600">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={() => handleUseTemplate(template.id)}
                                    className="flex-1"
                                >
                                    <Copy className="w-4 h-4 mr-1" />
                                    Usar Template
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePreviewTemplate(template.id)}
                                >
                                    <Eye className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <Copy className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhum template encontrado
                    </h3>
                    <p className="text-gray-600">
                        Tente ajustar os filtros ou termo de busca
                    </p>
                </div>
            )}
        </div>
    );
};

export default TemplatesFunisPage;