/**
 * ⚠️ ⚠️ ⚠️ DEPRECATED - NÃO USAR ⚠️ ⚠️ ⚠️
 * @deprecated Use QuizModularProductionEditor - Ver MIGRATION_EDITOR.md
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Palette, Type, Eye, Settings, ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { safeLocalStorage } from '@/utils/safeLocalStorage';
import { Link } from 'wouter';

interface EditorConfig {
  cores: {
    primaria: string;
    secundaria: string;
    fundo: string;
    texto: string;
    destaque: string;
  };
  texto: {
    titulo: string;
    subtitulo: string;
    descricao: string;
    botao: string;
    introducao: string;
  };
  layout: {
    espacamento: number;
    larguraMaxima: string;
    alinhamento: 'left' | 'center' | 'right';
  };
}

const SimpleEditor: React.FC = () => {
  // 🚨 Console warning para desenvolvedores
  console.warn(
    '⚠️ DEPRECATED: SimpleEditor será removido em 01/nov/2025. ' +
    'Migre para QuizModularProductionEditor. Ver MIGRATION_EDITOR.md'
  );

  const [config, setConfig] = useState<EditorConfig>({
    cores: {
      primaria: '#B89B7A',
      secundaria: '#aa6b5d',
      fundo: '#fffaf7',
      texto: '#432818',
      destaque: '#D4A574',
    },
    texto: {
      titulo: 'Descubra Seu Estilo Único',
      subtitulo: 'Guia Personalizado de Estilo',
      descricao: 'Transforme sua imagem com confiança e autenticidade.',
      botao: 'Começar Quiz',
      introducao: 'Um quiz personalizado para descobrir o seu estilo único',
    },
    layout: {
      espacamento: 2,
      larguraMaxima: 'max-w-4xl',
      alinhamento: 'center',
    },
  });

  const [modoPreview, setModoPreview] = useState(false);

  const salvar = () => {
    safeLocalStorage.setItem('simpleEditorConfig', JSON.stringify(config));
    toast({
      title: 'Salvo!',
      description: 'Configurações foram salvas com sucesso.',
    });
  };

  const atualizarCor = (chave: string, valor: string) => {
    setConfig(prev => ({
      ...prev,
      cores: { ...prev.cores, [chave]: valor },
    }));
  };

  const atualizarTexto = (chave: string, valor: string) => {
    setConfig(prev => ({
      ...prev,
      texto: { ...prev.texto, [chave]: valor },
    }));
  };

  const atualizarLayout = (chave: string, valor: any) => {
    setConfig(prev => ({
      ...prev,
      layout: { ...prev.layout, [chave]: valor },
    }));
  };

  const ComponentePreview = () => (
    <div
      className={`min-h-screen ${config.layout.larguraMaxima} mx-auto px-4 py-${config.layout.espacamento * 4
        }`}
      style={{
        backgroundColor: config.cores.fundo,
        color: config.cores.texto,
      }}
    >
      <div className={`text-${config.layout.alinhamento}`}>
        <h1
          className="text-5xl font-bold mb-6"
          style={{
            background: `linear-gradient(135deg, ${config.cores.primaria}, ${config.cores.secundaria})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {config.texto.titulo}
        </h1>

        <h2 className="text-2xl font-semibold mb-4" style={{ color: config.cores.destaque }}>
          {config.texto.subtitulo}
        </h2>

        <p className="text-lg mb-6 opacity-90">{config.texto.introducao}</p>

        <p className="text-base mb-8 leading-relaxed">{config.texto.descricao}</p>

        <button
          className="px-8 py-4 rounded-lg text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${config.cores.primaria}, ${config.cores.secundaria})`,
          }}
        >
          {config.texto.botao}
        </button>

        {/* Exemplo de cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-md"
              style={{ borderTop: `4px solid ${config.cores.primaria}` }}
            >
              <h3 className="text-xl font-semibold mb-3" style={{ color: config.cores.primaria }}>
                Recurso {i}
              </h3>
              <p style={{ color: '#6B4F43' }}>
                Descrição do recurso que demonstra como o editor simples pode criar layouts
                elegantes.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (modoPreview) {
    return (
      <div className="min-h-screen">
        <div className="bg-white border-b p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setModoPreview(false)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Editor
            </Button>
            <h1 className="text-xl font-semibold">Preview - Simple Editor</h1>
          </div>
          <Button onClick={salvar}>
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
        <ComponentePreview />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FAF9F7' }}>
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-[#B89B7A] hover:text-[#A38A69]">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 style={{ color: '#432818' }}>Simple Editor</h1>
            <span style={{ backgroundColor: '#E5DDD5' }}>Modo Simples</span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setModoPreview(true)}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button onClick={salvar}>
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Painel de Edição */}
          <div className="xl:col-span-1 space-y-6">
            {/* Cores */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Palette className="h-5 w-5 mr-2 text-[#B89B7A]" />
                <h2 className="text-xl font-semibold">Cores</h2>
              </div>

              <div className="space-y-4">
                {Object.entries(config.cores).map(([chave, valor]) => (
                  <div key={chave}>
                    <Label className="capitalize">{chave.replace(/([A-Z])/g, ' $1')}</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="color"
                        value={valor}
                        onChange={e => atualizarCor(chave, e.target.value)}
                        className="w-16"
                      />
                      <Input
                        type="text"
                        value={valor}
                        onChange={e => atualizarCor(chave, e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Textos */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Type className="h-5 w-5 mr-2 text-green-600" />
                <h2 className="text-xl font-semibold">Textos</h2>
              </div>

              <div className="space-y-4">
                {Object.entries(config.texto).map(([chave, valor]) => (
                  <div key={chave}>
                    <Label className="capitalize">{chave.replace(/([A-Z])/g, ' $1')}</Label>
                    {chave === 'descricao' || chave === 'introducao' ? (
                      <Textarea
                        value={valor}
                        onChange={e => atualizarTexto(chave, e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                    ) : (
                      <Input
                        value={valor}
                        onChange={e => atualizarTexto(chave, e.target.value)}
                        className="mt-1"
                      />
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Layout */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Settings className="h-5 w-5 mr-2 text-[#B89B7A]" />
                <h2 className="text-xl font-semibold">Layout</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Espaçamento: {config.layout.espacamento}</Label>
                  <Input
                    type="range"
                    min="1"
                    max="8"
                    value={config.layout.espacamento}
                    onChange={e => atualizarLayout('espacamento', Number(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Largura Máxima</Label>
                  <select
                    value={config.layout.larguraMaxima}
                    onChange={e => atualizarLayout('larguraMaxima', e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="max-w-2xl">Pequena (2xl)</option>
                    <option value="max-w-4xl">Média (4xl)</option>
                    <option value="max-w-6xl">Grande (6xl)</option>
                    <option value="max-w-7xl">Muito Grande (7xl)</option>
                  </select>
                </div>

                <div>
                  <Label>Alinhamento</Label>
                  <select
                    value={config.layout.alinhamento}
                    onChange={e => atualizarLayout('alinhamento', e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="left">Esquerda</option>
                    <option value="center">Centro</option>
                    <option value="right">Direita</option>
                  </select>
                </div>
              </div>
            </Card>
          </div>

          {/* Preview */}
          <div className="xl:col-span-2">
            <Card className="h-full">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Preview em Tempo Real</h3>
              </div>
              <div style={{ backgroundColor: '#E5DDD5' }}>
                <ComponentePreview />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleEditor;
