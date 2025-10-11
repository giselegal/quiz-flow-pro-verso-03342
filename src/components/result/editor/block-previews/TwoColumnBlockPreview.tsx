interface TwoColumnBlockPreviewProps {
  content: {
    leftColumn?: {
      content?: string;
      width?: string;
      style?: any;
    };
    rightColumn?: {
      content?: string;
      width?: string;
      style?: any;
    };
    columnGap?: string;
    style?: any;
  };
}

const TwoColumnBlockPreview: React.FC<TwoColumnBlockPreviewProps> = ({ content }) => {
  const leftWidth = content.leftColumn?.width || '50%';
  const rightWidth = content.rightColumn?.width || '50%';
  const gap = content.columnGap || '20px';

  return (
    <div style={content.style} className="w-full">
      <div className="flex flex-wrap md:flex-nowrap" style={{ gap }}>
        <div
          style={{
            width: leftWidth,
            ...content.leftColumn?.style,
          }}
          className="w-full md:w-auto bg-[#f9f9f9] p-4 rounded-lg"
        >
          {content.leftColumn?.content ? (
            <div dangerouslySetInnerHTML={{ __html: content.leftColumn.content }} />
          ) : (
            <div className="h-20 flex items-center justify-center text-gray-400">
              Coluna Esquerda
            </div>
          )}
        </div>

        <div
          style={{
            width: rightWidth,
            ...content.rightColumn?.style,
          }}
          className="w-full md:w-auto bg-[#f9f9f9] p-4 rounded-lg"
        >
          {content.rightColumn?.content ? (
            <div dangerouslySetInnerHTML={{ __html: content.rightColumn.content }} />
          ) : (
            <div className="h-20 flex items-center justify-center text-gray-400">
              Coluna Direita
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwoColumnBlockPreview;
