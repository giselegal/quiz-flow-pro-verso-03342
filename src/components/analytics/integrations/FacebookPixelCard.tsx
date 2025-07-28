import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { EventTrackingCard } from './EventTrackingCard';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

interface FacebookPixelCardProps {
  initialId?: string;
  initialEnabled?: boolean;
  testFunction?: () => boolean;
}

export const FacebookPixelCard: React.FC<FacebookPixelCardProps> = ({
  initialId = '',
  initialEnabled = false,
  testFunction
}) => {
  const [fbPixelId, setFbPixelId] = useState(() => {
    try {
      return localStorage.getItem('fb_pixel_id') || initialId || '1311550759901086';
    } catch (e) {
      return initialId || '1311550759901086';
    }
  });
  
  const [fbPixelEnabled, setFbPixelEnabled] = useState(() => {
    try {
      const stored = localStorage.getItem('tracking_enabled');
      return stored !== null ? stored === 'true' : initialEnabled;
    } catch (e) {
      return initialEnabled;
    }
  });
  
  const [fbAccessToken, setFbAccessToken] = useState(() => {
    try {
      return localStorage.getItem('fb_access_token') || '';
    } catch (e) {
      return '';
    }
  });

  const [trackedEvents, setTrackedEvents] = useState(() => {
    try {
      const stored = localStorage.getItem('fb_tracked_events');
      return stored ? JSON.parse(stored) : {
        quiz_start: true,
        quiz_answer: true,
        quiz_complete: true,
        result_view: true,
        lead_generated: true,
        sale: true,
        button_click: false
      };
    } catch (e) {
      return {
        quiz_start: true,
        quiz_answer: true,
        quiz_complete: true,
        result_view: true,
        lead_generated: true,
        sale: true,
        button_click: false
      };
    }
  });
  
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  
  // Load settings from localStorage
  useEffect(() => {
    try {
      const storedId = localStorage.getItem('fb_pixel_id');
      const storedEnabled = localStorage.getItem('tracking_enabled');
      const storedToken = localStorage.getItem('fb_access_token');
      const storedEvents = localStorage.getItem('fb_tracked_events');
      
      if (storedId) setFbPixelId(storedId);
      if (storedEnabled !== null) setFbPixelEnabled(storedEnabled === 'true');
      if (storedToken) setFbAccessToken(storedToken);
      if (storedEvents) setTrackedEvents(JSON.parse(storedEvents));
    } catch (error) {
      console.error('Error loading Facebook Pixel settings:', error);
    }
  }, []);

  const handleSaveFacebookPixel = () => {
    try {
      localStorage.setItem('fb_pixel_id', fbPixelId);
      localStorage.setItem('tracking_enabled', String(fbPixelEnabled));
      localStorage.setItem('fb_access_token', fbAccessToken);
      localStorage.setItem('fb_tracked_events', JSON.stringify(trackedEvents));
      
      toast({
        title: "Configurações do Facebook Pixel salvas",
        description: "Suas configurações de integração do Facebook Pixel foram atualizadas. Atualize a página para que as mudanças tenham efeito.",
        duration: 5000
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar configurações",
        description: "Ocorreu um erro ao salvar suas configurações. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleTestConnection = () => {
    toast({
      title: "Testando conexão com Facebook Pixel",
      description: "Teste de conexão iniciado. Verifique o console do navegador para os resultados."
    });
    
    const result = testFunction ? testFunction() : false;
    
    setTimeout(() => {
      toast({
        title: result ? "Teste bem-sucedido" : "Teste falhou",
        description: result 
          ? "Evento de teste do Facebook Pixel enviado com sucesso." 
          : "Teste do Facebook Pixel falhou. Verifique suas configurações e o console do navegador.",
        variant: result ? "default" : "destructive"
      });
    }, 1500);
  };

  const handleEventToggle = (eventName: string) => {
    setTrackedEvents(prev => ({
      ...prev,
      [eventName]: !prev[eventName]
    }));
  };

  const eventLabels: Record<string, string> = {
    quiz_start: "Início do Quiz (QuizStart)",
    quiz_answer: "Respostas do Quiz (QuizAnswer)",
    quiz_complete: "Conclusão do Quiz (QuizComplete)",
    result_view: "Visualização de Resultado (ResultView)",
    lead_generated: "Captura de Lead (Lead)",
    sale: "Vendas (Purchase)",
    button_click: "Cliques em Botões (ButtonClick)"
  };

  const eventDescriptions: Record<string, string> = {
    quiz_start: "Disparado quando o usuário inicia o quiz",
    quiz_answer: "Disparado quando o usuário responde a uma pergunta",
    quiz_complete: "Disparado quando o usuário completa todas as perguntas",
    result_view: "Disparado quando o usuário visualiza seu resultado",
    lead_generated: "Disparado quando o usuário fornece o email",
    sale: "Disparado quando uma venda é concluída",
    button_click: "Disparado quando o usuário clica em botões importantes"
  };
  
  return (
    <div className="space-y-4">
      <Card className="border-border/40 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Facebook Pixel</CardTitle>
              <CardDescription className="text-xs mt-0.5">Conecte-se à plataforma Facebook Ads para rastrear conversões</CardDescription>
            </div>
            <Badge variant={fbPixelEnabled ? "default" : "outline"} className="text-xs">
              {fbPixelEnabled ? "Ativo" : "Inativo"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 py-0">
          <div className="space-y-1.5">
            <Label htmlFor="fb-pixel-id" className="text-sm">ID do Facebook Pixel</Label>
            <Input 
              id="fb-pixel-id" 
              placeholder="123456789012345" 
              value={fbPixelId}
              onChange={(e) => setFbPixelId(e.target.value)}
              className="h-8 text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Encontrado no Facebook Events Manager {'>'} Data Sources {'>'} Pixel
            </p>
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="fb-access-token" className="text-sm">Token de Acesso (opcional)</Label>
            <Input 
              id="fb-access-token" 
              type="password"
              placeholder="EAAEJYWeJHLABO..." 
              value={fbAccessToken}
              onChange={(e) => setFbAccessToken(e.target.value)}
              className="h-8 text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Necessário para rastreamento avançado de conversões
            </p>
          </div>
          
          <div className="flex items-center space-x-2 pt-1">
            <Switch 
              id="fb-tracking"
              checked={fbPixelEnabled}
              onCheckedChange={setFbPixelEnabled}
              className="data-[state=checked]:bg-blue-600"
            />
            <Label htmlFor="fb-tracking" className="text-sm">Habilitar rastreamento do Facebook Pixel</Label>
          </div>

          <Collapsible open={isEventsOpen} onOpenChange={setIsEventsOpen} className="mt-2 border rounded-md p-2">
            <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-medium">
              <span>Configurar eventos rastreados</span>
              {isEventsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-3">
              <div className="text-xs text-muted-foreground mb-2">
                Selecione quais eventos serão enviados para o Facebook Pixel:
              </div>
              <div className="bg-muted/30 p-2 rounded-md">
                <div className="flex items-center space-x-2 mb-1">
                  <Switch 
                    id={`event-quiz_start`}
                    checked={trackedEvents.quiz_start || false}
                    onCheckedChange={() => handleEventToggle('quiz_start')}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <Label htmlFor={`event-quiz_start`} className="text-xs font-medium">Início do Quiz (QuizStart)</Label>
                  <Info className="h-3 w-3 text-muted-foreground cursor-help" aria-label={eventDescriptions.quiz_start} />
                </div>
                <p className="text-[10px] text-muted-foreground pl-6">
                  Ocorre quando o usuário clica em "Começar" na tela inicial
                </p>
              </div>
              
              <div className="bg-muted/30 p-2 rounded-md">
                <div className="flex items-center space-x-2 mb-1">
                  <Switch 
                    id={`event-quiz_answer`}
                    checked={trackedEvents.quiz_answer || false}
                    onCheckedChange={() => handleEventToggle('quiz_answer')}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <Label htmlFor={`event-quiz_answer`} className="text-xs font-medium">Respostas do Quiz (QuizAnswer)</Label>
                  <Info className="h-3 w-3 text-muted-foreground cursor-help" aria-label={eventDescriptions.quiz_answer} />
                </div>
                <p className="text-[10px] text-muted-foreground pl-6">
                  Ocorre a cada resposta do usuário em uma questão
                </p>
              </div>
              
              <div className="bg-muted/30 p-2 rounded-md">
                <div className="flex items-center space-x-2 mb-1">
                  <Switch 
                    id={`event-quiz_complete`}
                    checked={trackedEvents.quiz_complete || false}
                    onCheckedChange={() => handleEventToggle('quiz_complete')}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <Label htmlFor={`event-quiz_complete`} className="text-xs font-medium">Conclusão do Quiz (QuizComplete)</Label>
                  <Info className="h-3 w-3 text-muted-foreground cursor-help" aria-label={eventDescriptions.quiz_complete} />
                </div>
                <p className="text-[10px] text-muted-foreground pl-6">
                  Ocorre quando o usuário termina todas as perguntas do quiz
                </p>
              </div>
              
              <div className="bg-muted/30 p-2 rounded-md">
                <div className="flex items-center space-x-2 mb-1">
                  <Switch 
                    id={`event-result_view`}
                    checked={trackedEvents.result_view || false}
                    onCheckedChange={() => handleEventToggle('result_view')}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <Label htmlFor={`event-result_view`} className="text-xs font-medium">Visualização de Resultado (ResultView)</Label>
                  <Info className="h-3 w-3 text-muted-foreground cursor-help" aria-label={eventDescriptions.result_view} />
                </div>
                <p className="text-[10px] text-muted-foreground pl-6">
                  Ocorre quando o usuário visualiza a página de resultado
                </p>
              </div>
              
              <div className="bg-muted/30 p-2 rounded-md">
                <div className="flex items-center space-x-2 mb-1">
                  <Switch 
                    id={`event-lead_generated`}
                    checked={trackedEvents.lead_generated || false}
                    onCheckedChange={() => handleEventToggle('lead_generated')}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <Label htmlFor={`event-lead_generated`} className="text-xs font-medium">Captura de Lead (Lead)</Label>
                  <Info className="h-3 w-3 text-muted-foreground cursor-help" aria-label={eventDescriptions.lead_generated} />
                </div>
                <p className="text-[10px] text-muted-foreground pl-6">
                  Ocorre quando o usuário fornece seu endereço de email
                </p>
              </div>
              
              <div className="bg-muted/30 p-2 rounded-md">
                <div className="flex items-center space-x-2 mb-1">
                  <Switch 
                    id={`event-sale`}
                    checked={trackedEvents.sale || false}
                    onCheckedChange={() => handleEventToggle('sale')}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <Label htmlFor={`event-sale`} className="text-xs font-medium">Vendas (Purchase)</Label>
                  <Info className="h-3 w-3 text-muted-foreground cursor-help" aria-label={eventDescriptions.sale} />
                </div>
                <p className="text-[10px] text-muted-foreground pl-6">
                  Ocorre quando uma venda é concluída com sucesso
                </p>
              </div>
              
              <div className="bg-muted/30 p-2 rounded-md">
                <div className="flex items-center space-x-2 mb-1">
                  <Switch 
                    id={`event-button_click`}
                    checked={trackedEvents.button_click || false}
                    onCheckedChange={() => handleEventToggle('button_click')}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <Label htmlFor={`event-button_click`} className="text-xs font-medium">Cliques em Botões (ButtonClick)</Label>
                  <Info className="h-3 w-3 text-muted-foreground cursor-help" aria-label={eventDescriptions.button_click} />
                </div>
                <p className="text-[10px] text-muted-foreground pl-6">
                  Ocorre quando o usuário clica em botões importantes (ex: checkout)
                </p>
              </div>
              
              <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Info className="h-3.5 w-3.5" />
                <span>Acesse "Log de Eventos" para visualizar todos os eventos enviados</span>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <Button variant="outline" size="sm" onClick={handleTestConnection} className="text-xs h-7">
            Testar Conexão
          </Button>
          <Button size="sm" onClick={handleSaveFacebookPixel} className="text-xs h-7">
            Salvar Configurações
          </Button>
        </CardFooter>
      </Card>
      
      <EventTrackingCard />
    </div>
  );
};

export default FacebookPixelCard;
