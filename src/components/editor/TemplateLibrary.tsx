import { TemplateInitializer } from '@/components/templates/TemplateInitializer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import templateService, { UITemplate } from '@/services/templateService';
import { Crown, Download, Eye, Search, Sparkles, Star } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const TemplateLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [templates, setTemplates] = useState<UITemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInitializer, setShowInitializer] = useState(false);
  const [error, setError] = useState<string>('');

  // Carregar templates ao montar o componente
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Carregando templates...');
      const data = await templateService.getTemplates();

      if (data.length === 0) {
        setShowInitializer(true);
        setError('Nenhum template encontrado. Use o inicializador para popular o banco de dados.');
      } else {
        setTemplates(data);
        setShowInitializer(false);
        console.log(`✅ ${data.length} templates carregados`);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar templates:', error);
      setError('Erro ao carregar templates. Verifique a conexão com o banco de dados.');
      setShowInitializer(true);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch =
      searchTerm === '' ||
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', name: 'Todos', count: filteredTemplates.length },
    {
      id: 'quiz',
      name: 'Quiz',
      count: filteredTemplates.filter(t => t.category === 'quiz').length,
    },
    {
      id: 'funnel',
      name: 'Funil',
      count: filteredTemplates.filter(t => t.category === 'funnel').length,
    },
    {
      id: 'landing',
      name: 'Landing',
      count: filteredTemplates.filter(t => t.category === 'landing').length,
    },
    {
      id: 'survey',
      name: 'Pesquisa',
      count: filteredTemplates.filter(t => t.category === 'survey').length,
    },
  ];

  const handleUseTemplate = async (template: UITemplate) => {
    try {
      // Incrementar contador de uso
      await templateService.incrementUsage(template.id);

      // TODO: Implementar carregamento do template no editor
      console.log('🎯 Carregando template:', template.name);
      console.log('📋 Template data:', template.templateData);

      // Simular feedback para o usuário
      alert(`Template "${template.name}" carregado com sucesso!`);
    } catch (error) {
      console.error('Erro ao usar template:', error);
    }
  };

  const getDifficultyColor = (difficulty: UITemplate['difficulty']) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
    <div className="h-full flex items-center justify-center">
        <div className="text-center">
      <div className="rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Biblioteca de Templates</h2>
          <Badge variant="secondary" className="ml-2">
            {templates.length} disponíveis
          </Badge>
        </div>
        <Button variant="outline" onClick={() => setShowInitializer(!showInitializer)}>
          {showInitializer ? 'Ocultar Inicializador' : 'Inicializador'}
        </Button>
      </div>

      {/* Inicializador de Templates */}
      {showInitializer && (
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <TemplateInitializer />
          <Button
            onClick={() => {
              setShowInitializer(false);
              loadTemplates();
            }}
            className="mt-4"
            variant="outline"
          >
            Recarregar Templates
          </Button>
        </div>
      )}

      {/* Erro */}
      {error && !showInitializer && (
        <div className="mx-6 mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Busca e Filtros */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Campo de busca */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar templates..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtro de categorias */}
          <div className="flex gap-2 overflow-x-auto">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Templates */}
      <div className="flex-1 overflow-auto p-6">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum template encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou buscar por outros termos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <Card key={template.id} className="group">
                <CardHeader className="p-0">
                  <div className="relative">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {template.isPremium && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      </div>
                    )}
                    <Badge
                      className={`absolute top-3 left-3 ${getDifficultyColor(template.difficulty)}`}
                    >
                      {template.difficulty === 'beginner' && 'Iniciante'}
                      {template.difficulty === 'intermediate' && 'Intermediário'}
                      {template.difficulty === 'advanced' && 'Avançado'}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <CardTitle className="text-lg mb-1">{template.name}</CardTitle>
                      <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>por {template.author}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{template.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          <span>{template.downloads}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          <span>{template.components} componentes</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {template.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {template.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        // onClick={() => handlePreviewTemplate(template)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Visualizar
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleUseTemplate(template)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Usar Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
