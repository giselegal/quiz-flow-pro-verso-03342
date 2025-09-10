// =====================================================================
// components/editor/demo/EditorShowcase.tsx - Showcase das funcionalidades
// =====================================================================

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';
import {
  Sparkles,
  Monitor,
  History,
  Palette,
  Settings,
  Target,
  Layers,
  Clock,
  CheckCircle,
} from 'lucide-react';

export const EditorShowcase: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<string>('overview');

  const features = [
    {
      id: 'responsive',
      title: 'Preview Responsivo',
      description: 'Teste seu design em desktop, tablet e mobile',
      icon: <Monitor className="w-6 h-6" />,
      status: 'Implementado',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'properties',
      title: 'Painel de Propriedades Avançado',
      description: '7 seções organizadas para configuração completa',
      icon: <Settings className="w-6 h-6" />,
      status: 'Implementado',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'history',
      title: 'Histórico de Propriedades',
      description: 'Undo/Redo com até 50 entradas',
      icon: <History className="w-6 h-6" />,
      status: 'Implementado',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'dragdrop',
      title: 'Drag & Drop',
      description: 'Reordenação intuitiva de elementos',
      icon: <Layers className="w-6 h-6" />,
      status: 'Implementado',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'templates',
      title: 'Sistema de Templates',
      description: 'Templates predefinidos para agilizar desenvolvimento',
      icon: <Sparkles className="w-6 h-6" />,
      status: 'Implementado',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'colorpicker',
      title: 'Color Picker Avançado',
      description: 'Seleção de cores com presets e picker nativo',
      icon: <Palette className="w-6 h-6" />,
      status: 'Implementado',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'keyboard',
      title: 'Atalhos de Teclado',
      description: 'Ctrl+Z, Ctrl+Y, Del para navegação rápida',
      icon: <Target className="w-6 h-6" />,
      status: 'Implementado',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'performance',
      title: 'Otimização de Performance',
      description: 'Debouncing, memoização e lazy loading',
      icon: <CheckCircle className="w-6 h-6" />,
      status: 'Implementado',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  const implementationDetails = {
    responsive: {
      title: 'Preview Responsivo',
      description: 'Sistema de preview que permite visualizar o design em diferentes dispositivos.',
      components: ['SchemaDrivenEditorResponsive.tsx', 'PreviewModeButtons'],
      features: [
        'Botões de alternância Desktop/Tablet/Mobile',
        'Canvas responsivo com dimensões específicas',
        'Indicador visual do modo ativo',
        'Transições suaves entre modos',
      ],
    },
    properties: {
      title: 'Painel de Propriedades Dinâmico',
      description: 'Sistema schema-driven para configuração automática e completa de componentes.',
      components: ['OptimizedPropertiesPanel.tsx', 'PropertyInput.tsx', 'blockDefinitions.ts'],
      features: [
        'Schema automático baseado em blockDefinitions',
        'Suporte a propriedades aninhadas',
        'Validação automática de tipos',
        'Interface responsiva e moderna',
        'Configuração de funnel global',
        'Suporte a todos os 44+ componentes inline',
        'Configuração dinâmica por tipo de bloco',
      ],
    },
    history: {
      title: 'Sistema de Histórico',
      description: 'Controle completo do histórico de alterações com navegação temporal.',
      components: ['usePropertyHistory.ts', 'PropertyHistory.tsx'],
      features: [
        'Até 50 entradas no histórico',
        'Timestamps para cada ação',
        'Descrições automáticas das alterações',
        'Interface visual para navegação',
        'Integração com atalhos de teclado',
      ],
    },
  };

  return (
    <div style={{ backgroundColor: '#FAF9F7' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-[#B89B7A] rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 style={{ color: '#432818' }}>Editor Visual Avançado</h1>
              <p style={{ color: '#6B4F43' }}>
                Sistema completo de edição com recursos modernos e interface intuitiva
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="outline" style={{ color: '#6B4F43' }}>
              <CheckCircle className="w-3 h-3 mr-1" />8 Funcionalidades Implementadas
            </Badge>
            <Badge variant="outline" className="bg-[#B89B7A]/10 text-[#A38A69] border-[#B89B7A]/30">
              <Clock className="w-3 h-3 mr-1" />
              Última atualização: Agora
            </Badge>
          </div>
        </div>

        {/* Navigation */}
        <div className="mb-6">
          <div style={{ borderColor: '#E5DDD5' }}>
            {[
              { id: 'overview', label: 'Visão Geral' },
              { id: 'responsive', label: 'Responsivo' },
              { id: 'properties', label: 'Propriedades' },
              { id: 'history', label: 'Histórico' },
            ].map(tab => (
              <Button
                key={tab.id}
                variant={activeDemo === tab.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveDemo(tab.id)}
                className="flex-1"
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeDemo === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map(feature => (
              <Card key={feature.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                      <div className={feature.color}>{feature.icon}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {feature.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-base mb-2">{feature.title}</CardTitle>
                  <p style={{ color: '#6B4F43' }}>{feature.description}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => setActiveDemo(feature.id)}
                  >
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Detail Views */}
        {activeDemo !== 'overview' &&
          implementationDetails[activeDemo as keyof typeof implementationDetails] && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    {features.find(f => f.id === activeDemo)?.icon}
                    <span>
                      {
                        implementationDetails[activeDemo as keyof typeof implementationDetails]
                          .title
                      }
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p style={{ color: '#6B4F43' }}>
                    {
                      implementationDetails[activeDemo as keyof typeof implementationDetails]
                        .description
                    }
                  </p>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Componentes Implementados:</h4>
                    <div className="flex flex-wrap gap-2">
                      {implementationDetails[
                        activeDemo as keyof typeof implementationDetails
                      ].components.map(component => (
                        <Badge key={component} variant="secondary">
                          {component}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Funcionalidades:</h4>
                    <ul className="space-y-1">
                      {implementationDetails[
                        activeDemo as keyof typeof implementationDetails
                      ].features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <div style={{ borderColor: '#E5DDD5' }}>
            <Sparkles className="w-4 h-4 text-[#B89B7A]" />
            <span style={{ color: '#6B4F43' }}>
              Sistema completo implementado com React, TypeScript e Tailwind CSS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
