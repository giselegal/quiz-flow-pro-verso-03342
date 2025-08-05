// Simple semantic ID generator for editor blocks
export const generateSemanticId = (type: string, suffix?: string): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  const baseSuffix = suffix ? `-${suffix}` : "";
  return `${type}-${timestamp}-${random}${baseSuffix}`;
};

export const generateBlockId = (blockType: string): string => {
  return generateSemanticId(blockType, "block");
};

export default {
  generateSemanticId,
  generateBlockId,
};