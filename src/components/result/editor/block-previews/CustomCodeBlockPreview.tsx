interface CustomCodeBlockPreviewProps {
  content: {
    code?: string;
    style?: any;
  };
}

const CustomCodeBlockPreview: React.FC<CustomCodeBlockPreviewProps> = ({ content }) => {
  const { code = '', style = {} } = content;

  if (!code.trim()) {
    return (
      <div className="p-6 text-center text-gray-400 border border-dashed rounded-md">
        Adicione o código HTML personalizado
      </div>
    );
  }

  return (
    <div style={style} className="w-full">
      <div dangerouslySetInnerHTML={{ __html: code }} />
    </div>
  );
};

export default CustomCodeBlockPreview;
