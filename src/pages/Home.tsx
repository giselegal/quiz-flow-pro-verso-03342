import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Target, Zap, BarChart3, Users, TrendingUp, CheckCircle, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for smooth animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // SEO básico
  useEffect(() => {
    document.title = 'QuizFlow Pro – Crie quizzes elegantes que convertem';
    const metaDesc = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    metaDesc.setAttribute('content', 'QuizFlow Pro: crie quizzes interativos com design elegante para captar leads e aumentar conversões.');
    if (!document.querySelector('meta[name="description"]')) {
      document.head.appendChild(metaDesc);
    }
  }, []);

  // Simple loading state
  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Elegante */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-playfair font-bold text-primary">
              QuizFlow
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <Button onClick={() => navigate('/admin')} className="cyberpunk">
                    Dashboard
                  </Button>
                  <Button onClick={() => navigate('/templates')} variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    Templates
                  </Button>
                  <Button onClick={logout} variant="ghost">
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button onClick={() => navigate('/auth')} variant="ghost">
                    Entrar
                  </Button>
                  <Button onClick={() => navigate('/auth')} className="cyberpunk">
                    Começar Grátis
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section - Design Suave e Elegante */}
        <section className="relative py-24 overflow-hidden">
          {/* Fundo sutil com gradientes */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--primary-500/10)_0%,_transparent_50%)]"></div>
          
          {/* Elementos decorativos sutis */}
          <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-br from-secondary/15 to-transparent rounded-full blur-2xl animate-float"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                <Sparkles className="h-4 w-4 mr-2" />
                Plataforma de Quiz Interativo
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6 text-foreground leading-tight">
                Crie Quiz{' '}
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Elegantes
                </span>
                <br />
                que Convertem
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
                Transforme visitantes em clientes com quizzes interativos e personalizados.
                Design profissional, integração simples, resultados comprovados.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button 
                  size="lg" 
                  className="cyberpunk text-lg px-8 py-4"
                  onClick={() => navigate(user ? '/admin' : '/auth')}
                >
                  <Zap className="h-5 w-5 mr-2" />
                  {user ? 'Meu Dashboard' : 'Começar Grátis'}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-4 border-2 hover:bg-primary/5"
                  onClick={() => navigate('/templates')}
                >
                  <Target className="h-5 w-5 mr-2" />
                  Ver Templates
                </Button>
              </div>

              {/* Prova social sutil */}
              <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span>4.9/5 avaliação</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-primary mr-1" />
                  <span>10K+ usuários</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span>Setup em 5 min</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Métricas - Design Minimalista e Elegante */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-playfair font-bold text-foreground mb-4">
                Resultados que Falam por Si
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Junte-se a milhares de empresas que já transformaram visitantes em clientes
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { 
                  number: '10K+', 
                  label: 'Quiz Criados', 
                  icon: Target, 
                  color: 'text-primary',
                  bg: 'bg-primary/10'
                },
                { 
                  number: '98%', 
                  label: 'Taxa de Conversão', 
                  icon: TrendingUp, 
                  color: 'text-secondary',
                  bg: 'bg-secondary/10'
                },
                { 
                  number: '5min', 
                  label: 'Tempo de Setup', 
                  icon: Zap, 
                  color: 'text-accent',
                  bg: 'bg-accent/10'
                }
              ].map((metric, index) => (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-background/60 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className={`${metric.bg} ${metric.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <metric.icon className="h-8 w-8" />
                    </div>
                    <div className="text-4xl font-bold text-foreground mb-2">{metric.number}</div>
                    <div className="text-muted-foreground font-medium">{metric.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Funcionalidades */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-playfair font-bold text-foreground mb-4">
                Tudo que Você Precisa
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Ferramentas poderosas para criar, personalizar e otimizar seus quizzes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Target,
                  title: 'Editor Visual',
                  description: 'Interface intuitiva para criar quizzes sem código'
                },
                {
                  icon: BarChart3,
                  title: 'Analytics Avançado',
                  description: 'Métricas detalhadas de performance e conversão'
                },
                {
                  icon: Users,
                  title: 'Captura de Leads',
                  description: 'Integração com CRM e ferramentas de marketing'
                },
                {
                  icon: Zap,
                  title: 'Templates Prontos',
                  description: 'Biblioteca com designs profissionais'
                },
                {
                  icon: TrendingUp,
                  title: 'Otimização A/B',
                  description: 'Teste diferentes versões para maximizar resultados'
                },
                {
                  icon: CheckCircle,
                  title: 'Responsivo',
                  description: 'Funciona perfeitamente em todos os dispositivos'
                }
              ].map((feature, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-background/60 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="text-primary mb-4">
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-playfair font-bold text-foreground mb-4">
              Pronto para Começar?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Crie seu primeiro quiz em minutos e comece a converter mais visitantes hoje mesmo
            </p>
            <Button 
              size="lg" 
              className="cyberpunk text-lg px-8 py-4"
              onClick={() => navigate(user ? '/admin' : '/auth')}
            >
              <ArrowRight className="h-5 w-5 mr-2" />
              Começar Agora
            </Button>
          </div>
        </section>
      </main>

      {/* Footer Simples */}
      <footer className="py-8 border-t border-border/50 bg-background/80">
        <div className="container mx-auto px-6 text-center">
          <div className="text-2xl font-playfair font-bold text-primary mb-4">
            QuizFlow
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 QuizFlow Pro. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;