import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { AnimatedWrapper } from '@/components/ui/animated-wrapper';
import { DeviceView, StyleProps } from './types';

interface VideoSectionProps extends StyleProps {
  /** Título da seção */
  title?: string;
  /** Subtítulo/descrição da seção */
  subtitle?: string;
  /** URL do vídeo */
  videoUrl: string;
  /** URL do thumbnail/poster */
  thumbnailUrl?: string;
  /** Tipo de vídeo */
  videoType?: 'youtube' | 'vimeo' | 'mp4' | 'embedded';
  /** Autoplay */
  autoPlay?: boolean;
  /** Controles customizados */
  customControls?: boolean;
  /** Mostrar tempo de duração */
  showDuration?: boolean;
  /** Duração do vídeo em segundos */
  duration?: number;
  /** Configuração de animações */
  animationConfig?: {
    disabled?: boolean;
    duration?: number;
    delay?: number;
  };
  /** Configuração de viewport */
  deviceView?: DeviceView;
  /** Callback quando o vídeo inicia */
  onVideoStart?: () => void;
  /** Callback quando o vídeo termina */
  onVideoEnd?: () => void;
  /** Callback para ação */
  onAction?: () => void;
  /** Texto do botão de ação */
  actionText?: string;
  /** Mostrar botão de ação */
  showAction?: boolean;
}

/**
 * VideoSection - Seção de vídeo com controles e CTA
 * Usado para vídeos de vendas, demonstrações e depoimentos
 */
export const VideoSection: React.FC<VideoSectionProps> = ({
  title,
  subtitle,
  videoUrl,
  thumbnailUrl,
  videoType = 'mp4',
  autoPlay = false,
  customControls = true,
  showDuration = true,
  duration,
  animationConfig = {},
  deviceView = 'desktop',
  onVideoStart,
  onVideoEnd,
  onAction,
  actionText = 'Assistir Agora',
  showAction = true,
  className,
  style,
  customStyles,
}) => {
  const [isPlaying, setIsPlaying] = React.useState(autoPlay);
  const [isMuted, setIsMuted] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const {
    disabled: animationsDisabled,
    duration: animationDuration = 400,
    delay = 0,
  } = animationConfig;
  const isLowPerformance = deviceView === 'mobile';

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
        onVideoStart?.();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    onVideoEnd?.();
  };

  const getEmbedUrl = () => {
    if (videoType === 'youtube') {
      const videoId = videoUrl.includes('watch?v=')
        ? videoUrl.split('watch?v=')[1]?.split('&')[0]
        : videoUrl.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&rel=0`;
    }
    if (videoType === 'vimeo') {
      const videoId = videoUrl.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}?autoplay=${autoPlay ? 1 : 0}`;
    }
    return videoUrl;
  };

  const renderVideoPlayer = () => {
    if (videoType === 'youtube' || videoType === 'vimeo' || videoType === 'embedded') {
      return (
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            src={getEmbedUrl()}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    return (
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden group">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster={thumbnailUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnd}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          muted={isMuted}
        >
          <source src={videoUrl} type="video/mp4" />
          Seu navegador não suporta vídeos HTML5.
        </video>

        {/* Custom controls overlay */}
        {customControls && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            {/* Play/Pause button */}
            <button
              onClick={handlePlayPause}
              className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all duration-300 transform hover:scale-110"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-black" />
              ) : (
                <Play className="w-8 h-8 text-black ml-1" />
              )}
            </button>
          </div>
        )}

        {/* Bottom controls */}
        {customControls && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center justify-between text-white">
              {/* Progress bar */}
              <div className="flex-1 mr-4">
                {duration && (
                  <div className="w-full bg-white bg-opacity-30 rounded-full h-1">
                    <div
                      className="bg-white h-1 rounded-full transition-all duration-300"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Time */}
              {showDuration && duration && (
                <div className="text-sm mr-4">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              )}

              {/* Mute button */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors duration-300"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* Duration badge */}
        {showDuration && duration && (
          <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
            {formatTime(duration)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`py-12 ${className || ''}`} style={style}>
      {customStyles && <style dangerouslySetInnerHTML={{ __html: customStyles }} />}

      {/* Header */}
      {(title || subtitle) && (
        <div className="text-center mb-8">
          {title && (
            <h2 className="text-2xl md:text-3xl font-playfair text-[#aa6b5d] mb-2">{title}</h2>
          )}
          {subtitle && (
            <p className="text-center text-[#3a3a3a] mb-6 max-w-lg mx-auto">{subtitle}</p>
          )}
          <div className="elegant-divider w-32 mx-auto"></div>
        </div>
      )}

      {/* Video */}
      <div className="max-w-full mx-auto">
        <AnimatedWrapper
          animation={animationsDisabled || isLowPerformance ? 'none' : 'fade'}
          show={true}
          duration={animationDuration}
          delay={delay}
        >
          <Card className="p-6 bg-white shadow-lg border border-[#B89B7A]/20">
            {renderVideoPlayer()}

            {/* Video info */}
            <div className="mt-6 text-center">
              {/* Rating */}
              <div className="flex justify-center items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                ))}
                <span className="text-sm text-[#6B4F43] ml-2">
                  Avaliação 5.0 - Mais de 1000 visualizações
                </span>
              </div>

              {/* Action */}
              {showAction && onAction && (
                <Button
                  onClick={onAction}
                  className="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white px-8 py-3 rounded-lg hover:scale-105 transition-transform duration-300"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {actionText}
                </Button>
              )}
            </div>
          </Card>
        </AnimatedWrapper>
      </div>
    </div>
  );
};

export default VideoSection;
