import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const ALLOW_WHEN_BLOCKED = new Set<string>([
  '/license-blocked',
  '/admin/login',
  '/admin/license',
]);

const ALLOW_PREFIXES_WHEN_BLOCKED = ['/api/license/'];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  const { data: license } = await supabase
    .from('license_public')
    .select('valido,status')
    .eq('id', 1)
    .maybeSingle();

  const licenseActive =
    license?.valido === true && license?.status === 'ativo';

  if (!licenseActive) {
    const isAllowed =
      ALLOW_WHEN_BLOCKED.has(path) ||
      ALLOW_PREFIXES_WHEN_BLOCKED.some((p) => path.startsWith(p));

    if (path.startsWith('/admin') && path !== '/admin/login' && path !== '/admin/license') {
      if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        url.searchParams.set('redirect', '/admin/license');
        return NextResponse.redirect(url);
      }
      const url = request.nextUrl.clone();
      url.pathname = '/admin/license';
      url.search = '';
      return NextResponse.redirect(url);
    }

    if (path === '/admin/login' && user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/license';
      url.search = '';
      return NextResponse.redirect(url);
    }

    if (!isAllowed) {
      const url = request.nextUrl.clone();
      url.pathname = '/license-blocked';
      url.search = '';
      return NextResponse.redirect(url);
    }

    return response;
  }

  if (path.startsWith('/admin') && path !== '/admin/login') {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('redirect', path);
      return NextResponse.redirect(url);
    }
  }

  if (path === '/admin/login' && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (path === '/license-blocked') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return response;
}
