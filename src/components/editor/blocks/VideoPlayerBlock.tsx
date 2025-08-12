// @ts-nocheck
import { BlockComponentProps } from '@/types/blocks';

interface VideoPlayerBlockProps extends BlockComponentProps {
  videoUrl?: string;
  title?: string;
  autoPlay?: boolean;
  controls?: boolean;
}

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
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

const VideoPlayerBlock: React.FC<VideoPlayerBlockProps> = ({
  block,
  isSelected,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const videoUrl = block.properties?.videoUrl || '';
  const title = block.properties?.title || 'Vídeo';

  return (
    <div
      className={`p-4 border-2 border-dashed border-gray-300 rounded-lg ${
        isSelected ? 'border-[#B89B7A] bg-[#B89B7A]/10' : 'hover:border-gray-400'
      } ${className}`}
      onClick={onClick}
    >
      {videoUrl ? (
        <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
          <iframe
            src={videoUrl}
            title={title}
            className="w-full h-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div style={{ backgroundColor: '#E5DDD5' }}>
          <div className="text-center">
            <div className="text-4xl text-gray-400 mb-2">📹</div>
            <p style={{ color: '#6B4F43' }}>Clique para adicionar vídeo</p>
          </div>
        </div>
      )}

      {title && <h3 style={{ color: '#432818' }}>{title}</h3>}
    </div>
  );
};

export default VideoPlayerBlock;

// Named export for backward compatibility
export { VideoPlayerBlock };
