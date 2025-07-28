import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// Componentes UI
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/toaster';

// Ícones
import {
  Save, Eye, Monitor, Tablet, Smartphone, Settings,
  FileText, History, FolderOpen, ArrowLeft, Play,
  Undo, Redo, Copy, Download, Upload, GripVertical
} from 'lucide-react';

// Componentes do Editor
import ComponentList from './ComponentList';
import PageEditorCanvas from './PageEditorCanvas';
import PropertiesPanel from './panels/PropertiesPanel';
import ConfigPanel from './panels/ConfigPanel';
import FunnelManagementPanel from './panels/FunnelManagementPanel';
import VersioningPanel from './panels/VersioningPanel';

// Hooks
import { useToast } from '@/hooks/use-toast';
import { useFunnelManager } from '@/hooks/useFunnelManager';
import { useVersionManager } from '@/hooks/useVersionManager';

// Interfaces e dados
import { QuizFunnel, QuizConfig, SimplePage, SimpleComponent } from '@/interfaces/quiz';
import { ComponentType } from '@/interfaces/editor';
import { COMPONENT_CATEGORIES } from '@/data/componentDefinitions';

// Estilos
import styles from '@/styles/editor/editor-modular.module.css';

// Estado inicial para o editor
const initialEditorState = {
  activeTab: 'editor',
  deviceView: 'desktop',
  selectedComponentId: null,
  dragOverIndex: null,
  currentPageIndex: 0,
  isDragging: false,
  isPreviewMode: false,
  activeConfigSection: 'domain'
};

const ModularQuizEditor: React.FC = () => {
  // States
  const [currentFunnel, setCurrentFunnel] = useState<QuizFunnel>({
    id: 'default',
    name: 'Quiz de Estilo Pessoal',
    pages: [],
    updatedAt: new Date().toISOString()
  });
  const [quizConfig, setQuizConfig] = useState<QuizConfig>({
    domain: '',
    seo: { title: '', description: '', keywords: '' },
    pixel: { facebookPixelId: '', googleAnalyticsId: '' },
    utm: { source: '', medium: '', campaign: '', content: '', term: '' },
    scoring: {
      normalQuestionPoints: 1,
      strategicQuestionPoints: 2,
      autoAdvanceNormal: false,
      autoAdvanceStrategic: false,
      normalSelectionLimit: 3,
      strategicSelectionLimit: 1
    },
    results: {
      showUserName: true,
      showPrimaryStyle: true,
      showSecondaryStyles: true,
      showPercentages: true,
      showStyleImages: true,
      showStyleGuides: true
    }
  });

  // Editor state
  const [activeTab, setActiveTab] = useState<'editor' | 'funis' | 'historico' | 'config'>(initialEditorState.activeTab as any);
  const [deviceView, setDeviceView] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(initialEditorState.selectedComponentId);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(initialEditorState.dragOverIndex);
  const [currentPageIndex, setCurrentPageIndex] = useState(initialEditorState.currentPageIndex);
  const [isDragging, setIsDragging] = useState(initialEditorState.isDragging);
  const [isPreviewMode, setIsPreviewMode] = useState(initialEditorState.isPreviewMode);
  const [activeConfigSection, setActiveConfigSection] = useState(initialEditorState.activeConfigSection);
  
  // Funnel & Version Management
  const { toast } = useToast();
  const { saveFunnel, loadFunnel, deleteFunnel, createBackup, restoreBackup } = useFunnelManager();
  const { 
    versions, 
    currentVersion, 
    saveVersion, 
    loadVersion, 
    deleteVersion, 
    clearHistory, 
    getVersionHistory, 
    getVersionMetadata 
  } = useVersionManager();
  const [funnels, setFunnels] = useState<QuizFunnel[]>([]);
  const [versionMetadata, setVersionMetadata] = useState<any>(null);
  const [isLoading, setIsLoading] = useState({
    funnels: false,
    versions: false,
    backup: false
  });

  // Derived state
  const currentPage = currentFunnel.pages[currentPageIndex] || null;
  const selectedComponent = currentPage?.components?.find(comp => comp.id === selectedComponentId) || null;

  // Inicializar o editor com uma página vazia se necessário
  useEffect(() => {
    if (currentFunnel.pages.length === 0) {
      setCurrentFunnel(prev => ({
        ...prev,
        pages: [{
          id: `page-${Date.now()}`,
          title: 'Página Inicial',
          type: 'intro',
          progress: 0,
          showHeader: true,
          showProgress: true,
          components: []
        }]
      }));
    }
  }, []);

  // Carregar funnels e histórico de versões
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(prev => ({ ...prev, funnels: true }));
      try {
        const savedFunnels = await loadFunnel();
        if (savedFunnels && Array.isArray(savedFunnels)) {
          setFunnels(savedFunnels);
        }
      } catch (error) {
        console.error("Erro ao carregar funis:", error);
        toast({
          title: "Erro ao carregar funis",
          description: "Não foi possível carregar seus funis salvos.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(prev => ({ ...prev, funnels: false }));
      }

      setIsLoading(prev => ({ ...prev, versions: true }));
      try {
        const versionHistory = await getVersionHistory();
        const metadata = await getVersionMetadata();
        if (versionHistory && Array.isArray(versionHistory)) {
          // versions já vem do hook, não precisamos de setVersions
        }
        if (metadata) {
          setVersionMetadata(metadata);
        }
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      } finally {
        setIsLoading(prev => ({ ...prev, versions: false }));
      }
    };

    loadData();
  }, []);

  // Manipulação de Componentes
  const handleDragStart = useCallback((e: React.DragEvent, componentType: ComponentType) => {
    e.dataTransfer.setData('componentType', JSON.stringify(componentType));
    setIsDragging(true);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    const componentTypeData = e.dataTransfer.getData('componentType');
    if (!componentTypeData || !currentPage) return;

    try {
      const componentType = JSON.parse(componentTypeData) as ComponentType;
      
      const newComponent: SimpleComponent = {
        id: `${componentType.type}-${Date.now()}`,
        type: componentType.type as any,
        data: componentType.defaultData || {},
        style: componentType.defaultData?.style || {}
      };
      
      const newComponents = [...(currentPage.components || [])];
      newComponents.splice(index, 0, newComponent);
      
      // Atualiza a página atual
      const updatedPages = [...currentFunnel.pages];
      updatedPages[currentPageIndex] = {
        ...currentPage,
        components: newComponents
      };
      
      setCurrentFunnel(prev => ({
        ...prev,
        pages: updatedPages
      }));
      
      // Seleciona o componente recém-adicionado
      setSelectedComponentId(newComponent.id);
      
      // Notifica o usuário
      toast({
        title: "Componente adicionado",
        description: `${componentType.name} foi adicionado à página.`,
        variant: "default"
      });
      
    } catch (error) {
      console.error("Erro ao adicionar componente:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o componente.",
        variant: "destructive"
      });
    } finally {
      setDragOverIndex(null);
      setIsDragging(false);
    }
  }, [currentFunnel, currentPage, currentPageIndex, toast]);

  const updateComponent = useCallback((componentId: string, newData: Partial<SimpleComponent['data']>) => {
    if (!currentPage) return;
    
    const updatedComponents = currentPage.components.map(comp => 
      comp.id === componentId
        ? { ...comp, ...newData }
        : comp
    );
    
    const updatedPages = [...currentFunnel.pages];
    updatedPages[currentPageIndex] = {
      ...currentPage,
      components: updatedComponents
    };
    
    setCurrentFunnel(prev => ({
      ...prev,
      pages: updatedPages,
      updatedAt: new Date().toISOString()
    }));
  }, [currentFunnel, currentPage, currentPageIndex]);

  const deleteComponent = useCallback((componentId: string) => {
    if (!currentPage) return;
    
    const updatedComponents = currentPage.components.filter(comp => comp.id !== componentId);
    
    const updatedPages = [...currentFunnel.pages];
    updatedPages[currentPageIndex] = {
      ...currentPage,
      components: updatedComponents
    };
    
    setCurrentFunnel(prev => ({
      ...prev,
      pages: updatedPages,
      updatedAt: new Date().toISOString()
    }));
    
    setSelectedComponentId(null);
    
    toast({
      title: "Componente removido",
      description: "O componente foi removido da página.",
      variant: "default"
    });
  }, [currentFunnel, currentPage, currentPageIndex, toast]);

  const duplicateComponent = useCallback((componentId: string) => {
    if (!currentPage) return;
    
    const componentToDuplicate = currentPage.components.find(comp => comp.id === componentId);
    if (!componentToDuplicate) return;
    
    const duplicatedComponent = {
      ...componentToDuplicate,
      id: `${componentToDuplicate.type}-${Date.now()}`,
    };
    
    const componentIndex = currentPage.components.findIndex(comp => comp.id === componentId);
    
    const updatedComponents = [...currentPage.components];
    updatedComponents.splice(componentIndex + 1, 0, duplicatedComponent);
    
    const updatedPages = [...currentFunnel.pages];
    updatedPages[currentPageIndex] = {
      ...currentPage,
      components: updatedComponents
    };
    
    setCurrentFunnel(prev => ({
      ...prev,
      pages: updatedPages,
      updatedAt: new Date().toISOString()
    }));
    
    setSelectedComponentId(duplicatedComponent.id);
    
    toast({
      title: "Componente duplicado",
      description: "Uma cópia do componente foi criada.",
      variant: "default"
    });
  }, [currentFunnel, currentPage, currentPageIndex, toast]);

  // Funções de Gerenciamento de Páginas
  const addNewPage = useCallback(() => {
    const newPage: SimplePage = {
      id: `page-${Date.now()}`,
      title: `Página ${currentFunnel.pages.length + 1}`,
      type: 'content',
      progress: Math.min(Math.ceil((currentFunnel.pages.length + 1) / Math.max(currentFunnel.pages.length + 1, 10) * 100), 100),
      showHeader: true,
      showProgress: true,
      components: []
    };
    
    setCurrentFunnel(prev => ({
      ...prev,
      pages: [...prev.pages, newPage],
      updatedAt: new Date().toISOString()
    }));
    
    setCurrentPageIndex(currentFunnel.pages.length);
    setSelectedComponentId(null);
    
    toast({
      title: "Página adicionada",
      description: "Uma nova página foi adicionada ao funil.",
      variant: "default"
    });
  }, [currentFunnel, toast]);

  const updateCurrentPage = useCallback((updates: Partial<SimplePage>) => {
    if (!currentPage) return;
    
    const updatedPages = [...currentFunnel.pages];
    updatedPages[currentPageIndex] = {
      ...currentPage,
      ...updates
    };
    
    setCurrentFunnel(prev => ({
      ...prev,
      pages: updatedPages,
      updatedAt: new Date().toISOString()
    }));
  }, [currentFunnel, currentPage, currentPageIndex]);

  const deletePage = useCallback(() => {
    if (currentFunnel.pages.length <= 1) {
      toast({
        title: "Não é possível excluir",
        description: "Você precisa ter pelo menos uma página no funil.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedPages = currentFunnel.pages.filter((_, index) => index !== currentPageIndex);
    
    setCurrentFunnel(prev => ({
      ...prev,
      pages: updatedPages,
      updatedAt: new Date().toISOString()
    }));
    
    setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
    setSelectedComponentId(null);
    
    toast({
      title: "Página removida",
      description: "A página foi removida do funil.",
      variant: "default"
    });
  }, [currentFunnel, currentPageIndex, toast]);

  // Funções de Gerenciamento de Funil
  const handleCreateBackup = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, backup: true }));
    try {
      await createBackup(currentFunnel);
      toast({
        title: "Backup criado",
        description: "Um backup do funil atual foi criado com sucesso.",
        variant: "default"
      });
    } catch (error) {
      console.error("Erro ao criar backup:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o backup do funil.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, backup: false }));
    }
  }, [currentFunnel, createBackup, toast]);

  const handleRestoreBackup = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, backup: true }));
    try {
      const restored = await restoreBackup();
      if (restored) {
        setCurrentFunnel(restored);
        setCurrentPageIndex(0);
        setSelectedComponentId(null);
        toast({
          title: "Backup restaurado",
          description: "O funil foi restaurado com sucesso.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Erro ao restaurar backup:", error);
      toast({
        title: "Erro",
        description: "Não foi possível restaurar o backup do funil.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, backup: false }));
    }
  }, [restoreBackup, toast]);

  const handleLoadFunnel = useCallback(async (funnelId: string) => {
    setIsLoading(prev => ({ ...prev, funnels: true }));
    try {
      const funnel = await loadFunnel(funnelId);
      if (funnel) {
        setCurrentFunnel(funnel);
        setCurrentPageIndex(0);
        setSelectedComponentId(null);
        toast({
          title: "Funil carregado",
          description: "O funil selecionado foi carregado com sucesso.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Erro ao carregar funil:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o funil selecionado.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, funnels: false }));
    }
  }, [loadFunnel, toast]);

  const handleDeleteFunnel = useCallback(async (funnelId: string) => {
    setIsLoading(prev => ({ ...prev, funnels: true }));
    try {
      await deleteFunnel(funnelId);
      setFunnels(prev => prev.filter(f => f.id !== funnelId));
      toast({
        title: "Funil excluído",
        description: "O funil selecionado foi excluído com sucesso.",
        variant: "default"
      });
    } catch (error) {
      console.error("Erro ao excluir funil:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o funil selecionado.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, funnels: false }));
    }
  }, [deleteFunnel, toast]);

  // Funções de Configuração do Quiz
  const updateQuizConfig = useCallback((updates: Partial<QuizConfig>) => {
    setQuizConfig(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const updateConfig = useCallback(<K extends keyof QuizConfig>(
    section: K,
    updates: Partial<QuizConfig[K]>
  ) => {
    setQuizConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updates
      }
    }));
  }, []);

  const saveChanges = useCallback(async () => {
    try {
      await saveFunnel(currentFunnel);
      await saveVersion(currentFunnel, "Auto-salvo");
      
      // Atualizar lista de funnels e versões após salvar
      const savedFunnels = await loadFunnel();
      const versionHistory = await getVersionHistory();
      const metadata = await getVersionMetadata();
      
      if (savedFunnels && Array.isArray(savedFunnels)) {
        setFunnels(savedFunnels);
      }
      
      if (versionHistory && Array.isArray(versionHistory)) {
        setVersions(versionHistory);
      }
      
      if (metadata) {
        setVersionMetadata(metadata);
      }
      
      toast({
        title: "Funil salvo",
        description: "Todas as alterações foram salvas com sucesso.",
        variant: "default"
      });
    } catch (error) {
      console.error("Erro ao salvar funil:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive"
      });
    }
  }, [currentFunnel, saveFunnel, saveVersion, loadFunnel, getVersionHistory, getVersionMetadata, toast]);

  const openPreview = useCallback(() => {
    // Implementar abertura de preview em nova aba
    window.open(`/preview?funnel=${encodeURIComponent(JSON.stringify(currentFunnel))}`, '_blank');
  }, [currentFunnel]);

  // Render
  return (
    <div className={styles.editorLayout}>
      {/* Header do Editor */}
      <header className={styles.editorHeader}>
        <nav className={styles.editorHeaderNav}>
          <div className={styles.editorHeaderGroup}>
            <Button
              variant="link"
              size="icon"
              className={styles.editorHeaderLinkButton}
              onClick={() => window.history.back()}
              title="Voltar"
            >
              <ArrowLeft className={styles.icon} />
            </Button>
            
            <Button
              variant="link"
              size="icon"
              className={styles.editorHeaderLinkButton}
              disabled
              title="Desfazer"
            >
              <Undo className={styles.icon} />
            </Button>
            
            <Button
              variant="link"
              size="icon"
              className={styles.editorHeaderLinkButton}
              disabled
              title="Refazer"
            >
              <Redo className={styles.icon} />
            </Button>
            
            <Button
              variant="link"
              size="icon"
              className={styles.editorHeaderLinkButton}
              onClick={() => saveChanges()}
              title="Salvar"
            >
              <Save className={styles.icon} />
            </Button>
          </div>
          
          <div className={styles.editorHeaderGroup}>
            <Button
              variant="link"
              size="icon"
              className={`${styles.editorHeaderLinkButton} ${deviceView === 'desktop' ? styles.active : ''}`}
              onClick={() => setDeviceView('desktop')}
              title="Visualização Desktop"
            >
              <Monitor className={styles.icon} />
            </Button>
            
            <Button
              variant="link"
              size="icon"
              className={`${styles.editorHeaderLinkButton} ${deviceView === 'tablet' ? styles.active : ''}`}
              onClick={() => setDeviceView('tablet')}
              title="Visualização Tablet"
            >
              <Tablet className={styles.icon} />
            </Button>
            
            <Button
              variant="link"
              size="icon"
              className={`${styles.editorHeaderLinkButton} ${deviceView === 'mobile' ? styles.active : ''}`}
              onClick={() => setDeviceView('mobile')}
              title="Visualização Mobile"
            >
              <Smartphone className={styles.icon} />
            </Button>
            
            <Button
              variant="link"
              size="icon"
              className={styles.editorHeaderLinkButton}
              onClick={() => openPreview()}
              title="Abrir Preview"
            >
              <Play className={styles.icon} />
            </Button>
          </div>
          
          <div className={styles.editorHeaderGroup}>
            <Tabs
              defaultValue="editor"
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as any)}
              className="flex h-10"
            >
              <TabsList className="bg-transparent p-0 gap-1">
                <TabsTrigger
                  value="editor"
                  className={`h-8 px-3 text-xs ${activeTab === 'editor' ? 'bg-amber-50 text-amber-900' : 'bg-transparent text-gray-600'}`}
                >
                  Construtor
                </TabsTrigger>
                <TabsTrigger
                  value="funis"
                  className={`h-8 px-3 text-xs ${activeTab === 'funis' ? 'bg-amber-50 text-amber-900' : 'bg-transparent text-gray-600'}`}
                >
                  Funis
                </TabsTrigger>
                <TabsTrigger
                  value="historico"
                  className={`h-8 px-3 text-xs ${activeTab === 'historico' ? 'bg-amber-50 text-amber-900' : 'bg-transparent text-gray-600'}`}
                >
                  Histórico
                </TabsTrigger>
                <TabsTrigger
                  value="config"
                  className={`h-8 px-3 text-xs ${activeTab === 'config' ? 'bg-amber-50 text-amber-900' : 'bg-transparent text-gray-600'}`}
                >
                  Configurações
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </nav>
      </header>
      
      {/* Coluna Esquerda - Etapas */}
      <div className={styles.stepsSidebar}>
        <div className={styles.stepsHeader}>
          <h2 className="text-sm font-semibold">Páginas do Quiz</h2>
          <p className="text-xs text-muted-foreground">
            {currentPageIndex + 1} de {currentFunnel.pages.length}
          </p>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="py-2">
            {currentFunnel.pages.map((page, index) => (
              <button
                key={page.id}
                className={`${styles.stepButton} ${currentPageIndex === index ? styles.active : ''}`}
                onClick={() => {
                  setCurrentPageIndex(index);
                  setSelectedComponentId(null);
                }}
              >
                <GripVertical className={styles.gripIcon} />
                <div className="ml-2 flex-1 overflow-hidden text-left">
                  <div className="truncate">{page.title || `Página ${index + 1}`}</div>
                  <div className="text-xs opacity-60">
                    {page.components.length} componentes
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="p-3 space-y-2">
            <Button size="sm" className="w-full" onClick={addNewPage}>
              Adicionar Página
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={deletePage}
              disabled={currentFunnel.pages.length <= 1}
            >
              Remover Página
            </Button>
          </div>
          
          <Separator className="my-4" />
          
          <div className="p-3">
            <div className="text-xs font-semibold mb-2">Progresso: {currentPage?.progress || 0}%</div>
            <div className="w-full bg-gray-100 rounded h-1">
              <div
                className="bg-gradient-to-r from-[#B89B7A] to-[#432818] h-1 rounded"
                style={{ width: `${currentPage?.progress || 0}%` }}
              />
            </div>
          </div>
        </ScrollArea>
      </div>
      
      {/* Coluna Meio-Esquerda - Componentes */}
      <div className={styles.componentsSidebar}>
        <div className={styles.componentsHeader}>
          <h2 className="text-sm font-semibold">Componentes</h2>
          <p className="text-xs text-muted-foreground">
            Arraste para o canvas
          </p>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-4">
            {Object.values(COMPONENT_CATEGORIES).map((category) => (
              <div key={category.title} className="space-y-2">
                <h3 className={`text-xs font-semibold`} style={{color: category.color === 'blue' ? '#1d4ed8' : category.color === 'green' ? '#15803d' : '#ea580c'}}>
                  {category.title}
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {category.components.map((compType) => {
                    const Icon = compType.icon;
                    return (
                      <div
                        key={compType.type}
                        className={styles.componentItem}
                        draggable
                        onDragStart={(e) => handleDragStart(e, compType)}
                      >
                        <Icon className={styles.icon} />
                        <div className="font-medium text-xs">
                          {compType.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      {/* Coluna Central - Canvas */}
      <PageEditorCanvas
        currentPage={currentPage}
        deviceView={deviceView}
        selectedComponent={selectedComponentId}
        setSelectedComponent={setSelectedComponentId}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        dragOverIndex={dragOverIndex}
        deleteComponent={deleteComponent}
        duplicateComponent={duplicateComponent}
      />
      
      {/* Coluna Direita - Propriedades */}
      <div className={styles.propertiesSidebar}>
        <div className={styles.propertiesHeader}>
          <h2 className="text-sm font-semibold">Propriedades</h2>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-3">
            <TabsContent value="editor" className="mt-0">
              {selectedComponent ? (
                <PropertiesPanel
                  selectedComponent={selectedComponent}
                  updateComponent={updateComponent}
                  deleteComponent={deleteComponent}
                />
              ) : (
                <div className="text-center text-muted-foreground mt-8">
                  <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    Selecione um componente para editar suas propriedades
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="config" className="mt-0">
              <ConfigPanel
                quizConfig={quizConfig}
                updateQuizConfig={updateQuizConfig}
                updateConfig={updateConfig}
              />
            </TabsContent>
            
            <TabsContent value="funis" className="mt-0">
              <FunnelManagementPanel
                funnels={funnels}
                currentFunnel={currentFunnel}
                handleLoadFunnel={handleLoadFunnel}
                handleDeleteFunnel={handleDeleteFunnel}
                isLoading={isLoading.funnels}
              />
            </TabsContent>
            
            <TabsContent value="historico" className="mt-0">
              <VersioningPanel
                versions={versions}
                currentVersionId={versionMetadata?.currentVersion}
                loadVersion={(version) => loadVersion(version)}
                deleteVersion={() => {}}  // Implementar função deleteVersion
                clearHistory={clearHistory}
                isLoading={isLoading.versions}
              />
            </TabsContent>
          </div>
        </ScrollArea>
      </div>
      
      <Toaster />
    </div>
  );
};

export default ModularQuizEditor;
