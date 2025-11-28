# JSON Template Migration Guide (V3 → V4)

**Last Updated:** November 28, 2025  
**Status:** Active Migration  
**Progress:** 95.8% Complete

---

## 📊 Current Status

Run `npm run audit:migration-status` to generate a fresh report.

| Metric | Count |
|--------|-------|
| ✅ V4 Templates | 68 |
| ⏳ V3 Templates (pending) | 3 |
| ❓ Unknown version | 21 |
| **Total** | 92 |

---

## 🎯 What is V4?

V4 templates include:
- `$schema` pointing to `/schemas/quiz-template-v4.schema.json`
- `version` starting with `4.x.x`
- `metadata` object with creation/update timestamps
- `stages` array (instead of `steps` for V3)

### V3 Structure (Legacy)
```json
{
  "version": "3.0.0",
  "steps": [
    { "id": "step-01", "blocks": [...] }
  ]
}
```

### V4 Structure (Current)
```json
{
  "$schema": "/schemas/quiz-template-v4.schema.json",
  "version": "4.0.0",
  "metadata": {
    "created": "2025-11-28T00:00:00Z",
    "updated": "2025-11-28T00:00:00Z"
  },
  "stages": [
    { "id": "stage-01", "blocks": [...] }
  ]
}
```

---

## 🔧 Migration Scripts

### Automated Migration

```bash
# Migrate a single file
node scripts/migrate-to-v4.mjs --file public/templates/step-01-v3.json

# Migrate all files in a directory
node scripts/migrate-to-v4.mjs --path public/templates

# Dry run (no changes)
node scripts/migrate-to-v4.mjs --path public/templates --dry-run

# Generate migration report
node scripts/migrate-to-v4.mjs --path public/templates --report reports/migration.md
```

### Validation

```bash
# Validate single template against V4 schema
node scripts/validate-json-v4.mjs

# Full JSON audit (includes schema validation)
npm run audit:jsons

# CI validation (fails on errors)
npm run ci:json:v4
```

---

## 📁 Key Directories

| Directory | Description | Status |
|-----------|-------------|--------|
| `public/templates/` | Production templates | 94% V4 |
| `public/templates/steps-refs/` | Reference step templates | 100% V4 |
| `public/templates/funnels/` | Funnel configurations | Needs migration |
| `schemas/` | JSON Schema definitions | ✅ Ready |

---

## ✅ Migration Checklist

### Before Migration
- [ ] Backup current templates
- [ ] Run `npm run audit:jsons` to identify issues
- [ ] Review `reports/json-migration-status-*.md`

### During Migration
- [ ] Run migration script with `--dry-run` first
- [ ] Review proposed changes
- [ ] Execute migration
- [ ] Validate with `npm run validate:json:v4`

### After Migration
- [ ] Run `npm run build` to verify no breaking changes
- [ ] Run `npm run test:v4` for V4 tests
- [ ] Update migration status report

---

## 🔍 Schema Files

| Schema | Purpose |
|--------|---------|
| `schemas/quiz-template-v4.schema.json` | Main template schema |
| `schemas/component.schema.json` | Component definitions |
| `schemas/stage.schema.json` | Stage/step definitions |
| `schemas/logic.schema.json` | Logic flow definitions |
| `schemas/outcome.schema.json` | Result outcome definitions |

---

## 🚨 Common Issues

### 1. Missing $schema
```bash
# Add schema reference to all files in directory
node scripts/add-schema-refs.mjs --path public/templates
```

### 2. Version Mismatch
```bash
# Update version field
node scripts/update-template-version.mjs --file template.json --version 4.0.0
```

### 3. Steps vs Stages
V4 uses `stages` instead of `steps`. The migration script handles this automatically.

---

## 🔄 CI Integration

JSON validation runs on:
- Every push to `main`
- Every PR targeting `main`
- Daily at 6 AM UTC (scheduled)

See `.github/workflows/validate-json-and-rls.yml` for details.

### Failed CI?
1. Check the `json-v4-validation-report` artifact
2. Fix reported schema errors
3. Re-run validation locally: `npm run ci:json:v4`

---

## 📚 Related Documentation

- [JSON Schema Decision](./JSON_SCHEMA_DECISION.md)
- [JSON V4 Final Report](./JSON_V4_FINAL_REPORT.md)
- [Template System](./TEMPLATE_SYSTEM.md)
- [Migration Guide V4](./MIGRATION_GUIDE_V4.md)

---

## 🆘 Need Help?

1. Check existing migration reports in `reports/`
2. Run `npm run audit:jsons` for detailed error info
3. Consult the schema files in `schemas/` for valid structure

---

_This guide is part of the Quiz Flow Pro V4 migration project._
