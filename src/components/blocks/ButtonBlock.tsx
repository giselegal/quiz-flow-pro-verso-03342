import React from "react";
import { BlockComponentProps } from "@/types/blocks";
import { Button } from "@/components/ui/button";

const ButtonBlock: React.FC<BlockComponentProps> = ({
  block,
  className = "",
}) => {
  return (
    <div className={`button-block ${className}`}>
      <Button onClick={() => console.log("Button clicked")}>
        {block.properties?.text || "Click Me"}
      </Button>
    </div>
  );
};

export default ButtonBlock;
