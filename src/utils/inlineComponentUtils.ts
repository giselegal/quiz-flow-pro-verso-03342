export const getPersonalizedText = (
  text: string,
  pattern: string,
  username: string,
  useUsername: boolean
): string => {
  if (!useUsername || !username) return text;
  return pattern.replace('{{username}}', username);
};

export const trackComponentView = (componentId: string, componentType: string) => {
  // Analytics tracking implementation
  console.log(`Component view: ${componentType} (${componentId})`);
};

export const trackComponentClick = (componentId: string, componentType: string, action: string) => {
  // Analytics tracking implementation
  console.log(`Component click: ${componentType} (${componentId}) - ${action}`);
};

export const trackComponentConversion = (
  componentId: string,
  componentType: string,
  value: number
) => {
  // Conversion tracking implementation
  console.log(`Component conversion: ${componentType} (${componentId}) - Value: ${value}`);
};

export const RESPONSIVE_PATTERNS = {
  mobile: 'block sm:hidden',
  tablet: 'hidden sm:block lg:hidden',
  desktop: 'hidden lg:block',
};

export const getThemeClasses = (theme: string) => {
  const themes = {
    primary: 'bg-[#B89B7A]/100 text-white',
    secondary: 'bg-gray-500 text-white',
    brand: 'bg-[#B89B7A] text-white',
  };
  return themes[theme as keyof typeof themes] || themes.primary;
};

export const INLINE_ANIMATIONS = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  scaleIn: 'animate-scale-in',
  none: '',
};
