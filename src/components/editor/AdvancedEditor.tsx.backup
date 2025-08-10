// 🚀 EDITOR AVANÇADO - Integração Completa das Funcionalidades da Fase 2
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BlockData } from "@/types/blocks";
import {
  Clock,
  Eye,
  EyeOff,
  Grid,
  Layers,
  Layout,
  Monitor,
  Move,
  Save,
  Settings,
  Smartphone,
  Star,
  Tablet,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

// Importar todos os componentes da Fase 2
import DragAndDropEditor from "./dragdrop/DragAndDropEditor";
import EditorHistory from "./history/EditorHistory";
import ResponsivePreview from "./preview/ResponsivePreview";
import EnhancedPropertiesPanel from "./properties/EnhancedPropertiesPanel";
import ComponentsLibrary from "./sidebar/ComponentsLibrary";
import TemplateGallery from "./templates/TemplateGallery";

// Tipos e interfaces
interface AdvancedEditorProps {
  initialBlocks?: BlockData[];
  onSave?: (blocks: BlockData[]) => void;
  onPreview?: (blocks: BlockData[]) => void;
  className?: string;
}

interface EditorState {
  blocks: BlockData[];
  selectedBlockId: string | null;
  selectedDevice: "desktop" | "tablet" | "mobile";
  isPreviewMode: boolean;
  showGrid: boolean;
  showRulers: boolean;
  zoom: number;
}

// Configurações do editor
const EDITOR_SETTINGS = {
  snapToGrid: true,
  showBlockBounds: false,
  autoSave: true,
  autoSaveInterval: 30000, // 30 segundos
  maxHistoryItems: 50,
  defaultDevice: "desktop" as const,
  minZoom: 25,
  maxZoom: 200,
};

export const AdvancedEditor: React.FC<AdvancedEditorProps> = ({
  initialBlocks = [],
  onSave,
  onPreview,
  className = "",
}) => {
  // Estados principais
  const [editorState, setEditorState] = useState<EditorState>({
    blocks: initialBlocks,
    selectedBlockId: null,
    selectedDevice: EDITOR_SETTINGS.defaultDevice,
    isPreviewMode: false,
    showGrid: EDITOR_SETTINGS.snapToGrid,
    showRulers: false,
    zoom: 100,
  });

  const [activeTab, setActiveTab] = useState<"design" | "blocks" | "templates" | "settings">(
    "design"
  );
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(true);
  const [showComponentsPanel, setShowComponentsPanel] = useState(true);
  const [editorHistory, setEditorHistory] = useState<any[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  // Handlers de blocos
  const handleBlockSelect = useCallback((blockId: string) => {
    setEditorState(prev => ({
      ...prev,
      selectedBlockId: blockId,
    }));
  }, []);

  const handleBlockUpdate = useCallback((blockId: string, updates: Partial<BlockData>) => {
    setEditorState(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => (block.id === blockId ? { ...block, ...updates } : block)),
    }));
    setIsDirty(true);
  }, []);

  const handleBlockAdd = useCallback((newBlock: BlockData) => {
    setEditorState(prev => ({
      ...prev,
      blocks: [...prev.blocks, { ...newBlock, order: prev.blocks.length }],
    }));
    setIsDirty(true);
  }, []);

  const handleBlockDelete = useCallback((blockId: string) => {
    setEditorState(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== blockId),
      selectedBlockId: prev.selectedBlockId === blockId ? null : prev.selectedBlockId,
    }));
    setIsDirty(true);
  }, []);

  const handleBlockReorder = useCallback((newBlocks: BlockData[]) => {
    setEditorState(prev => ({
      ...prev,
      blocks: newBlocks.map((block, index) => ({ ...block, order: index })),
    }));
    setIsDirty(true);
  }, []);

  // Handlers de dispositivo e visualização
  const handleDeviceChange = useCallback((device: "desktop" | "tablet" | "mobile") => {
    setEditorState(prev => ({ ...prev, selectedDevice: device }));
  }, []);

  const togglePreviewMode = useCallback(() => {
    setEditorState(prev => ({ ...prev, isPreviewMode: !prev.isPreviewMode }));
  }, []);

  const handleZoomChange = useCallback((zoom: number) => {
    const clampedZoom = Math.max(EDITOR_SETTINGS.minZoom, Math.min(EDITOR_SETTINGS.maxZoom, zoom));
    setEditorState(prev => ({ ...prev, zoom: clampedZoom }));
  }, []);

  // Handlers de templates
  const handleApplyTemplate = useCallback((template: any) => {
    setEditorState(prev => ({
      ...prev,
      blocks: template.blocks.map((block: BlockData, index: number) => ({
        ...block,
        order: index,
      })),
    }));
    setIsDirty(true);
  }, []);

  const handleSaveAsTemplate = useCallback((templateData: any) => {
    // Implementar salvamento de template
    console.log("Saving template:", templateData);
  }, []);

  // Handlers de arquivo
  const handleSave = useCallback(async () => {
    if (onSave) {
      await onSave(editorState.blocks);
      setIsDirty(false);
    }
  }, [editorState.blocks, onSave]);

  const handlePreview = useCallback(() => {
    if (onPreview) {
      onPreview(editorState.blocks);
    }
  }, [editorState.blocks, onPreview]);

  // Auto-save
  useEffect(() => {
    if (!EDITOR_SETTINGS.autoSave || !isDirty) return;

    const timer = setTimeout(() => {
      handleSave();
    }, EDITOR_SETTINGS.autoSaveInterval);

    return () => clearTimeout(timer);
  }, [isDirty, handleSave]);

  // Block selecionado
  const selectedBlock = editorState.selectedBlockId
    ? editorState.blocks.find(block => block.id === editorState.selectedBlockId)
    : null;

  return (
    <TooltipProvider>
      <div className={`flex h-screen bg-gray-50 ${className}`}>
        {/* Sidebar Esquerda - Componentes e Templates */}
        {showComponentsPanel && (
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <Tabs
              value={activeTab}
              onValueChange={value => setActiveTab(value as any)}
              className="flex-1"
            >
              <div className="p-4 border-b border-gray-200">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="design" className="text-xs">
                    <Layout className="w-3 h-3 mr-1" />
                    Design
                  </TabsTrigger>
                  <TabsTrigger value="blocks" className="text-xs">
                    <Grid className="w-3 h-3 mr-1" />
                    Blocos
                  </TabsTrigger>
                  <TabsTrigger value="templates" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Templates
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="text-xs">
                    <Settings className="w-3 h-3 mr-1" />
                    Config
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="design" className="flex-1 p-0">
                <ComponentsLibrary
                  onAddBlock={(blockType: string) => {
                    const newBlock: BlockData = {
                      id: `${blockType}-${Date.now()}`,
                      type: blockType,
                      properties: {},
                      content: {},
                      order: editorState.blocks.length,
                    };
                    handleBlockAdd(newBlock);
                  }}
                />
              </TabsContent>

              <TabsContent value="blocks" className="flex-1 p-4">
                <DragAndDropEditor
                  blocks={editorState.blocks}
                  onBlocksReorder={handleBlockReorder}
                  onBlockSelect={handleBlockSelect}
                  onBlockDelete={handleBlockDelete}
                  selectedBlockId={editorState.selectedBlockId || undefined}
                />
              </TabsContent>

              <TabsContent value="templates" className="flex-1 p-0">
                <div className="h-full overflow-auto">
                  <TemplateGallery
                    onApplyTemplate={handleApplyTemplate}
                    onSaveAsTemplate={handleSaveAsTemplate}
                    currentBlocks={editorState.blocks}
                  />
                </div>
              </TabsContent>

              <TabsContent value="settings" className="flex-1 p-4">
                <div className="space-y-4">
                  <h3 className="font-semibold">Configurações do Editor</h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Grade</span>
                      <Button
                        variant={editorState.showGrid ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          setEditorState(prev => ({ ...prev, showGrid: !prev.showGrid }))
                        }
                      >
                        <Grid className="w-3 h-3" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Réguas</span>
                      <Button
                        variant={editorState.showRulers ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          setEditorState(prev => ({ ...prev, showRulers: !prev.showRulers }))
                        }
                      >
                        <Move className="w-3 h-3" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Zoom: {editorState.zoom}%</span>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleZoomChange(editorState.zoom - 25)}
                          disabled={editorState.zoom <= EDITOR_SETTINGS.minZoom}
                        >
                          -
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleZoomChange(100)}>
                          100%
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleZoomChange(editorState.zoom + 25)}
                          disabled={editorState.zoom >= EDITOR_SETTINGS.maxZoom}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <EditorHistory
                    blocks={editorState.blocks}
                    onBlocksChange={(blocks: BlockData[]) =>
                      setEditorState(prev => ({ ...prev, blocks }))
                    }
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Área Central - Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar Superior */}
          <div className="bg-white border-b border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowComponentsPanel(!showComponentsPanel)}
                >
                  <Layers className="w-4 h-4" />
                </Button>

                <Separator orientation="vertical" className="h-6" />

                <div className="flex items-center gap-1">
                  <Button
                    variant={editorState.selectedDevice === "desktop" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDeviceChange("desktop")}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={editorState.selectedDevice === "tablet" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDeviceChange("tablet")}
                  >
                    <Tablet className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={editorState.selectedDevice === "mobile" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDeviceChange("mobile")}
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </div>

                <Separator orientation="vertical" className="h-6" />

                <Button
                  variant={editorState.isPreviewMode ? "default" : "outline"}
                  size="sm"
                  onClick={togglePreviewMode}
                >
                  {editorState.isPreviewMode ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                  {editorState.isPreviewMode ? "Edição" : "Preview"}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {isDirty && (
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    Não salvo
                  </Badge>
                )}

                <Button variant="outline" size="sm" onClick={handlePreview}>
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>

                <Button size="sm" onClick={handleSave} disabled={!isDirty}>
                  <Save className="w-4 h-4 mr-1" />
                  Salvar
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPropertiesPanel(!showPropertiesPanel)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-hidden">
            <ResponsivePreview
              blocks={editorState.blocks}
              selectedBlockId={editorState.selectedBlockId || undefined}
              onBlockSelect={handleBlockSelect}
            />
          </div>
        </div>

        {/* Painel Direito - Propriedades */}
        {showPropertiesPanel && (
          <div className="w-80 bg-white border-l border-gray-200">
            <EnhancedPropertiesPanel
              selectedBlock={selectedBlock}
              onUpdate={updates => {
                if (selectedBlock) {
                  handleBlockUpdate(selectedBlock.id, updates);
                }
              }}
              previewMode={editorState.selectedDevice}
            />
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default AdvancedEditor;
