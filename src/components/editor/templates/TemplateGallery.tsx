import React, { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { 
  Palette,
  Download,
  Upload,
  Star,
  Clock,
  Search,
  Filter,
  Plus,
  Copy,
  Eye,
  Trash2,
  Save,
  FileText,
  Layers,
  Grid3X3,
  Zap
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { BlockData } from "@/types/blocks";

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'intro' | 'question' | 'result' | 'transition' | 'custom';
  blocks: BlockData[];
  preview?: string;
  author?: string;
  featured?: boolean;
  downloads?: number;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

interface TemplateGalleryProps {
  templates?: Template[];
  currentBlocks?: BlockData[];
  onTemplateApply: (blocks: BlockData[]) => void;
  onTemplateSave?: (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onTemplateDelete?: (templateId: string) => void;
  className?: string;
}

// Templates predefinidos
const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'intro-welcome',
    name: 'Boas-vindas Elegante',
    description: 'Template de introdução com logo, título e CTA',
    category: 'intro',
    featured: true,
    downloads: 234,
    rating: 4.8,
    author: 'Sistema',
    blocks: [
      {
        id: 'intro-header',
        type: 'quiz-intro-header',
        properties: {
          logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          progressValue: 0,
          showProgress: true
        }
      },
      {
        id: 'intro-title',
        type: 'heading-inline',
        properties: {
          content: 'Descubra Seu Estilo Único',
          level: 'h1',
          textAlign: 'center',
          color: '#432818',
          fontSize: 'text-3xl'
        },
        position: 1
      },
      {
        id: 'intro-subtitle',
        type: 'text-inline',
        properties: {
          content: 'Um quiz personalizado para descobrir qual estilo combina mais com você',
          textAlign: 'center',
          color: '#6B4F43'
        },
        position: 2
      },
      {
        id: 'intro-button',
        type: 'button-inline',
        properties: {
          text: 'Começar Quiz',
          variant: 'primary',
          backgroundColor: '#B89B7A',
          textColor: '#fff',
          fullWidth: false
        },
        position: 3
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['intro', 'elegante', 'quiz', 'boas-vindas']
  },
  {
    id: 'question-visual',
    name: 'Pergunta com Imagens',
    description: 'Grid de opções com imagens e texto',
    category: 'question',
    featured: true,
    downloads: 189,
    rating: 4.6,
    author: 'Sistema',
    blocks: [
      {
        id: 'question-progress',
        type: 'quiz-progress',
        properties: {
          currentStep: 1,
          totalSteps: 10,
          showProgress: true
        },
        position: 0
      },
      {
        id: 'question-title',
        type: 'heading-inline',
        properties: {
          content: 'Qual visual você mais se identifica?',
          level: 'h2',
          textAlign: 'center',
          color: '#432818'
        },
        position: 1
      },
      {
        id: 'question-options',
        type: 'options-grid',
        properties: {
          options: [
            { id: 'opt1', text: 'Clássico', image: '/images/style-1.jpg', value: 'classico' },
            { id: 'opt2', text: 'Moderno', image: '/images/style-2.jpg', value: 'moderno' },
            { id: 'opt3', text: 'Romântico', image: '/images/style-3.jpg', value: 'romantico' },
            { id: 'opt4', text: 'Casual', image: '/images/style-4.jpg', value: 'casual' }
          ],
          columns: 2,
          showImages: true,
          multipleSelection: true,
          maxSelections: 3
        },
        position: 2
      },
      {
        id: 'question-continue',
        type: 'button-inline',
        properties: {
          text: 'Próxima Pergunta',
          variant: 'primary',
          backgroundColor: '#B89B7A',
          enableOnSelection: true
        },
        position: 3
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['pergunta', 'imagens', 'grid', 'visual']
  },
  {
    id: 'result-style',
    name: 'Resultado Personalizado',
    description: 'Mostra resultado com estilo calculado',
    category: 'result',
    featured: false,
    downloads: 156,
    rating: 4.7,
    author: 'Sistema',
    blocks: [
      {
        id: 'result-title',
        type: 'heading-inline',
        properties: {
          content: 'Seu Estilo é: {{calculatedStyle}}',
          level: 'h1',
          textAlign: 'center',
          color: '#432818'
        },
        position: 0
      },
      {
        id: 'result-card',
        type: 'result-style-card',
        properties: {
          showImage: true,
          showDescription: true,
          style: 'elegante'
        },
        position: 1
      },
      {
        id: 'result-bonus',
        type: 'bonus-showcase',
        properties: {
          title: 'Seus Bônus Exclusivos',
          bonuses: [
            { title: 'E-book Gratuito', description: 'Guia completo de estilo' },
            { title: 'Consultoria Online', description: '30 min gratuitos' }
          ]
        },
        position: 2
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['resultado', 'estilo', 'bonus', 'conversao']
  }
];

const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  templates = DEFAULT_TEMPLATES,
  currentBlocks = [],
  onTemplateApply,
  onTemplateSave,
  onTemplateDelete,
  className
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveForm, setSaveForm] = useState({
    name: '',
    description: '',
    category: 'custom' as Template['category'],
    tags: ''
  });

  // Filtrar templates
  const filteredTemplates = useMemo(() => {
    let filtered = templates;

    // Filtrar por categoria
    if (activeTab !== 'all') {
      filtered = filtered.filter(t => t.category === activeTab);
    }

    // Filtrar por busca
    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Ordenar: featured primeiro, depois por downloads
    return filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (b.downloads || 0) - (a.downloads || 0);
    });
  }, [templates, activeTab, searchTerm]);

  const handleApplyTemplate = useCallback((template: Template) => {
    const blocksWithNewIds = template.blocks.map(block => ({
      ...block,
      id: `${block.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));
    onTemplateApply(blocksWithNewIds);
  }, [onTemplateApply]);

  const handleSaveCurrentAsTemplate = useCallback(() => {
    if (!onTemplateSave) return;
    
    const newTemplate = {
      name: saveForm.name,
      description: saveForm.description,
      category: saveForm.category,
      blocks: currentBlocks,
      author: 'Você',
      featured: false,
      downloads: 0,
      rating: 0,
      tags: saveForm.tags.split(',').map(t => t.trim()).filter(Boolean)
    };
    
    onTemplateSave(newTemplate);
    setShowSaveDialog(false);
    setSaveForm({ name: '', description: '', category: 'custom', tags: '' });
  }, [onTemplateSave, currentBlocks, saveForm]);

  const renderTemplateCard = (template: Template) => {
    return (
      <Card key={template.id} className="cursor-pointer transition-all hover:shadow-lg group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-sm font-medium text-[#432818]">
                  {template.name}
                </CardTitle>
                {template.featured && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <Star className="w-3 h-3 mr-1" />
                    Destaque
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs text-gray-600">
                {template.description}
              </CardDescription>
            </div>

            {/* Ações rápidas */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyTemplate(template);
                      }}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Aplicar Template</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {template.author !== 'Sistema' && onTemplateDelete && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTemplateDelete(template.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Excluir Template</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Preview visual */}
          <div className="mb-3 p-3 bg-gray-50 rounded border-2 border-dashed border-gray-200 min-h-[80px]">
            <div className="space-y-2">
              {template.blocks.slice(0, 3).map((block, index) => (
                <div key={block.id} className="flex items-center gap-2 text-xs">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    index === 0 ? "bg-[#B89B7A]" : index === 1 ? "bg-[#aa6b5d]" : "bg-gray-400"
                  )} />
                  <Badge variant="outline" className="text-xs py-0">
                    {block.type}
                  </Badge>
                  {block.properties?.content && (
                    <span className="text-gray-500 truncate">
                      {block.properties.content.slice(0, 20)}...
                    </span>
                  )}
                </div>
              ))}
              {template.blocks.length > 3 && (
                <div className="text-xs text-gray-500">
                  +{template.blocks.length - 3} mais blocos
                </div>
              )}
            </div>
          </div>

          {/* Metadados */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  <span>{template.blocks.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  <span>{template.downloads || 0}</span>
                </div>
                {template.rating && template.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    <span>{template.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              <span>por {template.author}</span>
            </div>

            {/* Tags */}
            {template.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {template.tags.slice(0, 3).map(tag => (
                  <span 
                    key={tag}
                    className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const categories = [
    { key: 'all', label: 'Todos', icon: Grid3X3 },
    { key: 'intro', label: 'Introdução', icon: FileText },
    { key: 'question', label: 'Pergunta', icon: Eye },
    { key: 'result', label: 'Resultado', icon: Star },
    { key: 'transition', label: 'Transição', icon: Zap },
    { key: 'custom', label: 'Personalizados', icon: Palette }
  ];

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-[#432818] flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Galeria de Templates
            </CardTitle>
            <CardDescription>
              Templates prontos para usar no seu quiz
            </CardDescription>
          </div>

          {/* Salvar template atual */}
          {onTemplateSave && currentBlocks.length > 0 && (
            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Save className="w-4 h-4 mr-1" />
                  Salvar Atual
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Salvar como Template</DialogTitle>
                  <DialogDescription>
                    Transforme sua configuração atual em um template reutilizável
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="template-name">Nome do Template</Label>
                    <Input
                      id="template-name"
                      value={saveForm.name}
                      onChange={(e) => setSaveForm({...saveForm, name: e.target.value})}
                      placeholder="Ex: Pergunta com Imagens"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="template-description">Descrição</Label>
                    <Textarea
                      id="template-description"
                      value={saveForm.description}
                      onChange={(e) => setSaveForm({...saveForm, description: e.target.value})}
                      placeholder="Descreva quando usar este template..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="template-tags">Tags (separadas por vírgula)</Label>
                    <Input
                      id="template-tags"
                      value={saveForm.tags}
                      onChange={(e) => setSaveForm({...saveForm, tags: e.target.value})}
                      placeholder="pergunta, visual, quiz"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveCurrentAsTemplate}>
                    Salvar Template
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          {/* Navegação por categorias */}
          <TabsList className="grid w-full grid-cols-3 mb-4">
            {categories.slice(0, 3).map(category => {
              const Icon = category.icon;
              const count = templates.filter(t => 
                category.key === 'all' ? true : t.category === category.key
              ).length;
              
              return (
                <TabsTrigger key={category.key} value={category.key} className="text-xs">
                  <Icon className="w-3 h-3 mr-1" />
                  {category.label}
                  <span className="ml-1 text-[#B89B7A]">({count})</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="grid grid-cols-3 gap-1 mb-4">
            {categories.slice(3).map(category => {
              const Icon = category.icon;
              const count = templates.filter(t => t.category === category.key).length;
              
              return (
                <Button
                  key={category.key}
                  variant={activeTab === category.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(category.key)}
                  className="text-xs h-auto p-2"
                >
                  <Icon className="w-3 h-3" />
                  <span className="ml-1">{category.label}</span>
                  {count > 0 && <span className="ml-1">({count})</span>}
                </Button>
              );
            })}
          </div>

          {/* Grid de templates */}
          {categories.map(category => (
            <TabsContent key={category.key} value={category.key} className="mt-0">
              {filteredTemplates.length > 0 ? (
                <div className="grid gap-4">
                  {filteredTemplates.map(renderTemplateCard)}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Nenhum template encontrado</p>
                    <p className="text-sm">
                      {searchTerm ? 'Tente uma busca diferente' : 'Nenhum template nesta categoria ainda'}
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>

      {/* Footer com estatísticas */}
      <div className="border-t p-4 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{filteredTemplates.length} de {templates.length} templates</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              <span>{templates.filter(t => t.featured).length} em destaque</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              <span>{templates.reduce((sum, t) => sum + (t.downloads || 0), 0)} downloads</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TemplateGallery;
