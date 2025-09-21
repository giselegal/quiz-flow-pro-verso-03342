/**
 * 🎨 ADVANCED TEMPLATES - SISTEMA EXPANDIDO DE TEMPLATES
 * 
 * Interface para gerenciar e personalizar templates IA avançados
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Palette, 
  Sparkles, 
  Filter, 
  Search,
  Star,
  Download,
  Eye,
  Wand2
} from 'lucide-react';

interface TemplateView {
  id: string;
  name: string;
  description: string;
  category: string;
  style: string;
  industry: string;
  preview: string;
  rating: number;
  usageCount: number;
  isNew: boolean;
  isPremium: boolean;
  tags: string[];
}

const AdvancedTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<TemplateView[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<TemplateView[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedStyle, setSelectedStyle] = useState('all');

  // Mock templates data
  useEffect(() => {
    const mockTemplates: TemplateView[] = [
      {
        id: 'template-1',
        name: 'Lead Gen Moderno',
        description: 'Template otimizado para captura de leads com design moderno',
        category: 'lead-generation',
        style: 'moderno',
        industry: 'tecnologia',
        preview: '🚀',
        rating: 4.8,
        usageCount: 1247,
        isNew: false,
        isPremium: false,
        tags: ['conversion', 'form', 'cta']
      },
      {
        id: 'template-2',
        name: 'E-commerce Premium',
        description: 'Showcase de produtos com checkout otimizado',
        category: 'e-commerce',
        style: 'elegante',
        industry: 'ecommerce',
        preview: '🛍️',
        rating: 4.9,
        usageCount: 892,
        isNew: true,
        isPremium: true,
        tags: ['produto', 'checkout', 'premium']
      },
      {
        id: 'template-3',
        name: 'SaaS Conversion',
        description: 'Funil completo para software como serviço',
        category: 'saas',
        style: 'minimalista',
        industry: 'tecnologia',
        preview: '💻',
        rating: 4.7,
        usageCount: 634,
        isNew: false,
        isPremium: false,
        tags: ['saas', 'trial', 'demo']
      },
      {
        id: 'template-4',
        name: 'Consultoria Executiva',
        description: 'Template profissional para serviços de consultoria',
        category: 'consultoria',
        style: 'corporativo',
        industry: 'consultoria',
        preview: '👔',
        rating: 4.6,
        usageCount: 521,
        isNew: false,
        isPremium: true,
        tags: ['b2b', 'executivo', 'profissional']
      },
      {
        id: 'template-5',
        name: 'Curso Online',
        description: 'Estrutura completa para venda de cursos digitais',
        category: 'educacao',
        style: 'jovem',
        industry: 'educacao',
        preview: '🎓',
        rating: 4.9,
        usageCount: 1156,
        isNew: true,
        isPremium: false,
        tags: ['educacao', 'video', 'certificado']
      },
      {
        id: 'template-6',
        name: 'Saúde & Bem-estar',
        description: 'Template para profissionais de saúde e wellness',
        category: 'lead-generation',
        style: 'natural',
        industry: 'saude',
        preview: '🌿',
        rating: 4.5,
        usageCount: 387,
        isNew: false,
        isPremium: false,
        tags: ['saude', 'natural', 'consulta']
      }
    ];

    setTemplates(mockTemplates);
    setFilteredTemplates(mockTemplates);
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = templates;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // Industry filter
    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(template => template.industry === selectedIndustry);
    }

    // Style filter
    if (selectedStyle !== 'all') {
      filtered = filtered.filter(template => template.style === selectedStyle);
    }

    setFilteredTemplates(filtered);
  }, [templates, searchQuery, selectedCategory, selectedIndustry, selectedStyle]);

  const categories = [
    { value: 'all', label: 'Todas Categorias' },
    { value: 'lead-generation', label: 'Lead Generation' },
    { value: 'e-commerce', label: 'E-commerce' },
    { value: 'saas', label: 'SaaS' },
    { value: 'consultoria', label: 'Consultoria' },
    { value: 'educacao', label: 'Educação' }
  ];

  const industries = [
    { value: 'all', label: 'Todas Indústrias' },
    { value: 'tecnologia', label: 'Tecnologia' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'consultoria', label: 'Consultoria' },
    { value: 'educacao', label: 'Educação' },
    { value: 'saude', label: 'Saúde' }
  ];

  const styles = [
    { value: 'all', label: 'Todos Estilos' },
    { value: 'moderno', label: 'Moderno' },
    { value: 'elegante', label: 'Elegante' },
    { value: 'minimalista', label: 'Minimalista' },
    { value: 'corporativo', label: 'Corporativo' },
    { value: 'jovem', label: 'Jovem' },
    { value: 'natural', label: 'Natural' }
  ];

  const generateCustomTemplate = () => {
    console.log('🎨 Gerando template personalizado...');
    // Simula integração com sistema IA
    alert('🎨 Template personalizado será gerado em breve!');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Palette className="w-6 h-6" />
            Templates Avançados
          </h2>
          <p className="text-muted-foreground">
            Biblioteca expandida com templates IA personalizados
          </p>
        </div>
        
        <Button 
          onClick={generateCustomTemplate}
          className="bg-gradient-to-r from-purple-500 to-pink-500"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Gerar com IA
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Templates</span>
            </div>
            <p className="text-2xl font-bold mt-1">{templates.length}</p>
            <p className="text-xs text-muted-foreground">
              +2 novos esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Downloads</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {templates.reduce((sum, t) => sum + t.usageCount, 0).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              Total de usos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Avaliação</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {(templates.reduce((sum, t) => sum + t.rating, 0) / templates.length).toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">
              Média geral
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium">IA Cache</span>
            </div>
            <p className="text-2xl font-bold mt-1">87.3%</p>
            <p className="text-xs text-muted-foreground">
              Hit rate atual
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm bg-background"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm bg-background"
              >
                {industries.map(ind => (
                  <option key={ind.value} value={ind.value}>
                    {ind.label}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm bg-background"
              >
                {styles.map(style => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              {/* Preview */}
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-4xl border-b">
                {template.preview}
              </div>
              
              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-sm">{template.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      {renderStars(template.rating)}
                      <span className="text-xs text-muted-foreground ml-1">
                        ({template.usageCount})
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    {template.isNew && (
                      <Badge variant="default" className="text-xs">
                        Novo
                      </Badge>
                    )}
                    {template.isPremium && (
                      <Badge variant="secondary" className="text-xs">
                        Premium
                      </Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {template.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {template.tags.slice(0, 3).map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-3 h-3 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm" className="flex-1">
                    <Download className="w-3 h-3 mr-1" />
                    Usar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Nenhum template encontrado
            </h3>
            <p className="text-muted-foreground mb-4">
              Ajuste os filtros ou use nossa IA para gerar um template personalizado
            </p>
            <Button onClick={generateCustomTemplate}>
              <Wand2 className="w-4 h-4 mr-2" />
              Gerar Template Personalizado
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Load More */}
      {filteredTemplates.length > 0 && (
        <div className="text-center">
          <Button variant="outline">
            Carregar Mais Templates
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdvancedTemplates;