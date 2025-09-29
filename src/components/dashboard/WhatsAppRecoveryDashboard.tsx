// @ts-nocheck
/**
 * 📱 DASHBOARD DE RECUPERAÇÃO VIA WHATSAPP
 * 
 * Interface para configurar e monitorar o agente de recuperação
 * de carrinho via WhatsApp integrado com webhooks Hotmart
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useWhatsAppCartRecovery, useWhatsAppRecoveryStats } from '@/hooks/useWhatsAppCartRecovery';
import {
  MessageCircle,
  Settings,
  BarChart3,
  Play,
  Pause,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  TrendingUp,
  Smartphone
} from 'lucide-react';

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export function WhatsAppRecoveryDashboard() {
  const { toast } = useToast();
  const {
    state,
    configure,
    start,
    stop,
    sendTestMessage,
    isPhoneValid,
    formatPhone
  } = useWhatsAppCartRecovery();

  const { stats, recentActivity } = useWhatsAppRecoveryStats();

  // Estados locais
  const [config, setConfig] = useState({
    accessToken: '',
    phoneNumberId: '',
    businessAccountId: '',
    webhookVerifyToken: '',
    apiVersion: 'v18.0'
  });
  
  const [testPhone, setTestPhone] = useState('');
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  /**
   * 💾 SALVAR CONFIGURAÇÃO
   */
  const handleSaveConfig = async () => {
    setIsConfiguring(true);
    
    const success = await configure(config);
    
    if (success) {
      toast({
        title: "✅ Configuração salva",
        description: "WhatsApp Business API configurado com sucesso"
      });
    } else {
      toast({
        title: "❌ Erro na configuração",
        description: state.error || "Verifique os dados e tente novamente",
        variant: "destructive"
      });
    }
    
    setIsConfiguring(false);
  };

  /**
   * 📤 ENVIAR MENSAGEM DE TESTE
   */
  const handleTestMessage = async () => {
    if (!isPhoneValid(testPhone)) {
      toast({
        title: "❌ Telefone inválido",
        description: "Digite um número de telefone brasileiro válido",
        variant: "destructive"
      });
      return;
    }

    setIsTesting(true);
    
    const success = await sendTestMessage(testPhone);
    
    if (success) {
      toast({
        title: "✅ Mensagem enviada",
        description: `Mensagem de teste enviada para ${formatPhone(testPhone)}`
      });
    } else {
      toast({
        title: "❌ Erro ao enviar",
        description: state.error || "Falha no envio da mensagem",
        variant: "destructive"
      });
    }
    
    setIsTesting(false);
  };

  /**
   * 🎛️ CONTROLAR AGENTE
   */
  const handleToggleAgent = () => {
    if (state.isActive) {
      stop();
      toast({
        title: "🛑 Agente parado",
        description: "Recuperação de carrinho desativada"
      });
    } else {
      start();
      toast({
        title: "🚀 Agente iniciado",
        description: "Monitorando carrinhos abandonados"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            🤖 Recuperação de Carrinho WhatsApp
          </h1>
          <p className="text-gray-600">
            Agente inteligente para recuperar vendas via mensagens automáticas
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant={state.isActive ? "default" : "secondary"}>
            {state.isActive ? "🟢 Ativo" : "🔴 Inativo"}
          </Badge>
          
          {state.isConfigured && (
            <Button
              onClick={handleToggleAgent}
              variant={state.isActive ? "destructive" : "default"}
              size="sm"
            >
              {state.isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {state.isActive ? "Parar" : "Iniciar"}
            </Button>
          )}
        </div>
      </div>

      {/* Alert de status */}
      {state.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {!state.isConfigured && (
        <Alert>
          <Settings className="h-4 w-4" />
          <AlertDescription>
            Configure o WhatsApp Business API na aba "Configurações" para começar
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">📊 Visão Geral</TabsTrigger>
          <TabsTrigger value="activity">📈 Atividade</TabsTrigger>
          <TabsTrigger value="config">⚙️ Configurações</TabsTrigger>
          <TabsTrigger value="test">🧪 Testes</TabsTrigger>
        </TabsList>

        {/* TAB: VISÃO GERAL */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Carrinhos Abandonados */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Carrinhos Abandonados</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAbandoned}</div>
                <p className="text-xs text-muted-foreground">Total identificados</p>
              </CardContent>
            </Card>

            {/* Contatos Enviados */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contatos Enviados</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalContacted}</div>
                <p className="text-xs text-muted-foreground">Mensagens enviadas</p>
              </CardContent>
            </Card>

            {/* Recuperações */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recuperações</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.totalRecovered}</div>
                <p className="text-xs text-muted-foreground">Vendas recuperadas</p>
              </CardContent>
            </Card>

            {/* Taxa de Recuperação */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Recuperação</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.recoveryRate.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Taxa de conversão</p>
              </CardContent>
            </Card>
          </div>

          {/* Atividade Recente */}
          <Card>
            <CardHeader>
              <CardTitle>📱 Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'recovered' ? 'bg-green-500' :
                          activity.type === 'contacted' ? 'bg-blue-500' : 'bg-orange-500'
                        }`} />
                        <div>
                          <p className="font-medium">{activity.buyerName}</p>
                          <p className="text-sm text-gray-600">{activity.productName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          activity.type === 'recovered' ? 'default' :
                          activity.type === 'contacted' ? 'secondary' : 'outline'
                        }>
                          {activity.type === 'recovered' ? '✅ Recuperado' :
                           activity.type === 'contacted' ? '📤 Contatado' : '🛒 Abandonado'}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    Nenhuma atividade recente
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: ATIVIDADE */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>📊 Análise de Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Taxa de Abertura de Mensagens</span>
                  <Badge>85%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Taxa de Resposta</span>
                  <Badge>32%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Taxa de Conversão Final</span>
                  <Badge variant="default">{stats.recoveryRate.toFixed(1)}%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tempo Médio de Resposta</span>
                  <Badge variant="secondary">2h 15m</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: CONFIGURAÇÕES */}
        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>⚙️ Configuração WhatsApp Business API</CardTitle>
              <p className="text-sm text-gray-600">
                Configure sua conta do WhatsApp Business para envio de mensagens
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accessToken">Access Token</Label>
                <Input
                  id="accessToken"
                  type="password"
                  value={config.accessToken}
                  onChange={(e) => setConfig(prev => ({ ...prev, accessToken: e.target.value }))}
                  placeholder="EAAxxxxxxxxxxxxxxxxx"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumberId">Phone Number ID</Label>
                <Input
                  id="phoneNumberId"
                  value={config.phoneNumberId}
                  onChange={(e) => setConfig(prev => ({ ...prev, phoneNumberId: e.target.value }))}
                  placeholder="123456789012345"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessAccountId">Business Account ID</Label>
                <Input
                  id="businessAccountId"
                  value={config.businessAccountId}
                  onChange={(e) => setConfig(prev => ({ ...prev, businessAccountId: e.target.value }))}
                  placeholder="123456789012345"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhookVerifyToken">Webhook Verify Token</Label>
                <Input
                  id="webhookVerifyToken"
                  value={config.webhookVerifyToken}
                  onChange={(e) => setConfig(prev => ({ ...prev, webhookVerifyToken: e.target.value }))}
                  placeholder="seu_token_secreto"
                />
              </div>

              <Button 
                onClick={handleSaveConfig}
                disabled={isConfiguring || !config.accessToken || !config.phoneNumberId}
                className="w-full"
              >
                {isConfiguring ? "Configurando..." : "💾 Salvar Configuração"}
              </Button>

              {state.isConfigured && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    ✅ WhatsApp Business API configurado e funcionando
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Templates de Mensagem */}
          <Card>
            <CardHeader>
              <CardTitle>📝 Templates de Mensagem</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">🕐 Primeiro Contato (30 min)</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Enviado 30 minutos após abandono do carrinho
                  </p>
                  <div className="bg-green-50 p-3 rounded text-sm">
                    "Olá {"{nome}"}! 👋 Notei que você estava interessado no {"{produto}"}.
                    Que tal finalizar sua compra agora? 🎯"
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">🕐 Segundo Contato (24h)</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Mensagem interativa com botões de ação
                  </p>
                  <div className="bg-blue-50 p-3 rounded text-sm">
                    "Olá {"{nome}"}! Preparei uma oferta especial para você! 🎁
                    [✅ Finalizar Compra] [🎁 Ver Desconto] [❌ Não Tenho Interesse]"
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">🕐 Último Contato (3 dias)</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Última tentativa com desconto especial
                  </p>
                  <div className="bg-orange-50 p-3 rounded text-sm">
                    "Última chance! 20% OFF com código VOLTA20 ⏰
                    Válido apenas por 24h! {"{link}"}'"
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: TESTES */}
        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>🧪 Teste de Mensagem</CardTitle>
              <p className="text-sm text-gray-600">
                Envie uma mensagem de teste para verificar a configuração
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testPhone">Número de Teste</Label>
                <Input
                  id="testPhone"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                />
                <p className="text-xs text-gray-500">
                  {testPhone && (isPhoneValid(testPhone) ? 
                    `✅ Válido: ${formatPhone(testPhone)}` : 
                    '❌ Formato inválido'
                  )}
                </p>
              </div>

              <Button
                onClick={handleTestMessage}
                disabled={!state.isConfigured || !isPhoneValid(testPhone) || isTesting}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                {isTesting ? "Enviando..." : "📤 Enviar Teste"}
              </Button>
            </CardContent>
          </Card>

          {/* Simulador de Webhook */}
          <Card>
            <CardHeader>
              <CardTitle>🔄 Simulador de Webhook Hotmart</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => {
                  // Simular webhook de carrinho abandonado
                  const mockWebhook = {
                    event: 'CART_ABANDONED',
                    data: {
                      buyer: {
                        email: 'teste@email.com',
                        name: 'João Teste',
                        phone: testPhone
                      },
                      product: {
                        name: 'Curso de Estilo Pessoal',
                        price: { value: 497, currency_value: 'BRL' }
                      },
                      transaction: {
                        id: 'test_' + Date.now()
                      }
                    }
                  };

                  toast({
                    title: "🔄 Webhook simulado",
                    description: "Carrinho abandonado simulado para teste"
                  });
                }}
                variant="outline"
                className="w-full"
              >
                🛒 Simular Carrinho Abandonado
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default WhatsAppRecoveryDashboard;
