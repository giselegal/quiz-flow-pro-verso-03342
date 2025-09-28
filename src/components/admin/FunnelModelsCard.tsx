/**
 * 📋 FUNNEL MODELS CARD - Card dedicado para modelos de funis
 * 
 * Componente para exibir modelos de funis no dashboard principal
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import {
  Palette,
  Play,
  Eye,
  ArrowRight,
  Star,
  TrendingUp,
  Users
} from 'lucide-react';

const featuredModels = [
  {
    id: 'quiz21StepsComplete',
    name: 'Quiz 21 Etapas - Estilo Pessoal',
    description: 'Modelo mais popular para descoberta de estilo pessoal',
    stepCount: 21,
    conversionRate: '73%',
    category: 'Quiz',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    icon: '🎨'
  },
  {
    id: 'lead-magnet-fashion',
    name: 'Lead Magnet Fashion',
    description: 'Captura de leads otimizada para moda',
    stepCount: 7,
    conversionRate: '81%',
    category: 'Lead Generation',
    color: 'bg-pink-50 border-pink-200 text-pink-700',
    icon: '👗'
  },
  {
    id: 'quiz-personalidade-profissional',
    name: 'Personalidade Profissional',
    description: 'Quiz focado em perfil de carreira',
    stepCount: 15,
    conversionRate: '68%',
    category: 'B2B',
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    icon: '💼'
  }
];

const FunnelModelsCard: React.FC = () => {
  const handleUseModel = (modelId: string) => {
    const newFunnelId = `funnel-${modelId}-${Date.now()}`;
    window.open(`/editor?template=${modelId}&funnel=${newFunnelId}`, '_blank');
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Palette className="w-5 h-5 text-blue-600" />
          Modelos de Funis Disponíveis
        </CardTitle>
        <p className="text-sm text-gray-600">
          Templates prontos para criar funis rapidamente
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Featured Models */}
        <div className="space-y-3">
          {featuredModels.map((model) => (
            <div key={model.id} className={`p-3 rounded-lg border ${model.color} transition-all hover:shadow-md`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{model.icon}</span>
                    <h4 className="font-semibold text-sm">{model.name}</h4>
                  </div>
                  <p className="text-xs opacity-75 mb-2">{model.description}</p>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{model.stepCount} etapas</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{model.conversionRate}</span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <Button
                    size="sm"
                    onClick={() => handleUseModel(model.id)}
                    className="text-xs px-2 py-1 h-7"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Usar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`/templates/preview/${model.id}`, '_blank')}
                    className="text-xs px-2 py-1 h-7"
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Button */}
        <div className="pt-3 border-t border-gray-200">
          <Link href="/admin/modelos">
            <Button variant="outline" className="w-full" size="sm">
              <ArrowRight className="w-4 h-4 mr-2" />
              Ver Todos os Modelos ({featuredModels.length + 5}+ disponíveis)
            </Button>
          </Link>
        </div>
        
        {/* Quick Stats */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-gray-600">Total</p>
              <p className="font-semibold text-sm">8+ Modelos</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Conversão Média</p>
              <p className="font-semibold text-sm text-green-600">74%</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Mais Usado</p>
              <p className="font-semibold text-sm">Quiz 21 🎨</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FunnelModelsCard;
