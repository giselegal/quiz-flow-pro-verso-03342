/**
 * 🎯 TEMPLATES MARKETPLACE - FASE 2 IMPLEMENTAÇÃO  
 * 
 * Interface completa para Templates Engine com:
 * - Marketplace de templates
 * - Preview em tempo real
 * - Sistema de avaliação
 * - Categorização inteligente
 * - Busca e filtros avançados
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  LayoutTemplate, 
  Search, 
  Star, 
  Eye, 
  Download, 
  TrendingUp,
  Zap,
  Award,
  Clock,
  Users,
  Sparkles,
  Play
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'quiz' | 'survey' | 'lead-gen' | 'assessment' | 'onboarding';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  downloads: number;
  preview: string;
  tags: string[];
  author: string;
  createdAt: string;
  steps: number;
  estimatedTime: number;
  features: string[];
  thumbnail: string;
  isNew?: boolean;
  isTrending?: boolean;
  isPremium?: boolean;
}

// 🎯 MOCK DATA - Em produção, virá da API
const MOCK_TEMPLATES: Template[] = [
  {
    id: 'product-recommendation-quiz',
    name: 'Quiz de Recomendação de Produto',
    description: 'Template otimizado para descobrir qual produto é ideal para cada cliente',
    category: 'quiz',
    difficulty: 'beginner',
    rating: 4.8,
    downloads: 1250,
    preview: '/api/templates/product-quiz/preview',
    tags: ['e-commerce', 'produtos', 'ia', 'personalização'],
    author: 'Builder AI',
    createdAt: '2024-01-15',
    steps: 15,
    estimatedTime: 8,
    features: ['IA Personalizada', 'Scoring Automático', 'Analytics Integrado'],
    thumbnail: '/templates/product-quiz-thumb.jpg',
    isNew: true,
    isTrending: true
  },
  {
    id: 'lead-qualification-advanced',
    name: 'Qualificação de Lead Avançada',
    description: 'Funil inteligente para qualificar leads com alta precisão',
    category: 'lead-gen',
    difficulty: 'advanced',
    rating: 4.9,
    downloads: 890,
    preview: '/api/templates/lead-qual/preview',
    tags: ['marketing', 'leads', 'crm', 'automação'],
    author: 'MarketingPro',
    createdAt: '2024-01-10',
    steps: 21,
    estimatedTime: 12,
    features: ['CRM Integration', 'Lead Scoring', 'Automated Follow-up'],
    thumbnail: '/templates/lead-qual-thumb.jpg',
    isPremium: true,
    isTrending: true
  },
  {
    id: 'customer-satisfaction-survey',
    name: 'Pesquisa de Satisfação do Cliente',
    description: 'Template completo para medir satisfação e NPS',
    category: 'survey',
    difficulty: 'intermediate',
    rating: 4.6,
    downloads: 2100,
    preview: '/api/templates/satisfaction/preview',
    tags: ['satisfação', 'nps', 'feedback', 'clientes'],
    author: 'UX Research',
    createdAt: '2024-01-05',
    steps: 12,
    estimatedTime: 6,
    features: ['NPS Calculation', 'Sentiment Analysis', 'Export Reports'],
    thumbnail: '/templates/satisfaction-thumb.jpg'
  },
  {
    id: 'onboarding-assessment',
    name: 'Avaliação de Onboarding',
    description: 'Processo inteligente de onboarding com avaliação personalizada',
    category: 'onboarding',
    difficulty: 'intermediate',
    rating: 4.7,
    downloads: 750,
    preview: '/api/templates/onboarding/preview',
    tags: ['onboarding', 'rh', 'avaliação', 'integração'],
    author: 'HR Solutions',
    createdAt: '2024-01-01',
    steps: 18,
    estimatedTime: 15,
    features: ['Progress Tracking', 'Personalized Path', 'Manager Dashboard'],
    thumbnail: '/templates/onboarding-thumb.jpg',
    isNew: true
  }
];

const CATEGORIES = [
  { id: 'all', name: 'Todos', icon: LayoutTemplate },
  { id: 'quiz', name: 'Quiz', icon: Sparkles },
  { id: 'survey', name: 'Pesquisas', icon: TrendingUp },
  { id: 'lead-gen', name: 'Lead Gen', icon: Zap },
  { id: 'assessment', name: 'Avaliações', icon: Award },
  { id: 'onboarding', name: 'Onboarding', icon: Users }
];

interface TemplatesMarketplaceProps {
  onPreviewTemplate?: (template: Template) => void;
  onApplyTemplate?: (template: Template) => void;
  className?: string;
}

export const TemplatesMarketplace: React.FC<TemplatesMarketplaceProps> = ({
  onPreviewTemplate,
  onApplyTemplate,
  className = ''
}) => {
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('trending');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // 🎯 FILTROS E BUSCA
  const filteredTemplates = useMemo(() => {
    let filtered = MOCK_TEMPLATES;

    // Filtro por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    // Filtro por dificuldade
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(t => t.difficulty === difficultyFilter);
    }

    // Busca por texto
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Ordenação
    switch (sortBy) {
      case 'trending':
        return filtered.sort((a, b) => {
          if (a.isTrending && !b.isTrending) return -1;
          if (!a.isTrending && b.isTrending) return 1;
          return b.downloads - a.downloads;
        });
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'downloads':
        return filtered.sort((a, b) => b.downloads - a.downloads);
      case 'newest':
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      default:
        return filtered;
    }
  }, [searchQuery, selectedCategory, sortBy, difficultyFilter]);

  // 🎯 HANDLERS
  const handlePreviewTemplate = useCallback((template: Template) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
    onPreviewTemplate?.(template);
  }, [onPreviewTemplate]);

  const handleApplyTemplate = useCallback((template: Template) => {
    toast({
      title: "Template aplicado!",
      description: `"${template.name}" foi aplicado ao seu projeto`,
      variant: "default"
    });
    onApplyTemplate?.(template);
  }, [onApplyTemplate, toast]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTemplateCard = (template: Template) => (
    <Card key={template.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {template.isNew && (
              <Badge className="bg-green-100 text-green-800 text-xs">Novo</Badge>
            )}
            {template.isTrending && (
              <Badge className="bg-orange-100 text-orange-800 text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending
              </Badge>
            )}
            {template.isPremium && (
              <Badge className="bg-purple-100 text-purple-800 text-xs">
                <Award className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePreviewTemplate(template)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
        
        <CardTitle className="text-lg leading-tight">{template.name}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {template.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{template.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>{template.downloads.toLocaleString()}</span>
          </div>
          <Badge className={getDifficultyColor(template.difficulty)}>
            {template.difficulty}
          </Badge>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <LayoutTemplate className="h-4 w-4" />
              {template.steps} etapas
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {template.estimatedTime} min
            </span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {template.features.slice(0, 2).map(feature => (
              <Badge key={feature} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
            {template.features.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{template.features.length - 2}
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => handlePreviewTemplate(template)}
          >
            <Play className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => handleApplyTemplate(template)}
          >
            <Download className="h-4 w-4 mr-2" />
            Usar
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`templates-marketplace ${className}`}>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Templates Marketplace</h2>
            <p className="text-muted-foreground">
              Descubra templates otimizados para criar quizzes incríveis
            </p>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {filteredTemplates.length} templates
          </Badge>
        </div>

        {/* Filters & Search */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-6">
              {CATEGORIES.map(category => {
                const Icon = category.icon;
                return (
                  <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{category.name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>

          {/* Advanced Filters */}
          <div className="flex gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Ordenar por..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">Mais populares</SelectItem>
                <SelectItem value="rating">Melhor avaliados</SelectItem>
                <SelectItem value="downloads">Mais baixados</SelectItem>
                <SelectItem value="newest">Mais recentes</SelectItem>
              </SelectContent>
            </Select>

            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Dificuldade..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="beginner">Iniciante</SelectItem>
                <SelectItem value="intermediate">Intermediário</SelectItem>
                <SelectItem value="advanced">Avançado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(renderTemplateCard)}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <LayoutTemplate className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum template encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar seus filtros ou buscar por outros termos
            </p>
          </div>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LayoutTemplate className="h-5 w-5" />
              {selectedTemplate?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedTemplate?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedTemplate && (
            <div className="space-y-6">
              {/* Template Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{selectedTemplate.steps}</div>
                  <div className="text-sm text-muted-foreground">Etapas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{selectedTemplate.estimatedTime}</div>
                  <div className="text-sm text-muted-foreground">Minutos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{selectedTemplate.rating}</div>
                  <div className="text-sm text-muted-foreground">Avaliação</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{selectedTemplate.downloads}</div>
                  <div className="text-sm text-muted-foreground">Downloads</div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-semibold mb-3">Recursos inclusos:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedTemplate.features.map(feature => (
                    <div key={feature} className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="font-semibold mb-3">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsPreviewOpen(false)}
                >
                  Fechar
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    handleApplyTemplate(selectedTemplate);
                    setIsPreviewOpen(false);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Usar este Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};