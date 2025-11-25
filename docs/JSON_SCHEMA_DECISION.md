# JSON Schema Architecture Decision

## Decision: Use JSON Schema Draft 2020-12 with Zod for TypeScript Validation

### Date: 2025-11-25

### Status: Implemented

---

## Context

The project had multiple sources of validation truth:
1. **JSON Schema files** (`schemas/*.schema.json`) - Using deprecated Draft-07 (2018)
2. **Zod schemas** (`src/types/schemas/*.schema.ts`) - TypeScript-first validation
3. **Manual validation** in components like `JsonTemplateEditor.tsx`

This created:
- ❌ Drift between validation rules
- ❌ Duplicate maintenance effort
- ❌ No IDE support for JSON files
- ❌ No runtime validation from JSON Schema

---

## Decision

### 1. Upgrade JSON Schema to Draft 2020-12

All JSON Schema files have been updated to use:
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "/schemas/component.schema.json"
}
```

**Benefits:**
- Modern validation features
- Better tool support
- Security improvements
- Future-proof

### 2. Use AJV 2020 for Runtime Validation

Created `src/lib/validation/jsonSchemaValidator.ts`:
- Uses `ajv/dist/2020` for Draft 2020-12 support
- Includes `ajv-formats` for format validation (email, uri, etc.)
- Exports typed validation functions

### 3. Add $schema References to Template JSONs

All template JSON files now include:
```json
{
  "$schema": "/schemas/quiz-template-v4.schema.json",
  "version": "4.0.0"
}
```

**Benefits:**
- IDE autocompletion in VSCode
- Real-time validation in editors
- Self-documenting files

### 4. Keep Zod for TypeScript Validation

Zod schemas remain the **primary source of truth** for TypeScript types because:
- Type inference at compile time
- Better developer experience
- More powerful validation expressions
- Integration with React Hook Form

### 5. JSON Schema as Secondary Validation

JSON Schema is used for:
- Runtime validation of external JSON files
- IDE support and autocompletion
- CI/CD validation in `audit-jsons.mjs`
- API response validation

---

## Schema Files

| File | Purpose |
|------|---------|
| `schemas/template.schema.json` | Basic template structure |
| `schemas/component.schema.json` | Block/component validation |
| `schemas/stage.schema.json` | Stage/step structure |
| `schemas/logic.schema.json` | Conditional logic rules |
| `schemas/outcome.schema.json` | Quiz result outcomes |
| `schemas/quiz-template-v4.schema.json` | Complete v4 template validation |

---

## Usage Examples

### Runtime Validation

```typescript
import { validateTemplateV4, validateComponent } from '@/lib/validation/jsonSchemaValidator';

// Validate a template
const result = validateTemplateV4(jsonData);
if (!result.valid) {
  console.error(result.errorMessages);
}

// Validate a component
const componentResult = validateComponent(blockData);
```

### IDE Support (VSCode)

The `.vscode/settings.json` configures schema mappings:
```json
{
  "json.schemas": [
    {
      "fileMatch": ["**/public/templates/**/*.json"],
      "url": "./schemas/quiz-template-v4.schema.json"
    }
  ]
}
```

### CI/CD Validation

Run the audit script with strict mode:
```bash
npm run audit:jsons -- --schema-strict
```

---

## Future Recommendations

### 1. Consider zod-to-json-schema

If Zod schemas need to be synchronized with JSON Schema:
```typescript
import { zodToJsonSchema } from 'zod-to-json-schema';
const jsonSchema = zodToJsonSchema(ZodSchema);
```

### 2. Deprecate Duplicate Validation

Gradually remove manual validation in components that duplicates Zod or JSON Schema rules.

### 3. API Schema Validation

Use JSON Schema for API request/response validation with AJV.

---

## References

- [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12/release-notes)
- [AJV Documentation](https://ajv.js.org/)
- [Zod Documentation](https://zod.dev/)
