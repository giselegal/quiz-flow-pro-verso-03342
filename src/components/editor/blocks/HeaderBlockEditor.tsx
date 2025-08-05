import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BlockEditorProps } from "./types";

export const HeaderBlockEditor: React.FC<BlockEditorProps> = ({ block, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`${block.id}-logo`}>Logo URL</Label>
        <Input
          id={`${block.id}-logo`}
          value={block.content.logo || ""}
          onChange={e => onUpdate({ logo: e.target.value })}
          className="mt-1"
          placeholder="URL da imagem do logo"
        />
      </div>

      <div>
        <Label htmlFor={`${block.id}-logoHeight`}>Altura do Logo (px)</Label>
        <Input
          id={`${block.id}-logoHeight`}
          type="number"
          value={block.content.logoHeight || "56"}
          onChange={e => onUpdate({ logoHeight: e.target.value })}
          className="mt-1"
          placeholder="56"
        />
      </div>

      <div>
        <Label htmlFor={`${block.id}-logoAlt`}>Texto Alternativo do Logo</Label>
        <Input
          id={`${block.id}-logoAlt`}
          value={block.content.logoAlt || ""}
          onChange={e => onUpdate({ logoAlt: e.target.value })}
          className="mt-1"
          placeholder="Logo Gisele Galvão"
        />
      </div>
    </div>
  );
};
