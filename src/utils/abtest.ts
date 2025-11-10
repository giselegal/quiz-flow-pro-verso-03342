/**
 * 🧪 A/B TEST UTILITIES
 * A/B testing configuration and utilities
 */

export interface ABTest {
  name: string;
  variants: string[];
  weights?: number[];
}

export const LANDING_PAGE_AB_TEST: ABTest = {
  name: 'landing-page',
  variants: ['/', '/quiz-estilo'],
  weights: [50, 50]
};

/**
 * Get test variant for user (simple random 50/50)
 */
export const getTestVariant = (test: ABTest): string => {
  const random = Math.random();
  return random < 0.5 ? test.variants[0] : test.variants[1];
};

/**
 * Get redirect URL based on A/B test
 */
export const getABTestRedirectUrl = (test: ABTest): string => {
  return getTestVariant(test);
};

/**
 * Get variant path for specific variant
 */
export const getVariantPath = (test: ABTest, variantIndex: number): string => {
  return test.variants[variantIndex] || test.variants[0];
};
