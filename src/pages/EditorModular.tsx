/**
 * 🎯 EDITOR MODULAR - Página de teste FASE 1, 2 e 3
 * 
 * Valida integração completa do Registry Universal:
 * - Carregamento de schemas
 * - Biblioteca de componentes dinâmica
 * - Renderização com UniversalBlock
 * - Propriedades editáveis dinamicamente
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { loadDefaultSchemas, isSchemasLoaded } from '@/core/schema/loadDefaultSchemas';
import { schemaInterpreter } from '@/core/schema/SchemaInterpreter';
import { UniversalBlock } from '@/components/core/UniversalBlock';
import { DynamicPropertyControls } from '@/components/editor/DynamicPropertyControls';
import { loadComponentsFromRegistry, groupComponentsByCategory, createElementFromSchema } from '@/core/editor/SchemaComponentAdapter';
import { Check, X, Code, Eye, Layers, Plus } from 'lucide-react';

interface TestBlock {
  id: string;
  type: string;
  properties: Record<string, any>;
  content?: any;
}

export default function EditorModular() {
  const [loaded, setLoaded] = useState(false);
  const [components, setComponents] = useState<any[]>([]);
  const [categories, setCategories] = useState<Record<string, any[]>>({});
  const [activeTab, setActiveTab] = useState('registry');
  const [testBlocks, setTestBlocks] = useState<TestBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<TestBlock | null>(null);

  // Carregar schemas
  useEffect(() => {
    console.log('[EditorModular] Inicializando...');
    loadDefaultSchemas();
    
    const comps = loadComponentsFromRegistry();
    const cats = groupComponentsByCategory(comps);
    
    setComponents(comps);
    setCategories(cats);
    setLoaded(isSchemasLoaded());
    
    console.log(`[EditorModular] ✅ ${comps.length} componentes carregados`);
  }, []);

  const addTestBlock = (type: string) => {
    try {
      const element = createElementFromSchema(type);
      const newBlock: TestBlock = {
        id: element.id,
        type: element.type,
        properties: element.properties || {},
        content: element.content || {},
      };
      
      setTestBlocks(prev => [...prev, newBlock]);
      setSelectedBlock(newBlock);
      console.log('[EditorModular] Bloco adicionado:', newBlock);
    } catch (error) {
      console.error('[EditorModular] Erro ao adicionar bloco:', error);
    }
  };

  const updateBlockProperty = (key: string, value: any) => {
    if (!selectedBlock) return;
    
    const updated = {
      ...selectedBlock,
      properties: {
        ...selectedBlock.properties,
        [key]: value,
      },
    };
    
    setSelectedBlock(updated);
    setTestBlocks(prev => 
      prev.map(b => b.id === updated.id ? updated : b)
    );
  };

  const removeBlock = (id: string) => {
    setTestBlocks(prev => prev.filter(b => b.id !== id));
    if (selectedBlock?.id === id) {
      setSelectedBlock(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Editor Modular</h1>
              <p className="text-sm text-slate-600 mt-1">
                FASE 1 + 2 + 3: Registry Universal Integrado
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant={loaded ? "default" : "secondary"} className="flex items-center gap-1">
                {loaded ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                {loaded ? 'Schemas Carregados' : 'Carregando...'}
              </Badge>
              
              <Badge variant="outline">
                {components.length} Componentes
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="registry">
              <Layers className="w-4 h-4 mr-2" />
              Registry
            </TabsTrigger>
            <TabsTrigger value="components">
              <Plus className="w-4 h-4 mr-2" />
              Componentes
            </TabsTrigger>
            <TabsTrigger value="canvas">
              <Eye className="w-4 h-4 mr-2" />
              Canvas
            </TabsTrigger>
            <TabsTrigger value="code">
              <Code className="w-4 h-4 mr-2" />
              Schema JSON
            </TabsTrigger>
          </TabsList>

          {/* Tab: Registry Info */}
          <TabsContent value="registry" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Status do Registry</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-sm text-green-600 font-medium">Schemas Carregados</div>
                    <div className="text-2xl font-bold text-green-700 mt-1">
                      {loaded ? 'Sim' : 'Não'}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">Total de Componentes</div>
                    <div className="text-2xl font-bold text-blue-700 mt-1">
                      {components.length}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Categorias Disponíveis</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(categories).map(([cat, comps]) => (
                      <div key={cat} className="p-3 border rounded-lg bg-white">
                        <div className="font-medium text-sm">{cat}</div>
                        <div className="text-xs text-slate-600 mt-1">
                          {comps.length} componente(s)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Component Library */}
          <TabsContent value="components" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Biblioteca de Componentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(categories).map(([category, comps]) => (
                    <div key={category}>
                      <h3 className="font-semibold mb-3 text-slate-700">{category}</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {comps.map((comp: any) => (
                          <button
                            key={comp.id}
                            onClick={() => addTestBlock(comp.id)}
                            className="p-4 border rounded-lg bg-white hover:border-primary hover:shadow-md transition-all text-left"
                          >
                            <div className="font-medium text-sm">{comp.name}</div>
                            <div className="text-xs text-slate-600 mt-1">
                              {comp.description}
                            </div>
                            {comp.aiEnhanced && (
                              <Badge variant="secondary" className="mt-2 text-xs">
                                AI Enhanced
                              </Badge>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Canvas */}
          <TabsContent value="canvas" className="mt-6">
            <div className="grid grid-cols-3 gap-4">
              {/* Canvas Area */}
              <div className="col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Canvas de Teste</span>
                      <Badge variant="outline">{testBlocks.length} blocos</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="min-h-[500px] bg-slate-50 p-6">
                    {testBlocks.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-slate-400">
                        <div className="text-center">
                          <Layers className="w-12 h-12 mx-auto mb-3" />
                          <p>Nenhum bloco adicionado</p>
                          <p className="text-sm mt-1">
                            Clique em "Componentes" para adicionar
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {testBlocks.map(block => (
                          <div
                            key={block.id}
                            className={`border-2 rounded-lg p-4 bg-white cursor-pointer transition-all ${
                              selectedBlock?.id === block.id
                                ? 'border-primary shadow-lg'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                            onClick={() => setSelectedBlock(block)}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <Badge variant="outline">{block.type}</Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  removeBlock(block.id);
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <UniversalBlock
                              type={block.type}
                              properties={block.properties}
                              content={block.content}
                              isSelected={selectedBlock?.id === block.id}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Properties Panel */}
              <div className="col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Propriedades</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!selectedBlock ? (
                      <div className="text-center text-slate-400 py-12">
                        <p>Selecione um bloco</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-3 bg-slate-50 rounded border">
                          <div className="text-xs text-slate-600">Tipo</div>
                          <div className="font-mono text-sm">{selectedBlock.type}</div>
                        </div>

                        <DynamicPropertyControls
                          elementType={selectedBlock.type}
                          properties={selectedBlock.properties}
                          onChange={updateBlockProperty}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Tab: Schema JSON */}
          <TabsContent value="code" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Schema Export</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-auto max-h-[600px] text-xs">
                  {JSON.stringify(
                    {
                      schemas: schemaInterpreter.exportSchema(),
                      components: components.length,
                      categories: Object.keys(categories),
                      testBlocks: testBlocks.map(b => ({
                        type: b.type,
                        properties: b.properties,
                      })),
                    },
                    null,
                    2
                  )}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
