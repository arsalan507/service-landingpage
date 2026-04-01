# 2XG Service — Freemium Plan Strategy

## Philosophy

**Don't lock features, lock usage.**

Hard feature locks ("you can't use this") → user feels cheated → leaves.
Soft usage limits ("you've used 20/20 jobs this month") → user is already hooked → upgrades.

---

## Plan Tiers

### Free (Starter)
Everything works. No feature is hidden. But usage is capped.

| Limit | Value |
|-------|-------|
| Jobs per month | 20 |
| Mechanic slots | 2 |
| Job history | 7 days (older jobs hidden) |
| WhatsApp notifications | Disabled |
| Google Sheets sync | Disabled |
| Photo storage | 100 MB |
| Branding | "Powered by 2XG" on customer receipts |
| Export reports | Disabled |
| Dashboard analytics | Weekly stats only |

### Pro (₹999/month or ₹799/month yearly)

| Limit | Value |
|-------|-------|
| Jobs per month | Unlimited |
| Mechanic slots | 10 |
| Job history | 90 days + dashboard analytics |
| WhatsApp notifications | Enabled |
| Google Sheets sync | Enabled |
| Photo storage | 5 GB |
| Branding | Remove "Powered by 2XG" |
| Export reports | PDF/CSV enabled |
| Dashboard analytics | Monthly + yearly charts |

### Enterprise (₹1,999/month)

| Limit | Value |
|-------|-------|
| Jobs per month | Unlimited |
| Mechanic slots | Unlimited |
| Job history | Unlimited |
| WhatsApp notifications | Enabled |
| Google Sheets sync | Enabled |
| Photo storage | 50 GB |
| Branding | Custom logo on receipts |
| Export reports | PDF/CSV + API access |
| Dashboard analytics | Full + multi-location |
| Multi-location | Enabled |
| Priority support | Dedicated account manager |

---

## Natural Upgrade Triggers

These are moments where the free user hits a limit and sees the upgrade prompt organically — not forced, not annoying, just the right time.

| Trigger | When it Happens | What User Sees |
|---------|----------------|----------------|
| **Job limit hit** | Day 10–15 of month (busy shop hits 20 jobs) | Banner at top: "You've used 20/20 jobs this month. Upgrade to Pro for unlimited." New check-in is blocked. |
| **Mechanic limit** | Owner tries to add 3rd mechanic in Team page | Modal: "Free plan supports 2 mechanics. Upgrade to Pro to add up to 10." |
| **WhatsApp grayed out** | Every check-in form, notification toggle | Toggle shows "PRO" badge, visible but disabled. Owner sees it every single time. |
| **Old jobs disappear** | After 7 days, jobs vanish from history | "View older jobs with Pro →" link in job history list. |
| **Dashboard stats locked** | Admin opens dashboard | Weekly stats visible. Monthly/yearly charts show blurred overlay with "Upgrade to Pro" button. |
| **Export blocked** | Owner tries to download report or invoice | "Export to PDF/CSV available on Pro →" |
| **Storage full** | After ~50-80 photos taken | "Photo storage full (100MB). Upgrade for 5GB." Camera still works but photos fail to upload. |
| **Sheets sync grayed** | Settings page, Sheets integration section | Toggle shows "PRO" badge, input fields are disabled. |
| **Branding visible** | Every customer-facing receipt/notification | "Powered by 2XG Service" — can't remove on free plan. |

### Key Insight
The free plan should work well enough that the shop owner **depends on it daily**. Once they depend on it, the limits create natural friction that makes upgrading feel like a relief, not a purchase.

---

## UI Pattern — Show, Don't Hide

**Never remove features from the UI.** Show them grayed out with a "PRO" badge. Every time the owner sees that badge, it's a silent ad for upgrading.

```
┌──────────────────────────────────────┐
│  ☑ SMS notification                  │  ← works on free
│  ☐ WhatsApp notification      [PRO]  │  ← visible but locked  
│  ☐ Google Sheets sync         [PRO]  │  ← visible but locked
│  ☐ Remove branding      [ENTERPRISE] │  ← visible but locked
└──────────────────────────────────────┘
```

### Upgrade Banner (appears when limit is near or hit)

```
┌─────────────────────────────────────────────────┐
│ ⚡ You've used 18/20 jobs this month.           │
│    Upgrade to Pro for unlimited jobs →           │
└─────────────────────────────────────────────────┘
```

### Upgrade Banner (hard block when limit is reached)

```
┌─────────────────────────────────────────────────┐
│ 🔒 Job limit reached (20/20)                    │
│    You can't create new jobs until next month.   │
│    [Upgrade to Pro — ₹999/mo]  [Remind me later] │
└─────────────────────────────────────────────────┘
```

---

## Database Changes

### Migration: Add plan columns to organizations

```sql
-- Add plan management columns
ALTER TABLE organizations 
  ADD COLUMN plan_type TEXT DEFAULT 'free' 
    CHECK (plan_type IN ('free', 'pro', 'enterprise')),
  ADD COLUMN plan_expires_at TIMESTAMPTZ,
  ADD COLUMN max_mechanics INT DEFAULT 2,
  ADD COLUMN max_jobs_per_month INT DEFAULT 20,
  ADD COLUMN storage_limit_mb INT DEFAULT 100;

-- Future: subscription tracking
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'pro', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'cancelled', 'trialing')),
  amount INT NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  payment_provider TEXT, -- 'razorpay' / 'manual'
  provider_subscription_id TEXT, -- razorpay subscription ID
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Future: invoice history
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  subscription_id UUID REFERENCES subscriptions(id),
  amount INT NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'paid' CHECK (status IN ('draft', 'paid', 'failed', 'refunded')),
  payment_provider TEXT,
  provider_payment_id TEXT, -- razorpay payment ID
  invoice_url TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### RPC: Get job count for current month

```sql
CREATE OR REPLACE FUNCTION get_org_jobs_this_month(p_org_id UUID)
RETURNS INT AS $$
  SELECT COUNT(*)::INT FROM jobs 
  WHERE org_id = p_org_id 
  AND created_at >= date_trunc('month', now());
$$ LANGUAGE sql STABLE SECURITY DEFINER;
```

### RPC: Get storage usage

```sql
CREATE OR REPLACE FUNCTION get_org_storage_mb(p_org_id UUID)
RETURNS NUMERIC AS $$
  SELECT COALESCE(SUM((metadata->>'size')::BIGINT), 0) / (1024.0 * 1024.0)
  FROM storage.objects 
  WHERE bucket_id = 'job-photos' 
  AND name LIKE p_org_id || '/%';
$$ LANGUAGE sql STABLE SECURITY DEFINER;
```

---

## Frontend Implementation

### Hook: usePlanLimits

```typescript
// src/hooks/usePlanLimits.ts
export function usePlanLimits() {
  const { org } = useAuth();
  const { jobs } = useApp();
  const plan = org?.planType || 'free';

  // Count jobs created this month
  const jobsThisMonth = jobs.filter(j => {
    const created = new Date(j.createdAt);
    const now = new Date();
    return created.getMonth() === now.getMonth() 
      && created.getFullYear() === now.getFullYear();
  }).length;

  const maxJobs = org?.maxJobsPerMonth || 20;
  const maxMechanics = org?.maxMechanics || 2;

  return {
    plan,
    isPro: plan === 'pro' || plan === 'enterprise',
    isEnterprise: plan === 'enterprise',
    
    // Usage
    jobsThisMonth,
    jobsRemaining: Math.max(0, maxJobs - jobsThisMonth),
    jobLimitReached: plan === 'free' && jobsThisMonth >= maxJobs,
    jobLimitNear: plan === 'free' && jobsThisMonth >= maxJobs - 3,
    
    // Feature gates
    canCreateJob: plan !== 'free' || jobsThisMonth < maxJobs,
    canAddMechanic: (currentCount: number) => plan !== 'free' || currentCount < maxMechanics,
    canUseWhatsApp: plan !== 'free',
    canUseSheets: plan !== 'free',
    canExport: plan !== 'free',
    canRemoveBranding: plan === 'enterprise',
    canMultiLocation: plan === 'enterprise',
    maxHistoryDays: plan === 'free' ? 7 : plan === 'pro' ? 90 : Infinity,
    
    // UI helpers
    showUpgradeBanner: plan === 'free' && jobsThisMonth >= maxJobs - 5,
    showUpgradeBlock: plan === 'free' && jobsThisMonth >= maxJobs,
    maxJobs,
    maxMechanics,
  };
}
```

### Component: ProBadge

```tsx
// Small badge shown next to locked features
function ProBadge({ plan = 'PRO' }: { plan?: 'PRO' | 'ENTERPRISE' }) {
  return (
    <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-bold tracking-wider 
      bg-gradient-to-r from-blue-500/20 to-violet-500/20 text-blue-400 
      rounded border border-blue-500/20 uppercase">
      {plan}
    </span>
  );
}
```

### Component: UpgradeBanner

```tsx
function UpgradeBanner() {
  const { jobsRemaining, jobLimitReached, maxJobs, jobsThisMonth } = usePlanLimits();
  const navigate = useNavigate();
  
  if (jobLimitReached) {
    return (
      <div className="mx-4 mb-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
        <p className="text-sm text-red-400 font-semibold">
          Job limit reached ({jobsThisMonth}/{maxJobs})
        </p>
        <p className="text-xs text-red-400/70 mt-1">
          Upgrade to Pro for unlimited jobs
        </p>
        <button 
          onClick={() => navigate('settings/billing')}
          className="mt-2 px-4 py-1.5 text-xs font-semibold bg-blue-500 text-white rounded-lg">
          Upgrade — ₹999/mo
        </button>
      </div>
    );
  }

  if (jobsRemaining <= 5) {
    return (
      <div className="mx-4 mb-3 p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 
        flex items-center justify-between">
        <p className="text-xs text-orange-400">
          ⚡ {jobsRemaining} jobs remaining this month
        </p>
        <button 
          onClick={() => navigate('settings/billing')}
          className="text-xs text-blue-400 font-semibold">
          Upgrade →
        </button>
      </div>
    );
  }

  return null;
}
```

---

## Where to Add Checks (Existing Files)

| File | What to Add |
|------|-------------|
| `AppContext.tsx → createJob()` | Check `canCreateJob` before creating. Show upgrade modal if blocked. |
| `admin/Team.tsx` | Check `canAddMechanic(count)` before adding. Show upgrade modal if blocked. |
| `admin/Settings.tsx` | WhatsApp toggle: disable if `!canUseWhatsApp`, show ProBadge. Sheets toggle: same. |
| `admin/Dashboard.tsx` | Monthly/yearly chart sections: blur overlay if `!isPro`. |
| `staff/CheckIn.tsx` | Show UpgradeBanner at top if `showUpgradeBanner`. Block form if `showUpgradeBlock`. |
| `staff/Queue.tsx` | Show UpgradeBanner at top. |
| `staff/Pickup.tsx` | "Powered by 2XG" footer if `!canRemoveBranding`. |
| `admin/Reports.tsx` (new) | Export buttons disabled if `!canExport`, show ProBadge. |
| Job history query | Filter to `maxHistoryDays` if on free plan. |

---

## Conversion Optimization

### When to Show Upgrade Prompts

| Moment | Type | Why it Works |
|--------|------|-------------|
| Job 15/20 created | Soft banner | "5 jobs left" — creates awareness |
| Job 20/20 reached | Hard block | Can't work without upgrading |
| 3rd mechanic added | Modal | Growing team = growing business = can afford Pro |
| WhatsApp toggle tapped | Tooltip | "Your customers are asking for updates — unlock WhatsApp" |
| Week 2 of usage | Push notification | "You've checked in 18 bikes! Pro shops average 3x more revenue." |
| End of month | Email/WhatsApp | Monthly summary + "Unlock full analytics with Pro" |

### Pricing Psychology

- **Never ask for money on first visit.** Always start free.
- **Free limit of 20 jobs** = hits in ~2 weeks for a busy shop (1-2 jobs/day).
- **First month Pro at ₹499** (50% launch discount) — reduces commitment anxiety.
- **Yearly plan at ₹799/mo** (20% off) — anchor against monthly ₹999.
- **"No commitment, cancel anytime"** — removes risk perception.

### Manual Upgrade Path (Before Razorpay)

Until Razorpay is integrated, handle upgrades manually:

1. Owner contacts you (WhatsApp/call) to upgrade
2. You collect payment via UPI/bank transfer
3. You run SQL to upgrade their org:

```sql
UPDATE organizations SET 
  plan_type = 'pro',
  max_mechanics = 10,
  max_jobs_per_month = 999999,
  storage_limit_mb = 5120,
  plan_expires_at = now() + interval '30 days'
WHERE slug = 'bharath-cycle-hub';
```

4. App immediately reflects new limits (no deploy needed)

---

## Implementation Order

| Step | What | Effort |
|------|------|--------|
| 1 | Add `plan_type` column + defaults to organizations table | 1 SQL migration |
| 2 | Add `planType`, `maxMechanics`, `maxJobsPerMonth` to Organization type + mapper | 10 min |
| 3 | Create `usePlanLimits` hook | 30 min |
| 4 | Add `ProBadge` + `UpgradeBanner` components | 30 min |
| 5 | Add job count check in `createJob` | 15 min |
| 6 | Add PRO badges to WhatsApp, Sheets, export in Settings | 30 min |
| 7 | Add UpgradeBanner to Queue + CheckIn pages | 15 min |
| 8 | Build Settings → Billing tab (view plan, see usage) | 1 hour |
| 9 | Razorpay integration (payment gateway) | 1-2 days (later) |

**Steps 1-8 = ~half a day.** Step 9 (Razorpay) is separate — do it when you have shops ready to pay.

---

## Key Metric to Watch

**Free-to-Pro conversion rate target: 10-15%**

If 100 shops sign up free → 10-15 should convert to Pro within 30 days.

If conversion is below 5%: limits are too generous (raise free plan limits down).
If conversion is above 20%: limits are too strict (users churning instead of upgrading).

The sweet spot is when users hit the limit right when they're most dependent on the app.
