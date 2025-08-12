import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EditableContent } from "@/types/editor";
import { Trash2 } from "lucide-react";

interface PropertiesPanelProps {
  selectedComponentId: string | null;
  onClose: () => void;
  onUpdate: (content: Partial<EditableContent>) => void;
  onDelete: () => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedComponentId,
  onClose: _onClose,
  onUpdate,
  onDelete,
}) => {
  if (!selectedComponentId) {
    return (
      <div className="p-4 text-center text-[#432818]/60">
        Selecione um componente para editar suas propriedades
      </div>
    );
  }

  return (
    <div className="h-full p-4 space-y-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-[#432818]">Propriedades</h3>
        <Button variant="ghost" size="sm" style={{ color: "#432818" }} onClick={onDelete}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <Card className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            placeholder="Digite o título"
            onChange={e => onUpdate({ title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtítulo</Label>
          <Input
            id="subtitle"
            placeholder="Digite o subtítulo"
            onChange={e => onUpdate({ subtitle: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="text">Texto</Label>
          <Textarea
            id="text"
            placeholder="Digite o texto"
            className="min-h-[100px]"
            onChange={e => onUpdate({ text: e.target.value })}
          />
        </div>
      </Card>
    </div>
  );
};
