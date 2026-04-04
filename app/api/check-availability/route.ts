import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || 'https://service.2xg.in',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type');
  const value = request.nextUrl.searchParams.get('value');

  if (!type || !value) {
    return NextResponse.json({ taken: false });
  }

  try {
    if (type === 'slug') {
      const slug = value.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
      if (slug.length < 3) return NextResponse.json({ taken: false });

      const { data } = await supabaseAdmin
        .from('organizations')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      return NextResponse.json({ taken: !!data });
    }

    if (type === 'email') {
      const email = value.toLowerCase().trim();
      // Check users table (linked to auth) instead of listing all auth users
      const { data } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      return NextResponse.json({ taken: !!data });
    }

    if (type === 'shortcode') {
      const code = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const { data } = await supabaseAdmin
        .from('organizations')
        .select('id')
        .eq('short_code', code)
        .maybeSingle();

      return NextResponse.json({ taken: !!data });
    }

    return NextResponse.json({ taken: false });
  } catch {
    return NextResponse.json({ taken: false });
  }
}
