import React, { useState } from 'react';
import { 
  Type, 
  Heading1, 
  Image as ImageIcon, 
  RectangleHorizontal, 
  StretchHorizontal, 
  HelpCircle, 
  Play, 
  Timer, 
  Award, 
  Gift, 
  Users, 
  Search,
  Star,
  Crown
} from 'lucide-react';

// Definição dos componentes disponíveis
const AVAILABLE_COMPONENTS = [
  // Populares
  { type: 'heading', label: 'Título', icon: Heading1, category: 'basic', isPopular: true, description: 'Títulos H1-H4 configuráveis' },
  { type: 'text', label: 'Texto', icon: Type, category: 'basic', isPopular: true, description: 'Bloco de texto simples' },
  { type: 'button', label: 'Botão', icon: RectangleHorizontal, category: 'basic', isPopular: true, description: 'Botão interativo com CTA' },
  { type: 'quiz-question', label: 'Pergunta do Quiz', icon: HelpCircle, category: 'quiz', isPopular: true, isPro: true, description: 'Pergunta completa com opções' },
  { type: 'image', label: 'Imagem', icon: ImageIcon, category: 'basic', isPopular: true, description: 'Imagem responsiva' },
  
  // Básicos
  { type: 'rich-text', label: 'Texto Rico', icon: Type, category: 'basic', isPro: true, description: 'Editor de texto avançado' },
  { type: 'spacer', label: 'Espaçador', icon: StretchHorizontal, category: 'basic', description: 'Espaço vazio configurável' },
  
  // Quiz
  { type: 'quiz-intro', label: 'Introdução do Quiz', icon: Play, category: 'quiz', description: 'Página inicial do quiz' },
  { type: 'quiz-progress', label: 'Barra de Progresso', icon: Timer, category: 'quiz', description: 'Indicador de progresso' },
  { type: 'quiz-result', label: 'Resultado do Quiz', icon: Award, category: 'quiz', isPro: true, description: 'Exibição de resultado' },
  
  // Ofertas
  { type: 'product-offer', label: 'Oferta de Produto', icon: Gift, category: 'offer', isPro: true, description: 'Apresentação de produto' },
  { type: 'testimonials', label: 'Depoimentos', icon: Users, category: 'social-proof', description: 'Seção de depoimentos' },
  { type: 'urgency-timer', label: 'Contador de Urgência', icon: Timer, category: 'urgency', isPro: true, description: 'Timer de contagem regressiva' },
  { type: 'faq-section', label: 'Perguntas Frequentes', icon: HelpCircle, category: 'support', description: 'FAQ expansível' }
];

const CATEGORIES = {
  popular: { label: 'Populares', color: '#F59E0B' },
  basic: { label: 'Básicos', color: '#6B7280' },
  quiz: { label: 'Quiz', color: '#3B82F6' },
  offer: { label: 'Oferta', color: '#F59E0B' },
  'social-proof': { label: 'Prova Social', color: '#8B5CF6' },
  urgency: { label: 'Urgência', color: '#EF4444' },
  support: { label: 'Suporte', color: '#6B7280' }
};

export const ImprovedBlocksSidebar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('popular');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const filteredComponents = searchQuery 
    ? AVAILABLE_COMPONENTS.filter(comp =>
        comp.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : activeTab === 'popular' 
      ? AVAILABLE_COMPONENTS.filter(comp => comp.isPopular)
      : AVAILABLE_COMPONENTS.filter(comp => comp.category === activeTab);

  const handleComponentSelect = (type: string, label: string) => {
    setSelectedComponent(type);
    console.log(`Componente selecionado: ${type} (${label})`);
    
    // Simular feedback visual
    setTimeout(() => setSelectedComponent(null), 2000);
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-[#B89B7A]/20 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#B89B7A]/20">
          <h2 className="font-playfair text-lg text-[#432818] mb-3">🧱 Blocos</h2>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F7A6A]" />
            <input
              placeholder="Buscar componentes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 h-9 border border-[#B89B7A]/20 rounded focus:border-[#B89B7A] text-sm px-3"
            />
          </div>
        </div>

        {/* Tabs */}
        {!searchQuery && (
          <div className="px-4 pt-3 pb-2 border-b border-[#B89B7A]/10">
            <div className="flex flex-wrap gap-1">
              {Object.entries(CATEGORIES).map(([key, category]) => {
                const count = key === 'popular' 
                  ? AVAILABLE_COMPONENTS.filter(c => c.isPopular).length
                  : AVAILABLE_COMPONENTS.filter(c => c.category === key).length;
                
                if (count === 0) return null;
                
                return (
                  <button
                    key={key}
                    className={`text-xs px-2 py-1 rounded transition-colors ${
                      activeTab === key 
                        ? 'bg-[#B89B7A] text-white' 
                        : 'bg-gray-100 text-[#8F7A6A] hover:bg-[#B89B7A]/10'
                    }`}
                    onClick={() => setActiveTab(key)}
                  >
                    {category.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Components List */}
        <div className="flex-1 overflow-y-auto p-4">
          {searchQuery && (
            <div className="mb-3">
              <div className="text-xs text-[#8F7A6A] bg-[#B89B7A]/10 px-2 py-1 rounded">
                {filteredComponents.length} resultado{filteredComponents.length !== 1 ? 's' : ''}
              </div>
            </div>
          )}

          <div className="space-y-2">
            {filteredComponents.map((component) => (
              <button
                key={component.type}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedComponent === component.type
                    ? 'border-[#B89B7A] bg-[#B89B7A]/10 scale-105'
                    : 'border-[#B89B7A]/20 hover:border-[#B89B7A]/40 hover:bg-[#FAF9F7]'
                }`}
                onClick={() => handleComponentSelect(component.type, component.label)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#B89B7A]/10 rounded-lg flex items-center justify-center">
                    <component.icon className="w-4 h-4 text-[#B89B7A]" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-[#432818] text-sm">
                        {component.label}
                      </span>
                      {component.isPopular && (
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      )}
                      {component.isPro && (
                        <Crown className="w-3 h-3 text-purple-500" />
                      )}
                    </div>
                    <p className="text-xs text-[#8F7A6A] line-clamp-2">
                      {component.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filteredComponents.length === 0 && (
            <div className="text-center py-8 text-[#8F7A6A]">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhum componente encontrado</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#B89B7A]/20">
          <div className="flex items-center justify-between text-xs text-[#8F7A6A]">
            <span>{AVAILABLE_COMPONENTS.length} componentes</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span>Popular</span>
              </div>
              <div className="flex items-center gap-1">
                <Crown className="w-3 h-3 text-purple-500" />
                <span>Pro</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-[#FAF9F7]">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[#432818] mb-4">
            ✅ Nova Aba "Blocos" Ativada!
          </h1>
          
          {selectedComponent && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">
                  Componente "{AVAILABLE_COMPONENTS.find(c => c.type === selectedComponent)?.label}" selecionado!
                </span>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-[#B89B7A]/20 p-6">
              <h2 className="text-xl font-semibold text-[#432818] mb-4">
                🎯 Recursos Implementados
              </h2>
              <ul className="space-y-2 text-[#8F7A6A]">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Busca inteligente por nome e descrição
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Categorização automática
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Componentes populares destacados ⭐
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Features Pro identificadas 👑
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Interface responsiva e moderna
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Feedback visual de seleção
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg border border-[#B89B7A]/20 p-6">
              <h2 className="text-xl font-semibold text-[#432818] mb-4">
                📊 Estatísticas
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#8F7A6A]">Total de Componentes:</span>
                  <span className="font-semibold text-[#B89B7A]">{AVAILABLE_COMPONENTS.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8F7A6A]">Populares:</span>
                  <span className="font-semibold text-yellow-600">
                    {AVAILABLE_COMPONENTS.filter(c => c.isPopular).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8F7A6A]">Features Pro:</span>
                  <span className="font-semibold text-purple-600">
                    {AVAILABLE_COMPONENTS.filter(c => c.isPro).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8F7A6A]">Categorias:</span>
                  <span className="font-semibold text-blue-600">
                    {Object.keys(CATEGORIES).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#B89B7A]/20 p-6">
            <h2 className="text-xl font-semibold text-[#432818] mb-4">
              🚀 Como Usar
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-[#B89B7A] mb-2">Para Desenvolvedores:</h3>
                <ol className="space-y-1 text-sm text-[#8F7A6A]">
                  <li>1. Importe ComponentsSidebar no seu editor</li>
                  <li>2. Passe uma função onComponentSelect</li>
                  <li>3. Use o tipo selecionado para renderizar</li>
                  <li>4. Configure propriedades no painel</li>
                </ol>
              </div>
              <div>
                <h3 className="font-medium text-[#B89B7A] mb-2">Para Usuários:</h3>
                <ol className="space-y-1 text-sm text-[#8F7A6A]">
                  <li>1. Procure na barra de busca</li>
                  <li>2. Navegue pelas categorias</li>
                  <li>3. Clique para selecionar</li>
                  <li>4. Configure no painel lateral</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
