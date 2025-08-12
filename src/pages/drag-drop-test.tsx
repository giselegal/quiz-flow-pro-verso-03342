import React from "react";
import { CanvasDropZone } from "@/components/editor/canvas/CanvasDropZone";
import { DndProvider } from "@/components/editor/dnd/DndProvider";
import { DraggableComponentItem } from "@/components/editor/dnd/DraggableComponentItem";
import { Block, BlockType } from "@/types/editor";
import { Image, Square, Type } from "lucide-react";

// Componente de teste para validar drag and drop
export const DragDropTestPage: React.FC = () => {
  const [blocks, setBlocks] = React.useState<Block[]>([]);
  const [selectedBlockId, setSelectedBlockId] = React.useState<string | undefined>(undefined);

  // Componentes disponíveis para teste
  const availableComponents = [
    {
      type: "text" as BlockType,
      name: "Texto",
      description: "Adicionar texto ao quiz",
      icon: <Type className="h-4 w-4" />,
      category: "Conteúdo",
    },
    {
      type: "image" as BlockType,
      name: "Imagem",
      description: "Adicionar imagem",
      icon: <Image className="h-4 w-4" />,
      category: "Mídia",
    },
    {
      type: "button" as BlockType,
      name: "Botão",
      description: "Botão interativo",
      icon: <Square className="h-4 w-4" />,
      category: "Interação",
    },
  ];

  const handleBlockAdd = (blockType: string, position?: number) => {
    // 🎯 SISTEMA 1: ID Semântico para blocos de teste
    const blockNumber = blocks.length + 1;
    const newBlock: Block = {
      id: `test-block-${blockType}-${blockNumber}`,
      type: blockType as BlockType,
      content: {
        text: `Novo bloco ${blockType}`,
        style: {},
      },
      order: position !== undefined ? position : blocks.length,
      properties: {},
    };

    console.log("📦 Teste: Adicionando bloco:", newBlock, "na posição:", position);

    setBlocks(prev => {
      if (position !== undefined && position < prev.length) {
        // Inserir na posição específica
        const newBlocks = [...prev];
        newBlocks.splice(position, 0, newBlock);
        // Reordenar os números order
        return newBlocks.map((block, index) => ({ ...block, order: index }));
      } else {
        // Adicionar no final
        return [...prev, newBlock];
      }
    });
  };

  const handleBlocksReorder = (newBlocks: any[]) => {
    console.log("🔄 Teste: Reordenando blocos:", newBlocks);

    // Mapear de volta para o formato Block
    const mappedBlocks: Block[] = newBlocks.map((blockData, index) => {
      // Encontrar o bloco original para manter dados completos
      const originalBlock = blocks.find(b => b.id === blockData.id);
      if (originalBlock) {
        return { ...originalBlock, order: index };
      }

      // Fallback: criar um bloco básico se não encontrar o original
      return {
        id: blockData.id,
        type: blockData.type as BlockType,
        content: blockData.properties || {},
        order: index,
        properties: blockData.properties || {},
      };
    });

    setBlocks(mappedBlocks);
  };

  const handleUpdateBlock = (id: string, updates: any) => {
    console.log("✏️ Teste: Atualizando bloco:", id, updates);
    setBlocks(prev => prev.map(block => (block.id === id ? { ...block, ...updates } : block)));
  };

  const handleDeleteBlock = (id: string) => {
    console.log("🗑️ Teste: Deletando bloco:", id);
    setBlocks(prev => prev.filter(block => block.id !== id));
  };

  return (
    <div style={{ backgroundColor: "#FAF9F7" }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Teste de Drag and Drop</h1>

        <DndProvider
          blocks={blocks.map(block => ({
            id: block.id,
            type: block.type,
            properties: block.properties || {},
          }))}
          onBlocksReorder={handleBlocksReorder}
          onBlockAdd={handleBlockAdd}
          onBlockSelect={setSelectedBlockId}
          selectedBlockId={selectedBlockId}
          onBlockUpdate={handleUpdateBlock}
        >
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar com componentes arrastáveis */}
            <div className="col-span-3">
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <h2 className="text-lg font-semibold mb-4">Componentes</h2>
                <div className="space-y-2">
                  {availableComponents.map(component => (
                    <DraggableComponentItem
                      key={component.type}
                      blockType={component.type}
                      title={component.name}
                      description={component.description}
                      icon={component.icon}
                      category={component.category}
                    />
                  ))}
                </div>
              </div>

              {/* Debug Info */}
              <div className="mt-4 bg-[#B89B7A]/10 rounded-lg p-3 text-xs">
                <h3 className="font-semibold mb-2">Debug Info:</h3>
                <p>Blocos no canvas: {blocks.length}</p>
                <p>Bloco selecionado: {selectedBlockId || "Nenhum"}</p>
              </div>
            </div>

            {/* Canvas principal */}
            <div className="col-span-9">
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div style={{ backgroundColor: "#FAF9F7" }}>
                  <h2 className="text-lg font-semibold">Canvas de Teste</h2>
                  <p style={{ color: "#6B4F43" }}>Arraste componentes da sidebar para aqui</p>
                </div>

                <CanvasDropZone
                  blocks={blocks}
                  selectedBlockId={selectedBlockId || null}
                  isPreviewing={false}
                  activeStageId="test"
                  stageCount={1}
                  onSelectBlock={setSelectedBlockId}
                  onUpdateBlock={handleUpdateBlock}
                  onDeleteBlock={handleDeleteBlock}
                  className="min-h-[500px]"
                />
              </div>
            </div>
          </div>

          {/* Lista de blocos para debug */}
          {blocks.length > 0 && (
            <div className="mt-6 bg-white rounded-lg p-4 shadow-sm border">
              <h3 className="text-lg font-semibold mb-3">Blocos Criados (Debug)</h3>
              <div className="space-y-2">
                {blocks.map((block, index) => (
                  <div key={block.id} style={{ backgroundColor: "#FAF9F7" }}>
                    <span className="text-sm font-mono">{index + 1}.</span>
                    <span className="font-medium">{block.type}</span>
                    <span style={{ color: "#8B7355" }}>{block.id}</span>
                    <button
                      style={{ color: "#432818" }}
                      onClick={() => handleDeleteBlock(block.id)}
                    >
                      Deletar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DndProvider>
      </div>
    </div>
  );
};

export default DragDropTestPage;
