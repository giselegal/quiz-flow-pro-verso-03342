import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import { useInlineBlock } from '../../../../hooks/useInlineBlock';
import { InlineBlockProps } from '../../../../types/inlineBlocks';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Gift, Clock, Star, CheckCircle, ArrowRight, Zap, Crown, Users, Award, Calendar, Phone, Mail, ExternalLink, Play, Heart, Target, Sparkles, TrendingUp, Shield } from 'lucide-react';

interface QuizOfferCTAInlineBlockProps extends InlineBlockProps {
  // Propriedades específicas do componente de oferta/CTA
}

/**
 * Componente inline para oferta especial e call-to-action (Etapa 21)
 * Última etapa do funil com ofertas personalizadas e conversão
 */
export const QuizOfferCTAInlineBlock: React.FC<QuizOfferCTAInlineBlockProps> = ({
  block,
  isSelected,
  onClick,
  onPropertyChange,
  className
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(0);
  const [showCountdown, setShowCountdown] = useState(true);
  
  const {
    properties,
    handlePropertyChange,
    commonProps
  } = useInlineBlock({
    block,
    isSelected,
    onClick,
    onPropertyChange,
    className
  });

  const title = properties.title || 'Oferta Especial Só Para Você!';
  const subtitle = properties.subtitle || 'Baseado nos seus resultados, criamos uma proposta exclusiva para acelerar seu desenvolvimento profissional';
  const urgencyMessage = properties.urgencyMessage || 'Esta oferta expira em 24 horas!';
  const mainOffer = properties.mainOffer || {
    title: 'Programa de Aceleração de Liderança',
    originalPrice: 4997,
    discountPrice: 2497,
    discount: 50,
    paymentOptions: '12x R$ 248',
    highlights: [
      'Mentoria 1:1 por 6 meses',
      'Curso completo de Liderança Executiva', 
      'Acesso vitalício à plataforma',
      'Certificado reconhecido pelo mercado',
      'Grupo VIP no LinkedIn',
      'Kit de ferramentas exclusivo'
    ],
    testimonials: 3,
    satisfaction: 98,
    students: 1247
  };
  const bonusOffers = properties.bonusOffers || [
    {
      title: 'Bônus #1: Masterclass Comunicação',
      value: 'R$ 897',
      description: 'Workshop exclusivo sobre comunicação executiva',
      status: 'Grátis hoje'
    },
    {
      title: 'Bônus #2: Templates de Liderança',
      value: 'R$ 497',
      description: '50+ templates para gestão e liderança',
      status: 'Grátis hoje'
    },
    {
      title: 'Bônus #3: Acesso ao CEO Club',
      value: 'R$ 1.200/ano',
      description: 'Rede exclusiva de líderes executivos',
      status: '6 meses grátis'
    }
  ];
  const socialProof = properties.socialProof || [
    {
      name: 'Maria Santos',
      position: 'Diretora de Marketing',
      company: 'TechCorp',
      testimonial: 'Em 6 meses consegui a promoção que busquei por 3 anos! O programa é transformador.',
      rating: 5,
      image: 'MS'
    },
    {
      name: 'João Silva',
      position: 'VP de Vendas',
      company: 'InnovaCorp',
      testimonial: 'Minha equipe aumentou 40% de performance após aplicar as técnicas aprendidas.',
      rating: 5,
      image: 'JS'
    },
    {
      name: 'Ana Costa',
      position: 'CEO',
      company: 'StartupXYZ',
      testimonial: 'O investimento se pagou já no primeiro mês. Recomendo para todos os líderes.',
      rating: 5,
      image: 'AC'
    }
  ];
  const guarantees = properties.guarantees || [
    {
      icon: 'shield',
      title: 'Garantia de 30 dias',
      description: '100% do seu dinheiro de volta se não ficar satisfeito'
    },
    {
      icon: 'award',
      title: 'Certificado Reconhecido',
      description: 'Certificação válida em todo o mercado brasileiro'
    },
    {
      icon: 'users',
      title: 'Comunidade Exclusiva',
      description: 'Acesso vitalício ao grupo de líderes de alto nível'
    }
  ];
  const urgencyElements = properties.urgencyElements || {
    timeLeft: '23:45:12',
    spotsLeft: 7,
    totalSpots: 20,
    lastPurchase: '3 minutos atrás'
  };
  const offerType = properties.offerType || 'premium'; // premium, standard, exclusive
  const ctaStyle = properties.ctaStyle || 'urgent'; // urgent, professional, friendly
  const showTestimonials = properties.showTestimonials || true;
  const showGuarantees = properties.showGuarantees || true;
  const showBonuses = properties.showBonuses || true;
  const showSocialProof = properties.showSocialProof || true;
  const theme = properties.theme || 'premium';

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const getGuaranteeIcon = (iconType: string) => {
    const icons = {
      shield: Shield,
      award: Award,
      users: Users,
      star: Star,
      heart: Heart
    };
    return icons[iconType as keyof typeof icons] || Shield;
  };

  const getThemeClasses = () => {
    const themes = {
      premium: {
        bg: 'from-purple-900 via-blue-900 to-indigo-900',
        border: 'border-purple-300',
        accent: 'text-white',
        button: 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold',
        card: 'bg-white/10 backdrop-blur-sm border-white/20'
      },
      professional: {
        bg: 'from-slate-900 via-gray-900 to-slate-900',
        border: 'border-slate-300',
        accent: 'text-white',
        button: 'bg-blue-600 hover:bg-blue-700 text-white',
        card: 'bg-white/10 backdrop-blur-sm border-white/20'
      },
      success: {
        bg: 'from-green-800 via-emerald-800 to-teal-800',
        border: 'border-green-300',
        accent: 'text-white',
        button: 'bg-yellow-400 hover:bg-yellow-500 text-black font-bold',
        card: 'bg-white/10 backdrop-blur-sm border-white/20'
      }
    };
    return themes[theme as keyof typeof themes] || themes.premium;
  };

  const themeClasses = getThemeClasses();

  return (
    <div
      {...commonProps}
      onClick={onClick}
      className={cn(
        'min-h-[1000px] p-8 relative overflow-hidden',
        `bg-gradient-to-br ${themeClasses.bg}`,
        'transition-all duration-300',
        isSelected && 'ring-2 ring-yellow-500',
        className
      )}
    >
      {/* Elementos de Fundo */}
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-400 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-blue-400 rounded-full blur-2xl" />
      </div>

      {/* Botão de Edição */}
      {isSelected && (
        <div className="absolute top-4 right-4 z-20">
          <Button
            size="sm"
            variant={isEditMode ? "default" : "outline"}
            onClick={(e) => {
              e.stopPropagation();
              toggleEditMode();
            }}
            className="bg-white text-black"
          >
            {isEditMode ? 'Salvar' : 'Editar'}
          </Button>
        </div>
      )}

      <div className="relative z-10">
        {/* Cabeçalho Impactante */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                <Gift className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold animate-bounce">
                !
              </div>
            </div>
          </div>
          
          {isEditMode ? (
            <div className="space-y-3">
              <input
                type="text"
                value={title}
                onChange={(e) => handlePropertyChange('title', e.target.value)}
                placeholder="Título da oferta"
                className="w-full text-4xl font-bold text-center p-2 border border-gray-300 rounded text-black"
              />
              <textarea
                value={subtitle}
                onChange={(e) => handlePropertyChange('subtitle', e.target.value)}
                placeholder="Subtítulo"
                rows={2}
                className="w-full text-center p-2 border border-gray-300 rounded resize-none text-black"
              />
            </div>
          ) : (
            <div>
              <h1 className={cn('text-4xl md:text-5xl font-bold mb-4', themeClasses.accent)}>
                {title}
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-4">
                {subtitle}
              </p>
              {showCountdown && (
                <div className="flex justify-center">
                  <div className="bg-red-600 text-white px-6 py-2 rounded-full text-lg font-bold animate-pulse">
                    <Clock className="w-5 h-5 inline mr-2" />
                    {urgencyMessage}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Timer de Urgência */}
        {showCountdown && !isEditMode && (
          <div className="text-center mb-8">
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto">
              <div className="text-white mb-3">Tempo restante:</div>
              <div className="flex justify-center gap-4">
                {urgencyElements.timeLeft.split(':').map((time, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-red-600 text-white text-2xl font-bold px-4 py-2 rounded-lg">
                      {time}
                    </div>
                    <div className="text-white text-xs mt-1">
                      {['HRS', 'MIN', 'SEG'][index]}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-white/80 text-sm mt-3">
                Apenas {urgencyElements.spotsLeft} vagas restantes de {urgencyElements.totalSpots}
              </div>
            </div>
          </div>
        )}

        {/* Oferta Principal */}
        <div className={cn('rounded-2xl p-8 mb-8 relative', themeClasses.card)}>
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-yellow-400 text-black text-lg px-6 py-2 font-bold">
              {mainOffer.discount}% OFF - OFERTA LIMITADA
            </Badge>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-4">
              {mainOffer.title}
            </h2>
            
            {/* Preços */}
            <div className="mb-6">
              <div className="text-white/60 text-xl line-through mb-2">
                De: R$ {mainOffer.originalPrice.toLocaleString()}
              </div>
              <div className="text-5xl font-bold text-yellow-400 mb-2">
                R$ {mainOffer.discountPrice.toLocaleString()}
              </div>
              <div className="text-white text-lg">
                ou {mainOffer.paymentOptions}
              </div>
            </div>

            {/* Estatísticas Sociais */}
            <div className="flex justify-center gap-8 mb-6 text-white">
              <div className="text-center">
                <div className="text-2xl font-bold">{mainOffer.students}</div>
                <div className="text-sm text-white/80">Estudantes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{mainOffer.satisfaction}%</div>
                <div className="text-sm text-white/80">Satisfação</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">★★★★★</div>
                <div className="text-sm text-white/80">Avaliação</div>
              </div>
            </div>
          </div>

          {/* O que está incluído */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {mainOffer.highlights.map((highlight, index) => (
              <div key={index} className="flex items-center gap-3 text-white">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span className="text-lg">{highlight}</span>
              </div>
            ))}
          </div>

          {/* CTA Principal */}
          <div className="text-center">
            <Button
              size="lg"
              className={cn(
                'px-12 py-6 text-2xl font-bold rounded-2xl',
                'transition-all duration-200 transform hover:scale-105',
                'shadow-2xl hover:shadow-3xl',
                'animate-pulse',
                themeClasses.button
              )}
            >
              <Zap className="w-6 h-6 mr-3" />
              QUERO GARANTIR MINHA VAGA AGORA!
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
            <div className="text-white/80 text-sm mt-3">
              Última compra: {urgencyElements.lastPurchase} • Processamento seguro
            </div>
          </div>
        </div>

        {/* Bônus Exclusivos */}
        {showBonuses && (
          <div className="mb-8">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-white mb-2">
                Bônus Exclusivos (Valor: R$ 2.594)
              </h3>
              <p className="text-white/80">Só para quem decidir hoje!</p>
            </div>
            
            <div className="space-y-4">
              {bonusOffers.map((bonus, index) => (
                <div key={index} className={cn('rounded-xl p-6 flex items-center gap-4', themeClasses.card)}>
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <Gift className="w-8 h-8 text-black" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-1">
                      {bonus.title}
                    </h4>
                    <p className="text-white/80 mb-2">{bonus.description}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-white/60 line-through">Valor: {bonus.value}</span>
                      <Badge className="bg-green-500 text-white font-bold">
                        {bonus.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Garantias */}
        {showGuarantees && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white text-center mb-6">
              Nossas Garantias Para Você
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {guarantees.map((guarantee, index) => {
                const GuaranteeIconComponent = getGuaranteeIcon(guarantee.icon);
                return (
                  <div key={index} className={cn('rounded-xl p-6 text-center', themeClasses.card)}>
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <GuaranteeIconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">
                      {guarantee.title}
                    </h4>
                    <p className="text-white/80 text-sm">
                      {guarantee.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Depoimentos */}
        {showTestimonials && showSocialProof && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white text-center mb-6">
              O Que Nossos Alunos Dizem
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {socialProof.map((testimonial, index) => (
                <div key={index} className={cn('rounded-xl p-6', themeClasses.card)}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.image}
                    </div>
                    <div>
                      <div className="font-bold text-white">{testimonial.name}</div>
                      <div className="text-white/80 text-sm">{testimonial.position}</div>
                      <div className="text-white/60 text-xs">{testimonial.company}</div>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-white/90 text-sm italic">
                    "{testimonial.testimonial}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Final */}
        <div className="text-center">
          <div className={cn('rounded-2xl p-8 mb-6', themeClasses.card)}>
            <h3 className="text-3xl font-bold text-white mb-4">
              Não Perca Esta Oportunidade Única!
            </h3>
            <p className="text-white/90 text-lg mb-6">
              Milhares de profissionais já transformaram suas carreiras. 
              Agora é a sua vez de dar o próximo passo!
            </p>
            
            <Button
              size="lg"
              className={cn(
                'px-12 py-6 text-2xl font-bold rounded-2xl mb-4',
                'transition-all duration-200 transform hover:scale-105',
                'shadow-2xl hover:shadow-3xl',
                'w-full md:w-auto',
                themeClasses.button
              )}
            >
              <Crown className="w-6 h-6 mr-3" />
              SIM! QUERO TRANSFORMAR MINHA CARREIRA
              <Sparkles className="w-6 h-6 ml-3" />
            </Button>
            
            <div className="text-white/80 text-sm">
              💳 Parcelamento em até 12x • 🔒 Compra 100% segura • ⚡ Acesso imediato
            </div>
          </div>

          {/* Links de Apoio */}
          <div className="flex justify-center gap-6 text-white/60 text-sm">
            <a href="#" className="hover:text-white flex items-center gap-1">
              <Phone className="w-4 h-4" />
              Falar com vendedor
            </a>
            <a href="#" className="hover:text-white flex items-center gap-1">
              <Mail className="w-4 h-4" />
              Dúvidas por e-mail
            </a>
            <a href="#" className="hover:text-white flex items-center gap-1">
              <ExternalLink className="w-4 h-4" />
              Termos e condições
            </a>
          </div>
        </div>

        {/* Controles de Edição */}
        {isEditMode && (
          <div className="mt-8 pt-6 border-t border-white/20 space-y-4">
            {/* Opções de Exibição */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={showTestimonials ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handlePropertyChange('showTestimonials', !showTestimonials)}
              >
                Mostrar Depoimentos
              </Badge>
              
              <Badge
                variant={showGuarantees ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handlePropertyChange('showGuarantees', !showGuarantees)}
              >
                Mostrar Garantias
              </Badge>

              <Badge
                variant={showBonuses ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handlePropertyChange('showBonuses', !showBonuses)}
              >
                Mostrar Bônus
              </Badge>

              <Badge
                variant={showSocialProof ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handlePropertyChange('showSocialProof', !showSocialProof)}
              >
                Mostrar Prova Social
              </Badge>
            </div>

            {/* Tipo de Oferta */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Tipo de Oferta
              </label>
              <div className="flex gap-2">
                {['premium', 'standard', 'exclusive'].map((type) => (
                  <Badge
                    key={type}
                    variant={offerType === type ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => handlePropertyChange('offerType', type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Estilo CTA */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Estilo CTA
              </label>
              <div className="flex gap-2">
                {['urgent', 'professional', 'friendly'].map((style) => (
                  <Badge
                    key={style}
                    variant={ctaStyle === style ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => handlePropertyChange('ctaStyle', style)}
                  >
                    {style}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tema */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Tema
              </label>
              <div className="flex gap-2">
                {['premium', 'professional', 'success'].map((themeOption) => (
                  <Badge
                    key={themeOption}
                    variant={theme === themeOption ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => handlePropertyChange('theme', themeOption)}
                  >
                    {themeOption}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizOfferCTAInlineBlock;
