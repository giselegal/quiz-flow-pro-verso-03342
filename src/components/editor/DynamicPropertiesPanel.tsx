import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { BlockDefinition, EditableContent, PropertySchema } from "@/types/editor";
import { GripVertical, Plus, Trash2, Upload, X } from "lucide-react";

// ✅ Componente para editar arrays (especialmente opções de quiz)
interface ArrayEditorProps {
  value: any[];
  onChange: (value: any[]) => void;
  property: PropertySchema;
}

const ArrayEditor: React.FC<ArrayEditorProps> = ({ value, onChange, property }) => {
  const handleAddItem = () => {
    // 🎯 SISTEMA 1: ID Semântico para diferentes tipos
    const currentItems = value || [];
    const itemNumber = currentItems.length + 1;

    const newItem =
      property.label.includes("opções") || property.label.includes("options")
        ? {
            id: `option-${itemNumber}`,
            text: "Nova opção",
            imageUrl: "https://via.placeholder.com/150x150",
            value: `value-option-${itemNumber}`,
            category: "Geral",
            points: 1,
          }
        : property.default || "";

    onChange([...value, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, updates: any) => {
    const newValue = [...value];
    newValue[index] =
      typeof newValue[index] === "object" ? { ...newValue[index], ...updates } : updates;
    onChange(newValue);
  };

  const handleMoveItem = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < value.length) {
      const newValue = [...value];
      [newValue[index], newValue[newIndex]] = [newValue[newIndex], newValue[index]];
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {property.label} ({value.length} {value.length === 1 ? "item" : "itens"})
        </span>
        <Button size="sm" onClick={handleAddItem} className="text-xs">
          <Plus className="h-3 w-3 mr-1" />
          Adicionar
        </Button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {value.map((item, index) => (
          <Card key={index} className="p-3">
            <div className="space-y-3">
              {/* Header do Item */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">Item {index + 1}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleMoveItem(index, "up")}
                    disabled={index === 0}
                    className="h-6 w-6 p-0"
                  >
                    ↑
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleMoveItem(index, "down")}
                    disabled={index === value.length - 1}
                    className="h-6 w-6 p-0"
                  >
                    ↓
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveItem(index)}
                    style={{ color: "#432818" }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Edição do Item - Se for objeto (opção de quiz) */}
              {typeof item === "object" && item !== null ? (
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs">Texto</Label>
                    <Textarea
                      value={item.text || ""}
                      onChange={e => handleUpdateItem(index, { text: e.target.value })}
                      placeholder="Texto da opção..."
                      rows={2}
                      className="text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Valor</Label>
                      <Input
                        value={item.value || ""}
                        onChange={e => handleUpdateItem(index, { value: e.target.value })}
                        placeholder="valor"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Categoria</Label>
                      <Input
                        value={item.category || ""}
                        onChange={e => handleUpdateItem(index, { category: e.target.value })}
                        placeholder="categoria"
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">URL da Imagem</Label>
                    <div className="flex gap-2">
                      <Input
                        value={item.imageUrl || ""}
                        onChange={e => handleUpdateItem(index, { imageUrl: e.target.value })}
                        placeholder="https://..."
                        className="text-sm"
                      />
                      <Button size="sm" variant="outline" className="px-2">
                        <Upload className="h-3 w-3" />
                      </Button>
                    </div>
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.text}
                        className="w-16 h-16 object-cover rounded border mt-2"
                      />
                    )}
                  </div>

                  <div>
                    <Label className="text-xs">Pontos: {item.points || 1}</Label>
                    <Input
                      type="range"
                      min="1"
                      max="10"
                      value={item.points || 1}
                      onChange={e =>
                        handleUpdateItem(index, {
                          points: parseInt(e.target.value),
                        })
                      }
                      className="text-sm"
                    />
                  </div>
                </div>
              ) : (
                /* Edição Simples - Se for string ou primitivo */
                <Input
                  value={item || ""}
                  onChange={e => handleUpdateItem(index, e.target.value)}
                  placeholder="Digite o valor..."
                  className="text-sm"
                />
              )}
            </div>
          </Card>
        ))}
      </div>

      {value.length === 0 && (
        <div style={{ borderColor: "#E5DDD5" }}>
          <div className="text-2xl mb-2">📝</div>
          <p className="text-sm">Nenhum item adicionado</p>
          <Button size="sm" onClick={handleAddItem} className="mt-2">
            <Plus className="h-3 w-3 mr-1" />
            Adicionar Primeiro Item
          </Button>
        </div>
      )}
    </div>
  );
};

interface DynamicPropertiesPanelProps {
  block: {
    id: string;
    type: string;
    content: EditableContent;
    properties?: Record<string, any>;
  };
  blockDefinition: BlockDefinition;
  onUpdateBlock: (id: string, content: Partial<EditableContent>) => void;
  onClose: () => void;
}

const DynamicPropertiesPanel: React.FC<DynamicPropertiesPanelProps> = ({
  block,
  blockDefinition,
  onUpdateBlock,
  onClose,
}) => {
  const handlePropertyChange = (key: string, value: any) => {
    onUpdateBlock(block.id, {
      ...block.content,
      [key]: value,
    });
  };

  const renderPropertyInput = (key: string, property: any) => {
    const currentValue = (block.content as any)[key] || property.default;

    switch (property.type) {
      case "string":
        return (
          <Input
            value={currentValue || ""}
            onChange={e => handlePropertyChange(key, e.target.value)}
            placeholder={property.label}
          />
        );
      case "textarea":
        return (
          <Textarea
            value={currentValue || ""}
            onChange={e => handlePropertyChange(key, e.target.value)}
            placeholder={property.label}
            rows={3}
          />
        );
      case "boolean":
        return (
          <Switch
            checked={currentValue || false}
            onCheckedChange={checked => handlePropertyChange(key, checked)}
          />
        );
      case "select":
        return (
          <Select
            value={currentValue || property.default}
            onValueChange={value => handlePropertyChange(key, value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {property.options?.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "number":
        return (
          <Input
            type="number"
            value={currentValue || ""}
            onChange={e => handlePropertyChange(key, parseFloat(e.target.value) || 0)}
            placeholder={property.label}
          />
        );
      case "array":
        return (
          <ArrayEditor
            value={currentValue || []}
            onChange={value => handlePropertyChange(key, value)}
            property={property}
          />
        );
      default:
        return (
          <Input
            value={currentValue || ""}
            onChange={e => handlePropertyChange(key, e.target.value)}
            placeholder={property.label}
          />
        );
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header do Properties Panel */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">{blockDefinition.name}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Propriedades do componente</p>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 overflow-auto">
        {Object.entries(blockDefinition.properties).map(([key, property]) => (
          <div key={key} className="space-y-2">
            <Label style={{ color: "#6B4F43" }}>{property.label}</Label>
            {renderPropertyInput(key, property)}
            {property.description && <p style={{ color: "#8B7355" }}>{property.description}</p>}
          </div>
        ))}

        {Object.keys(blockDefinition.properties).length === 0 && (
          <div style={{ color: "#8B7355" }}>
            <div className="text-4xl mb-2">⚙️</div>
            <p className="text-sm">Nenhuma propriedade disponível</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicPropertiesPanel;
