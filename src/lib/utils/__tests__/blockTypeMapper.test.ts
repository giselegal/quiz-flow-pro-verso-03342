import { describe, it, expect } from 'vitest';
import { mapBlockType } from '@/lib/utils/blockTypeMapper';
import { safeGetTemplateBlocks } from '@/lib/utils/templateConverter';

describe('blockTypeMapper', () => {
  it('maps Step 21 aliases correctly', () => {
    expect(mapBlockType('CTAButton')).toBe('cta-inline');
    expect(mapBlockType('BonusSection')).toBe('benefits-list');
    expect(mapBlockType('SocialProofSection')).toBe('testimonials');
    expect(mapBlockType('GuaranteeSection')).toBe('guarantee');
    expect(mapBlockType('ValueAnchor')).toBe('value-anchoring');
    expect(mapBlockType('SecurePurchase')).toBe('secure-purchase');
    expect(mapBlockType('UrgencyTimer')).toBe('urgency-timer-inline');
    expect(mapBlockType('Pricing')).toBe('pricing-inline');
  });

  it('converts step-20 sections → mapped block types', () => {
    const MOCK_TEMPLATE: any = {
      'step-20': {
        sections: [
          { id: 's1', type: 'CTAButton' },
          { id: 's2', type: 'BonusSection' },
          { id: 's3', type: 'SocialProofSection' },
          { id: 's4', type: 'GuaranteeSection' },
        ],
      },
    };
    const blocks = safeGetTemplateBlocks('step-20', MOCK_TEMPLATE);
    const types = blocks.map(b => b.type);
    // Should include mapped CTA and testimonial/benefits/guarantee types
    expect(types).toContain('cta-inline');
    expect(types).toContain('benefits-list');
    expect(types).toContain('testimonials');
    expect(types).toContain('guarantee');
  });

  it('converts step-21 sections → known block types', () => {
    const MOCK_TEMPLATE: any = {
      'step-21': {
        sections: [
          { id: 'h1', type: 'offer-hero' },
          { id: 'p1', type: 'Pricing' },
        ],
      },
    };
    const blocks = safeGetTemplateBlocks('step-21', MOCK_TEMPLATE);
    const types = blocks.map(b => b.type);
    expect(types).toContain('offer-hero');
    // Pricing may come as pricing/pricing-inline depending on JSON
    expect(types.find(t => t === 'pricing' || t === 'pricing-inline')).toBeTruthy();
  });
});
