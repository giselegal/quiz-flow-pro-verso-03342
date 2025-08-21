import { EditorAccessControl } from '@/components/editor/EditorAccessControl';
import { Quiz21StepsProvider } from '@/components/quiz/Quiz21StepsProvider';
import { PreviewProvider } from '@/context/PreviewContext';
import { useQuizFlow } from '@/hooks/core/useQuizFlow';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import React, { useState } from 'react';

// UI Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Icons
import { Eye, Layout, Rocket, Save, Search, Settings, Share, Sparkles } from 'lucide-react';

interface ModernEditorProps {
  quizId?: string;
}

/**
 * 🚀 EDITOR MODERNO - PRIORIDADE 2
 *
 * Interface completamente nova com:
 * ✨ Design moderno e atrativo
 * 🎨 Cores vibrantes e gradientes
 * 🚀 Animações suaves
 * 📱 Layout responsivo
 * 🎯 UX intuitiva
 */
export const EditorModerno: React.FC<ModernEditorProps> = ({ quizId }) => {
  console.log('🚀 EditorModerno: Renderizando...');

  // Quiz Flow State
  const { quizState } = useQuizFlow({
    mode: 'editor',
    onStepChange: step => console.log('🎯 Step:', step),
  });

  // Local State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('components');
  const [isPreview, setIsPreview] = useState(false);
  const [elements, setElements] = useState<any[]>([]);

  // Componentes disponíveis com visual moderno
  const componentCategories = {
    '🎯 Quiz Components': [
      { id: 'question', name: 'Pergunta', icon: '❓', color: 'from-blue-500 to-cyan-500' },
      { id: 'options', name: 'Opções', icon: '📋', color: 'from-green-500 to-emerald-500' },
      { id: 'result', name: 'Resultado', icon: '🏆', color: 'from-yellow-500 to-orange-500' },
    ],
    '🎨 Content Blocks': [
      { id: 'headline', name: 'Título', icon: '📝', color: 'from-purple-500 to-pink-500' },
      { id: 'text', name: 'Texto', icon: '📄', color: 'from-indigo-500 to-blue-500' },
      { id: 'image', name: 'Imagem', icon: '🖼️', color: 'from-red-500 to-pink-500' },
    ],
    '✨ Advanced': [
      { id: 'cta', name: 'Call to Action', icon: '🚀', color: 'from-teal-500 to-cyan-500' },
      { id: 'testimonial', name: 'Depoimento', icon: '💬', color: 'from-amber-500 to-orange-500' },
      { id: 'countdown', name: 'Countdown', icon: '⏰', color: 'from-rose-500 to-red-500' },
    ],
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log('🎯 Drag ended:', event);
    if (event.over?.id === 'canvas') {
      const newElement = {
        id: `element-${Date.now()}`,
        type: event.active.id,
        name: `Novo ${event.active.id}`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setElements(prev => [...prev, newElement]);
    }
  };

  return (
    <EditorAccessControl requiredRole="user" feature="editor">
      <Quiz21StepsProvider>
        <PreviewProvider>
          <DndContext onDragEnd={handleDragEnd}>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
              {/* 🎨 HEADER MODERNO */}
              <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <h1 className="text-xl font-bold text-white">Editor Moderno</h1>
                    </div>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none">
                      PRIORIDADE 2 ✨
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Salvar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPreview(!isPreview)}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {isPreview ? 'Editor' : 'Preview'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Share className="w-4 h-4 mr-1" />
                      Compartilhar
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex h-[calc(100vh-80px)]">
                {/* 🎨 SIDEBAR MODERNO */}
                <div className="w-80 bg-black/20 backdrop-blur-sm border-r border-white/10">
                  <div className="p-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-2 bg-white/10 border-white/20">
                        <TabsTrigger
                          value="components"
                          className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
                        >
                          <Layout className="w-4 h-4 mr-1" />
                          Components
                        </TabsTrigger>
                        <TabsTrigger
                          value="settings"
                          className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
                        >
                          <Settings className="w-4 h-4 mr-1" />
                          Settings
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="components" className="mt-4">
                        <div className="space-y-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-white/60" />
                            <Input
                              placeholder="Buscar componentes..."
                              value={searchTerm}
                              onChange={e => setSearchTerm(e.target.value)}
                              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                            />
                          </div>

                          {Object.entries(componentCategories).map(([category, components]) => (
                            <Card key={category} className="bg-white/5 border-white/10">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-white">{category}</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                {components
                                  .filter(comp =>
                                    comp.name.toLowerCase().includes(searchTerm.toLowerCase())
                                  )
                                  .map(component => (
                                    <div
                                      key={component.id}
                                      draggable
                                      className={`
                                      p-3 rounded-lg cursor-move transition-all duration-200
                                      bg-gradient-to-r ${component.color}
                                      hover:scale-105 hover:shadow-lg
                                      ${selectedComponent === component.id ? 'ring-2 ring-white/50' : ''}
                                    `}
                                      onClick={() => setSelectedComponent(component.id)}
                                    >
                                      <div className="flex items-center space-x-2 text-white">
                                        <span className="text-lg">{component.icon}</span>
                                        <span className="font-medium">{component.name}</span>
                                      </div>
                                    </div>
                                  ))}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="settings" className="mt-4">
                        <Card className="bg-white/5 border-white/10">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center">
                              <Settings className="w-4 h-4 mr-2" />
                              Configurações
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-white/80">
                            <p>Quiz ID: {quizId || 'demo'}</p>
                            <p>Etapa Atual: {quizState.currentStep}</p>
                            <p>Total de Etapas: {quizState.totalSteps}</p>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>

                {/* 🎨 CANVAS MODERNO */}
                <div className="flex-1 p-6">
                  {isPreview ? (
                    <div className="h-full bg-white rounded-xl shadow-2xl p-8">
                      <div className="text-center">
                        <Eye className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Preview Mode</h2>
                        <p className="text-gray-600">Visualização em tempo real do seu quiz</p>
                      </div>
                    </div>
                  ) : (
                    <div
                      id="canvas"
                      className="h-full bg-white/10 backdrop-blur-sm rounded-xl border-2 border-dashed border-white/30 p-8"
                    >
                      {elements.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-center">
                          <div className="text-white">
                            <Rocket className="w-16 h-16 mx-auto mb-4 opacity-60" />
                            <h2 className="text-2xl font-bold mb-2">Canvas Vazio</h2>
                            <p className="text-white/80 mb-4">
                              Arraste componentes da barra lateral para começar a criar seu quiz
                            </p>
                            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                              ✨ Novo Design Moderno
                            </Badge>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-white text-lg font-semibold">
                              Elementos no Canvas ({elements.length})
                            </h3>
                            <Button
                              size="sm"
                              onClick={() => setElements([])}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              Limpar Canvas
                            </Button>
                          </div>

                          {elements.map((element, index) => (
                            <Card
                              key={element.id}
                              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all"
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                      {index + 1}
                                    </div>
                                    <div>
                                      <h4 className="text-white font-medium">{element.name}</h4>
                                      <p className="text-white/60 text-sm">
                                        Tipo: {element.type} • Criado: {element.timestamp}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-white border-white/20"
                                    >
                                      <Settings className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-red-300 border-red-300/20 hover:bg-red-500/20"
                                      onClick={() =>
                                        setElements(prev => prev.filter(el => el.id !== element.id))
                                      }
                                    >
                                      ✕
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DndContext>
        </PreviewProvider>
      </Quiz21StepsProvider>
    </EditorAccessControl>
  );
};

export default EditorModerno;
