// 📋 Template Gallery - Sistema de Gerenciamento de Templates
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BlockData } from '@/types/blocks';
import {
  Clock,
  Copy,
  Download,
  Eye,
  Grid,
  Heart,
  LayoutTemplate,
  List,
  Plus,
  Search,
  SortAsc,
  SortDesc,
  Star,
  Trash2,
} from 'lucide-react';
import React, { useState } from 'react';

// Tipos do Template
interface Template {
  id: string;
  name: string;
  description: string;
  category: 'intro' | 'question' | 'result' | 'custom';
  tags: string[];
  blocks: BlockData[];
  thumbnail?: string;
  isPublic: boolean;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  author?: string;
  downloads?: number;
  rating?: number;
}

interface TemplateGalleryProps {
  onApplyTemplate: (template: Template) => void;
  currentBlocks: BlockData[];
  onSaveAsTemplate?: (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

// Templates predefinidos
const PREDEFINED_TEMPLATES: Template[] = [
  {
    id: 'elegant-intro',
    name: 'Introdução Elegante',
    description: 'Template sofisticado para página inicial do quiz',
    category: 'intro',
    isPublic: true,
    isFavorite: false,
    thumbnail: '🎭',
    author: 'Quiz Design Team',
    downloads: 42,
    rating: 4.8,
    blocks: [
      {
        id: 'intro-header',
        type: 'quiz-intro-header',
        properties: {
          logoUrl:
            'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          progressValue: 0,
          showProgress: true,
        },
        content: {},
        order: 0,
      },
      {
        id: 'intro-title',
        type: 'heading-inline',
        properties: {
          content: 'Descubra Seu Estilo Único',
          level: 'h1',
          textAlign: 'center',
          color: '#432818',
          fontSize: 'text-3xl',
        },
        content: {},
        order: 1,
      },
      {
        id: 'intro-subtitle',
        type: 'text-inline',
        properties: {
          content: 'Um quiz personalizado para descobrir qual estilo combina mais com você',
          textAlign: 'center',
          color: '#6B4F43',
        },
        content: {},
        order: 2,
      },
      {
        id: 'intro-button',
        type: 'button-inline',
        properties: {
          text: 'Começar Quiz',
          variant: 'primary',
          backgroundColor: '#B89B7A',
          textColor: '#fff',
          fullWidth: false,
        },
        content: {},
        order: 3,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['intro', 'elegante', 'quiz', 'boas-vindas'],
  },
  {
    id: 'question-visual',
    name: 'Pergunta Visual',
    description: 'Layout otimizado para perguntas com imagens',
    category: 'question',
    isPublic: true,
    isFavorite: true,
    thumbnail: '❓',
    author: 'Quiz Design Team',
    downloads: 38,
    rating: 4.9,
    blocks: [
      {
        id: 'question-header',
        type: 'quiz-header',
        properties: {
          logoUrl:
            'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          progressValue: 25,
          showProgress: true,
          stepNumber: '2 de 8',
        },
        content: {},
        order: 0,
      },
      {
        id: 'question-title',
        type: 'text-inline',
        properties: {
          content: 'Qual dessas opções mais combina com você?',
          fontSize: 'text-2xl',
          fontWeight: 'font-bold',
          textAlign: 'center',
          color: '#432818',
        },
        content: {},
        order: 1,
      },
      {
        id: 'question-image',
        type: 'image-display-inline',
        properties: {
          src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838066/sample-question.webp',
          alt: 'Imagem da pergunta',
          width: 400,
          height: 300,
        },
        content: {},
        order: 2,
      },
      {
        id: 'question-options',
        type: 'quiz-options-grid',
        properties: {
          options: [
            { id: 'opt1', text: 'Opção A', value: 'a' },
            { id: 'opt2', text: 'Opção B', value: 'b' },
            { id: 'opt3', text: 'Opção C', value: 'c' },
            { id: 'opt4', text: 'Opção D', value: 'd' },
          ],
          columns: 2,
          showImages: true,
        },
        content: {},
        order: 3,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['pergunta', 'visual', 'imagem', 'options'],
  },
  {
    id: 'result-celebration',
    name: 'Resultado Celebração',
    description: 'Template comemorativo para exibir resultados',
    category: 'result',
    isPublic: true,
    isFavorite: false,
    thumbnail: '🎉',
    author: 'Quiz Design Team',
    downloads: 29,
    rating: 4.7,
    blocks: [
      {
        id: 'result-celebration',
        type: 'text-inline',
        properties: {
          content: '🎉 Parabéns! Descobrimos seu estilo!',
          fontSize: 'text-3xl',
          fontWeight: 'font-bold',
          textAlign: 'center',
          color: '#10B981',
        },
        content: {},
        order: 0,
      },
      {
        id: 'result-image',
        type: 'image-display-inline',
        properties: {
          src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838175/result-celebration.webp',
          alt: 'Resultado do quiz',
          width: 500,
          height: 400,
        },
        content: {},
        order: 1,
      },
      {
        id: 'result-description',
        type: 'text-inline',
        properties: {
          content:
            'Seu estilo reflete uma personalidade única. Veja as recomendações personalizadas para você.',
          textAlign: 'center',
          fontSize: 'text-lg',
          color: '#6B7280',
        },
        content: {},
        order: 2,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['resultado', 'celebração', 'final', 'parabéns'],
  },
  {
    id: 'quiz-estilo-pessoal-completo',
    name: 'Quiz Estilo Pessoal - Template Completo',
    description: 'Modelo completo para quiz de estilo pessoal, pronto para sistemas de moda.',
    category: 'intro',
    isPublic: true,
    isFavorite: true,
    thumbnail: '👗',
    author: 'Gisele Galvão',
    downloads: 0,
    rating: 5.0,
    blocks: [
      {
        id: 'quiz-intro-header-step01',
        type: 'quiz-intro-header',
        properties: {
          logoUrl:
            'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          logoAlt: 'Logo Gisele Galvão - Consultoria de Estilo',
          logoWidth: 120,
          logoHeight: 120,
          progressValue: 0,
          progressMax: 100,
          showBackButton: false,
          showProgress: true,
          title: 'Descubra Seu Estilo Pessoal',
          subtitle: 'Quiz Personalizado de Estilo',
          description: 'Em poucos minutos, descubra seu estilo predominante',
          containerWidth: 'full',
          containerPosition: 'center',
          gridColumns: 'auto',
          spacing: 'normal',
          marginTop: 0,
          marginBottom: 16,
          backgroundColor: 'transparent',
          textColor: '#432818',
          mobileLogoWidth: 80,
          mobileLogoHeight: 80,
          mobileFontSize: 'text-lg',
        },
        content: {},
        order: 0,
      },
      {
        id: 'decorative-bar-step01',
        type: 'decorative-bar-inline',
        properties: {
          width: '100%',
          height: 4,
          color: '#B89B7A',
          gradientColors: ['#B89B7A', '#D4C2A8', '#B89B7A'],
          borderRadius: 3,
          showShadow: true,
          containerWidth: 'full',
          containerPosition: 'center',
          gridColumns: 'auto',
          spacing: 'none',
          marginTop: 0,
          marginBottom: 24,
          backgroundColor: 'transparent',
          animationType: 'fadeIn',
          animationDuration: 0.5,
          animationDelay: 0.2,
        },
        content: {},
        order: 1,
      },
      {
        id: 'intro-block-step01',
        type: 'step01-intro',
        properties: {
          title: 'Bem-vindo ao Quiz de Estilo Pessoal',
          descriptionTop: 'Descubra seu estilo único através de perguntas personalizadas.',
          descriptionBottom: 'Vamos começar! Primeiro, nos conte seu nome:',
          imageIntro:
            'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/quiz-intro-image.webp',
          inputLabel: 'Seu Nome',
          inputPlaceholder: 'Digite seu nome aqui',
          buttonText: 'Iniciar Quiz',
          privacyText: 'Seus dados são seguros conosco. Confira nossa política de privacidade.',
          footerText: 'Desenvolvido com ❤️ para você descobrir seu estilo único',
          required: true,
          scale: 100,
          alignment: 'center',
          backgroundColor: 'transparent',
          backgroundOpacity: 100,
          textColor: '#432818',
          showImage: true,
          showInput: true,
          containerWidth: 'full',
          containerPosition: 'center',
          spacing: 'normal',
          marginTop: 32,
          marginBottom: 32,
        },
        content: {},
        order: 2,
      },
      {
        id: 'main-title-step01',
        type: 'text-inline',
        properties: {
          content:
            'Chega de um guarda-roupa lotado e da sensação de que [#432818]nada combina com você[/#432818].',
          text: 'Chega de um guarda-roupa lotado e da sensação de que nada combina com você.',
          fontSize: 'text-3xl',
          fontWeight: 'font-bold',
          fontFamily: 'Playfair Display, serif',
          lineHeight: '1.2',
          letterSpacing: 'normal',
          textAlign: 'text-center',
          textWidth: 'w-full',
          color: '#B89B7A',
          textColor: '#B89B7A',
          backgroundColor: 'transparent',
          containerWidth: 'large',
          containerPosition: 'center',
          gridColumns: 'full',
          spacing: 'none',
          marginTop: 0,
          marginBottom: 20,
          marginLeft: 0,
          marginRight: 0,
          mobileFontSize: 'text-2xl',
          mobileLineHeight: '1.3',
          mobileMarginBottom: 16,
          hoverEffect: true,
          shadowEffect: false,
          borderEffect: false,
        },
        content: {},
        order: 3,
      },
      {
        id: 'hero-image-step01',
        type: 'image-display-inline',
        properties: {
          src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.webp',
          alt: 'Transforme seu guarda-roupa - Descubra seu estilo pessoal',
          width: 600,
          height: 400,
          className: 'object-cover w-full max-w-2xl h-80 rounded-xl mx-auto shadow-lg',
          borderRadius: 12,
          shadow: true,
          objectFit: 'cover',
          textAlign: 'text-center',
          containerWidth: 'large',
          containerPosition: 'center',
          gridColumns: 'auto',
          spacing: 'small',
          marginTop: 0,
          marginBottom: 20,
          backgroundColor: 'transparent',
          borderColor: '#B89B7A',
          mobileWidth: 350,
          mobileHeight: 250,
          mobileClassName: 'object-cover w-full h-60 rounded-lg mx-auto shadow-md',
          hoverEffect: true,
          zoomOnHover: false,
          lazyLoading: true,
        },
        content: {},
        order: 4,
      },
      {
        id: 'motivation-unified-step01',
        type: 'text-inline',
        properties: {
          content:
            'Em poucos minutos, descubra seu [#B89B7A]**Estilo Predominante**[/#B89B7A] — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.',
          text: 'Em poucos minutos, descubra seu Estilo Predominante — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.',
          fontSize: 'text-xl',
          fontWeight: 'font-normal',
          fontFamily: 'Inter, sans-serif',
          lineHeight: '1.6',
          letterSpacing: 'normal',
          textAlign: 'text-center',
          textWidth: 'w-full',
          color: '#432818',
          textColor: '#432818',
          backgroundColor: 'transparent',
          containerWidth: 'medium',
          containerPosition: 'center',
          gridColumns: 'full',
          spacing: 'small',
          marginTop: 24,
          marginBottom: 24,
          marginLeft: 0,
          marginRight: 0,
          mobileFontSize: 'text-lg',
          mobileLineHeight: '1.5',
          mobileMarginTop: 16,
          mobileMarginBottom: 16,
          hoverEffect: false,
          shadowEffect: false,
          borderEffect: false,
        },
        content: {},
        order: 5,
      },
      {
        id: 'legal-notice-step01',
        type: 'legal-notice-inline',
        properties: {
          privacyText:
            'Seu nome é necessário para personalizar sua experiência. Ao clicar, você concorda com nossa política de privacidade',
          copyrightText: '© 2025 Gisele Galvão - Todos os direitos reservados',
          termsText: 'Termos de Uso',
          showIcon: true,
          iconType: 'shield',
          iconColor: '#B89B7A',
          textAlign: 'text-center',
          textSize: 'text-xs',
          fontSize: 12,
          fontFamily: 'Inter, sans-serif',
          fontWeight: '400',
          lineHeight: '1.4',
          textColor: '#6B7280',
          linkColor: '#B89B7A',
          backgroundColor: 'transparent',
          containerWidth: 'full',
          containerPosition: 'center',
          gridColumns: 'auto',
          spacing: 'small',
          marginTop: 24,
          marginBottom: 16,
          mobileFontSize: 11,
          mobileLineHeight: '1.3',
          mobileMarginTop: 16,
          mobileMarginBottom: 12,
          privacyUrl: '/privacy-policy',
          termsUrl: '/terms-of-service',
          linkTarget: '_blank',
          showPrivacyLink: true,
          showTermsLink: true,
          showCopyright: true,
        },
        content: {},
        order: 6,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['intro', 'quiz', 'estilo', 'pessoal', 'moda', 'completo', 'gisele'],
  },
];

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  onApplyTemplate,
  currentBlocks,
  onSaveAsTemplate,
}) => {
  // Estados
  const [templates, setTemplates] = useState<Template[]>(PREDEFINED_TEMPLATES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'downloads' | 'rating'>('created');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Estados para criação/edição de templates
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: 'custom' as Template['category'],
    tags: [] as string[],
    isPublic: false,
  });

  // Filtrar templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesFavorites = !showFavoritesOnly || template.isFavorite;

    return matchesSearch && matchesCategory && matchesFavorites;
  });

  // Ordenar templates
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'created':
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
        break;
      case 'downloads':
        comparison = (a.downloads || 0) - (b.downloads || 0);
        break;
      case 'rating':
        comparison = (a.rating || 0) - (b.rating || 0);
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Aplicar template
  const handleApplyTemplate = (template: Template) => {
    onApplyTemplate(template);
  };

  // Salvar template atual
  const handleSaveTemplate = () => {
    if (!newTemplate.name.trim()) return;

    const template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'> = {
      ...newTemplate,
      blocks: currentBlocks,
      isFavorite: false,
      author: 'Você',
      downloads: 0,
      rating: 5,
    };

    if (onSaveAsTemplate) {
      onSaveAsTemplate(template);
    }

    const newTemplateWithId: Template = {
      ...template,
      id: `custom-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTemplates(prev => [...prev, newTemplateWithId]);
    setShowCreateDialog(false);
    setNewTemplate({
      name: '',
      description: '',
      category: 'custom',
      tags: [],
      isPublic: false,
    });
  };

  // Toggle favorito
  const toggleFavorite = (templateId: string) => {
    setTemplates(prev =>
      prev.map(template =>
        template.id === templateId ? { ...template, isFavorite: !template.isFavorite } : template
      )
    );
  };

  // Duplicar template
  const duplicateTemplate = (template: Template) => {
    const duplicated: Template = {
      ...template,
      id: `${template.id}-copy-${Date.now()}`,
      name: `${template.name} (Cópia)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false,
      isFavorite: false,
      downloads: 0,
    };

    setTemplates(prev => [...prev, duplicated]);
  };

  // Deletar template
  const deleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{ color: '#432818' }}>Galeria de Templates</h2>
          <p style={{ color: '#6B4F43' }}>Escolha um template ou crie o seu próprio</p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Salvar como Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Novo Template</DialogTitle>
              <DialogDescription>
                Salve sua configuração atual como um template reutilizável
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="template-name">Nome do Template</Label>
                <Input
                  id="template-name"
                  value={newTemplate.name}
                  onChange={e => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Meu Quiz Personalizado"
                />
              </div>

              <div>
                <Label htmlFor="template-description">Descrição</Label>
                <Textarea
                  id="template-description"
                  value={newTemplate.description}
                  onChange={e => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o propósito deste template..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="template-category">Categoria</Label>
                <Select
                  value={newTemplate.category}
                  onValueChange={(value: Template['category']) =>
                    setNewTemplate(prev => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="intro">Introdução</SelectItem>
                    <SelectItem value="question">Pergunta</SelectItem>
                    <SelectItem value="result">Resultado</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveTemplate} disabled={!newTemplate.name.trim()}>
                Salvar Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Controles de Filtro e Busca */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar templates..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Categorias</SelectItem>
            <SelectItem value="intro">Introdução</SelectItem>
            <SelectItem value="question">Pergunta</SelectItem>
            <SelectItem value="result">Resultado</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value: typeof sortBy) => setSortBy(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created">Data</SelectItem>
            <SelectItem value="name">Nome</SelectItem>
            <SelectItem value="downloads">Downloads</SelectItem>
            <SelectItem value="rating">Avaliação</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={sortOrder === 'desc' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
                >
                  {sortOrder === 'desc' ? (
                    <SortDesc className="w-4 h-4" />
                  ) : (
                    <SortAsc className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{sortOrder === 'desc' ? 'Decrescente' : 'Crescente'}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showFavoritesOnly ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowFavoritesOnly(prev => !prev)}
                >
                  <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Apenas Favoritos</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode(prev => (prev === 'grid' ? 'list' : 'grid'))}
                >
                  {viewMode === 'grid' ? (
                    <Grid className="w-4 h-4" />
                  ) : (
                    <List className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {viewMode === 'grid' ? 'Visualização em Grade' : 'Visualização em Lista'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Grid/Lista de Templates */}
      <div
        className={
          viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'
        }
      >
        {sortedTemplates.map(template => (
          <div
            key={template.id}
            className={`bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${
              viewMode === 'list' ? 'flex' : ''
            }`}
          >
            {/* Thumbnail/Preview */}
            <div
              className={`bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center ${
                viewMode === 'grid' ? 'h-32' : 'w-24 h-24 flex-shrink-0'
              }`}
            >
              <span className="text-3xl">{template.thumbnail || '📄'}</span>
            </div>

            {/* Conteúdo */}
            <div className="p-4 flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 style={{ color: '#432818' }}>{template.name}</h3>
                <div className="flex items-center gap-1 ml-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(template.id)}
                          className="p-1 h-auto"
                        >
                          <Heart
                            className={`w-3 h-3 ${
                              template.isFavorite ? 'fill-current text-red-500' : 'text-gray-400'
                            }`}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {template.isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <p style={{ color: '#6B4F43' }}>{template.description}</p>

              <div className="flex flex-wrap gap-1 mb-3">
                <Badge variant="secondary" className="text-xs">
                  {template.category}
                </Badge>
                {template.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {template.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{template.tags.length - 2}
                  </Badge>
                )}
              </div>

              {/* Metadados */}
              <div style={{ color: '#8B7355' }}>
                <div className="flex items-center gap-2">
                  {template.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current text-yellow-400" />
                      <span>{template.rating}</span>
                    </div>
                  )}
                  {template.downloads !== undefined && (
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      <span>{template.downloads}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{template.createdAt.toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => handleApplyTemplate(template)} className="flex-1">
                  <Eye className="w-3 h-3 mr-1" />
                  Aplicar
                </Button>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => duplicateTemplate(template)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Duplicar Template</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {(!template.isPublic || template.author === 'Você') && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteTemplate(template.id)}
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
          </div>
        ))}
      </div>

      {/* Estado vazio */}
      {sortedTemplates.length === 0 && (
        <div className="text-center py-12">
          <LayoutTemplate className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 style={{ color: '#432818' }}>Nenhum template encontrado</h3>
          <p style={{ color: '#6B4F43' }}>
            {searchTerm || selectedCategory !== 'all' || showFavoritesOnly
              ? 'Tente ajustar os filtros de busca'
              : 'Crie seu primeiro template personalizado'}
          </p>
          {!searchTerm && selectedCategory === 'all' && !showFavoritesOnly && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Template
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;
