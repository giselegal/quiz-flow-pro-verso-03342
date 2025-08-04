import { BlockData, BlockComponentProps } from "@/types/blocks";

/**
 * Converts legacy block props to new BlockData format
 */
export const convertToBlockData = (legacyBlock: any): BlockData => {
  if (!legacyBlock) {
    return {
      id: "default-block",
      type: "text",
      properties: {},
      content: {},
      order: 0,
    };
  }

  // If already in new format, return as is
  if (legacyBlock.content !== undefined && legacyBlock.order !== undefined) {
    return legacyBlock;
  }

  // Convert legacy format
  return {
    id: legacyBlock.id || `block-${Date.now()}`,
    type: legacyBlock.type || "text",
    properties: legacyBlock.properties || {},
    content: legacyBlock.content || legacyBlock.properties || {},
    order: legacyBlock.order || 0,
  };
};

/**
 * Ensures block has required properties for components
 */
export const ensureBlockCompatibility = (block: any): BlockData => {
  const compatibleBlock = convertToBlockData(block);

  // Ensure all required fields exist
  if (!compatibleBlock.content) {
    compatibleBlock.content = {};
  }

  if (!compatibleBlock.properties) {
    compatibleBlock.properties = {};
  }

  if (compatibleBlock.order === undefined) {
    compatibleBlock.order = 0;
  }

  return compatibleBlock;
};

/**
 * Creates a safe block component props object
 */
export const createSafeBlockProps = (
  block: any,
  additionalProps: Partial<BlockComponentProps> = {},
): BlockComponentProps => {
  const safeBlock = ensureBlockCompatibility(block);

  return {
    block: safeBlock,
    isSelected: false,
    isEditing: false,
    onClick: () => {},
    onPropertyChange: () => {},
    className: "",
    ...additionalProps,
  };
};
