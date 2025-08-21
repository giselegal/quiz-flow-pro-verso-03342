import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Download,
  Eye,
  Layout,
  Palette,
  Rocket,
  Save,
  Settings,
  Sparkles,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';

/**
 * 🎨 EDITOR MELHORADO - PRIORIDADE 2
 *
 * Interface moderna com melhorias visuais claras
 */
export const EditorMelhorado: React.FC = () => {
  const [activeTab, setActiveTab] = useState('design');

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* 🎨 NOVA BARRA SUPERIOR MODERNA */}
      <div className="h-16 bg-white/80 backdrop-blur-sm border-b border-indigo-200 shadow-sm">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Editor Unificado V2
              </h1>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              ✨ Melhorado
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="border-indigo-200 hover:bg-indigo-50">
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
            <Button variant="outline" size="sm" className="border-green-200 hover:bg-green-50">
              <Save className="w-4 h-4 mr-1" />
              Salvar
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              <Download className="w-4 h-4 mr-1" />
              Exportar
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* 🎨 SIDEBAR MELHORADA */}
        <div className="w-80 bg-white/70 backdrop-blur-sm border-r border-indigo-200 shadow-sm">
          <div className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-indigo-50">
                <TabsTrigger
                  value="design"
                  className="text-xs data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
                >
                  <Palette className="w-3 h-3 mr-1" />
                  Design
                </TabsTrigger>
                <TabsTrigger
                  value="components"
                  className="text-xs data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
                >
                  <Layout className="w-3 h-3 mr-1" />
                  Blocos
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="text-xs data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
                >
                  <Settings className="w-3 h-3 mr-1" />
                  Config
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="px-4 pb-4 h-[calc(100%-80px)] overflow-y-auto">
            <Tabs value={activeTab}>
              <TabsContent value="design" className="space-y-4 mt-0">
                <Card className="border-indigo-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-indigo-500" />
                      Templates Modernos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 cursor-pointer hover:shadow-sm transition-all">
                      <div className="text-sm font-medium text-blue-800">Quiz Moderno</div>
                      <div className="text-xs text-blue-600">Design clean e responsivo</div>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 cursor-pointer hover:shadow-sm transition-all">
                      <div className="text-sm font-medium text-purple-800">Quiz Premium</div>
                      <div className="text-xs text-purple-600">Animações e transições</div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="components" className="space-y-4 mt-0">
                <Card className="border-green-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <Layout className="w-4 h-4 mr-2 text-green-500" />
                      Componentes Avançados
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200 cursor-pointer hover:shadow-sm transition-all">
                      <div className="text-sm font-medium text-green-800">Pergunta Interativa</div>
                      <div className="text-xs text-green-600">Com animações suaves</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:shadow-sm transition-all">
                      <div className="text-sm font-medium text-blue-800">Resultado Dinâmico</div>
                      <div className="text-xs text-blue-600">Personalização avançada</div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4 mt-0">
                <Card className="border-orange-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <Settings className="w-4 h-4 mr-2 text-orange-500" />
                      Configurações Pro
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">Tema</label>
                      <select className="w-full text-xs p-2 border border-gray-200 rounded">
                        <option>Moderno (Novo)</option>
                        <option>Clássico</option>
                        <option>Minimalista</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">Animações</label>
                      <select className="w-full text-xs p-2 border border-gray-200 rounded">
                        <option>Suaves (Recomendado)</option>
                        <option>Rápidas</option>
                        <option>Desabilitadas</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* 🎨 ÁREA DE TRABALHO MELHORADA */}
        <div className="flex-1 p-6">
          <Card className="h-full border-2 border-dashed border-indigo-300 bg-white/50 backdrop-blur-sm">
            <CardContent className="h-full p-8 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Rocket className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Editor Unificado V2
                </h2>

                <p className="text-gray-600 mb-6">
                  Interface moderna com melhorias visuais significativas. Arraste componentes da
                  sidebar para começar a criar.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 mr-1 text-yellow-500" />
                      Performance otimizada
                    </div>
                    <div className="flex items-center">
                      <Sparkles className="w-4 h-4 mr-1 text-indigo-500" />
                      Design moderno
                    </div>
                  </div>

                  <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                    <Rocket className="w-4 h-4 mr-2" />
                    Começar Criação
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditorMelhorado;
