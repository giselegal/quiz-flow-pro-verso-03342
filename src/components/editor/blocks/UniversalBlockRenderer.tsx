/**
 * UniversalBlockRenderer Stub
 */
export interface UniversalBlockRendererProps {
  block: any;
  [key: string]: any;
}

export function UniversalBlockRenderer({ block }: UniversalBlockRendererProps) {
  return <div>Block: {block?.type || 'unknown'}</div>;
}

export default UniversalBlockRenderer;
