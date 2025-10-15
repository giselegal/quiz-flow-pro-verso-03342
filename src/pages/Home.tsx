import React, { useEffect, useState } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/contexts';

export const Home: React.FC = () => {
  console.log('🏠 Home component rendering...');
  
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // Navigation helper function
  const navigate = (path: string) => {
    console.log('🔄 Navigating to:', path);
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
    document.title = 'QuizFlow Pro – Create Engaging Quizzes That Convert Globally';
    const metaDesc = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    metaDesc.setAttribute('content', 'QuizFlow Pro: Create interactive quizzes with elegant design to capture leads and boost conversions worldwide. Trusted by 10,000+ businesses globally.');
    if (!document.querySelector('meta[name="description"]')) {
      document.head.appendChild(metaDesc);
    }
  }, []);

  // Stats data
  const stats = [
    { 
      number: '15K+', 
      label: 'Quizzes Criados', 
      icon: Target, 
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    { 
      number: '94%', 
      label: 'Taxa de Conversão', 
      icon: TrendingUp, 
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    { 
      number: '2min', 
      label: 'Tempo de Configuração', 
      icon: Zap, 
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  ];

  const features = [
    {
      icon: Target,
      title: 'Editor Visual',
      description: 'Interface intuitiva de arrastar e soltar para criar quizzes sem programação',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      icon: BarChart3,
      title: 'Análises Avançadas',
      description: 'Métricas detalhadas de performance e rastreamento de conversão para otimização',
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      icon: Users,
      title: 'Captura de Leads',
      description: 'Integração perfeita com CRM e ferramentas de automação de marketing',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      icon: Zap,
      title: 'Templates Prontos',
      description: 'Biblioteca de designs profissionais com templates específicos por setor',
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    {
      icon: TrendingUp,
      title: 'Teste A/B',
      description: 'Teste diferentes versões para maximizar engajamento e conversões',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    },
    {
      icon: CheckCircle,
      title: 'Responsivo Mobile',
      description: 'Performance perfeita em todos os dispositivos e tamanhos de tela',
      color: 'text-teal-600',
      bg: 'bg-teal-50'
    }
  ];

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
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-brightBlue to-brand-lightBlue rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-brand-brightBlue to-brand-lightBlue bg-clip-text text-transparent">
                QuizFlow
              </span>
              <Badge variant="secondary" className="ml-2 text-xs">Pro</Badge>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Features</a>
              <a href="#testimonials" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Reviews</a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Pricing</a>
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
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-background via-brand-light to-brand-lightBlue/10"></div>
          <div className="absolute inset-0 bg-dot-pattern opacity-30"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-5xl mx-auto">
              <Badge className="mb-8 bg-brand-light text-brand-brightBlue border-brand-lightBlue/30 hover:bg-brand-lightBlue/20 transition-colors px-4 py-2">
                <Sparkles className="h-4 w-4 mr-2" />
                Plataforma de Quizzes Interativos
              </Badge>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 text-slate-900 leading-tight tracking-tight">
                Crie{' '}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Quizzes Interativos
                </span>
                <br />
                Que Convertem
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed max-w-4xl mx-auto font-light">
                Transforme visitantes em clientes com quizzes personalizados e interativos.
                Design profissional, integração perfeita, resultados comprovados.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-brand-brightBlue to-brand-lightBlue hover:from-brand-brightBlue/90 hover:to-brand-lightBlue/90 text-white text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  onClick={() => navigate(user ? '/dashboard' : '/auth')}
                >
                  <Zap className="h-5 w-5 mr-2" />
                  {user ? 'Ir para Dashboard' : 'Começar Teste Grátis'}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-10 py-4 border-2 border-slate-300 hover:bg-slate-50 rounded-xl transition-all"
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
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Confiado por Líderes da Indústria
              </h2>
              <p className="text-slate-600 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
                Junte-se a milhares de empresas que transformaram seu engajamento de visitantes e taxas de conversão
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardContent className="p-10">
                    <div className={`${stat.bg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6`}>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">{stat.number}</div>
                    <div className="text-slate-600 font-medium text-lg">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 bg-slate-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Tudo Que Você Precisa Para Ter Sucesso
              </h2>
              <p className="text-slate-600 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
                Recursos poderosos projetados para ajudá-lo a criar, otimizar e escalar suas campanhas de quiz
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="p-8 hover:shadow-lg transition-all duration-300 border border-slate-200 bg-white hover:-translate-y-1">
                  <CardContent className="p-0">
                    <div className={`${feature.bg} w-14 h-14 rounded-xl flex items-center justify-center mb-6`}>
                      <feature.icon className={`h-7 w-7 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-24 bg-gradient-to-r from-brand-brightBlue via-brand-lightBlue to-brand-brightPink">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Pronto Para Transformar Seu Negócio?
            </h2>
            <p className="text-xl text-brand-light mb-10 max-w-3xl mx-auto">
              Junte-se a milhares de empresas já usando QuizFlow para aumentar engajamento e conversões
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-brand-brightBlue hover:bg-brand-light px-8 py-4 text-lg font-semibold">
                <Zap className="mr-2 h-5 w-5" />
                Começar Teste Grátis
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold">
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