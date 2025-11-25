import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
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
  Play,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { appLogger } from '@/lib/utils/appLogger';
import { Helmet } from 'react-helmet-async';

export const Home: React.FC = () => {
  appLogger.info('🏠 Home component rendering...');
  appLogger.info('🏠 Home: Mounting component');

  const { user, logout } = useAuth();
  appLogger.info('🏠 Home: useAuth called, user:', { data: [user ? 'authenticated' : 'not authenticated'] });
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isVslOpen, setIsVslOpen] = useState(false);

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



  // Stats data
  const stats = useMemo(() => [
    {
      number: '15K+',
      label: 'Quizzes criados',
      icon: Target,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      number: '94%',
      label: 'Taxa de conversão',
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      number: '2min',
      label: 'Tempo de configuração',
      icon: Zap,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ], []);

  const features = useMemo(() => [
    {
      icon: Target,
      title: 'Editor visual',
      description: 'Editor visual de arrastar e soltar — crie quizzes sem precisar programar',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: BarChart3,
      title: 'Análises avançadas',
      description: 'Métricas detalhadas e rastreamento de conversões para otimizar resultados',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      icon: Users,
      title: 'Captação de leads',
      description: 'Integração com CRMs e ferramentas de automação para qualificar contatos automaticamente',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      icon: Zap,
      title: 'Templates prontos',
      description: 'Biblioteca de layouts profissionais e templates por setor para acelerar o lançamento',
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
      title: 'Totalmente responsivo',
      description: 'Design e performance otimizados para todos os dispositivos e tamanhos de tela',
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
          <p className="text-slate-600 font-medium">Carregando QuizFlow...</p>
        </div>
      </div>
    );
  }

  const MotionButton = motion(Button);

  const heroVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i = 1) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' } }),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const cardHover = { y: -6, boxShadow: '0 12px 30px rgba(2,6,23,0.5)', transition: { duration: 0.25 } };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>QuizFlowPro — Crie quizzes que convertem | Gisele Galvão</title>
        <meta name="description" content="QuizFlowPro: crie quizzes interativos para captar leads qualificados, segmentar público e aumentar conversões — editor visual, templates prontos e integrações com CRMs." />
      </Helmet>
      {/* Modern Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#050816]/90 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#3bbef3] to-[#ea7af6] flex items-center justify-center shadow-lg">
                <div className="relative w-6 h-6">
                  <span className="absolute w-1.5 h-1.5 rounded-full bg-white top-0 left-0" />
                  <span className="absolute w-1.5 h-1.5 rounded-full bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  <span className="absolute w-1.5 h-1.5 rounded-full bg-white bottom-0 right-0" />
                  <span className="absolute w-[2px] h-[18px] bg-white/40 left-[7px] top-[3px] rotate-45 origin-top rounded-full" />
                </div>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[22px] font-extrabold bg-gradient-to-r from-[#3bbef3] to-[#ea7af6] bg-clip-text text-transparent tracking-tight">
                  QuizFlowPro
                </span>
                <small className="text-[11px] text-slate-300 -mt-0.5">Quizzes que convertem</small>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="relative text-slate-100/80 hover:text-white font-medium transition-colors after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 hover:after:w-full after:bg-[#3bbef3] after:transition-all"
              >
                Recursos
              </a>
              <a
                href="#testimonials"
                className="relative text-slate-100/80 hover:text-white font-medium transition-colors after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 hover:after:w-full after:bg-[#3bbef3] after:transition-all"
              >
                Depoimentos
              </a>
              <a
                href="#pricing"
                className="relative text-slate-100/80 hover:text-white font-medium transition-colors after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 hover:after:w-full after:bg-[#3bbef3] after:transition-all"
              >
                Planos
              </a>
              <Button
                onClick={() => navigate('/demo/templates')}
                variant="ghost"
                size="sm"
                className="text-slate-100/80 hover:text-white border border-white/10 rounded-full px-4"
              >
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
                  <Button onClick={() => navigate('/criar-funil')} variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    Criar Quiz
                  </Button>
                  <Button onClick={logout} variant="ghost" size="sm">
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button onClick={() => navigate('/admin')} variant="ghost">
                    Entrar
                  </Button>
                  <Button onClick={() => navigate('/criar-funil')} className="bg-gradient-to-r from-brand-brightBlue to-brand-lightBlue hover:from-brand-brightBlue/90 hover:to-brand-lightBlue/90">
                    Começar Teste Grátis
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative py-28 lg:py-32 overflow-hidden bg-[#0a0f1f]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#3bbef3]/25 via-transparent to-[#ea7af6]/25"></div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
              <div className="text-center lg:text-left">
                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45 }}>
                  <Badge className="mb-8 bg-[#132036] text-[#3bbef3] border-[#3bbef3]/30 hover:bg-[#132036]/80 transition-colors px-4 py-2">
                    <Sparkles className="h-4 w-4 mr-2" />
                    QuizFlowPro
                  </Badge>
                </motion.div>

                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                  <motion.h1 custom={0} variants={heroVariants} className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 text-white leading-[1.05] tracking-tight">
                    QuizFlowPro — quizzes que convertem
                  </motion.h1>

                  <motion.p custom={1} variants={heroVariants} className="text-lg md:text-xl text-slate-300/90 mb-12 leading-relaxed max-w-4xl mx-auto font-light">
                    Crie quizzes interativos para captar leads qualificados, segmentar seu público e aumentar conversões — rápido, intuitivo e integrado às suas ferramentas de marketing.
                  </motion.p>
                </motion.div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-16">
                  <MotionButton
                    size="lg"
                    className="bg-gradient-to-r from-[#3bbef3] to-[#ea7af6] hover:from-[#38bdf8] hover:to-[#e879f9] text-white text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    onClick={() => navigate(user ? '/dashboard' : '/criar-funil')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Zap className="h-5 w-5 mr-2" />
                    {user ? 'Ir para o Dashboard' : 'Iniciar teste gratuito'}
                  </MotionButton>
                  <MotionButton
                    variant="outline"
                    size="lg"
                    className="text-lg px-10 py-4 border-2 border-slate-600 text-white hover:bg-slate-800 rounded-xl transition-all"
                    onClick={() => navigate('/templates')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Target className="h-5 w-5 mr-2" />
                    Ver Templates
                  </MotionButton>
                  <MotionButton
                    variant="outline"
                    size="lg"
                    className="text-lg px-10 py-4 border-2 border-[#3bbef3] text-white hover:bg-slate-800 rounded-xl transition-all"
                    onClick={() => setIsVslOpen(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Assistir VSL
                  </MotionButton>
                </div>

                {/* Social Proof */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 text-sm text-slate-400">
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

              {/* Hero Right - Inline VSL Preview */}
              <div className="hidden lg:block">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative max-w-md ml-auto"
                >
                  <div className="absolute -inset-6 bg-gradient-to-tr from-[#3bbef3]/30 via-transparent to-[#ea7af6]/40 opacity-70 blur-3xl" />
                  <div className="relative rounded-3xl overflow-hidden border border-white/12 shadow-[0_24px_80px_rgba(15,23,42,0.9)]">
                    <video
                      src="/videos/vsl-quizflowpro.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <Badge className="bg-white/10 text-white border-white/20">Preview VSL</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                        onClick={() => setIsVslOpen(true)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Assistir
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics - Modern & Clean */}
        <section className="py-28 lg:py-32 bg-[#0a0f1f]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Confiado por líderes do setor
              </h2>
              <p className="text-slate-300 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
                Junte-se a milhares de empresas que transformaram seu engajamento de visitantes e taxas de conversão
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <Card
                    key={index}
                    className="text-center border border-slate-700/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-tr from-[#0f1724]/70 to-[#020617]/90 backdrop-blur-xl ring-1 ring-white/5"
                  >
                    <CardContent className="p-10">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner`} style={{ background: 'linear-gradient(135deg, #3bbef3 0%, #ea7af6 100%)' }}>
                        <stat.icon className={`h-7 w-7 text-white`} />
                      </div>
                      <motion.div className="text-4xl md:text-5xl font-extrabold text-white mb-3" initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 110 }}>
                        {stat.number}
                      </motion.div>
                      <div className="text-slate-300 font-medium text-lg">{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-28 lg:py-32 bg-[#0a0f1f]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Tudo o que você precisa para ter sucesso
              </h2>
              <p className="text-slate-300 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
                Recursos poderosos projetados para ajudá-lo a criar, otimizar e escalar suas campanhas de quiz
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
                  <Card key={index} className="p-8 hover:shadow-2xl transition-all duration-300 border border-white/5 bg-gradient-to-tr from-[#0f1724]/60 to-[#020617]/90 hover:-translate-y-2 rounded-2xl">
                    <CardContent className="p-0">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-sm`} style={{ background: 'linear-gradient(135deg, #3bbef3 0%, #ea7af6 100%)' }}>
                        <feature.icon className={`h-7 w-7 text-white`} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                      <p className="text-slate-300/90 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">O que nossos clientes dizem</h2>
              <p className="text-slate-600 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">Empresas de todos os tamanhos usam QuizFlow para crescer mais rápido</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} whileHover={{ y: -6 }}>
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
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.06 }} whileHover={{ y: -6 }}>
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
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.12 }} whileHover={{ y: -6 }}>
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
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 bg-slate-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Planos simples e transparentes</h2>
              <p className="text-slate-600 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">Escolha o plano ideal para seu estágio de crescimento</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
                <Card className="border border-slate-200 bg-white">
                  <CardContent className="p-8">
                    <div className="text-slate-900 text-xl font-bold mb-2">Starter</div>
                    <div className="text-4xl font-extrabold text-slate-900 mb-6">R$0<span className="text-lg font-medium text-slate-500">/mês</span></div>
                    <ul className="space-y-3 text-slate-700 mb-8">
                      <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />1 quiz ativo</li>
                      <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Templates básicos</li>
                      <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Coleta de leads</li>
                    </ul>
                    <MotionButton onClick={() => navigate('/criar-funil')} className="w-full bg-gradient-to-r from-brand-brightBlue to-brand-lightBlue" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Começar gratuitamente</MotionButton>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.06 }}>
                <Card className="border-2 border-brand-lightBlue bg-white shadow-lg relative">
                  <CardContent className="p-8">
                    <motion.div className="absolute -top-3 left-1/2 -translate-x-1/2" animate={{ scale: [1, 1.03, 1], opacity: [0.95, 1, 0.95] }} transition={{ repeat: Infinity, duration: 2.5 }}>
                      <Badge className="bg-brand-light text-brand-brightBlue">Mais Popular</Badge>
                    </motion.div>
                    <div className="text-slate-900 text-xl font-bold mb-2">Pro</div>
                    <div className="text-4xl font-extrabold text-slate-900 mb-6">R$99<span className="text-lg font-medium text-slate-500">/mês</span></div>
                    <ul className="space-y-3 text-slate-700 mb-8">
                      <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Quizzes ilimitados</li>
                      <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Templates premium</li>
                      <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Análises avançadas</li>
                      <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Teste A/B</li>
                    </ul>
                    <MotionButton onClick={() => navigate('/admin')} className="w-full bg-gradient-to-r from-brand-brightBlue to-brand-lightBlue" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Assinar Pro</MotionButton>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.12 }}>
                <Card className="border border-slate-200 bg-white">
                  <CardContent className="p-8">
                    <div className="text-slate-900 text-xl font-bold mb-2">Enterprise</div>
                    <div className="text-4xl font-extrabold text-slate-900 mb-6">Custom</div>
                    <ul className="space-y-3 text-slate-700 mb-8">
                      <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />SLA e suporte dedicado</li>
                      <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Integrações avançadas</li>
                      <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-2" />Onboarding personalizado</li>
                    </ul>
                    <MotionButton onClick={() => window.open('mailto:sales@quizflow.pro')} variant="outline" className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Falar com Vendas</MotionButton>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-24" style={{ background: 'linear-gradient(90deg, #3bbef3, #ea7af6)' }}>
          <div className="container mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Pronto Para Transformar Seu Negócio?
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-3xl mx-auto">
                Junte-se a milhares de empresas já usando QuizFlow para aumentar engajamento e conversões
              </p>
            </motion.div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MotionButton size="lg" onClick={() => navigate(user ? '/dashboard' : '/criar-funil')} className="bg-white text-[#0a0f1f] hover:bg-slate-100 px-8 py-4 text-lg font-semibold" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Zap className="mr-2 h-5 w-5" />
                Iniciar teste gratuito
              </MotionButton>
              <MotionButton variant="outline" size="lg" onClick={() => window.open('mailto:sales@quizflow.pro')} className="border-2 border-white text-white hover:bg-white hover:text-[#0a0f1f] px-8 py-4 text-lg font-semibold" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <ArrowRight className="mr-2 h-5 w-5" />
                Falar com Vendas
              </MotionButton>
            </div>
          </div>
        </section>
      </main>

      {/* VSL Modal */}
      {isVslOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsVslOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-4xl bg-[#0a0f1f] border border-white/10 rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Fechar"
              className="absolute top-3 right-3 text-white/80 hover:text-white p-2 rounded-full bg-white/10"
              onClick={() => setIsVslOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <div className="aspect-video w-full bg-black">
              <video
                src="/videos/vsl-quizflowpro.mp4"
                controls
                autoPlay
                className="w-full h-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="bg-[#050816] border-t border-white/5 text-slate-400 py-10 text-sm">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © 2025 QuizFlowPro. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <a href="#features" className="hover:text-slate-200 transition-colors">Produto</a>
            <a href="#pricing" className="hover:text-slate-200 transition-colors">Planos</a>
            <button
              type="button"
              onClick={() => window.open('mailto:support@quizflow.pro')}
              className="hover:text-slate-200 transition-colors"
            >
              Suporte
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
