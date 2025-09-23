import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import QuizFlowLogo from '@/components/ui/QuizFlowLogo';
import TechBackground from '@/components/ui/TechBackground';
import { LoadingFallback } from '@/components/ui/loading-fallback';
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
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
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
    return <LoadingFallback message="Carregando QuizFlow..." />;
  }

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Header */}
      <header className="sticky top-0 z-50 glass backdrop-blur-xl border-b border-brand-lightBlue/20 animate-slide-in-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo com animação */}
            <div className="animate-slide-in-left">
              <QuizFlowLogo size="sm" variant="full" />
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4 animate-slide-in-right">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-2 glass rounded-lg hover-lift">
                    <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center transform-gpu hover-scale">
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
                    className="btn-primary transform-gpu"
                  >
                    Dashboard
                  </Button>
                  <Button
                    onClick={() => navigate('/templates')}
                    variant="outline"
                    className="btn-outline hover-lift"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Criar Funil
                  </Button>
                  <Button
                    onClick={logout}
                    variant="outline"
                    className="border-brand-lightBlue text-brand-darkBlue hover:bg-brand-lightBlue/10 hover-lift"
                  >
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => navigate('/auth')}
                    variant="outline"
                    className="btn-outline hover-lift"
                  >
                    Entrar
                  </Button>
                  <Button
                    onClick={() => navigate('/auth')}
                    className="btn-primary transform-gpu shadow-glow"
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
        {/* Hero Section Melhorado */}
        <TechBackground variant="hero" className="py-20 lg:py-32 relative overflow-hidden">
          {/* Elementos decorativos de fundo */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-20 h-20 gradient-primary rounded-full blur-xl animate-float"></div>
            <div className="absolute top-32 right-20 w-32 h-32 gradient-tech rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-20 left-1/4 w-24 h-24 gradient-hero rounded-full blur-xl animate-bounce"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center">
              <div className="mb-8 animate-scale-in">
                <QuizFlowLogo size="xl" variant="full" className="mx-auto hover-scale transform-gpu" />
              </div>

              <Badge className="mb-6 badge-primary animate-slide-in-up hover-lift">
                <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                Plataforma de Marketing Interativo
              </Badge>

              <h1 className="hero-title animate-slide-in-up">
                Transforme Visitantes em
                <span className="hero-gradient-text animate-pulse">
                  Clientes Engajados
                </span>
              </h1>

              <p className="hero-subtitle animate-slide-in-up">
                Crie quizzes interativos, funnels de conversão e experiências personalizadas que
                capturam leads qualificados e <strong>aumentam suas vendas em até 300%</strong>.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12 animate-slide-in-up">
                <Button
                  onClick={() => navigate(user ? '/admin' : '/auth')}
                  size="lg"
                  className="btn-primary transform-gpu shadow-glow animate-enhanced-pulse px-8 py-6 text-lg font-bold"
                >
                  <Play className="h-6 w-6 mr-3" />
                  {user ? 'Ir para Dashboard' : 'Começar Agora'}
                  <ArrowRight className="h-6 w-6 ml-3" />
                </Button>

                {user && (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={() => navigate('/templates')}
                      size="lg"
                      className="btn-primary transform-gpu shadow-brand px-8 py-6 text-lg"
                    >
                      <Sparkles className="h-5 w-5 mr-3" />
                      Criar Funil
                      <Badge className="ml-3 badge-success text-xs">NOVO</Badge>
                    </Button>

                    <Button
                      onClick={() => navigate('/templates')}
                      size="lg"
                      variant="outline"
                      className="btn-outline hover-lift px-8 py-6 text-lg font-semibold glass"
                    >
                      <Target className="h-5 w-5 mr-3" />
                      Templates
                    </Button>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="lg"
                  className="glass border-white/50 text-white hover:bg-white/20 hover-lift px-8 py-6 text-lg"
                >
                  <Eye className="h-5 w-5 mr-3" />
                  Ver Demo
                </Button>
              </div>

              {/* Social Proof Melhorado */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm animate-slide-in-up">
                <div className="social-proof-badge hover-lift">
                  <Users className="h-5 w-5 text-brand-brightBlue" />
                  <span className="font-semibold">+10.000 empresas confiam</span>
                </div>
                <div className="social-proof-badge hover-lift">
                  <TrendingUp className="h-5 w-5 text-brand-brightPink" />
                  <span className="font-semibold">+300% aumento em conversões</span>
                </div>
                <div className="social-proof-badge hover-lift">
                  <Shield className="h-5 w-5 text-brand-lightBlue" />
                  <span className="font-semibold">LGPD Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </TechBackground>

        {/* Métricas Melhoradas */}
        <section className="py-20 gradient-subtle">
          <div className="section-container">
            <div className="content-center mb-16">
              <h2 className="hero-title text-brand-darkBlue">
                Resultados que <span className="hero-gradient-text">impressionam</span>
              </h2>
              <p className="hero-subtitle text-brand-darkBlue/80">
                Veja o impacto real que nossa plataforma gera para nossos clientes
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="metric-card hover-lift animate-slide-in-up">
                <div className="metric-icon">
                  <Target className="h-8 w-8" />
                </div>
                <h3 className="metric-value">85%</h3>
                <p className="metric-label">Taxa de Conversão Média</p>
              </div>
              <div className="metric-card hover-lift animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="metric-icon gradient-primary">
                  <MousePointer className="h-8 w-8" />
                </div>
                <h3 className="metric-value">12x</h3>
                <p className="metric-label">Mais Engajamento</p>
              </div>
              <div className="metric-card hover-lift animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="metric-icon gradient-tech">
                  <Rocket className="h-8 w-8" />
                </div>
                <h3 className="metric-value">5min</h3>
                <p className="metric-label">Para Criar seu Primeiro Quiz</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Melhorado */}
        <TechBackground variant="section" className="py-20 lg:py-32 relative">
          <div className="section-container">
            <div className="content-center mb-16">
              <h3 className="hero-title">
                Tudo que você precisa para
                <span className="hero-gradient-text"> converter mais</span>
              </h3>
              <p className="hero-subtitle">
                Ferramentas poderosas e intuitivas para criar experiências que seus clientes vão
                amar
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <article className="feature-card hover-lift animate-slide-in-up">
                <div className="feature-icon gradient-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <h4 className="feature-title">Criação Rápida</h4>
                <p className="feature-description">
                  Crie quizzes profissionais em minutos com nossos templates inteligentes e editor
                  visual drag & drop.
                </p>
              </article>

              {/* Feature 2 */}
              <article className="feature-card hover-lift animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="feature-icon gradient-tech">
                  <Target className="h-6 w-6" />
                </div>
                <h4 className="feature-title">Segmentação Inteligente</h4>
                <p className="feature-description">
                  Qualifique leads automaticamente e direcione ofertas personalizadas baseadas nas
                  respostas dos usuários.
                </p>
              </article>

              {/* Feature 3 */}
              <article className="feature-card hover-lift animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="feature-icon gradient-hero">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h4 className="feature-title">Analytics Avançado</h4>
                <p className="feature-description">
                  Acompanhe métricas detalhadas e otimize suas campanhas com insights em tempo real
                  e relatórios completos.
                </p>
              </article>
            </div>
          </div>
        </TechBackground>

        {/* Seção de Depoimentos */}
        <section className="py-20 gradient-subtle relative overflow-hidden">
          {/* Elementos decorativos */}
          <div className="absolute top-10 right-10 w-32 h-32 gradient-primary rounded-full opacity-10 blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-24 h-24 gradient-tech rounded-full opacity-10 blur-2xl animate-float"></div>
          
          <div className="section-container">
            <div className="content-center mb-16">
              <h3 className="hero-title text-brand-darkBlue">
                O que nossos <span className="hero-gradient-text">clientes dizem</span>
              </h3>
              <p className="hero-subtitle text-brand-darkBlue/80">
                Transformações reais de negócios que usam nossa plataforma
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Depoimento 1 */}
              <div className="glass-card p-8 rounded-2xl hover-lift animate-slide-in-up transform-gpu">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-lg">M</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-brand-darkBlue">Maria Silva</h5>
                    <p className="text-sm text-brand-darkBlue/70">CEO, E-commerce Fashion</p>
                  </div>
                </div>
                <p className="text-brand-darkBlue/80 italic leading-relaxed mb-4">
                  "Aumentamos nossa conversão de 3% para 28% em apenas 2 meses. 
                  O QuizFlow Pro revolucionou nossa estratégia de vendas online!"
                </p>
                <div className="flex text-yellow-400">
                  {'★'.repeat(5)}
                </div>
              </div>

              {/* Depoimento 2 */}
              <div className="glass-card p-8 rounded-2xl hover-lift animate-slide-in-up transform-gpu" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 gradient-tech rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-lg">J</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-brand-darkBlue">João Santos</h5>
                    <p className="text-sm text-brand-darkBlue/70">Diretor de Marketing</p>
                  </div>
                </div>
                <p className="text-brand-darkBlue/80 italic leading-relaxed mb-4">
                  "Interface intuitiva e resultados incríveis. Criamos 15 funnels 
                  em 1 semana e captamos mais de 5000 leads qualificados."
                </p>
                <div className="flex text-yellow-400">
                  {'★'.repeat(5)}
                </div>
              </div>

              {/* Depoimento 3 */}
              <div className="glass-card p-8 rounded-2xl hover-lift animate-slide-in-up transform-gpu" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 gradient-hero rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-lg">A</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-brand-darkBlue">Ana Costa</h5>
                    <p className="text-sm text-brand-darkBlue/70">Consultora Digital</p>
                  </div>
                </div>
                <p className="text-brand-darkBlue/80 italic leading-relaxed mb-4">
                  "Plataforma perfeita para coaches e consultores. Facilita muito 
                  a qualificação de leads e aumentou minhas vendas em 400%!"
                </p>
                <div className="flex text-yellow-400">
                  {'★'.repeat(5)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de FAQ */}
        <section className="py-20 gradient-tech relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 w-40 h-40 gradient-hero rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-32 h-32 gradient-primary rounded-full blur-2xl animate-float"></div>
          </div>
          
          <div className="section-container relative">
            <div className="content-center mb-16">
              <h3 className="hero-title">
                Perguntas <span className="hero-gradient-text">Frequentes</span>
              </h3>
              <p className="hero-subtitle">
                Tire suas dúvidas sobre nossa plataforma
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {/* FAQ 1 */}
                <div className="glass-card p-6 rounded-2xl hover-lift animate-slide-in-up">
                  <h4 className="text-xl font-semibold text-white mb-3">
                    Como funciona o período de teste gratuito?
                  </h4>
                  <p className="text-white/90 leading-relaxed">
                    Oferecemos 14 dias de teste gratuito com acesso completo a todas as funcionalidades. 
                    Não é necessário cartão de crédito para começar, e você pode cancelar a qualquer momento.
                  </p>
                </div>

                {/* FAQ 2 */}
                <div className="glass-card p-6 rounded-2xl hover-lift animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
                  <h4 className="text-xl font-semibold text-white mb-3">
                    Posso personalizar o design dos meus quizzes?
                  </h4>
                  <p className="text-white/90 leading-relaxed">
                    Sim! Nossa plataforma oferece editor visual completo, templates personalizáveis, 
                    cores da sua marca, logos e total controle sobre o design da experiência.
                  </p>
                </div>

                {/* FAQ 3 */}
                <div className="glass-card p-6 rounded-2xl hover-lift animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                  <h4 className="text-xl font-semibold text-white mb-3">
                    Como são calculadas as conversões?
                  </h4>
                  <p className="text-white/90 leading-relaxed">
                    Medimos desde visualizações até leads capturados e vendas finalizadas. 
                    Nossa analytics mostra funil completo com taxas de conversão por etapa.
                  </p>
                </div>

                {/* FAQ 4 */}
                <div className="glass-card p-6 rounded-2xl hover-lift animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
                  <h4 className="text-xl font-semibold text-white mb-3">
                    Vocês oferecem suporte técnico?
                  </h4>
                  <p className="text-white/90 leading-relaxed">
                    Sim! Temos suporte via chat, email e videochamadas. Nossa equipe está disponível 
                    para ajudar com setup, otimizações e estratégias de conversão.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final Melhorado */}
        <TechBackground variant="section" className="py-20 lg:py-32 relative overflow-hidden">
          {/* Elementos decorativos */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 gradient-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 gradient-tech rounded-full blur-3xl"></div>
          </div>
          
          <div className="content-center relative">
            <h3 className="hero-title animate-slide-in-up">
              Pronto para{' '}
              <span className="hero-gradient-text">revolucionar</span>{' '}
              suas vendas?
            </h3>
            <p className="hero-subtitle animate-slide-in-up">
              Junte-se a <strong>milhares de empreendedores</strong> que já transformaram seus negócios com o
              QuizFlow Pro. <strong>Teste grátis por 14 dias!</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-in-up">
              <Button
                onClick={() => navigate(user ? '/admin' : '/auth')}
                size="lg"
                className="glass-card text-brand-darkBlue hover:bg-white hover:text-brand-darkBlue hover-lift shadow-2xl font-bold px-10 py-6 text-xl transform-gpu"
              >
                <Rocket className="h-6 w-6 mr-3" />
                {user ? 'Acessar Dashboard' : 'Começar Gratuitamente'}
                <ArrowRight className="h-6 w-6 ml-3" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="glass border-white/50 text-white hover:bg-white/20 hover-lift font-semibold px-10 py-6 text-xl"
              >
                Ver Demonstração
                <Play className="ml-3 h-5 w-5" />
              </Button>
            </div>
          </div>
        </TechBackground>
      </main>

      {/* Footer Melhorado */}
      <footer className="gradient-tech py-12 animate-slide-in-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <QuizFlowLogo size="sm" variant="full" className="text-white hover-scale transform-gpu" />
            </div>

            <nav className="flex items-center space-x-8 text-sm text-white/90">
              <a href="#" className="hover:text-white transition-colors hover-lift font-medium">
                Privacidade
              </a>
              <a href="#" className="hover:text-white transition-colors hover-lift font-medium">
                Termos
              </a>
              <a href="#" className="hover:text-white transition-colors hover-lift font-medium">
                Suporte
              </a>
              <a href="#" className="hover:text-white transition-colors hover-lift font-medium">
                Blog
              </a>
            </nav>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p className="text-sm text-white/70">
              &copy; 2025 QuizFlow Pro. Todos os direitos reservados.
            </p>
            <p className="text-xs text-white/60 mt-2">
              Desenvolvido com ❤️ para transformar seu negócio digital
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
