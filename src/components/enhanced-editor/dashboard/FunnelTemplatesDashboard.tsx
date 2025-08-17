import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Upload, 
  Eye, 
  Edit3, 
  Copy, 
  Palette,
  FileText,
  Heart,
  TrendingUp,
  Users,
  Gift,
  Zap
} from 'lucide-react';

interface FunnelTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  theme: string;
  thumbnailUrl?: string;
  stepCount: number;
  isOfficial: boolean;
  usageCount: number;
  tags: string[];
  previewUrl?: string;
}

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
    description: 'Templates para descoberta de estilo pessoal'
  },
  'lead-generation': {
    name: 'Geração de Leads',
    icon: Users,
    color: '#2196F3', 
    description: 'Funis otimizados para captura de contatos'
  },
  'personality-test': {
    name: 'Teste de Personalidade',
    icon: Heart,
    color: '#9C27B0',
    description: 'Avaliações psicológicas e comportamentais'
  },
  'product-recommendation': {
    name: 'Recomendação de Produto',
    icon: TrendingUp,
    color: '#4CAF50',
    description: 'Guias para escolha de produtos'
  },
  'assessment': {
    name: 'Avaliações',
    icon: FileText,
    color: '#FF9800',
    description: 'Testes de conhecimento e habilidades'
  },
  'offer-funnel': {
    name: 'Funil de Oferta',
    icon: Gift,
    color: '#F44336',
    description: 'Vendas e promoções direcionadas'
  }
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
    thumbnailUrl: '/api/placeholder/300/200'
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
    thumbnailUrl: '/api/placeholder/300/200'
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
    thumbnailUrl: '/api/placeholder/300/200'
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
    thumbnailUrl: '/api/placeholder/300/200'
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
    thumbnailUrl: '/api/placeholder/300/200'
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
    thumbnailUrl: '/api/placeholder/300/200'
  }
];

const FunnelTemplatesDashboard: React.FC<FunnelTemplatesDashboardProps> = ({
  onSelectTemplate,
  onImportTemplate,
  onExportTemplate,
  onCreateFromTemplate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [templates, setTemplates] = useState<FunnelTemplate[]>(SAMPLE_TEMPLATES);

  const filteredTemplates = selectedCategory === 'all' 
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
        {filteredTemplates.map(template => {
          const CategoryIcon = getCategoryIcon(template.category);
          const categoryColor = getCategoryColor(template.category);
          
          return (
            <Card 
              key={template.id} 
              className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => onSelectTemplate?.(template.id)}
            >
              {/* Template Image */}
              <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200">
                {template.thumbnailUrl ? (
                  <img 
                    src={template.thumbnailUrl} 
                    alt={template.name}
                    className="w-full h-full object-cover"
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
                <div className="absolute top-3 right-3">
                  {template.isOfficial && (
                    <Badge className="bg-[#B89B7A] text-white">
                      Oficial
                    </Badge>
                  )}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="secondary">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary">
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

                <div className="flex items-center justify-between text-xs mb-3" style={{ color: '#8B7355' }}>
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
                    onClick={(e) => {
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
                    onClick={(e) => {
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
                    onClick={(e) => {
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