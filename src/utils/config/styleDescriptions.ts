// @ts-nocheck
export const getStyleDescription = (styleType: string): string => {
  const descriptions: Record<string, string> = {
    Natural:
      'Você valoriza o conforto e a praticidade. seu estilo é descontraído e casual, com peças fáceis de usar no dia a dia.',
    Clássico:
      'Você valoriza o equilíbrio e a tradição. Seu estilo é elegante e atemporal, com peças que não saem de moda.',
    Contemporâneo:
      'Você valoriza o equilíbrio entre moda e praticidade. Seu estilo é atual e adaptativo, com peças que transitam bem entre várias ocasiões.',
    Elegante:
      'Você valoriza a sofisticação e o requinte. Seu estilo é refinado e imponente, com peças que exalam qualidade e status.',
    Romântico:
      'Você valoriza a delicadeza e a feminilidade. Seu estilo é suave e gracioso, com peças que transmitem leveza e romantismo.',
    Sexy: 'Você valoriza a sensualidade e a expressão corporal. Seu estilo é provocante e ousado, com peças que destacam suas curvas.',
    Dramático:
      'Você valoriza o impacto visual e a originalidade. Seu estilo é marcante e poderoso, com peças estruturadas e de design diferenciado.',
    Criativo:
      'Você valoriza a expressão artística e a liberdade. Seu estilo é único e eclético, com peças que refletem sua personalidade multifacetada.',
  };

  return (
    descriptions[styleType] || 'Seu estilo pessoal reflete sua personalidade autêntica e única.'
  );
};
