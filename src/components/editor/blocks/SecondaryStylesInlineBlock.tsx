import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { BlockComponentProps } from '@/types/blocks';
import { useQuizResult } from '@/hooks/useQuizResult';

/**
 * SecondaryStylesInlineBlock - mostra os dois estilos secundários calculados
 */
const SecondaryStylesInlineBlock: React.FC<BlockComponentProps> = ({ block }) => {
  const { secondaryStyles } = useQuizResult();

  const props = block?.properties || {};
  const title = props.title || 'Seus estilos complementares';
  const subtitle = props.subtitle || 'Você também apresenta elementos destes estilos:';

  // Helpers locais para normalização
  const removeDiacritics = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const normalizeToken = (s: string) => removeDiacritics(String(s || '')).toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const mapToFriendlyStyle = (raw: string): string => {
    const t = normalizeToken(raw);
    const table: Record<string, string> = {
      natural: 'Natural', classico: 'Clássico', contemporaneo: 'Contemporâneo', elegante: 'Elegante', romantico: 'Romântico', sexy: 'Sexy', dramatico: 'Dramático', criativo: 'Criativo',
      'estilo-natural': 'Natural', 'estilo-classico': 'Clássico', 'estilo-contemporaneo': 'Contemporâneo', 'estilo-elegante': 'Elegante', 'estilo-romantico': 'Romântico', 'estilo-sexy': 'Sexy', 'estilo-dramatico': 'Dramático', 'estilo-criativo': 'Criativo',
      neutro: 'Natural', neutral: 'Natural', 'estilo-neutro': 'Natural',
    };
    return table[t] || table[t.replace(/^estilo-/, '')] || 'Natural';
  };

  const styles = (secondaryStyles || []).slice(0, 2).map(s => ({
    ...s,
    style: mapToFriendlyStyle((s as any)?.style || (s as any)?.name || ''),
    name: mapToFriendlyStyle((s as any)?.name || (s as any)?.style || ''),
  }));

  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="text-center mb-4">
          {title && <h3 className="text-xl font-semibold text-[#432818]">{title}</h3>}
          {subtitle && <p className="text-sm text-[#6B4F43]">{subtitle}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {styles.map((s: any, idx: number) => (
          <Card key={idx} className="bg-white/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-base font-medium text-[#432818]">{s.style || s.name}</div>
                  <div className="text-sm text-[#6B4F43]/80">{s.description || 'Estilo complementar'}</div>
                </div>
                <div
                  className="text-lg font-bold px-3 py-1 rounded-full"
                  style={{ backgroundColor: (s as any).color || '#F0F9FF', color: '#432818' }}
                >
                  {Math.round(s.percentage || 0)}%
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SecondaryStylesInlineBlock;
