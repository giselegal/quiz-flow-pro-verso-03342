import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sharedStyles } from '@/styles/sharedStyles';
import { ContentContainer } from './shared/ContentContainer';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Sparkles, Users, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizIntroProps {
  onStart: (userName: string) => void;
  globalStyles?: Record<string, any>;
}

const QuizIntro: React.FC<QuizIntroProps> = ({ onStart, globalStyles = {} }) => {
  const [userName, setUserName] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      localStorage.setItem('userName', userName.trim());
      onStart(userName.trim());
    }
  };

  const backgroundStyle = {
    background: globalStyles.backgroundColor || sharedStyles.colors.background,
  };

  const textStyle = {
    color: globalStyles.textColor || sharedStyles.colors.textPrimary,
  };

  return (
    <div
      className={cn(
        'min-h-screen flex items-center justify-center p-4 transition-all duration-700',
        isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      )}
      style={backgroundStyle}
    >
      <ContentContainer size="md" className="text-center">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img
                src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744735333/Logomarca_Colorida_qahz04.webp"
                alt="Logo Mayara Moda"
                className="w-auto rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                width={120}
                height={50}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                style={{
                  objectFit: 'contain',
                  maxWidth: '120px',
                  aspectRatio: '120 / 50',
                }}
              />
            </div>

            {/* Title */}
            <h1
              className="text-3xl md:text-5xl font-playfair font-bold leading-tight"
              style={textStyle}
            >
              Descubra Seu{' '}
              <span className="bg-gradient-to-r from-[#B89B7A] to-[#D4B896] bg-clip-text text-transparent">
                Estilo Pessoal
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto opacity-90"
              style={textStyle}
            >
              Um quiz personalizado para descobrir qual estilo de roupa combina mais com você e
              receber dicas exclusivas.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <Card className="border-[#B89B7A]/20 bg-white/10 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-8 h-8 text-[#B89B7A] mx-auto mb-3" />
                <h3 className="font-semibold mb-2" style={textStyle}>
                  Personalizado
                </h3>
                <p className="text-sm opacity-80" style={textStyle}>
                  Baseado nas suas preferências únicas
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#B89B7A]/20 bg-white/10 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-[#B89B7A] mx-auto mb-3" />
                <h3 className="font-semibold mb-2" style={textStyle}>
                  +10.000
                </h3>
                <p className="text-sm opacity-80" style={textStyle}>
                  Pessoas já descobriram seu estilo
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#B89B7A]/20 bg-white/10 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Award className="w-8 h-8 text-[#B89B7A] mx-auto mb-3" />
                <h3 className="font-semibold mb-2" style={textStyle}>
                  Gratuito
                </h3>
                <p className="text-sm opacity-80" style={textStyle}>
                  Resultado completo sem custo
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Name Input Form */}
          <Card className="max-w-md mx-auto border-[#B89B7A]/20 bg-white/10 backdrop-blur-sm">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="userName" className="block text-sm font-medium" style={textStyle}>
                    Como você gostaria de ser chamada?
                  </label>
                  <Input
                    id="userName"
                    type="text"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    placeholder="Digite seu primeiro nome"
                    className="w-full bg-white/20 border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A] placeholder:text-gray-400"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#B89B7A] to-[#D4B896] hover:from-[#A38A69] hover:to-[#C4A686] text-white font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  disabled={!userName.trim()}
                >
                  Começar Quiz
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Hero Image */}
          <div className="mt-8">
            <img
              src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744735324/Sem_nome_1920_x_1080_px_1_c2qg9v.webp"
              alt="Mulher elegante representando diferentes estilos de moda"
              className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl"
              width={800}
              height={400}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              id="hero-image"
            />
          </div>

          {/* Footer Text */}
          <p className="text-sm opacity-70 max-w-md mx-auto" style={textStyle}>
            ✨ Este quiz leva apenas 3 minutos e foi desenvolvido por especialistas em moda
          </p>
        </div>
      </ContentContainer>
    </div>
  );
};

export default QuizIntro;
