import { cloneFunnelTemplate } from '@/utils/cloneFunnel';
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
import { ThumbnailImage } from '@/components/ui/EnhancedOptimizedImage';
import { funnelLocalStore } from '@/services/funnelLocalStore';
import { customTemplateService, CustomTemplate } from '@/services/customTemplateService';
import { Edit, Eye, Play, Plus, Sparkles, Zap, Copy, Trash2, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
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

  // Estados para limpeza de duplicatas
  const [isCleanupModalOpen, setIsCleanupModalOpen] = React.useState(false);
  const [duplicateInfo, setDuplicateInfo] = React.useState<{
    total: number;
    duplicates: Array<{
      key: string;
      name: string;
      size: number;
      lastModified: string;
    }>;
    spaceToFree: number;
  } | null>(null);
  const [isScanning, setIsScanning] = React.useState(false);
  const [isCleaningUp, setIsCleaningUp] = React.useState(false);
  const [cleanupResult, setCleanupResult] = React.useState<{
    success: boolean;
    removedCount: number;
    freedSpace: number;
    error?: string;
  } | null>(null);

  // Carregar templates personalizados
  React.useEffect(() => {
    loadCustomTemplates();

    // Carregar função de limpeza
    const loadCleanupScript = async () => {
      try {
        // Verificar se a função já está disponível
        if (typeof window !== 'undefined' && !(window as any).cleanupFunnels) {
          // Definir função de limpeza inline para evitar 404
          (window as any).cleanupFunnels = () => {
            try {
              const keys = Object.keys(localStorage);
              const funnelKeys = keys.filter(key =>
                key.startsWith('funnel-') ||
                key.startsWith('funnelData-') ||
                key.includes('temp') ||
                key.includes('draft') ||
                key.includes('backup') ||
                key.includes('copy') ||
                key.includes('duplicate')
              );

              let removedCount = 0;
              funnelKeys.forEach(key => {
                localStorage.removeItem(key);
                removedCount++;
              });

              return {
                success: true,
                removedCount,
                error: null
              };
            } catch (error) {
              return {
                success: false,
                removedCount: 0,
                error: (error as Error).message
              };
            }
          };
          console.log('✅ Função de limpeza definida inline');
        }
      } catch (error) {
        console.warn('⚠️ Erro ao carregar script de limpeza:', error);
      }
    };

    loadCleanupScript();
  }, []);

  const loadCustomTemplates = () => {
    const templates = customTemplateService.getCustomTemplates();
    setCustomTemplates(templates);
  };

  // Função para detectar funis duplicados
  const scanForDuplicates = React.useCallback(() => {
    setIsScanning(true);
    setCleanupResult(null);

    try {
      const keys = Object.keys(localStorage);

      // Detectar chaves relacionadas a funis
      const funnelKeys = keys.filter(key =>
        key.startsWith('funnel-') ||
        key.startsWith('funnelData-') ||
        key.includes('funnel') ||
        key.includes('Funnel') ||
        key.includes('quiz') ||
        key.includes('Quiz') ||
        key.includes('template') ||
        key.includes('draft') ||
        key.includes('temp') ||
        key.includes('backup') ||
        key.includes('copy') ||
        key.includes('duplicate')
      );

      let totalSize = 0;
      const duplicates = funnelKeys.map(key => {
        const value = localStorage.getItem(key) || '';
        const size = new Blob([value]).size;
        totalSize += size;

        return {
          key,
          name: key.length > 50 ? `${key.substring(0, 47)}...` : key,
          size,
          lastModified: 'Desconhecido'
        };
      });

      setDuplicateInfo({
        total: funnelKeys.length,
        duplicates,
        spaceToFree: totalSize
      });

    } catch (error) {
      console.error('❌ Erro ao escanear duplicatas:', error);
      setDuplicateInfo(null);
    } finally {
      setIsScanning(false);
    }
  }, []);

  // Função para executar limpeza
  const executeCleanup = React.useCallback(async () => {
    setIsCleaningUp(true);
    setCleanupResult(null);

    try {
      // Importar e executar função de limpeza existente
      if (typeof window !== 'undefined' && (window as any).cleanupFunnels) {
        const result = (window as any).cleanupFunnels();

        setCleanupResult({
          success: result.success,
          removedCount: result.removedCount || 0,
          freedSpace: 0, // Calcular com base nos dados removidos
          error: result.error
        });

        if (result.success) {
          // Re-escanear após limpeza
          setTimeout(() => {
            scanForDuplicates();
          }, 1000);
        }
      } else {
        // Fallback: limpeza manual básica
        const keys = Object.keys(localStorage);
        const funnelKeys = keys.filter(key =>
          key.startsWith('funnel-') ||
          key.startsWith('funnelData-') ||
          key.includes('temp') ||
          key.includes('draft') ||
          key.includes('backup') ||
          key.includes('copy') ||
          key.includes('duplicate')
        );

        let removedCount = 0;
        funnelKeys.forEach(key => {
          localStorage.removeItem(key);
          removedCount++;
        });

        setCleanupResult({
          success: true,
          removedCount,
          freedSpace: 0
        });

        // Re-escanear após limpeza
        setTimeout(() => {
          scanForDuplicates();
        }, 1000);
      }
    } catch (error) {
      console.error('❌ Erro durante limpeza:', error);
      setCleanupResult({
        success: false,
        removedCount: 0,
        freedSpace: 0,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      setIsCleaningUp(false);
    }
  }, [scanForDuplicates]);

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
      console.log('🎯 [DIAGNÓSTICO] Usando template:', templateId, isCustom ? '(custom)' : '(oficial)');
      console.log('🎯 [DIAGNÓSTICO] Location atual:', window.location.href);
      console.log('🎯 [DIAGNÓSTICO] Timestamp:', new Date().toISOString());

      if (isCustom) {
        customTemplateService.recordTemplateUsage(templateId, 'custom');
      }

      // ✅ CORREÇÃO: Buscar template base para clonagem do registry unificado
      const unifiedTemplates = getUnifiedTemplates();
      const baseTemplate = unifiedTemplates.find(t => t.id === templateId);
      console.log('🎯 [DIAGNÓSTICO] Template encontrado:', baseTemplate ? 'SIM' : 'NÃO');
      console.log('🎯 [DIAGNÓSTICO] Templates disponíveis:', unifiedTemplates.map(t => t.id));

      if (baseTemplate) {
        // 🚀 Usar cloneFunnelTemplate para garantir isolamento
        const templateData = {
          id: baseTemplate.id,
          name: baseTemplate.name,
          description: baseTemplate.description || '',
          category: baseTemplate.category || 'general',
          preview: baseTemplate.image || '',
          blocks: [] // Será preenchido pelo sistema de templates
        };

        console.log('🎯 [DIAGNÓSTICO] Clonando template data:', templateData);
        const clonedInstance = cloneFunnelTemplate(templateData, `${baseTemplate.name} - Cópia`);
        console.log('🎯 [DIAGNÓSTICO] Instância clonada:', clonedInstance);
        console.log('🎯 [DIAGNÓSTICO] ID da instância clonada:', clonedInstance.id);

        // Salvar instância clonada em "meus funis"
        const newFunnel = {
          id: clonedInstance.id,
          name: clonedInstance.name,
          status: 'draft' as const,
          updatedAt: clonedInstance.createdAt
        };

        funnelLocalStore.upsert(newFunnel);
        console.log('✅ [DIAGNÓSTICO] Funil clonado criado:', clonedInstance.id);
        console.log('📦 [DIAGNÓSTICO] Blocos independentes:', clonedInstance.blocks.length);
        console.log('💾 [DIAGNÓSTICO] Salvo no localStorage');

        // ✅ CORRIGIDO: Navegar usando path parameter
        const editorUrl = `/editor/${encodeURIComponent(clonedInstance.id)}?template=${templateId}`;
        console.log('🔗 [DIAGNÓSTICO] Navegando para:', editorUrl);
        console.log('🔗 [DIAGNÓSTICO] URL completa:', `${window.location.origin}${editorUrl}`);

        // Adicionar delay para garantir que os logs sejam vistos
        setTimeout(() => {
          console.log('🚀 [DIAGNÓSTICO] Executando setLocation...');

          // Testar múltiplas abordagens de navegação
          try {
            // Abordagem 1: setLocation do wouter
            setLocation(editorUrl);
            console.log('✅ [DIAGNÓSTICO] setLocation executado');

            // Verificar se a navegação funcionou
            setTimeout(() => {
              console.log('🔍 [DIAGNÓSTICO] URL após setLocation:', window.location.href);
              console.log('🔍 [DIAGNÓSTICO] Path após setLocation:', window.location.pathname);

              // Se não funcionou, tentar fallback
              if (window.location.pathname !== `/editor/${encodeURIComponent(clonedInstance.id)}`) {
                console.log('⚠️ [DIAGNÓSTICO] setLocation não funcionou, tentando window.location...');
                window.location.href = editorUrl;
              }
            }, 500);

          } catch (error) {
            console.error('❌ [DIAGNÓSTICO] Erro no setLocation:', error);
            // Fallback para navegação manual
            window.location.href = editorUrl;
          }
        }, 200);
        return;
      }

      // Fallback para outros templates
      console.log('🎯 [DIAGNÓSTICO] Usando fallback para template:', templateId);
      const now = new Date().toISOString();
      const newId = `${templateId}-${Date.now()}`;
      const template = isCustom
        ? customTemplateService.getCustomTemplate(templateId)
        : TemplateRegistry.getById(templateId);
      const name = template?.name || 'Funil';

      console.log('🎯 [DIAGNÓSTICO] Template fallback encontrado:', template ? 'SIM' : 'NÃO');

      // 🚀 CORREÇÃO: Criar funil na lista principal
      const newFunnel = {
        id: newId,
        name,
        status: 'draft' as const,
        updatedAt: now
      };

      const list = funnelLocalStore.list();
      list.push(newFunnel);
      funnelLocalStore.saveList(list);

      console.log('✅ [DIAGNÓSTICO] Funil criado (fallback):', newFunnel);
      console.log('📊 [DIAGNÓSTICO] Lista atualizada:', list.length, 'funis');

      // Navegar com ID específico do funil criado
      const fallbackUrl = `/editor/${encodeURIComponent(newId)}?template=${templateId}`;
      console.log('🔗 [DIAGNÓSTICO] Navegando (fallback) para:', fallbackUrl);

      setTimeout(() => {
        setLocation(fallbackUrl);
      }, 100);
    } catch (error) {
      console.error('❌ [DIAGNÓSTICO] Erro ao usar template:', error);
      console.error('❌ [DIAGNÓSTICO] Stack trace:', error instanceof Error ? error.stack : 'N/A');

      // Fallback: navegar só com template
      const errorFallbackUrl = `/editor?template=${templateId}`;
      console.log('🔗 [DIAGNÓSTICO] Navegando (error fallback) para:', errorFallbackUrl);

      setTimeout(() => {
        setLocation(errorFallbackUrl);
      }, 100);
    }
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
      image: template.thumbnailUrl || template.image || 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };
  };

  // Normalizar template para formato de card
  const normalizeTemplate = (template: UnifiedTemplate): UnifiedTemplate => {
    const placeholder = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp';

    return {
      ...template,
      image: template.image || placeholder,
      features: template.features?.length ? template.features.slice(0, 4) : ['Otimizado', 'Conversão', 'Etapas', 'Editor'],
      conversionRate: template.conversionRate || '—'
    };
  };

  const finalTemplates: UnifiedTemplate[] = React.useMemo(() => {
    // ⚠️ MODO DESENVOLVIMENTO: Mostrando apenas quiz21StepsComplete
    // Para desenvolvimento e validação das configurações JSON
    const developmentMode = true;

    if (developmentMode) {
      // Filtra para mostrar apenas o quiz21StepsComplete
      const unifiedTemplates = getUnifiedTemplates({ sortBy: sort === 'name' ? 'name' : 'usageCount' });
      const filteredTemplates = unifiedTemplates.filter(template =>
        template.id === 'quiz-estilo-21-steps' ||
        template.name.toLowerCase().includes('quiz')
      );
      return filteredTemplates.map(normalizeTemplate);
    }

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
    console.log('🎨 Criando funil personalizado...');

    const now = new Date().toISOString();
    const newId = `custom-funnel-${Date.now()}`;
    const name = `Funil Personalizado ${new Date().toLocaleTimeString()}`;

    // 🚀 CORREÇÃO: Garantir que funil personalizado seja salvo
    const newFunnel = {
      id: newId,
      name,
      status: 'draft' as const,
      updatedAt: now
    };

    const list = funnelLocalStore.list();
    list.push(newFunnel);
    funnelLocalStore.saveList(list);

    console.log('✅ Funil personalizado criado:', newFunnel);
    setLocation(`/editor/${encodeURIComponent(newId)}`);
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
        <div className="flex gap-3">
          {/* Botão de teste para diagnóstico */}
          <Button
            onClick={() => {
              console.log('🧪 [TESTE] Navegação direta para editor');
              console.log('🧪 [TESTE] Location atual:', window.location.href);
              const testUrl = '/editor/test-navigation-123?template=quiz-estilo-21-steps';
              console.log('🧪 [TESTE] URL de teste:', testUrl);
              setLocation(testUrl);
            }}
            variant="outline"
            size="sm"
            className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
          >
            🧪 Teste Navegação
          </Button>

          {/* Botão diagnóstico completo */}
          <Button
            onClick={() => {
              window.open('/diagnose-editor-navigation.html', '_blank');
            }}
            variant="outline"
            size="sm"
            className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
          >
            🔍 Diagnóstico
          </Button>
          {/* Botão de teste para diagnóstico */}
          <Button
            onClick={() => {
              console.log('🧪 [TESTE] Navegação direta para editor');
              console.log('🧪 [TESTE] Location atual:', window.location.href);
              const testUrl = '/editor/test-navigation-123?template=quiz-estilo-21-steps';
              console.log('🧪 [TESTE] Navegando para:', testUrl);
              setLocation(testUrl);
            }}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50 px-4 py-2 text-sm"
          >
            🧪 Teste Navegação
          </Button>

          <Button
            onClick={() => {
              setIsCleanupModalOpen(true);
              scanForDuplicates();
            }}
            variant="outline"
            className="border-orange-300 text-orange-700 hover:bg-orange-50 px-4 py-3"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Limpar Duplicatas
          </Button>
          <Button
            onClick={handleCreateCustom}
            className="bg-[#B89B7A] hover:bg-[#A0895B] text-white px-6 py-3"
          >
            <Plus className="w-5 h-5 mr-2" />
            Criar Funil Personalizado
          </Button>
        </div>
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
                  <ThumbnailImage
                    src={template.image}
                    alt={template.name}
                    width={400}
                    height={240}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={() => {
                      console.warn(`Failed to load template image: ${template.image}`);
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
                      <ThumbnailImage
                        src={template.image}
                        alt={template.name}
                        width={400}
                        height={240}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={() => {
                          console.warn(`Failed to load custom template image: ${template.image}`);
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

      {/* Modal de Limpeza de Duplicatas */}
      <Dialog open={isCleanupModalOpen} onOpenChange={setIsCleanupModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-orange-600" />
              Limpeza de Funis Duplicados
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Status de escaneamento */}
            {isScanning && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-blue-700 font-medium">Escaneando localStorage em busca de duplicatas...</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Resultado do escaneamento */}
            {duplicateInfo && !isScanning && (
              <div className="space-y-4">
                <Card className="border-orange-200 bg-orange-50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-orange-800 mb-2">
                          Duplicatas Detectadas
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-orange-700">Total de itens: </span>
                            <span className="font-bold">{duplicateInfo.total}</span>
                          </div>
                          <div>
                            <span className="text-orange-700">Espaço usado: </span>
                            <span className="font-bold">
                              {(duplicateInfo.spaceToFree / 1024).toFixed(1)} KB
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lista de duplicatas */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3">Itens que serão removidos:</h4>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {duplicateInfo.duplicates.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm"
                        >
                          <span className="font-mono text-gray-700 truncate">
                            {item.name}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {(item.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Ações */}
                <div className="flex justify-between items-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsCleanupModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={executeCleanup}
                    disabled={isCleaningUp}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    {isCleaningUp ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Limpando...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir {duplicateInfo.total} itens
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Resultado da limpeza */}
            {cleanupResult && (
              <Card className={`border-2 ${cleanupResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {cleanupResult.success ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold mb-2 ${cleanupResult.success ? 'text-green-800' : 'text-red-800'}`}>
                        {cleanupResult.success ? 'Limpeza Concluída!' : 'Erro na Limpeza'}
                      </h3>
                      {cleanupResult.success ? (
                        <div className="text-sm text-green-700">
                          <p>✅ {cleanupResult.removedCount} itens removidos com sucesso</p>
                          <p>✅ Funis duplicados foram excluídos</p>
                          <p>✅ localStorage otimizado</p>
                        </div>
                      ) : (
                        <div className="text-sm text-red-700">
                          <p>❌ Erro: {cleanupResult.error}</p>
                          <p>Tente novamente ou entre em contato com o suporte</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Estado inicial */}
            {!duplicateInfo && !isScanning && (
              <Card className="border-gray-200">
                <CardContent className="p-8 text-center">
                  <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Limpeza de Funis Duplicados
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Esta ferramenta irá escanear e remover funis duplicados, temporários e obsoletos do seu navegador.
                  </p>
                  <Button
                    onClick={scanForDuplicates}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Iniciar Escaneamento
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FunnelPanelPage;
