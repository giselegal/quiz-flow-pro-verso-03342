/**
 * 🎨 PÁGINA DE TEMPLATES - ENTRADA PARA CRIAR FUNIS
 * 
 * Interface simplificada: 1 template principal + criar do zero
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sparkles, Plus, FileText, CheckCircle2, Zap, Target, BarChart3 } from 'lucide-react';
import { getUnifiedTemplates } from '@/config/unifiedTemplatesRegistry';

interface TemplatesPageProps {
  onTemplateSelect?: (templateId: string, funnelName?: string) => void;
}

const TemplatesPage: React.FC<TemplatesPageProps> = ({ onTemplateSelect }) => {
  const [, setLocation] = useLocation();
  const [newFunnelName, setNewFunnelName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const templates = getUnifiedTemplates();
  const mainTemplate = templates[0]; // Quiz 21 Steps

  const handleUseTemplate = () => {
    if (mainTemplate) {
      setLocation(`/editor?funnel=${mainTemplate.id}`);
      onTemplateSelect?.(mainTemplate.id);
    }
  };

  const handleCreateBlank = () => {
    setIsDialogOpen(true);
  };

  const handleConfirmBlankFunnel = () => {
    if (!newFunnelName.trim()) return;
    const funnelId = `funnel-${Date.now()}`;
    setLocation(`/editor/${funnelId}?name=${encodeURIComponent(newFunnelName)}`);
    onTemplateSelect?.('template-blank', newFunnelName);
    setIsDialogOpen(false);
    setNewFunnelName('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Criar Novo Funil
          </h1>
          <p className="text-xl text-muted-foreground">
            Escolha um template validado ou comece do zero
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Main Template Card */}
          <Card 
            className="group cursor-pointer border-2 hover:border-primary/50 hover:shadow-xl transition-all duration-300"
            onClick={handleUseTemplate}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-7 w-7" />
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    Recomendado
                  </Badge>
                  <Badge variant="outline">
                    {mainTemplate?.stepCount || 21} etapas
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                {mainTemplate?.name || 'Quiz de Estilo Pessoal'}
              </CardTitle>
              <CardDescription className="text-base">
                {mainTemplate?.description || 'Template completo e validado'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Features */}
              <div className="space-y-2 mb-6">
                {(mainTemplate?.features || []).slice(0, 4).map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {feature}
                  </div>
                ))}
              </div>
              
              {/* Stats */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <div className="flex items-center gap-1.5 text-sm">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span className="font-medium">{mainTemplate?.conversionRate || '94%'}</span>
                  <span className="text-muted-foreground">conversão</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">v{mainTemplate?.version || '4.0'}</span>
                </div>
              </div>

              <Button className="w-full mt-6 group-hover:bg-primary/90" size="lg">
                <Zap className="h-4 w-4 mr-2" />
                Usar Template
              </Button>
            </CardContent>
          </Card>

          {/* Blank Template Card */}
          <Card 
            className="group cursor-pointer border-2 border-dashed hover:border-muted-foreground/50 hover:shadow-lg transition-all duration-300"
            onClick={handleCreateBlank}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-muted text-muted-foreground">
                  <FileText className="h-7 w-7" />
                </div>
                <Badge variant="outline">
                  Canvas vazio
                </Badge>
              </div>
              <CardTitle className="text-xl group-hover:text-foreground transition-colors">
                Começar do Zero
              </CardTitle>
              <CardDescription className="text-base">
                Crie seu funil personalizado com total liberdade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground/50" />
                  Canvas em branco
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground/50" />
                  Adicione blocos livremente
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground/50" />
                  Estrutura flexível
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground/50" />
                  Sem limitações
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-6">
                  Ideal para usuários avançados
                </p>
              </div>

              <Button variant="outline" className="w-full" size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Criar do Zero
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="bg-muted/30 border-muted">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Template V4 Oficial</h3>
                <p className="text-sm text-muted-foreground">
                  O template principal utiliza a estrutura V4 com validação Zod, 
                  schema consistente e otimização de performance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
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
              onKeyDown={(e) => e.key === 'Enter' && handleConfirmBlankFunnel()}
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmBlankFunnel} disabled={!newFunnelName.trim()}>
              Criar Funil
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplatesPage;
