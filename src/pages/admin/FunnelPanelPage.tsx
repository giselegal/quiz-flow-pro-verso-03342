import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { funnelLocalStore } from '@/services/funnelLocalStore';
import { BarChart3, Edit, Eye, Play, Plus, Sparkles, Zap } from 'lucide-react';
import { useLocation } from 'wouter';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';
import { useFunnelTemplates } from '@/core/funnel/hooks/useFunnelTemplates';

// Template data for funnel models
const funnelTemplates = [
  {
    id: 'default-quiz-funnel-21-steps',
    name: 'Quiz Completo: Descoberta de Estilo Pessoal (21 Etapas)',
    description: 'Funil completo com 21 etapas para descoberta de estilo pessoal',
    image:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
    features: [
      '21 Etapas Otimizadas',
      'Quiz Interativo',
      'Resultado Personalizado',
      'Oferta Integrada',
    ],
    conversionRate: '87%',
    category: 'Estilo Pessoal',
  },
  {
    id: 'optimized-21-steps-funnel',
    name: 'Quiz 21 Etapas (Otimizado)',
    description: 'Versão otimizada com blocos core, perguntas sincronizadas e pesos de pontuação',
    image:
      'https://res.cloudinary.com/dqljyf76t/image/upload/c_fill,w_400,h_300/v1744911572/LOOKS_COMBINACOES.webp',
    features: [
      'Perguntas sincronizadas',
      'Pesos de pontuação',
      'Componentes core',
      'Resultado + Oferta',
    ],
    conversionRate: '90%',
    category: 'Estilo Pessoal',
  },
  {
    id: 'com-que-roupa-eu-vou',
    name: 'Com que Roupa Eu Vou?',
    description: 'Quiz especializado em combinações de looks com IA',
    image:
      'https://res.cloudinary.com/dqljyf76t/image/upload/c_fill,w_400,h_300/v1744911572/LOOKS_COMBINACOES.webp',
    features: [
      'IA Integrada',
      'Looks Personalizados',
      'Análise de Cores',
      'Sugestões Inteligentes',
    ],
    conversionRate: '92%',
    category: 'Looks & Combinações',
  },
  {
    id: 'personal-branding-quiz',
    name: 'Personal Branding Quiz',
    description: 'Descubra seu estilo de marca pessoal',
    image:
      'https://res.cloudinary.com/dqljyf76t/image/upload/c_fill,w_400,h_300/v1744911572/PERSONAL_BRANDING.webp',
    features: [
      'Análise de Personalidade',
      'Estilo de Marca',
      'Cores Estratégicas',
      'Guia Completo',
    ],
    conversionRate: '78%',
    category: 'Personal Branding',
  },
];

const FunnelPanelPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const {
    filteredTemplates,
    filterByCategory,
    filterBySearch,
    clearFilters,
  } = useFunnelTemplates({ includeOfficial: true, includeUserTemplates: true, sortBy: 'name' });
  const [category, setCategory] = React.useState<string>('');
  const [search, setSearch] = React.useState<string>('');
  const [sort, setSort] = React.useState<'name' | 'createdAt' | 'updatedAt'>('name');

  type CardTemplate = {
    id: string;
    name: string;
    description: string;
    image: string;
    features: string[];
    conversionRate: string;
    category: string;
  };

  const normalize = (t: any): CardTemplate => {
    const placeholder = 'https://via.placeholder.com/400x300?text=Funnel+Template';
    const features: string[] = Array.isArray(t.tags) && t.tags.length
      ? t.tags.slice(0, 4)
      : ['Otimizado', 'Conversão', 'Etapas', 'Editor'];
    return {
      id: t.id,
      name: t.name,
      description: t.description || '',
      image: t.thumbnailUrl || placeholder,
      features,
      conversionRate: '—',
      category: t.category || 'custom',
    };
  };

  const finalTemplates: CardTemplate[] = React.useMemo(() => {
    if (filteredTemplates && filteredTemplates.length) {
      let list = [...filteredTemplates];
      if (sort === 'name') {
        list.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sort === 'createdAt') {
        list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      } else if (sort === 'updatedAt') {
        list.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
      }
      return list.map(normalize);
    }
    // Fallback para modelos locais
    const local = [...funnelTemplates];
    if (sort === 'name') local.sort((a, b) => a.name.localeCompare(b.name));
    return local;
  }, [filteredTemplates, sort]);

  const handleUseTemplate = (templateId: string) => {
    // Criar instância local do funil em rascunho e navegar ao editor com template
    try {
      const now = new Date().toISOString();
      const newId = `${templateId}-${Date.now()}`;
      const name = funnelTemplates.find(t => t.id === templateId)?.name || 'Funil';
      const list = funnelLocalStore.list();
      list.push({ id: newId, name, status: 'draft', updatedAt: now });
      funnelLocalStore.saveList(list);
    } catch { }
    // Navigate to editor with the template ID
    setLocation(`/editor?template=${templateId}`);
  };

  const handleCreateCustom = () => {
    setLocation('/editor');
  };

  return (
    <div className="p-6 space-y-8" style={{ backgroundColor: '#FAF9F7', minHeight: '100vh' }}>
      {/* Breadcrumbs */}
      <AdminBreadcrumbs
        items={[
          { label: 'Admin', href: '/admin' },
          { label: 'Funis', href: '/admin/funis' },
          { label: 'Modelos de Funis' },
        ]}
      />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1
            className="text-4xl font-bold text-[#432818]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Modelos de Funis
          </h1>
          <p className="text-[#8F7A6A] mt-2 text-lg">Escolha um modelo otimizado ou crie do zero</p>
        </div>
        <Button
          onClick={handleCreateCustom}
          className="bg-[#B89B7A] hover:bg-[#A0895B] text-white px-6 py-3"
        >
          <Plus className="w-5 h-5 mr-2" />
          Criar Funil Personalizado
        </Button>
      </div>

      {/* Filtros */}
      <Card className="border-0" style={{ backgroundColor: '#FFFFFF' }}>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <Input
                placeholder="Buscar modelos..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  filterBySearch(e.target.value);
                }}
              />
            </div>
            <div>
              <Select
                value={category}
                onValueChange={(v) => {
                  setCategory(v);
                  filterByCategory(v);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={sort} onValueChange={(v: any) => setSort(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nome</SelectItem>
                  <SelectItem value="createdAt">Criado em</SelectItem>
                  <SelectItem value="updatedAt">Atualizado em</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {(category || search) && (
            <div className="mt-3 flex items-center gap-2">
              {category && <Badge variant="secondary">Categoria: {category}</Badge>}
              {search && <Badge variant="secondary">Busca: {search}</Badge>}
              <Button variant="ghost" className="text-[#B89B7A]" onClick={() => {
                setCategory('');
                setSearch('');
                clearFilters();
              }}>Limpar</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Template Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {finalTemplates.map(template => (
          <Card
            key={template.id}
            className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0"
            style={{
              backgroundColor: '#FFFFFF',
              boxShadow: '0 10px 30px rgba(184, 155, 122, 0.1)',
            }}
          >
            <CardHeader className="p-0">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <div
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: '#B89B7A' }}
                  >
                    {template.conversionRate} conversão
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <div
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#432818' }}
                  >
                    {template.category}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-[#432818] mb-2 line-clamp-2">
                  {template.name}
                </h3>
                <p className="text-[#6B4F43] text-sm leading-relaxed">{template.description}</p>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-[#432818] flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" style={{ color: '#B89B7A' }} />
                  Características
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {template.features.map((feature: string, index: number) => (
                    <div
                      key={index}
                      className="text-xs px-2 py-1 rounded-md"
                      style={{ backgroundColor: '#FAF9F7', color: '#6B4F43' }}
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => handleUseTemplate(template.id)}
                  className="flex-1 bg-[#B89B7A] hover:bg-[#A0895B] text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Usar Template
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-3"
                  style={{ borderColor: '#B89B7A', color: '#B89B7A' }}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Funnels Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-[#432818]">Meus Funis Ativos</h2>

        <Card style={{ backgroundColor: '#FFFFFF' }}>
          <CardHeader>
            <CardTitle className="text-[#432818] flex items-center">
              <Zap className="w-5 h-5 mr-2" style={{ color: '#B89B7A' }} />
              Funis em Produção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-[#D4C4A0] rounded-lg">
                <div>
                  <h3 className="font-semibold text-[#432818]">Funil de Descoberta de Estilo</h3>
                  <p className="text-sm text-[#8F7A6A]">Quiz → Resultado → Oferta</p>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <span className="text-green-600 font-medium">87% conversão</span>
                    <span className="text-[#B89B7A] font-medium">1,234 visitantes</span>
                    <span className="text-[#6B4F43]">Atualizado hoje</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Métricas
                  </Button>
                </div>
              </div>

              {/* Empty state for new users */}
              <div className="text-center py-8 opacity-60">
                <p className="text-[#8F7A6A] text-sm">
                  Seus próximos funis aparecerão aqui quando forem criados
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FunnelPanelPage;
