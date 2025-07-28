
import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';
import Logo from './ui/logo';

interface QuizWelcomeProps {
  onStart: () => void;
}

export const QuizWelcome = ({ onStart }: QuizWelcomeProps) => {
  const [name, setName] = useState('');
  const { login } = useAuth();

  const handleStart = () => {
    if (name.trim()) {
      login(name.trim());
      localStorage.setItem('userName', name.trim());
      onStart();
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-xl mx-auto flex flex-col items-center px-4 py-8">
        {/* Logo and Progress Bar */}
        <Logo className="h-16 mb-4" />
        <div className="w-full max-w-[140px] h-[3px] bg-brand-gold mb-2" />
        <div className="w-full max-w-[500px] h-[1px] bg-[#E5E2DE]" />

        {/* Title */}
        <h1 className="font-playfair text-3xl font-medium text-[#1A1818] text-center mt-8 mb-10">
          Teste de Estilo Pessoal
        </h1>

        {/* Main Image */}
        <div className="w-full max-w-2xl mb-12">
          <img
            src="/lovable-uploads/9f029fbb-cabe-48ef-9877-aad214e94c60.png"
            alt="Mulheres estilosas"
            className="w-full h-auto"
          />
        </div>

        {/* Form */}
        <div className="w-full max-w-md">
          <form
            onSubmit={e => { e.preventDefault(); handleStart(); }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-[#1A1818] text-sm font-medium"
              >
                NOME <span className="text-brand-gold">*</span>
              </label>
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Digite seu nome aqui..."
                className="w-full h-12 px-4 bg-[#F5F5F5] border-none rounded-md text-[#1A1818] placeholder:text-[#8E9196]"
              />
            </div>
            
            <Button
              type="submit"
              disabled={!name.trim()}
              className="w-full h-12 bg-[#C1A57B] hover:bg-[#B89B7A] text-white font-medium rounded-md transition-colors"
            >
              Continuar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
