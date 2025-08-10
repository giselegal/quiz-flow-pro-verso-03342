import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { useAuth } from "@/context/AuthContext";
import { 
  ArrowRight, 
  BarChart3, 
  Zap, 
  Target, 
  Users, 
  TrendingUp,
  Sparkles,
  Layout,
  MousePointer,
  Heart
} from "lucide-react";

const Home: React.FC = () => {
  const [, setLocation] = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Redirecionar para auth se não estiver logado
    if (!loading && !user) {
      setLocation("/auth");
    }
  }, [user, loading, setLocation]);

  const handleStartQuiz = () => {
    setLocation("/editor-fixed");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Sparkles className="h-4 w-4 text-indigo-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-slate-600 font-medium">Preparando sua experiência...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Será redirecionado
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20">
      {/* Header sofisticado */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  QuizFlow
                </h1>
                <p className="text-xs text-slate-500 font-medium">Simplifique • Interaja • Converta</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
                <Users className="h-4 w-4" />
                <span>Olá, <span className="font-semibold text-slate-800">{user?.name || user?.email}</span></span>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Elementos decorativos de fundo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Título principal */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/50 rounded-full text-sm font-medium text-indigo-700">
                <Sparkles className="h-4 w-4" />
                <span>Revolucione sua estratégia de conversão</span>
              </div>
              
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-800 bg-clip-text text-transparent">
                  Quiz
                </span>
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Flow
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                A plataforma definitiva para criar <span className="font-semibold text-indigo-600">funis inteligentes</span>, 
                aumentar <span className="font-semibold text-purple-600">engajamento</span> e 
                maximizar <span className="font-semibold text-indigo-600">conversões</span> através de quizzes interativos.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button 
                size="lg" 
                onClick={handleStartQuiz}
                className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg font-semibold"
              >
                <Layout className="h-5 w-5 mr-2" />
                Criar Meu Quiz
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => setLocation("/admin/funis")}
                className="border-slate-300 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 px-8 py-4 text-lg font-semibold transition-all duration-300"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                Ver Dashboard
              </Button>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-800">98%</div>
                <div className="text-sm text-slate-600 font-medium">Taxa de Engajamento</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-800">3.2x</div>
                <div className="text-sm text-slate-600 font-medium">Aumento em Conversões</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-800">24h</div>
                <div className="text-sm text-slate-600 font-medium">Setup Completo</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              Por que QuizFlow é diferente?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Nossa plataforma combina simplicidade visual com poder técnico para criar experiências únicas
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl border border-slate-200 hover:border-indigo-300 bg-gradient-to-br from-white to-slate-50 hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MousePointer className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 text-center mb-4">
                Interface Intuitiva
              </h3>
              <p className="text-slate-600 text-center leading-relaxed">
                Editor visual drag & drop com templates profissionais. Crie quizzes sofisticados sem conhecimento técnico.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl border border-slate-200 hover:border-indigo-300 bg-gradient-to-br from-white to-slate-50 hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 text-center mb-4">
                Funis Inteligentes
              </h3>
              <p className="text-slate-600 text-center leading-relaxed">
                Lógica avançada de segmentação que qualifica leads automaticamente e direciona para ofertas personalizadas.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl border border-slate-200 hover:border-indigo-300 bg-gradient-to-br from-white to-slate-50 hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 text-center mb-4">
                Analytics Avançado
              </h3>
              <p className="text-slate-600 text-center leading-relaxed">
                Dashboards em tempo real com insights acionáveis sobre performance, conversões e ROI dos seus funis.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Pronto para revolucionar suas conversões?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
              Junte-se a milhares de empresas que já simplificaram seus funis e aumentaram suas vendas com QuizFlow.
            </p>
            <Button 
              size="lg"
              onClick={handleStartQuiz}
              className="bg-white text-indigo-600 hover:bg-slate-50 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg font-semibold group"
            >
              <Heart className="h-5 w-5 mr-2 text-red-500" />
              Começar Gratuitamente
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
