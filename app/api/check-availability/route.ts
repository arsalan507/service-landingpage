import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { RESERVED_SLUGS } from '@/lib/constants';

// --- Lazy Supabase client — only created when env vars are present ---
let _supabaseAdmin: ReturnType<typeof createClient> | null = null;

function getSupabaseAdmin() {
  if (_supabaseAdmin) return _supabaseAdmin;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  _supabaseAdmin = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  return _supabaseAdmin;
}

// Simple per-IP rate limit for this endpoint (prevent enumeration)
const checkLimitMap = new Map<string, { count: number; resetAt: number }>();
const CHECK_LIMIT = 30; // max 30 checks per minute per IP
const CHECK_WINDOW = 60_000;

function isCheckLimited(ip: string): boolean {
  const now = Date.now();
  const entry = checkLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    checkLimitMap.set(ip, { count: 1, resetAt: now + CHECK_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > CHECK_LIMIT;
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (isCheckLimited(ip)) {
    return NextResponse.json({ taken: false, error: 'rate_limit' }, { status: 429 });
  }

  const type = request.nextUrl.searchParams.get('type');
  const value = request.nextUrl.searchParams.get('value');

  if (!type || !value) {
    return NextResponse.json({ taken: false });
  }

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json({ taken: false, error: 'config' }, { status: 500 });
  }

  try {
    if (type === 'slug') {
      const slug = value.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
      if (slug.length < 3) return NextResponse.json({ taken: false });

      if (RESERVED_SLUGS.has(slug)) {
        return NextResponse.json({ taken: true, reason: 'reserved' });
      }

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
      // Don't reveal if email exists — just say "taken" without details
      return NextResponse.json({ taken: !!data });
    }

    return NextResponse.json({ taken: false });
  } catch {
    return NextResponse.json({ taken: false });
  }
}
