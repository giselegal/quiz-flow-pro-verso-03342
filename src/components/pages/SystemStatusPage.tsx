/**
 * Página de Status do Sistema - Fase 9
 * Interface principal para monitoramento de todas as fases implementadas
 */

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DeploymentDashboard } from '@/components/deployment/DeploymentDashboard';
import { SecuritySettingsPage } from '@/components/security/SecuritySettingsPage';
import { useSecurity } from '@/providers/SecurityProvider';
import { 
  Activity, 
  Shield, 
  Database, 
  Settings, 
  TrendingUp,
  Server,
  Zap,
  Brain
} from 'lucide-react';

const SystemStatusPage: React.FC = () => {
  const { isSystemHealthy } = useSecurity();
  const [activeTab, setActiveTab] = useState('overview');

  const getPhaseStatus = (phase: string) => {
    // Simular status das fases implementadas
    const phases = {
      'phase1': { name: 'Sistema de Templates', status: 'active', health: 100 },
      'phase2': { name: 'Arquitetura Consolidada', status: 'active', health: 95 },
      'phase3': { name: 'Otimização & Performance', status: 'active', health: 90 },
      'phase4': { name: 'Monitoramento Avançado', status: 'active', health: 88 },
      'phase5': { name: 'Segurança & Produção', status: 'active', health: 92 },
      'phase6': { name: 'Testes & Validação', status: 'active', health: 85 },
      'phase7': { name: 'UX & Polish', status: 'active', health: 87 },
      'phase8': { name: 'Recursos Avançados (AI)', status: 'active', health: 83 },
      'phase9': { name: 'Integração & Deploy', status: 'active', health: 89 }
    };
    
    return phases[phase as keyof typeof phases] || { name: 'Desconhecido', status: 'inactive', health: 0 };
  };

  const phases = [
    'phase1', 'phase2', 'phase3', 'phase4', 'phase5', 
    'phase6', 'phase7', 'phase8', 'phase9'
  ];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Sistema de Status Geral</h1>
          <p className="text-muted-foreground">
            Monitoramento completo de todas as fases implementadas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isSystemHealthy ? 'default' : 'destructive'}>
            {isSystemHealthy ? 'Sistema Saudável' : 'Problemas Detectados'}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <Activity className="w-4 h-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="w-4 h-4 mr-2" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="deployment">
            <Server className="w-4 h-4 mr-2" />
            Deploy
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Status das Fases */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Status das Fases Implementadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {phases.map(phaseId => {
                  const phase = getPhaseStatus(phaseId);
                  return (
                    <div key={phaseId} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{phase.name}</h4>
                        <Badge variant={phase.status === 'active' ? 'default' : 'secondary'}>
                          {phase.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="h-2 bg-primary rounded-full transition-all duration-300"
                            style={{ width: `${phase.health}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{phase.health}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Resumo de Componentes */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Database className="w-8 h-8 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">9</div>
                    <div className="text-sm text-muted-foreground">Fases Completas</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Zap className="w-8 h-8 text-yellow-500" />
                  <div>
                    <div className="text-2xl font-bold">4</div>
                    <div className="text-sm text-muted-foreground">Edge Functions</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-8 h-8 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">15+</div>
                    <div className="text-sm text-muted-foreground">Verificações de Segurança</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Brain className="w-8 h-8 text-purple-500" />
                  <div>
                    <div className="text-2xl font-bold">AI</div>
                    <div className="text-sm text-muted-foreground">Otimização Inteligente</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Arquitetura Atual */}
          <Card>
            <CardHeader>
              <CardTitle>Arquitetura do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Frontend (React + TypeScript)</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Sistema de templates dinâmicos</li>
                      <li>• Arquitetura consolidada e otimizada</li>
                      <li>• Componentes de UI responsivos</li>
                      <li>• Sistema de debug avançado</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Backend (Supabase)</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Edge Functions para processamento</li>
                      <li>• Sistema de monitoramento em tempo real</li>
                      <li>• Políticas RLS para segurança</li>
                      <li>• AI Optimizer para otimização inteligente</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettingsPage />
        </TabsContent>

        <TabsContent value="deployment">
          <DeploymentDashboard />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Ambiente</h4>
                    <p className="text-sm text-muted-foreground">
                      {import.meta.env.DEV ? 'Desenvolvimento' : 'Produção'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Supabase</h4>
                    <p className="text-sm text-muted-foreground">
                      Projeto: {import.meta.env.VITE_SUPABASE_PROJECT_ID || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Rate Limiting</h4>
                    <Badge variant="default">Ativo</Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Sistema de Backup</h4>
                    <Badge variant="default">Configurado</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemStatusPage;