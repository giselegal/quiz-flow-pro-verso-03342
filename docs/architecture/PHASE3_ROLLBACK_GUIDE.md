# 🔄 Phase 3 - Emergency Rollback Guide

**Version**: 1.0.0  
**Last Updated**: 2025-11-24  
**Phase**: 3 - Strong Deprecation  
**Status**: Active

---

## 📋 Overview

This guide provides instructions for emergency rollback from canonical services to legacy services in case of critical production issues.

**⚠️ IMPORTANT**: This rollback mechanism should only be used in emergency situations. Canonical services are now the official default and have been thoroughly tested.

---

## 🚨 When to Use Emergency Rollback

Use the global rollback flag ONLY if:

1. **Critical Production Issue**: A bug in canonical services is causing production outages
2. **Data Integrity Risk**: Data loss or corruption is occurring
3. **Performance Crisis**: Severe performance degradation affecting users
4. **Security Incident**: A security vulnerability is discovered in canonical services

**DO NOT USE** for:
- Minor bugs that don't affect production
- Performance issues that can be optimized
- Development/testing problems
- Personal preference for legacy code

---

## 🔧 How to Enable Emergency Rollback

### Step 1: Enable Global Rollback Flag

Edit `src/config/flags.ts`:

```typescript
export const featureFlags = {
  /**
   * ⚠️ EMERGENCY ROLLBACK ACTIVE ⚠️
   */
  DISABLE_CANONICAL_SERVICES_GLOBAL: true,  // Changed from false
  
  // Other flags...
  USE_CANONICAL_TEMPLATE_SERVICE: true,
  USE_REACT_QUERY_TEMPLATES: true,
  // ...
};
```

### Step 2: Deploy Immediately

```bash
# Build the application
npm run build

# Deploy to production
# (use your deployment process)
```

### Step 3: Monitor Systems

After enabling rollback:
1. Monitor error logs for improvement
2. Check user reports
3. Verify data integrity
4. Monitor performance metrics

### Step 4: Document the Incident

Create an incident report documenting:
- What went wrong
- Why rollback was necessary
- Impact on users
- Timeline of events
- Steps taken

---

## 🔍 What Happens During Rollback

When `DISABLE_CANONICAL_SERVICES_GLOBAL` is set to `true`:

### Template Services

```typescript
// Before rollback (normal operation)
if (featureFlags.DISABLE_CANONICAL_SERVICES_GLOBAL) {
  // Not executed
} else {
  const template = await templateService.getTemplate(id); // ✅ Canonical
}

// After rollback
if (featureFlags.DISABLE_CANONICAL_SERVICES_GLOBAL) {
  // ⚠️ Legacy path (if still available)
  console.warn('ROLLBACK MODE ACTIVE');
} else {
  // Not executed
}
```

### React Query Hooks

```typescript
// shouldUseReactQuery() returns false during rollback
if (shouldUseReactQuery()) {
  // Not executed during rollback
  const { data } = useTemplate(id);
} else {
  // ⚠️ Legacy data fetching
  useEffect(() => {
    // Manual fetch logic
  }, [id]);
}
```

### Migration Helpers

All migration helpers respect the global rollback flag:
- `shouldUseCanonicalServices()` → returns `false`
- `shouldUseReactQuery()` → returns `false`
- `getTemplateService()` → logs warning, returns canonical (legacy removed)

---

## ⚠️ Limitations

### Phase 3 Considerations

**Important**: By Phase 3, many legacy services have been removed:

1. **Legacy Template Services**: Most have been removed or hard-deprecated
2. **Storage Layers**: localStorage/sessionStorage usage is deprecated
3. **Cache Services**: Legacy cache layers are being removed

**This means**: The rollback may have limited effectiveness if legacy code has been removed. The rollback primarily:
- Disables React Query optimizations
- Falls back to synchronous operations
- Disables cache invalidation features

### What is NOT Available in Rollback

- Old template services (UnifiedTemplateRegistry, etc.) - removed
- Legacy storage adapters - deprecated
- Multiple cache layers - consolidated
- Zustand stores for business data - migrated to React Query

---

## 🔙 Disabling Rollback (Return to Normal)

Once the issue is resolved:

### Step 1: Disable Rollback Flag

Edit `src/config/flags.ts`:

```typescript
export const featureFlags = {
  DISABLE_CANONICAL_SERVICES_GLOBAL: false,  // Back to normal
  // ...
};
```

### Step 2: Test Thoroughly

Before deploying:
1. Run all tests: `npm test`
2. Test affected features manually
3. Verify data integrity
4. Check performance metrics

### Step 3: Deploy Gradually

1. Deploy to staging first
2. Monitor for issues
3. Deploy to production
4. Monitor closely for 24-48 hours

---

## 📊 Monitoring During Rollback

### Key Metrics to Watch

1. **Error Rate**: Should decrease after rollback
2. **Response Time**: Should improve or stabilize
3. **User Complaints**: Should reduce
4. **Data Integrity**: No corruption or loss

### Log Messages to Monitor

During rollback, you'll see warnings:

```
⚠️ [ROLLBACK] DISABLE_CANONICAL_SERVICES_GLOBAL is active.
⚠️ [ROLLBACK] Using legacy template service.
⚠️ [ROLLBACK] React Query disabled by global rollback flag
⚠️ [ROLLBACK] Canonical services disabled by global rollback flag
```

These are expected and indicate the rollback is active.

---

## 🐛 Troubleshooting

### Issue: Rollback didn't fix the problem

**Possible causes**:
1. Issue is not in canonical services
2. Legacy code has been removed
3. Data corruption occurred before rollback

**Actions**:
1. Review error logs more carefully
2. Check if issue exists in other systems
3. Consider if legacy code still exists
4. Escalate to tech lead

### Issue: Can't enable rollback

**Possible causes**:
1. Build system not recognizing flag change
2. Cache issues in deployment
3. Configuration not being read correctly

**Actions**:
1. Clear build cache: `rm -rf dist/`
2. Rebuild: `npm run build`
3. Verify flag value is being read in runtime
4. Check deployment logs

### Issue: Partial rollback effect

**Possible causes**:
1. Some components don't check rollback flag
2. Cached data still using canonical path
3. Browser caching

**Actions**:
1. Clear all caches
2. Force browser refresh (Ctrl+Shift+R)
3. Review component code for flag usage
4. Check migration helper implementation

---

## 📚 Related Documentation

- [Services Canônicos e Fonte Única](./services-canonicos-e-fonte-unica.md) - Main architecture doc
- [Migration Helpers](../../src/services/canonical/migrationHelpers.ts) - Helper functions
- [Feature Flags](../../src/config/flags.ts) - All feature flags

---

## 👥 Escalation Path

If rollback doesn't resolve the issue:

1. **Tech Lead**: Immediate escalation for critical production issues
2. **Architecture Team**: For systemic problems or design issues
3. **DevOps**: For deployment or infrastructure issues
4. **Product Team**: For user impact assessment

---

## 📝 Post-Incident Actions

After any rollback:

1. **Root Cause Analysis**: Why did the issue occur?
2. **Fix Implementation**: Resolve the underlying problem
3. **Test Coverage**: Add tests to prevent recurrence
4. **Documentation Update**: Document learnings
5. **Team Review**: Share knowledge with team

---

## ✅ Rollback Checklist

Use this checklist during a rollback incident:

- [ ] Confirm issue severity warrants rollback
- [ ] Document incident start time
- [ ] Enable `DISABLE_CANONICAL_SERVICES_GLOBAL` flag
- [ ] Build application
- [ ] Deploy to production
- [ ] Monitor error logs
- [ ] Verify user impact is reduced
- [ ] Document issue details
- [ ] Create bug report
- [ ] Plan fix implementation
- [ ] Test fix thoroughly
- [ ] Disable rollback flag
- [ ] Deploy fix
- [ ] Monitor for 24-48 hours
- [ ] Complete post-incident review
- [ ] Update documentation
- [ ] Share learnings with team

---

**Remember**: Rollback is a temporary emergency measure, not a permanent solution. Always work to fix the root cause and return to canonical services.
