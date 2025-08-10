import React from "react";

interface SpacerBlockPreviewProps {
  content: {
    height?: string;
    style?: any;
  };
}

const SpacerBlockPreview: React.FC<SpacerBlockPreviewProps> = ({ content }) => {
  const height = content.height || "40px";

  return (
    <div style={{ ...content.style, height }} className="relative">
      <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 border border-dashed border-gray-200">
        Espaçamento: {height}
      </div>
    </div>
  );
};

export default SpacerBlockPreview;
