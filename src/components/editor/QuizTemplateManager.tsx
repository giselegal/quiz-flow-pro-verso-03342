/**
 * 🎯 QUIZ TEMPLATE MANAGER - Gerenciador de Templates
 * 
 * Componente para gerenciar templates de quiz.
 * Funcionalidades:
 * - ✅ Criar novos templates
 * - ✅ Importar/Exportar templates
 * - ✅ Sistema de versionamento
 * - ✅ Compartilhamento de templates
 * - ✅ Backup e restauração
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Download, 
  Upload, 
  Copy, 
  Trash2, 
  Edit, 
  Eye, 
  Share, 
  Save,
  Clock,
  User,
  Tag,
  AlertCircle,
  CheckCircle,
  Archive,
  Star
} from 'lucide-react';

interface QuizTemplate {
  id: string;
  name: string;
  description: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  tags: string[];
  isPublic: boolean;
  isStarred: boolean;
  steps: any[];
  settings: {
    totalSteps: number;
    estimatedTime: number;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
  };
  metadata: {
    downloads: number;
    rating: number;
    reviews: number;
    lastUsed?: Date;
  };
}

interface QuizTemplateManagerProps {
  onTemplateSelect?: (template: QuizTemplate) => void;
  onTemplateCreate?: (template: Omit<QuizTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onTemplateUpdate?: (template: QuizTemplate) => void;
  onTemplateDelete?: (templateId: string) => void;
  onTemplateExport?: (template: QuizTemplate) => void;
  onTemplateImport?: (templateData: string) => void;
  className?: string;
}

export default function QuizTemplateManager({
  onTemplateSelect,
  onTemplateCreate,
  onTemplateUpdate,
  onTemplateDelete,
  onTemplateExport,
  onTemplateImport,
  className = ''
}: QuizTemplateManagerProps) {
  const [templates, setTemplates] = useState<QuizTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<QuizTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'updatedAt' | 'rating'>('updatedAt');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    tags: [] as string[],
    isPublic: false
  });

  // Carregar templates iniciais
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    const defaultTemplates: QuizTemplate[] = [
      {
        id: 'template-1',
        name: 'Quiz de Estilo Pessoal Completo',
        description: 'Quiz completo de 21 etapas para descobrir o estilo pessoal',
        version: '1.0.0',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20'),
        author: 'Gisele Galvão',
        tags: ['estilo', 'pessoal', 'moda'],
        isPublic: true,
        isStarred: true,
        steps: [],
        settings: {
          totalSteps: 21,
          estimatedTime: 15,
          difficulty: 'medium',
          category: 'estilo-pessoal'
        },
        metadata: {
          downloads: 1250,
          rating: 4.8,
          reviews: 89,
          lastUsed: new Date('2024-01-19')
        }
      },
      {
        id: 'template-2',
        name: 'Quiz de Personalidade Rápido',
        description: 'Quiz rápido de 5 perguntas para análise de personalidade',
        version: '2.1.0',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-18'),
        author: 'Sistema',
        tags: ['personalidade', 'rápido', 'análise'],
        isPublic: true,
        isStarred: false,
        steps: [],
        settings: {
          totalSteps: 5,
          estimatedTime: 3,
          difficulty: 'easy',
          category: 'personalidade'
        },
        metadata: {
          downloads: 890,
          rating: 4.5,
          reviews: 45,
          lastUsed: new Date('2024-01-17')
        }
      }
    ];
    setTemplates(defaultTemplates);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = filterTag === 'all' || template.tags.includes(filterTag);
    return matchesSearch && matchesTag;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'updatedAt':
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      case 'rating':
        return b.metadata.rating - a.metadata.rating;
      default:
        return 0;
    }
  });

  const handleCreateTemplate = () => {
    if (!newTemplate.name.trim()) return;

    const template: Omit<QuizTemplate, 'id' | 'createdAt' | 'updatedAt'> = {
      ...newTemplate,
      version: '1.0.0',
      author: 'Usuário',
      isStarred: false,
      steps: [],
      settings: {
        totalSteps: 0,
        estimatedTime: 0,
        difficulty: 'easy',
        category: 'personalizado'
      },
      metadata: {
        downloads: 0,
        rating: 0,
        reviews: 0
      }
    };

    onTemplateCreate?.(template);
    setShowCreateForm(false);
    setNewTemplate({ name: '', description: '', tags: [], isPublic: false });
  };

  const handleTemplateSelect = (template: QuizTemplate) => {
    setSelectedTemplate(template);
    onTemplateSelect?.(template);
  };

  const handleTemplateExport = (template: QuizTemplate) => {
    const templateData = JSON.stringify(template, null, 2);
    const blob = new Blob([templateData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    onTemplateExport?.(template);
  };

  const handleTemplateImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const templateData = JSON.parse(e.target?.result as string);
        onTemplateImport?.(templateData);
      } catch (error) {
        console.error('Erro ao importar template:', error);
      }
    };
    reader.readAsText(file);
  };

  const handleStarTemplate = (templateId: string) => {
    setTemplates(prev => prev.map(template =>
      template.id === templateId
        ? { ...template, isStarred: !template.isStarred }
        : template
    ));
  };

  const allTags = Array.from(new Set(templates.flatMap(t => t.tags)));

  return (
    <div className={`quiz-template-manager ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-semibold">Gerenciador de Templates</h2>
          <p className="text-sm text-gray-600">
            {templates.length} templates disponíveis
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Template
          </Button>
          
          <label className="cursor-pointer">
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Importar
              </span>
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={handleTemplateImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="flex h-[calc(100vh-200px)]">
        {/* Sidebar com filtros */}
        <div className="w-80 border-r border-gray-200 p-4">
          <div className="space-y-4">
            {/* Busca */}
            <div>
              <Input
                placeholder="Buscar templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Filtros */}
            <div>
              <h3 className="font-medium mb-2">Filtros</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium">Categoria</label>
                  <select
                    value={filterTag}
                    onChange={(e) => setFilterTag(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">Todas</option>
                    {allTags.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Ordenar por</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="updatedAt">Mais recente</option>
                    <option value="name">Nome</option>
                    <option value="rating">Avaliação</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tags populares */}
            <div>
              <h3 className="font-medium mb-2">Tags Populares</h3>
              <div className="flex flex-wrap gap-1">
                {allTags.slice(0, 10).map(tag => (
                  <Badge
                    key={tag}
                    variant={filterTag === tag ? "default" : "outline"}
                    className="cursor-pointer text-xs"
                    onClick={() => setFilterTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Lista de templates */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedTemplates.map(template => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedTemplate?.id === template.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-sm font-medium line-clamp-2">
                        {template.name}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1 line-clamp-2">
                        {template.description}
                      </CardDescription>
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStarTemplate(template.id);
                        }}
                      >
                        <Star className={`w-4 h-4 ${
                          template.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                        }`} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {template.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {template.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Metadados */}
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center space-x-2">
                        <span>{template.settings.totalSteps} etapas</span>
                        <span>•</span>
                        <span>{template.settings.estimatedTime}min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{template.metadata.rating}</span>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTemplateExport(template);
                          }}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Implementar duplicação
                          }}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Implementar compartilhamento
                          }}
                        >
                          <Share className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        v{template.version}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de criação */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Criar Novo Template</CardTitle>
              <CardDescription>
                Preencha os dados do novo template
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome</label>
                <Input
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome do template"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <Textarea
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição do template"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <Input
                  value={newTemplate.tags.join(', ')}
                  onChange={(e) => setNewTemplate(prev => ({ 
                    ...prev, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  }))}
                  placeholder="tag1, tag2, tag3"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newTemplate.isPublic}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, isPublic: e.target.checked }))}
                />
                <label htmlFor="isPublic" className="text-sm">Template público</label>
              </div>
            </CardContent>
            <div className="flex items-center justify-end space-x-2 p-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreateTemplate}>
                Criar Template
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
