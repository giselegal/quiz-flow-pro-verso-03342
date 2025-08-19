import { LogoutButton } from '@/components/auth/LogoutButton';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, BarChart3, Layout, Target, TrendingUp, Users } from 'lucide-react';
import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import QuizFlowProLogo from '@/components/ui/QuizFlowProLogo';

const Home: React.FC = () => {
  const [, setLocation] = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Redirecionar para auth se não estiver logado
    if (!loading && !user) {
      setLocation('/auth');
    }
  }, [user, loading, setLocation]);

  const handleStartQuiz = () => {
    setLocation('/editor-fixed');
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#FEFEFE' }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent mx-auto"
            style={{ borderColor: '#B89B7A' }}
          ></div>
          <p className="mt-4 font-medium" style={{ color: '#6B4F43' }}>
            Carregando...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Será redirecionado
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEFEFE' }}>
      {/* Header minimalista */}
      <header
        className="border-b px-6 py-4"
        style={{ borderColor: '#E5DDD5', backgroundColor: '#FEFEFE' }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <QuizFlowProLogo size="md" variant="icon" />
            <div>
              <h1 className="text-xl font-bold" style={{ color: '#432818' }}>
                QuizFlow Pro
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm" style={{ color: '#6B4F43' }}>
              <Users className="h-4 w-4" />
              <span>
                Olá, <span className="font-medium">{user?.name || user?.email}</span>
              </span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Hero Section Clean */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Título principal */}
          <div className="space-y-6">
            <h1
              className="text-5xl sm:text-6xl font-bold tracking-tight"
              style={{ color: '#432818' }}
            >
              Quiz<span style={{ color: '#B89B7A' }}>Flow</span> <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 bg-clip-text text-transparent">Pro</span>
            </h1>

            <p
              className="text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed"
              style={{ color: '#6B4F43' }}
            >
              A plataforma definitiva para criar funis inteligentes e maximizar conversões através
              de quizzes interativos.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              size="lg"
              onClick={handleStartQuiz}
              className="text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg font-semibold"
              style={{ backgroundColor: '#B89B7A' }}
            >
              <Layout className="h-5 w-5 mr-2" />
              Criar Meu Quiz
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => setLocation('/admin/funis')}
              className="px-8 py-4 text-lg font-semibold transition-all duration-300"
              style={{
                borderColor: '#E5DDD5',
                color: '#6B4F43',
                backgroundColor: 'transparent',
              }}
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              Ver Dashboard
            </Button>
          </div>

          {/* Métricas simples */}
          <div className="grid grid-cols-3 gap-8 pt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#432818' }}>
                98%
              </div>
              <div className="text-sm font-medium" style={{ color: '#6B4F43' }}>
                Taxa de Engajamento
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#432818' }}>
                3.2x
              </div>
              <div className="text-sm font-medium" style={{ color: '#6B4F43' }}>
                Aumento em Conversões
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#432818' }}>
                24h
              </div>
              <div className="text-sm font-medium" style={{ color: '#6B4F43' }}>
                Setup Completo
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section Minimalista */}
      <div className="py-20" style={{ backgroundColor: '#FAF9F7' }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#432818' }}>
              Por que QuizFlow Pro é diferente?
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#6B4F43' }}>
              Nossa plataforma combina simplicidade visual com poder técnico para criar experiências
              únicas
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div
              className="p-8 rounded-xl border transition-all duration-300 hover:shadow-lg"
              style={{
                borderColor: '#E5DDD5',
                backgroundColor: '#FEFEFE',
              }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: '#B89B7A' }}
              >
                <Layout className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4" style={{ color: '#432818' }}>
                Interface Intuitiva
              </h3>
              <p className="text-center leading-relaxed" style={{ color: '#6B4F43' }}>
                Editor visual drag & drop com templates profissionais. Crie quizzes sofisticados sem
                conhecimento técnico.
              </p>
            </div>

            {/* Feature 2 */}
            <div
              className="p-8 rounded-xl border transition-all duration-300 hover:shadow-lg"
              style={{
                borderColor: '#E5DDD5',
                backgroundColor: '#FEFEFE',
              }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: '#B89B7A' }}
              >
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4" style={{ color: '#432818' }}>
                Funis Inteligentes
              </h3>
              <p className="text-center leading-relaxed" style={{ color: '#6B4F43' }}>
                Lógica avançada de segmentação que qualifica leads automaticamente e direciona para
                ofertas personalizadas.
              </p>
            </div>

            {/* Feature 3 */}
            <div
              className="p-8 rounded-xl border transition-all duration-300 hover:shadow-lg"
              style={{
                borderColor: '#E5DDD5',
                backgroundColor: '#FEFEFE',
              }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: '#B89B7A' }}
              >
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4" style={{ color: '#432818' }}>
                Analytics Avançado
              </h3>
              <p className="text-center leading-relaxed" style={{ color: '#6B4F43' }}>
                Dashboards em tempo real com insights acionáveis sobre performance, conversões e ROI
                dos seus funis.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Final Minimalista */}
      <div className="py-20" style={{ backgroundColor: '#432818' }}>
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
              Pronto para revolucionar suas conversões?
            </h2>
            <p className="text-xl mb-8 leading-relaxed" style={{ color: '#FAF9F7' }}>
              Junte-se a milhares de empresas que já simplificaram seus funis e aumentaram suas
              vendas com QuizFlow Pro.
            </p>
            <Button
              size="lg"
              onClick={handleStartQuiz}
              className="shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg font-semibold"
              style={{
                backgroundColor: '#B89B7A',
                color: 'white',
              }}
            >
              Começar Gratuitamente
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
