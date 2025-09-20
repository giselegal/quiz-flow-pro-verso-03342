/**
 * 🧩 REUSABLE COMPONENTS PANEL
 * 
 * Painel lateral que exibe componentes reutilizáveis categorizados
 * Permite drag & drop, preview e aplicação no editor atual
 */

import React, { useState, useEffect } from 'react';
import { useEditorReusableComponentsSimple } from '@/hooks/useEditorReusableComponents.simple';

interface ReusableComponentsPanelProps {
  currentStepNumber?: number;
  onComponentAdd?: (type: string) => void;
}

const ReusableComponentsPanel: React.FC<ReusableComponentsPanelProps> = () => {
  // Configuração para mobile-first
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isGridView, setIsGridView] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'recent'>('name');

  // Mock data para demonstração
  const {
    components,
    categories,
    isLoading,
    loadComponents,
    totalComponents
  } = useEditorReusableComponentsSimple();

  // Mock additional properties for compatibility
  const loading = isLoading;
  const getComponentsByCategory = (category: string) => 
    components.filter(c => c.category === category);
  const getAvailableCategories = () => categories;
  const addReusableComponentToEditor = async (componentTypeKey: string, _stepNumber: number) => {
    console.log('Adding component:', componentTypeKey);
  };
  const applyComponentTemplate = (template: any) => {
    console.log('Applying template:', template);
  };

  const availableCategories = getAvailableCategories();

  const handleAddComponent = async (componentTypeKey: string) => {
    try {
      await addReusableComponentToEditor(componentTypeKey, 1);
      console.log('Component added:', componentTypeKey);
    } catch (error) {
      console.error('Erro ao adicionar componente:', error);
    }
  };

  // Filtrar componentes baseado na categoria e termo de busca
  const filteredComponents = components
    .filter(component => {
      const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
      const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           component.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           component.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a: any, b: any) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      return components.indexOf(a) - components.indexOf(b); // 'recent'
    });

  // Detectar mobile
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Carregar componentes na inicialização
  useEffect(() => {
    loadComponents();
  }, [loadComponents]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Carregando componentes...</span>
      </div>
    );
  }

  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col ${isMobile ? 'w-full' : 'w-80'}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            🧩 Componentes
          </h2>
          <span className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded-full">
            {totalComponents} items
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Buscar componentes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2 py-1 text-xs rounded-full transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todos
          </button>
          {availableCategories.filter((category: string) => {
            return getComponentsByCategory(category).length > 0;
          }).map((category: string) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-2 py-1 text-xs rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Components List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredComponents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-sm">
              {searchTerm ? 'Nenhum componente encontrado' : 'Nenhum componente disponível'}
            </p>
          </div>
        ) : (
          <div className={`gap-3 ${isGridView ? 'grid grid-cols-1' : 'space-y-2'}`}>
            {filteredComponents.map((component: any) => (
              <div
                key={component.id}
                className="group border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer bg-white"
                onClick={() => handleAddComponent(component.id)}
              >
                {/* Component Preview */}
                <div className="mb-2">
                  <div className="w-full h-16 bg-gray-50 rounded border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-xs">
                    {component.preview ? (
                      <img
                        src={component.preview}
                        alt={component.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      `Preview ${component.name}`
                    )}
                  </div>
                </div>

                {/* Component Info */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-sm text-gray-900 truncate">
                      {component.name}
                    </h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-1 py-0.5 rounded">
                      {component.category}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {component.description}
                  </p>

                  {/* Tags */}
                  {component.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {component.tags.slice(0, 2).map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="text-xs bg-blue-50 text-blue-700 px-1 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {component.tags.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{component.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddComponent(component.id);
                      }}
                      className="flex-1 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                    >
                      + Adicionar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        applyComponentTemplate(component);
                      }}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                    >
                      ⚙️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>{filteredComponents.length} componentes</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsGridView(!isGridView)}
              className="p-1 rounded hover:bg-gray-200"
            >
              {isGridView ? '📋' : '⊞'}
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs border border-gray-300 rounded px-1 py-0.5"
            >
              <option value="name">Nome</option>
              <option value="category">Categoria</option>
              <option value="recent">Recente</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReusableComponentsPanel;