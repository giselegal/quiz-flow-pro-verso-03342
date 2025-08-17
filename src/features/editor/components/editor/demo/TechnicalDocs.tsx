// =====================================================================
// components/editor/demo/TechnicalDocs.tsx - Documentação técnica
// =====================================================================

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import {
  Code2,
  FileText,
  Settings,
  Zap,
  Layers,
  Monitor,
  CheckCircle,
  ArrowRight,
  Download,
  ExternalLink,
} from 'lucide-react';

export const TechnicalDocs: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const architectureFeatures = [
    {
      title: 'Editor Multi-Panel Responsivo',
      description:
        'Sistema de painéis redimensionáveis com layouts específicos para desktop e mobile',
      tech: ['ResizablePanelGroup', 'Responsive Design', 'Mobile Detection'],
      status: '✅ Implementado',
    },
    {
      title: 'Painel de Propriedades Avançado',
      description: 'Sistema completo de configuração com histórico de alterações e validação',
      tech: ['React Context', 'TypeScript', 'Real-time Updates'],
      status: '✅ Implementado',
    },
    {
      title: 'Gerenciamento de Etapas',
      description: 'CRUD completo para etapas com drag & drop e edição inline',
      tech: ['DnD Kit', 'Optimistic Updates', 'State Management'],
      status: '✅ Implementado',
    },
    {
      title: 'Biblioteca de Componentes',
      description: 'Catálogo categorizado com busca e preview em tempo real',
      tech: ['Dynamic Imports', 'Search & Filter', 'Category System'],
      status: '✅ Implementado',
    },
    {
      title: 'Sistema de Blocks Universal',
      description: 'Renderização dinâmica de blocos com suporte completo a tipos',
      tech: ['UniversalBlockRenderer', 'Type Safety', 'Props Validation'],
      status: '✅ Implementado',
    },
  ];

  const technicalSpecs = [
    {
      category: 'Frontend',
      items: [
        'React 18 + TypeScript',
        'Tailwind CSS para estilização',
        'Radix UI para componentes base',
        'Lucide React para ícones',
        'Zustand para estado global',
      ],
    },
    {
      category: 'Arquitetura',
      items: [
        'Component-based architecture',
        'Custom hooks para lógica',
        'Context API para estado compartilhado',
        'TypeScript strict mode',
        'ESLint + Prettier',
      ],
    },
    {
      category: 'Responsividade',
      items: [
        'Mobile-first design',
        'Breakpoints otimizados',
        'Touch-friendly interfaces',
        'Adaptive layouts',
        'Progressive enhancement',
      ],
    },
  ];

  const implementationGuide = [
    {
      step: 1,
      title: 'Configuração Inicial',
      description: 'Estrutura base do projeto e dependências',
      code: `// Configuração do editor responsivo
const SchemaDrivenEditorResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile ? <MobileLayout /> : <DesktopLayout />;
};`,
    },
    {
      step: 2,
      title: 'Sistema de Painéis',
      description: 'Implementação dos painéis redimensionáveis',
      code: `// Sistema de painéis com ResizablePanelGroup
<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize={20} minSize={15}>
    <StepsPanel />
  </ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={50} minSize={30}>
    <CanvasArea />
  </ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={30} minSize={20}>
    <ComponentsPanel />
  </ResizablePanel>
</ResizablePanelGroup>`,
    },
    {
      step: 3,
      title: 'Gerenciamento de Estado',
      description: 'Hook personalizado para editor',
      code: `// Hook useEditor para gerenciar estado
const useEditor = () => {
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [history, setHistory] = useState<BlockData[][]>([]);
  
  const addBlock = useCallback((type: string, props?: any) => {
    const newBlock = { id: generateId(), type, props: props || {} };
    setBlocks(prev => [...prev, newBlock]);
    saveToHistory([...blocks, newBlock]);
  }, [blocks]);
  
  return { blocks, selectedBlock, addBlock, /* ... */ };
};`,
    },
  ];

  return (
    <div style={{ backgroundColor: '#FAF9F7' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 style={{ color: '#432818' }}>Documentação Técnica</h1>
              <p style={{ color: '#6B4F43' }}>Arquitetura e implementação do Editor Visual</p>
            </div>
          </div>
        </div>

        <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="architecture">Arquitetura</TabsTrigger>
            <TabsTrigger value="implementation">Implementação</TabsTrigger>
            <TabsTrigger value="specs">Especificações</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Funcionalidades Principais</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {architectureFeatures.map((feature, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{feature.title}</h4>
                        <Badge variant="outline" style={{ color: '#6B4F43' }}>
                          {feature.status}
                        </Badge>
                      </div>
                      <p style={{ color: '#6B4F43' }}>{feature.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {feature.tech.map((tech, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Monitor className="w-5 h-5" />
                    <span>Preview Responsivo</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#B89B7A]/20 rounded-lg flex items-center justify-center">
                        <Monitor className="w-4 h-4 text-[#B89B7A]" />
                      </div>
                      <div>
                        <p className="font-medium">Desktop (1200px+)</p>
                        <p style={{ color: '#6B4F43' }}>Layout horizontal com 3 painéis</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div style={{ backgroundColor: '#E5DDD5' }}>
                        <Monitor className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Tablet (768px)</p>
                        <p style={{ color: '#6B4F43' }}>Layout adaptado com painéis colapsáveis</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#B89B7A]/20 rounded-lg flex items-center justify-center">
                        <Monitor className="w-4 h-4 text-[#B89B7A]" />
                      </div>
                      <div>
                        <p className="font-medium">Mobile (375px)</p>
                        <p style={{ color: '#6B4F43' }}>Stack vertical com navegação por abas</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Architecture */}
          <TabsContent value="architecture">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Layers className="w-5 h-5" />
                    <span>Arquitetura de Componentes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {technicalSpecs.map((spec, index) => (
                      <div key={index} className="space-y-3">
                        <h4 className="font-semibold text-lg">{spec.category}</h4>
                        <ul className="space-y-2">
                          {spec.items.map((item, i) => (
                            <li key={i} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fluxo de Dados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                      {[
                        'User Action',
                        'Hook useEditor',
                        'State Update',
                        'Component Re-render',
                        'UI Update',
                      ].map((step, index, array) => (
                        <React.Fragment key={index}>
                          <div className="text-center">
                            <div className="w-12 h-12 bg-[#B89B7A]/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <span className="text-[#B89B7A] font-semibold">{index + 1}</span>
                            </div>
                            <p className="text-sm font-medium">{step}</p>
                          </div>
                          {index < array.length - 1 && (
                            <ArrowRight className="w-5 h-5 text-gray-400 mx-auto hidden md:block" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Implementation */}
          <TabsContent value="implementation">
            <div className="space-y-6">
              {implementationGuide.map((guide, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#B89B7A]/20 rounded-lg flex items-center justify-center">
                        <span className="text-[#B89B7A] font-semibold">{guide.step}</span>
                      </div>
                      <span>{guide.title}</span>
                    </CardTitle>
                    <p style={{ color: '#6B4F43' }}>{guide.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm">
                        <code>{guide.code}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Specs */}
          <TabsContent value="specs">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Configurações Técnicas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Dependências Principais</h4>
                    <div className="space-y-1 text-sm">
                      <p>• React ^18.0.0</p>
                      <p>• TypeScript ^5.0.0</p>
                      <p>• Tailwind CSS ^3.4.0</p>
                      <p>• @radix-ui/react-* (múltiplos)</p>
                      <p>• lucide-react ^0.400.0</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Build & Dev</h4>
                    <div className="space-y-1 text-sm">
                      <p>• Vite para bundling</p>
                      <p>• SWC para transpilação</p>
                      <p>• Hot Module Replacement</p>
                      <p>• Code splitting automático</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span>Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Otimizações</h4>
                    <div className="space-y-1 text-sm">
                      <p>• Lazy loading de componentes</p>
                      <p>• Memoização com useMemo/useCallback</p>
                      <p>• Virtual scrolling para listas grandes</p>
                      <p>• Debounce em buscas e inputs</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Métricas</h4>
                    <div className="space-y-1 text-sm">
                      <p>• Bundle size: ~500KB (gzipped)</p>
                      <p>• First Contentful Paint: &lt;1.5s</p>
                      <p>• Time to Interactive: &lt;2.5s</p>
                      <p>• Lighthouse Score: 95+</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Links Úteis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="justify-start">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    GitHub Repository
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    API Documentation
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Componente Storybook
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
