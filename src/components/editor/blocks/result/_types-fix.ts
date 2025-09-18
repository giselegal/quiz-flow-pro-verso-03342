// Quick TypeScript fixes for result blocks
// This file contains reusable fixes for common type issues

export interface ResultBlockProps {
  block: any;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const removeUnusedParams = (params: any[], ...unusedKeys: string[]): any[] => {
  return params.filter((_, index) => !unusedKeys.includes(index.toString()));
};

export const typedMap = <T, R>(array: T[], callback: (item: T, index: number) => R): R[] => {
  return array.map(callback);
};
