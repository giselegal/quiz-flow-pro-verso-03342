import React, { useState, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { ScrollArea } from '../../ui/scroll-area';
import { 
  DragOutlined, 
  MoreOutlined, 
  CopyOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  EyeInvisibleOutlined,
  PlusOutlined 
} from '@ant-design/icons';
import { Space, Typography, Empty, Tooltip } from 'antd';
import { allBlockDefinitions } from '../../../config/blockDefinitions';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

const { Text, Title } = Typography;

interface DroppableCanvasProps {
  blocks: any[];
  selectedBlockId?: string;
  onBlockSelect: (blockId: string) => void;
  onBlockDelete: (blockId: string) => void;
  onBlockDuplicate: (blockId: string) => void;
  onBlockToggleVisibility: (blockId: string) => void;
  onSaveInline: (blockId: string, updates: any) => void;
  onAddBlock: (type: string) => void;
  setShowRightSidebar: (show: boolean) => void;
  className?: string;
}

export const DroppableCanvas: React.FC<DroppableCanvasProps> = ({
  blocks = [],
  selectedBlockId,
  onBlockSelect,
  onBlockDelete,
  onBlockDuplicate,
  onBlockToggleVisibility,
  onSaveInline,
  onAddBlock,
  setShowRightSidebar,
  className = '',
}) => {
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'form-element',
    drop: (item: { type: string }) => {
      onAddBlock(item.type);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const getBlockDefinition = useCallback((type: string) => {
    return allBlockDefinitions.find(def => def.type === type);
  }, []);

  const handleBlockClick = useCallback((blockId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onBlockSelect(blockId);
    setShowRightSidebar(true);
  }, [onBlockSelect, setShowRightSidebar]);

  const renderBlockActions = useCallback((block: any) => {
    const isVisible = !block.properties?.hidden;
    
    const dropdownItems = [
      {
        key: 'duplicate',
        label: 'Duplicar',
        icon: <CopyOutlined />,
        onClick: () => onBlockDuplicate(block.id),
      },
      {
        key: 'visibility',
        label: isVisible ? 'Ocultar' : 'Mostrar',
        icon: isVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />,
        onClick: () => onBlockToggleVisibility(block.id),
      },
      {
        key: 'delete',
        label: 'Excluir',
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => onBlockDelete(block.id),
      },
    ];

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreOutlined />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onBlockDuplicate(block.id)}>
            <CopyOutlined className="mr-2 h-4 w-4" />
            Duplicar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onBlockToggleVisibility(block.id)}>
            {block.properties?.hidden ? 
              <EyeOutlined className="mr-2 h-4 w-4" /> : 
              <EyeInvisibleOutlined className="mr-2 h-4 w-4" />
            }
            {block.properties?.hidden ? 'Mostrar' : 'Ocultar'}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onBlockDelete(block.id)}
            className="text-red-600"
          >
            <DeleteOutlined className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }, [onBlockDuplicate, onBlockToggleVisibility, onBlockDelete]);

  const renderBlock = useCallback((block: any, index: number) => {
    const definition = getBlockDefinition(block.type);
    const isSelected = selectedBlockId === block.id;
    const isHidden = block.properties?.hidden;
    
    return (
      <Card
        key={block.id}
        className={`
          group relative transition-all duration-200 cursor-pointer
          ${isSelected ? 'ring-2 ring-[#B89B7A] bg-[#B89B7A]/5' : 'hover:shadow-md'}
          ${isHidden ? 'opacity-50' : ''}
          ${className}
        `}
        onClick={(e) => handleBlockClick(block.id, e)}
      >
        {/* Block Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Tooltip title="Arrastar para reordenar">
              <div className="cursor-move opacity-50 hover:opacity-100">
                <DragOutlined className="text-[#8F7A6A]" />
              </div>
            </Tooltip>
            
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-[#B89B7A]/20 to-[#aa6b5d]/20 rounded-lg flex items-center justify-center">
                {definition?.icon ? (
                  <span className="text-[#B89B7A] text-xs">
                    {definition.icon}
                  </span>
                ) : (
                  <span className="text-[#B89B7A] text-xs font-bold">
                    {index + 1}
                  </span>
                )}
              </div>
              
              <div>
                <Text strong className="text-[#432818] text-sm">
                  {definition?.name || block.type}
                </Text>
                {isHidden && (
                  <Badge variant="secondary" className="ml-2">
                    Oculto
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {renderBlockActions(block)}
          </div>
        </div>

        {/* Block Preview Content */}
        <div className="space-y-2">
          {/* Render basic block preview based on type */}
          {block.type === 'QuizStartPageBlock' && (
            <div className="p-3 bg-gradient-to-r from-[#B89B7A]/10 to-[#aa6b5d]/10 rounded-lg">
              <Title level={5} className="!mb-1 !text-[#432818]">
                {block.properties?.title || 'Página Inicial'}
              </Title>
              <Text className="text-[#8F7A6A] text-xs">
                {block.properties?.subtitle || 'Subtitle aqui'}
              </Text>
            </div>
          )}
          
          {block.type === 'QuizQuestionBlock' && (
            <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <Title level={5} className="!mb-1 !text-[#432818]">
                {block.properties?.question || 'Pergunta aqui'}
              </Title>
              <div className="flex flex-wrap gap-1 mt-2">
                {(block.properties?.options || ['Opção 1', 'Opção 2']).map((option: string, idx: number) => (
                  <Badge key={idx} variant="secondary">
                    {option}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Default preview for other block types */}
          {!['QuizStartPageBlock', 'QuizQuestionBlock'].includes(block.type) && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <Text className="text-[#8F7A6A] text-xs">
                {definition?.description || `Bloco do tipo: ${block.type}`}
              </Text>
              {block.properties && Object.keys(block.properties).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {Object.entries(block.properties).slice(0, 3).map(([key, value]) => (
                    <Badge key={key} variant="secondary">
                      {key}: {String(value).slice(0, 10)}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-lg opacity-20 -z-10" />
        )}
      </Card>
    );
  }, [
    selectedBlockId,
    getBlockDefinition,
    handleBlockClick,
    renderBlockActions,
    className
  ]);

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div className="space-y-3">
            <Text className="text-[#8F7A6A]">
              Nenhum bloco adicionado ainda
            </Text>
            <Text className="text-[#8F7A6A] text-xs">
              Arraste componentes da sidebar ou clique no botão abaixo
            </Text>
          </div>
        }
      />
      <Button
        variant="default"
        size="sm"
        onClick={() => onAddBlock('QuizStartPageBlock')}
        className="mt-4"
      >
        <PlusOutlined className="mr-2 h-4 w-4" />
        Adicionar Primeiro Bloco
      </Button>
    </div>
  );

  return (
    <ScrollArea ref={drop} className={`h-full p-4 ${isOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''}`}>
      <div className="max-w-full space-y-4">
        {blocks.length > 0 ? (
          <>
            {/* Canvas Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <Title level={4} className="!mb-1 !text-[#432818]">
                  Canvas de Edição
                </Title>
                <Text className="text-[#8F7A6A]">
                  {blocks.length} bloco{blocks.length !== 1 ? 's' : ''} adicionado{blocks.length !== 1 ? 's' : ''}
                </Text>
              </div>
              <Badge variant="secondary">
                {blocks.filter(b => !b.properties?.hidden).length} visível
                {blocks.filter(b => !b.properties?.hidden).length !== 1 ? 'is' : ''}
              </Badge>
            </div>

            {/* Blocks List */}
            <div className="space-y-3">
              {blocks.map((block, index) => renderBlock(block, index))}
            </div>

            {/* Add Block Button */}
            <Card className="border-dashed border-2 border-[#B89B7A]/30 bg-[#B89B7A]/5 hover:border-[#B89B7A] hover:bg-[#B89B7A]/10 transition-all duration-200">
              <div className="flex items-center justify-center py-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAddBlock('QuizQuestionBlock')}
                  className="text-[#B89B7A] hover:text-[#432818]"
                >
                  <PlusOutlined className="mr-2 h-4 w-4" />
                  Adicionar Novo Bloco
                </Button>
              </div>
            </Card>
          </>
        ) : (
          renderEmptyState()
        )}
      </div>
    </ScrollArea>
  );
};

export default DroppableCanvas;