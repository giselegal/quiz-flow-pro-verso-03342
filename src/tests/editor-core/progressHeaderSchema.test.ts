import { describe, it, expect } from 'vitest';
import { getBlockSchema } from '@/components/editor/quiz/schema/blockSchema';

describe('progress-header schema', () => {
  it('define defaults principais', () => {
    const schema = getBlockSchema('progress-header');
    expect(schema).toBeTruthy();
    const props = Object.fromEntries(schema!.properties.map(p => [p.key, p]));
    expect(props.showLogo.default).toBe(true);
    expect(props.progressEnabled.default).toBe(true);
    expect(props.barColor.default).toBe('#D4AF37');
    expect(props.autoProgress.default).toBe(true);
  });
});
