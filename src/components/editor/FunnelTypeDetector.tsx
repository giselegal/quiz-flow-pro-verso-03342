/**
 * 🎯 FUNNEL TYPE DETECTOR - Detector de Tipos de Funil
 * 
 * Componente para detectar automaticamente o tipo de funil e carregar
 * o editor apropriado no ModernUnifiedEditor.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  Brain, 
  Layout, 
  Settings, 
  Eye,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface FunnelType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  editorComponent: string;
  features: string[];
}

interface FunnelTypeDetectorProps {
  funnelId?: string;
  templateId?: string;
  onTypeDetected?: (type: FunnelType) => void;
  onLoadEditor?: (type: FunnelType) => void;
}

const FUNNEL_TYPES: FunnelType[] = [
  {
    id: 'quiz-estilo',
    name: 'Quiz de Estilo Pessoal',
    description: 'Quiz completo de 21 etapas para descobrir o estilo pessoal',
    icon: Target,
    color: 'blue',
    editorComponent: 'QuizFunnelEditor',
    features: ['21 etapas', 'Sistema de pontuação', 'Ofertas personalizadas', 'Preview em tempo real']
  },
  {
    id: 'quiz-generic',
    name: 'Quiz Genérico',
    description: 'Quiz personalizável com etapas configuráveis',
    icon: Brain,
    color: 'green',
    editorComponent: 'GenericQuizEditor',
    features: ['Etapas personalizáveis', 'Múltiplas opções', 'Resultados dinâmicos']
  },
  {
    id: 'lead-magnet',
    name: 'Lead Magnet',
    description: 'Página de captura de leads com formulário',
    icon: Layout,
    color: 'purple',
    editorComponent: 'LeadMagnetEditor',
    features: ['Formulário de captura', 'Landing page', 'Integração com CRM']
  },
  {
    id: 'webinar',
    name: 'Webinar',
    description: 'Página de inscrição para webinar',
    icon: Settings,
    color: 'orange',
    editorComponent: 'WebinarEditor',
    features: ['Inscrição', 'Calendário', 'Lembretes automáticos']
  }
];

export default function FunnelTypeDetector({
  funnelId,
  templateId,
  onTypeDetected,
  onLoadEditor
}: FunnelTypeDetectorProps) {
  const [detectedType, setDetectedType] = useState<FunnelType | null>(null);
  const [isDetecting, setIsDetecting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    detectFunnelType();
  }, [funnelId, templateId]);

  const detectFunnelType = async () => {
    setIsDetecting(true);
    setError(null);

    try {
      // Simular detecção baseada em ID ou template
      await new Promise(resolve => setTimeout(resolve, 1000));

      let detected: FunnelType | null = null;

      // Detectar por template ID
      if (templateId) {
        if (templateId.includes('quiz-estilo') || templateId.includes('quiz-21-steps')) {
          detected = FUNNEL_TYPES.find(t => t.id === 'quiz-estilo') || null;
        } else if (templateId.includes('quiz')) {
          detected = FUNNEL_TYPES.find(t => t.id === 'quiz-generic') || null;
        } else if (templateId.includes('lead')) {
          detected = FUNNEL_TYPES.find(t => t.id === 'lead-magnet') || null;
        } else if (templateId.includes('webinar')) {
          detected = FUNNEL_TYPES.find(t => t.id === 'webinar') || null;
        }
      }

      // Detectar por funnel ID
      if (funnelId && !detected) {
        if (funnelId.includes('quiz-estilo')) {
          detected = FUNNEL_TYPES.find(t => t.id === 'quiz-estilo') || null;
        } else if (funnelId.includes('quiz')) {
          detected = FUNNEL_TYPES.find(t => t.id === 'quiz-generic') || null;
        }
      }

      // Fallback para quiz genérico
      if (!detected) {
        detected = FUNNEL_TYPES.find(t => t.id === 'quiz-generic') || null;
      }

      setDetectedType(detected);
      onTypeDetected?.(detected!);
    } catch (err) {
      setError('Erro ao detectar tipo de funil');
      console.error('Erro na detecção:', err);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleLoadEditor = () => {
    if (detectedType) {
      onLoadEditor?.(detectedType);
    }
  };

  if (isDetecting) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Detectando tipo de funil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={detectFunnelType} variant="outline">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  if (!detectedType) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-yellow-500" />
          <p className="text-gray-600">Tipo de funil não identificado</p>
        </div>
      </div>
    );
  }

  const IconComponent = detectedType.icon;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-${detectedType.color}-100`}>
              <IconComponent className={`w-6 h-6 text-${detectedType.color}-600`} />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {detectedType.name}
                <Badge variant="outline" className="text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Detectado
                </Badge>
              </CardTitle>
              <CardDescription>{detectedType.description}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Funcionalidades Disponíveis:</h4>
              <div className="flex flex-wrap gap-2">
                {detectedType.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-gray-600">
                Editor: <span className="font-medium">{detectedType.editorComponent}</span>
              </div>
              
              <Button onClick={handleLoadEditor} className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Carregar Editor
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}