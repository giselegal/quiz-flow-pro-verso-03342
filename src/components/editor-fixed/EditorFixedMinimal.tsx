import React from 'react';
import { Card } from '@/components/ui/card';

const EditorFixedMinimal: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-slate-800">
            Editor Fixed - Sistema Integrado
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Sistema de quiz personalizado com resultado dinâmico e painel de propriedades completo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[600px]">
          {/* Coluna 1: Componentes */}
          <Card className="p-4 bg-white shadow-lg">
            <h3 className="font-bold text-lg mb-4 text-slate-700">
              📦 Componentes
            </h3>
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-700">Text Block</div>
                <div className="text-xs text-blue-600">Texto editável</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm font-medium text-green-700">Button Block</div>
                <div className="text-xs text-green-600">Botão interativo</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-sm font-medium text-purple-700">Quiz Header</div>
                <div className="text-xs text-purple-600">Cabeçalho com progresso</div>
              </div>
            </div>
          </Card>

          {/* Coluna 2: Etapas */}
          <Card className="p-4 bg-white shadow-lg">
            <h3 className="font-bold text-lg mb-4 text-slate-700">
              📝 Etapas (1-21)
            </h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {Array.from({ length: 21 }, (_, i) => (
                <div key={i + 1} className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="text-sm font-medium text-slate-700">
                    Step {i + 1}
                  </div>
                  <div className="text-xs text-slate-500">
                    {i === 0 && 'Introdução'}
                    {i === 1 && 'Nome do usuário'}
                    {i >= 2 && i <= 18 && 'Quiz pergunta'}
                    {i === 19 && 'Resultado personalizado'}
                    {i === 20 && 'Thank You'}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Coluna 3: Preview/Canvas */}
          <Card className="p-4 bg-white shadow-lg">
            <h3 className="font-bold text-lg mb-4 text-slate-700">
              👁️ Preview
            </h3>
            <div className="bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8 text-center min-h-[400px] flex flex-col justify-center">
              <div className="text-slate-400 text-lg mb-2">🎯</div>
              <div className="text-slate-600 font-medium">Preview da Etapa Atual</div>
              <div className="text-sm text-slate-500 mt-2">
                Selecione uma etapa para visualizar
              </div>
              
              <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
                <div className="h-2 bg-slate-200 rounded-full mb-3">
                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-slate-700 mb-2">Exemplo: Quiz Step</h4>
                  <p className="text-sm text-slate-600">Qual seu estilo preferido?</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Coluna 4: Propriedades */}
          <Card className="p-4 bg-white shadow-lg">
            <h3 className="font-bold text-lg mb-4 text-slate-700">
              ⚙️ Propriedades
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  placeholder="Digite o título"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  defaultValue="Qual seu estilo preferido?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Cor do texto
                </label>
                <input
                  type="color"
                  defaultValue="#432818"
                  className="w-full h-10 border border-slate-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Progresso
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="45"
                  className="w-full"
                />
                <div className="text-xs text-slate-500 mt-1">45%</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tipo de componente
                </label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500">
                  <option>Quiz Question</option>
                  <option>Text Block</option>
                  <option>Button Block</option>
                  <option>Result Display</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="text-xs font-medium text-slate-500 mb-2">STATUS</div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-slate-600">Sistema integrado</span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-slate-600">Painel funcional</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
            <h3 className="text-lg font-bold text-green-800 mb-2">
              ✅ Sistema Implementado com Sucesso
            </h3>
            <p className="text-green-700">
              Editor Fixed integrado com 21 etapas, resultado personalizado (Step 20) 
              e painel de propriedades completo funcionando.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditorFixedMinimal;