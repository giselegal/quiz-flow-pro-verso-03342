import React, { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Star, Zap, Target, Award, Crown,
  TrendingUp, Shield, Compass, Gift,
  ChevronDown, ChevronUp, ExternalLink,
  Download, Share2, Copy, Mail
} from 'lucide-react';

interface QuizResult {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  score: number;
  percentage: number;
  characteristics: string[];
  recommendations: string[];
  color: string;
  icon: string;
}

interface QuizResultsProps {
  results: QuizResult[];
  primaryResult: QuizResult;
  userName?: string;
  onShare?: (result: QuizResult) => void;
  onDownload?: (result: QuizResult) => void;
  onRestart?: () => void;
  showDetailedBreakdown?: boolean;
}

/**
 * 🎯 COMPONENTE DE RESULTADOS DO QUIZ
 * 
 * Exibe resultados finais com:
 * - Resultado principal destacado
 * - Breakdown detalhado por categoria
 * - Ações de compartilhamento
 * - Recomendações personalizadas
 * - Animações de revelação
 */
export const QuizResults: React.FC<QuizResultsProps> = memo(({
  results,
  primaryResult,
  userName,
  onShare,
  onDownload,
  onRestart,
  showDetailedBreakdown = true
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const handleCopyResult = useCallback(async () => {
    const resultText = `🎯 Meu Resultado do Quiz de Estilo:

${primaryResult.title}
${primaryResult.subtitle}

${primaryResult.description}

📊 Pontuação: ${primaryResult.score} pontos (${primaryResult.percentage}%)

✨ Características principais:
${primaryResult.characteristics.map(char => `• ${char}`).join('\n')}

🎯 Recomendações:
${primaryResult.recommendations.map(rec => `• ${rec}`).join('\n')}

Faça você também: [link do quiz]`;

    try {
      await navigator.clipboard.writeText(resultText);
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  }, [primaryResult]);

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      'heart': <Heart className="w-8 h-8" />,
      'star': <Star className="w-8 h-8" />,
      'zap': <Zap className="w-8 h-8" />,
      'target': <Target className="w-8 h-8" />,
      'award': <Award className="w-8 h-8" />,
      'crown': <Crown className="w-8 h-8" />,
      'trending': <TrendingUp className="w-8 h-8" />,
      'shield': <Shield className="w-8 h-8" />,
      'compass': <Compass className="w-8 h-8" />,
      'gift': <Gift className="w-8 h-8" />
    };
    return icons[iconName] || <Star className="w-8 h-8" />;
  };

  return (
    <div className="quiz-results max-w-4xl mx-auto p-6 space-y-8">
      {/* Header de Resultados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🎉 Seus Resultados {userName && `- ${userName}`}
        </h1>
        <p className="text-gray-600">
          Descobrimos seu estilo pessoal baseado em suas respostas
        </p>
      </motion.div>

      {/* Resultado Principal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className={`primary-result bg-gradient-to-br ${primaryResult.color} p-8 rounded-2xl shadow-xl text-white`}
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
            {getIconComponent(primaryResult.icon)}
          </div>
          <h2 className="text-4xl font-bold mb-2">{primaryResult.title}</h2>
          <p className="text-xl opacity-90">{primaryResult.subtitle}</p>
        </div>

        <div className="bg-white/10 rounded-xl p-6 mb-6">
          <p className="text-lg leading-relaxed">{primaryResult.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Pontuação */}
          <div className="bg-white/10 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Sua Pontuação
            </h3>
            <div className="text-3xl font-bold">{primaryResult.score} pontos</div>
            <div className="text-sm opacity-75">{primaryResult.percentage}% de afinidade</div>
          </div>

          {/* Categoria */}
          <div className="bg-white/10 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Crown className="w-5 h-5" />
              Categoria
            </h3>
            <div className="text-2xl font-bold capitalize">{primaryResult.category}</div>
            <div className="text-sm opacity-75">Seu estilo dominante</div>
          </div>
        </div>
      </motion.div>

      {/* Características Principais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="characteristics bg-white p-6 rounded-xl shadow-lg"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Suas Características Principais
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {primaryResult.characteristics.map((char, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
              <span className="text-gray-700">{char}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recomendações */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="recommendations bg-white p-6 rounded-xl shadow-lg"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-green-500" />
          Recomendações Para Você
        </h3>
        <div className="space-y-3">
          {primaryResult.recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-start gap-3 p-4 bg-green-50 rounded-lg"
            >
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">{index + 1}</span>
              </div>
              <span className="text-gray-700">{rec}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Breakdown Detalhado */}
      {showDetailedBreakdown && results.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="detailed-breakdown bg-white p-6 rounded-xl shadow-lg"
        >
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full flex items-center justify-between text-xl font-bold text-gray-800 mb-4 hover:text-blue-600 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Breakdown Detalhado por Categoria
            </span>
            {showBreakdown ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>

          <AnimatePresence>
            {showBreakdown && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                {results
                  .sort((a, b) => b.score - a.score)
                  .map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border-2 ${
                        result.id === primaryResult.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8">
                            {getIconComponent(result.icon)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{result.title}</h4>
                            <p className="text-sm text-gray-600 capitalize">{result.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-800">{result.score}</div>
                          <div className="text-sm text-gray-600">{result.percentage}%</div>
                        </div>
                      </div>
                      
                      {/* Barra de Progresso */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.percentage}%` }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                          className={`h-2 rounded-full ${result.color.replace('from-', 'bg-').split(' ')[0]}`}
                        />
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Ações de Compartilhamento */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="actions bg-white p-6 rounded-xl shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Compartilhe Seus Resultados
        </h3>
        
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Copiar para Clipboard */}
          <button
            onClick={handleCopyResult}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              copiedToClipboard
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <Copy className="w-4 h-4" />
            {copiedToClipboard ? 'Copiado!' : 'Copiar Resultado'}
          </button>

          {/* Botão de Compartilhamento */}
          {onShare && (
            <button
              onClick={() => onShare(primaryResult)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium transition-all"
            >
              <Share2 className="w-4 h-4" />
              Compartilhar
            </button>
          )}

          {/* Botão de Download */}
          {onDownload && (
            <button
              onClick={() => onDownload(primaryResult)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 font-medium transition-all"
            >
              <Download className="w-4 h-4" />
              Baixar PDF
            </button>
          )}

          {/* E-mail */}
          <button
            onClick={() => window.open(`mailto:?subject=Meu Resultado do Quiz&body=${encodeURIComponent(`Descobri meu estilo: ${primaryResult.title}`)}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium transition-all"
          >
            <Mail className="w-4 h-4" />
            E-mail
          </button>

          {/* Refazer Quiz */}
          {onRestart && (
            <button
              onClick={onRestart}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-700 font-medium transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              Refazer Quiz
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
});

QuizResults.displayName = 'QuizResults';
