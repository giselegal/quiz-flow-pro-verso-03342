/**
 * 🚀 BUILDER SYSTEM DEMO - FASE 1 ATIVA
 * 
 * Página de demonstração do Builder System completamente ativado
 * Mostra todas as funcionalidades implementadas na Fase 1
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BuilderSystemPanel } from '@/components/editor/panels/BuilderSystemPanel';
import { BuilderSystemToolbar } from '@/components/editor/toolbar/BuilderSystemToolbar';
import { useBuilderSystem } from '@/hooks/useBuilderSystem';
import { useToast } from '@/components/ui/use-toast';
import { 
  CheckCircle, 
  Rocket, 
  Brain, 
  Zap, 
  LayoutTemplate,
  TrendingUp,
  Sparkles,
  Activity,
  Star,
  ArrowRight
} from 'lucide-react';

const BuilderSystemDemo: React.FC = () => {
  const { toast } = useToast();
  const builderSystem = useBuilderSystem();

  const handleDemoAction = (action: string, data?: any) => {
    console.log('🚀 Builder System Demo Action:', { action, data });
    toast({
      title: `🚀 Builder System Action`,
      description: `Ação "${action}" executada com sucesso!`,
      variant: "default"
    });
  };

  const handleQuizGenerated = (result: any) => {
    toast({
      title: "✨ Quiz Demonstrado!",
      description: `Quiz gerado com ${result?.funnel?.steps?.length || 21} etapas`,
      variant: "default"
    });
  };

  const features = [
    {
      icon: <Brain className="h-5 w-5" />,
      title: "IA Integrada",
      description: "Criação automática de quizzes com inteligência artificial",
      status: "active",
      color: "text-blue-600"
    },
    {
      icon: <LayoutTemplate className="h-5 w-5" />,
      title: "Templates Predefinidos",
      description: "Biblioteca completa de templates otimizados",
      status: "active", 
      color: "text-green-600"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Otimização Automática",
      description: "Performance e conversão otimizadas automaticamente",
      status: "active",
      color: "text-yellow-600"
    },
    {
      icon: <Activity className="h-5 w-5" />,
      title: "Cache Inteligente",
      description: "Sistema de cache avançado para máxima performance",
      status: "active",
      color: "text-purple-600"
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Analytics em Tempo Real",
      description: "Monitoramento e métricas de performance",
      status: "active",
      color: "text-red-600"
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "Interface Unificada",
      description: "Todas as funcionalidades em uma interface limpa",
      status: "active",
      color: "text-indigo-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 🎯 HEADER */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Rocket className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Builder System
            </h1>
            <Badge className="bg-green-100 text-green-800 border-green-300">
              Fase 1 Ativa
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sistema completo de construção inteligente com IA, templates e otimizações automáticas
          </p>
        </div>

        {/* 🎯 STATUS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`${feature.color} bg-current/10 p-2 rounded-lg`}>
                    {feature.icon}
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ativo
                  </Badge>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 🚀 TOOLBAR DEMO */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Builder System Toolbar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BuilderSystemToolbar 
              onQuickAction={handleDemoAction}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* 🎨 MAIN DEMO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 🎯 BUILDER PANEL */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Builder System Panel - Demonstração
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BuilderSystemPanel 
                  onQuizGenerated={handleQuizGenerated}
                  className="border-0 shadow-none"
                />
              </CardContent>
            </Card>
          </div>

          {/* 📊 STATS SIDEBAR */}
          <div className="space-y-6">
            
            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Status do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Builder System</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {builderSystem.isReady ? 'Ativo' : 'Inicializando'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">IA Orchestrator</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {builderSystem.canUseAI ? 'Online' : 'Offline'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Templates Engine</span>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">
                    {builderSystem.canUseTemplates ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Templates Disponíveis</span>
                  <Badge variant="secondary">
                    {builderSystem.state.availablePresets.length}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => handleDemoAction('demo-ai-quiz')}
                >
                  <Brain className="mr-2 h-4 w-4" />
                  Demo IA Quiz
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => handleDemoAction('demo-templates')}
                >
                  <LayoutTemplate className="mr-2 h-4 w-4" />
                  Ver Templates
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => handleDemoAction('demo-performance')}
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Performance
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Achievement */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-primary mb-1">Fase 1 Completa!</h3>
                <p className="text-sm text-muted-foreground">
                  Builder System totalmente ativado e funcional
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 🎯 FOOTER INFO */}
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">🎊 Fase 1 - Builder System Ativação Completa</h3>
            <p className="text-muted-foreground mb-4">
              Todas as funcionalidades do Builder System estão ativas e prontas para uso. 
              O potencial inexplorado do seu projeto foi desbloqueado!
            </p>
            <div className="flex justify-center gap-4">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                ✅ IA Integrada
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                ✅ Templates Ativos
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                ✅ Cache Inteligente
              </Badge>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                ✅ Performance Otimizada
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BuilderSystemDemo;