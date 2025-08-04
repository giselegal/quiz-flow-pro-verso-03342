import React from 'react';
import { BlockComponentProps } from '@/types/blocks';

interface VideoPlayerBlockProps extends BlockComponentProps {
  videoUrl?: string;
  title?: string;
  autoPlay?: boolean;
  controls?: boolean;
}

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
        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl text-gray-400 mb-2">📹</div>
            <p className="text-gray-600">Clique para adicionar vídeo</p>
          </div>
        </div>
      )}

      {title && <h3 className="mt-3 text-lg font-medium text-gray-900">{title}</h3>}
    </div>
  );
};

export default VideoPlayerBlock;

// Named export for backward compatibility
export { VideoPlayerBlock };
