/**
 * 🎨 ÍCONES SVG MODERNOS
 * 
 * Conjunto de ícones customizados para o sistema modular
 */

import React from 'react';

interface IconProps {
  size?: number | string;
  color?: string;
  className?: string;
}

const defaultIconProps = {
  size: 16,
  color: 'currentColor'
};

export const AddIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export const DeleteIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="3,6 5,6 21,6"></polyline>
    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

export const CopyIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5,15H4a2,2 0 0,1 -2,-2V4a2,2 0 0,1 2,-2H13a2,2 0 0,1 2,2v1"></path>
  </svg>
);

export const EditIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M11,4H4a2,2 0 0,0 -2,2v14a2,2 0 0,0 2,2h14a2,2 0 0,0 2,-2V11"></path>
    <path d="M18.5,2.5a2.121,2.121 0 0,1 3,3L12,15l-4,1 1,-4Z"></path>
  </svg>
);

export const ViewIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M1,12s4,-8 11,-8 11,8 11,8 -4,8 -11,8 -11,-8 -11,-8Z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

export const DragHandleIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={color}
    className={className}
  >
    <circle cx="9" cy="12" r="1"></circle>
    <circle cx="9" cy="5" r="1"></circle>
    <circle cx="9" cy="19" r="1"></circle>
    <circle cx="15" cy="12" r="1"></circle>
    <circle cx="15" cy="5" r="1"></circle>
    <circle cx="15" cy="19" r="1"></circle>
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6,9 12,15 18,9"></polyline>
  </svg>
);

export const ChevronUpIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="18,15 12,9 6,15"></polyline>
  </svg>
);

export const ChevronLeftIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="15,18 9,12 15,6"></polyline>
  </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="9,18 15,12 9,6"></polyline>
  </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8"></circle>
    <path d="M21,21l-4.35,-4.35"></path>
  </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4,15a1.65,1.65 0 0,0 .33,1.82l.06,.06a2,2 0 0,1 0,2.83 2,2 0 0,1 -2.83,0l-.06,-.06a1.65,1.65 0 0,0 -1.82,-.33 1.65,1.65 0 0,0 -1,1.51V21a2,2 0 0,1 -2,2 2,2 0 0,1 -2,-2v-.09A1.65,1.65 0 0,0 9,19.4a1.65,1.65 0 0,0 -1.82,.33l-.06,.06a2,2 0 0,1 -2.83,0 2,2 0 0,1 0,-2.83l.06,-.06a1.65,1.65 0 0,0 .33,-1.82 1.65,1.65 0 0,0 -1.51,-1H3a2,2 0 0,1 -2,-2 2,2 0 0,1 2,-2h.09A1.65,1.65 0 0,0 4.6,9a1.65,1.65 0 0,0 -.33,-1.82l-.06,-.06a2,2 0 0,1 0,-2.83 2,2 0 0,1 2.83,0l.06,.06a1.65,1.65 0 0,0 1.82,.33H9a1.65,1.65 0 0,0 1,1.51V3a2,2 0 0,1 2,2 2,2 0 0,1 2,2v.09a1.65,1.65 0 0,0 1,1.51 1.65,1.65 0 0,0 1.82,-.33l.06,-.06a2,2 0 0,1 2.83,0 2,2 0 0,1 0,2.83l-.06,.06a1.65,1.65 0 0,0 -.33,1.82V9a1.65,1.65 0 0,0 1.51,1H21a2,2 0 0,1 2,2 2,2 0 0,1 -2,2h-.09a1.65,1.65 0 0,0 -1.51,1Z"></path>
  </svg>
);

// Ícones específicos para componentes
export const HeaderIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6,4h12a2,2 0 0,1 2,2v12a2,2 0 0,1 -2,2H6a2,2 0 0,1 -2,-2V6a2,2 0 0,1 2,-2Z"></path>
    <path d="M6,10h12"></path>
  </svg>
);

export const TextIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="4,7 4,4 20,4 20,7"></polyline>
    <line x1="9" y1="20" x2="15" y2="20"></line>
    <line x1="12" y1="4" x2="12" y2="20"></line>
  </svg>
);

export const ImageIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21,15 16,10 5,21"></polyline>
  </svg>
);

export const ButtonIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="8" width="18" height="8" rx="4" ry="4"></rect>
  </svg>
);

export const GridIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);