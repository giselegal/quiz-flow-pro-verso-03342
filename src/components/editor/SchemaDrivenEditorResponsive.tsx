import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Undo2, // Novo ícone para desfazer
  Redo2, // Novo ícone para refazer
  ArrowLeft, // Ícone para voltar
  Home // Ícone para dashboard
} from 'lucide-react';
import { useSchemaEditorFixed as useSchemaEditor } from '@/hooks/useSchemaEditorFixed';
import { SchemaDrivenComponentsSidebar } from './sidebar/SchemaDrivenComponentsSidebar';
import { DynamicPropertiesPanel } from './panels/DynamicPropertiesPanel';
import { DroppableCanvas } from './dnd/DroppableCanvas';
import { blockDefinitions } from '@/config/blockDefinitions';
import { useLocation } from 'wouter';

interface SchemaDrivenEditorResponsiveProps {
  funnelId?: string;
  className?: string;
}

type DeviceView = 'mobile' | 'tablet' | 'desktop';

// Utility para debounce
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

// Componente Toast simples para demonstração
const Toast: React.FC<{ message: string; type: 'success' | 'error' | 'info'; onClose: () => void }> = ({
  message,
  type,
  onClose,
}) => {
  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  return (
    <div
      className={`fixed bottom-4 right-4 p-3 rounded-md shadow-lg text-white ${bgColor} z-50`}
      role="alert"
    >
      {message}
      <button onClick={onClose} className="ml-4 font-bold">
        &times;
      </button>
    </div>
  );
};

const SchemaDrivenEditorResponsive: React.FC<SchemaDrivenEditorResponsiveProps> = ({
  funnelId,
  className = ''
}) => {
  const [deviceView, setDeviceView] = useState<DeviceView>('desktop');
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState<'components' | 'pages'>('components');

  // Hook de navegação
  const [, setLocation] = useLocation();

  // Estado para o Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Estados para Undo/Redo
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

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
    isLoading,
    isSaving
  } = useSchemaEditor(funnelId || undefined);

  // Função para mostrar toast
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    const timer = setTimeout(() => {
      setToast(null);
    }, 3000); // Esconde o toast após 3 segundos
    return () => clearTimeout(timer);
  }, []);

  // Função para voltar ao dashboard
  const handleBackToDashboard = useCallback(() => {
    // Salvar antes de sair se houver mudanças pendentes
    if (isSaving) {
      showToast('Salvando alterações antes de sair...', 'info');
      setTimeout(() => {
        setLocation('/admin/funis');
      }, 1000);
    } else {
      setLocation('/admin/funis');
    }
  }, [setLocation, isSaving, showToast]);

  // Ref para armazenar o estado atual antes de uma mudança significativa
  const lastSavedStateRef = useRef<any | null>(null);

  // Adiciona o estado atual ao undoStack
  const pushToUndoStack = useCallback(() => {
    if (currentPage && lastSavedStateRef.current) {
      setUndoStack(prev => [...prev, lastSavedStateRef.current]);
      setRedoStack([]); // Limpa o redo stack quando uma nova ação é feita
    }
    lastSavedStateRef.current = JSON.parse(JSON.stringify(currentPage)); // Salva uma cópia profunda
  }, [currentPage]);

  // Efeito para capturar o estado inicial ou quando a página muda significativamente
  useEffect(() => {
    if (currentPage && !lastSavedStateRef.current) {
      lastSavedStateRef.current = JSON.parse(JSON.stringify(currentPage));
    }
  }, [currentPage]);

  // Função Desfazer
  const handleUndo = useCallback(() => {
    if (undoStack.length > 0) {
      const prevState = undoStack[undoStack.length - 1];
      setUndoStack(prev => prev.slice(0, -1));
      if (currentPage) {
        setRedoStack(prev => [...prev, JSON.parse(JSON.stringify(currentPage))]);
      }
      // Aplica o estado anterior. Assumimos que prevState contém a estrutura completa da página.
      // Isso pode exigir uma lógica mais sofisticada dependendo de como `updatePage` funciona.
      // Para este exemplo, vamos simular a restauração direta, mas em um sistema real, você
      // precisaria de uma função que restaurasse o `currentPage` de forma mais granular.
      // Por simplicidade, vamos apenas definir a página como o estado anterior.
      // ATENÇÃO: Em um app real, `setCurrentPage` pode não ser suficiente para restaurar
      // o estado completo do `useSchemaEditorFixed`. Você precisaria de um método no hook
      // que permita "carregar" um estado de página.
      updatePage(prevState.id, prevState); // Isso pode ser problemático se prevState.id não for o currentPage.id
      showToast('Ação desfeita!', 'info');
    } else {
      showToast('Nada para desfazer.', 'info');
    }
  }, [undoStack, currentPage, updatePage, showToast]);

  // Função Refazer
  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      setRedoStack(prev => prev.slice(0, -1));
      if (currentPage) {
        setUndoStack(prev => [...prev, JSON.parse(JSON.stringify(currentPage))]);
      }
      updatePage(nextState.id, nextState); // Similar ao undo, cuidado com a implementação real
      showToast('Ação refeita!', 'info');
    } else {
      showToast('Nada para refazer.', 'info');
    }
  }, [redoStack, currentPage, updatePage, showToast]);


  // Handlers
  const handleComponentSelect = useCallback((type: string) => {
    pushToUndoStack(); // Salva o estado antes de adicionar
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
      showToast(`Componente "${type}" adicionado!`, 'success');
    }
  }, [addBlock, currentPage, pushToUndoStack, showToast]);

  // Debounced handler para mudanças de propriedade
  const debouncedHandleBlockPropertyChange = useRef(
    debounce((key: string, value: any) => {
      if (!selectedBlockId) return;
      const selectedBlock = currentPage?.blocks.find(b => b.id === selectedBlockId);
      if (!selectedBlock) return;

      const newProperties = {
        ...selectedBlock.properties,
        [key]: value
      };
      pushToUndoStack(); // Salva o estado antes de atualizar
      updateBlock(selectedBlockId, { properties: newProperties });
      showToast('Propriedade atualizada!', 'success');
    }, 500) // Debounce de 500ms
  ).current;

  const handleBlockPropertyChange = useCallback((key: string, value: any) => {
    debouncedHandleBlockPropertyChange(key, value);
  }, [debouncedHandleBlockPropertyChange]);


  // Debounced handler para mudanças de propriedade aninhadas
  const debouncedHandleNestedPropertyChange = useRef(
    debounce((path: string, value: any) => {
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

      pushToUndoStack(); // Salva o estado antes de atualizar
      updateBlock(selectedBlockId, { properties: newProperties });
      showToast('Propriedade aninhada atualizada!', 'success');
    }, 500)
  ).current;

  const handleNestedPropertyChange = useCallback((path: string, value: any) => {
    debouncedHandleNestedPropertyChange(path, value);
  }, [debouncedHandleNestedPropertyChange]);


  const handleInlineEdit = useCallback((blockId: string, updates: Partial<any>) => {
    if (updates.properties) {
      pushToUndoStack(); // Salva o estado antes de atualizar
      updateBlock(blockId, updates);
      showToast('Edição inline salva!', 'success');
    }
  }, [updateBlock, pushToUndoStack, showToast]);

  const handleSave = useCallback(() => {
    saveFunnel(true);
    showToast('Funil salvo com sucesso!', 'success');
  }, [saveFunnel, showToast]);

  // Função de publicação
  const handlePublish = useCallback(async () => {
    if (!funnel?.id) {
      showToast('Salve o funil antes de publicar.', 'error');
      return;
    }

    setIsPublishing(true);
    try {
      const response = await fetch(`http://localhost:3001/api/funnels/${funnel.id}/publish`, {
        method: 'POST'
      });

      const result = await response.json();
      
      if (result.success) {
        // Atualizar o estado local do funil para refletir que foi publicado
        updateFunnelConfig({ isPublished: true });
        showToast(`Funil publicado! Acesse em: ${result.publishUrl || 'URL disponível em breve'}`, 'success');
      } else {
        throw new Error(result.error || 'Erro ao publicar');
      }
    } catch (error) {
      showToast(`Erro ao publicar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`, 'error');
    } finally {
      setIsPublishing(false);
    }
  }, [funnel?.id, updateFunnelConfig, showToast]);

  const handleDeleteBlock = useCallback((blockId: string) => {
    pushToUndoStack(); // Salva o estado antes de deletar
    deleteBlock(blockId);
    showToast('Bloco excluído!', 'info');
  }, [deleteBlock, pushToUndoStack, showToast]);

  const handleDuplicateBlock = useCallback((blockId: string) => {
    const block = currentPage?.blocks.find(b => b.id === blockId);
    if (block && currentPage) {
      pushToUndoStack(); // Salva o estado antes de duplicar
      const newBlock = {
        ...block,
        id: `${block.type}-${Date.now()}` // Garante um ID único
      };
      const blockIndex = currentPage.blocks.findIndex(b => b.id === blockId);
      const newBlocks = [...currentPage.blocks];
      newBlocks.splice(blockIndex + 1, 0, newBlock);
      updatePage(currentPage.id, { blocks: newBlocks });
      showToast('Bloco duplicado!', 'success');
    }
  }, [currentPage, updatePage, pushToUndoStack, showToast]);

  const handleToggleVisibility = useCallback((blockId: string) => {
    const block = currentPage?.blocks.find(b => b.id === blockId);
    if (block && currentPage) {
      pushToUndoStack(); // Salva o estado antes de mudar visibilidade
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
      showToast(`Visibilidade do bloco alterada para ${updatedBlock.properties?.hidden ? 'oculto' : 'visível'}`, 'info');
    }
  }, [currentPage, updatePage, pushToUndoStack, showToast]);


  // Auto-create funnel se necessário
  useEffect(() => {
    if (!funnel && !isLoading && !funnelId) {
      createNewFunnel();
      showToast('Novo funil criado!', 'success');
    }
  }, [funnel, isLoading, funnelId, createNewFunnel, showToast]);

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
      {/* Header Responsivo */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          {/* Botão Voltar ao Dashboard */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToDashboard}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>

          {/* Separador */}
          <div className="h-6 w-px bg-gray-300" />

          {/* Info do funil */}
          <div className="flex items-center space-x-2 min-w-0">
            <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <span className="font-medium text-gray-800 truncate">{funnel.name}</span>
            <Badge variant={funnel.isPublished ? 'default' : 'secondary'} className="text-xs hidden sm:inline-flex">
              {funnel.isPublished ? 'Publicado' : 'Rascunho'}
            </Badge>
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
                // Adicionado: Garante que as sidebars fiquem visíveis ao mudar para mobile view
                setShowLeftSidebar(true);
                setShowRightSidebar(true);
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

          {/* Botões Undo/Redo */}
          <div className="hidden md:flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              title="Desfazer"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              title="Refazer"
            >
              <Redo2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Actions */}
          <div className="hidden md:flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={createNewFunnel}
              title="Criar novo funil"
            >
              <Plus className="w-4 h-4 mr-1" />
              Novo
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

           <Button
             size="sm"
             onClick={handlePublish}
             disabled={isPublishing || !funnel?.id}
             variant="default"
             className="bg-blue-600 hover:bg-blue-700 px-3"
           >
             <Eye className="w-4 h-4 sm:mr-1" />
             <span className="hidden sm:inline">{isPublishing ? 'Publicando...' : 'Publicar'}</span>
           </Button>

           <Button
             size="sm"
             onClick={handleSave}
             disabled={isSaving}
             className="bg-[#B89B7A] hover:bg-[#a08965] px-3"
           >
             <Save className="w-4 h-4 sm:mr-1" />
             <span className="hidden sm:inline">{isSaving ? 'Salvando...' : 'Salvar'}</span>
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
                onComponentSelect={handleComponentSelect}
                activeTab={activeTab}
                onTabChange={(tab: string) => setActiveTab(tab as "pages" | "components")}
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
                      onBlockDelete={handleDeleteBlock} // Usando o novo handler
                      onBlockDuplicate={handleDuplicateBlock} // Usando o novo handler
                      onBlockToggleVisibility={handleToggleVisibility} // Usando o novo handler
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
                      onBlockDelete={handleDeleteBlock} // Usando o novo handler
                      onBlockDuplicate={handleDuplicateBlock} // Usando o novo handler
                      onBlockToggleVisibility={handleToggleVisibility} // Usando o novo handler
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
                      onBlockDelete={handleDeleteBlock} // Usando o novo handler
                      onBlockDuplicate={handleDuplicateBlock} // Usando o novo handler
                      onBlockToggleVisibility={handleToggleVisibility} // Usando o novo handler
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

      {/* Render Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default SchemaDrivenEditorResponsive;
