import { SafeIframe } from '@/components/security/SafeIframe';

interface VideoBlockPreviewProps {
  content: {
    videoUrl?: string;
    videoTitle?: string;
    videoDescription?: string;
    videoThumbnail?: string;
    videoAutoplay?: boolean;
    videoControls?: boolean;
    style?: any;
  };
}

const VideoBlockPreview: React.FC<VideoBlockPreviewProps> = ({ content }) => {
  const getVideoId = (url: string) => {
    if (!url) return '';

    // For YouTube URLs
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) return youtubeMatch[1];

    // For Vimeo URLs
    const vimeoRegex =
      /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)(?:$|\/|\?))/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) return vimeoMatch[1];

    return '';
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    const videoId = getVideoId(url);

    if (url.includes('youtube')) {
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('vimeo')) {
      return `https://player.vimeo.com/video/${videoId}`;
    }

    return url;
  };

  return (
    <div style={content.style} className="space-y-4">
      {content.videoUrl ? (
        <div className="aspect-video w-full">
          <SafeIframe
            src={getEmbedUrl(content.videoUrl)}
            className="w-full h-full rounded-lg"
            title={content.videoTitle || 'Video'}
            allowScripts={false}
            allowSameOrigin={true}
            trustLevel="untrusted"
            allowFullScreen
          />
        </div>
      ) : (
        <div style={{ backgroundColor: '#E5DDD5' }}>
          <p className="text-gray-400">Prévia do vídeo</p>
        </div>
      )}

      {content.videoTitle && (
        <h3 className="text-lg font-medium text-[#432818]">{content.videoTitle}</h3>
      )}

      {content.videoDescription && <p className="text-[#8F7A6A]">{content.videoDescription}</p>}
    </div>
  );
};

export default VideoBlockPreview;
