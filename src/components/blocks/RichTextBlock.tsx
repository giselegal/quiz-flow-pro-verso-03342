import React from "react";
import { BlockComponentProps } from "@/types/blocks";

const RichTextBlock: React.FC<BlockComponentProps> = ({
  block,
  className = "",
}) => {
  return (
    <div
      className={`rich-text-block ${className}`}
      dangerouslySetInnerHTML={{
        __html: block.properties?.html || "<p>Rich text content</p>",
      }}
    />
  );
};

export default RichTextBlock;
