import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sparkles,
  Target,
  Zap,
  BarChart3,
  Users,
  TrendingUp,
  CheckCircle,
  Star,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/contexts';
import { appLogger } from '@/lib/utils/appLogger';

export const Home: React.FC = () => {
  appLogger.info('🏠 Home component rendering...');
  appLogger.info('🏠 Home: Mounting component');

  const { user, logout } = useAuth();
  appLogger.info('🏠 Home: useAuth called, user:', { data: [user ? 'authenticated' : 'not authenticated'] });
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // Navigation helper function
  const navigate = (path: string) => {
    appLogger.info('🔄 Navigating to:', { data: [path] });
    setLocation(path);
  };

  // Simulate loading for smooth animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate testimonials (not needed for now)
  useEffect(() => {
    // Auto-rotate could be implemented here if needed
  }, []);

  // SEO otimizado
  useEffect(() => {
    document.title = '🚀 Quiz Flow Pro Verso | Vista-se de Você! - Gisele Galvão';
    const metaDesc = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    metaDesc.setAttribute('content', 'Descubra seu estilo pessoal único com nosso quiz interativo.');
    if (!document.querySelector('meta[name="description"]')) {
      document.head.appendChild(metaDesc);
    }
  }, []);

  // Stats data
  const stats = useMemo(() => [
    {
      number: '15K+',
      label: 'Quizzes Criados',
      icon: Target,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      number: '94%',
      label: 'Taxa de Conversão',
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      number: '2min',
      label: 'Tempo de Configuração',
      icon: Zap,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ], []);

  const features = useMemo(() => [
    {
      icon: Target,
      title: 'Editor Visual',
      description: 'Interface intuitiva de arrastar e soltar para criar quizzes sem programação',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: BarChart3,
      title: 'Análises Avançadas',
      description: 'Métricas detalhadas de performance e rastreamento de conversão para otimização',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      icon: Users,
      title: 'Captura de Leads',
      description: 'Integração perfeita com CRM e ferramentas de automação de marketing',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      icon: Zap,
      title: 'Templates Prontos',
      description: 'Biblioteca de designs profissionais com templates específicos por setor',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      icon: TrendingUp,
      title: 'Teste A/B',
      description: 'Teste diferentes versões para maximizar engajamento e conversões',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      icon: CheckCircle,
      title: 'Responsivo Mobile',
      description: 'Performance perfeita em todos os dispositivos e tamanhos de tela',
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
  ], []);

  // Simple loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-background via-brand-light to-brand-lightBlue/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-brightBlue border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading QuizFlow...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0b1020]/90 border-b border-transparent shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-brightBlue to-brand-lightBlue rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#3bbef3] to-[#ea7af6] bg-clip-text text-transparent">
                QuizFlow
              </span>
              <Badge variant="secondary" className="ml-2 text-xs">Pro</Badge>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Features</a>
              <a href="#testimonials" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Reviews</a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Pricing</a>
              <Button onClick={() => navigate('/demo/templates')} variant="ghost" size="sm" className="text-brand-brightBlue hover:text-brand-brightBlue/80">
                <Zap className="h-4 w-4 mr-1" />
                Demo
              </Button>
            </nav>

            <div className="flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  <Button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-brand-brightBlue to-brand-lightBlue hover:from-brand-brightBlue/90 hover:to-brand-lightBlue/90">
                    Dashboard
                  </Button>
                  <Button onClick={() => navigate('/editor')} variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    Create Quiz
                  </Button>
                  <Button onClick={logout} variant="ghost" size="sm">
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button onClick={() => navigate('/auth')} variant="ghost">
                    Sign In
                  </Button>
                  <Button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-brand-brightBlue to-brand-lightBlue hover:from-brand-brightBlue/90 hover:to-brand-lightBlue/90">
                    Start Free Trial
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section - Modern & International */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(1200px 600px at 20% 20%, rgba(59,190,243,0.25) 0%, transparent 60%), radial-gradient(1000px 500px at 80% 80%, rgba(234,122,246,0.25) 0%, transparent 60%)' }}></div>
          <div className="absolute inset-0 bg-[#0a0f1f]"></div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-5xl mx-auto">
              <Badge className="mb-8 bg-[#132036] text-[#3bbef3] border-[#3bbef3]/30 hover:bg-[#132036]/80 transition-colors px-4 py-2">
                <Sparkles className="h-4 w-4 mr-2" />
                Vista-se de Você
              </Badge>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 text-white leading-tight tracking-tight">
                Vista-se de Você
              </h1>

              <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed max-w-4xl mx-auto font-light">
                Descubra seu estilo pessoal único com nosso quiz interativo.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#3bbef3] to-[#ea7af6] hover:from-[#38bdf8] hover:to-[#e879f9] text-white text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  onClick={() => navigate(user ? '/dashboard' : '/auth')}
                >
                  <Zap className="h-5 w-5 mr-2" />
                  {user ? 'Ir para Dashboard' : 'Começar Teste Grátis'}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-10 py-4 border-2 border-slate-600 text-white hover:bg-slate-800 rounded-xl transition-all"
                  onClick={() => navigate('/templates')}
                >
                  <Target className="h-5 w-5 mr-2" />
                  Ver Templates
                </Button>
              </div>

              {/* Social Proof */}
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="font-medium">4.9/5 avaliação</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-blue-600 mr-1" />
                  <span className="font-medium">10.000+ usuários</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="font-medium">5 min configuração</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics - Modern & Clean */}
        <section className="py-24 bg-[#0a0f1f]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Confiado por Líderes da Indústria
                </h2>
                <p className="text-slate-300 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
                  Junte-se a milhares de empresas que transformaram seu engajamento de visitantes e taxas de conversão
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center border border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-[#101726]">
                  <CardContent className="p-10">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6`} style={{ background: 'linear-gradient(135deg, #3bbef3 0%, #ea7af6 100%)' }}>
                      <stat.icon className={`h-8 w-8 text-white`} />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-white mb-3">{stat.number}</div>
                    <div className="text-slate-300 font-medium text-lg">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 bg-[#0a0f1f]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Tudo Que Você Precisa Para Ter Sucesso
              </h2>
              <p className="text-slate-300 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
                Recursos poderosos projetados para ajudá-lo a criar, otimizar e escalar suas campanhas de quiz
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="p-8 hover:shadow-lg transition-all duration-300 border border-slate-700 bg-[#101726] hover:-translate-y-1">
                  <CardContent className="p-0">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6`} style={{ background: 'linear-gradient(135deg, #3bbef3 0%, #ea7af6 100%)' }}>
                      <feature.icon className={`h-7 w-7 text-white`} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">O que Nossos Clientes Dizem</h2>
              <p className="text-slate-600 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">Empresas de todos os tamanhos usam QuizFlow para crescer mais rápido</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border border-slate-200 shadow-sm hover:shadow-lg transition-all bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4 text-yellow-500">
                    <Star className="h-5 w-5" />
                    <Star className="h-5 w-5" />
                    <Star className="h-5 w-5" />
                    <Star className="h-5 w-5" />
                    <Star className="h-5 w-5" />
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-6">Triplicamos a taxa de conversão em 30 dias com quizzes personalizados. A configuração foi rápida e a análise é impecável.</p>
                  <div className="text-slate-900 font-semibold">Mariana, Head de Marketing</div>
                  <div className="text-slate-500 text-sm">E-commerce de Beleza</div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 shadow-sm hover:shadow-lg transition-all bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4 text-yellow-500">
                    <Star className="h-5 w-5" />
                    <Star className="h-5 w-5" />
                    <Star className="h-5 w-5" />
                    <Star className="h-5 w-5" />
                    <Star className="h-5 w-5" />
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-6">Integração perfeita com nosso CRM. Em poucos minutos, lançamos campanhas que geram leads qualificados diariamente.</p>
                  <div className="text-slate-900 font-semibold">Lucas, Growth Lead</div>
                  <div className="text-slate-500 text-sm">Startup SaaS</div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 shadow-sm hover:shadow-lg transition-all bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4 text-yellow-500">
                    <Star className="h-5 w-5" />
                    <Star className="h-5 w-5" />
                    <Star className="h-5 w-5" />
                    <Star className="h-5 w-5" />
                    <Star className="h-5 w-5" />
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-6">Ferramenta moderna, rápida e com templates incríveis. Ideal para equipes que prezam por performance e design.</p>
                  <div className="text-slate-900 font-semibold">Aline, Diretora de Produto</div>
                  <div className="text-slate-500 text-sm">EduTech</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 bg-slate-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Planos Simples e Transparentes</h2>
              <p className="text-slate-600 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">Escolha o plano ideal para seu estágio de crescimento</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="border border-slate-200 bg-white">
                <CardContent className="p-8">
                  <div className="text-slate-900 text-xl font-bold mb-2">Starter</div>
                  <div className="text-4xl font-extrabold text-slate-900 mb-6">R$0<span className="text-lg font-medium text-slate-500">/mês</span></div>
                  <ul className="space-y-3 text-slate-700 mb-8">
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />1 quiz ativo</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Templates básicos</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Coleta de leads</li>
                  </ul>
                  <Button onClick={() => navigate('/auth')} className="w-full bg-gradient-to-r from-brand-brightBlue to-brand-lightBlue">Começar Grátis</Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-brand-lightBlue bg-white shadow-lg relative">
                <CardContent className="p-8">
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-light text-brand-brightBlue">Mais Popular</Badge>
                  <div className="text-slate-900 text-xl font-bold mb-2">Pro</div>
                  <div className="text-4xl font-extrabold text-slate-900 mb-6">R$99<span className="text-lg font-medium text-slate-500">/mês</span></div>
                  <ul className="space-y-3 text-slate-700 mb-8">
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Quizzes ilimitados</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Templates premium</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Análises avançadas</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Teste A/B</li>
                  </ul>
                  <Button onClick={() => navigate('/auth')} className="w-full bg-gradient-to-r from-brand-brightBlue to-brand-lightBlue">Assinar Pro</Button>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 bg-white">
                <CardContent className="p-8">
                  <div className="text-slate-900 text-xl font-bold mb-2">Enterprise</div>
                  <div className="text-4xl font-extrabold text-slate-900 mb-6">Custom</div>
                  <ul className="space-y-3 text-slate-700 mb-8">
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />SLA e suporte dedicado</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Integrações avançadas</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Onboarding personalizado</li>
                  </ul>
                  <Button onClick={() => window.open('mailto:sales@quizflow.pro')} variant="outline" className="w-full">Falar com Vendas</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-24" style={{ background: 'linear-gradient(90deg, #3bbef3, #ea7af6)' }}>
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Pronto Para Transformar Seu Negócio?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-3xl mx-auto">
              Junte-se a milhares de empresas já usando QuizFlow para aumentar engajamento e conversões
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate(user ? '/dashboard' : '/auth')} className="bg-white text-[#0a0f1f] hover:bg-slate-100 px-8 py-4 text-lg font-semibold">
                <Zap className="mr-2 h-5 w-5" />
                Começar Teste Grátis
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.open('mailto:sales@quizflow.pro')} className="border-2 border-white text-white hover:bg-white hover:text-[#0a0f1f] px-8 py-4 text-lg font-semibold">
                <ArrowRight className="mr-2 h-5 w-5" />
                Falar com Vendas
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-400">
            © 2024 QuizFlow. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
