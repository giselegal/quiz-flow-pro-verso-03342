interface ImageBlockPreviewProps {
  content: {
    imageUrl?: string;
    imageAlt?: string;
    width?: string;
    height?: string;
    borderRadius?: string;
    style?: any;
  };
}

const ImageBlockPreview: React.FC<ImageBlockPreviewProps> = ({ content }) => {
  const imageStyle = {
    width: content.width || '100%',
    height: content.height || 'auto',
    borderRadius: content.borderRadius || '0.5rem',
    ...content.style,
  };

  return (
    <div className="text-center">
      {content.imageUrl ? (
        <img
          src={content.imageUrl}
          alt={content.imageAlt || 'Imagem'}
          style={imageStyle}
          className="mx-auto"
        />
      ) : (
        <div style={{ backgroundColor: '#E5DDD5' }}>
          <p className="text-gray-400">Selecione uma imagem</p>
        </div>
      )}
    </div>
  );
};

export default ImageBlockPreview;
