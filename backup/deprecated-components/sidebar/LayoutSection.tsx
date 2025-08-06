import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Grid, List, Layers } from "lucide-react";

export interface LayoutConfig {
  layout: "grid" | "list" | "masonry";
  direction: "horizontal" | "vertical";
  arrangement: "start" | "center" | "end" | "space-between";
}

interface LayoutSectionProps {
  layout: LayoutConfig;
  onLayoutChange: (layout: LayoutConfig) => void;
}

const LayoutSection: React.FC<LayoutSectionProps> = ({ layout, onLayoutChange }) => {
  // ✅ Handler para mudança de layout
  const handleLayoutChange = (key: keyof LayoutConfig, value: string) => {
    const newLayout = { ...layout, [key]: value };
    onLayoutChange(newLayout);
  };

  // ✅ Ícones para os layouts
  const getLayoutIcon = (layoutType: string) => {
    switch (layoutType) {
      case "grid":
        return <Grid className="w-4 h-4" />;
      case "list":
        return <List className="w-4 h-4" />;
      case "masonry":
        return <Layers className="w-4 h-4" />;
      default:
        return <Grid className="w-4 h-4" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">🎯 Layout</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ✅ Select de Layout */}
        <div className="space-y-2">
          <Label htmlFor="layout-select" className="text-sm font-medium">
            Tipo de Layout
          </Label>
          <Select
            value={layout.layout}
            onValueChange={value => handleLayoutChange("layout", value)}
          >
            <SelectTrigger id="layout-select">
              <div className="flex items-center gap-2">
                {getLayoutIcon(layout.layout)}
                <SelectValue placeholder="Selecione o layout" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">
                <div className="flex items-center gap-2">
                  <Grid className="w-4 h-4" />
                  <span>Grid</span>
                </div>
              </SelectItem>
              <SelectItem value="list">
                <div className="flex items-center gap-2">
                  <List className="w-4 h-4" />
                  <span>Lista</span>
                </div>
              </SelectItem>
              <SelectItem value="masonry">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>Masonry</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ✅ Select de Direção */}
        <div className="space-y-2">
          <Label htmlFor="direction-select" className="text-sm font-medium">
            Direção
          </Label>
          <Select
            value={layout.direction}
            onValueChange={value => handleLayoutChange("direction", value)}
          >
            <SelectTrigger id="direction-select">
              <SelectValue placeholder="Selecione a direção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="horizontal">Horizontal</SelectItem>
              <SelectItem value="vertical">Vertical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ✅ Select de Disposição */}
        <div className="space-y-2">
          <Label htmlFor="arrangement-select" className="text-sm font-medium">
            Disposição
          </Label>
          <Select
            value={layout.arrangement}
            onValueChange={value => handleLayoutChange("arrangement", value)}
          >
            <SelectTrigger id="arrangement-select">
              <SelectValue placeholder="Selecione a disposição" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="start">Início</SelectItem>
              <SelectItem value="center">Centro</SelectItem>
              <SelectItem value="end">Fim</SelectItem>
              <SelectItem value="space-between">Espaçamento</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ✅ Preview Visual do Layout */}
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <Label className="text-xs font-medium text-muted-foreground mb-2 block">Preview</Label>
          <div className="flex items-center justify-center h-16 bg-background rounded border border-dashed">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              {getLayoutIcon(layout.layout)}
              <span>{layout.layout}</span>
              <span>•</span>
              <span>{layout.direction}</span>
              <span>•</span>
              <span>{layout.arrangement}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LayoutSection;
