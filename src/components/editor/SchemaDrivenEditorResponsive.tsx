import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
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
  Home, // Ícone para dashboard
  Bug, // Ícone para diagnóstico
  Layout as TemplateIcon, // Ícone para templates
  GitBranch, // Ícone para versionamento
  FileText as ReportIcon, // Ícone para relatórios
  BarChart3 // Ícone para A/B testing
} from 'lucide-react';
import { useSchemaEditorFixed as useSchemaEditor } from '../../hooks/useSchemaEditorFixed';
import { useSupabaseEditor } from '../../hooks/useSupabaseEditor';
import { SchemaDrivenComponentsSidebar } from './sidebar/SchemaDrivenComponentsSidebar';
import { DynamicPropertiesPanel } from './panels/DynamicPropertiesPanel';
import { DroppableCanvas } from './dnd/DroppableCanvas';
import { TestDeleteComponent } from './TestDeleteComponent';
import { allBlockDefinitions } from '../../config/blockDefinitions';
import { useLocation } from 'wouter';
import { saveDiagnostic } from '../../utils/saveDiagnostic';
// Importar novos serviços e componentes
import { TemplateSelector } from '../templates/TemplateSelector';
import { VersioningService } from '../../services/versioningService';
import { ReportService } from '../../services/reportService';
import { ABTestService } from '../../services/abTestService';
import { useAnalytics } from '../../services/analyticsService';
import AnalyticsDashboard from '../analytics/AnalyticsDashboard';
import { EditorQuizProvider } from '../../contexts/EditorQuizContext';

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

  // Analytics hook
  const { trackPageView, trackButtonClick, trackQuizStart } = useAnalytics();

  // Estado para o Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Estados para Undo/Redo
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

  // Estados para as novas funcionalidades
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showABTestModal, setShowABTestModal] = useState(false);
  const [showAnalyticsDashboard, setShowAnalyticsDashboard] = useState(false);

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
    const definition = allBlockDefinitions.find((def: any) => def.type === type);
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
      setShowRightSidebar(true);
    }
  }, [addBlock, currentPage, pushToUndoStack, showToast, setShowRightSidebar]);

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
    console.log('🔘 [DEBUG] handleSave button clicked!');
    console.log('🔘 [DEBUG] Current funnel state:', {
      id: funnel?.id,
      name: funnel?.name,
      pagesCount: funnel?.pages?.length,
      hasPages: !!funnel?.pages,
      isSaving,
      timestamp: new Date().toISOString()
    });
    
    // Verificar se há um funil válido
    if (!funnel) {
      console.error('❌ [DEBUG] No funnel available for saving!');
      showToast('Erro: Nenhum funil carregado para salvar', 'error');
      return;
    }
    
    if (isSaving) {
      console.log('⏳ [DEBUG] Save already in progress, ignoring click');
      return;
    }
    
    console.log('📞 [DEBUG] Calling saveFunnel(true) - manual save');
    trackButtonClick(funnelId || 'new', 'save-button', 'Salvar');
    saveFunnel(true);
    showToast('Iniciando salvamento...', 'success');
  }, [saveFunnel, showToast, funnel, isSaving, trackButtonClick, funnelId]);

  // Função de diagnóstico do salvamento
  const handleDiagnostic = useCallback(async () => {
    console.log('🏥 Executando diagnóstico do sistema de salvamento...');
    showToast('Executando diagnóstico...', 'info');
    
    try {
      const results = await saveDiagnostic.runFullDiagnostic();
      
      if (results.supabaseConnection.success && results.funnelSave.success) {
        showToast('✅ Sistema de salvamento funcionando!', 'success');
      } else {
        showToast('❌ Problemas detectados no salvamento', 'error');
      }
    } catch (error) {
      console.error('Erro no diagnóstico:', error);
      showToast('Erro ao executar diagnóstico', 'error');
    }
  }, [showToast]);

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
    console.log('🔥 handleDeleteBlock called for:', blockId);
    pushToUndoStack(); // Salva o estado antes de deletar
    console.log('📝 Calling deleteBlock from hook...');
    deleteBlock(blockId);
    showToast('Bloco excluído!', 'info');
    console.log('✅ Delete block process completed');
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

  // Handler para templates
  const handleTemplateSelect = useCallback((template: any) => {
    if (template && funnel) {
      updateFunnelConfig(template);
      showToast('Template aplicado com sucesso!', 'success');
    }
  }, [funnel, updateFunnelConfig, showToast]);

  // Handler para versionamento
  const handleCreateVersion = useCallback(async () => {
    if (funnel && funnelId) {
      setIsPublishing(true);
      try {
        const version = await VersioningService.createVersion(
          funnelId, 
          'Versão criada pelo editor',
          { quiz: funnel }
        );
        showToast('Nova versão criada com sucesso!', 'success');
        console.log('Nova versão:', version);
      } catch (error) {
        console.error('Erro ao criar versão:', error);
        showToast('Erro ao criar versão', 'error');
      } finally {
        setIsPublishing(false);
      }
    }
  }, [funnel, funnelId, showToast]);

  // Handler para relatórios
  const handleGenerateReport = useCallback(async () => {
    if (funnelId) {
      setIsPublishing(true);
      try {
        const report = await ReportService.generateSummaryReport(funnelId);
        showToast('Relatório gerado com sucesso!', 'success');
        console.log('Relatório:', report);
        
        // Download do relatório
        ReportService.downloadReport(report, `relatorio-${funnelId}.pdf`);
      } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        showToast('Erro ao gerar relatório', 'error');
      } finally {
        setIsPublishing(false);
      }
    }
  }, [funnelId, showToast]);

  // Handler para A/B testing
  const handleCreateABTest = useCallback(async () => {
    if (funnel && funnelId) {
      setIsPublishing(true);
      try {
        const test = await ABTestService.createTest({
          name: `Teste A/B - ${funnel.title || 'Sem título'}`,
          description: 'Teste A/B criado pelo editor',
          quiz_id: funnelId,
          traffic_split: 50,
          settings: {
            minimum_sample_size: 100,
            confidence_level: 95,
            test_duration_days: 14,
            auto_declare_winner: false,
            metrics_to_track: ['conversion_rate', 'completion_rate']
          },
          variants: [
            { 
              name: 'Original',
              type: 'control' as const,
              quiz_data: funnel,
              traffic_percentage: 50,
              is_active: true
            },
            { 
              name: 'Variante B',
              type: 'variation' as const,
              quiz_data: { ...funnel, title: `${funnel.title} - Variante B` },
              traffic_percentage: 50,
              is_active: true
            }
          ]
        });
        showToast('Teste A/B criado com sucesso!', 'success');
        console.log('Teste A/B:', test);
      } catch (error) {
        console.error('Erro ao criar teste A/B:', error);
        showToast('Erro ao criar teste A/B', 'error');
      } finally {
        setIsPublishing(false);
      }
    }
  }, [funnel, funnelId, showToast]);


  // Auto-create funnel se necessário
  useEffect(() => {
    if (!funnel && !isLoading && !funnelId) {
      createNewFunnel();
      showToast('Novo funil criado!', 'success');
    }
  }, [funnel, isLoading, funnelId, createNewFunnel, showToast]);

  // Analytics: Track page view when editor loads
  useEffect(() => {
    if (funnel) {
      trackPageView(funnel.id, 'editor-main');
      console.log('📊 [Analytics] Editor page view tracked');
    }
  }, [funnel, trackPageView]);

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
    <EditorQuizProvider>
      <div className={`h-screen flex flex-col overflow-hidden bg-gradient-to-br from-[#fffaf7] via-[#F3E8E6]/30 to-[#fffaf7]/50`}>
      {/* Header Responsivo - Redesigned com cores da marca */}
      <div className="h-16 bg-white/95 backdrop-blur-sm border-b border-[#B89B7A]/20 shadow-sm flex items-center justify-between px-6">
        <div className="flex items-center space-x-6 min-w-0 flex-1">
          {/* Botão Voltar ao Dashboard - Redesigned com cores da marca */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToDashboard}
            className="flex items-center space-x-2 text-[#8F7A6A] hover:text-[#432818] hover:bg-[#B89B7A]/10 px-4 py-2 rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">Dashboard</span>
          </Button>

          {/* Separador */}
          <div className="h-8 w-px bg-gradient-to-b from-transparent via-[#B89B7A]/30 to-transparent" />

          {/* Info do funil - Redesigned com cores da marca */}
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 bg-gradient-to-br from-[#B89B7A]/20 to-[#aa6b5d]/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#B89B7A]" />
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-[#432818] truncate text-lg">{funnel.name}</h2>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={funnel.isPublished ? 'default' : 'secondary'} 
                  className={`text-xs ${
                    funnel.isPublished 
                      ? 'bg-[#B89B7A]/20 text-[#432818] border-[#B89B7A]/30' 
                      : 'bg-[#aa6b5d]/20 text-[#8F7A6A] border-[#aa6b5d]/30'
                  }`}
                >
                  {funnel.isPublished ? 'Publicado' : 'Rascunho'}
                </Badge>
                {/* Info da página atual */}
                {currentPage && (
                  <div className="hidden lg:flex items-center space-x-2 text-sm text-[#8F7A6A]">
                    <span>•</span>
                    <span className="truncate">{currentPage.title}</span>
                    <Badge variant="outline" className="text-xs border-[#B89B7A]/30 text-[#8F7A6A]">
                      {currentPage.blocks.length} bloco{currentPage.blocks.length !== 1 ? 's' : ''}
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Status - Redesigned com cores da marca */}
          <div className="hidden sm:flex items-center space-x-2 bg-[#fffaf7] rounded-full px-3 py-1.5 border border-[#B89B7A]/20">
            <div className={`w-2 h-2 rounded-full ${
              isSaving ? 'bg-[#aa6b5d] animate-pulse' : 'bg-[#B89B7A]'
            }`} />
            <span className="text-xs font-medium text-[#8F7A6A]">
              {isSaving ? 'Salvando...' : 'Sincronizado'}
            </span>
          </div>

          {/* Botões Mobile - SEMPRE VISÍVEIS EM MÓBILE - Redesigned com cores da marca */}
          <div className="flex space-x-2 md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="text-[#432818] hover:text-[#432818] hover:bg-[#B89B7A]/20"
            >
              <Save className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                console.log('🔄 Toggle left sidebar from mobile button');
                setShowLeftSidebar(!showLeftSidebar);
              }}
              className="text-[#432818] hover:text-[#432818] hover:bg-[#B89B7A]/20"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>

          {/* Controles do Dispositivo - Redesigned com cores da marca */}
          <div className="hidden md:flex items-center space-x-1 bg-[#fffaf7] rounded-lg p-1 border border-[#B89B7A]/20">
            <Button
              variant={deviceView === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDeviceView('mobile')}
              className={`h-8 px-3 transition-all duration-200 ${
                deviceView === 'mobile'
                  ? 'bg-[#B89B7A] text-white shadow-sm'
                  : 'text-[#8F7A6A] hover:text-[#432818] hover:bg-[#B89B7A]/10'
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
            <Button
              variant={deviceView === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDeviceView('tablet')}
              className={`h-8 px-3 transition-all duration-200 ${
                deviceView === 'tablet'
                  ? 'bg-[#B89B7A] text-white shadow-sm'
                  : 'text-[#8F7A6A] hover:text-[#432818] hover:bg-[#B89B7A]/10'
              }`}
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant={deviceView === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDeviceView('desktop')}
              className={`h-8 px-3 transition-all duration-200 ${
                deviceView === 'desktop'
                  ? 'bg-[#B89B7A] text-white shadow-sm'
                  : 'text-[#8F7A6A] hover:text-[#432818] hover:bg-[#B89B7A]/10'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </Button>
          </div>

          {/* Ações principais - Redesigned com cores da marca */}
          <div className="flex items-center space-x-2">
            {/* Undo/Redo */}
            <div className="hidden lg:flex items-center space-x-1 bg-[#fffaf7] rounded-lg p-1 border border-[#B89B7A]/20">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUndo}
                disabled={undoStack.length === 0}
                className="h-8 w-8 p-0 text-[#8F7A6A] hover:text-[#432818] hover:bg-[#B89B7A]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Desfazer"
              >
                <Undo2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRedo}
                disabled={redoStack.length === 0}
                className="h-8 w-8 p-0 text-[#8F7A6A] hover:text-[#432818] hover:bg-[#B89B7A]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refazer"
              >
                <Redo2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Ferramentas avançadas */}
            <div className="hidden xl:flex items-center space-x-1 bg-[#fffaf7] rounded-lg p-1 border border-[#B89B7A]/20">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTemplateSelector(true)}
                className="h-8 w-8 p-0 text-[#8F7A6A] hover:text-[#432818] hover:bg-[#B89B7A]/10"
                title="Templates"
              >
                <TemplateIcon className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCreateVersion}
                disabled={isPublishing}
                className="h-8 w-8 p-0 text-[#8F7A6A] hover:text-[#432818] hover:bg-[#B89B7A]/10 disabled:opacity-50"
                title="Criar Versão"
              >
                <GitBranch className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGenerateReport}
                disabled={isPublishing}
                className="h-8 w-8 p-0 text-[#8F7A6A] hover:text-[#432818] hover:bg-[#B89B7A]/10 disabled:opacity-50"
                title="Relatórios"
              >
                <ReportIcon className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCreateABTest}
                disabled={isPublishing}
                className="h-8 w-8 p-0 text-[#8F7A6A] hover:text-[#432818] hover:bg-[#B89B7A]/10 disabled:opacity-50"
                title="A/B Test"
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAnalyticsDashboard(true)}
                className="h-8 w-8 p-0 text-[#8F7A6A] hover:text-[#432818] hover:bg-[#B89B7A]/10"
                title="Analytics"
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDiagnostic}
                className="h-8 w-8 p-0 text-[#8F7A6A] hover:text-[#432818] hover:bg-[#B89B7A]/10"
                title="Diagnóstico"
              >
                <Bug className="w-4 h-4" />
              </Button>
            </div>

            {/* Ações principais */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="hidden sm:flex border-[#B89B7A]/30 text-[#432818] hover:text-[#432818] hover:bg-[#B89B7A]/10"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button
                onClick={handlePublish}
                disabled={isPublishing || isSaving}
                size="sm"
                className="bg-[#B89B7A] hover:bg-[#aa6b5d] text-white shadow-sm transition-all duration-200"
              >
                <Eye className="w-4 h-4 mr-2" />
                {isPublishing ? 'Publicando...' : 'Publicar'}
              </Button>
            </div>

            {/* Toggle Sidebars - Desktop */}
            <div className="hidden lg:flex items-center space-x-1 bg-[#fffaf7] rounded-lg p-1 border border-[#B89B7A]/20">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  console.log('🔄 Toggle left sidebar from desktop button');
                  setShowLeftSidebar(!showLeftSidebar);
                }}
                className={`h-8 w-8 p-0 transition-all duration-200 ${
                  showLeftSidebar
                    ? 'bg-[#B89B7A] text-white'
                    : 'text-[#8F7A6A] hover:text-[#432818] hover:bg-[#B89B7A]/10'
                }`}
                title="Toggle Components"
              >
                <Menu className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  console.log('🔄 Toggle right sidebar from desktop button');
                  setShowRightSidebar(!showRightSidebar);
                }}
                className={`h-8 w-8 p-0 transition-all duration-200 ${
                  showRightSidebar
                    ? 'bg-[#B89B7A] text-white'
                    : 'text-[#8F7A6A] hover:text-[#432818] hover:bg-[#B89B7A]/10'
                }`}
                title="Toggle Properties"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Overlay para mobile quando sidebar está aberta - TESTE FORÇADO */}
        {(showLeftSidebar || showRightSidebar) && deviceView === 'mobile' && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300"
            onClick={() => {
              console.log('🔄 Overlay clicked - closing sidebars');
              setShowLeftSidebar(false);
              setShowRightSidebar(false);
            }}
          />
        )}

        {/* Left Sidebar - RESPONSIVE - Redesigned */}
        {showLeftSidebar && (
          <div
            className={`
              ${deviceView === 'mobile'
                ? 'fixed top-16 left-0 bottom-0 w-80 z-50 bg-white/95 backdrop-blur-lg shadow-2xl border-r border-[#B89B7A]/20'
                : deviceView === 'tablet'
                  ? 'relative w-64 bg-white/95 backdrop-blur-sm border-r border-[#B89B7A]/20'
                  : 'relative w-80 bg-white/95 backdrop-blur-sm border-r border-[#B89B7A]/20'
              }
              flex flex-col transition-all duration-300 ease-in-out
            `}
            style={{
              display: 'flex',
              visibility: 'visible',
              opacity: 1
            }}
          >
            <div className="flex items-center justify-between p-4 border-b border-[#B89B7A]/20 bg-gradient-to-r from-[#B89B7A]/10 to-[#aa6b5d]/10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#B89B7A]/20 to-[#aa6b5d]/20 rounded-lg flex items-center justify-center">
                  <Menu className="w-4 h-4 text-[#432818]" />
                </div>
                <h2 className="font-semibold text-[#432818]">Componentes</h2>
              </div>
              {deviceView === 'mobile' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    console.log('🔄 Closing left sidebar from X button');
                    setShowLeftSidebar(false);
                  }}
                  className="h-8 w-8 p-0 text-[#432818] hover:text-[#432818] hover:bg-[#B89B7A]/20 rounded-lg transition-all duration-200"
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

        {/* Central Canvas - Redesigned */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
          <div className="flex-1 overflow-auto flex justify-center p-4">
            <div className={`
              ${deviceView === 'mobile'
                ? 'w-full max-w-sm mx-auto'
                : deviceView === 'tablet'
                  ? 'w-full max-w-2xl mx-auto'
                  : 'w-full max-w-4xl mx-auto'
              }
            `}>
              {deviceView === 'mobile' ? (
                <div className="w-full max-w-sm bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-[#B89B7A]/20 min-h-[calc(100vh-140px)] mx-auto overflow-hidden">
                  <div className="p-6">
                    {/* Componente de teste para exclusão */}
                    <TestDeleteComponent onDelete={() => {
                      console.log('🧪 Teste de exclusão chamado!');
                      showToast('Teste de exclusão funcionou!', 'success');
                    }} />
                    
                    <DroppableCanvas
                      setShowRightSidebar={setShowRightSidebar}
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
                      <div className="text-center py-12 text-[#432818]/60">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#B89B7A]/20 to-[#aa6b5d]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <FileText className="w-8 h-8 text-[#B89B7A]" />
                        </div>
                        <h3 className="text-sm font-semibold mb-2 text-[#432818]">Nenhuma página selecionada</h3>
                        <p className="text-xs text-[#432818]/60">Selecione uma página para começar a editar</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : deviceView === 'tablet' ? (
                <div className="w-full max-w-2xl bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-[#B89B7A]/20 min-h-[calc(100vh-140px)] mx-auto overflow-hidden">
                  <div className="p-8">
                    <DroppableCanvas
                      setShowRightSidebar={setShowRightSidebar}
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
                      <div className="text-center py-20 text-[#432818]/60">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#B89B7A]/20 to-[#aa6b5d]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <FileText className="w-10 h-10 text-[#B89B7A]" />
                        </div>
                        <h3 className="text-lg font-semibold mb-3 text-[#432818]">Nenhuma página selecionada</h3>
                        <p className="text-sm text-[#432818]/60">Selecione uma página para começar a editar.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-[#B89B7A]/20 min-h-[calc(100vh-120px)]">
                  <div className="p-6">
                    <DroppableCanvas
                      setShowRightSidebar={setShowRightSidebar}
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
                      <div className="text-center py-16 text-[#432818]/60">
                        <div className="w-24 h-24 bg-gradient-to-br from-[#B89B7A]/20 to-[#aa6b5d]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <FileText className="w-12 h-12 text-[#B89B7A]" />
                        </div>
                        <h3 className="text-lg font-medium mb-2 text-[#432818]">Nenhuma página selecionada</h3>
                        <p className="text-sm text-[#432818]/60">Selecione uma página para começar a editar.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - RESPONSIVE - Redesigned */}
        {showRightSidebar && (
          <div
            className={`
              ${deviceView === 'mobile'
                ? 'fixed top-14 right-0 bottom-0 w-80 z-50 bg-white/95 backdrop-blur-lg shadow-2xl border-l border-[#B89B7A]/30'
                : deviceView === 'tablet'
                  ? 'relative w-64 bg-white/95 backdrop-blur-sm border-l border-[#B89B7A]/20'
                  : 'relative w-80 bg-white/95 backdrop-blur-sm border-l border-[#B89B7A]/20'
              }
              flex flex-col
            `}
            style={{
              display: 'flex',
              visibility: 'visible',
              opacity: 1
            }}
          >
            <div className="flex items-center justify-between p-3 border-b border-[#B89B7A]/20 bg-gradient-to-r from-[#B89B7A]/10 to-[#aa6b5d]/10">
              <h2 className="font-semibold text-[#432818]">Propriedades</h2>
              {deviceView === 'mobile' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    console.log('🔄 Closing right sidebar from X button');
                    setShowRightSidebar(false);
                  }}
                  className="h-8 w-8 p-0 text-[#432818] hover:text-[#432818] hover:bg-[#B89B7A]/20"
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

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Selecionar Template</h2>
              <Button
                onClick={() => setShowTemplateSelector(false)}
                variant="outline"
                size="sm"
              >
                ✕
              </Button>
            </div>
            <div className="p-4">
              <TemplateSelector
                onSelectTemplate={handleTemplateSelect}
                onClose={() => setShowTemplateSelector(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Analytics Dashboard */}
      {showAnalyticsDashboard && funnel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
              <Button
                onClick={() => setShowAnalyticsDashboard(false)}
                variant="outline"
                size="sm"
              >
                ✕
              </Button>
            </div>
            <div className="overflow-y-auto max-h-[80vh]">
              <AnalyticsDashboard
                quizId={funnel.id}
                className="border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
    </EditorQuizProvider>
  );
};

export default SchemaDrivenEditorResponsive;