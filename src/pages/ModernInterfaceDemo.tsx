/**
 * 🚀 DEMONSTRAÇÃO DA INTERFACE VISUAL MODERNA
 * 
 * Página que demonstra o novo sistema de interface visual independente
 */

import React from 'react';
import { QuizEditorProvider } from '@/context/QuizEditorContext';
import ModernModularEditor from '@/components/editor/modular/ModernModularEditor';
import { ModularQuizFunnel } from '@/types/modular-editor';

// CSS dos componentes modernos
import '@/components/ui/modern-ui.css';

// Funnel de exemplo para demonstração
const demoFunnel: ModularQuizFunnel = {
  id: 'demo-funnel',
  name: 'Demo - Interface Moderna',
  description: 'Demonstração da nova interface visual',
  status: 'draft',
  steps: [
    {
      id: 'demo-step-1',
      type: 'intro',
      name: 'Etapa de Introdução',
      components: [
        {
          id: 'demo-header-1',
          type: 'header',
          props: {
            title: 'Bem-vindo ao Editor Moderno',
            showLogo: true
          },
          style: {},
          order: 1
        },
        {
          id: 'demo-title-1',
          type: 'title',
          props: {
            text: 'Sistema Modular Moderno',
            level: 1
          },
          style: {},
          order: 2
        }
      ],
      settings: {
        canGoBack: false,
        requireCompletion: false,
        scoringRules: []
      },
      order: 1
    }
  ],
  settings: {
    title: 'Demo Moderno',
    description: 'Interface visual independente',
    language: 'pt-BR',
    theme: {
      colors: {
        primary: '#0090FF',
        secondary: '#718096',
        accent: '#38A169',
        background: '#FFFFFF',
        text: '#1A202C'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter'
      },
      borderRadius: '8px',
      shadows: true
    },
    allowBackNavigation: true,
    showProgressBar: true,
    saveProgress: true,
    resultCalculation: 'points'
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 'demo-user',
  version: 1
};

const ModernInterfaceDemo: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Header de Info */}
      <div style={{
        background: 'linear-gradient(135deg, #0090FF 0%, #0074D9 100%)',
        color: 'white',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '28px', 
          fontWeight: 'bold',
          fontFamily: 'Inter, sans-serif'
        }}>
          🎨 Fase 4: Interface Visual Moderna
        </h1>
        <p style={{
          margin: '8px 0 0 0',
          fontSize: '16px',
          opacity: 0.9
        }}>
          Sistema independente com componentes customizados • Drag & Drop • Design moderno
        </p>
      </div>

      {/* Status da Implementação */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '16px',
            fontFamily: 'Inter, sans-serif'
          }}>
            ✅ Implementações da Fase 4
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif'
          }}>
            <div>
              <strong>🎨 Sistema UI Independente</strong>
              <ul style={{ margin: '8px 0', paddingLeft: '20px', color: '#4a5568' }}>
                <li>✅ Componentes customizados (Button, Card, etc.)</li>
                <li>✅ Sistema de ícones SVG</li>
                <li>✅ CSS moderno com variáveis</li>
                <li>✅ Design system completo</li>
              </ul>
            </div>
            <div>
              <strong>🚀 Interface Visual</strong>
              <ul style={{ margin: '8px 0', paddingLeft: '20px', color: '#4a5568' }}>
                <li>✅ Editor visual moderno</li>
                <li>✅ Painel lateral expansível</li>
                <li>✅ Canvas de edição</li>
                <li>✅ Controles de componente</li>
              </ul>
            </div>
            <div>
              <strong>🎯 Funcionalidades</strong>
              <ul style={{ margin: '8px 0', paddingLeft: '20px', color: '#4a5568' }}>
                <li>✅ Drag & Drop com @dnd-kit</li>
                <li>✅ Seleção de componentes</li>
                <li>✅ Paleta de componentes</li>
                <li>✅ Preview mode</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Moderno */}
      <QuizEditorProvider initialFunnel={demoFunnel}>
        <ModernModularEditor />
      </QuizEditorProvider>

      {/* Footer de Info */}
      <div style={{
        background: '#2d3748',
        color: 'white',
        padding: '20px',
        textAlign: 'center',
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif'
      }}>
        <p style={{ margin: 0 }}>
          🚀 <strong>Fase 4 Concluída:</strong> Interface visual moderna implementada com sucesso! • 
          Sistema independente do Chakra UI • Componentes customizados • Design profissional
        </p>
      </div>
    </div>
  );
};

export default ModernInterfaceDemo;