// @ts-nocheck
import { Trash2 } from 'lucide-react';

// Componente de teste simples para verificar se a exclusão funciona
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

const TestDeleteComponent: React.FC<{ onDelete: () => void }> = ({ onDelete }) => {
  const handleClick = () => {
    console.log('🗑️ Botão de exclusão clicado!');
    onDelete();
  };

  return (
    <div style={{ borderColor: '#E5DDD5' }}>
      <div className="text-lg font-semibold mb-2">🧪 Componente de Teste de Exclusão</div>
      <div style={{ color: '#6B4F43' }}>
        Este é um componente especial apenas para testar a exclusão.
      </div>

      {/* Botão de exclusão sempre visível */}
      <button onClick={handleClick} style={{ backgroundColor: '#FAF9F7' }} type="button">
        <Trash2 className="w-4 h-4 mr-2" />
        Excluir Este Componente
      </button>

      <div style={{ color: '#8B7355' }}>
        Se este botão não funcionar, há um problema na função onDelete
      </div>
    </div>
  );
};
