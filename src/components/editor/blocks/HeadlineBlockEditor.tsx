import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BlockEditorProps } from "./types";

export const HeadlineBlockEditor: React.FC<BlockEditorProps> = ({
  block,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`${block.id}-title`}>Título</Label>
        <Input
          id={`${block.id}-title`}
          value={block.content.title || ""}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor={`${block.id}-subtitle`}>Subtítulo</Label>
        <Input
          id={`${block.id}-subtitle`}
          value={block.content.subtitle || ""}
          onChange={(e) => onUpdate({ subtitle: e.target.value })}
          className="mt-1"
        />
      </div>

      <div>
        <Label>Alinhamento</Label>
        <RadioGroup
          value={block.content.alignment || "left"}
          onValueChange={(value) => onUpdate({ alignment: value })}
          className="flex space-x-4 mt-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="left" id={`${block.id}-align-left`} />
            <Label htmlFor={`${block.id}-align-left`}>Esquerda</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="center" id={`${block.id}-align-center`} />
            <Label htmlFor={`${block.id}-align-center`}>Centro</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="right" id={`${block.id}-align-right`} />
            <Label htmlFor={`${block.id}-align-right`}>Direita</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
