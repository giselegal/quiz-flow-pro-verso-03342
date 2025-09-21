import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Bot, Sparkles, Search, Zap, Palette, ShoppingBag, Heart, Star, X } from 'lucide-react';
import { useAI } from '@/hooks/useAI';

// Tipagem afrouxada para compatibilidade entre páginas

interface TemplatesIASidebarProps {
  onSelectTemplate: (template: AIFunnelTemplate) => void | Promise<void>;
  onClose: () => void;
}

export function TemplatesIASidebar({ onSelectTemplate, onClose }: TemplatesIASidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { generateFunnel, isLoading: aiLoading } = useAI();

  // Templates pré-definidos para demonstração
  const predefinedTemplates: any[] = [
    {
      id: 'fashion-quiz-01',
      meta: {
        name: 'Quiz de Estilo Pessoal',
        description: 'Descubra seu estilo único em 5 minutos',
        version: '1.0.0',
        author: 'Fashion AI',
        category: 'fashion',
        tags: ['estilo', 'moda', 'personalidade', 'quiz']
      },
      design: {
        primaryColor: '#FF6B6B',
        secondaryColor: '#4ECDC4',
        accentColor: '#45B7D1',
        backgroundColor: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
        fontFamily: 'Poppins'
      },
      steps: [
        { id: 'intro', title: 'Bem-vindo ao Quiz de Estilo', type: 'intro' },
        { id: 'q1', title: 'Qual seu estilo favorito?', type: 'question' },
        { id: 'q2', title: 'Cores preferidas?', type: 'question' },
        { id: 'result', title: 'Seu Estilo Pessoal', type: 'result' }
      ],
      preview: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop'
    },
    {
      id: 'wardrobe-consultant',
      meta: {
        name: 'Consultoria de Guarda-Roupa',
        description: 'Análise completa do seu armário',
        version: '1.0.0',
        author: 'Style AI',
        category: 'consulting',
        tags: ['consultoria', 'armário', 'organização', 'styling']
      },
      design: {
        primaryColor: '#6366F1',
        secondaryColor: '#8B5CF6',
        accentColor: '#EC4899',
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: 'Inter'
      },
      steps: [
        { id: 'intro', title: 'Consultoria Personalizada', type: 'intro' },
        { id: 'q1', title: 'Qual seu objetivo?', type: 'question' },
        { id: 'q2', title: 'Orçamento disponível?', type: 'question' },
        { id: 'analysis', title: 'Análise do Guarda-Roupa', type: 'analysis' },
        { id: 'recommendations', title: 'Recomendações', type: 'result' }
      ],
      preview: 'https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=400&h=300&fit=crop'
    },
    {
      id: 'personal-shopper',
      meta: {
        name: 'Personal Shopper IA',
        description: 'Recomendações personalizadas de compras',
        version: '1.0.0',
        author: 'Shopping AI',
        category: 'shopping',
        tags: ['shopping', 'recomendações', 'compras', 'ia']
      },
      design: {
        primaryColor: '#10B981',
        secondaryColor: '#059669',
        accentColor: '#F59E0B',
        backgroundColor: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        fontFamily: 'Roboto'
      },
      steps: [
        { id: 'intro', title: 'Personal Shopper IA', type: 'intro' },
        { id: 'profile', title: 'Seu Perfil', type: 'form' },
        { id: 'preferences', title: 'Preferências de Estilo', type: 'question' },
        { id: 'budget', title: 'Orçamento', type: 'question' },
        { id: 'recommendations', title: 'Suas Recomendações', type: 'result' }
      ],
      preview: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos', icon: Star },
    { id: 'fashion', name: 'Moda', icon: Heart },
    { id: 'consulting', name: 'Consultoria', icon: Zap },
    { id: 'shopping', name: 'Shopping', icon: ShoppingBag }
  ];

  useEffect(() => {
    // Simular carregamento de templates
    const loadTemplates = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTemplates(predefinedTemplates);
      setIsLoading(false);
    };

    loadTemplates();
  }, []);

  // Filtrar templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.meta.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.meta.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.meta.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.meta.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleGenerateCustomTemplate = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      const aiSteps = await generateFunnel(`Criar template: ${searchTerm}`);
      
      if (aiSteps) {
        const customTemplate: any = {
          id: `ai-generated-${Date.now()}`,
          meta: {
            name: `Template IA: ${searchTerm}`,
            description: `Template gerado automaticamente baseado em: ${searchTerm}`,
            version: '1.0.0',
            author: 'Gemini AI',
            category: 'ai-generated',
            tags: searchTerm.split(' ')
          },
          design: {
            primaryColor: '#6366F1',
            secondaryColor: '#8B5CF6', 
            accentColor: '#EC4899',
            backgroundColor: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            fontFamily: 'Inter'
          },
          steps: aiSteps
        };
        
        onSelectTemplate(customTemplate);
      }
    } catch (error) {
      console.error('Erro ao gerar template personalizado:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Templates IA</h2>
                <p className="text-gray-600">Escolha um template ou crie um personalizado com IA</p>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Search e Generate */}
          <div className="mt-4 flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar templates ou descrever seu funil personalizado..."
                className="pl-10"
              />
            </div>
            <Button
              onClick={handleGenerateCustomTemplate}
              disabled={!searchTerm.trim() || aiLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Bot className="w-4 h-4 mr-2" />
              {aiLoading ? 'Gerando...' : 'Gerar com IA'}
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando templates...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                  onClick={() => onSelectTemplate(template)}
                >
                  <CardHeader className="pb-3">
                    {template.preview && (
                      <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                        <img 
                          src={template.preview} 
                          alt={template.meta.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardTitle className="text-lg">{template.meta.name}</CardTitle>
                    <p className="text-sm text-gray-600">{template.meta.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.meta.tags.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{template.steps.length} steps</span>
                      <span>por {template.meta.author}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border-2 border-white shadow"
                        style={{ backgroundColor: template.design.primaryColor }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border-2 border-white shadow"
                        style={{ backgroundColor: template.design.secondaryColor }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border-2 border-white shadow"
                        style={{ backgroundColor: template.design.accentColor }}
                      />
                      <span className="text-xs text-gray-500 ml-2">{template.design.fontFamily}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum template encontrado</h3>
              <p className="text-gray-600 mb-4">
                Não encontramos templates que correspondam à sua busca.
              </p>
              <Button
                onClick={handleGenerateCustomTemplate}
                disabled={!searchTerm.trim() || aiLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Bot className="w-4 h-4 mr-2" />
                Criar Template Personalizado com IA
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TemplatesIASidebar;