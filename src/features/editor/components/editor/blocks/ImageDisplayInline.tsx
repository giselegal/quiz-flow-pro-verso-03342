interface ImageDisplayInlineProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  onClick?: () => void;
}

const ImageDisplayInline: React.FC<ImageDisplayInlineProps> = ({
  src = '',
  alt = 'Imagem',
  width = 400,
  height = 300,
  className = '',
  onClick,
}) => {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-muted rounded-lg ${className}`}
        style={{ width, height }}
        onClick={onClick}
      >
        <span className="text-muted-foreground text-sm">Selecione uma imagem</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} onClick={onClick}>
      <img src={src} alt={alt} width={width} height={height} className="rounded-lg object-cover" />
    </div>
  );
};

export default ImageDisplayInline;
