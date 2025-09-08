// @ts-nocheck
import React, { useEffect, useState, useCallback } from 'react';
import { useQuizResult } from '@/hooks/useQuizResult';
import { StorageService } from '@/services/core/StorageService';
import { cleanEditorLocalStorage } from '@/utils/cleanStorage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Share2, ArrowRight, Trophy, Star, Check, Heart } from 'lucide-react';

/**
 * 🎯 COMPONENTE STEP 20 - RESULTADO FINAL DO QUIZ
 * 
 * FASE 1 - CORREÇÕES CRÍTICAS:
 * ✅ Componente criado (estava faltando)
 * ✅ Limpeza automática do localStorage
 * ✅ Fallback robusto para cálculos
 * ✅ UI consistente com design system
 */

interface Step20ResultProps {
  className?: string;
  isPreview?: boolean;
}

const Step20Result: React.FC<Step20ResultProps> = ({
  className = "",
  isPreview = false
}) => {
  const { primaryStyle, secondaryStyles, isLoading, error, retry } = useQuizResult();
  const [userName, setUserName] = useState<string>('');
  const [isStorageCleaned, setIsStorageCleaned] = useState(false);

  // 🧹 CORREÇÃO CRÍTICA 1: Limpeza automática do localStorage
  const cleanStorageOnMount = useCallback(() => {
    try {
      // Verificar se localStorage está cheio ou corrompido
      const usage = JSON.stringify(localStorage).length;
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (usage > maxSize * 0.8) {
        console.warn('🧹 [Step20Result] localStorage próximo do limite, limpando...');
        cleanEditorLocalStorage();
        
        // Remover dados obsoletos específicos
        ['editor_config', 'quiz_old_cache', 'temp_selections'].forEach(key => {
          try {
            localStorage.removeItem(key);
          } catch { /* ignore */ }
        });
      }
      
      setIsStorageCleaned(true);
    } catch (error) {
      console.error('❌ Erro na limpeza do storage:', error);
      setIsStorageCleaned(true); // Continuar mesmo com erro
    }
  }, []);

  // 📱 Carregar nome do usuário
  useEffect(() => {
    const loadUserData = () => {
      const name = StorageService.safeGetString('userName') || 
                   StorageService.safeGetString('user_name') || 
                   'Participante';
      setUserName(name);
    };

    loadUserData();
    cleanStorageOnMount();

    // Listener para mudanças no nome
    const handler = () => loadUserData();
    window.addEventListener('storage', handler);
    window.addEventListener('quiz-result-refresh', handler);
    
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('quiz-result-refresh', handler);
    };
  }, [cleanStorageOnMount]);

  // 🎨 Ícones dos resultados
  const getStyleIcon = (style: string) => {
    switch (style?.toLowerCase()) {
      case 'clássico': case 'classic': return <Trophy className="w-8 h-8 text-amber-600" />;
      case 'romântico': case 'romantic': return <Heart className="w-8 h-8 text-rose-500" />;
      case 'dramático': case 'dramatic': return <Star className="w-8 h-8 text-purple-600" />;
      case 'natural': return <Check className="w-8 h-8 text-green-600" />;
      default: return <Trophy className="w-8 h-8 text-amber-600" />;
    }
  };

  // 🎨 Cores do estilo
  const getStyleColors = (style: string) => {
    switch (style?.toLowerCase()) {
      case 'clássico': case 'classic': 
        return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800' };
      case 'romântico': case 'romantic': 
        return { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800' };
      case 'dramático': case 'dramatic': 
        return { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800' };
      case 'natural': 
        return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' };
      default: 
        return { bg: 'bg-stone-50', border: 'border-stone-200', text: 'text-stone-800' };
    }
  };

  // 🔄 Loading state
  if (isLoading || !isStorageCleaned) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            {!isStorageCleaned ? 'Preparando ambiente...' : 'Calculando seu resultado...'}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {!isStorageCleaned 
              ? 'Otimizando dados para melhor experiência'
              : 'Analisando suas respostas para descobrir seu estilo predominante'
            }
          </p>
        </div>
      </div>
    );
  }

  // ❌ Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <div className="text-red-500 mb-6">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-red-800 mb-3">Ops, algo deu errado!</h2>
            <p className="text-red-600 mb-6">
              {typeof error === 'string' ? error : 'Não foi possível calcular seu resultado.'}
            </p>
            <div className="space-y-3">
              <Button onClick={retry} variant="outline" className="w-full">
                Tentar Novamente
              </Button>
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full"
              >
                Recarregar Página
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 🎉 Success state
  if (!primaryStyle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <div className="text-yellow-600 mb-6">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-yellow-800 mb-3">Resultado não encontrado</h2>
            <p className="text-yellow-700 mb-6">
              Complete o quiz para descobrir seu estilo pessoal!
            </p>
            <Button onClick={() => window.location.href = '/step/1'} className="w-full">
              Fazer Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const styleColors = getStyleColors(primaryStyle.style);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200">
      <div className="container mx-auto px-4 py-12">
        {/* Header com saudação */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Parabéns, {userName}! 🎉
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descobrimos seu estilo único e preparamos recomendações especiais para você
          </p>
        </div>

        {/* Card principal do resultado */}
        <Card className="max-w-4xl mx-auto mb-8">
          <CardContent className="p-8">
            {/* Estilo principal */}
            <div className={`${styleColors.bg} ${styleColors.border} border-2 rounded-2xl p-8 mb-8`}>
              <div className="flex items-center justify-center mb-6">
                {getStyleIcon(primaryStyle.style)}
              </div>
              
              <h2 className={`text-3xl md:text-4xl font-bold ${styleColors.text} text-center mb-4`}>
                Seu Estilo: {primaryStyle.category || primaryStyle.style}
              </h2>
              
              <div className="text-center mb-6">
                <div className={`inline-flex items-center px-4 py-2 rounded-full ${styleColors.bg} ${styleColors.border} border`}>
                  <span className={`text-lg font-medium ${styleColors.text}`}>
                    {primaryStyle.percentage?.toFixed(0) || primaryStyle.score || 85}% de compatibilidade
                  </span>
                </div>
              </div>

              <p className="text-center text-muted-foreground text-lg leading-relaxed">
                {primaryStyle.description || 
                 `Seu estilo ${primaryStyle.category || primaryStyle.style} reflete sua personalidade única e forma de expressão. 
                 Através das suas escolhas, podemos ver uma clara preferência por elementos que representam este estilo.`}
              </p>
            </div>

            {/* Estilos secundários */}
            {secondaryStyles && secondaryStyles.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
                  Estilos Complementares
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {secondaryStyles.slice(0, 2).map((style, index) => {
                    const colors = getStyleColors(style.style);
                    return (
                      <div key={index} className={`${colors.bg} ${colors.border} border rounded-xl p-6`}>
                        <div className="flex items-center justify-between">
                          <span className={`font-semibold ${colors.text}`}>
                            {style.category || style.style}
                          </span>
                          <span className="text-muted-foreground">
                            {style.percentage?.toFixed(0) || style.score || 0}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="text-center">
              <Button size="lg" className="px-8 py-4 text-lg font-semibold">
                <ArrowRight className="w-5 h-5 mr-2" />
                Ver Minha Consultoria Personalizada
              </Button>
              
              <div className="mt-6">
                <Button variant="outline" size="lg" className="mr-4">
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar Resultado
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximos passos */}
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-3">Próximos Passos</h3>
            <p className="text-muted-foreground mb-4">
              Agora você pode acessar sua consultoria personalizada com recomendações exclusivas 
              baseadas no seu estilo!
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => window.location.href = '/step/1'}>
                Refazer Quiz
              </Button>
              <Button onClick={retry}>
                Recalcular
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Step20Result;