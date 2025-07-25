// =============================================================================
// SISTEMA DE TEMPLATES DE QUIZ
// Sistema de Quiz Quest Challenge Verse
// =============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Star,
  Copy,
  Eye,
  Download,
  Upload,
  Plus,
  Bookmark,
  Users,
  Clock,
  Tag,
  Grid,
  List,
  Heart,
  Share2
} from 'lucide-react';

// =============================================================================
// INTERFACES
// =============================================================================

interface QuizTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail?: string;
  questionCount: number;
  estimatedTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  usageCount: number;
  rating: number;
  reviews: number;
  isPublic: boolean;
  isFavorite: boolean;
  isPremium: boolean;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  templateData: {
    quiz: any;
    questions: any[];
    settings: any;
  };
}

interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  templateCount: number;
}

interface TemplateLibraryProps {
  onSelectTemplate: (template: QuizTemplate) => void;
  onCreateFromTemplate: (template: QuizTemplate) => void;
}

// =============================================================================
// CATEGORIAS DE TEMPLATE
// =============================================================================

const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: 'education',
    name: 'Educação',
    description: 'Templates educacionais e acadêmicos',
    icon: '📚',
    color: '#3B82F6',
    templateCount: 24
  },
  {
    id: 'business',
    name: 'Negócios',
    description: 'Avaliações corporativas e treinamentos',
    icon: '💼',
    color: '#10B981',
    templateCount: 18
  },
  {
    id: 'entertainment',
    name: 'Entretenimento',
    description: 'Quizzes divertidos e interativos',
    icon: '🎮',
    color: '#F59E0B',
    templateCount: 32
  },
  {
    id: 'assessment',
    name: 'Avaliação',
    description: 'Testes de conhecimento e habilidades',
    icon: '📊',
    color: '#EF4444',
    templateCount: 15
  },
  {
    id: 'survey',
    name: 'Pesquisa',
    description: 'Formulários e questionários',
    icon: '📋',
    color: '#8B5CF6',
    templateCount: 12
  },
  {
    id: 'onboarding',
    name: 'Onboarding',
    description: 'Integração de novos usuários',
    icon: '🚀',
    color: '#06B6D4',
    templateCount: 8
  }
];

// =============================================================================
// TEMPLATES MOCK
// =============================================================================

const MOCK_TEMPLATES: QuizTemplate[] = [
  {
    id: '1',
    name: 'Quiz de Geografia Mundial',
    description: 'Teste seus conhecimentos sobre países, capitais e curiosidades geográficas',
    category: 'education',
    tags: ['geografia', 'educação', 'mundo'],
    questionCount: 15,
    estimatedTime: 10,
    difficulty: 'medium',
    usageCount: 1247,
    rating: 4.8,
    reviews: 89,
    isPublic: true,
    isFavorite: false,
    isPremium: false,
    author: {
      id: '1',
      name: 'Prof. Maria Silva',
      avatar: '👩‍🏫'
    },
    createdAt: '2025-01-15',
    updatedAt: '2025-07-20',
    templateData: {
      quiz: { title: 'Quiz de Geografia Mundial' },
      questions: [],
      settings: {}
    }
  },
  {
    id: '2',
    name: 'Avaliação de Satisfação do Cliente',
    description: 'Template completo para medir satisfação e feedback dos clientes',
    category: 'business',
    tags: ['negócios', 'satisfação', 'feedback'],
    questionCount: 12,
    estimatedTime: 7,
    difficulty: 'easy',
    usageCount: 892,
    rating: 4.6,
    reviews: 56,
    isPublic: true,
    isFavorite: true,
    isPremium: true,
    author: {
      id: '2',
      name: 'João Marketing',
      avatar: '👨‍💼'
    },
    createdAt: '2025-02-20',
    updatedAt: '2025-07-18',
    templateData: {
      quiz: { title: 'Avaliação de Satisfação' },
      questions: [],
      settings: {}
    }
  },
  {
    id: '3',
    name: 'Quiz Divertido: Qual Animal Você É?',
    description: 'Quiz de personalidade divertido para descobrir qual animal combina com você',
    category: 'entertainment',
    tags: ['personalidade', 'diversão', 'animais'],
    questionCount: 8,
    estimatedTime: 5,
    difficulty: 'easy',
    usageCount: 2156,
    rating: 4.9,
    reviews: 234,
    isPublic: true,
    isFavorite: false,
    isPremium: false,
    author: {
      id: '3',
      name: 'Ana Criativa',
      avatar: '🎨'
    },
    createdAt: '2025-03-10',
    updatedAt: '2025-07-22',
    templateData: {
      quiz: { title: 'Qual Animal Você É?' },
      questions: [],
      settings: {}
    }
  }
];

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  onSelectTemplate,
  onCreateFromTemplate
}) => {
  const [templates, setTemplates] = useState<QuizTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<QuizTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'rating'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // =============================================================================
  // EFEITOS
  // =============================================================================

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, selectedCategory, searchQuery, sortBy]);

  // =============================================================================
  // FUNÇÕES
  // =============================================================================

  const loadTemplates = async () => {
    setLoading(true);
    try {
      // TODO: Implementar chamada real para API
      // Simulando delay de carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTemplates(MOCK_TEMPLATES);
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = [...templates];

    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // Filtrar por busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.usageCount - a.usageCount;
        case 'recent':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setFilteredTemplates(filtered);
  };

  const toggleFavorite = async (templateId: string) => {
    try {
      // TODO: Implementar API call
      setTemplates(prev => prev.map(template =>
        template.id === templateId
          ? { ...template, isFavorite: !template.isFavorite }
          : template
      ));
    } catch (error) {
      console.error('Erro ao favoritar template:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // =============================================================================
  // RENDERIZAÇÃO DE COMPONENTES
  // =============================================================================

  const renderTemplateCard = (template: QuizTemplate) => (
    <div key={template.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      {/* Header do Card */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-gray-900 truncate">{template.name}</h3>
              {template.isPremium && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Premium
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {template.description}
            </p>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{template.estimatedTime} min</span>
              </span>
              <span className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{template.questionCount} perguntas</span>
              </span>
              <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(template.difficulty)}`}>
                {template.difficulty === 'easy' ? 'Fácil' :
                 template.difficulty === 'medium' ? 'Médio' : 'Difícil'}
              </span>
            </div>
          </div>
          
          <button
            onClick={() => toggleFavorite(template.id)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Heart 
              className={`w-4 h-4 ${
                template.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'
              }`} 
            />
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="px-4 py-2 border-b border-gray-100">
        <div className="flex flex-wrap gap-1">
          {template.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
            >
              #{tag}
            </span>
          ))}
          {template.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded">
              +{template.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm">{template.author.avatar}</span>
            <span className="text-sm text-gray-600">{template.author.name}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{template.rating}</span>
            <span className="text-xs text-gray-500">({template.reviews})</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onSelectTemplate(template)}
            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            <Eye className="w-4 h-4 inline mr-1" />
            Visualizar
          </button>
          
          <button
            onClick={() => onCreateFromTemplate(template)}
            className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
          >
            <Copy className="w-4 h-4 inline mr-1" />
            Usar Template
          </button>
        </div>
      </div>
    </div>
  );

  const renderTemplateRow = (template: QuizTemplate) => (
    <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-gray-900">{template.name}</h3>
              {template.isPremium && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Premium
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-2">{template.description}</p>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>{template.author.name}</span>
              <span>{template.questionCount} perguntas</span>
              <span>{template.estimatedTime} min</span>
              <span className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span>{template.rating}</span>
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => toggleFavorite(template.id)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <Heart 
              className={`w-4 h-4 ${
                template.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'
              }`} 
            />
          </button>
          
          <button
            onClick={() => onSelectTemplate(template)}
            className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Visualizar
          </button>
          
          <button
            onClick={() => onCreateFromTemplate(template)}
            className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
          >
            Usar
          </button>
        </div>
      </div>
    </div>
  );

  // =============================================================================
  // LOADING STATE
  // =============================================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando templates...</p>
        </div>
      </div>
    );
  }

  // =============================================================================
  // RENDERIZAÇÃO PRINCIPAL
  // =============================================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Biblioteca de Templates</h2>
          <p className="text-gray-600">Escolha um template para começar rapidamente</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            <Upload className="w-4 h-4" />
            <span>Importar</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            <span>Criar Template</span>
          </button>
        </div>
      </div>

      {/* Categorias */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`p-4 rounded-lg border text-center hover:shadow-sm transition-shadow ${
            selectedCategory === 'all' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}
        >
          <div className="text-2xl mb-2">📁</div>
          <div className="font-medium text-sm">Todos</div>
          <div className="text-xs text-gray-500">{templates.length} templates</div>
        </button>
        
        {TEMPLATE_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`p-4 rounded-lg border text-center hover:shadow-sm transition-shadow ${
              selectedCategory === category.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <div className="text-2xl mb-2">{category.icon}</div>
            <div className="font-medium text-sm">{category.name}</div>
            <div className="text-xs text-gray-500">{category.templateCount} templates</div>
          </button>
        ))}
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="popular">Mais Populares</option>
          <option value="recent">Mais Recentes</option>
          <option value="rating">Melhor Avaliados</option>
        </select>
        
        <div className="flex border border-gray-300 rounded-md">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Lista de Templates */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum template encontrado</h3>
          <p className="text-gray-500">Tente ajustar os filtros ou buscar por outros termos.</p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }>
          {filteredTemplates.map(template =>
            viewMode === 'grid' ? renderTemplateCard(template) : renderTemplateRow(template)
          )}
        </div>
      )}
    </div>
  );
};

export default TemplateLibrary;
