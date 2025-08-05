import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BlockEditorProps } from "./types";

export const SecondaryStylesBlockEditor: React.FC<BlockEditorProps> = ({ block, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`${block.id}-title`}>Título dos Estilos Secundários</Label>
        <Input
          id={`${block.id}-title`}
          value={block.content.title || ""}
          onChange={e => onUpdate({ title: e.target.value })}
          className="mt-1"
          placeholder="Seus Estilos Complementares"
        />
      </div>

      <div>
        <Label htmlFor={`${block.id}-description`}>Descrição dos Estilos Secundários</Label>
        <Input
          id={`${block.id}-description`}
          value={block.content.text || ""}
          onChange={e => onUpdate({ text: e.target.value })}
          className="mt-1"
          placeholder="Descrição dos estilos complementares"
        />
      </div>
    </div>
  );
};
