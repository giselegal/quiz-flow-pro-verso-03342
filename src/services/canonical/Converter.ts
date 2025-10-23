/**
 * 🔁 Converter canônico JSON v3 ⇄ UnifiedQuizStep
 */

export type UnifiedQuizBlock = {
  id: string;
  type: string;
  content?: any;
  properties?: Record<string, any>;
};

export type UnifiedQuizStep = {
  id: string;
  type: string;
  order?: number;
  blocks?: UnifiedQuizBlock[];
  sections?: any[]; // JSON v3 sections (mantém se presente)
  meta?: Record<string, any>;
  theme?: any;
  templateVersion?: string;
};

const sectionTypeToBlockMap: Record<string, string> = {
  'intro-title': 'title',
  'quiz-intro-header': 'header',
  'content': 'text-inline',
};

const blockTypeToSectionMap: Record<string, string> = Object.fromEntries(
  Object.entries(sectionTypeToBlockMap).map(([s, b]) => [b, s])
);

function mapSectionToBlock(sectionType: string) {
  return sectionTypeToBlockMap[sectionType] || sectionType || 'text-inline';
}

function mapBlockToSection(blockType: string) {
  return blockTypeToSectionMap[blockType] || blockType || 'content';
}

export const Converter = {
  fromJsonV3(json: any): UnifiedQuizStep {
    const sections = Array.isArray(json?.sections) ? json.sections : [];
    const blocks = sections.map((s: any, i: number) => {
      const properties = { ...(s.style || {}) } as Record<string, any>;
      if (s.animation) properties.animation = s.animation;
      return {
        id: s.id || `block-${i + 1}`,
        type: mapSectionToBlock(s.type),
        content: s.content || {},
        properties
      } as UnifiedQuizBlock;
    });

    return {
      id: json?.metadata?.id || `step-${Date.now()}`,
      type: json?.metadata?.category || 'intro',
      sections,
      blocks,
      theme: json?.theme,
      templateVersion: json?.templateVersion || '3.0',
      meta: {
        metadata: json?.metadata,
        raw: json
      }
    } as UnifiedQuizStep;
  },

  toJsonV3(unified: UnifiedQuizStep) {
    // Se já há sections, prioriza-las (permite round-trip exato). Caso contrário, derivar dos blocks
    const sections = Array.isArray(unified.sections) && unified.sections.length > 0
      ? unified.sections
      : (unified.blocks || []).map((b) => {
          const props = { ...(b.properties || {}) };
          const { animation, ...style } = props;
          return {
            id: b.id,
            type: mapBlockToSection(b.type),
            content: b.content || {},
            style,
            ...(animation ? { animation } : {})
          };
        });

    return {
      templateVersion: unified.templateVersion || '3.0',
      metadata: unified.meta?.metadata || { id: unified.id, name: '' },
      theme: unified.theme,
      sections
    };
  }
};

export default Converter;
