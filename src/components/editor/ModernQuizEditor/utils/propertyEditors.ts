/**
 * Mapa mínimo de editores por tipo de bloco
 * Fase 2: foco em tipos mais comuns
 */

export type FieldDef = {
  key: string;
  label: string;
  kind: 'text' | 'number' | 'boolean' | 'json' | 'image' | 'options';
};

export const PropertySchemaMap: Record<string, FieldDef[]> = {
  // Texto genérico
  text: [
    { key: 'title', label: 'Título', kind: 'text' },
    { key: 'subtitle', label: 'Subtítulo', kind: 'text' },
    { key: 'description', label: 'Descrição', kind: 'text' },
  ],
  // Cabeçalhos
  heading: [
    { key: 'title', label: 'Título', kind: 'text' },
    { key: 'level', label: 'Nível (h1-h6)', kind: 'text' },
  ],
  // Imagens
  'intro-image': [
    { key: 'src', label: 'URL da imagem', kind: 'text' },
    { key: 'alt', label: 'Alt', kind: 'text' },
  ],
  // Perguntas com opções
  'options-grid': [
    { key: 'title', label: 'Título', kind: 'text' },
    { key: 'options', label: 'Opções', kind: 'json' },
  ],
  'question-hero': [
    { key: 'title', label: 'Título', kind: 'text' },
    { key: 'subtitle', label: 'Subtítulo', kind: 'text' },
  ],
};

export function getFieldsForType(blockType: string): FieldDef[] {
  return PropertySchemaMap[blockType] || [];
}
