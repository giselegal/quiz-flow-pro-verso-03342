import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Image, Upload } from "lucide-react";

interface EnhancedImagePropertiesProps {
  data: any;
  onUpdate: (data: any) => void;
}

const EnhancedImageProperties: React.FC<EnhancedImagePropertiesProps> = ({ data, onUpdate }) => {
  const [activeTab, setActiveTab] = useState("url");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Fonte da Imagem</Label>
        <Tabs defaultValue="url" onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="url" className="flex-1">
              URL
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex-1">
              Upload
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex-1">
              Galeria
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="pt-4">
            <div className="space-y-2">
              <Label>URL da Imagem</Label>
              <Input
                type="text"
                value={data.imageUrl || ""}
                onChange={e =>
                  onUpdate({
                    ...data,
                    imageUrl: e.target.value,
                  })
                }
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
          </TabsContent>

          <TabsContent value="upload" className="pt-4">
            <Card className="border border-dashed p-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-gray-400" />
                <p style={{ color: "#8B7355" }}>Arraste uma imagem ou clique para fazer upload</p>
                <Button className="mt-2" size="sm">
                  Selecionar arquivo
                </Button>
              </div>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                id="image-upload"
                onChange={e => {
                  // Implementar lógica de upload
                  console.log("Implementar lógica de upload", e.target.files);
                }}
              />
            </Card>
          </TabsContent>

          <TabsContent value="gallery" className="pt-4">
            <div className="grid grid-cols-3 gap-2">
              {/* Exemplo de imagens da galeria */}
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div
                  key={i}
                  style={{ backgroundColor: "#E5DDD5" }}
                  onClick={() =>
                    onUpdate({
                      ...data,
                      imageUrl: `https://placehold.co/300x300?text=Image+${i}`,
                    })
                  }
                >
                  <Image className="h-6 w-6 text-gray-400" />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {data.imageUrl && activeTab === "url" && (
        <div className="border rounded-md p-4">
          <img
            src={data.imageUrl}
            alt="Preview"
            className="max-h-40 mx-auto object-contain"
            onError={e => {
              e.currentTarget.src = "https://placehold.co/300x300?text=Error+loading+image";
            }}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label>Texto Alternativo</Label>
        <Input
          value={data.alt || ""}
          onChange={e =>
            onUpdate({
              ...data,
              alt: e.target.value,
            })
          }
          placeholder="Descrição da imagem para acessibilidade"
        />
      </div>

      <div className="space-y-2">
        <Label>Tamanho da Imagem</Label>
        <Select
          value={data.imageSize || "medium"}
          onValueChange={value =>
            onUpdate({
              ...data,
              imageSize: value,
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Pequeno</SelectItem>
            <SelectItem value="medium">Médio</SelectItem>
            <SelectItem value="large">Grande</SelectItem>
            <SelectItem value="full">Largura Total</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default EnhancedImageProperties;
