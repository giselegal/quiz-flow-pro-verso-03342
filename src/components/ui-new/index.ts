// Novos componentes baseados em Ant Design
export { default as Button } from './Button';
export type { ButtonProps } from './Button';

export { 
  default as Input,
  TextArea,
  NumberInput,
  SearchInput,
  PasswordInput
} from './Input';
export type { 
  InputProps,
  TextAreaProps,
  NumberInputProps,
  SearchInputProps,
  PasswordInputProps
} from './Input';

export { 
  default as Select,
  MultiSelect,
  SearchableSelect,
  Option
} from './Select';
export type { SelectProps, SelectOption } from './Select';

export { 
  default as Badge,
  StatusBadge,
  DifficultyBadge,
  CategoryBadge,
  CountBadge,
  DotBadge
} from './Badge';
export type { 
  BadgeProps,
  StatusBadgeProps,
  DifficultyBadgeProps,
  CategoryBadgeProps
} from './Badge';

export { default as Tabs } from './Tabs';
export { default as Card } from './Card';
export { default as ScrollArea } from './ScrollArea';
export { default as Dropdown } from './Dropdown';

// Re-export types
export type { TabsProps, MenuProps } from 'antd';
