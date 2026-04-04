import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || 'https://service.2xg.in',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Must match the list in register/route.ts
const RESERVED_SLUGS = new Set([
  'admin', 'api', 'login', 'signup', 'register', 'dashboard',
  'app', 'www', 'help', 'support', 'billing', 'settings',
  'auth', 'oauth', 'callback', 'webhook', 'webhooks',
  'static', 'assets', 'public', 'health', 'status',
]);

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type');
  const value = request.nextUrl.searchParams.get('value');

  if (!type || !value) {
    return NextResponse.json({ taken: false });
  }

  try {
    if (type === 'slug') {
      const slug = value.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
      if (slug.length < 2) return NextResponse.json({ taken: false });

      // Check reserved slugs
      if (RESERVED_SLUGS.has(slug)) {
        return NextResponse.json({ taken: true, reason: 'reserved' });
      }

      // Only check active orgs — soft-deleted ones don't block new signups
      const { data } = await supabaseAdmin
        .from('organizations')
        .select('id')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      return NextResponse.json({ taken: !!data });
    }

    if (type === 'email') {
      const email = value.toLowerCase().trim();
      const { data } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      return NextResponse.json({ taken: !!data });
    }

    return NextResponse.json({ taken: false });
  } catch {
    return NextResponse.json({ taken: false });
  }
}
