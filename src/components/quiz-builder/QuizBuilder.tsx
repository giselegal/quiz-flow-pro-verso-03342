import React, { useState } from "react";
import { useUnifiedProperties } from "@/hooks/useUnifiedProperties";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { useQuizBuilder } from "@/hooks/useQuizBuilder";
import { useEditor } from "@/hooks/useEditor";
import { ComponentsSidebar } from "./ComponentsSidebar";
import BuilderLayout from "./components/BuilderLayout";
import { StagesPanel } from "./StagesPanel";
import { PropertiesPanel } from "./PropertiesPanel";
import { QuizComponentType, QuizComponentData } from "@/types/quizBuilder";
import { StyleResult, StyleType } from "@/types/quiz";

const QuizBuilder: React.FC = () => {
  const {
    components,
    stages,
    activeStageId,
    selectedComponentId,
    addComponent,
    updateComponent,
    deleteComponent,
    moveComponent,
    addStage,
    updateStage,
    deleteStage,
    moveStage,
    setActiveStage,
    setSelectedComponentId,
    saveCurrentState,
    loading,
  } = useQuizBuilder();

  const { blocks, actions } = useEditor();

  const [isPreviewMode, setIsPreviewMode] = useState(false);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B89B7A] mx-auto mb-4"></div>
          <p className="text-[#432818]">Carregando editor...</p>
        </div>
      </div>
    );
  }

  // Mock data for preview - properly formatted StyleResult objects
  const mockPrimaryStyle: StyleResult = {
    category: "Natural",
    score: 85,
    percentage: 45.2,
    style: "natural" as StyleType,
    points: 85,
    rank: 1,
  };

  const mockSecondaryStyles: StyleResult[] = [
    {
      category: "Clássico",
      score: 70,
      percentage: 32.1,
      style: "classico" as StyleType,
      points: 70,
      rank: 2,
    },
    {
      category: "Romântico",
      score: 65,
      percentage: 22.7,
      style: "romantico" as StyleType,
      points: 65,
      rank: 3,
    },
  ];

  const mockQuizResult = {
    primaryStyle: mockPrimaryStyle,
    secondaryStyles: mockSecondaryStyles,
  };

  const activeStage = stages.find((stage) => stage.id === activeStageId);
  const stageComponents = components.filter(
    (c: QuizComponentData) => c.stageId === activeStageId,
  );

  const handleComponentAdd = (type: QuizComponentType) => {
    if (!activeStageId) {
      console.warn("No active stage selected");
      return;
    }

    addComponent(type);
  };

  const handleComponentUpdate = (
    id: string,
    updates: Partial<QuizComponentData>,
  ) => {
    updateComponent(id, updates);
  };

  const handleComponentDelete = (id: string) => {
    deleteComponent(id);
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
    }
  };

  const handlePreview = () => {
    // Save current state before preview
    saveCurrentState();

    // For now, just toggle preview mode
    setIsPreviewMode(!isPreviewMode);
  };

  const handleAddStage = () => {
    addStage("question");
  };

  // Safely handle editor blocks
  const handleBlockOperations = () => {
    blocks.forEach((block) => {
      const content = block.content || {};
      const title = content?.title || "";
      const text = content?.text || "";
      const imageUrl = content?.imageUrl || "";

      // Process block with safe content access
      console.log("Processing block:", { title, text, imageUrl });
    });
  };

  return (
    <div className="h-full flex flex-col bg-[#FFFAF0]">
      {/* Header */}
      <div className="bg-white border-b border-[#B89B7A]/20 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-playfair text-[#432818]">
              Quiz Builder
            </h1>
            {activeStage && (
              <p className="text-sm text-[#8F7A6A] mt-1">
                Editando: {activeStage.title}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePreview}
              className="border-[#B89B7A] text-[#432818]"
            >
              {isPreviewMode ? "Editar" : "Visualizar"}
            </Button>
            <Button
              onClick={saveCurrentState}
              className="bg-[#B89B7A] hover:bg-[#A38A69] text-white"
            >
              Salvar
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Stages Panel */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
            <StagesPanel
              stages={stages}
              activeStageId={activeStageId || ""}
              onStageSelect={setActiveStage}
              onStageAdd={handleAddStage}
              onStageUpdate={updateStage}
              onStageDelete={deleteStage}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Main Editor Area */}
          <ResizablePanel defaultSize={60}>
            <BuilderLayout
              components={stageComponents}
              stages={stages}
              activeStageId={activeStageId || ""}
              onComponentAdd={handleComponentAdd}
              onComponentUpdate={handleComponentUpdate}
              onComponentDelete={handleComponentDelete}
              onComponentSelect={setSelectedComponentId}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Properties Panel */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <PropertiesPanel
              selectedComponentId={selectedComponentId}
              components={components}
              onUpdate={(id, data) => handleComponentUpdate(id, { data })}
              onDelete={handleComponentDelete}
              onClose={() => setSelectedComponentId(null)}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default QuizBuilder;
