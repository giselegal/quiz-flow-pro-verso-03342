import { Input } from '@/components/ui/input';
import { SafeIframe } from '@/components/security/SafeIframe';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Block } from '@/types/editor';

interface VideoBlockEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
}

const VideoBlockEditor: React.FC<VideoBlockEditorProps> = ({ block, onUpdate }) => {
  const content = block.content;

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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="videoUrl">URL do Vídeo (YouTube ou Vimeo)</Label>
        <Input
          id="videoUrl"
          value={content.videoUrl || ''}
          onChange={e => onUpdate({ videoUrl: e.target.value })}
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="videoTitle">Título do Vídeo</Label>
        <Input
          id="videoTitle"
          value={content.videoTitle || ''}
          onChange={e => onUpdate({ videoTitle: e.target.value })}
          placeholder="Título do vídeo"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="videoDescription">Descrição do Vídeo</Label>
        <Textarea
          id="videoDescription"
          rows={3}
          value={content.videoDescription || ''}
          onChange={e => onUpdate({ videoDescription: e.target.value })}
          placeholder="Descrição do vídeo"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="videoThumbnail">URL da Miniatura</Label>
        <Input
          id="videoThumbnail"
          value={content.videoThumbnail || ''}
          onChange={e => onUpdate({ videoThumbnail: e.target.value })}
          placeholder="https://exemplo.com/miniatura.jpg"
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="videoAutoplay">Reprodução Automática</Label>
        <Switch
          id="videoAutoplay"
          checked={content.videoAutoplay || false}
          onCheckedChange={checked => onUpdate({ videoAutoplay: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="videoControls">Mostrar Controles</Label>
        <Switch
          id="videoControls"
          checked={content.videoControls !== false}
          onCheckedChange={checked => onUpdate({ videoControls: checked })}
        />
      </div>

      {content.videoUrl && (
        <div className="mt-4 border p-2 rounded">
          <div className="aspect-video w-full">
            <SafeIframe
              src={getEmbedUrl(content.videoUrl)}
              className="w-full h-full"
              title={content.videoTitle || 'Video'}
              allowScripts={false}
              allowSameOrigin={true}
              trustLevel="untrusted"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoBlockEditor;
