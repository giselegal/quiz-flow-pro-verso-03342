/**
 * 🎨 PÁGINA DE TEMPLATES (Dados Reais)
 * Usa TemplateRegistry (oficiais) + useMyTemplates (customizados)
 */

import React, { useState, useMemo } from 'react';
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
  Target,
  Users,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { TemplateRegistry } from '@/config/unifiedTemplatesRegistry';
import useMyTemplates from '@/hooks/useMyTemplates';

export const TemplatesPage: React.FC = () => {
  const { templates: userTemplates, templatesCount: userTemplatesCount } = useMyTemplates();
  const officialTemplates = useMemo(() => TemplateRegistry.getAll(), []);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Unir oficiais e customizados (prefixando IDs customizados para evitar colisão)
  const merged = useMemo(() => {
    return [
      ...officialTemplates.map(t => ({
        source: 'official' as const,
        id: t.id,
        name: t.name,
        description: t.description,
        category: t.category,
        isOfficial: t.isOfficial,
        usageCount: t.usageCount,
        conversionRate: t.conversionRate,
        tags: t.tags,
        blocks: t.stepCount,
        difficulty: t.stepCount <= 8 ? 'Fácil' : t.stepCount <= 15 ? 'Médio' : 'Avançado',
        author: 'Oficial',
      })),
      ...userTemplates.map(t => ({
        source: 'custom' as const,
        id: `custom-${t.id}`,
        name: t.name,
        description: t.description,
        category: t.category || 'custom',
        isOfficial: false,
        usageCount: t.usageCount,
        conversionRate: '—',
        tags: t.tags || [],
        blocks: t.stepCount,
        difficulty: t.stepCount <= 8 ? 'Fácil' : t.stepCount <= 15 ? 'Médio' : 'Avançado',
        author: 'Meu Template'
      }))
    ];
  }, [officialTemplates, userTemplates]);

  const filteredTemplates = merged.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categorySet = new Set(merged.map(t => t.category));
  const categories = [
    { id: 'all', name: 'Todos', count: merged.length },
    ...Array.from(categorySet).map(cat => ({ id: cat, name: cat, count: merged.filter(t => t.category === cat).length }))
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
            <div className="text-2xl font-bold text-blue-600">{merged.length}</div>
            <p className="text-xs text-muted-foreground">
              {officialTemplates.filter(t => t.isOfficial).length} oficiais · {userTemplatesCount} custom
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mais Usado</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{officialTemplates[0]?.name || '—'}</div>
            <p className="text-xs text-muted-foreground">
              {officialTemplates[0]?.usageCount || 0} implementações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Melhor Conversão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{
              (() => {
                const convTemplate = [...officialTemplates].sort((a, b) => parseFloat(b.conversionRate) - parseFloat(a.conversionRate))[0];
                return convTemplate ? convTemplate.conversionRate : '—';
              })()
            }</div>
            <p className="text-xs text-muted-foreground">
              Melhor Conversão
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Criados Este Mês</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{userTemplatesCount}</div>
            <p className="text-xs text-muted-foreground">
              Templates criados por você
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