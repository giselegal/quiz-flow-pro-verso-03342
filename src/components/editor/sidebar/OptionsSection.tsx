import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import SortableOptionItem from './SortableOptionItem';
import { OptionItem } from './Sidebar';

interface OptionsSectionProps {
  options: OptionItem[];
  onOptionUpdate: (id: string, updates: Partial<OptionItem>) => void;
  onAddOption: () => void;
  onRemoveOption: (id: string) => void;
}

const OptionsSection: React.FC<OptionsSectionProps> = ({
  options,
  onOptionUpdate,
  onAddOption,
  onRemoveOption
}) => {
  const [expandedOptions, setExpandedOptions] = useState<Set<string>>(new Set());

  // ✅ Toggle de expansão de opções
  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedOptions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedOptions(newExpanded);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            📝 Opções ({options.length})
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={onAddOption}
            className="h-8 w-8 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {options.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-sm">Nenhuma opção adicionada</p>
            <p className="text-xs">Clique no botão + para adicionar</p>
          </div>
        ) : (
          <div className="space-y-2">
            {options.map((option, index) => (
              <SortableOptionItem
                key={option.id}
                option={option}
                index={index}
                isExpanded={expandedOptions.has(option.id)}
                onToggleExpanded={() => toggleExpanded(option.id)}
                onUpdate={(updates) => onOptionUpdate(option.id, updates)}
                onRemove={() => onRemoveOption(option.id)}
              />
            ))}
          </div>
        )}

        {/* ✅ Ações em Massa */}
        {options.length > 0 && (
          <div className="pt-4 border-t border-border">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (confirm(`Remover todas as ${options.length} opções?`)) {
                    options.forEach(option => onRemoveOption(option.id));
                  }
                }}
                className="flex-1 text-xs"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Limpar Todas
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onAddOption}
                className="flex-1 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Adicionar
              </Button>
            </div>
          </div>
        )}

        {/* ✅ Estatísticas das Opções */}
        {options.length > 0 && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="text-xs text-muted-foreground">
              <div className="grid grid-cols-2 gap-2">
                <div>Total: {options.length}</div>
                <div>Com imagem: {options.filter(o => o.imageUrl && o.imageUrl !== 'https://via.placeholder.com/100x100').length}</div>
                <div>Categorias: {new Set(options.map(o => o.category || 'Sem categoria')).size}</div>
                <div>Pontos: {options.reduce((sum, o) => sum + (o.points || 0), 0)}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OptionsSection;
