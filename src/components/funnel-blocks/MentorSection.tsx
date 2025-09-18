/* @ts-nocheck */
// @ts-nocheck
import { getOptimizedContainerClasses } from '@/config/containerConfig';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Award, Star, Heart, Users, TrendingUp } from 'lucide-react';
import { AnimatedWrapper } from '@/components/ui/animated-wrapper';
import { DeviceView, StyleProps } from './types';

interface MentorInfo {
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  credentials?: string[];
  achievements?: string[];
  experience?: string;
  specialties?: string[];
}

interface MentorSectionProps extends StyleProps {
  /** Informações do mentor */
  mentor: MentorInfo;
  /** Título da seção */
  title?: string;
  /** Subtítulo/descrição da seção */
  subtitle?: string;
  /** Layout da seção */
  layout?: 'horizontal' | 'vertical' | 'card';
  /** Mostrar credenciais */
  showCredentials?: boolean;
  /** Mostrar conquistas */
  showAchievements?: boolean;
  /** Mostrar especialidades */
  showSpecialties?: boolean;
  /** Configuração de animações */
  animationConfig?: {
    disabled?: boolean;
    duration?: number;
    delay?: number;
  };
  /** Configuração de viewport */
  deviceView?: DeviceView;
  /** Callback para ação */
  onAction?: () => void;
  /** Texto do botão de ação */
  actionText?: string;
}

/**
 * MentorSection - Seção de apresentação do mentor/especialista
 * Exibe credibilidade, experiência e autoridade
 */
export const MentorSection: React.FC<MentorSectionProps> = ({
  mentor,
  title = 'Conheça sua Mentora',
  subtitle,
  layout = 'horizontal',
  showCredentials = true,
  showAchievements = true,
  showSpecialties = true,
  animationConfig = {},
  deviceView = 'desktop',
  onAction,
  actionText = 'Quero Começar Agora',
  className,
  style,
  customStyles,
}) => {
  const { disabled: animationsDisabled, duration = 400, delay = 0 } = animationConfig;
  const isLowPerformance = deviceView === 'mobile';

  const getLayoutClasses = () => {
    if (layout === 'vertical' || deviceView === 'mobile') {
      return 'flex flex-col items-center text-center space-y-2';
    }
    if (layout === 'card') {
      return 'text-center';
    }
    return 'grid md:grid-cols-2 gap-8 items-center';
  };

  const getImageClasses = () => {
    if (layout === 'card') {
      return 'w-24 h-24 mx-auto';
    }
    if (layout === 'vertical' || deviceView === 'mobile') {
      return 'w-32 h-32 mx-auto';
    }
    return 'w-48 h-48';
  };

  return (
    <div className={`py-12 ${className || ''}`} style={style}>
      {customStyles && <style dangerouslySetInnerHTML={{ __html: customStyles }} />}

      {/* Header */}
      {(title || subtitle) && (
        <div className="text-center mb-10">
          {title && (
            <h2 className="text-2xl md:text-3xl font-playfair text-[#aa6b5d] mb-2">{title}</h2>
          )}
          {subtitle && (
            <p className="text-center text-[#3a3a3a] mb-6 max-w-lg mx-auto">{subtitle}</p>
          )}
          <div className="elegant-divider w-32 mx-auto"></div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-full mx-auto">
        <AnimatedWrapper
          animation={animationsDisabled || isLowPerformance ? 'none' : 'fade'}
          show={true}
          duration={duration}
          delay={delay}
        >
          <Card
            className={`p-8 bg-white shadow-lg border border-[#B89B7A]/20 ${layout === 'card' ? 'max-w-sm mx-auto' : ''}`}
          >
            <div className={getLayoutClasses()}>
              {/* Image */}
              <div
                className={`relative ${layout === 'horizontal' && deviceView !== 'mobile' ? 'order-2' : ''}`}
              >
                <div
                  className={`${getImageClasses()} rounded-full overflow-hidden border-4 border-[#B89B7A] shadow-lg relative`}
                >
                  <img
                    src={mentor.imageUrl}
                    alt={mentor.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                {/* Trust badge */}
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white p-2 rounded-full shadow-lg">
                  <Award className="w-4 h-4" />
                </div>
              </div>

              {/* Content */}
              <div
                className={`space-y-2 ${layout === 'horizontal' && deviceView !== 'mobile' ? 'order-1' : ''}`}
              >
                {/* Name and title */}
                <div>
                  <h3 className="text-2xl font-semibold text-[#432818] mb-1 flex items-center gap-2 justify-center md:justify-start">
                    <User className="w-5 h-5 text-[#B89B7A]" />
                    {mentor.name}
                  </h3>
                  <p className="text-lg text-[#aa6b5d] font-medium">{mentor.title}</p>
                </div>

                {/* Description */}
                <p className="text-[#432818] leading-relaxed">{mentor.description}</p>

                {/* Experience */}
                {mentor.experience && (
                  <div className="bg-[#f9f4ef] p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-[#B89B7A]" />
                      <span className="font-semibold text-[#432818] text-sm">Experiência</span>
                    </div>
                    <p className="text-sm text-[#432818]">{mentor.experience}</p>
                  </div>
                )}

                {/* Credentials */}
                {showCredentials && mentor.credentials && mentor.credentials.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-4 h-4 text-[#B89B7A]" />
                      <span className="font-semibold text-[#432818] text-sm">Credenciais</span>
                    </div>
                    <ul className="space-y-1">
                      {mentor.credentials.map((credential, index) => (
                        <li key={index} className="text-sm text-[#432818] flex items-start">
                          <span className="text-[#B89B7A] mr-2">•</span>
                          {credential}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Achievements */}
                {showAchievements && mentor.achievements && mentor.achievements.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="w-4 h-4 text-[#B89B7A]" />
                      <span className="font-semibold text-[#432818] text-sm">Conquistas</span>
                    </div>
                    <ul className="space-y-1">
                      {mentor.achievements.map((achievement, index) => (
                        <li key={index} className="text-sm text-[#432818] flex items-start">
                          <span className="text-[#B89B7A] mr-2">•</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Specialties */}
                {showSpecialties && mentor.specialties && mentor.specialties.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="w-4 h-4 text-[#B89B7A]" />
                      <span className="font-semibold text-[#432818] text-sm">Especialidades</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {mentor.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="bg-[#B89B7A]/10 text-[#432818] px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action */}
                {onAction && (
                  <div className="pt-4">
                    <Button
                      onClick={onAction}
                      className="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white px-6 py-3 rounded-lg hover:scale-105 transition-transform duration-300 w-full md:w-auto"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      {actionText}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </AnimatedWrapper>
      </div>
    </div>
  );
};

export default MentorSection;
