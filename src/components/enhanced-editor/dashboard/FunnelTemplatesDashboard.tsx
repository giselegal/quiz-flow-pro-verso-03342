import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { funnelTemplateService, type FunnelTemplate } from '@/services/funnelTemplateService';
import {
  Copy,
  Download,
  Edit3,
  Eye,
  FileText,
  Gift,
  Heart,
  Palette,
  TrendingUp,
  Upload,
  Users,
  Zap,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface FunnelTemplatesDashboardProps {
  onSelectTemplate?: (templateId: string) => void;
  onImportTemplate?: () => void;
  onExportTemplate?: (templateId: string) => void;
  onCreateFromTemplate?: (templateId: string) => void;
}

// Template data organized by themes
const TEMPLATE_THEMES = {
  'quiz-style': {
    name: 'Quiz de Estilo',
    icon: Palette,
    color: '#E91E63',
    description: 'Templates para descoberta de estilo pessoal',
  },
  'lead-generation': {
    name: 'Geração de Leads',
    icon: Users,
    color: '#2196F3',
    description: 'Funis otimizados para captura de contatos',
  },
  'personality-test': {
    name: 'Teste de Personalidade',
    icon: Heart,
    color: '#9C27B0',
    description: 'Avaliações psicológicas e comportamentais',
  },
  'product-recommendation': {
    name: 'Recomendação de Produto',
    icon: TrendingUp,
    color: '#4CAF50',
    description: 'Guias para escolha de produtos',
  },
  assessment: {
    name: 'Avaliações',
    icon: FileText,
    color: '#FF9800',
    description: 'Testes de conhecimento e habilidades',
  },
  'offer-funnel': {
    name: 'Funil de Oferta',
    icon: Gift,
    color: '#F44336',
    description: 'Vendas e promoções direcionadas',
  },
};

const SAMPLE_TEMPLATES: FunnelTemplate[] = [
  {
    id: 'style-quiz-21-steps',
    name: 'Quiz de Estilo Completo (21 Etapas)',
    description: 'Funil completo para descoberta de estilo pessoal com todas as 21 etapas',
    category: 'quiz-style',
    theme: 'modern-chic',
    stepCount: 21,
    isOfficial: true,
    usageCount: 1247,
    tags: ['estilo', 'moda', 'personalidade', 'completo'],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop&auto=format',
    templateData: {},
    components: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lead-capture-simple',
    name: 'Captura de Lead Simples',
    description: 'Funil básico com 5 etapas para captura eficiente de leads',
    category: 'lead-generation',
    theme: 'business-clean',
    stepCount: 5,
    isOfficial: true,
    usageCount: 892,
    tags: ['leads', 'simples', 'conversão'],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop&auto=format',
    templateData: {},
    components: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'personality-assessment',
    name: 'Avaliação de Personalidade',
    description: 'Teste psicológico com 15 etapas para análise comportamental',
    category: 'personality-test',
    theme: 'wellness-soft',
    stepCount: 15,
    isOfficial: true,
    usageCount: 634,
    tags: ['personalidade', 'psicologia', 'comportamento'],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop&auto=format',
    templateData: {},
    components: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'product-matcher',
    name: 'Recomendador de Produto',
    description: 'Guia inteligente para recomendação personalizada de produtos',
    category: 'product-recommendation',
    theme: 'tech-modern',
    stepCount: 12,
    isOfficial: false,
    usageCount: 445,
    tags: ['produto', 'recomendação', 'vendas'],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop&auto=format',
    templateData: {},
    components: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'skill-assessment',
    name: 'Avaliação de Habilidades',
    description: 'Teste de competências profissionais com certificação',
    category: 'assessment',
    theme: 'corporate-blue',
    stepCount: 18,
    isOfficial: true,
    usageCount: 723,
    tags: ['habilidades', 'profissional', 'certificação'],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&auto=format',
    templateData: {},
    components: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sales-funnel-premium',
    name: 'Funil de Vendas Premium',
    description: 'Funil de alta conversão para produtos premium',
    category: 'offer-funnel',
    theme: 'luxury-gold',
    stepCount: 9,
    isOfficial: false,
    usageCount: 356,
    tags: ['vendas', 'premium', 'alta-conversão'],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=300&h=200&fit=crop&auto=format',
    templateData: {},
    components: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'wellness-assessment',
    name: 'Avaliação de Bem-estar',
    description: 'Quiz sobre hábitos saudáveis e estilo de vida',
    category: 'personality-test',
    theme: 'wellness-soft',
    stepCount: 10,
    isOfficial: true,
    usageCount: 567,
    tags: ['bem-estar', 'saúde', 'lifestyle'],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop&auto=format',
    templateData: {},
    components: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mini-lead-magnet',
    name: 'Mini Lead Magnet',
    description: 'Funil rápido de 3 etapas para captura express',
    category: 'lead-generation',
    theme: 'business-clean',
    stepCount: 3,
    isOfficial: true,
    usageCount: 1023,
    tags: ['rápido', 'magnet', 'express'],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop&auto=format',
    templateData: {},
    components: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'career-assessment',
    name: 'Orientação de Carreira',
    description: 'Teste para descobrir a carreira ideal',
    category: 'assessment',
    theme: 'corporate-blue',
    stepCount: 14,
    isOfficial: true,
    usageCount: 445,
    tags: ['carreira', 'profissional', 'orientação'],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&auto=format',
    templateData: {},
    components: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'luxury-product-finder',
    name: 'Localizador de Produtos Luxo',
    description: 'Recomendação de produtos de alta gama',
    category: 'product-recommendation',
    theme: 'luxury-gold',
    stepCount: 8,
    isOfficial: false,
    usageCount: 234,
    tags: ['luxo', 'premium', 'exclusivo'],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop&auto=format',
    templateData: {},
    components: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const FunnelTemplatesDashboard: React.FC<FunnelTemplatesDashboardProps> = ({
  onSelectTemplate,
  onImportTemplate,
  onExportTemplate,
  onCreateFromTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [templates, setTemplates] = useState<FunnelTemplate[]>(SAMPLE_TEMPLATES);
  const [isLoading, setIsLoading] = useState(false);

  // Load templates from the service
  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      try {
        const fetchedTemplates = await funnelTemplateService.getTemplates(selectedCategory);
        setTemplates(fetchedTemplates.length > 0 ? fetchedTemplates : SAMPLE_TEMPLATES);
      } catch (error) {
        console.error('Error loading templates:', error);
        setTemplates(SAMPLE_TEMPLATES); // Fallback to sample data
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, [selectedCategory]);

  const filteredTemplates =
    selectedCategory === 'all'
      ? templates
      : templates.filter(template => template.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    const theme = TEMPLATE_THEMES[category as keyof typeof TEMPLATE_THEMES];
    return theme ? theme.icon : FileText;
  };

  const getCategoryColor = (category: string) => {
    const theme = TEMPLATE_THEMES[category as keyof typeof TEMPLATE_THEMES];
    return theme ? theme.color : '#666';
  };

  return (
    <div className="p-6" style={{ backgroundColor: '#FAF9F7', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#432818' }}>
            Modelos de Funil
          </h1>
          <p style={{ color: '#6B4F43' }}>
            Escolha um modelo para começar ou crie seu próprio funil
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={onImportTemplate}
            variant="outline"
            className="border-[#B89B7A] text-[#6B4F43] hover:bg-[#B89B7A]/10"
          >
            <Upload className="w-4 h-4 mr-2" />
            Importar JSON
          </Button>
          <Button
            onClick={() => onCreateFromTemplate?.('new')}
            className="bg-[#B89B7A] hover:bg-[#A38A69]"
          >
            <Zap className="w-4 h-4 mr-2" />
            Criar Novo
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-[#B89B7A] mr-3" />
              <div>
                <p className="text-sm text-[#6B4F43]">Total Templates</p>
                <p className="text-2xl font-bold text-[#432818]">{templates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Badge className="w-8 h-8 bg-[#B89B7A] text-white mr-3 flex items-center justify-center">
                <span className="text-xs">★</span>
              </Badge>
              <div>
                <p className="text-sm text-[#6B4F43]">Oficiais</p>
                <p className="text-2xl font-bold text-[#432818]">
                  {templates.filter(t => t.isOfficial).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-[#6B4F43]">Mais Usado</p>
                <p className="text-lg font-bold text-[#432818]">
                  {Math.max(...templates.map(t => t.usageCount)).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Palette className="w-8 h-8 text-[#E91E63] mr-3" />
              <div>
                <p className="text-sm text-[#6B4F43]">Categorias</p>
                <p className="text-2xl font-bold text-[#432818]">
                  {Object.keys(TEMPLATE_THEMES).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#432818' }}>
          Categorias de Modelos
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
            className={`h-auto p-4 flex flex-col items-center space-y-2 ${
              selectedCategory === 'all'
                ? 'bg-[#B89B7A] hover:bg-[#A38A69]'
                : 'border-[#B89B7A] text-[#6B4F43] hover:bg-[#B89B7A]/10'
            }`}
          >
            <FileText className="w-6 h-6" />
            <span className="text-xs">Todos</span>
          </Button>

          {Object.entries(TEMPLATE_THEMES).map(([key, theme]) => {
            const IconComponent = theme.icon;
            return (
              <Button
                key={key}
                variant={selectedCategory === key ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(key)}
                className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                  selectedCategory === key
                    ? 'bg-[#B89B7A] hover:bg-[#A38A69]'
                    : 'border-[#B89B7A] text-[#6B4F43] hover:bg-[#B89B7A]/10'
                }`}
                style={selectedCategory === key ? {} : { borderColor: theme.color }}
              >
                <IconComponent
                  className="w-6 h-6"
                  style={{ color: selectedCategory === key ? 'white' : theme.color }}
                />
                <span className="text-xs text-center">{theme.name}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading
          ? // Loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-200 animate-pulse mb-3"></div>
                  <div className="flex space-x-2">
                    <div className="h-8 bg-gray-200 animate-pulse flex-1"></div>
                    <div className="h-8 w-8 bg-gray-200 animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          : filteredTemplates.map(template => {
              const CategoryIcon = getCategoryIcon(template.category);
              const categoryColor = getCategoryColor(template.category);

              return (
                <Card
                  key={template.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => onSelectTemplate?.(template.id)}
                >
                  {/* Template Image */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {template.thumbnailUrl ? (
                      <img
                        src={template.thumbnailUrl}
                        alt={template.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: `${categoryColor}20` }}
                      >
                        <CategoryIcon
                          className="w-16 h-16 opacity-60"
                          style={{ color: categoryColor }}
                        />
                      </div>
                    )}
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <div
                        className="flex items-center px-2 py-1 rounded-full text-xs font-medium text-white bg-black bg-opacity-60 backdrop-blur-sm"
                        style={{ backgroundColor: `${categoryColor}90` }}
                      >
                        <CategoryIcon className="w-3 h-3 mr-1" />
                        {TEMPLATE_THEMES[template.category as keyof typeof TEMPLATE_THEMES]?.name ||
                          template.category}
                      </div>
                    </div>
                    {/* Official Badge */}
                    <div className="absolute top-3 right-3">
                      {template.isOfficial && (
                        <Badge className="bg-[#B89B7A] text-white text-xs">Oficial</Badge>
                      )}
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-white/90 hover:bg-white"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-white/90 hover:bg-white"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm" style={{ color: '#432818' }}>
                        {template.name}
                      </h3>
                      <CategoryIcon
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: categoryColor }}
                      />
                    </div>

                    <p className="text-xs mb-3" style={{ color: '#6B4F43' }}>
                      {template.description}
                    </p>

                    <div
                      className="flex items-center justify-between text-xs mb-3"
                      style={{ color: '#8B7355' }}
                    >
                      <span>{template.stepCount} etapas</span>
                      <span>{template.usageCount} usos</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {template.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.tags.length - 2}
                        </Badge>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-[#B89B7A] hover:bg-[#A38A69] text-xs"
                        onClick={e => {
                          e.stopPropagation();
                          onCreateFromTemplate?.(template.id);
                        }}
                      >
                        Usar Modelo
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#B89B7A] text-[#6B4F43] hover:bg-[#B89B7A]/10"
                        onClick={e => {
                          e.stopPropagation();
                          onExportTemplate?.(template.id);
                        }}
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#B89B7A] text-[#6B4F43] hover:bg-[#B89B7A]/10"
                        onClick={e => {
                          e.stopPropagation();
                          onCreateFromTemplate?.(`copy-${template.id}`);
                        }}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: '#B89B7A' }} />
          <h3 className="text-lg font-semibold mb-2" style={{ color: '#432818' }}>
            Nenhum modelo encontrado
          </h3>
          <p style={{ color: '#6B4F43' }}>
            Tente selecionar uma categoria diferente ou importe um modelo JSON.
          </p>
        </div>
      )}
    </div>
  );
};

export default FunnelTemplatesDashboard;
