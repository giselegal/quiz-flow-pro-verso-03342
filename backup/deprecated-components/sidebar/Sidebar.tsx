import { Card } from "@/components/ui/card";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React, { useState } from "react";
import LayoutSection from "./LayoutSection";
import OptionsSection from "./OptionsSection";

export interface SidebarProps {
  className?: string;
  onLayoutChange?: (layout: LayoutConfig) => void;
  onOptionsChange?: (options: OptionItem[]) => void;
  initialOptions?: OptionItem[];
  initialLayout?: LayoutConfig;
}

export interface LayoutConfig {
  layout: "grid" | "list" | "masonry";
  direction: "horizontal" | "vertical";
  arrangement: "start" | "center" | "end" | "space-between";
}

export interface OptionItem {
  id: string;
  text: string;
  imageUrl: string;
  value: string;
  category?: string;
  points?: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  className = "",
  onLayoutChange,
  onOptionsChange,
  initialOptions = [],
  initialLayout = {
    layout: "grid",
    direction: "vertical",
    arrangement: "start",
  },
}) => {
  // ✅ Estado do Layout
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>(initialLayout);

  // ✅ Estado das Opções
  const [options, setOptions] = useState<OptionItem[]>(initialOptions);

  // ✅ Configuração dos Sensores do DND Kit
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ✅ Handler para mudanças no layout
  const handleLayoutChange = (newLayout: LayoutConfig) => {
    setLayoutConfig(newLayout);
    onLayoutChange?.(newLayout);
  };

  // ✅ Handler para drag end
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setOptions(items => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);

        const newOptions = arrayMove(items, oldIndex, newIndex);
        onOptionsChange?.(newOptions);
        return newOptions;
      });
    }
  };

  // ✅ Handler para edição de opções
  const handleOptionUpdate = (id: string, updates: Partial<OptionItem>) => {
    setOptions(items => items.map(item => (item.id === id ? { ...item, ...updates } : item)));
  };

  // ✅ Handler para adicionar nova opção
  const handleAddOption = () => {
    // 🎯 SISTEMA 1: ID Semântico ao invés de timestamp
    const optionNumber = options.length + 1;
    const newOption: OptionItem = {
      id: `option-${optionNumber}`,
      text: "Nova opção",
      imageUrl: "https://via.placeholder.com/100x100",
      value: `value-option-${optionNumber}`,
      category: "Geral",
      points: 1,
    };

    const newOptions = [...options, newOption];
    setOptions(newOptions);
    onOptionsChange?.(newOptions);
  };

  // ✅ Handler para remover opção
  const handleRemoveOption = (id: string) => {
    const newOptions = options.filter(item => item.id !== id);
    setOptions(newOptions);
    onOptionsChange?.(newOptions);
  };

  return (
    <div
      className={`w-[24rem] h-full bg-card border-l border-border overflow-auto hidden md:block ${className}`}
    >
      <div className="px-4 pb-4 pt-2 space-y-4">
        {/* ✅ Header do Painel */}
        <div className="border-b border-border pb-4">
          <h2 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            🎨 Configurações
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Configure layout e edite opções</p>
        </div>

        {/* ✅ Seção de Layout */}
        <LayoutSection layout={layoutConfig} onLayoutChange={handleLayoutChange} />

        {/* ✅ Seção de Opções com DND Context */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext
            items={options.map(item => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <OptionsSection
              options={options}
              onOptionUpdate={handleOptionUpdate}
              onAddOption={handleAddOption}
              onRemoveOption={handleRemoveOption}
            />
          </SortableContext>
        </DndContext>

        {/* ✅ Preview do Layout Atual */}
        <Card className="p-4">
          <h3 className="text-sm font-medium text-card-foreground mb-2">📋 Preview Configuração</h3>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>
              Layout: <span className="font-mono">{layoutConfig.layout}</span>
            </div>
            <div>
              Direção: <span className="font-mono">{layoutConfig.direction}</span>
            </div>
            <div>
              Disposição: <span className="font-mono">{layoutConfig.arrangement}</span>
            </div>
            <div>
              Opções: <span className="font-mono">{options.length} itens</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Sidebar;
