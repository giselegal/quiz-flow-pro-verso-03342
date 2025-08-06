import React from "react";
import { BlockComponentProps } from "@/types/blocks";

const SpacerBlock: React.FC<BlockComponentProps> = ({ block, className = "" }) => {
  const height = block.properties?.height || 20;

  return <div className={`spacer-block ${className}`} style={{ height: `${height}px` }} />;
};

export default SpacerBlock;
