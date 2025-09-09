import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { funnelLocalStore } from '@/services/funnelLocalStore';
import { customTemplateService, CustomTemplate } from '@/services/customTemplateService';
import { BarChart3, Edit, Eye, Play, Plus, Sparkles, Zap, Copy, Settings, Trash2, Download } from 'lucide-react';
import { useLocation } from 'wouter';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';
import { useFunnelTemplates } from '@/core/funnel/hooks/useFunnelTemplates';
import { getUnifiedTemplates, TemplateRegistry, type UnifiedTemplate } from '@/config/unifiedTemplatesRegistry';
import { type FunnelMetadata } from '@/core/funnel/types';

const FunnelPanelPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const {
    filteredTemplates,
    filterByCategory,
    filterBySearch,
    clearFilters,
  } = useFunnelTemplates({ includeOfficial: true, includeUserTemplates: true, sortBy: 'name' });
  const [category, setCategory] = React.useState<string>('all');
  const [search, setSearch] = React.useState<string>('');
  const [sort, setSort] = React.useState<'name' | 'createdAt' | 'updatedAt'>('name');

  // Estados para templates personalizados
  const [activeTab, setActiveTab] = React.useState<'official' | 'custom'>('official');
  const [customTemplates, setCustomTemplates] = React.useState<CustomTemplate[]>([]);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = React.useState(false);
  const [selectedTemplateToCustomize, setSelectedTemplateToCustomize] = React.useState<any>(null);
  const [customizationForm, setCustomizationForm] = React.useState({
    name: '',
    description: '',
    category: '',
    theme: '',
    notes: ''
  });

  // Carregar templates personalizados
  React.useEffect(() => {
    loadCustomTemplates();
  }, []);

  const loadCustomTemplates = () => {
    const templates = customTemplateService.getCustomTemplates();
    setCustomTemplates(templates);
  };

  // Função para personalizar template
  const handleCustomizeTemplate = (template: any) => {
    setSelectedTemplateToCustomize(template);
    setCustomizationForm({
      name: `${template.name} (Personalizado)`,
      description: template.description || '',
      category: template.category || 'custom',
      theme: template.theme || 'modern',
      notes: ''
    });
    setIsCustomizeModalOpen(true);
  };

  // Função para salvar template personalizado
  const handleSaveCustomTemplate = () => {
    if (!selectedTemplateToCustomize) return;

    try {
      const customTemplateId = customTemplateService.duplicateAsCustomTemplate(
        selectedTemplateToCustomize,
        {
          personalizedName: customizationForm.name,
          personalizedDescription: customizationForm.description,
          customTheme: customizationForm.theme,
          customSettings: {
            category: customizationForm.category
          }
        },
        {
          createdBy: 'user',
          notes: customizationForm.notes,
          version: '1.0.0'
        }
      );

      console.log('✅ Template personalizado criado:', customTemplateId);
      loadCustomTemplates(); // Recarregar lista
      setIsCustomizeModalOpen(false);

      // Opcional: mudar para aba de templates personalizados
      setActiveTab('custom');
    } catch (error) {
      console.error('❌ Erro ao salvar template personalizado:', error);
    }
  };

  // Função para excluir template personalizado
  const handleDeleteCustomTemplate = (templateId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este template personalizado?')) {
      const success = customTemplateService.deleteCustomTemplate(templateId);
      if (success) {
        loadCustomTemplates();
        console.log('✅ Template personalizado excluído');
      }
    }
  };

  // Função para usar template (oficial ou personalizado)
  const handleUseTemplate = (templateId: string, isCustom: boolean = false) => {
    try {
      if (isCustom) {
        customTemplateService.recordTemplateUsage(templateId, 'custom');
      }

      const now = new Date().toISOString();
      const newId = `${templateId}-${Date.now()}`;
      const template = isCustom
        ? customTemplateService.getCustomTemplate(templateId)
        : TemplateRegistry.getById(templateId);
      const name = template?.name || 'Funil';
      const list = funnelLocalStore.list();
      list.push({ id: newId, name, status: 'draft', updatedAt: now });
      funnelLocalStore.saveList(list);
    } catch { }

    setLocation(`/editor?template=${templateId}`);
  };

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

    // ✅ USAR: Registry unificado como fallback
    const unifiedTemplates = getUnifiedTemplates({ sortBy: sort === 'name' ? 'name' : 'usageCount' });
    return unifiedTemplates.map((template) => ({
      id: template.id,
      name: template.name,
      description: template.description,
      image: template.image,
      features: template.features,
      conversionRate: template.conversionRate,
      category: template.category,
    }));
  }, [filteredTemplates, sort]);

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

      {/* Tabs para alternar entre modelos oficiais e personalizados */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'official' | 'custom')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="official">Modelos Oficiais</TabsTrigger>
          <TabsTrigger value="custom">Meus Modelos ({customTemplates.length})</TabsTrigger>
        </TabsList>

        {/* Tab de Modelos Oficiais */}
        <TabsContent value="official" className="space-y-6">
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
                      filterByCategory(v === 'all' ? '' : v);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="quiz-style">Quiz de Estilo</SelectItem>
                      <SelectItem value="personal-branding">Personal Branding</SelectItem>
                      <SelectItem value="lead-generation">Geração de Leads</SelectItem>
                      <SelectItem value="personality-test">Teste de Personalidade</SelectItem>
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
              {((category && category !== 'all') || search) && (
                <div className="mt-3 flex items-center gap-2">
                  {category && category !== 'all' && (
                    <Badge variant="secondary">Categoria: {category}</Badge>
                  )}
                  {search && <Badge variant="secondary">Busca: {search}</Badge>}
                  <Button variant="ghost" className="text-[#B89B7A]" onClick={() => {
                    setCategory('all');
                    setSearch('');
                    clearFilters();
                  }}>Limpar</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Template Cards Oficiais */}
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
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => handleUseTemplate(template.id, false)}
                      className="flex-1 bg-[#B89B7A] hover:bg-[#A0895B] text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Usar Template
                    </Button>
                    <Button
                      onClick={() => handleCustomizeTemplate(template)}
                      variant="outline"
                      size="sm"
                      className="px-3"
                      style={{ borderColor: '#B89B7A', color: '#B89B7A' }}
                    >
                      <Copy className="w-4 h-4" />
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
        </TabsContent>

        {/* Tab de Meus Modelos */}
        <TabsContent value="custom" className="space-y-6">
          {customTemplates.length === 0 ? (
            <Card style={{ backgroundColor: '#FFFFFF' }}>
              <CardContent className="text-center py-12">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-[#FAF9F7] rounded-full flex items-center justify-center">
                    <Settings className="w-8 h-8 text-[#B89B7A]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#432818]">Nenhum modelo personalizado ainda</h3>
                  <p className="text-[#8F7A6A] max-w-md mx-auto">
                    Personalize qualquer modelo oficial clicando no ícone de cópia e crie seus próprios templates.
                  </p>
                  <Button 
                    onClick={() => setActiveTab('official')}
                    className="bg-[#B89B7A] hover:bg-[#A0895B] text-white"
                  >
                    Explorar Modelos Oficiais
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Header de Meus Modelos */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-[#432818]">Meus Modelos Personalizados</h2>
                  <p className="text-[#8F7A6A]">Templates que você criou e personalizou</p>
                </div>
                <div className="text-sm text-[#8F7A6A]">
                  {customTemplates.length} template{customTemplates.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Custom Template Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {customTemplates.map(template => (
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
                            style={{ backgroundColor: '#8B5CF6' }}
                          >
                            Personalizado
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
                        {template.userMetadata.notes && (
                          <p className="text-[#8F7A6A] text-xs mt-2 italic">
                            💡 {template.userMetadata.notes}
                          </p>
                        )}
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

                      {/* Metadata */}
                      <div className="text-xs text-[#8F7A6A] space-y-1">
                        <div>Criado: {new Date(template.userMetadata.createdAt).toLocaleDateString('pt-BR')}</div>
                        <div>Modificado: {new Date(template.userMetadata.lastModified).toLocaleDateString('pt-BR')}</div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={() => handleUseTemplate(template.id, true)}
                          className="flex-1 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
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
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteCustomTemplate(template.id)}
                          variant="outline"
                          size="sm"
                          className="px-3"
                          style={{ borderColor: '#EF4444', color: '#EF4444' }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal de Personalização */}
      <Dialog open={isCustomizeModalOpen} onOpenChange={setIsCustomizeModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Personalizar Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="template-name">Nome do Template</Label>
              <Input
                id="template-name"
                value={customizationForm.name}
                onChange={(e) => setCustomizationForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome do seu template personalizado"
              />
            </div>
            <div>
              <Label htmlFor="template-description">Descrição</Label>
              <Textarea
                id="template-description"
                value={customizationForm.description}
                onChange={(e) => setCustomizationForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva seu template personalizado"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="template-category">Categoria</Label>
              <Select 
                value={customizationForm.category}
                onValueChange={(value) => setCustomizationForm(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quiz-style">Quiz de Estilo</SelectItem>
                  <SelectItem value="personal-branding">Personal Branding</SelectItem>
                  <SelectItem value="lead-generation">Geração de Leads</SelectItem>
                  <SelectItem value="personality-test">Teste de Personalidade</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="template-notes">Notas (opcional)</Label>
              <Input
                id="template-notes"
                value={customizationForm.notes}
                onChange={(e) => setCustomizationForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Adicione algumas notas sobre este template"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleSaveCustomTemplate}
                className="flex-1 bg-[#B89B7A] hover:bg-[#A0895B] text-white"
              >
                Salvar Template
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsCustomizeModalOpen(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
            Modelos de Funis
          </h1>
          <p className="text-[#8F7A6A] mt-2 text-lg">Escolha um modelo otimizado ou crie do zero</p>
        </div >
  <Button
    onClick={handleCreateCustom}
    className="bg-[#B89B7A] hover:bg-[#A0895B] text-white px-6 py-3"
  >
    <Plus className="w-5 h-5 mr-2" />
    Criar Funil Personalizado
  </Button>
      </div >

  {/* Filtros */ }
  < Card className = "border-0" style = {{ backgroundColor: '#FFFFFF' }}>
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
              // Mapear 'all' para filtro vazio no hook
              filterByCategory(v === 'all' ? '' : v);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
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
      {((category && category !== 'all') || search) && (
        <div className="mt-3 flex items-center gap-2">
          {category && category !== 'all' && (
            <Badge variant="secondary">Categoria: {category}</Badge>
          )}
          {search && <Badge variant="secondary">Busca: {search}</Badge>}
          <Button variant="ghost" className="text-[#B89B7A]" onClick={() => {
            setCategory('all');
            setSearch('');
            clearFilters();
          }}>Limpar</Button>
        </div>
      )}
    </CardContent>
      </Card >

  {/* Template Cards */ }
  < div className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" >
  {
    finalTemplates.map(template => (
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
    ))
  }
      </div >

  {/* Active Funnels Section */ }
  < div className = "space-y-6" >
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
      </div >
    </div >
  );
};

export default FunnelPanelPage;
