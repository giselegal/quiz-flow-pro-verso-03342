import React, { useState, useCallback } from 'react';
import { User } from 'lucide-react';

interface ConnectedLeadFormProps {
  onSubmit?: (data: { name: string }) => void;
  className?: string;
}

/**
 * 🔗 CONNECTED LEAD FORM - INTEGRADO COM QUIZ HOOKS
 *
 * Formulário que dispara eventos customizados para ConnectedTemplateWrapper capturar
 * - Captura nome do usuário
 * - Dispara evento 'quiz-form-complete' para integração com useQuizLogic
 * - Validação em tempo real
 */
const ConnectedLeadForm: React.FC<ConnectedLeadFormProps> = ({ onSubmit, className = '' }) => {
  const [name, setName] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validação em tempo real
  const validateName = useCallback((value: string) => {
    const trimmed = value.trim();
    const valid = trimmed.length >= 2 && trimmed.length <= 50;
    setIsValid(valid);

    // Disparar evento de mudança para outros componentes
    window.dispatchEvent(
      new CustomEvent('quiz-input-change', {
        detail: {
          blockId: 'step01-lead-form',
          field: 'name',
          value: trimmed,
          valid: valid,
        },
      })
    );

    return valid;
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    validateName(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateName(name)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = { name: name.trim() };

      console.log('📋 ConnectedLeadForm: Submetendo formulário', formData);

      // ✅ DISPARAR EVENTO PARA CONNECTEDTEMPLATEWRAPPER
      window.dispatchEvent(
        new CustomEvent('quiz-form-complete', {
          detail: {
            blockId: 'step01-lead-form',
            formData,
            isValid: true,
          },
        })
      );

      // Callback opcional
      if (onSubmit) {
        onSubmit(formData);
      }

      // Feedback visual
      console.log('✅ Formulário enviado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao enviar formulário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`connected-lead-form w-full max-w-md mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campo de nome */}
        <div className="space-y-2">
          <label
            htmlFor="quiz-name-input"
            className="block text-sm font-semibold text-[#432818] uppercase tracking-wide"
          >
            NOME
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="quiz-name-input"
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Digite seu nome"
              className={`
                w-full pl-10 pr-4 py-3 border-2 rounded-lg text-[#432818] 
                placeholder-gray-400 focus:outline-none focus:border-[#B89B7A] 
                transition-colors duration-200
                ${isValid ? 'border-green-300 bg-green-50' : 'border-gray-300'}
                ${name && !isValid ? 'border-red-300 bg-red-50' : ''}
              `}
              required
              minLength={2}
              maxLength={50}
            />
          </div>

          {/* Mensagem de validação */}
          {name && !isValid && (
            <p className="text-sm text-red-600">Nome deve ter entre 2 e 50 caracteres</p>
          )}
          {isValid && <p className="text-sm text-green-600">✓ Nome válido</p>}
        </div>

        {/* Botão de submit */}
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`
            w-full py-3 px-6 rounded-lg font-semibold text-lg 
            transition-all duration-200 transform
            ${
              isValid && !isSubmitting
                ? 'bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white hover:scale-105 shadow-lg hover:shadow-xl'
                : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60'
            }
          `}
        >
          {isSubmitting ? (
            <>
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processando...
            </>
          ) : isValid ? (
            'Quero Descobrir meu Estilo Agora!'
          ) : (
            'Digite seu nome para continuar'
          )}
        </button>

        {/* Texto de privacidade */}
        <p className="text-xs text-center text-gray-500">
          Seu nome é necessário para personalizar sua experiência. <br />
          Ao clicar, você concorda com nossa{' '}
          <a href="#" className="text-[#B89B7A] hover:text-[#A1835D] underline">
            política de privacidade
          </a>
        </p>

        {/* Debug info */}
        <div className="text-xs text-gray-400 text-center">
          Debug: {name ? `Nome: "${name.trim()}"` : 'Nenhum nome inserido'} | Válido:{' '}
          {isValid ? 'Sim' : 'Não'}
        </div>
      </form>
    </div>
  );
};

export default ConnectedLeadForm;
