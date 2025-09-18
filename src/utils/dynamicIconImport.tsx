// @ts-nocheck
import * as Icons from 'lucide-react';
import { LucideIcon, LucideProps } from 'lucide-react';

// This function returns a React component type that renders the specified Lucide icon
export const dynamicIconImport = (iconName: string): React.ElementType => {
  // Default to Star if icon not found
  if (!iconName || typeof iconName !== 'string') {
    return Icons.Star;
  }

  // Convert to pascal case for Lucide component names
  // e.g., 'check-circle' becomes 'CheckCircle'
  const formatIconName = (name: string) => {
    return name
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join('');
  };

  const formattedName = formatIconName(iconName);

  // Return the icon component if it exists, otherwise return Star
  return (Icons[formattedName as keyof typeof Icons] as React.ElementType) || Icons.Star;
};

// Function to get all available icon names
export const getAvailableIcons = (): string[] => {
  return Object.keys(Icons)
    .filter(
      key => typeof Icons[key as keyof typeof Icons] === 'function' && key !== 'createLucideIcon'
    )
    .map(key => {
      // Convert PascalCase to kebab-case
      return key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    });
};
