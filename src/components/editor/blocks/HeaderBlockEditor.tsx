// @ts-nocheck
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BlockEditorProps } from './types';

export // Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const HeaderBlockEditor: React.FC<BlockEditorProps> = ({ block, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`${block.id}-logo`}>Logo URL</Label>
        <Input
          id={`${block.id}-logo`}
          value={block.content.logo || ''}
          onChange={e => onUpdate({ logo: e.target.value })}
          className="mt-1"
          placeholder="URL da imagem do logo"
        />
      </div>

      <div>
        <Label htmlFor={`${block.id}-logoHeight`}>Altura do Logo (px)</Label>
        <Input
          id={`${block.id}-logoHeight`}
          type="number"
          value={block.content.logoHeight || '56'}
          onChange={e => onUpdate({ logoHeight: e.target.value })}
          className="mt-1"
          placeholder="56"
        />
      </div>

      <div>
        <Label htmlFor={`${block.id}-logoAlt`}>Texto Alternativo do Logo</Label>
        <Input
          id={`${block.id}-logoAlt`}
          value={block.content.logoAlt || ''}
          onChange={e => onUpdate({ logoAlt: e.target.value })}
          className="mt-1"
          placeholder="Logo Gisele Galvão"
        />
      </div>
    </div>
  );
};
