import React from 'react';
import { Copy, Eye, Download, Star } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

// Mock data para templates de funis
const templatesFunis = [
    {
        id: 'template-1',
        name: 'Quiz de Personalidade',
        description: 'Template para quiz de personalidade com 5 perguntas e resultado personalizado',
        category: 'Personalidade',
        difficulty: 'Fácil',
        questions: 5,
        avgTime: '3 min',
        rating: 4.8,
        downloads: 1250,
        tags: ['Personalidade', 'Engajamento', 'Social'],
        preview: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=Quiz+Personalidade'
    },
    {
        id: 'template-2',
        name: 'Funil de Vendas B2B',
        description: 'Template completo para qualificação de leads B2B com scoring automático',
        category: 'Negócios',
        difficulty: 'Avançado',
        questions: 8,
        avgTime: '6 min',
        rating: 4.9,
        downloads: 890,
        tags: ['B2B', 'Vendas', 'Qualificação'],
        preview: 'https://via.placeholder.com/300x200/10b981/ffffff?text=B2B+Funnel'
    },
    {
        id: 'template-3',
        name: 'Pesquisa de Satisfação',
        description: 'Modelo para avaliar satisfação do cliente com NPS integrado',
        category: 'Feedback',
        difficulty: 'Intermediário',
        questions: 6,
        avgTime: '4 min',
        rating: 4.6,
        downloads: 2100,
        tags: ['NPS', 'Satisfação', 'Feedback'],
        preview: 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=NPS+Survey'
    },
    {
        id: 'template-4',
        name: 'Quiz Educacional',
        description: 'Template para quiz educacional com explicações e pontuação',
        category: 'Educação',
        difficulty: 'Fácil',
        questions: 10,
        avgTime: '8 min',
        rating: 4.7,
        downloads: 1680,
        tags: ['Educação', 'Aprendizado', 'Avaliação'],
        preview: 'https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Quiz+Educacional'
    },
    {
        id: 'template-5',
        name: 'Calculadora de ROI',
        description: 'Funil interativo para calcular retorno sobre investimento',
        category: 'Calculadora',
        difficulty: 'Avançado',
        questions: 7,
        avgTime: '5 min',
        rating: 4.5,
        downloads: 750,
        tags: ['ROI', 'Calculadora', 'Financeiro'],
        preview: 'https://via.placeholder.com/300x200/ef4444/ffffff?text=ROI+Calculator'
    },
    {
        id: 'template-6',
        name: 'Onboarding Interativo',
        description: 'Template para processo de onboarding de novos usuários',
        category: 'Onboarding',
        difficulty: 'Intermediário',
        questions: 4,
        avgTime: '3 min',
        rating: 4.4,
        downloads: 950,
        tags: ['Onboarding', 'UX', 'Engajamento'],
        preview: 'https://via.placeholder.com/300x200/06b6d4/ffffff?text=Onboarding'
    }
];

const categories = ['Todos', 'Personalidade', 'Negócios', 'Feedback', 'Educação', 'Calculadora', 'Onboarding'];
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
                    Templates de Funis
                </h1>
                <p className="text-gray-600">
                    Escolha entre nossos modelos prontos para começar rapidamente
                </p>
            </div>

            {/* Filtros */}
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