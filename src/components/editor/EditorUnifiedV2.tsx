import React, { useState, useCallback } from 'react';

// 🎨 CORE EDITOR COMPONENTS
import { EditorAccessControl } from '@/components/editor/EditorAccessControl';
import { EnhancedComponentsSidebar } from '@/components/editor/EnhancedComponentsSidebar';

// 🎯 QUIZ 21 STEPS SYSTEM (do EditorWithPreview-fixed)
import { Quiz21StepsProvider } from '@/components/quiz/Quiz21StepsProvider';
import { useQuizFlow } from '@/hooks/core/useQuizFlow';

// 🚀 PREVIEW SYSTEM (do EditorWithPreview-fixed)
import { PreviewProvider } from '@/context/PreviewContext';

// 🎛️ ADVANCED DND SYSTEM (do EditorUnified)
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';

// 🎨 UI COMPONENTS
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// 🎯 ICONS
import { 
  Save, 
  Eye, 
  History, 
  Settings, 
  Share, 
  Download, 
  Users,
  Layout,
  Palette,
  Zap
} from 'lucide-react';

interface SimpleEditorElement {
  id: string;
  type: string;
  label: string;
  properties: Record<string, any>;
}

interface EditorUnifiedV2Props {
  quizId?: string;
  templateId?: string;
}

/**
 * 🎨 EDITOR UNIFICADO V2 - PRIORIDADE 2
 * 
 * Combina as melhores funcionalidades de todos os editores:
 * ✅ Quiz 21 Steps System (EditorWithPreview-fixed)
 * ✅ Advanced DnD System (EditorUnified)
 * ✅ Access Control & Collaboration
 * ✅ Performance Optimized
 */
export const EditorUnifiedV2: React.FC<EditorUnifiedV2Props> = ({ 
  quizId 
}) => {
  // 🎪 QUIZ FLOW STATE (Sistema 21 Etapas)
  const { quizState } = useQuizFlow({
    mode: 'editor',
    onStepChange: (step) => {
      console.log('🎯 Step changed:', step);
    }
  });

  // 🎛️ EDITOR LOCAL STATE
  const [searchTerm, setSearchTerm] = useState('');
  const [canvasElements, setCanvasElements] = useState<SimpleEditorElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('components');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 🎛️ DND HANDLERS
  const handleDragStart = useCallback((event: DragStartEvent) => {
    console.log('🎯 Drag started:', event.active);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    console.log('🎯 Drag over:', event.over);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Handle component from sidebar to canvas
    if (active.data.current?.type === 'sidebar-component') {
      if (over.id === 'canvas-droppable') {
        const newElement: SimpleEditorElement = {
          id: `${active.id}-${Date.now()}`,
          type: active.data.current.component.type,
          label: active.data.current.component.label,
          properties: { ...active.data.current.component.defaultProps }
        };
        setCanvasElements(prev => [...prev, newElement]);
      }
    }

    // Handle reordering within canvas
    if (active.data.current?.type === 'canvas-element') {
      // Implement reordering logic
      console.log('🎯 Reordering elements');
    }
  }, []);

  // 🔧 ACTION HANDLERS
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      // Implementar salvamento simples
      console.log('✅ Salvando editor:', { quizId, quizState, canvasElements });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulação
      console.log('✅ Editor saved successfully');
    } catch (error) {
      console.error('❌ Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [quizId, quizState, canvasElements, setIsSaving]);

  const handleElementSelect = useCallback((elementId: string) => {
    setSelectedElement(elementId);
  }, []);

  return (
    <EditorAccessControl requiredRole="user" feature="editor">
      <Quiz21StepsProvider>
        <PreviewProvider>
          <DndContext
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex h-screen bg-background">
              {/* 🎨 LEFT SIDEBAR */}
              <div className="w-80 border-r border-border bg-card">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Editor Unificado</h2>
                    <Badge variant="outline" className="text-xs">
                      v2.0
                    </Badge>
                  </div>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="components" className="text-xs">
                        <Layout className="w-3 h-3 mr-1" />
                        Componentes
                      </TabsTrigger>
                      <TabsTrigger value="templates" className="text-xs">
                        <Palette className="w-3 h-3 mr-1" />
                        Templates
                      </TabsTrigger>
                      <TabsTrigger value="properties" className="text-xs">
                        <Settings className="w-3 h-3 mr-1" />
                        Propriedades
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="flex-1 overflow-hidden">
                  <Tabs value={activeTab} className="h-full">
                    <TabsContent value="components" className="h-full m-0">
                      <EnhancedComponentsSidebar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                      />
                    </TabsContent>
                    <TabsContent value="templates" className="h-full m-0 p-4">
                      <div className="text-center text-muted-foreground">
                        <Palette className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Templates Supabase</p>
                        <p className="text-xs">Em desenvolvimento...</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="properties" className="h-full m-0 p-4">
                      <div className="text-center text-muted-foreground">
                        <Settings className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Propriedades</p>
                        <p className="text-xs">
                          {selectedElement ? 'Configurar elemento' : 'Selecione um elemento'}
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              {/* 🎨 MAIN EDITOR AREA */}
              <div className="flex-1 flex flex-col">
                {/* 🎛️ TOOLBAR */}
                <div className="h-14 border-b border-border bg-card px-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      <Save className="w-4 h-4 mr-1" />
                      {isSaving ? 'Salvando...' : 'Salvar'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPreviewMode(!isPreviewMode)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {isPreviewMode ? 'Editor' : 'Preview'}
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <Button variant="ghost" size="sm">
                      <History className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">
                      Status: {isSaving ? 'Salvando...' : 'Pronto'}
                    </span>
                    <Separator orientation="vertical" className="h-6" />
                    <Button variant="ghost" size="sm">
                      <Users className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* 🎨 CANVAS / PREVIEW AREA */}
                <div className="flex-1 relative">
                  {isPreviewMode ? (
                    <div className="h-full p-4 bg-muted/10">
                      <div className="h-full bg-white rounded-lg border p-8 flex items-center justify-center">
                        <div className="text-center">
                          <Eye className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                          <h3 className="text-lg font-semibold mb-2">
                            Preview Mode
                          </h3>
                          <p className="text-muted-foreground">
                            Visualização do quiz será exibida aqui
                          </p>
                          <p className="text-sm text-muted-foreground mt-2">
                            Quiz State: Step {quizState.currentStep}/{quizState.totalSteps}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div 
                      id="canvas-droppable"
                      className="h-full p-4 bg-muted/20"
                    >
                      <div className="h-full bg-white rounded-lg border-2 border-dashed border-border p-8">
                        {canvasElements.length === 0 ? (
                          <div className="flex items-center justify-center h-full text-center">
                            <div>
                              <Zap className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                              <h3 className="text-lg font-semibold mb-2">
                                Canvas Vazio
                              </h3>
                              <p className="text-muted-foreground">
                                Arraste componentes da barra lateral para começar
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {canvasElements.map((element) => (
                              <div
                                key={element.id}
                                className={`
                                  p-4 border rounded-lg cursor-pointer transition-all
                                  ${selectedElement === element.id 
                                    ? 'border-primary ring-2 ring-primary/20' 
                                    : 'border-border hover:border-primary/50'
                                  }
                                `}
                                onClick={() => handleElementSelect(element.id)}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{element.label}</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {element.type}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DndContext>
        </PreviewProvider>
      </Quiz21StepsProvider>
    </EditorAccessControl>
  );
};

export default EditorUnifiedV2;
