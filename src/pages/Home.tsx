import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import QuizFlowLogo from '@/components/ui/QuizFlowLogo';
import TechBackground from '@/components/ui/TechBackground';
import { useAuth } from '@/context/AuthContext';
import {
  ArrowRight,
  Eye,
  MousePointer,
  Play,
  Rocket,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = (path: string) => {
    window.location.href = path;
  };
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // SEO básico
  useEffect(() => {
    document.title = 'QuizFlow Pro – Quizzes elegantes que convertem';
    const ensureTag = <T extends HTMLElement>(selector: string, create: () => T): T => {
      const found = document.querySelector(selector) as T | null;
      if (found) return found;
      const el = create();
      document.head.appendChild(el);
      return el;
    };

    const metaDesc = ensureTag<HTMLMetaElement>('meta[name="description"]', () =>
      Object.assign(document.createElement('meta'), { name: 'description' })
    );
    metaDesc.setAttribute(
      'content',
      'QuizFlow Pro: quizzes interativos com design elegante e moderno para captar leads e aumentar conversões.'
    );

    const linkCanonical = ensureTag<HTMLLinkElement>('link[rel="canonical"]', () =>
      Object.assign(document.createElement('link'), { rel: 'canonical' })
    );
    linkCanonical.setAttribute('href', `${window.location.origin}/`);
  }, []);

  if (isLoading) {
    return (
      <TechBackground variant="minimal" className="min-h-screen flex items-center justify-center">
        <QuizFlowLogo size="lg" variant="full" className="animate-pulse" />
      </TechBackground>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-brand-light/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <QuizFlowLogo size="sm" variant="full" />

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-brand-lightBlue/20 rounded-lg">
                    <div className="w-6 h-6 bg-gradient-to-r from-brand-brightBlue to-brand-brightPink rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-white">
                        {user.name?.charAt(0) || user.email.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-brand-darkBlue">
                      {user.name || user.email}
                    </span>
                  </div>
                  <Button
                    onClick={() => navigate('/admin')}
                    className="bg-gradient-to-r from-brand-brightBlue to-brand-brightPink hover:from-brand-brightPink hover:to-brand-brightBlue text-white shadow-lg"
                  >
                    Dashboard
                  </Button>
                  <Button
                    onClick={() => navigate('/editor')}
                    variant="outline"
                    className="border-brand-brightBlue text-brand-brightBlue hover:bg-brand-brightBlue/10"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Quiz Editor
                  </Button>
                  <Button
                    onClick={logout}
                    variant="outline"
                    className="border-brand-lightBlue text-brand-darkBlue hover:bg-brand-lightBlue/10"
                  >
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => navigate('/auth')}
                    variant="outline"
                    className="border-brand-lightBlue text-brand-darkBlue hover:bg-brand-lightBlue/10"
                  >
                    Entrar
                  </Button>
                  <Button
                    onClick={() => navigate('/auth')}
                    className="bg-gradient-to-r from-brand-brightBlue to-brand-brightPink hover:from-brand-brightPink hover:to-brand-brightBlue text-white shadow-lg"
                  >
                    Começar Grátis
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <TechBackground variant="hero" className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-8">
                <QuizFlowLogo size="xl" variant="full" className="mx-auto" />
              </div>

              <Badge className="mb-6 bg-brand-lightBlue/40 text-brand-darkBlue border-0 px-4 py-2">
                <Sparkles className="h-4 w-4 mr-2" />
                Plataforma de Marketing Interativo
              </Badge>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                Transforme Visitantes em
                <span className="bg-gradient-to-r from-brand-brightBlue via-white to-brand-brightPink bg-clip-text text-transparent block">
                  Clientes Engajados
                </span>
              </h2>

              <p className="text-xl text-white mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                Crie quizzes interativos, funnels de conversão e experiências personalizadas que
                capturam leads qualificados e aumentam suas vendas.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Button
                  onClick={() => navigate(user ? '/admin' : '/auth')}
                  size="lg"
                  className="bg-gradient-to-r from-brand-brightBlue to-brand-brightPink hover:from-brand-brightPink hover:to-brand-brightBlue text-white shadow-xl px-8 py-4 text-lg"
                >
                  <Play className="h-5 w-5 mr-2" />
                  {user ? 'Ir para Dashboard' : 'Começar Agora'}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>

                {user && (
                  <>
                    <Button
                      onClick={() => navigate('/editor')}
                      size="lg"
                      className="bg-gradient-to-r from-brand-brightBlue to-brand-brightPink hover:from-brand-brightPink hover:to-brand-brightBlue text-white shadow-xl px-8 py-4 text-lg"
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      Editor Unificado
                      <Badge className="ml-2 bg-brand-lightBlue text-brand-darkBlue text-xs">NOVO</Badge>
                    </Button>

                    <Button
                      onClick={() => navigate('/showcase')}
                      size="lg"
                      className="bg-gradient-to-r from-brand-mediumBlue to-brand-lightBlue hover:from-brand-lightBlue hover:to-brand-mediumBlue text-white shadow-xl px-8 py-4 text-lg"
                    >
                      🎪 Showcase
                      <Badge className="ml-2 bg-brand-lightBlue text-brand-darkBlue text-xs">
                        MELHORIAS
                      </Badge>
                    </Button>

                    <Button
                      onClick={() => navigate('/editor')}
                      size="lg"
                      variant="outline"
                      className="border-brand-primary text-brand-primary hover:bg-brand-primary/10 px-8 py-4 text-lg font-semibold"
                    >
                      <Target className="h-5 w-5 mr-2" />
                      Editor Clássico
                    </Button>
                  </>
                )}

                <Button
                  variant="outline"
                  size="lg"
                  className="border-brand-light text-brand-text hover:bg-brand-light/10 px-8 py-4 text-lg"
                >
                  <Eye className="h-5 w-5 mr-2" />
                  Ver Demo
                </Button>
              </div>

              {/* Social Proof */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-white/90">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Users className="h-4 w-4 text-brand-brightBlue" />
                  <span className="font-medium">+10.000 empresas confiam</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <TrendingUp className="h-4 w-4 text-brand-brightPink" />
                  <span className="font-medium">+300% aumento em conversões</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Shield className="h-4 w-4 text-brand-lightBlue" />
                  <span className="font-medium">LGPD Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </TechBackground>

  {/* Métricas */}
  <section className="py-16 bg-gradient-to-r from-white via-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-brand-brightBlue to-brand-lightBlue rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-brand-darkBlue mb-2">85%</h3>
                <p className="text-brand-darkBlue/70 font-medium">Taxa de Conversão Média</p>
              </div>
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-brand-brightPink to-brand-lightBlue rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                  <MousePointer className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-brand-darkBlue mb-2">12x</h3>
                <p className="text-brand-darkBlue/70 font-medium">Mais Engajamento</p>
              </div>
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-brand-lightBlue to-brand-brightBlue rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                  <Rocket className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-brand-darkBlue mb-2">5min</h3>
                <p className="text-brand-darkBlue/70 font-medium">Para Criar seu Primeiro Quiz</p>
              </div>
            </div>
          </div>
  </section>

  {/* Features */}
  <TechBackground variant="section" className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 drop-shadow-lg">
                Tudo que você precisa para
                <span className="bg-gradient-to-r from-brand-brightBlue via-white to-brand-brightPink bg-clip-text text-transparent">
                  {' '}
                  converter mais
                </span>
              </h3>
              <p className="text-xl text-white max-w-2xl mx-auto drop-shadow-md">
                Ferramentas poderosas e intuitivas para criar experiências que seus clientes vão
                amar
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <article className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-r from-brand-brightBlue to-brand-lightBlue rounded-xl flex items-center justify-center mb-6 shadow-md">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-brand-darkBlue mb-3">Criação Rápida</h4>
                <p className="text-brand-darkBlue/80 leading-relaxed">
                  Crie quizzes profissionais em minutos com nossos templates inteligentes e editor
                  visual.
                </p>
              </article>

              {/* Feature 2 */}
              <article className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-r from-brand-brightPink to-brand-lightBlue rounded-xl flex items-center justify-center mb-6 shadow-md">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-brand-darkBlue mb-3">
                  Segmentação Inteligente
                </h4>
                <p className="text-brand-darkBlue/80 leading-relaxed">
                  Qualifique leads automaticamente e direcione ofertas personalizadas baseadas nas
                  respostas.
                </p>
              </article>

              {/* Feature 3 */}
              <article className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-r from-brand-lightBlue to-brand-brightBlue rounded-xl flex items-center justify-center mb-6 shadow-md">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-brand-darkBlue mb-3">Analytics Avançado</h4>
                <p className="text-brand-darkBlue/80 leading-relaxed">
                  Acompanhe métricas detalhadas e otimize suas campanhas com insights em tempo real.
                </p>
              </article>
            </div>
          </div>
  </TechBackground>

        {/* CTA Final */}
        <TechBackground variant="cta" className="py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6 drop-shadow-lg">
              Pronto para{' '}
              <span className="bg-gradient-to-r from-brand-brightBlue via-white to-brand-brightPink bg-clip-text text-transparent">
                revolucionar
              </span>{' '}
              suas vendas?
            </h3>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto drop-shadow-md">
              Junte-se a milhares de empreendedores que já transformaram seus negócios com o
              QuizFlow Pro
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate(user ? '/admin' : '/auth')}
                size="lg"
                className="bg-white/95 backdrop-blur-sm text-brand-darkBlue hover:bg-white hover:text-brand-darkBlue border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-semibold px-8 py-4 text-lg"
              >
                <Rocket className="h-5 w-5 mr-2" />
                {user ? 'Acessar Dashboard' : 'Começar Gratuitamente'}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/80 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm transition-all duration-300 font-medium px-8 py-4 text-lg"
              >
                Ver Demonstração
                <Play className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </TechBackground>
      </main>

      {/* Footer */}
      <footer className="bg-brand-darkBlue py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <QuizFlowLogo size="sm" variant="full" className="text-white" />
            </div>

            <nav className="flex items-center space-x-6 text-sm text-white/90">
              <a href="#" className="hover:text-white transition-colors">
                Privacidade
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Termos
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Suporte
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Blog
              </a>
            </nav>
          </div>

          <div className="border-t border-brand-lightBlue/20 mt-8 pt-8 text-center text-sm text-white/70">
            <p>&copy; 2025 QuizFlow Pro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
