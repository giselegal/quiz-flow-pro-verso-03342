// @ts-nocheck
/**
 * 🎨 PÁGINA DE TEMPLATES - FASE 3
 * Galeria e gerenciamento de templates de funis
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Layout,
  Plus,
  Search,
  Download,
  Upload,
  Eye,
  Copy,
  Star,
  Filter,
  Grid,
  List,
  Palette,
  Zap,
  Target,
  Users,
  TrendingUp,
  Calendar,
  Settings
} from 'lucide-react';

// Mock service for compatibility
const MockDataService = {
  getRealTimeMetrics: () => Promise.resolve({}),
  getTemplates: () => Promise.resolve([]),
  createTemplate: () => Promise.resolve({}),
  duplicateTemplate: () => Promise.resolve({})
};

export const TemplatesPage: React.FC = () => {
  // Estados
  const [isLoading, setIsLoading] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  useEffect(() => {
    const loadRealData = async () => {
      try {
        const metrics = await MockDataService.getRealTimeMetrics();
        console.log('✅ TemplatesPage carregado com dados reais:', metrics);
      } catch (error) {
        console.error('❌ Erro ao carregar dados reais:', error);
      }
    };
    
    loadRealData();
  }, []);

  // Mock templates
  const templateData = [
    {
      id: 'template-001',
      name: 'Quiz de Estilo Pessoal',
      description: 'Template completo para descoberta de estilo pessoal com 21 perguntas',
      category: 'quiz',
      thumbnail: '/images/templates/quiz-style.jpg',
      isOfficial: true,
      rating: 4.8,
      usageCount: 1247,
      conversionRate: 18.5,
      createdAt: '2024-01-10',
      author: 'Equipe Oficial',
      tags: ['estilo', 'personalidade', 'quiz'],
      blocks: 21,
      difficulty: 'Fácil'
    },
    {
      id: 'template-002',
      name: 'Lead Magnet Moderno',
      description: 'Captura de leads com design moderno e alta conversão',
      category: 'lead-magnet',
      thumbnail: '/images/templates/lead-magnet.jpg',
      isOfficial: true,
      rating: 4.6,
      usageCount: 890,
      conversionRate: 22.1,
      createdAt: '2024-01-08',
      author: 'Equipe Oficial',
      tags: ['leads', 'conversão', 'moderno'],
      blocks: 8,
      difficulty: 'Fácil'
    },
    {
      id: 'template-003',
      name: 'Funil de Webinar',
      description: 'Template completo para inscrições e acompanhamento de webinar',
      category: 'webinar',
      thumbnail: '/images/templates/webinar.jpg',
      isOfficial: false,
      rating: 4.4,
      usageCount: 567,
      conversionRate: 15.3,
      createdAt: '2024-01-05',
      author: 'Marketing Pro',
      tags: ['webinar', 'educação', 'vendas'],
      blocks: 15,
      difficulty: 'Médio'
    },
    {
      id: 'template-004',
      name: 'Calculadora de ROI',
      description: 'Ferramenta interativa para cálculo de retorno sobre investimento',
      category: 'calculator',
      thumbnail: '/images/templates/calculator.jpg',
      isOfficial: false,
      rating: 4.2,
      usageCount: 345,
      conversionRate: 25.8,
      createdAt: '2024-01-03',
      author: 'Tech Solutions',
      tags: ['calculadora', 'roi', 'finanças'],
      blocks: 12,
      difficulty: 'Avançado'
    }
  ];

  const filteredTemplates = templateData.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', name: 'Todos', count: templateData.length },
    { id: 'quiz', name: 'Quiz', count: templateData.filter(t => t.category === 'quiz').length },
    { id: 'lead-magnet', name: 'Lead Magnet', count: templateData.filter(t => t.category === 'lead-magnet').length },
    { id: 'webinar', name: 'Webinar', count: templateData.filter(t => t.category === 'webinar').length },
    { id: 'calculator', name: 'Calculadora', count: templateData.filter(t => t.category === 'calculator').length }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Biblioteca de Templates</h1>
        <div className="flex items-center space-x-2">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Novo Template
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates Disponíveis</CardTitle>
            <Layout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{templateData.length}</div>
            <p className="text-xs text-muted-foreground">
              {templateData.filter(t => t.isOfficial).length} oficiais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mais Usado</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Quiz Style</div>
            <p className="text-xs text-muted-foreground">
              1,247 implementações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Melhor Conversão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">25.8%</div>
            <p className="text-xs text-muted-foreground">
              Calculadora ROI
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Criados Este Mês</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">8</div>
            <p className="text-xs text-muted-foreground">
              +60% vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-1 border rounded-lg p-1">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="relative"
              >
                {category.name}
                <Badge 
                  variant="secondary" 
                  className="ml-2 text-xs"
                >
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          
          <div className="flex border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Templates Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <Layout className="w-16 h-16 text-blue-400" />
              </div>
              
              {template.isOfficial && (
                <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">
                  Oficial
                </Badge>
              )}
              
              <div className="absolute top-2 right-2 flex items-center space-x-1 bg-black/50 text-white px-2 py-1 rounded text-xs">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                {template.rating}
              </div>
            </div>
            
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <Badge 
                  variant="outline"
                  className={
                    template.difficulty === 'Fácil' ? 'border-green-200 text-green-700' :
                    template.difficulty === 'Médio' ? 'border-yellow-200 text-yellow-700' :
                    'border-red-200 text-red-700'
                  }
                >
                  {template.difficulty}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {template.description}
              </p>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {template.usageCount} usos
                  </span>
                  <span className="flex items-center">
                    <Target className="w-4 h-4 mr-1" />
                    {template.conversionRate}% conversão
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{template.blocks} blocos</span>
                  <span>Por {template.author}</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {template.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Button className="flex-1" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Usar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="w-4 h-4" />
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
          <Layout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum template encontrado
          </h3>
          <p className="text-gray-500 mb-4">
            Tente ajustar seus filtros ou criar um novo template.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Criar Novo Template
          </Button>
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;