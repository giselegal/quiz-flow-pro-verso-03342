import React, { useState } from 'react';
import { Copy, Eye, Download, Star, Search, Filter } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';

// Templates organizados por segmento de mercado
const templatesFunis = [
    // === TEMPLATES B2B ===
    {
        id: 'template-qualificacao-b2b',
        name: 'Qualificação de Leads B2B',
        description: 'Identifique e qualifique leads empresariais com perguntas estratégicas e scoring automático.',
        category: 'B2B',
        segment: 'B2B',
        difficulty: 'Intermediário',
        rating: 4.8,
        downloads: 2456,
        tags: ['B2B', 'Lead Scoring', 'Qualificação'],
        preview: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=240&fit=crop&crop=center&auto=format&q=60',
        features: ['Lead scoring automático', 'Integração CRM', 'Relatórios avançados', 'Follow-up inteligente']
    },
    {
        id: 'template-calculadora-roi',
        name: 'Calculadora de ROI',
        description: 'Demonstre o valor do seu produto/serviço com uma calculadora interativa de retorno sobre investimento.',
        category: 'B2B',
        segment: 'B2B',
        difficulty: 'Avançado',
        rating: 4.9,
        downloads: 1834,
        tags: ['ROI', 'Calculadora', 'Vendas'],
        preview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=240&fit=crop&crop=center&auto=format&q=60',
        features: ['Cálculos personalizados', 'Relatórios em PDF', 'Integração com pipelines', 'Análise comparativa']
    },
    {
        id: 'template-auditoria-digital',
        name: 'Auditoria Digital Gratuita',
        description: 'Ofereça uma auditoria digital completa como isca digital para atrair empresas interessadas.',
        category: 'B2B',
        segment: 'B2B',
        difficulty: 'Intermediário',
        rating: 4.7,
        downloads: 3247,
        tags: ['Auditoria', 'Digital', 'Lead Magnet'],
        preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=240&fit=crop&crop=center&auto=format&q=60',
        features: ['Análise automática', 'Relatório personalizado', 'Recomendações', 'Agendamento de reunião']
    },

    // === TEMPLATES CLIENTE FINAL ===
    {
        id: 'template-lead-magnet',
        name: 'Lead Magnet Premium',
        description: 'Capture leads qualificados oferecendo conteúdo exclusivo e de alto valor para seu público.',
        category: 'Lead Generation',
        segment: 'Cliente Final',
        difficulty: 'Fácil',
        rating: 4.6,
        downloads: 5672,
        tags: ['Lead Magnet', 'Captura', 'Conteúdo'],
        preview: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=240&fit=crop&crop=center&auto=format&q=60',
        features: ['Formulários otimizados', 'Entrega automática', 'Segmentação de público', 'Analytics integrado']
    },
    {
        id: 'template-pesquisa-nps',
        name: 'Pesquisa de Satisfação NPS',
        description: 'Meça a satisfação dos seus clientes e identifique oportunidades de melhoria com metodologia NPS.',
        category: 'Pesquisa',
        segment: 'Cliente Final',
        difficulty: 'Fácil',
        rating: 4.5,
        downloads: 4123,
        tags: ['NPS', 'Satisfação', 'Pesquisa'],
        preview: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=240&fit=crop&crop=center&auto=format&q=60',
        features: ['Cálculo automático NPS', 'Segmentação de respostas', 'Dashboards visuais', 'Alertas automáticos']
    },
    {
        id: 'template-onboarding-clientes',
        name: 'Onboarding de Clientes',
        description: 'Guie novos clientes através do processo de integração com seu produto de forma interativa.',
        category: 'Onboarding',
        segment: 'Cliente Final',
        difficulty: 'Intermediário',
        rating: 4.8,
        downloads: 2891,
        tags: ['Onboarding', 'Cliente', 'Integração'],
        preview: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=240&fit=crop&crop=center&auto=format&q=60',
        features: ['Progresso visual', 'Checkpoints interativos', 'Recursos contextuais', 'Suporte integrado']
    },
    {
        id: 'template-inscricao-evento',
        name: 'Inscrição para Eventos',
        description: 'Simplifique o processo de inscrição em eventos com formulários inteligentes e confirmação automática.',
        category: 'Eventos',
        segment: 'Cliente Final',
        difficulty: 'Fácil',
        rating: 4.4,
        downloads: 3456,
        tags: ['Evento', 'Inscrição', 'Registro'],
        preview: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&crop=center&auto=format&q=60',
        features: ['Agenda dinâmica', 'QR codes', 'Lembretes automáticos', 'Check-in digital']
    },

    // === TEMPLATES QUIZ ===
    {
        id: 'template-quiz-personalidade',
        name: 'Quiz de Personalidade',
        description: 'Engaje seu público com um quiz divertido que revela traços de personalidade e gera leads.',
        category: 'Quiz',
        segment: 'Quiz',
        difficulty: 'Fácil',
        rating: 4.7,
        downloads: 8934,
        tags: ['Quiz', 'Personalidade', 'Engajamento'],
        preview: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=240&fit=crop&crop=center&auto=format&q=60',
        features: ['Resultados personalizados', 'Compartilhamento social', 'Captura de leads', 'Analytics detalhado']
    },
    {
        id: 'template-quiz-conhecimento',
        name: 'Quiz de Conhecimento',
        description: 'Teste o conhecimento dos participantes sobre seu nicho e eduque-os no processo.',
        category: 'Quiz',
        segment: 'Quiz',
        difficulty: 'Intermediário',
        rating: 4.6,
        downloads: 5247,
        tags: ['Quiz', 'Conhecimento', 'Educação'],
        preview: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=240&fit=crop&crop=center&auto=format&q=60',
        features: ['Sistema de pontuação', 'Feedback imediato', 'Níveis de dificuldade', 'Certificados digitais']
    },
    {
        id: 'template-quiz-produto',
        name: 'Quiz Recomendação de Produto',
        description: 'Ajude clientes a encontrar o produto perfeito através de perguntas direcionadas.',
        category: 'Quiz',
        segment: 'Quiz',
        difficulty: 'Avançado',
        rating: 4.9,
        downloads: 3180,
        tags: ['Produto', 'Recomendação', 'Vendas'],
        preview: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=240&fit=crop&crop=center&auto=format&q=60',
        features: ['Recomendações inteligentes', 'Integração com catálogo', 'Cross-sell automático', 'Cupons personalizados']
    }
];

const segments = ['Todos', 'B2B', 'Cliente Final', 'Quiz'];
const categories = ['Todos', 'B2B', 'Lead Generation', 'Pesquisa', 'Onboarding', 'Eventos', 'Quiz'];
const difficulties = ['Todos', 'Fácil', 'Intermediário', 'Avançado'];

const TemplatesFunisPage: React.FC = () => {
    const [selectedSegment, setSelectedSegment] = useState('Todos');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [selectedDifficulty, setSelectedDifficulty] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTemplates = templatesFunis.filter(template => {
        const matchesSegment = selectedSegment === 'Todos' || template.segment === selectedSegment;
        const matchesCategory = selectedCategory === 'Todos' || template.category === selectedCategory;
        const matchesDifficulty = selectedDifficulty === 'Todos' || template.difficulty === selectedDifficulty;
        const matchesSearch = searchTerm === '' ||
            template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesSegment && matchesCategory && matchesDifficulty && matchesSearch;
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
        <div className="p-6 bg-white min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#1A0F3D] mb-2">
                    Modelos de Funis
                </h1>
                <p className="text-[#2E1A6B] mb-6">
                    Templates profissionais e testados para diferentes objetivos de negócio
                </p>

                {/* Resumo por segmento */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="p-4 border border-[#4A2E9F]/20 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#4A2E9F]/10 rounded-lg">
                                <div className="w-6 h-6 bg-[#4A2E9F] rounded"></div>
                            </div>
                            <div>
                                <p className="text-sm text-[#2E1A6B]">Templates B2B</p>
                                <p className="text-xl font-bold text-[#1A0F3D]">{templatesFunis.filter(t => t.segment === 'B2B').length}</p>
                                <p className="text-xs text-[#4A2E9F]">Empresarial</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border border-[#00BFFF]/20 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#00BFFF]/10 rounded-lg">
                                <div className="w-6 h-6 bg-[#00BFFF] rounded"></div>
                            </div>
                            <div>
                                <p className="text-sm text-[#2E1A6B]">Cliente Final</p>
                                <p className="text-xl font-bold text-[#1A0F3D]">{templatesFunis.filter(t => t.segment === 'Cliente Final').length}</p>
                                <p className="text-xs text-[#00BFFF]">Consumidor</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border border-[#FF00FF]/20 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#FF00FF]/10 rounded-lg">
                                <div className="w-6 h-6 bg-[#FF00FF] rounded"></div>
                            </div>
                            <div>
                                <p className="text-sm text-[#2E1A6B]">Quiz Interativos</p>
                                <p className="text-xl font-bold text-[#1A0F3D]">{templatesFunis.filter(t => t.segment === 'Quiz').length}</p>
                                <p className="text-xs text-[#FF00FF]">Engajamento</p>
                            </div>
                        </div>
                    </Card>
                </div>                {/* Barra de Pesquisa */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2E1A6B] w-4 h-4" />
                    <Input
                        type="text"
                        placeholder="Pesquisar templates por nome, descrição ou tags..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 border-[#4A2E9F]/30 focus:border-[#00BFFF] focus:ring-[#00BFFF]"
                    />
                    {searchTerm && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Badge variant="secondary" className="text-xs bg-[#4A2E9F]/10 text-[#1A0F3D] border-[#4A2E9F]/20">
                                {filteredTemplates.length} encontrados
                            </Badge>
                        </div>
                    )}
                </div>
            </div>

            {/* Filtros */}
            <div className="mb-8">
                <div className="flex flex-wrap gap-4 mb-4">
                    {/* Filtro por Segmento */}
                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-medium text-[#1A0F3D] flex items-center gap-2 mr-2">
                            <Filter className="w-4 h-4" />
                            Segmento:
                        </span>
                        {segments.map((segment) => (
                            <button
                                key={segment}
                                onClick={() => setSelectedSegment(segment)}
                                className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${selectedSegment === segment
                                    ? 'bg-[#4A2E9F] text-white shadow-lg'
                                    : 'bg-[#4A2E9F]/10 text-[#2E1A6B] hover:bg-[#4A2E9F]/20'
                                    }`}
                            >
                                {segment}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    {/* Filtro por Categoria */}
                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-medium text-[#1A0F3D] mr-2">Categoria:</span>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${selectedCategory === category
                                    ? 'bg-[#00BFFF] text-white shadow-lg'
                                    : 'bg-[#00BFFF]/10 text-[#2E1A6B] hover:bg-[#00BFFF]/20'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Filtro por Dificuldade */}
                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-medium text-[#1A0F3D] mr-2">Dificuldade:</span>
                        {difficulties.map((difficulty) => (
                            <button
                                key={difficulty}
                                onClick={() => setSelectedDifficulty(difficulty)}
                                className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${selectedDifficulty === difficulty
                                    ? 'bg-[#FF00FF] text-white shadow-lg'
                                    : 'bg-[#FF00FF]/10 text-[#2E1A6B] hover:bg-[#FF00FF]/20'
                                    }`}
                            >
                                {difficulty}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                    <Card key={template.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-lg">
                        {/* Preview Image */}
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={template.preview}
                                alt={template.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Overlay Actions */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="bg-white/90 hover:bg-white"
                                        onClick={() => handlePreviewTemplate(template.id)}
                                    >
                                        <Eye className="w-4 h-4 mr-1" />
                                        Preview
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="bg-gradient-to-r from-[#00BFFF] to-[#FF00FF] hover:from-[#FF00FF] hover:to-[#00BFFF] text-white"
                                        onClick={() => handleUseTemplate(template.id)}
                                    >
                                        <Copy className="w-4 h-4 mr-1" />
                                        Usar
                                    </Button>
                                </div>
                            </div>

                            {/* Segment Badge */}
                            <div className="absolute top-3 left-3">
                                <Badge
                                    variant="secondary"
                                    className={`
                                        ${template.segment === 'B2B' ? 'bg-[#4A2E9F]/20 text-[#1A0F3D] border-[#4A2E9F]/30' : ''}
                                        ${template.segment === 'Cliente Final' ? 'bg-[#00BFFF]/20 text-[#1A0F3D] border-[#00BFFF]/30' : ''}
                                        ${template.segment === 'Quiz' ? 'bg-[#FF00FF]/20 text-[#1A0F3D] border-[#FF00FF]/30' : ''}
                                    `}
                                >
                                    {template.segment}
                                </Badge>
                            </div>

                            {/* Difficulty Badge */}
                            <div className="absolute top-3 right-3">
                                <Badge variant="outline" className="bg-white/90 border-[#2E1A6B]/30 text-[#2E1A6B]">
                                    {template.difficulty}
                                </Badge>
                            </div>
                        </div>

                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <CardTitle className="text-lg font-bold text-[#1A0F3D] line-clamp-2">
                                    {template.name}
                                </CardTitle>
                                <div className="flex items-center gap-1 text-[#FF00FF] shrink-0">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="text-sm font-medium text-[#2E1A6B]">{template.rating}</span>
                                </div>
                            </div>
                            <CardDescription className="text-[#2E1A6B] line-clamp-3">
                                {template.description}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="pt-0">
                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 mb-4">
                                {template.tags.map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs border-[#4A2E9F]/30 text-[#2E1A6B]">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>

                            {/* Features */}
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-[#1A0F3D] mb-2">Principais recursos:</h4>
                                <ul className="text-xs text-[#2E1A6B] space-y-1">
                                    {template.features.slice(0, 3).map((feature, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                            <div className="w-1 h-1 bg-[#FF00FF] rounded-full"></div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Stats & Actions */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-xs text-[#2E1A6B]">
                                    <div className="flex items-center gap-1">
                                        <Download className="w-3 h-3" />
                                        {template.downloads.toLocaleString()}
                                    </div>
                                </div>

                                <div className="flex items-center gap-1">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 px-3 border-[#4A2E9F]/30 text-[#2E1A6B] hover:bg-[#4A2E9F]/10"
                                        onClick={() => handlePreviewTemplate(template.id)}
                                    >
                                        <Eye className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="h-8 px-3 bg-gradient-to-r from-[#00BFFF] to-[#FF00FF] hover:from-[#FF00FF] hover:to-[#00BFFF] text-white"
                                        onClick={() => handleUseTemplate(template.id)}
                                    >
                                        <Copy className="w-3 h-3 mr-1" />
                                        Usar
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                    <div className="max-w-md mx-auto">
                        <Search className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">
                            Nenhum template encontrado
                        </h3>
                        <p className="text-slate-600 mb-4">
                            Não conseguimos encontrar templates com os filtros selecionados.
                            Tente ajustar os critérios de busca.
                        </p>
                        <Button
                            variant="outline"
                            className="border-slate-300 text-slate-700 hover:bg-slate-50"
                            onClick={() => {
                                setSelectedSegment('Todos');
                                setSelectedCategory('Todos');
                                setSelectedDifficulty('Todos');
                                setSearchTerm('');
                            }}
                        >
                            Limpar Filtros
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TemplatesFunisPage;