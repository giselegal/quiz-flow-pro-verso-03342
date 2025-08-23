import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
      <div className="min-h-screen bg-gradient-to-br from-brand-light/20 via-background to-brand-primary/10 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-brand-primary to-brand-dark rounded-lg animate-pulse"></div>
          <span className="text-xl font-semibold text-brand-text">QuizFlow Pro</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light/20 via-background to-brand-primary/10">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-brand-light/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-brand-primary to-brand-dark rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-brand-text">QuizFlow Pro</h1>
                <p className="text-xs text-brand-text/70 -mt-1">Interactive Marketing</p>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-brand-light/20 rounded-lg">
                    <div className="w-6 h-6 bg-gradient-to-r from-brand-primary to-brand-dark rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-white">
                        {user.name?.charAt(0) || user.email.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-brand-text">
                      {user.name || user.email}
                    </span>
                  </div>
                  <Button
                    onClick={() => navigate('/admin')}
                    className="bg-gradient-to-r from-brand-primary to-brand-dark hover:from-brand-dark hover:to-brand-primary text-white shadow-lg"
                  >
                    Dashboard
                  </Button>
                  <Button
                    onClick={() => navigate('/editor')}
                    variant="outline"
                    className="border-brand-primary text-brand-primary hover:bg-brand-primary/10"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Quiz Editor
                  </Button>
                  <Button
                    onClick={logout}
                    variant="outline"
                    className="border-brand-light text-brand-text hover:bg-brand-light/10"
                  >
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => navigate('/auth')}
                    variant="outline"
                    className="border-brand-light text-brand-text hover:bg-brand-light/10"
                  >
                    Entrar
                  </Button>
                  <Button
                    onClick={() => navigate('/auth')}
                    className="bg-gradient-to-r from-brand-primary to-brand-dark hover:from-brand-dark hover:to-brand-primary text-white shadow-lg"
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
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 to-brand-dark/5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge className="mb-6 bg-brand-light/40 text-brand-text border-0 px-4 py-2">
                <Sparkles className="h-4 w-4 mr-2" />
                Plataforma de Marketing Interativo
              </Badge>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-text mb-6 leading-tight">
                Transforme Visitantes em
                <span className="bg-gradient-to-r from-brand-primary to-brand-dark bg-clip-text text-transparent block">
                  Clientes Engajados
                </span>
              </h2>

              <p className="text-xl text-brand-text/80 mb-8 max-w-3xl mx-auto leading-relaxed">
                Crie quizzes interativos, funnels de conversão e experiências personalizadas que
                capturam leads qualificados e aumentam suas vendas.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Button
                  onClick={() => navigate(user ? '/admin' : '/auth')}
                  size="lg"
                  className="bg-gradient-to-r from-brand-primary to-brand-dark hover:from-brand-dark hover:to-brand-primary text-white shadow-xl px-8 py-4 text-lg"
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
                      className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-700 hover:to-emerald-500 text-white shadow-xl px-8 py-4 text-lg"
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      Editor Unificado
                      <Badge className="ml-2 bg-yellow-400 text-yellow-900 text-xs">NOVO</Badge>
                    </Button>

                    <Button
                      onClick={() => navigate('/showcase')}
                      size="lg"
                      className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-700 hover:to-purple-500 text-white shadow-xl px-8 py-4 text-lg"
                    >
                      🎪 Showcase
                      <Badge className="ml-2 bg-orange-400 text-orange-900 text-xs">
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
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-brand-text/70">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>+10.000 empresas confiam</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>+300% aumento em conversões</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>LGPD Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Métricas */}
        <section className="py-16 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-brand-primary to-brand-dark rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-brand-text mb-2">85%</h3>
                <p className="text-brand-text/80">Taxa de Conversão Média</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-brand-light to-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MousePointer className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-brand-text mb-2">12x</h3>
                <p className="text-brand-text/80">Mais Engajamento</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-brand-dark to-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Rocket className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-brand-text mb-2">5min</h3>
                <p className="text-brand-text/80">Para Criar seu Primeiro Quiz</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl lg:text-4xl font-bold text-brand-text mb-4">
                Tudo que você precisa para
                <span className="bg-gradient-to-r from-brand-primary to-brand-dark bg-clip-text text-transparent">
                  {' '}
                  converter mais
                </span>
              </h3>
              <p className="text-xl text-brand-text/80 max-w-2xl mx-auto">
                Ferramentas poderosas e intuitivas para criar experiências que seus clientes vão
                amar
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <article className="bg-white rounded-2xl p-8 shadow-lg border border-brand-light/30 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-r from-brand-primary to-brand-dark rounded-xl flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-brand-text mb-3">Criação Rápida</h4>
                <p className="text-brand-text/80 leading-relaxed">
                  Crie quizzes profissionais em minutos com nossos templates inteligentes e editor
                  visual.
                </p>
              </article>

              {/* Feature 2 */}
              <article className="bg-white rounded-2xl p-8 shadow-lg border border-brand-light/30 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-r from-brand-light to-brand-primary rounded-xl flex items-center justify-center mb-6">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-brand-text mb-3">
                  Segmentação Inteligente
                </h4>
                <p className="text-brand-text/80 leading-relaxed">
                  Qualifique leads automaticamente e direcione ofertas personalizadas baseadas nas
                  respostas.
                </p>
              </article>

              {/* Feature 3 */}
              <article className="bg-white rounded-2xl p-8 shadow-lg border border-brand-light/30 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-r from-brand-dark to-brand-primary rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-brand-text mb-3">Analytics Avançado</h4>
                <p className="text-brand-text/80 leading-relaxed">
                  Acompanhe métricas detalhadas e otimize suas campanhas com insights em tempo real.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-gradient-to-r from-brand-primary to-brand-dark">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h4 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Pronto para transformar seu marketing?
            </h4>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de empresas que já aumentaram suas conversões com nossa
              plataforma.
            </p>
            <Button
              onClick={() => navigate(user ? '/admin' : '/auth')}
              size="lg"
              className="bg-white text-brand-text hover:bg-brand-light/20 shadow-xl px-8 py-4 text-lg font-semibold"
            >
              <Rocket className="h-5 w-5 mr-2" />
              {user ? 'Acessar Dashboard' : 'Começar Gratuitamente'}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-brand-text text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-brand-primary to-brand-dark rounded-lg flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold">QuizFlow Pro</span>
            </div>

            <nav className="flex items-center space-x-6 text-sm text-white/80">
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

          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/80">
            <p>&copy; 2025 QuizFlow Pro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
