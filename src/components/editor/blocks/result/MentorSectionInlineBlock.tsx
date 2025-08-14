import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { Award, Users, BookOpen, Star } from 'lucide-react';

/**
 * MentorSectionInlineBlock - Mentor and trust section
 * Shows mentor credentials and expertise
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */
const MentorSectionInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  // Destructure properties with defaults
  const {
    mentorName = 'Gisele Galvão',
    mentorTitle = 'Consultora de Imagem & Personal Stylist',
    mentorImage = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/GISELE_MENTOR_FOTO_PROFISSIONAL_r14oz2.webp',
    mentorDescription = 'Com mais de 10 anos de experiência em consultoria de imagem, Gisele já transformou a vida de mais de 2.000 mulheres, ajudando-as a descobrir seu estilo único e elevar sua autoestima.',
    credentials = [
      'Formação em Personal Styling pela ESEEI',
      'Consultora certificada em Coloração Pessoal',
      'Especialista em Visagismo e Harmonia Facial',
      'Mais de 2.000 mulheres atendidas'
    ],
    achievements = [
      { icon: 'users', value: '2000+', label: 'Mulheres Transformadas' },
      { icon: 'award', value: '10+', label: 'Anos de Experiência' },
      { icon: 'book', value: '50+', label: 'Cursos e Certificações' },
      { icon: 'star', value: '98%', label: 'Clientes Satisfeitas' }
    ],
    testimonialQuote = 'Gisele tem um dom especial para identificar o que realmente funciona para cada pessoa. Ela mudou completamente minha forma de me vestir!',
    testimonialAuthor = 'Maria Helena, Empresária',
    showCredentials = true,
    showAchievements = true,
    showTestimonial = true,
    backgroundColor = '#ffffff',
    accentColor = '#B89B7A',
    textColor = '#432818',
    containerWidth = 'xxlarge',
    spacing = 'large',
    marginTop = 0,
    marginBottom = 24,
    textAlign = 'center',
  } = block?.properties ?? {};

  // Container classes
  const containerClasses = cn(
    'w-full',
    {
      'max-w-sm mx-auto': containerWidth === 'small',
      'max-w-md mx-auto': containerWidth === 'medium', 
      'max-w-lg mx-auto': containerWidth === 'large',
      'max-w-2xl mx-auto': containerWidth === 'xlarge',
      'max-w-4xl mx-auto': containerWidth === 'xxlarge',
      'max-w-full': containerWidth === 'full',
    },
    {
      'p-4': spacing === 'small',
      'p-6': spacing === 'normal',
      'p-8': spacing === 'large',
    },
    {
      'mt-0': marginTop === 0,
      'mt-4': marginTop <= 16,
      'mt-6': marginTop <= 24,
      'mt-8': marginTop <= 32,
    },
    {
      'mb-0': marginBottom === 0,
      'mb-4': marginBottom <= 16,
      'mb-6': marginBottom <= 24,
      'mb-8': marginBottom <= 32,
    },
    {
      'text-left': textAlign === 'left',
      'text-center': textAlign === 'center',
      'text-right': textAlign === 'right',
    },
    'border border-opacity-10 rounded-lg',
    isSelected && 'ring-2 ring-blue-500 ring-opacity-50',
    className
  );

  const containerStyle = {
    backgroundColor,
    color: textColor,
    borderColor: accentColor + '20',
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'users':
        return Users;
      case 'award':
        return Award;
      case 'book':
        return BookOpen;
      case 'star':
        return Star;
      default:
        return Award;
    }
  };

  return (
    <div className={containerClasses} onClick={onClick} style={containerStyle}>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair" style={{ color: accentColor }}>
            Quem é Sua Mentora
          </h2>
          <div 
            className="w-24 h-1 mx-auto rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
          {/* Mentor Image */}
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={`${mentorImage}?q=auto:best&f=auto&w=400`}
                alt={mentorName}
                className="w-full max-w-[300px] h-auto rounded-lg shadow-lg object-cover"
              />
              {/* Professional Badge */}
              <div 
                className="absolute -bottom-4 -right-4 px-4 py-2 rounded-full shadow-lg text-white text-sm font-bold transform rotate-12"
                style={{ background: `linear-gradient(to right, ${accentColor}, #aa6b5d)` }}
              >
                EXPERT
              </div>
            </div>
          </div>

          {/* Mentor Info */}
          <div className="space-y-6 text-left">
            <div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: accentColor }}>
                {mentorName}
              </h3>
              <p className="text-lg font-medium opacity-90 mb-4">
                {mentorTitle}
              </p>
              <p className="leading-relaxed opacity-90">
                {mentorDescription}
              </p>
            </div>

            {/* Credentials */}
            {showCredentials && credentials.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3" style={{ color: accentColor }}>
                  Formação e Credenciais:
                </h4>
                <ul className="space-y-2">
                  {credentials.map((credential, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Award className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: accentColor }} />
                      <span>{credential}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Achievements */}
        {showAchievements && achievements.length > 0 && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-6 text-center" style={{ color: accentColor }}>
              Resultados Comprovados
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => {
                const IconComponent = getIcon(achievement.icon);
                return (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor + '20' }}>
                      <IconComponent className="w-6 h-6" style={{ color: accentColor }} />
                    </div>
                    <div className="text-2xl font-bold mb-1" style={{ color: accentColor }}>
                      {achievement.value}
                    </div>
                    <div className="text-xs opacity-75">
                      {achievement.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Client Testimonial */}
        {showTestimonial && testimonialQuote && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-opacity-10 max-w-2xl mx-auto" style={{ borderColor: accentColor }}>
            <div className="text-center">
              <blockquote className="text-lg italic mb-4 leading-relaxed" style={{ color: accentColor }}>
                "{testimonialQuote}"
              </blockquote>
              {testimonialAuthor && (
                <footer className="text-sm font-medium opacity-75">
                  — {testimonialAuthor}
                </footer>
              )}
            </div>
            
            {/* Stars */}
            <div className="flex justify-center gap-1 mt-3">
              {[...Array(5)].map((_, index) => (
                <Star key={index} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
        )}

        {/* Trust Message */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg max-w-2xl mx-auto">
          <div className="text-center">
            <h4 className="font-semibold mb-2" style={{ color: accentColor }}>
              ✨ Sua Transformação em Mãos Experientes
            </h4>
            <p className="text-sm opacity-90">
              Quando você escolhe nosso guia, está investindo em conhecimento validado por anos de experiência prática e milhares de transformações reais.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorSectionInlineBlock;