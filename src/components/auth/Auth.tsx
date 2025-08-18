import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Estilos CSS customizados para animações sofisticadas
const authStyles = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(184, 155, 122, 0.3); }
    50% { box-shadow: 0 0 40px rgba(184, 155, 122, 0.6), 0 0 60px rgba(184, 155, 122, 0.4); }
  }
  
  @keyframes particle-float {
    0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(-20px) rotate(360deg); opacity: 0; }
  }

  .logo-container:hover {
    animation: glow 2s ease-in-out infinite;
  }
  
  .floating-particle {
    animation: particle-float 4s ease-in-out infinite;
  }
  
  .shimmer-effect {
    position: relative;
    overflow: hidden;
  }
  
  .shimmer-effect::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    animation: shimmer 3s ease-in-out infinite;
  }
`;

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de autenticação
    console.log('Auth:', { email, password, isLogin });
  };

  return (
    <>
      <style>{authStyles}</style>
      <div
        className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        style={{
          backgroundColor: '#FEFEFE',
          background: 'linear-gradient(135deg, #FEFEFE 0%, #FAF9F7 50%, #F3E8E6 100%)',
        }}
      >
        {/* Elementos de fundo decorativos */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Círculos flutuantes de fundo */}
          <div
            className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-5 animate-pulse"
            style={{ backgroundColor: '#B89B7A', animationDuration: '4s' }}
          ></div>
          <div
            className="absolute bottom-20 right-10 w-24 h-24 rounded-full opacity-10"
            style={{ backgroundColor: '#A88B6A', animation: 'float 6s ease-in-out infinite' }}
          ></div>
          <div
            className="absolute top-1/2 left-5 w-16 h-16 rounded-full opacity-5"
            style={{
              backgroundColor: '#8B7355',
              animation: 'float 8s ease-in-out infinite reverse',
            }}
          ></div>
        </div>

        <div
          className="relative max-w-md w-full rounded-2xl shadow-2xl p-8 border-0 backdrop-blur-sm logo-container"
          style={{
            backgroundColor: 'rgba(254, 254, 254, 0.95)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(184, 155, 122, 0.1)',
            border: '1px solid rgba(184, 155, 122, 0.2)',
          }}
        >
          {/* Logo da Gisele Galvão com efeitos sofisticados */}
          <div className="text-center mb-8">
            <div className="relative mx-auto w-24 h-24 mb-6">
              {/* Círculos de fundo com animação */}
              <div
                className="absolute inset-0 rounded-full animate-pulse"
                style={{ backgroundColor: '#B89B7A', opacity: 0.2 }}
              ></div>
              <div
                className="absolute inset-2 rounded-full animate-ping"
                style={{ backgroundColor: '#A88B6A', opacity: 0.3, animationDuration: '3s' }}
              ></div>
              <div
                className="absolute inset-4 rounded-full"
                style={{ backgroundColor: '#8B7355', opacity: 0.1, animation: 'pulse 4s infinite' }}
              ></div>

              {/* Container da logo com efeitos */}
              <div
                className="relative w-full h-full rounded-full overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-110 hover:rotate-3 shimmer-effect"
                style={{
                  border: '3px solid #B89B7A',
                  boxShadow:
                    '0 0 30px rgba(184, 155, 122, 0.4), 0 0 60px rgba(184, 155, 122, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(184, 155, 122, 0.05) 100%)',
                }}
              >
                {/* Reflexo de vidro */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)',
                    backdropFilter: 'blur(1px)',
                  }}
                ></div>

                {/* Logo principal */}
                <img
                  src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
                  alt="Gisele Galvão - Personal Stylist & Business Coach"
                  className="w-full h-full object-cover transform transition-all duration-700 hover:brightness-110"
                  style={{ filter: 'contrast(1.1) saturate(1.2)' }}
                />

                {/* Brilho que se move */}
                <div
                  className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-1000"
                  style={{
                    background:
                      'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.3), transparent, rgba(255,255,255,0.2), transparent)',
                    animation: 'spin 8s linear infinite',
                  }}
                ></div>
              </div>

              {/* Partículas flutuantes */}
              <div
                className="absolute -top-2 -right-2 w-2 h-2 rounded-full floating-particle"
                style={{
                  backgroundColor: '#B89B7A',
                  animationDelay: '0s',
                  animationDuration: '2s',
                }}
              ></div>
              <div
                className="absolute -bottom-1 -left-1 w-1 h-1 rounded-full floating-particle"
                style={{
                  backgroundColor: '#A88B6A',
                  animationDelay: '0.5s',
                  animationDuration: '3s',
                }}
              ></div>
              <div
                className="absolute top-0 left-0 w-1.5 h-1.5 rounded-full floating-particle"
                style={{
                  backgroundColor: '#8B7355',
                  animationDelay: '1s',
                  animationDuration: '2.5s',
                }}
              ></div>
            </div>

            {/* Títulos elegantes */}
            <div className="space-y-3">
              <h1
                className="text-3xl font-bold tracking-wide"
                style={{
                  color: '#432818',
                  textShadow: '0 2px 10px rgba(67, 40, 24, 0.1)',
                  background: 'linear-gradient(135deg, #432818 0%, #B89B7A 50%, #432818 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {isLogin ? 'Bem-vindo de volta' : 'Junte-se a nós'}
              </h1>
              <p className="text-lg font-medium" style={{ color: '#6B4F43' }}>
                Acesse sua conta{' '}
                <span className="font-bold" style={{ color: '#B89B7A' }}>
                  QuizFlow
                </span>
              </p>
              <p className="text-sm opacity-80" style={{ color: '#8B7355' }}>
                Plataforma oficial de conversão digital
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
                style={{ color: '#432818' }}
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoComplete="email"
                className="border-2 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20"
                style={{ borderColor: '#E5DDD5', backgroundColor: '#FEFEFE' }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
                style={{ color: '#432818' }}
              >
                Senha
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="border-2 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20"
                style={{ borderColor: '#E5DDD5', backgroundColor: '#FEFEFE' }}
              />
            </div>

            <Button
              type="submit"
              className="w-full text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              style={{ backgroundColor: '#B89B7A' }}
            >
              {isLogin ? 'Entrar na Plataforma' : 'Criar Minha Conta'}
            </Button>
          </form>

          <div className="mt-8 text-center space-y-6">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium hover:underline transition-colors relative group"
              style={{ color: '#B89B7A' }}
            >
              <span className="relative z-10">
                {isLogin ? 'Não tem conta? Criar uma gratuita' : 'Já tem conta? Entrar agora'}
              </span>
              <div
                className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: '#B89B7A', opacity: 0.1 }}
              ></div>
            </button>

            {/* Divisor elegante */}
            <div className="flex items-center justify-center space-x-4 my-6">
              <div className="h-px w-12" style={{ backgroundColor: '#E5DDD5' }}></div>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#B89B7A' }}></div>
              <div className="h-px w-12" style={{ backgroundColor: '#E5DDD5' }}></div>
            </div>

            {/* Branding e direitos */}
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <p className="text-xs font-medium tracking-wide" style={{ color: '#6B4F43' }}>
                  Transforme dados em insights • Simplifique • Interaja • Converta
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <div
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: '#B89B7A' }}
                  ></div>
                  <p className="text-xs" style={{ color: '#8B7355' }}>
                    Powered by <span className="font-semibold">Gisele Galvão</span>
                  </p>
                  <div
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: '#B89B7A' }}
                  ></div>
                </div>
              </div>

              {/* Informações de marca e copyright */}
              <div className="pt-4 border-t space-y-2" style={{ borderColor: '#E5DDD5' }}>
                <div className="flex items-center justify-center space-x-1">
                  <div
                    className="w-3 h-3 flex items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: '#B89B7A' }}
                  >
                    ©
                  </div>
                  <p className="text-xs" style={{ color: '#6B4F43' }}>
                    2025 Gisele Galvão. Todos os direitos reservados.
                  </p>
                </div>

                <p
                  className="text-xs leading-relaxed max-w-sm mx-auto"
                  style={{ color: '#8B7355' }}
                >
                  <span className="font-semibold">QuizFlow</span> é uma marca registrada de
                  <span className="font-semibold">
                    {' '}
                    Gisele Galvão Personal Stylist & Business Coach
                  </span>
                  . Plataforma especializada em conversão digital através de quizzes interativos.
                </p>

                <div className="flex items-center justify-center space-x-4 text-xs mt-3">
                  <a
                    href="#"
                    className="hover:underline transition-colors"
                    style={{ color: '#B89B7A' }}
                  >
                    Termos de Uso
                  </a>
                  <div
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: '#E5DDD5' }}
                  ></div>
                  <a
                    href="#"
                    className="hover:underline transition-colors"
                    style={{ color: '#B89B7A' }}
                  >
                    Política de Privacidade
                  </a>
                  <div
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: '#E5DDD5' }}
                  ></div>
                  <a
                    href="#"
                    className="hover:underline transition-colors"
                    style={{ color: '#B89B7A' }}
                  >
                    Contato
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
