interface TextBlockPreviewProps {
  content: {
    text?: string;
    style?: any;
  };
}

const TextBlockPreview: React.FC<TextBlockPreviewProps> = ({ content }) => {
  const { text, style = {} } = content;

  const textStyle = {
    fontSize: style.fontSize || '1rem',
    lineHeight: style.lineHeight || '1.6',
    color: style.color || '#3A3A3A',
    textAlign: style.textAlign || 'left',
    ...style,
  };

  return <div className="mb-4">{text && <p style={textStyle}>{text}</p>}</div>;
};

export default TextBlockPreview;
