// =============================================================================
// COMPONENTE SELETOR DE TEMPLATES
// Interface para navegar e selecionar templates de quiz
// =============================================================================

import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, Star, Users, Tag } from 'lucide-react';

interface QuizTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  thumbnail: string;
  template_data: {
    title: string;
    description: string;
    questions: any[];
    settings: any;
  };
  tags: string[];
  usage_count: number;
  is_public: boolean;
  created_at: string;
}

interface TemplateSelectorProps {
  onSelectTemplate: (template: QuizTemplate) => void;
  onClose: () => void;
}

// Templates de exemplo para demonstração
const mockTemplates: QuizTemplate[] = [
  {
    id: '1',
    name: "Quiz de Personalidade - Estilo de Vida",
    description: "Descubra seu estilo de vida ideal com perguntas personalizadas",
    category: "personalidade",
    difficulty: "easy",
    estimatedTime: 5,
    thumbnail: "/templates/lifestyle-quiz.jpg",
    template_data: {
      title: "Descubra Seu Estilo de Vida",
      description: "Um quiz personalizado para descobrir qual estilo de vida combina mais com você",
      questions: [
        {
          question_text: "Qual ambiente você prefere para relaxar?",
          question_type: "multiple_choice",
          options: [
            { text: "Casa aconchegante", value: "home" },
            { text: "Natureza ao ar livre", value: "nature" },
            { text: "Café urbano", value: "urban" },
            { text: "Biblioteca silenciosa", value: "library" }
          ],
          correct_answers: [],
          points: 1
        }
      ],
      settings: {
        allowRetake: true,
        showResults: true,
        shuffleQuestions: false,
        showProgressBar: true,
        passingScore: 0
      }
    },
    tags: ["personalidade", "estilo", "vida"],
    usage_count: 150,
    is_public: true,
    created_at: "2025-01-01"
  },
  {
    id: '2',
    name: "Quiz de Conhecimentos Gerais",
    description: "Teste seus conhecimentos em diversas áreas",
    category: "educacao",
    difficulty: "medium",
    estimatedTime: 8,
    thumbnail: "/templates/general-knowledge.jpg",
    template_data: {
      title: "Quiz de Conhecimentos Gerais",
      description: "Teste seus conhecimentos em história, ciência, geografia e mais",
      questions: [
        {
          question_text: "Qual é a capital da Austrália?",
          question_type: "multiple_choice",
          options: [
            { text: "Sydney", value: "sydney" },
            { text: "Melbourne", value: "melbourne" },
            { text: "Canberra", value: "canberra" },
            { text: "Brisbane", value: "brisbane" }
          ],
          correct_answers: ["canberra"],
          points: 1
        }
      ],
      settings: {
        allowRetake: true,
        showResults: true,
        shuffleQuestions: true,
        showProgressBar: true,
        passingScore: 70
      }
    },
    tags: ["educacao", "conhecimento", "geral"],
    usage_count: 89,
    is_public: true,
    created_at: "2025-01-02"
  },
  {
    id: '3',
    name: "Quiz de Avaliação de Produto",
    description: "Colete feedback dos clientes sobre seus produtos",
    category: "business",
    difficulty: "easy",
    estimatedTime: 3,
    thumbnail: "/templates/product-feedback.jpg",
    template_data: {
      title: "Avaliação do Produto",
      description: "Nos ajude a melhorar nosso produto com seu feedback",
      questions: [
        {
          question_text: "Como você avalia nosso produto de 1 a 5?",
          question_type: "multiple_choice",
          options: [
            { text: "⭐ 1 - Muito ruim", value: "1" },
            { text: "⭐⭐ 2 - Ruim", value: "2" },
            { text: "⭐⭐⭐ 3 - Regular", value: "3" },
            { text: "⭐⭐⭐⭐ 4 - Bom", value: "4" },
            { text: "⭐⭐⭐⭐⭐ 5 - Excelente", value: "5" }
          ],
          correct_answers: [],
          points: 1
        }
      ],
      settings: {
        allowRetake: false,
        showResults: false,
        shuffleQuestions: false,
        showProgressBar: true,
        passingScore: 0
      }
    },
    tags: ["business", "feedback", "produto"],
    usage_count: 203,
    is_public: true,
    created_at: "2025-01-03"
  }
];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onSelectTemplate,
  onClose
}) => {
  const [templates, setTemplates] = useState<QuizTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<QuizTemplate[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [popularTags, setPopularTags] = useState<{ tag: string; count: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Carregar dados mockados
  useEffect(() => {
    setTemplates(mockTemplates);
    setFilteredTemplates(mockTemplates);
    
    const uniqueCategories = [...new Set(mockTemplates.map(t => t.category))];
    setCategories(uniqueCategories);
    
    const allTags = mockTemplates.flatMap(t => t.tags);
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const popularTagsList = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));
    
    setPopularTags(popularTagsList);
  }, []);

  // Filtrar templates quando filtros mudarem
  useEffect(() => {
    filterTemplates();
  }, [templates, searchTerm, selectedCategory, selectedDifficulty, selectedTags]);

  const filterTemplates = () => {
    let filtered = templates;

    // Filtrar por busca
    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtrar por categoria
    if (selectedCategory) {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // Filtrar por dificuldade
    if (selectedDifficulty) {
      filtered = filtered.filter(template => template.difficulty === selectedDifficulty);
    }

    // Filtrar por tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(template =>
        selectedTags.every(tag => template.tags.includes(tag))
      );
    }

    setFilteredTemplates(filtered);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedDifficulty('');
    setSelectedTags([]);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Médio';
      case 'hard': return 'Difícil';
      default: return difficulty;
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Carregando templates...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full h-5/6 mx-4 flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Escolher Template</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          
          {/* Barra de busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          
          {/* Sidebar de filtros */}
          <div className="w-80 bg-gray-50 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </h3>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Limpar
              </button>
            </div>

            {/* Categoria */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Dificuldade */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dificuldade
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas as dificuldades</option>
                <option value="easy">Fácil</option>
                <option value="medium">Médio</option>
                <option value="hard">Difícil</option>
              </select>
            </div>

            {/* Tags populares */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags Populares
              </label>
              <div className="flex flex-wrap gap-2">
                {popularTags.map(({ tag, count }) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <Tag className="w-3 h-3 inline mr-1" />
                    {tag}
                    <span className="ml-1 text-xs opacity-75">({count})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lista de templates */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="mb-4 text-sm text-gray-600">
              {filteredTemplates.length} template(s) encontrado(s)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  onClick={() => onSelectTemplate(template)}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  {/* Thumbnail placeholder */}
                  <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-4xl">🎯</span>
                  </div>

                  {/* Título e descrição */}
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {template.description}
                  </p>

                  {/* Metadados */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                        {getDifficultyLabel(template.difficulty)}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {template.estimatedTime}min
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-1" />
                        {template.usage_count} usos
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="w-4 h-4 mr-1" />
                        {template.template_data.questions.length} perguntas
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {template.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{template.tags.length - 3} mais
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum template encontrado
                </h3>
                <p className="text-gray-600">
                  Tente ajustar os filtros ou termos de busca
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
