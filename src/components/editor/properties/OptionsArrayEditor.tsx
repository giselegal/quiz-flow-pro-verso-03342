/**
 * 🎨 EDITOR AVANÇADO DE OPÇÕES
 * 
 * Componente para editar array de opções individuais com:
 * - Adicionar/remover opções
 * - Editar texto, descrição, categoria
 * - Upload de imagens
 * - Configurar pontuação
 * - Reordenar via drag-and-drop
 */

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Plus,
  Trash2,
  GripVertical,
  Image as ImageIcon,
  Type,
  Hash,
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptionItem {
  id: string;
  text: string;
  description?: string;
  imageUrl?: string;
  value?: string;
  category?: string;
  points?: number;
}

interface OptionsArrayEditorProps {
  value: OptionItem[];
  onChange: (options: OptionItem[]) => void;
  className?: string;
}

export const OptionsArrayEditor: React.FC<OptionsArrayEditorProps> = ({
  value = [],
  onChange,
  className = ''
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const addOption = useCallback(() => {
    const newOption: OptionItem = {
      id: `option-${Date.now()}`,
      text: `Opção ${value.length + 1}`,
      description: '',
      imageUrl: 'https://via.placeholder.com/256x256',
      value: `option-${value.length + 1}`,
      category: 'Categoria A',
      points: 1
    };
    
    onChange([...value, newOption]);
    setExpandedIndex(value.length); // Expandir a nova opção
  }, [value, onChange]);

  const removeOption = useCallback((index: number) => {
    const newOptions = value.filter((_, i) => i !== index);
    onChange(newOptions);
    
    // Ajustar expanded index se necessário
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  }, [value, onChange, expandedIndex]);

  const updateOption = useCallback((index: number, field: keyof OptionItem, newValue: any) => {
    const newOptions = [...value];
    newOptions[index] = { ...newOptions[index], [field]: newValue };
    onChange(newOptions);
  }, [value, onChange]);

  const toggleExpanded = useCallback((index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  }, [expandedIndex]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium">Opções da Questão</h4>
          <Badge variant="secondary">{value.length}</Badge>
        </div>
        <Button
          size="sm"
          onClick={addOption}
          className="h-8"
        >
          <Plus className="w-3 h-3 mr-1" />
          Adicionar Opção
        </Button>
      </div>

      {/* Lista de opções */}
      <div className="space-y-3">
        {value.map((option, index) => {
          const isExpanded = expandedIndex === index;
          
          return (
            <Card key={option.id} className="border-muted">
              {/* Header da opção */}
              <CardHeader 
                className="pb-2 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleExpanded(index)}
              >
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">
                        {option.text || `Opção ${index + 1}`}
                      </span>
                      {option.category && (
                        <Badge variant="outline" className="text-xs">
                          {option.category}
                        </Badge>
                      )}
                      {option.points && (
                        <Badge variant="secondary" className="text-xs">
                          {option.points}pts
                        </Badge>
                      )}
                    </div>
                    {option.description && (
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {option.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeOption(index);
                    }}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardHeader>

              {/* Conteúdo expandido */}
              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Texto principal */}
                    <div className="col-span-2">
                      <Label className="text-xs flex items-center gap-1 mb-1">
                        <Type className="w-3 h-3" />
                        Texto da Opção
                      </Label>
                      <Input
                        value={option.text}
                        onChange={(e) => updateOption(index, 'text', e.target.value)}
                        placeholder="Digite o texto da opção..."
                        className="h-8 text-sm"
                      />
                    </div>

                    {/* Descrição */}
                    <div className="col-span-2">
                      <Label className="text-xs mb-1">Descrição (opcional)</Label>
                      <Textarea
                        value={option.description || ''}
                        onChange={(e) => updateOption(index, 'description', e.target.value)}
                        placeholder="Descrição adicional..."
                        className="min-h-[60px] text-sm"
                      />
                    </div>

                    {/* URL da Imagem */}
                    <div className="col-span-2">
                      <Label className="text-xs flex items-center gap-1 mb-1">
                        <ImageIcon className="w-3 h-3" />
                        URL da Imagem
                      </Label>
                      <Input
                        value={option.imageUrl || ''}
                        onChange={(e) => updateOption(index, 'imageUrl', e.target.value)}
                        placeholder="https://exemplo.com/imagem.jpg"
                        className="h-8 text-sm"
                      />
                      {option.imageUrl && (
                        <div className="mt-2">
                          <img
                            src={option.imageUrl}
                            alt={option.text}
                            className="w-16 h-16 object-cover rounded border"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Valor único */}
                    <div>
                      <Label className="text-xs mb-1">Valor (ID único)</Label>
                      <Input
                        value={option.value || ''}
                        onChange={(e) => updateOption(index, 'value', e.target.value)}
                        placeholder="valor-unico"
                        className="h-8 text-sm"
                      />
                    </div>

                    {/* Categoria */}
                    <div>
                      <Label className="text-xs flex items-center gap-1 mb-1">
                        <Tag className="w-3 h-3" />
                        Categoria
                      </Label>
                      <Input
                        value={option.category || ''}
                        onChange={(e) => updateOption(index, 'category', e.target.value)}
                        placeholder="Categoria A"
                        className="h-8 text-sm"
                      />
                    </div>

                    {/* Pontuação */}
                    <div className="col-span-2">
                      <Label className="text-xs flex items-center gap-1 mb-1">
                        <Hash className="w-3 h-3" />
                        Pontuação
                      </Label>
                      <Input
                        type="number"
                        value={option.points || 0}
                        onChange={(e) => updateOption(index, 'points', parseInt(e.target.value) || 0)}
                        min="0"
                        max="100"
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}

        {/* Estado vazio */}
        {value.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhuma opção adicionada</p>
            <p className="text-xs">Clique em "Adicionar Opção" para começar</p>
          </div>
        )}
      </div>

      {/* Resumo */}
      {value.length > 0 && (
        <div className="text-xs text-muted-foreground border-t pt-2">
          {value.length} opção{value.length !== 1 ? 'ões' : ''} • 
          {value.filter(o => o.imageUrl).length} com imagem{value.filter(o => o.imageUrl).length !== 1 ? 's' : ''} • 
          {value.reduce((sum, o) => sum + (o.points || 0), 0)} pontos total
        </div>
      )}
    </div>
  );
};

export default OptionsArrayEditor;