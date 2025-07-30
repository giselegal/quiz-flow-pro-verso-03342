import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ComponentsSidebar } from '@/components/editor/sidebar/ComponentsSidebar';
import { EditPreview } from '@/components/editor/preview/EditPreview';
import PropertiesPanel from '@/components/editor/properties/PropertiesPanel';
import { EditorToolbar } from '@/components/editor/toolbar/EditorToolbar';
import { useEditor } from '@/hooks/useEditor';
import { useEditorPersistence } from '@/hooks/editor/useEditorPersistence';
import { useAutoSaveWithDebounce } from '@/hooks/editor/useAutoSaveWithDebounce';
import { toast } from '@/components/ui/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EditorQuizProvider } from '@/contexts/EditorQuizContext';

const EditorPage: React.FC = () => {
  const [location, setLocation] = useLocation();
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  
  // Extract funnel ID from URL - MOVIDO PARA O INÍCIO
  const urlParams = new URLSearchParams(window.location.search);
  const funnelId = urlParams.get('id');
  
  const { config, addBlock, updateBlock, deleteBlock, setConfig } = useEditor();
  const { saveFunnel, loadFunnel, isSaving, isLoading } = useEditorPersistence();
  
  // ✅ AUTO-SAVE COM DEBOUNCE - Fase 1 
  const handleAutoSave = async (data: any) => {
    // Preservar o ID original do funil carregado da URL
    const preservedId = funnelId || data.id || `funnel_${Date.now()}`;
    
    console.log('🔍 DEBUG - handleAutoSave:', {
      funnelId,
      dataId: data.id,
      preservedId,
      url: window.location.href
    });
    
    const funnelData = {
      id: preservedId,
      name: data.title || 'Novo Funil',
      description: data.description || '',
      isPublished: false,
      version: data.version || 1,
      settings: data.settings || {},
      pages: [{
        id: `page_${Date.now()}`,
        pageType: 'landing',
        pageOrder: 0,
        title: data.title || 'Página Principal',
        blocks: data.blocks,
        metadata: {}
      }]
    };
    await saveFunnel(funnelData);
  };
  
  const { forceSave } = useAutoSaveWithDebounce({
    data: config,
    onSave: handleAutoSave,
    delay: 500,
    enabled: !!config?.blocks?.length,
    showToasts: false
  });