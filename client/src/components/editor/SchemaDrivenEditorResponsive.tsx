import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Menu, 
  Settings, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Save, 
  Eye,
  Plus,
  Upload,
  ExternalLink,
  Globe,
  Copy,
  Link,
  X
} from 'lucide-react';
import { useSupabaseEditor } from '@/hooks/useSupabaseEditor';
import { SchemaDrivenComponentsSidebar } from './sidebar/SchemaDrivenComponentsSidebar';
import { DynamicPropertiesPanel } from './panels/DynamicPropertiesPanel';
import { DroppableCanvas } from './dnd/DroppableCanvas';
import { blockDefinitions } from '@/config/blockDefinitions';

interface SchemaDrivenEditorResponsiveProps {
  funnelId?: string;
  className?: string;
}

type DeviceView = 'mobile' | 'tablet' | 'desktop';

const SchemaDrivenEditorResponsive: React.FC<SchemaDrivenEditorResponsiveProps> = ({
  funnelId,
  className = ''
}) => {
  const [deviceView, setDeviceView] = useState<DeviceView>('desktop'); // Voltar ao padrão
  const [showLeftSidebar, setShowLeftSidebar] = useState(true); 
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState<'components' | 'pages'>('pages');

  // Estados para URL personalizada e preview
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [urlSlug, setUrlSlug] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState('');

  // Função para gerar ID único (integrada do EditorPage)
  const generateId = () => {
    return `editor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Hook principal do editor
  const {
    funnel,
    currentPage,
    currentPageId,
    selectedBlock,
    selectedBlockId,
    setCurrentPage,
    setSelectedBlock,
    updatePage,
    updateFunnelConfig,
    addBlock,
    updateBlock,
    deleteBlock,
    saveFunnel,
    createNewFunnel,
    publishFunnel,
    isLoading,
    isSaving,
    autoSaveState
  } = useSupabaseEditor(funnelId || undefined);

  // Debug - verificar se o funnel está chegando corretamente
  console.log('🔍 DEBUG SchemaDrivenEditorResponsive - PROPS:', { funnelId });
  console.log('🔍 DEBUG SchemaDrivenEditorResponsive - funnel:', funnel);
  console.log('🔍 DEBUG SchemaDrivenEditorResponsive - funnel.pages:', funnel?.pages?.length || 0);
  console.log('🔍 DEBUG SchemaDrivenEditorResponsive - currentPage:', currentPage?.name || 'null');
  console.log('🔍 DEBUG SchemaDrivenEditorResponsive - isLoading:', isLoading);

  // Effect para monitorar mudanças no funnel
  useEffect(() => {
    console.log('🔄 Funnel changed in SchemaDrivenEditorResponsive:', {
      funnelExists: !!funnel,
      funnelId: funnel?.id,
      funnelName: funnel?.name,
      pagesCount: funnel?.pages?.length || 0
    });
  }, [funnel]);

  // Estado de debug para mostrar na tela
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    const info = `
    Funnel: ${funnel ? `✅ ${funnel.id} (${funnel.pages?.length || 0} páginas)` : '❌ NULL'}
    Loading: ${isLoading ? '⏳' : '✅'}
    Current Page: ${currentPage ? currentPage.name : 'null'}
    `;
    setDebugInfo(info);
  }, [funnel, isLoading, currentPage]);

  // Handlers
  const handleComponentSelect = (type: string) => {
    const definition = blockDefinitions.find((def: any) => def.type === type);
    if (definition && currentPage) {
      const defaultProperties: Record<string, any> = {};
      definition.propertiesSchema?.forEach((prop: any) => {
        if (prop.defaultValue !== undefined) {
          defaultProperties[prop.key] = prop.defaultValue;
        }
      });
      addBlock({
        type,
        properties: defaultProperties
      });
    }
  };

  const handleBlockPropertyChange = (key: string, value: any) => {
    if (!selectedBlockId) return;
    const selectedBlock = currentPage?.blocks.find(b => b.id === selectedBlockId);
    if (!selectedBlock) return;

    const newProperties = {
      ...selectedBlock.properties,
      [key]: value
    };

    updateBlock(selectedBlockId, { properties: newProperties });
  };

  const handleNestedPropertyChange = (path: string, value: any) => {
    if (!selectedBlockId) return;
    const selectedBlock = currentPage?.blocks.find(b => b.id === selectedBlockId);
    if (!selectedBlock) return;

    const newProperties = { ...selectedBlock.properties };
    const pathArray = path.split('.');
    let current = newProperties;
    
    for (let i = 0; i < pathArray.length - 1; i++) {
      if (!current[pathArray[i]]) current[pathArray[i]] = {};
      current = current[pathArray[i]];
    }
    current[pathArray[pathArray.length - 1]] = value;

    updateBlock(selectedBlockId, { properties: newProperties });
  };

  const handleInlineEdit = (blockId: string, updates: Partial<any>) => {
    if (updates.properties) {
      updateBlock(blockId, updates);
    }
  };

  const handleSave = () => {
    console.log('🎯 handleSave clicked - Debug Info:', {
      funnelExists: !!funnel,
      funnelId: funnel?.id,
      funnelName: funnel?.name,
      pagesCount: funnel?.pages?.length || 0,
      currentPageId,
      currentPageBlocks: currentPage?.blocks?.length || 0
    });
    
    console.log('✅ Calling saveFunnel (emergency recovery built-in)...');
    saveFunnel(true);
  };

  // ==================== SISTEMA SAVE/PUBLISH INTEGRADO ====================
  const handleSaveProject = () => {
    const projectData = {
      funnel: funnel,
      currentPage: currentPage,
      blocks: currentPage?.blocks || [],
      timestamp: new Date().toISOString(),
      version: '2.0.0', // Schema Editor version
      id: generateId(),
      metadata: {
        totalBlocks: currentPage?.blocks.length || 0,
        totalPages: funnel?.pages?.length || 0,
        lastModified: new Date().toISOString(),
        creator: 'schema-editor-user',
        funnelName: funnel?.name || 'Unnamed Funnel',
        deviceView: deviceView,
        activeTab: activeTab
      }
    };
    
    console.log('💾 Salvando projeto completo (Schema Editor):', projectData);
    
    // 1. Salvar no localStorage (backup local)
    localStorage.setItem('schema-editor-project-current', JSON.stringify(projectData));
    localStorage.setItem('schema-editor-project-backup', JSON.stringify(projectData));
    
    // 2. Salvar no sistema de versões
    const existingProjects = JSON.parse(localStorage.getItem('schema-editor-saved-projects') || '[]');
    existingProjects.push(projectData);
    
    // Manter apenas últimos 10 projetos
    if (existingProjects.length > 10) {
      existingProjects.splice(0, existingProjects.length - 10);
    }
    
    localStorage.setItem('schema-editor-saved-projects', JSON.stringify(existingProjects));
    
    // 3. Preparar para publicação futura (API)
    console.log('📡 Projeto Schema preparado para publicação:', {
      id: projectData.id,
      funnel: projectData.funnel?.name,
      pages: projectData.metadata.totalPages,
      blocks: projectData.metadata.totalBlocks,
      timestamp: projectData.timestamp
    });
    
    // 4. Salvar também no sistema original para compatibilidade
    const compatibilityData = {
      blocks: currentPage?.blocks || [],
      timestamp: new Date().toISOString(),
      version: '2.0.0-schema',
      id: projectData.id,
      metadata: {
        ...projectData.metadata,
        editorType: 'schema-driven-responsive'
      }
    };
    
    const originalProjects = JSON.parse(localStorage.getItem('editor-saved-projects') || '[]');
    originalProjects.push(compatibilityData);
    localStorage.setItem('editor-saved-projects', JSON.stringify(originalProjects));
    
    alert(`✅ Projeto Schema salvo com sucesso!\n\n📊 Funil: ${funnel?.name}\n📄 ${projectData.metadata.totalPages} página${projectData.metadata.totalPages !== 1 ? 's' : ''}\n🧩 ${projectData.metadata.totalBlocks} bloco${projectData.metadata.totalBlocks !== 1 ? 's' : ''}\n🆔 ID: ${projectData.id}\n📱 Device: ${deviceView}\n� Tab: ${activeTab}\n�🕒 ${new Date().toLocaleString()}\n\n💡 Use "Publicar" para disponibilizar online.\n📋 Compatível com Editor Original`);
  };

  const handlePublishProject = () => {
    const currentProject = localStorage.getItem('schema-editor-project-current');
    
    if (!currentProject) {
      alert('❌ Nenhum projeto para publicar. Salve primeiro!');
      return;
    }
    
    // Abrir modal para configurar URL personalizada
    setShowPublishModal(true);
    const projectData = JSON.parse(currentProject);
    
    // Gerar slug padrão baseado no nome do funil
    const defaultSlug = projectData.funnel?.name
      ?.toLowerCase()
      ?.replace(/[^a-z0-9]/g, '-')
      ?.replace(/-+/g, '-')
      ?.replace(/^-|-$/g, '') || `quiz-${Date.now()}`;
    
    setUrlSlug(defaultSlug);
  };

  const handleConfirmPublish = () => {
    const currentProject = localStorage.getItem('schema-editor-project-current');
    if (!currentProject) return;
    
    const projectData = JSON.parse(currentProject);
    const finalSlug = urlSlug || `quiz-${projectData.id}`;
    const baseUrl = customUrl || window.location.origin;
    const fullUrl = `${baseUrl}/${finalSlug}`;
    
    // Criar dados de publicação
    const publishData = {
      ...projectData,
      publishedAt: new Date().toISOString(),
      status: 'published',
      url: fullUrl,
      slug: finalSlug,
      customDomain: customUrl,
      publishSettings: {
        allowIndexing: true,
        socialSharing: true,
        analytics: true
      }
    };
    
    console.log('🌐 Publicando projeto com URL personalizada:', publishData);
    
    // Salvar estado publicado
    localStorage.setItem('schema-editor-project-published', JSON.stringify(publishData));
    localStorage.setItem(`published-quiz-${finalSlug}`, JSON.stringify(publishData));
    
    // Atualizar estado
    setPublishedUrl(fullUrl);
    setShowPublishModal(false);
    
    alert(`🌐 Quiz publicado com sucesso!\n\n📊 ${publishData.funnel?.name}\n🌐 URL: ${fullUrl}\n� ${publishData.metadata.totalPages} páginas\n🧩 ${publishData.metadata.totalBlocks} componentes\n🕒 ${new Date().toLocaleString()}\n\n✅ Acesse seu quiz pela URL personalizada!`);
  };

  const handlePreview = () => {
    const currentProject = localStorage.getItem('schema-editor-project-current');
    if (!currentProject) {
      alert('❌ Salve o projeto primeiro para visualizar o preview!');
      return;
    }
    
    const projectData = JSON.parse(currentProject);
    
    // Salvar dados temporários para preview
    const previewData = {
      ...projectData,
      isPreview: true,
      previewId: `preview-${Date.now()}`
    };
    
    localStorage.setItem('quiz-preview-data', JSON.stringify(previewData));
    
    // Abrir preview em nova aba
    const previewUrl = `/preview?id=${previewData.previewId}`;
    window.open(previewUrl, '_blank');
  };

  const copyUrlToClipboard = () => {
    if (publishedUrl) {
      navigator.clipboard.writeText(publishedUrl).then(() => {
        alert('📋 URL copiada para a área de transferência!');
      });
    }
  };

  const handleLoadProject = () => {
    try {
      const savedProjects = JSON.parse(localStorage.getItem('schema-editor-saved-projects') || '[]');
      
      if (savedProjects.length === 0) {
        alert('❌ Nenhum projeto Schema salvo encontrado.');
        return;
      }
      
      // Carregar projeto mais recente
      const latestProject = savedProjects[savedProjects.length - 1];
      
      if (latestProject.funnel && latestProject.currentPage) {
        // Aqui você precisaria implementar a lógica de restaurar o funnel completo
        // Por enquanto, apenas atualizamos a página atual
        if (latestProject.currentPage.blocks) {
          updatePage(latestProject.currentPage.id, { blocks: latestProject.currentPage.blocks });
        }
        
        console.log('✅ Projeto Schema carregado:', latestProject);
        alert(`✅ Projeto Schema carregado!\n\n📊 Funil: ${latestProject.metadata.funnelName}\n📄 ${latestProject.metadata.totalPages} páginas\n🧩 ${latestProject.metadata.totalBlocks} blocos restaurados\n🕒 Salvo em: ${new Date(latestProject.timestamp).toLocaleString()}`);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar projeto Schema:', error);
      alert('❌ Erro ao carregar projeto Schema salvo.');
    }
  };
  // ======================================================================

  // Auto-create funnel se necessário
  useEffect(() => {
    if (!funnel && !isLoading && !funnelId) {
      createNewFunnel();
    }
  }, [funnel, isLoading, funnelId, createNewFunnel]);

  // DEBUG: Log estado das sidebars
  useEffect(() => {
    console.log('🔍 DEBUG Estado:', { 
      deviceView, 
      showLeftSidebar, 
      showRightSidebar,
      windowWidth: window.innerWidth 
    });
    
    // Log específico para mobile
    if (deviceView === 'mobile') {
      console.log('📱 MOBILE MODE:', {
        leftSidebarVisible: showLeftSidebar,
        rightSidebarVisible: showRightSidebar,
        shouldShowSidebars: 'Sidebars devem aparecer no mobile se showLeftSidebar/showRightSidebar for true'
      });
    }
  }, [deviceView, showLeftSidebar, showRightSidebar]);

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="inline-flex items-center px-4 py-2 bg-white rounded-lg shadow-sm border">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#B89B7A] mr-3"></div>
          <span className="text-gray-700">Carregando...</span>
        </div>
      </div>
    );
  }

  // No funnel state
  if (!funnel) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center px-6 py-3 bg-white rounded-lg shadow-sm border">
            <span className="text-gray-700 mr-3">Nenhum funil encontrado</span>
            <Button onClick={createNewFunnel} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Criar Novo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className={`h-screen flex flex-col overflow-hidden bg-gray-50 ${className}`}>
        {/* Debug Info - Temporário */}
        <div className="bg-red-100 border-b border-red-200 p-2 text-xs font-mono text-red-800">
          <strong>🐛 DEBUG INFO:</strong> {debugInfo}
        </div>
        
        {/* Header Responsivo */}
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            {/* Info do funil */}
            <div className="flex items-center space-x-2 min-w-0">
              <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <span className="font-medium text-gray-800 truncate">{funnel?.name || 'Carregando...'}</span>
              {funnel && (
                <Badge variant={funnel.isPublished ? 'default' : 'secondary'} className="text-xs hidden sm:inline-flex">
                  {funnel.isPublished ? 'Publicado' : 'Rascunho'}
                </Badge>
              )}
            </div>

            {/* Info da página atual */}
            {currentPage && (
              <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-600">
                <span>•</span>
                <span className="truncate">{currentPage.title}</span>
                <Badge variant="outline" className="text-xs">
                  {currentPage.blocks.length} bloco{currentPage.blocks.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Status */}
            <div className="hidden sm:flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isSaving ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
              }`} />
              <span className="text-xs text-gray-600">
                {isSaving ? 'Salvando...' : 'Online'}
              </span>
            </div>

            {/* Botões Mobile - SEMPRE VISÍVEIS EM MÓBILE */}
            <div className="flex space-x-2 md:hidden">
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  console.log('🔄 Toggleing left sidebar:', !showLeftSidebar);
                  setShowLeftSidebar(!showLeftSidebar);
                  if (showRightSidebar) setShowRightSidebar(false);
                }}
                className={`text-white text-xs px-3 py-2 ${
                  showLeftSidebar 
                    ? 'bg-blue-700 hover:bg-blue-800' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <Menu className="w-4 h-4 mr-1" />
                Componentes
              </Button>
              <Button
                variant="default" 
                size="sm"
                onClick={() => {
                  console.log('🔄 Toggleing right sidebar:', !showRightSidebar);
                  setShowRightSidebar(!showRightSidebar);
                  if (showLeftSidebar) setShowLeftSidebar(false);
                }}
                className={`text-white text-xs px-3 py-2 ${
                  showRightSidebar 
                    ? 'bg-green-700 hover:bg-green-800' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                <Settings className="w-4 h-4 mr-1" />
                Props
              </Button>
            </div>

            {/* Device Controls */}
            <div className="hidden lg:flex border rounded-md">
              <Button
                variant={deviceView === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setDeviceView('mobile');
                  // Removidas linhas que escondiam sidebars automaticamente no mobile
                  // As sidebars agora permanecem no estado atual escolhido pelo usuário
                }}
                className="rounded-r-none px-2"
              >
                <Smartphone className="w-4 h-4" />
              </Button>
              <Button
                variant={deviceView === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setDeviceView('tablet');
                  setShowLeftSidebar(true);
                  setShowRightSidebar(true);
                }}
                className="rounded-none px-2"
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={deviceView === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setDeviceView('desktop');
                  setShowLeftSidebar(true);
                  setShowRightSidebar(true);
                }}
                className="rounded-l-none px-2"
              >
                <Monitor className="w-4 h-4" />
              </Button>
            </div>

            {/* Actions - SISTEMA SAVE/PUBLISH INTEGRADO */}
            <div className="hidden md:flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLoadProject}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Carregar
              </Button>
              
              <Button variant="outline" size="sm" onClick={() => saveFunnel(true)}>
                <Save className="w-4 h-4 mr-1" />
                Backup
              </Button>
            </div>

            <Button variant="outline" size="sm" className="hidden sm:inline-flex">
              <Eye className="w-4 h-4 mr-1" />
              <span className="hidden lg:inline">Preview</span>
            </Button>

            {/* Botões Save/Publish principais */}
            <Button 
              onClick={handleSaveProject} 
              size="sm"
              variant="outline"
            >
              <Save className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Salvar</span>
            </Button>

            <Button 
              onClick={handlePreview} 
              size="sm" 
              variant="outline"
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
            >
              <Eye className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Preview</span>
            </Button>

            <Button 
              onClick={handlePublishProject} 
              size="sm" 
              variant="default" 
              className="bg-green-600 hover:bg-green-700"
            >
              <Globe className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Publicar</span>
            </Button>

            {publishedUrl && (
              <Button 
                onClick={copyUrlToClipboard}
                size="sm" 
                variant="outline"
                className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
              >
                <Copy className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Copiar URL</span>
              </Button>
            )}

            <Button 
              size="sm" 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#B89B7A] hover:bg-[#a08965] px-3"
            >
              <Save className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">{isSaving ? 'Salvando...' : 'Auto-Save'}</span>
            </Button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Overlay para mobile quando sidebar está aberta - TESTE FORÇADO */}
          {(showLeftSidebar || showRightSidebar) && deviceView === 'mobile' && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => {
                console.log('🔄 Overlay clicked - closing sidebars');
                setShowLeftSidebar(false);
                setShowRightSidebar(false);
              }}
            />
          )}

          {/* Left Sidebar - RESPONSIVE */}
          {showLeftSidebar && (
            <div 
              className={`
                ${deviceView === 'mobile' 
                  ? 'fixed top-14 left-0 bottom-0 w-80 z-50 bg-white shadow-2xl border-r border-gray-300' 
                  : deviceView === 'tablet'
                  ? 'relative w-64 bg-white border-r border-gray-200'
                  : 'relative w-80 bg-white border-r border-gray-200'
                } 
                flex flex-col
              `}
              style={{ 
                display: 'flex',
                visibility: 'visible',
                opacity: 1
              }}
            >
              <div className="flex items-center justify-between p-3 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Componentes</h2>
                {deviceView === 'mobile' && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      console.log('🔄 Closing left sidebar from X button');
                      setShowLeftSidebar(false);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    ×
                  </Button>
                )}
              </div>
            <div className="flex-1 overflow-hidden">
              <SchemaDrivenComponentsSidebar 
                onComponentSelect={(type) => {
                  console.log('🔄 Component selected:', type);
                  handleComponentSelect(type);
                  // Removida lógica que fechava sidebar automaticamente
                  // A sidebar agora permanece aberta para melhor experiência do usuário
                }}
                activeTab={activeTab}
                onTabChange={(tab: string) => {
                  console.log('🔄 Tab changed to:', tab);
                  console.log('🔍 DEBUG - Funnel pages available:', funnel?.pages?.length || 0);
                  setActiveTab(tab as "pages" | "components");
                }}
                funnelPages={funnel?.pages || []}
                currentPageId={currentPageId ?? undefined}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
          )}
          
          {/* Central Canvas */}
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <div className="flex-1 overflow-auto flex justify-center">
              <div className={`
                ${deviceView === 'mobile' 
                  ? 'w-full max-w-sm mx-auto p-2' 
                  : deviceView === 'tablet'
                  ? 'w-full max-w-2xl mx-auto p-4'
                  : 'w-full max-w-4xl mx-auto p-6'
                }
              `}>
                {deviceView === 'mobile' ? (
                  <div className="w-full max-w-sm bg-white rounded-lg shadow-sm min-h-[calc(100vh-120px)] mx-auto">
                    <div className="p-4">
                      <DroppableCanvas
                        blocks={currentPage?.blocks || []}
                        selectedBlockId={selectedBlockId || undefined}
                        onBlockSelect={(blockId) => setSelectedBlock(blockId)}
                        onBlockDelete={deleteBlock}
                        onBlockDuplicate={(blockId) => {
                          const block = currentPage?.blocks.find(b => b.id === blockId);
                          if (block && currentPage) {
                            const newBlock = {
                              ...block,
                              id: `${block.type}-${Date.now()}`
                            };
                            const blockIndex = currentPage.blocks.findIndex(b => b.id === blockId);
                            const newBlocks = [...currentPage.blocks];
                            newBlocks.splice(blockIndex + 1, 0, newBlock);
                            updatePage(currentPage.id, { blocks: newBlocks });
                          }
                        }}
                        onBlockToggleVisibility={(blockId) => {
                          const block = currentPage?.blocks.find(b => b.id === blockId);
                          if (block && currentPage) {
                            const updatedBlock = {
                              ...block,
                              properties: {
                                ...block.properties,
                                hidden: !block.properties?.hidden
                              }
                            };
                            const newBlocks = currentPage.blocks.map(b => 
                              b.id === blockId ? updatedBlock : b
                            );
                            updatePage(currentPage.id, { blocks: newBlocks });
                          }
                        }}
                        onSaveInline={handleInlineEdit}
                        onAddBlock={handleComponentSelect}
                        className="mobile-canvas"
                      />
                      
                      {!currentPage && (
                        <div className="text-center py-8 text-gray-500">
                          <h3 className="text-sm font-medium mb-2">Nenhuma página selecionada</h3>
                          <p className="text-xs">Selecione uma página para começar a editar</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : deviceView === 'tablet' ? (
                  <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg min-h-[calc(100vh-120px)] mx-auto">
                    <div className="p-6">
                      <DroppableCanvas
                        blocks={currentPage?.blocks || []}
                        selectedBlockId={selectedBlockId || undefined}
                        onBlockSelect={(blockId) => setSelectedBlock(blockId)}
                        onBlockDelete={deleteBlock}
                        onBlockDuplicate={(blockId) => {
                          const block = currentPage?.blocks.find(b => b.id === blockId);
                          if (block && currentPage) {
                            const newBlock = {
                              ...block,
                              id: `${block.type}-${Date.now()}`
                            };
                            const blockIndex = currentPage.blocks.findIndex(b => b.id === blockId);
                            const newBlocks = [...currentPage.blocks];
                            newBlocks.splice(blockIndex + 1, 0, newBlock);
                            updatePage(currentPage.id, { blocks: newBlocks });
                          }
                        }}
                        onBlockToggleVisibility={(blockId) => {
                          const block = currentPage?.blocks.find(b => b.id === blockId);
                          if (block && currentPage) {
                            const updatedBlock = {
                              ...block,
                              properties: {
                                ...block.properties,
                                hidden: !block.properties?.hidden
                              }
                            };
                            const newBlocks = currentPage.blocks.map(b => 
                              b.id === blockId ? updatedBlock : b
                            );
                            updatePage(currentPage.id, { blocks: newBlocks });
                          }
                        }}
                        onSaveInline={handleInlineEdit}
                        onAddBlock={handleComponentSelect}
                        className=""
                      />
                      
                      {!currentPage && (
                        <div className="text-center py-16 text-gray-500">
                          <h3 className="text-lg font-medium mb-2">Nenhuma página selecionada</h3>
                          <p className="text-sm">Selecione uma página para começar a editar.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-full bg-white rounded-lg shadow-lg min-h-[calc(100vh-120px)]">
                    <div className="p-6">
                      <DroppableCanvas
                        blocks={currentPage?.blocks || []}
                        selectedBlockId={selectedBlockId || undefined}
                        onBlockSelect={(blockId) => setSelectedBlock(blockId)}
                        onBlockDelete={deleteBlock}
                        onBlockDuplicate={(blockId) => {
                          const block = currentPage?.blocks.find(b => b.id === blockId);
                          if (block && currentPage) {
                            const newBlock = {
                              ...block,
                              id: `${block.type}-${Date.now()}`
                            };
                            const blockIndex = currentPage.blocks.findIndex(b => b.id === blockId);
                            const newBlocks = [...currentPage.blocks];
                            newBlocks.splice(blockIndex + 1, 0, newBlock);
                            updatePage(currentPage.id, { blocks: newBlocks });
                          }
                        }}
                        onBlockToggleVisibility={(blockId) => {
                          const block = currentPage?.blocks.find(b => b.id === blockId);
                          if (block && currentPage) {
                            const updatedBlock = {
                              ...block,
                              properties: {
                                ...block.properties,
                                hidden: !block.properties?.hidden
                              }
                            };
                            const newBlocks = currentPage.blocks.map(b => 
                              b.id === blockId ? updatedBlock : b
                            );
                            updatePage(currentPage.id, { blocks: newBlocks });
                          }
                        }}
                        onSaveInline={handleInlineEdit}
                        onAddBlock={handleComponentSelect}
                        className=""
                      />
                      
                      {!currentPage && (
                        <div className="text-center py-16 text-gray-500">
                          <h3 className="text-lg font-medium mb-2">Nenhuma página selecionada</h3>
                          <p className="text-sm">Selecione uma página para começar a editar.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Sidebar - RESPONSIVE */}
          {showRightSidebar && (
            <div 
              className={`
                ${deviceView === 'mobile' 
                  ? 'fixed top-14 right-0 bottom-0 w-80 z-50 bg-white shadow-2xl border-l border-gray-300' 
                  : deviceView === 'tablet'
                  ? 'relative w-64 bg-white border-l border-gray-200'
                  : 'relative w-80 bg-white border-l border-gray-200'
                } 
                flex flex-col
              `}
              style={{ 
                display: 'flex',
                visibility: 'visible',
                opacity: 1
              }}
            >
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Propriedades</h2>
              {deviceView === 'mobile' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    console.log('🔄 Closing right sidebar from X button');
                    setShowRightSidebar(false);
                  }}
                  className="h-8 w-8 p-0"
                >
                  ×
                </Button>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <DynamicPropertiesPanel
                selectedBlock={selectedBlock}
                funnelConfig={funnel}
                onBlockPropertyChange={handleBlockPropertyChange}
                onNestedPropertyChange={handleNestedPropertyChange}
                onFunnelConfigChange={updateFunnelConfig}
              />
            </div>
          </div>
          )}

        </div>

        {/* Debug Info - SISTEMA SAVE/PUBLISH */}
        {process.env.NODE_ENV === 'development' && (
          <div className="h-10 bg-gray-800 text-white text-xs flex items-center px-4 gap-4 overflow-x-auto">
            <span>🔧 Schema Editor Debug:</span>
            <span>Funnel: {funnel?.name || 'None'}</span>
            <span>Pages: {funnel?.pages?.length || 0}</span>
            <span>Current Page: {currentPage?.title || 'None'}</span>
            <span>Blocks: {currentPage?.blocks.length || 0}</span>
            <span>Selected: {selectedBlockId || 'None'}</span>
            <span>Device: {deviceView}</span>
            <span>L-Sidebar: {showLeftSidebar ? 'ON' : 'OFF'}</span>
            <span>R-Sidebar: {showRightSidebar ? 'ON' : 'OFF'}</span>
            <span className="text-green-300">✅ Save/Publish v2.0</span>
            <span className="text-blue-300">📊 localStorage Active</span>
            <span className="text-yellow-300">🔄 Cross-Compatible</span>
            <span className="text-purple-300">
              � Saved: {JSON.parse(localStorage.getItem('schema-editor-saved-projects') || '[]').length}
            </span>
          </div>
        )}

        {/* Modal de Publicação */}
        {showPublishModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-green-600" />
                    Publicar Quiz
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowPublishModal(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Quiz
                    </label>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {funnel?.name || 'Sem nome'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Personalizada (Opcional)
                    </label>
                    <input
                      type="url"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="https://meudominio.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Deixe vazio para usar o domínio atual
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug da URL
                    </label>
                    <input
                      type="text"
                      value={urlSlug}
                      onChange={(e) => setUrlSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                      placeholder="meu-quiz-incrivel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Apenas letras, números e hífens
                    </p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-blue-800 font-medium mb-1">
                      URL Final:
                    </p>
                    <p className="text-sm text-blue-600 font-mono break-all">
                      {customUrl || window.location.origin}/{urlSlug || 'meu-quiz'}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Resumo:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>📄 {funnel?.pages?.length || 0} páginas</li>
                      <li>🧩 {currentPage?.blocks.length || 0} componentes</li>
                      <li>📱 Layout responsivo</li>
                      <li>🔒 URL personalizada</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPublishModal(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleConfirmPublish}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={!urlSlug.trim()}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Publicar Agora
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

export default SchemaDrivenEditorResponsive;