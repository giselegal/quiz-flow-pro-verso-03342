import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BlockEditorProps } from "./types";

export const GuaranteeBlockEditor: React.FC<BlockEditorProps> = ({
  block,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`${block.id}-title`}>Título da Garantia</Label>
        <Input
          id={`${block.id}-title`}
          value={block.content.title || ""}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="mt-1"
          placeholder="Garantia de 7 Dias"
        />
      </div>

      <div>
        <Label htmlFor={`${block.id}-text`}>Texto da Garantia</Label>
        <Textarea
          id={`${block.id}-text`}
          value={block.content.text || ""}
          onChange={(e) => onUpdate({ text: e.target.value })}
          className="mt-1"
          rows={4}
          placeholder="Se você não ficar 100% satisfeita com o conteúdo nos primeiros 7 dias, devolvemos seu dinheiro integralmente, sem burocracia."
        />
      </div>
    </div>
  );
};
