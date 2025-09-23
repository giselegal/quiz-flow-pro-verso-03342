/**
 * 🎨 PÁGINA DE TEMPLATES - ENTRADA PARA CRIAR FUNIS
 * 
 * Página inicial para seleção de templates e criação de novos funis
 * Rota: /templates
 */

import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
    Sparkles, 
    Users, 
    TrendingUp, 
    Plus,
    FileText,
    Palette,
    Settings
} from 'lucide-react';
import { getUnifiedTemplates } from '@/config/unifiedTemplatesRegistry';

// Mapeamento de ícones para categorias
const CATEGORY_ICONS: Record<string, any> = {
    'quiz-complete': Sparkles,
    'quiz-express': Users,
    'quiz-style': Palette,
    'personal-branding': Users,
    'lead-magnet': TrendingUp,
    'webinar': FileText,
    'ecommerce': Settings,
    'default': FileText
};

const CATEGORY_COLORS: Record<string, string> = {
    'quiz-complete': 'bg-purple-500',
    'quiz-express': 'bg-blue-500',
    'quiz-style': 'bg-pink-500',
    'personal-branding': 'bg-orange-500',
    'lead-magnet': 'bg-green-500',
    'webinar': 'bg-yellow-500',
    'ecommerce': 'bg-red-500',
    'default': 'bg-gray-500'
};

// Template vazio especial
const BLANK_TEMPLATE = {
    id: 'template-blank',
    name: 'Template Vazio',
    description: 'Comece do zero com total liberdade',
    category: 'Básico',
    stepCount: 1,
    icon: FileText,
    color: 'bg-gray-500',
    isOfficial: true,
    popular: false
};

interface TemplatesPageProps {
    onTemplateSelect?: (templateId: string, funnelName?: string) => void;
}

const TemplatesPage: React.FC<TemplatesPageProps> = ({ onTemplateSelect }) => {
    const [, setLocation] = useLocation();
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [newFunnelName, setNewFunnelName] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Carregar templates do registry unificado
    const unifiedTemplates = getUnifiedTemplates();
    
    // Converter para formato compatível e adicionar template vazio
    const availableTemplates = [
        ...unifiedTemplates.map(template => ({
            id: template.id,
            name: template.name,
            description: template.description,
            category: template.category,
            steps: template.stepCount, // Usar 'steps' como propriedade padrão
            icon: CATEGORY_ICONS[template.category] || CATEGORY_ICONS.default,
            color: CATEGORY_COLORS[template.category] || CATEGORY_COLORS.default,
            popular: template.usageCount > 1000,
            isOfficial: template.isOfficial
        })),
        {
            ...BLANK_TEMPLATE,
            steps: 1 // Garantir que usa a mesma propriedade
        }
    ];

    // Extrair categorias dinâmicas dos templates
    const dynamicCategories = Array.from(new Set(unifiedTemplates.map(t => t.category)));
    const categories = ['Todos', ...dynamicCategories, 'Básico'];

    const filteredTemplates = availableTemplates.filter(template => 
        selectedCategory === 'Todos' || template.category === selectedCategory
    );

    const handleTemplateSelect = (templateId: string) => {
        if (templateId === 'template-blank') {
            setIsDialogOpen(true);
        } else {
            // Para templates pré-configurados, ir direto para o editor
            setLocation(`/editor?template=${templateId}`);
            onTemplateSelect?.(templateId);
        }
    };

    const handleCreateBlankFunnel = () => {
        if (!newFunnelName.trim()) return;
        
        const funnelId = `funnel-${Date.now()}`;
        setLocation(`/editor/${funnelId}?name=${encodeURIComponent(newFunnelName)}`);
        onTemplateSelect?.('template-blank', newFunnelName);
        setIsDialogOpen(false);
        setNewFunnelName('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Palette className="h-8 w-8 text-primary" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Templates de Funis
                        </h1>
                    </div>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Escolha um template para começar ou crie seu funil do zero
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex justify-center mb-8">
                    <div className="flex gap-2 p-1 bg-background rounded-lg border">
                        {categories.map((category: string) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setSelectedCategory(category)}
                                className="px-4"
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {filteredTemplates.map((template) => {
                        const IconComponent = template.icon;
                        return (
                            <Card 
                                key={template.id} 
                                className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/20"
                                onClick={() => handleTemplateSelect(template.id)}
                            >
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className={`p-3 rounded-lg ${template.color} text-white mb-3`}>
                                            <IconComponent className="h-6 w-6" />
                                        </div>
                                        <div className="flex gap-2">
                                            {template.popular && (
                                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                                    Popular
                                                </Badge>
                                            )}
                                             <Badge variant="outline">
                                                {template.steps} etapas
                                             </Badge>
                                        </div>
                                    </div>
                                    <CardTitle className="group-hover:text-primary transition-colors">
                                        {template.name}
                                    </CardTitle>
                                    <CardDescription>
                                        {template.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <Badge variant="secondary">
                                            {template.category}
                                        </Badge>
                                        <Button size="sm" variant="ghost" className="group-hover:bg-primary/10">
                                            Usar Template
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <div className="flex justify-center mt-12 gap-4">
                    <Button 
                        size="lg" 
                        onClick={() => handleTemplateSelect('template-blank')}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-5 w-5" />
                        Criar Funil Vazio
                    </Button>
                    <Button 
                        size="lg" 
                        variant="outline"
                        onClick={() => setLocation('/editor/templates')}
                        className="flex items-center gap-2"
                    >
                        <Sparkles className="h-5 w-5" />
                        Templates Avançados
                    </Button>
                    <Button 
                        size="lg" 
                        variant="outline"
                        onClick={() => setLocation('/dashboard')}
                        className="flex items-center gap-2"
                    >
                        <Settings className="h-5 w-5" />
                        Meus Funis
                    </Button>
                </div>
            </div>

            {/* Dialog para criar funil vazio */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Criar Novo Funil</DialogTitle>
                        <DialogDescription>
                            Digite um nome para seu novo funil
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Input
                            placeholder="Nome do funil..."
                            value={newFunnelName}
                            onChange={(e) => setNewFunnelName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateBlankFunnel()}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button 
                            onClick={handleCreateBlankFunnel}
                            disabled={!newFunnelName.trim()}
                        >
                            Criar Funil
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TemplatesPage;