import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2, Settings } from "lucide-react";
import { SimpleComponent } from "@/interfaces/quiz";

interface PropertiesPanelProps {
  selectedComponent: SimpleComponent | null;
  onComponentUpdate: (updates: Partial<SimpleComponent>) => void;
  onComponentDelete: (componentId: string) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedComponent,
  onComponentUpdate,
  onComponentDelete,
}) => {
  if (!selectedComponent) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Settings className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-center">
          Selecione um componente no canvas para editar suas propriedades
        </p>
      </div>
    );
  }

  const handlePropChange = (key: string, value: any) => {
    onComponentUpdate({
      data: {
        ...selectedComponent.data,
        [key]: value,
      },
    });
  };

  const renderPropertyEditor = () => {
    const { type, data } = selectedComponent;

    switch (type) {
      case "title":
      case "subtitle":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text">Texto</Label>
              <Textarea
                id="text"
                value={data.text || ""}
                onChange={e => handlePropChange("text", e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="alignment">Alinhamento</Label>
              <select
                id="alignment"
                value={data.alignment || "center"}
                onChange={e => handlePropChange("alignment", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="left">Esquerda</option>
                <option value="center">Centro</option>
                <option value="right">Direita</option>
              </select>
            </div>
            <div>
              <Label htmlFor="color">Cor do Texto</Label>
              <Input
                id="color"
                type="color"
                value={data.color || "#432818"}
                onChange={e => handlePropChange("color", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="fontSize">Tamanho da Fonte</Label>
              <Input
                id="fontSize"
                value={data.fontSize || ""}
                onChange={e => handlePropChange("fontSize", e.target.value)}
                placeholder="ex: 2rem, 24px"
              />
            </div>
          </div>
        );

      case "paragraph":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text">Texto</Label>
              <Textarea
                id="text"
                value={data.text || ""}
                onChange={e => handlePropChange("text", e.target.value)}
                rows={5}
              />
            </div>
            <div>
              <Label htmlFor="alignment">Alinhamento</Label>
              <select
                id="alignment"
                value={data.alignment || "left"}
                onChange={e => handlePropChange("alignment", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="left">Esquerda</option>
                <option value="center">Centro</option>
                <option value="right">Direita</option>
                <option value="justify">Justificado</option>
              </select>
            </div>
            <div>
              <Label htmlFor="color">Cor do Texto</Label>
              <Input
                id="color"
                type="color"
                value={data.color || "#432818"}
                onChange={e => handlePropChange("color", e.target.value)}
              />
            </div>
          </div>
        );

      case "image":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="src">URL da Imagem</Label>
              <Input
                id="src"
                value={data.src || ""}
                onChange={e => handlePropChange("src", e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="alt">Texto Alternativo</Label>
              <Input
                id="alt"
                value={data.alt || ""}
                onChange={e => handlePropChange("alt", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="width">Largura</Label>
              <Input
                id="width"
                value={data.width || "100%"}
                onChange={e => handlePropChange("width", e.target.value)}
                placeholder="ex: 100%, 300px"
              />
            </div>
            <div>
              <Label htmlFor="alignment">Alinhamento</Label>
              <select
                id="alignment"
                value={data.alignment || "center"}
                onChange={e => handlePropChange("alignment", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="left">Esquerda</option>
                <option value="center">Centro</option>
                <option value="right">Direita</option>
              </select>
            </div>
          </div>
        );

      case "button":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text">Texto do Botão</Label>
              <Input
                id="text"
                value={data.text || ""}
                onChange={e => handlePropChange("text", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="type">Tipo</Label>
              <select
                id="type"
                value={data.type || "primary"}
                onChange={e => handlePropChange("type", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="primary">Primário</option>
                <option value="secondary">Secundário</option>
                <option value="outline">Contorno</option>
              </select>
            </div>
            <div>
              <Label htmlFor="size">Tamanho</Label>
              <select
                id="size"
                value={data.size || "medium"}
                onChange={e => handlePropChange("size", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="small">Pequeno</option>
                <option value="medium">Médio</option>
                <option value="large">Grande</option>
              </select>
            </div>
            <div>
              <Label htmlFor="backgroundColor">Cor de Fundo</Label>
              <Input
                id="backgroundColor"
                type="color"
                value={data.backgroundColor || "#b89b7a"}
                onChange={e => handlePropChange("backgroundColor", e.target.value)}
              />
            </div>
          </div>
        );

      case "spacer":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="height">Altura</Label>
              <Input
                id="height"
                value={data.height || "2rem"}
                onChange={e => handlePropChange("height", e.target.value)}
                placeholder="ex: 2rem, 32px"
              />
            </div>
          </div>
        );

      case "input":
      case "email":
      case "phone":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="label">Rótulo</Label>
              <Input
                id="label"
                value={data.label || ""}
                onChange={e => handlePropChange("label", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="placeholder">Placeholder</Label>
              <Input
                id="placeholder"
                value={data.placeholder || ""}
                onChange={e => handlePropChange("placeholder", e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="required"
                checked={data.required || false}
                onCheckedChange={checked => handlePropChange("required", checked)}
              />
              <Label htmlFor="required">Obrigatório</Label>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-gray-500 text-center py-8">
            <p>Propriedades não disponíveis para este componente</p>
          </div>
        );
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          <span>Propriedades - {selectedComponent.type}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onComponentDelete(selectedComponent.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{renderPropertyEditor()}</CardContent>
    </Card>
  );
};

export default PropertiesPanel;
