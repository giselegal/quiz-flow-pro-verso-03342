# 📋 Deployment Checklist - Canvas Loading Fix

## ✅ Pre-Deployment Verification (COMPLETED)

- [x] Build successful (no compilation errors)
- [x] Linting passed (no errors, only pre-existing warnings)
- [x] Code review completed
- [x] Security scan completed
- [x] Documentation created

## 🚀 Deployment Steps

### Step 1: Apply Database Migration (REQUIRED)

**Option A: Via Supabase Dashboard** (Recommended)
1. Access your Supabase project dashboard
2. Go to SQL Editor
3. Copy and paste contents from:
   ```
   supabase/migrations/20251110_add_config_column_to_funnels.sql
   ```
4. Click "Run"
5. Verify success message

**Option B: Via Supabase CLI**
```bash
# If you have Supabase CLI installed
supabase db push

# Or manually via script
npm run db:apply-remote -- --file supabase/migrations/20251110_add_config_column_to_funnels.sql
```

**Verification**:
```sql
-- Run this query in Supabase SQL Editor to verify
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'funnels' AND column_name = 'config';
-- Should return: config | jsonb
```

### Step 2: Configure Environment Variables

**Development Environment**:
```bash
# Create .env file in project root
cat > .env << 'EOF'
# Supabase Configuration
VITE_SUPABASE_URL=https://dgpbqhjktlnjiatcqheh.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Template Configuration
VITE_DISABLE_ADMIN_OVERRIDE=true
VITE_DISABLE_TEMPLATE_OVERRIDES=true
VITE_TEMPLATE_JSON_ONLY=true
VITE_ENABLE_HIERARCHICAL_SOURCE=true

# Supabase Settings
VITE_DISABLE_SUPABASE=false
VITE_EDITOR_SUPABASE_ENABLED=true
EOF
```

**Production/Staging Environment**:
- Set the same environment variables in your hosting platform
- For Netlify: Site settings → Environment variables
- For Vercel: Project settings → Environment Variables

### Step 3: Deploy Application

**If using CI/CD**:
```bash
git push origin copilot/analyze-canvas-loading-issues
# Merge PR via GitHub
# CI/CD will auto-deploy
```

**Manual deployment**:
```bash
npm run build
# Deploy dist/ folder to your hosting platform
```

### Step 4: Verify Deployment

Access the following URLs and verify:

1. **Template Loading**:
   - URL: `https://your-domain.com/editor?resource=quiz21StepsComplete`
   - ✅ No CSP errors in console
   - ✅ No 404 errors for template_overrides
   - ✅ Steps appear in canvas
   - ✅ Blocks render correctly

2. **Console Checks**:
   ```javascript
   // Open browser console (F12)
   // Should NOT see:
   // - "Content Security Policy" violations
   // - "404 (Not Found)" for template_overrides
   // - "NENHUMA FONTE disponível"
   
   // Should see:
   // - "✅ [NEW] Step step-01 loaded from TEMPLATE_DEFAULT"
   // - "✅ [BUILT-IN] Template quiz21StepsComplete disponível"
   ```

3. **Network Tab**:
   - Check Network tab (F12)
   - Verify JSON templates loading: `templates/funnels/quiz21StepsComplete/steps/step-01.json`
   - Status should be 200 OK

4. **Functional Test**:
   - [ ] Can navigate between steps
   - [ ] Can add/edit blocks
   - [ ] Can see block properties panel
   - [ ] Preview works correctly

## 🔧 Troubleshooting

### Issue: Steps still not loading

**Check 1**: Environment variables loaded?
```bash
# In development
cat .env | grep VITE_

# In production - check hosting platform dashboard
```

**Check 2**: Migration applied?
```sql
-- In Supabase SQL Editor
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'funnels';
-- Should include 'config' column
```

**Check 3**: Cache cleared?
- Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
- Clear browser cache
- Try incognito/private window

### Issue: CSP errors persist

**Solution**: Verify CSP in deployed index.html includes:
```html
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://cdn.gpteng.co https://lovable.dev
img-src 'self' data: blob: https://res.cloudinary.com
manifest-src 'self' https://lovable.dev
```

### Issue: 404 errors for template_overrides

**Solution**: Verify `.env` includes:
```env
VITE_DISABLE_ADMIN_OVERRIDE=true
VITE_TEMPLATE_JSON_ONLY=true
```

### Issue: Template files not found

**Check**: JSON files exist in public folder:
```bash
ls -la public/templates/funnels/quiz21StepsComplete/steps/
# Should show step-01.json through step-21.json
```

## 📊 Success Criteria

### Must Have (Critical)
- ✅ Editor loads without errors
- ✅ All 21 steps accessible
- ✅ Blocks render in canvas
- ✅ No console errors related to CSP or 404s

### Should Have (Important)
- ✅ Fast loading times (<2s for first step)
- ✅ Smooth navigation between steps
- ✅ Block properties editable
- ✅ Preview functions correctly

### Nice to Have (Optional)
- ✅ No warnings in console
- ✅ Performance metrics logged
- ✅ Analytics tracking works

## 📚 Reference Documents

- **Solution Details**: `SOLUTION_STEPS_NOT_LOADING.md`
- **Migration File**: `supabase/migrations/20251110_add_config_column_to_funnels.sql`
- **Environment Example**: `.env.example` (update with new variables)

## 🆘 Rollback Plan

If issues occur after deployment:

1. **Revert Code Changes**:
   ```bash
   git revert HEAD~3  # Revert last 3 commits
   git push origin copilot/analyze-canvas-loading-issues --force
   ```

2. **Rollback Migration** (if needed):
   ```sql
   -- In Supabase SQL Editor
   ALTER TABLE public.funnels DROP COLUMN IF EXISTS config;
   DROP INDEX IF EXISTS idx_funnels_config;
   ```

3. **Restore Previous Environment**:
   - Remove new VITE_* variables
   - Restore previous .env values

## ✅ Sign-Off Checklist

Before marking as complete:

- [ ] Migration applied successfully
- [ ] Environment variables configured
- [ ] Application deployed
- [ ] Smoke tests passed
- [ ] No critical errors in logs
- [ ] Stakeholders notified

---

**Deployment Date**: ___________  
**Deployed By**: ___________  
**Environment**: [ ] Development [ ] Staging [ ] Production  
**Status**: [ ] Success [ ] Issues [ ] Rolled Back
