import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AnimatedNameFormProps {
  onSubmit: (name: string) => void;
}

const AnimatedNameForm: React.FC<AnimatedNameFormProps> = ({ onSubmit }) => {
  const [nome, setNome] = useState('');
  const [touched, setTouched] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const isValid = nome.trim().length > 0;
  const showError = (touched || formSubmitted) && !isValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (isValid) {
      onSubmit(nome);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-4"
      aria-live="polite"
      autoComplete="off"
      noValidate
    >
      <div>
        <label htmlFor="name" className="block text-xs font-semibold text-[#432818] mb-1.5">
          NOME
        </label>
        <Input
          id="name"
          placeholder="Digite seu nome"
          value={nome}
          onChange={e => setNome(e.target.value)}
          onBlur={() => setTouched(true)}
          className={cn(
            'w-full p-2.5 bg-[#FEFEFE] rounded-md transition-all duration-200',
            showError
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-[#B89B7A] focus:border-[#A1835D] focus:ring-[#A1835D]'
          )}
          autoFocus
          aria-required="true"
          aria-invalid={showError}
          aria-describedby={showError ? 'name-error' : undefined}
          autoComplete="off"
          inputMode="text"
          maxLength={32}
        />
        {showError && (
          <p id="name-error" style={{ color: '#432818' }} className="text-sm transition-all">
            Por favor, digite seu nome para continuar
          </p>
        )}
      </div>

      <button
        type="submit"
        className={cn(
          'w-full py-3 px-4 text-base font-semibold rounded-md shadow-md transition-all duration-200',
          'bg-[#B89B7A] text-white hover:bg-[#A1835D] active:bg-[#947645] hover:shadow-lg',
          'focus:outline-none focus:ring-2 focus:ring-[#B89B7A] focus:ring-offset-2 sm:py-3.5 sm:text-lg',
          'disabled:opacity-70 disabled:cursor-not-allowed'
        )}
        disabled={formSubmitted && !isValid}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
      >
        <span className="flex items-center justify-center gap-2">
          <span className={isButtonHovered ? 'relative top-px' : ''}></span>
          Quero Descobrir meu Estilo Agora!
        </span>
      </button>

      <p style={{ color: '#8B7355' }}>
        Ao clicar, você concorda com nossa{' '}
        <a
          href="#"
          className="text-[#B89B7A] hover:text-[#A1835D] underline focus:outline-none focus:ring-1 focus:ring-[#B89B7A] rounded"
        >
          política de privacidade
        </a>
      </p>
    </form>
  );
};

export default AnimatedNameForm;
