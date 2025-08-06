import React from "react";
import type { BlockComponentProps } from "@/types/blocks";
import { cn } from "../../../../lib/utils";

interface Props extends BlockComponentProps {
  height?: string;
  backgroundColor?: string;
  className?: string;
  [key: string]: any;
}

const SpacerInlineBlock: React.FC<SpacerInlineBlockProps> = ({
  height = "2rem",
  backgroundColor = "transparent",
  className,
  ...props
}) => {
  return (
    <div
      className={cn("w-full", className)}
      style={{
        height,
        backgroundColor,
      }}
      {...props}
    />
  );
};

export default SpacerInlineBlock;
