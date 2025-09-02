// Calcula percentual efetivo do primário a partir de dados disponíveis

export interface ScoreLike { score?: number; percentage?: number; }

export const computeEffectivePrimaryPercentage = (
  primary: ScoreLike | undefined,
  secondaries: ScoreLike[] | undefined,
  fallbackPercentage: number | undefined
) => {
  const pct = typeof fallbackPercentage === 'number' && !Number.isNaN(fallbackPercentage)
    ? fallbackPercentage
    : 0;
  let effective = pct;
  const primaryScore = typeof primary?.score === 'number' ? primary!.score! : 0;
  const secArr = Array.isArray(secondaries) ? secondaries : [];
  const totalScore = [primaryScore, ...secArr.map(s => (typeof s?.score === 'number' ? s!.score! : 0))]
    .reduce((a, b) => a + b, 0);
  if (effective === 0) {
    if (totalScore > 0) {
      effective = Math.round((primaryScore / totalScore) * 100);
    } else {
      const secondaryPctSum = secArr
        .map(s => (typeof s?.percentage === 'number' ? s!.percentage! : 0))
        .reduce((a, b) => a + b, 0);
      if (secondaryPctSum > 0 && secondaryPctSum < 100) {
        effective = Math.max(0, Math.min(100, 100 - secondaryPctSum));
      }
    }
  }
  return effective;
};
