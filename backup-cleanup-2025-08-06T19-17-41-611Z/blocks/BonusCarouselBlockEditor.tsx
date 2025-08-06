import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { BlockEditorProps } from "./types";

export const BonusCarouselBlockEditor: React.FC<BlockEditorProps> = ({ block, onUpdate }) => {
  const bonusImages = block.content.bonusImages || [];

  const addImage = () => {
    const newImages = [...bonusImages, { url: "", alt: "", title: "" }];
    onUpdate({ bonusImages: newImages });
  };

  const removeImage = (index: number) => {
    const newImages = bonusImages.filter((_: any, i: number) => i !== index);
    onUpdate({ bonusImages: newImages });
  };

  const updateImage = (index: number, field: "url" | "alt" | "title", value: string) => {
    const newImages = bonusImages.map((img: any, i: number) =>
      i === index ? { ...img, [field]: value } : img
    );
    onUpdate({ bonusImages: newImages });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`${block.id}-title`}>Título da Seção</Label>
        <Input
          id={`${block.id}-title`}
          value={block.content.title || ""}
          onChange={e => onUpdate({ title: e.target.value })}
          className="mt-1"
          placeholder="Você recebe também:"
        />
      </div>

      <div className="space-y-4">
        <Label>Imagens dos Bônus</Label>
        {bonusImages.map((image: any, index: number) => (
          <div key={index} className="space-y-2 p-4 border rounded-lg bg-[#FAF9F7]">
            <div className="flex justify-between items-center">
              <Label>Bônus {index + 1}</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeImage(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>

            <Input
              value={image.url}
              onChange={e => updateImage(index, "url", e.target.value)}
              placeholder="URL da imagem"
              className="mt-1"
            />

            <Input
              value={image.title || ""}
              onChange={e => updateImage(index, "title", e.target.value)}
              placeholder="Título do bônus"
              className="mt-1"
            />

            <Input
              value={image.alt}
              onChange={e => updateImage(index, "alt", e.target.value)}
              placeholder="Texto alternativo"
              className="mt-1"
            />
          </div>
        ))}

        <Button variant="outline" onClick={addImage} className="w-full mt-2">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Imagem
        </Button>
      </div>
    </div>
  );
};
