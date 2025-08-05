// Simple semantic ID generator for editor blocks
export const generateSemanticId = (type: string, suffix?: string): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  const baseSuffix = suffix ? `-${suffix}` : "";
  return `${type}-${timestamp}-${random}${baseSuffix}`;
};

// Legacy function for object parameter - converts to string
export const generateSemanticIdFromObject = (config: {
  context: string;
  type: string;
  identifier: string;
  index: number;
}): string => {
  return generateSemanticId(`${config.context}-${config.type}`, config.identifier);
};

export const generateBlockId = (blockType: string): string => {
  return generateSemanticId(blockType, "block");
};

export default {
  generateSemanticId,
  generateBlockId,
};