/**
 * 🧪 PropertySchema Consolidation Tests
 * 
 * Tests to validate the unified PropertySchema system works correctly.
 */

import { 
  PropertySchema, 
  PropertyType, 
  PropertyCategory,
  legacyToUnified,
  enhancedToUnified,
  optimizedToUnified,
  schemaToUnifiedProperty,
  unifiedPropertyToSchema
} from '@/types/propertySchema';

// Test basic PropertySchema creation
const textPropertySchema: PropertySchema = {
  key: 'title',
  type: PropertyType.TEXT,
  label: 'Title',
  description: 'The main title',
  category: PropertyCategory.CONTENT,
  required: true,
  defaultValue: 'My Title',
  placeholder: 'Enter title...',
  validation: {
    min: 1,
    max: 100
  }
};

// Test color property
const colorPropertySchema: PropertySchema = {
  key: 'backgroundColor',
  type: PropertyType.COLOR,
  label: 'Background Color',
  category: PropertyCategory.STYLE,
  defaultValue: '#ffffff'
};

// Test select property with options
const selectPropertySchema: PropertySchema = {
  key: 'alignment',
  type: PropertyType.SELECT,
  label: 'Text Alignment',
  category: PropertyCategory.LAYOUT,
  defaultValue: 'center',
  options: [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' }
  ]
};

// Test array property with itemSchema
const arrayPropertySchema: PropertySchema = {
  key: 'options',
  type: PropertyType.ARRAY,
  label: 'Quiz Options',
  category: PropertyCategory.CONTENT,
  defaultValue: [],
  itemSchema: [{
    key: 'text',
    type: PropertyType.TEXT,
    label: 'Option Text',
    defaultValue: ''
  }, {
    key: 'value', 
    type: PropertyType.TEXT,
    label: 'Option Value',
    defaultValue: ''
  }]
};

// Test conversion from legacy format
const legacySchema = {
  type: 'string' as const,
  default: 'Test Value',
  label: 'Test Field',
  description: 'Test description',
  category: 'content' as const,
  required: true
};

const convertedFromLegacy = legacyToUnified(legacySchema, 'testField');

// Test conversion from enhanced format
const enhancedSchema = {
  key: 'enhanced-field',
  type: 'color' as const,
  label: 'Enhanced Color',
  description: 'Enhanced color field',
  defaultValue: '#ff0000',
  validation: {
    pattern: '^#[0-9a-fA-F]{6}$'
  }
};

const convertedFromEnhanced = enhancedToUnified(enhancedSchema);

// Test conversion from optimized format
const optimizedSchema = {
  key: 'optimized-field',
  label: 'Optimized Select',
  type: 'select' as const,
  options: [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' }
  ],
  defaultValue: 'a'
};

const convertedFromOptimized = optimizedToUnified(optimizedSchema);

// Test bidirectional conversion
const unifiedProperty = schemaToUnifiedProperty(textPropertySchema);
const backToSchema = unifiedPropertyToSchema(unifiedProperty);

console.log('🧪 PropertySchema Tests');
console.log('✅ Basic PropertySchema creation:', textPropertySchema);
console.log('✅ Color PropertySchema:', colorPropertySchema);
console.log('✅ Select PropertySchema:', selectPropertySchema);
console.log('✅ Array PropertySchema:', arrayPropertySchema);
console.log('✅ Legacy conversion:', convertedFromLegacy);
console.log('✅ Enhanced conversion:', convertedFromEnhanced);
console.log('✅ Optimized conversion:', convertedFromOptimized);
console.log('✅ Unified Property:', unifiedProperty);
console.log('✅ Back to Schema:', backToSchema);

// Verify expected properties
console.log('🔍 Validation Tests:');
console.log('- Text schema has correct type:', textPropertySchema.type === PropertyType.TEXT);
console.log('- Color schema has correct type:', colorPropertySchema.type === PropertyType.COLOR);
console.log('- Select has options:', selectPropertySchema.options?.length === 3);
console.log('- Array has itemSchema:', arrayPropertySchema.itemSchema?.length === 2);
console.log('- Legacy conversion works:', convertedFromLegacy.type === PropertyType.TEXT);
console.log('- Enhanced conversion works:', convertedFromEnhanced.type === PropertyType.COLOR);
console.log('- Optimized conversion works:', convertedFromOptimized.type === PropertyType.SELECT);
console.log('- Bidirectional conversion preserves data:', backToSchema.key === textPropertySchema.key);

export {
  textPropertySchema,
  colorPropertySchema,
  selectPropertySchema,
  arrayPropertySchema,
  convertedFromLegacy,
  convertedFromEnhanced,
  convertedFromOptimized
};