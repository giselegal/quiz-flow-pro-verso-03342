/**
 * 🎁 COMPONENTE: Offer Map (Mapa de Ofertas)
 * 
 * Componente especial para step-21 (offer) que gerencia as 4 variações
 * de oferta personalizada baseadas na resposta da pergunta estratégica 18.
 * 
 * Estrutura:
 * - 4 chaves fixas mapeadas das respostas da pergunta 18
 * - Cada oferta contém: title, description, buttonText, testimonial
 * - Suporta variável {userName} nos textos
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Gift, 
  Sparkles, 
  Heart, 
  Star, 
  Check, 
  AlertCircle,
  User,
  MessageSquare
} from 'lucide-react';

// Tipos
export interface OfferVariation {
  title: string;
  description: string;
  buttonText: string;
  testimonial: {
    quote: string;
    author: string;
  };
}

export interface OfferMapContent {
  offerMap: Record<string, OfferVariation>;
}

export interface OfferMapProps {
  content: OfferMapContent;
  onUpdate?: (content: OfferMapContent) => void;
  mode?: 'editor' | 'preview';
  userName?: string; // Para substituir {userName} no preview
}

// 4 Chaves fixas mapeadas da pergunta 18
export const OFFER_KEYS = [
  'Montar looks com mais facilidade e confiança',
  'Usar o que já tenho e me sentir estilosa',
  'Comprar com mais consciência e sem culpa',
  'Ser admirada pela imagem que transmito'
] as const;

export type OfferKey = typeof OFFER_KEYS[number];

// Ícones por tipo de oferta
const OFFER_ICONS = {
  'Montar looks com mais facilidade e confiança': Sparkles,
  'Usar o que já tenho e me sentir estilosa': Heart,
  'Comprar com mais consciência e sem culpa': Check,
  'Ser admirada pela imagem que transmito': Star,
};

// Cores por tipo de oferta
const OFFER_COLORS = {
  'Montar looks com mais facilidade e confiança': 'bg-blue-50 border-blue-200',
  'Usar o que já tenho e me sentir estilosa': 'bg-pink-50 border-pink-200',
  'Comprar com mais consciência e sem culpa': 'bg-green-50 border-green-200',
  'Ser admirada pela imagem que transmito': 'bg-purple-50 border-purple-200',
};

/**
 * Componente Offer Map
 */
export function OfferMap({ content, onUpdate, mode = 'preview', userName = 'Maria' }: OfferMapProps) {
  const [selectedOfferKey, setSelectedOfferKey] = useState<OfferKey>(OFFER_KEYS[0]);
  const [isDirty, setIsDirty] = useState(false);

  // Substituir {userName} nos textos
  const replaceUserName = (text: string): string => {
    return text.replace(/{userName}/g, userName);
  };

  // Validar se todas as 4 ofertas existem
  const validateOfferMap = (): boolean => {
    return OFFER_KEYS.every(key => content.offerMap && content.offerMap[key]);
  };

  const isValid = validateOfferMap();

  // Handler para atualizar oferta específica
  const updateOffer = (key: OfferKey, field: keyof OfferVariation | 'testimonial.quote' | 'testimonial.author', value: string) => {
    if (!onUpdate) return;

    const newOfferMap = { ...content.offerMap };

    if (field === 'testimonial.quote') {
      newOfferMap[key] = {
        ...newOfferMap[key],
        testimonial: {
          ...newOfferMap[key].testimonial,
          quote: value
        }
      };
    } else if (field === 'testimonial.author') {
      newOfferMap[key] = {
        ...newOfferMap[key],
        testimonial: {
          ...newOfferMap[key].testimonial,
          author: value
        }
      };
    } else {
      newOfferMap[key] = {
        ...newOfferMap[key],
        [field]: value
      };
    }

    onUpdate({ offerMap: newOfferMap });
    setIsDirty(true);
  };

  // Modo Preview: Renderizar oferta selecionada (simulação)
  if (mode === 'preview') {
    const offer = content.offerMap[selectedOfferKey];

    if (!offer) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Oferta não configurada: {selectedOfferKey}
          </AlertDescription>
        </Alert>
      );
    }

    const Icon = OFFER_ICONS[selectedOfferKey];
    const colorClass = OFFER_COLORS[selectedOfferKey];

    return (
      <div className="space-y-6">
        {/* Seletor de Oferta (apenas para preview no editor) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Preview de Oferta Personalizada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {OFFER_KEYS.map((key) => {
                const OfferIcon = OFFER_ICONS[key];
                return (
                  <Button
                    key={key}
                    variant={selectedOfferKey === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedOfferKey(key)}
                    className="justify-start h-auto py-3"
                  >
                    <OfferIcon className="h-4 w-4 mr-2" />
                    <span className="text-xs text-left">{key}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Renderização da Oferta */}
        <Card className={`border-2 ${colorClass}`}>
          <CardContent className="pt-6 space-y-6">
            {/* Título */}
            <div className="text-center">
              <Icon className="h-12 w-12 mx-auto mb-4 text-[#B89B7A]" />
              <h2 
                className="text-2xl font-bold text-[#5b4135]"
                dangerouslySetInnerHTML={{ __html: replaceUserName(offer.title) }}
              />
            </div>

            {/* Descrição */}
            <p className="text-center text-gray-700 text-lg">
              {replaceUserName(offer.description)}
            </p>

            {/* Botão CTA */}
            <Button 
              className="w-full bg-[#B89B7A] hover:bg-[#a08464] text-white text-lg py-6"
              size="lg"
            >
              {offer.buttonText}
            </Button>

            {/* Depoimento */}
            {offer.testimonial && (
              <Card className="bg-white/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-[#B89B7A] flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm italic text-gray-700 mb-2">
                        "{offer.testimonial.quote}"
                      </p>
                      <p className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {offer.testimonial.author}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Badge de Preview */}
        <div className="text-center">
          <Badge variant="secondary" className="text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            Preview - Oferta exibida conforme resposta da pergunta 18
          </Badge>
        </div>
      </div>
    );
  }

  // Modo Editor: Tabs para editar cada oferta
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-[#B89B7A]" />
            Mapa de Ofertas Personalizadas
          </CardTitle>
          {isDirty && (
            <Badge variant="outline" className="text-xs">
              <AlertCircle className="h-3 w-3 mr-1" />
              Não salvo
            </Badge>
          )}
        </div>
        
        {!isValid && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              ERRO: Todas as 4 ofertas devem estar configuradas
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>

      <CardContent>
        <Tabs value={selectedOfferKey} onValueChange={(v) => setSelectedOfferKey(v as OfferKey)}>
          <TabsList className="grid w-full grid-cols-2 gap-2 h-auto p-2">
            {OFFER_KEYS.map((key, index) => {
              const Icon = OFFER_ICONS[key];
              const hasContent = content.offerMap && content.offerMap[key];
              
              return (
                <TabsTrigger 
                  key={key} 
                  value={key}
                  className="flex items-start gap-2 h-auto py-3 px-3 data-[state=active]:bg-[#B89B7A] data-[state=active]:text-white"
                >
                  <Icon className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <div className="text-xs font-semibold">Oferta {index + 1}</div>
                    <div className="text-[10px] opacity-80 line-clamp-2">{key}</div>
                    {!hasContent && (
                      <Badge variant="destructive" className="text-[8px] mt-1 py-0 px-1">
                        Não configurada
                      </Badge>
                    )}
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {OFFER_KEYS.map((key) => {
            const offer = content.offerMap?.[key] || {
              title: '',
              description: '',
              buttonText: '',
              testimonial: { quote: '', author: '' }
            };

            return (
              <TabsContent key={key} value={key} className="space-y-4 mt-4">
                {/* Título */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Título da Oferta
                    <span className="text-xs text-gray-500 ml-2">
                      (Use <code>{'{userName}'}</code> para personalizar)
                    </span>
                  </label>
                  <Textarea
                    value={offer.title}
                    onChange={(e) => updateOffer(key, 'title', e.target.value)}
                    placeholder="Ex: {userName}, encontramos a solução para..."
                    rows={2}
                    className="font-semibold"
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Descrição
                  </label>
                  <Textarea
                    value={offer.description}
                    onChange={(e) => updateOffer(key, 'description', e.target.value)}
                    placeholder="Descreva os benefícios desta oferta..."
                    rows={3}
                  />
                </div>

                {/* Botão CTA */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Texto do Botão
                  </label>
                  <Input
                    value={offer.buttonText}
                    onChange={(e) => updateOffer(key, 'buttonText', e.target.value)}
                    placeholder="Ex: Quero aprender agora!"
                  />
                </div>

                {/* Depoimento */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="h-4 w-4 text-[#B89B7A]" />
                    <h4 className="text-sm font-semibold">Depoimento</h4>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium mb-1 block">
                        Citação
                      </label>
                      <Textarea
                        value={offer.testimonial.quote}
                        onChange={(e) => updateOffer(key, 'testimonial.quote', e.target.value)}
                        placeholder='"Esse conteúdo mudou minha vida..."'
                        rows={2}
                        className="text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium mb-1 block">
                        Autor
                      </label>
                      <Input
                        value={offer.testimonial.author}
                        onChange={(e) => updateOffer(key, 'testimonial.author', e.target.value)}
                        placeholder="Ex: Ana G., 29 anos, Designer"
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview rápido */}
                <div className="border rounded-lg p-3 bg-blue-50">
                  <div className="text-xs font-semibold text-blue-700 mb-2">Preview Rápido:</div>
                  <div className="space-y-2">
                    <p className="text-sm font-bold" dangerouslySetInnerHTML={{ 
                      __html: replaceUserName(offer.title) 
                    }} />
                    <p className="text-xs text-gray-700">{offer.description.substring(0, 100)}...</p>
                    <Button size="sm" variant="secondary" className="w-full text-xs">
                      {offer.buttonText}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default OfferMap;
