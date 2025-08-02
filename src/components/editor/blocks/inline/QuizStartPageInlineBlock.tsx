import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Play, Star } from 'lucide-react';

interface QuizStartPageInlineBlockProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onStart?: () => void;
  className?: string;
}

const QuizStartPageInlineBlock: React.FC<QuizStartPageInlineBlockProps> = ({
  title = "Descubra Seu Estilo",
  subtitle = "Responda algumas perguntas rápidas e descubra o que combina com você",
  buttonText = "Começar Quiz",
  onStart,
  className = ""
}) => {
  return (
    <Card className={`p-8 text-center space-y-6 ${className}`}>
      <div className="space-y-3">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <Star className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground">
          {title}
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          {subtitle}
        </p>
      </div>

      <div className="space-y-4">
        <Button
          size="lg"
          onClick={onStart}
          className="px-8 py-4 text-lg font-semibold"
        >
          <Play className="w-5 h-5 mr-2" />
          {buttonText}
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
        
        <p className="text-sm text-muted-foreground">
          • Apenas 5 minutos
          • Completamente gratuito
          • Resultado personalizado
        </p>
      </div>
    </Card>
  );
};

export default QuizStartPageInlineBlock;
