import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

interface EventTrackingCardProps {
  initialEnabled?: boolean;
}

export const EventTrackingCard: React.FC<EventTrackingCardProps> = ({ initialEnabled = false }) => {
  const [trackingEnabled, setTrackingEnabled] = useState(() => {
    try {
      const stored = localStorage.getItem('event_tracking_enabled');
      return stored !== null ? stored === 'true' : initialEnabled;
    } catch (e) {
      return initialEnabled;
    }
  });

  const [trackButtons, setTrackButtons] = useState(() => {
    try {
      const stored = localStorage.getItem('track_buttons');
      return stored !== null ? stored === 'true' : true;
    } catch (e) {
      return true;
    }
  });

  const [trackLinks, setTrackLinks] = useState(() => {
    try {
      const stored = localStorage.getItem('track_links');
      return stored !== null ? stored === 'true' : true;
    } catch (e) {
      return true;
    }
  });

  const [trackImages, setTrackImages] = useState(() => {
    try {
      const stored = localStorage.getItem('track_images');
      return stored !== null ? stored === 'true' : false;
    } catch (e) {
      return false;
    }
  });

  // Load settings from localStorage
  useEffect(() => {
    try {
      const storedTrackingEnabled = localStorage.getItem('event_tracking_enabled');
      const storedTrackButtons = localStorage.getItem('track_buttons');
      const storedTrackLinks = localStorage.getItem('track_links');
      const storedTrackImages = localStorage.getItem('track_images');

      if (storedTrackingEnabled !== null) setTrackingEnabled(storedTrackingEnabled === 'true');
      if (storedTrackButtons !== null) setTrackButtons(storedTrackButtons === 'true');
      if (storedTrackLinks !== null) setTrackLinks(storedTrackLinks === 'true');
      if (storedTrackImages !== null) setTrackImages(storedTrackImages === 'true');
    } catch (error) {
      console.error('Error loading event tracking settings:', error);
    }
  }, []);

  const handleSaveSettings = () => {
    try {
      localStorage.setItem('event_tracking_enabled', String(trackingEnabled));
      localStorage.setItem('track_buttons', String(trackButtons));
      localStorage.setItem('track_links', String(trackLinks));
      localStorage.setItem('track_images', String(trackImages));

      toast({
        title: 'Configurações de rastreamento salvas',
        description: 'Suas configurações de rastreamento de eventos foram atualizadas.',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Erro ao salvar configurações',
        description: 'Ocorreu um erro ao salvar suas configurações.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="border-border/40 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Rastreamento de Eventos</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Configure os tipos de eventos que serão rastreados
            </CardDescription>
          </div>
          <Badge variant={trackingEnabled ? 'default' : 'outline'} className="text-xs">
            {trackingEnabled ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 py-0">
        <div className="flex items-center space-x-2 pt-1">
          <Switch
            id="event-tracking"
            checked={trackingEnabled}
            onCheckedChange={setTrackingEnabled}
            className="data-[state=checked]:bg-[#B89B7A]"
          />
          <Label htmlFor="event-tracking" className="text-sm">
            Habilitar rastreamento de eventos
          </Label>
        </div>

        <div className="pl-6 space-y-2 pt-1">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="track-buttons"
              checked={trackButtons}
              onCheckedChange={checked => setTrackButtons(!!checked)}
              disabled={!trackingEnabled}
            />
            <Label
              htmlFor="track-buttons"
              className={`text-sm ${!trackingEnabled ? 'text-muted-foreground' : ''}`}
            >
              Rastrear cliques em botões
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="track-links"
              checked={trackLinks}
              onCheckedChange={checked => setTrackLinks(!!checked)}
              disabled={!trackingEnabled}
            />
            <Label
              htmlFor="track-links"
              className={`text-sm ${!trackingEnabled ? 'text-muted-foreground' : ''}`}
            >
              Rastrear cliques em links
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="track-images"
              checked={trackImages}
              onCheckedChange={checked => setTrackImages(!!checked)}
              disabled={!trackingEnabled}
            />
            <Label
              htmlFor="track-images"
              className={`text-sm ${!trackingEnabled ? 'text-muted-foreground' : ''}`}
            >
              Rastrear cliques em imagens
            </Label>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-2 pb-3">
        <Button size="sm" onClick={handleSaveSettings} className="text-xs h-7">
          Salvar Configurações
        </Button>
      </CardFooter>
    </Card>
  );
};
