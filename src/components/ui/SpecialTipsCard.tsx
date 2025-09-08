import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SpecialTipsCardProps {
  styleName: string;
  tips: string[];
  title?: string;
  accentColor?: string;
  className?: string;
}

export const SpecialTipsCard: React.FC<SpecialTipsCardProps> = ({
  styleName,
  tips,
  title = '💎 Dicas Especiais',
  accentColor = 'text-indigo-600',
  className = '',
}) => {
  if (!tips || tips.length === 0) {
    return null;
  }

  return (
    <Card className={cn('bg-gradient-to-br from-stone-50 to-stone-100 border-stone-200', className)}>
      <CardHeader className="pb-4">
        <CardTitle className={cn('text-lg font-semibold', accentColor)}>
          {title}
        </CardTitle>
        <p className="text-sm text-stone-600">
          Para aprimorar seu estilo {styleName}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className={cn('w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-stone-400')} />
              <p className="text-stone-700 text-sm leading-relaxed">
                {tip}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};