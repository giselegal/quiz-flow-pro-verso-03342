import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { funnelLocalStore } from '@/services/funnelLocalStore';
import { customTemplateService, CustomTemplate } from '@/services/customTemplateService';
import { Edit, Eye, Play, Plus, Sparkles, Zap, Copy, Trash2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';
import { useFunnelTemplates } from '@/core/funnel/hooks/useFunnelTemplates';
import { getUnifiedTemplates, TemplateRegistry, type UnifiedTemplate } from '@/config/unifiedTemplatesRegistry';

const FunnelPanelPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const {
    templates: funnelTemplates,
    filterBySearch,
    filterByCategory
  } = useFunnelTemplates();

  // Estados locais
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('all');
  const [sort, setSort] = React.useState('name');
  const [activeTab, setActiveTab] = React.useState<'official' | 'custom'>('official');
  const [customTemplates, setCustomTemplates] = React.useState<CustomTemplate[]>([]);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = React.useState(false);
  const [selectedTemplateToCustomize, setSelectedTemplateToCustomize] = React.useState<UnifiedTemplate | null>(null);
  const [customizationForm, setCustomizationForm] = React.useState({
    name: '',
    description: '',
    category: 'custom',
    theme: 'modern',
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
  const handleCustomizeTemplate = (template: UnifiedTemplate) => {
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

  // Converter FunnelTemplate para UnifiedTemplate
  const convertToUnifiedTemplate = (template: any): UnifiedTemplate => {
    return {
      id: template.id,
      name: template.name,
      description: template.description,
      category: template.category,
      theme: template.theme,
      stepCount: template.stepCount,
      isOfficial: template.isOfficial,
      usageCount: template.usageCount,
      tags: template.tags || [],
      features: template.features || ['Otimizado', 'Conversão', 'Etapas', 'Editor'],
      conversionRate: template.conversionRate || '—',
      image: template.thumbnailUrl || template.image || 'https://via.placeholder.com/400x300?text=Funnel+Template',
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };
  };

  // Normalizar template para formato de card
  const normalizeTemplate = (template: UnifiedTemplate): UnifiedTemplate => {
    const placeholder = 'https://via.placeholder.com/400x300?text=Funnel+Template';

    return {
      ...template,
      image: template.image || placeholder,
      features: template.features?.length ? template.features.slice(0, 4) : ['Otimizado', 'Conversão', 'Etapas', 'Editor'],
      conversionRate: template.conversionRate || '—'
    };
  };

  const finalTemplates: UnifiedTemplate[] = React.useMemo(() => {
    if (funnelTemplates && funnelTemplates.length) {
      let list = [...funnelTemplates];
      if (sort === 'name') {
        list.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sort === 'createdAt') {
        list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      } else if (sort === 'updatedAt') {
        list.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
      }
      return list.map(convertToUnifiedTemplate).map(normalizeTemplate);
    }

    // ✅ USAR: Registry unificado como fallback
    const unifiedTemplates = getUnifiedTemplates({ sortBy: sort === 'name' ? 'name' : 'usageCount' });
    return unifiedTemplates.map(normalizeTemplate);
  }, [funnelTemplates, sort]);

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
                      <SelectItem value="all">Todas as Categorias</SelectItem>
                      <SelectItem value="quiz-style">Quiz de Estilo</SelectItem>
                      <SelectItem value="lead-magnet">Lead Magnet</SelectItem>
                      <SelectItem value="product-launch">Lançamento</SelectItem>
                      <SelectItem value="webinar">Webinar</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger>
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Nome</SelectItem>
                      <SelectItem value="usageCount">Mais Usados</SelectItem>
                      <SelectItem value="createdAt">Mais Recentes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grid de Templates Oficiais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {finalTemplates.map(template => (
              <Card
                key={template.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group border-0"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <div className="relative">
                  <img
                    src={template.image}
                    alt={template.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Funnel+Template';
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-[#B89B7A] text-white">
                      {template.category}
                    </Badge>
                  </div>
                  {template.isOfficial && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="default" className="bg-blue-500">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Oficial
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#432818] mb-2">{template.name}</h3>
                      <p className="text-[#8F7A6A] text-sm line-clamp-2">{template.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {template.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-sm text-[#8F7A6A]">
                      <div className="flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        Taxa: {template.conversionRate}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {template.usageCount} usos
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleUseTemplate(template.id)}
                        className="flex-1 bg-[#B89B7A] hover:bg-[#A0895B] text-white"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Usar Template
                      </Button>
                      <Button
                        onClick={() => handleCustomizeTemplate(template)}
                        variant="outline"
                        className="px-3"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {finalTemplates.length === 0 && (
            <Card className="border-0" style={{ backgroundColor: '#FFFFFF' }}>
              <CardContent className="p-8 text-center">
                <p className="text-[#8F7A6A]">Nenhum template encontrado para os filtros selecionados.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab de Templates Personalizados */}
        <TabsContent value="custom" className="space-y-6">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#432818]">Meus Modelos Personalizados</h2>

            {customTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {customTemplates.map(template => (
                  <Card
                    key={template.id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group border-0"
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    <div className="relative">
                      <img
                        src={template.image}
                        alt={template.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Custom+Template';
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-purple-500 text-white">
                          Personalizado
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-[#432818] mb-2">{template.name}</h3>
                          <p className="text-[#8F7A6A] text-sm line-clamp-2">{template.description}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {template.features.map((feature, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>

                        <div className="text-sm text-[#8F7A6A]">
                          <div>Criado: {new Date(template.createdAt).toLocaleDateString()}</div>
                          <div>Modificado: {new Date(template.userMetadata.lastModified).toLocaleDateString()}</div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={() => handleUseTemplate(template.id, true)}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Usar
                          </Button>
                          <Button
                            onClick={() => {/* handleEditCustomTemplate(template.id) */ }}
                            variant="outline"
                            className="px-3"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteCustomTemplate(template.id)}
                            variant="outline"
                            className="px-3 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-0" style={{ backgroundColor: '#FFFFFF' }}>
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">🎨</div>
                  <h3 className="text-xl font-bold text-[#432818] mb-2">Nenhum modelo personalizado ainda</h3>
                  <p className="text-[#8F7A6A] mb-4">
                    Personalize um template oficial para criar seus próprios modelos
                  </p>
                  <Button
                    onClick={() => setActiveTab('official')}
                    className="bg-[#B89B7A] hover:bg-[#A0895B] text-white"
                  >
                    Ver Templates Oficiais
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de Personalização */}
      <Dialog open={isCustomizeModalOpen} onOpenChange={setIsCustomizeModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Personalizar Template</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="custom-name">Nome do Template</Label>
              <Input
                id="custom-name"
                value={customizationForm.name}
                onChange={(e) => setCustomizationForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome do seu template personalizado"
              />
            </div>

            <div>
              <Label htmlFor="custom-description">Descrição</Label>
              <Textarea
                id="custom-description"
                value={customizationForm.description}
                onChange={(e) => setCustomizationForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva seu template personalizado"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="custom-category">Categoria</Label>
                <Select
                  value={customizationForm.category}
                  onValueChange={(value) => setCustomizationForm(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Personalizado</SelectItem>
                    <SelectItem value="quiz-style">Quiz de Estilo</SelectItem>
                    <SelectItem value="lead-magnet">Lead Magnet</SelectItem>
                    <SelectItem value="product-launch">Lançamento</SelectItem>
                    <SelectItem value="webinar">Webinar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="custom-theme">Tema</Label>
                <Select
                  value={customizationForm.theme}
                  onValueChange={(value) => setCustomizationForm(prev => ({ ...prev, theme: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Moderno</SelectItem>
                    <SelectItem value="minimal">Minimalista</SelectItem>
                    <SelectItem value="creative">Criativo</SelectItem>
                    <SelectItem value="professional">Profissional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="custom-notes">Notas (opcional)</Label>
              <Textarea
                id="custom-notes"
                value={customizationForm.notes}
                onChange={(e) => setCustomizationForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Adicione anotações sobre este template"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsCustomizeModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveCustomTemplate}
                className="bg-[#B89B7A] hover:bg-[#A0895B] text-white"
              >
                Salvar Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FunnelPanelPage;
