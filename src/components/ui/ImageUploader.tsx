/**
 * ImageUploader - Componente de upload/seleção de imagem melhorado
 *
 * Suporta upload por arquivo, URL e drag & drop
 */

import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, Image as ImageIcon, Link, X, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // em MB
  aspectRatio?: number;
  placeholder?: string;
}

export function ImageUploader({
  value,
  onChange,
  label,
  disabled = false,
  accept = "image/*",
  maxSize = 5,
  aspectRatio,
  placeholder = "Selecione uma imagem",
}: ImageUploaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [urlValue, setUrlValue] = useState(value);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (file: File) => {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`Arquivo muito grande. Máximo: ${maxSize}MB`);
        return;
      }

      const reader = new FileReader();
      reader.onload = e => {
        const result = e.target?.result as string;
        onChange(result);
        setIsOpen(false);
      };
      reader.readAsDataURL(file);
    },
    [maxSize, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleUrlSubmit = () => {
    if (urlValue && urlValue.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)) {
      onChange(urlValue);
      setIsOpen(false);
    }
  };

  const clearImage = () => {
    onChange("");
    setUrlValue("");
  };

  const openPreview = () => {
    setPreviewUrl(value);
  };

  return (
    <div className="space-y-2">
      {label && <Label className="text-sm font-medium">{label}</Label>}

      <div className="flex gap-2">
        {/* Preview da imagem atual */}
        <div
          className={cn(
            "w-20 h-20 rounded-md border border-gray-300 flex-shrink-0 overflow-hidden bg-gray-50",
            aspectRatio && "aspect-square"
          )}
        >
          {value ? (
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
              onClick={openPreview}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ImageIcon className="w-6 h-6" />
            </div>
          )}
        </div>

        {/* Controles */}
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={disabled} className="flex-1">
                  <Upload className="w-4 h-4 mr-2" />
                  {value ? "Alterar" : "Selecionar"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Selecionar Imagem</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                    <TabsTrigger value="url">URL</TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="space-y-4">
                    <div
                      className={cn(
                        "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                        dragActive ? "border-[#B89B7A] bg-[#B89B7A]/10" : "border-gray-300",
                        "hover:border-gray-400"
                      )}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                    >
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p style={{ color: "#6B4F43" }}>
                        Arraste uma imagem aqui ou clique para selecionar
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Escolher arquivo
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={accept}
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelect(file);
                        }}
                      />
                      <p style={{ color: "#8B7355" }}>Máximo: {maxSize}MB</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="url" className="space-y-4">
                    <div className="space-y-3">
                      <Input
                        placeholder="https://exemplo.com/imagem.jpg"
                        value={urlValue}
                        onChange={e => setUrlValue(e.target.value)}
                      />
                      <Button onClick={handleUrlSubmit} className="w-full" disabled={!urlValue}>
                        <Link className="w-4 h-4 mr-2" />
                        Usar URL
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            {value && (
              <>
                <Button variant="outline" size="sm" onClick={openPreview}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearImage}
                  style={{ color: "#432818" }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {!value && <p style={{ color: "#8B7355" }}>{placeholder}</p>}
        </div>
      </div>

      {/* Modal de preview */}
      <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Preview da Imagem</DialogTitle>
          </DialogHeader>
          {previewUrl && (
            <div className="max-h-96 overflow-auto">
              <img src={previewUrl} alt="Preview" className="w-full h-auto rounded-md" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
