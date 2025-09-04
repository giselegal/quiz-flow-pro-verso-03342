/**
 * 🎨 PROPERTY PRESETS MANAGER - GERENCIADOR DE PRESETS DE PROPRIEDADES
 * 
 * Sistema para criar, salvar e aplicar presets de propriedades,
 * permitindo reutilização de configurações comuns.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Palette,
  Save,
  Download,
  Upload,
  Star,
  Trash2,
  Copy,
  Edit3,
  Plus,
  Search,
  Tag,
  Clock,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ===== INTERFACES =====

interface PropertyPreset {
  id: string;
  name: string;
  description: string;
  category: string;
  properties: Record<string, any>;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isFavorite: boolean;
  isSystem: boolean;
  thumbnail?: string;
}

interface PropertyPresetsManagerProps {
  currentProperties: Record<string, any>;
  onApplyPreset: (properties: Record<string, any>) => void;
  onClose?: () => void;
  className?: string;
}

// ===== SYSTEM PRESETS =====

const SYSTEM_PRESETS: Omit<PropertyPreset, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>[] = [
  {
    name: 'Quiz Moderno',
    description: 'Estilo moderno com cores suaves e tipografia clean',
    category: 'quiz-styles',
    properties: {
      backgroundColor: '#FEFDFB',
      textColor: '#432818',
      primaryColor: '#B89B7A',
      fontSize: 'medium',
      fontWeight: 'normal',
      borderRadius: '12px',
      padding: '24px',
      margin: '16px'
    },
    tags: ['moderno', 'clean', 'suave'],
    isFavorite: false,
    isSystem: true
  },
  {
    name: 'Quiz Elegante',
    description: 'Design elegante com cores escuras e contrastes marcantes',
    category: 'quiz-styles',
    properties: {
      backgroundColor: '#2c1810',
      textColor: '#F3E8D3',
      primaryColor: '#D4C2A8',
      fontSize: 'large',
      fontWeight: 'semibold',
      borderRadius: '8px',
      padding: '32px',
      margin: '20px'
    },
    tags: ['elegante', 'escuro', 'contraste'],
    isFavorite: false,
    isSystem: true
  },
  {
    name: 'Quiz Minimalista',
    description: 'Estilo minimalista com foco no conteúdo',
    category: 'quiz-styles',
    properties: {
      backgroundColor: '#FFFFFF',
      textColor: '#1a1a1a',
      primaryColor: '#6b7280',
      fontSize: 'small',
      fontWeight: 'normal',
      borderRadius: '4px',
      padding: '16px',
      margin: '8px'
    },
    tags: ['minimalista', 'simples', 'clean'],
    isFavorite: false,
    isSystem: true
  },
  {
    name: 'Header com Logo',
    description: 'Configuração padrão para cabeçalho com logo e barra de progresso',
    category: 'header',
    properties: {
      showLogo: true,
      enableProgressBar: true,
      logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      logoAlt: 'Logo da Marca',
      progressValue: 0,
      headerHeight: '80px',
      backgroundColor: '#FEFDFB'
    },
    tags: ['header', 'logo', 'progresso'],
    isFavorite: false,
    isSystem: true
  },
  {
    name: 'Pergunta Múltipla Escolha',
    description: 'Layout otimizado para perguntas de múltipla escolha',
    category: 'question',
    properties: {
      questionFontSize: 'large',
      optionsLayout: 'grid',
      optionsColumns: 2,
      optionPadding: '16px',
      optionBorderRadius: '8px',
      highlightColor: '#B89B7A',
      hoverEffect: true
    },
    tags: ['pergunta', 'múltipla-escolha', 'grid'],
    isFavorite: false,
    isSystem: true
  }
];

// ===== MAIN COMPONENT =====

export const PropertyPresetsManager: React.FC<PropertyPresetsManagerProps> = ({
  currentProperties,
  onApplyPreset,
  onClose,
  className
}) => {
  // ===== STATE =====
  const [presets, setPresets] = useState<PropertyPreset[]>(() => {
    // Load system presets with generated IDs
    return SYSTEM_PRESETS.map((preset, index) => ({
      ...preset,
      id: `system-${index}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'Sistema'
    }));
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<PropertyPreset | null>(null);
  const [newPreset, setNewPreset] = useState({
    name: '',
    description: '',
    category: '',
    tags: ''
  });

  // ===== COMPUTED VALUES =====
  const categories = useMemo(() => {
    const cats = new Set(presets.map(p => p.category));
    return Array.from(cats).sort();
  }, [presets]);

  const filteredPresets = useMemo(() => {
    let filtered = presets;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(preset =>
        preset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        preset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        preset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(preset => preset.category === selectedCategory);
    }

    // Sort by favorites first, then by name
    return filtered.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [presets, searchTerm, selectedCategory]);

  // ===== HANDLERS =====
  const handleCreatePreset = useCallback(() => {
    if (!newPreset.name.trim()) return;

    const preset: PropertyPreset = {
      id: `custom-${Date.now()}`,
      name: newPreset.name,
      description: newPreset.description,
      category: newPreset.category || 'custom',
      properties: { ...currentProperties },
      tags: newPreset.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'Usuário',
      isFavorite: false,
      isSystem: false
    };

    setPresets(prev => [...prev, preset]);
    setNewPreset({ name: '', description: '', category: '', tags: '' });
    setIsCreateDialogOpen(false);
  }, [newPreset, currentProperties]);

  const handleApplyPreset = useCallback((preset: PropertyPreset) => {
    onApplyPreset(preset.properties);
  }, [onApplyPreset]);

  const handleToggleFavorite = useCallback((presetId: string) => {
    setPresets(prev => prev.map(preset =>
      preset.id === presetId
        ? { ...preset, isFavorite: !preset.isFavorite }
        : preset
    ));
  }, []);

  const handleDeletePreset = useCallback((presetId: string) => {
    setPresets(prev => prev.filter(preset => preset.id !== presetId));
  }, []);

  const handleDuplicatePreset = useCallback((preset: PropertyPreset) => {
    const duplicate: PropertyPreset = {
      ...preset,
      id: `custom-${Date.now()}`,
      name: `${preset.name} (Cópia)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'Usuário',
      isSystem: false
    };

    setPresets(prev => [...prev, duplicate]);
  }, []);

  const handleExportPresets = useCallback(() => {
    const customPresets = presets.filter(p => !p.isSystem);
    const dataStr = JSON.stringify(customPresets, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'property-presets.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [presets]);

  const handleImportPresets = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedPresets = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedPresets)) {
          const newPresets = importedPresets.map((preset, index) => ({
            ...preset,
            id: `imported-${Date.now()}-${index}`,
            createdAt: new Date(preset.createdAt),
            updatedAt: new Date(),
            isSystem: false
          }));
          setPresets(prev => [...prev, ...newPresets]);
        }
      } catch (error) {
        console.error('Erro ao importar presets:', error);
      }
    };
    reader.readAsText(file);
  }, []);

  // ===== RENDER =====
  return (
    <Card className={cn("w-full max-w-4xl", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            <CardTitle>Presets de Propriedades</CardTitle>
            <Badge variant="outline">{filteredPresets.length}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleExportPresets}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Exportar presets personalizados</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor="import-presets" className="cursor-pointer">
                    <Button size="sm" variant="outline" asChild>
                      <span>
                        <Upload className="w-4 h-4" />
                      </span>
                    </Button>
                    <input
                      id="import-presets"
                      type="file"
                      accept=".json"
                      onChange={handleImportPresets}
                      className="hidden"
                    />
                  </Label>
                </TooltipTrigger>
                <TooltipContent>Importar presets</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Criar Preset
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Preset</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="preset-name">Nome</Label>
                    <Input
                      id="preset-name"
                      value={newPreset.name}
                      onChange={(e) => setNewPreset(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Meu Estilo Favorito"
                    />
                  </div>
                  <div>
                    <Label htmlFor="preset-description">Descrição</Label>
                    <Textarea
                      id="preset-description"
                      value={newPreset.description}
                      onChange={(e) => setNewPreset(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descreva quando usar este preset..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="preset-category">Categoria</Label>
                    <Input
                      id="preset-category"
                      value={newPreset.category}
                      onChange={(e) => setNewPreset(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Ex: quiz-styles, header, custom"
                    />
                  </div>
                  <div>
                    <Label htmlFor="preset-tags">Tags (separadas por vírgula)</Label>
                    <Input
                      id="preset-tags"
                      value={newPreset.tags}
                      onChange={(e) => setNewPreset(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="Ex: moderno, azul, elegante"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreatePreset} disabled={!newPreset.name.trim()}>
                      Criar Preset
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            {onClose && (
              <Button size="sm" variant="outline" onClick={onClose}>
                ×
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar presets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">Todas as categorias</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPresets.map(preset => (
              <Card key={preset.id} className={cn(
                "relative group transition-all duration-200 hover:shadow-md",
                preset.isFavorite && "ring-2 ring-yellow-400"
              )}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {preset.isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                        <h4 className="font-medium text-sm">{preset.name}</h4>
                        {preset.isSystem && (
                          <Badge variant="secondary" className="text-xs">
                            Sistema
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {preset.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleToggleFavorite(preset.id)}
                              className="h-6 w-6 p-0"
                            >
                              <Star className={cn(
                                "w-3 h-3",
                                preset.isFavorite && "fill-current text-yellow-500"
                              )} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {preset.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDuplicatePreset(preset)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Duplicar preset</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {!preset.isSystem && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeletePreset(preset.id)}
                                className="h-6 w-6 p-0 text-red-600"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Excluir preset</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Tags */}
                  {preset.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {preset.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {preset.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{preset.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {preset.createdBy}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {preset.createdAt.toLocaleDateString()}
                    </div>
                  </div>

                  {/* Property count */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>{Object.keys(preset.properties).length} propriedades</span>
                    <Badge variant="outline" className="text-xs">
                      {preset.category}
                    </Badge>
                  </div>

                  {/* Apply button */}
                  <Button
                    size="sm"
                    onClick={() => handleApplyPreset(preset)}
                    className="w-full"
                  >
                    Aplicar Preset
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPresets.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Nenhum preset encontrado</h3>
              <p className="text-sm">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Crie seu primeiro preset para reutilizar configurações'
                }
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PropertyPresetsManager;
