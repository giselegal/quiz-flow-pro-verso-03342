import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, Sparkles } from 'lucide-react';

/**
 * 🎯 UnifiedSystemSection - Seção para destacar o sistema unificado
 * 
 * Esta seção deve ser adicionada à página Home para promover as
 * novas rotas do sistema unificado.
 */
const UnifiedSystemSection: React.FC = () => {
  const navigate = (path: string) => {
    window.location.href = path;
  };

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-800 mb-4">
            NOVO SISTEMA
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-indigo-900 mb-4">
            Conheça o <span className="text-indigo-600">Sistema Unificado</span>
          </h2>
          <p className="text-xl text-indigo-700/80 max-w-2xl mx-auto">
            Uma nova arquitetura de editor e quiz com performance otimizada e experiência melhorada
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Editor Unificado */}
          <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow bg-white overflow-hidden border-indigo-100 relative">
            <div className="absolute top-0 right-0">
              <Badge className="m-2 bg-yellow-100 text-yellow-800 border border-yellow-200">
                NOVO
              </Badge>
            </div>
            <div className="h-12 w-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-indigo-800 mb-3">Editor Unificado</h3>
            <p className="text-indigo-700/70 mb-6">
              Experimente o novo editor consolidado com sistema modular, auto-save e drag & drop.
            </p>
            <Button 
              onClick={() => navigate('/editor')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Abrir Editor
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>

          {/* Quiz Unificado */}
          <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow bg-white overflow-hidden border-indigo-100 relative">
            <div className="absolute top-0 right-0">
              <Badge className="m-2 bg-green-100 text-green-800 border border-green-200">
                RECOMENDADO
              </Badge>
            </div>
            <div className="h-12 w-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-indigo-800 mb-3">Quiz Unificado</h3>
            <p className="text-indigo-700/70 mb-6">
              Quiz integrado com engine unificada, 21 etapas e cálculos de perfil de personalidade.
            </p>
            <Button 
              onClick={() => navigate('/quiz-unified')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Iniciar Quiz
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>

          {/* Testes e Demos */}
          <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow bg-white overflow-hidden border-indigo-100">
            <div className="h-12 w-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
              <span className="text-2xl">🧪</span>
            </div>
            <h3 className="text-xl font-semibold text-indigo-800 mb-3">Ambiente de Testes</h3>
            <p className="text-indigo-700/70 mb-6">
              Testes do sistema unificado com ambiente controlado e logs de desenvolvimento.
            </p>
            <Button 
              onClick={() => navigate('/test-unified')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Abrir Ambiente de Testes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <p className="text-indigo-700/80 mb-6 max-w-2xl mx-auto">
            O sistema unificado oferece uma experiência consistente, performance otimizada
            e integração simplificada com todo o ecossistema.
          </p>
          <Button
            onClick={() => navigate('/editor')}
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg font-semibold"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Explorar Sistema Unificado
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UnifiedSystemSection;
