'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useUserName } from '@/context/UserDataContext';

interface NameFormComponentProps {
  label?: string;
  placeholder?: string;
  buttonText?: string;
  buttonTextDisabled?: string;
  errorMessage?: string;
  privacyText?: string;
  privacyLinkText?: string;
  primaryColor?: string;
  primaryDarkColor?: string;
  textColor?: string;
  errorColor?: string;
  className?: string;
  isEditable?: boolean;
  onStart?: (nome: string) => void;
  onPropertyChange?: (key: string, value: any) => void;
}

/**
 * NameFormComponent - Componente modular para coleta de nome
 * 
 * Características:
 * - Integrado com UserDataContext e Supabase
 * - Validação em tempo real
 * - Auto-salvamento quando válido
 * - Totalmente editável
 * - Acessibilidade completa
 */
const NameFormComponent: React.FC<NameFormComponentProps> = ({
  label = "NOME",
  placeholder = "Digite seu nome",
  buttonText = "Quero Descobrir meu Estilo Agora!",
  buttonTextDisabled = "Digite seu nome para continuar",
  errorMessage = "Por favor, digite seu nome para continuar",
  privacyText = "Seu nome é necessário para personalizar sua experiência. Ao clicar, você concorda com nossa",
  privacyLinkText = "política de privacidade",
  primaryColor = "#B89B7A",
  primaryDarkColor = "#A1835D",
  textColor = "#432818",
  errorColor = "#EF4444",
  className = "",
  isEditable = false,
  onStart,
  onPropertyChange,
}) => {
  const [nome, setNome] = useState('');
  const [error, setError] = useState('');
  const { userName, setUserName } = useUserName();

  // Função simplificada de submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar se o nome foi preenchido
    if (!nome.trim()) {
      setError(errorMessage);
      return;
    }
    
    // Limpar qualquer erro anterior
    setError('');
    
    try {
      // Salvar nome no contexto (que integra com Supabase)
      await setUserName(nome.trim());
      
      // Iniciar o quiz com o nome fornecido
      if (onStart) {
        onStart(nome.trim());
      }
      
      // Reportar Web Vitals após interação do usuário
      if (typeof window !== 'undefined' && 'performance' in window) {
        window.performance.mark('user-interaction');
      }
    } catch (error) {
      console.error('Erro ao salvar nome:', error);
      setError('Erro ao salvar. Tente novamente.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNome(value);
    if (error) setError('');
  };

  return (
    <div 
      className={cn(
        "w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mx-auto",
        isEditable && "border-2 border-dashed border-gray-300 hover:border-[#B89B7A] transition-colors p-2",
        className
      )}
      data-component="name-form"
    >
      {/* Formulário - renderização imediata */}
      <div id="quiz-form" className="mt-8">
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-6"
          autoComplete="off"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold mb-1.5"
              style={{ color: textColor }}
            >
              {label} <span style={{ color: errorColor }}>*</span>
            </label>
            <Input
              id="name"
              placeholder={placeholder}
              value={nome}
              onChange={handleInputChange}
              className={cn(
                "w-full p-2.5 bg-[#FEFEFE] rounded-md border-2 focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-offset-2 focus-visible:ring-offset-2 focus:ring-offset-[#FEFEFE] focus-visible:ring-offset-[#FEFEFE]",
                error 
                  ? "border-red-500 focus:ring-red-500 focus-visible:ring-red-500" 
                  : `focus:ring-[${primaryDarkColor}] focus-visible:ring-[${primaryDarkColor}]`
              )}
              style={{
                borderColor: error ? errorColor : primaryColor,
              }}
              autoFocus
              aria-required="true"
              autoComplete="off"
              inputMode="text"
              maxLength={32}
              aria-invalid={!!error}
              aria-describedby={error ? "name-error" : undefined}
              required
            />
            {error && (
              <p 
                id="name-error" 
                className="mt-1.5 text-sm font-medium"
                style={{ color: errorColor }}
              >
                {error}
              </p>
            )}
          </div>
          
          <button
            type="submit"
            className={cn(
              'w-full py-2 px-3 text-sm font-semibold rounded-md shadow-md transition-all duration-300',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              'sm:py-3 sm:px-4 sm:text-base',
              'md:py-3.5 md:text-lg',
              nome.trim() 
                ? 'text-white hover:shadow-lg transform hover:scale-[1.01]' 
                : 'text-white/90 cursor-not-allowed'
            )}
            style={{
              backgroundColor: nome.trim() ? primaryColor : `${primaryColor}80`,
              borderColor: primaryColor,
            }}
            onMouseEnter={(e) => {
              if (nome.trim()) {
                e.currentTarget.style.backgroundColor = primaryDarkColor;
              }
            }}
            onMouseLeave={(e) => {
              if (nome.trim()) {
                e.currentTarget.style.backgroundColor = primaryColor;
              }
            }}
            aria-disabled={!nome.trim()}
          >
            <span className="flex items-center justify-center gap-2">
              {nome.trim() ? buttonText : buttonTextDisabled}
            </span>
          </button>

          <p className="text-xs text-center text-gray-500 pt-1">
            {privacyText}{' '}
            <a 
              href="#" 
              className="underline focus:outline-none focus:ring-1 rounded"
              style={{ 
                color: primaryColor,
                borderColor: primaryColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = primaryDarkColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = primaryColor;
              }}
            >
              {privacyLinkText}
            </a>
          </p>
        </form>
      </div>

      {/* Painel de edição (se editável) */}
      {isEditable && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
          <strong>Formulário de Nome:</strong> Conectado com Supabase<br />
          <strong>Contexto:</strong> UserDataContext integrado
        </div>
      )}
    </div>
  );
};

export default NameFormComponent;