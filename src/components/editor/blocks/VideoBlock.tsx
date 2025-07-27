
import React from 'react';
import { Block } from '@/types/editor';
import { Play } from 'lucide-react';

interface VideoBlockProps {
  block: Block;
  isSelected?: boolean;
  onSelect?: () => void;
  isPreview?: boolean;
}

const VideoBlock: React.FC<VideoBlockProps> = ({
  block,
  isSelected,
  onSelect,
  isPreview = false
}) => {
  const videoUrl = block.content?.videoUrl || '';
  const title = block.content?.title || 'Vídeo';
  const autoplay = block.content?.autoplay || false;

  if (isPreview && videoUrl) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <iframe
          src={videoUrl}
          title={title}
          className="w-full h-64 md:h-96 rounded-lg"
          allowFullScreen
          allow={autoplay ? 'autoplay; encrypted-media' : 'encrypted-media'}
        />
      </div>
    );
  }

  return (
    <div 
      className={`p-4 ${
        isSelected && !isPreview ? 'ring-2 ring-[#B89B7A] bg-[#FAF9F7]' : ''
      }`}
      onClick={onSelect}
    >
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <Play className="w-16 h-16 mx-auto text-[#B89B7A] mb-4" />
        <h3 className="text-lg font-medium text-[#432818] mb-2">{title}</h3>
        <p className="text-sm text-[#8F7A6A]">
          {videoUrl ? 'URL do vídeo configurada' : 'Configure a URL do vídeo nas propriedades'}
        </p>
      </div>
    </div>
  );
};

export default VideoBlock;
