import React from 'react';
import { cn } from '@/lib/utils';

export interface VideoBlockProps {
  id?: string;
  src: string;
  poster?: string;
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  aspectRatio?: string;
  maxWidth?: string;
  className?: string;
  mode?: 'editor' | 'preview';
}

export const VideoBlock: React.FC<VideoBlockProps> = ({
  src,
  poster,
  autoplay = false,
  controls = true,
  loop = false,
  muted = autoplay,
  aspectRatio = '16/9',
  maxWidth = '100%',
  className
}) => {
  // Detect if it's YouTube/Vimeo embed
  const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');
  const isVimeo = src.includes('vimeo.com');

  if (isYouTube || isVimeo) {
    return (
      <div 
        className={cn('relative overflow-hidden rounded-lg', className)}
        style={{
          aspectRatio,
          maxWidth,
          margin: '0 auto'
        }}
      >
        <iframe
          src={src}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div 
      className={cn('relative overflow-hidden rounded-lg', className)}
      style={{
        aspectRatio,
        maxWidth,
        margin: '0 auto'
      }}
    >
      <video
        src={src}
        poster={poster}
        autoPlay={autoplay}
        controls={controls}
        loop={loop}
        muted={muted}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

VideoBlock.displayName = 'VideoBlock';
