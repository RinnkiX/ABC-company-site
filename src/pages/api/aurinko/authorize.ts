import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  const auth = await locals.auth();
  if (!auth.userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const clientId = import.meta.env.AURINKO_CLIENT_ID;
  const redirectUri = import.meta.env.AURINKO_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return new Response('Aurinko not configured', { status: 500 });
  }

  const url = new URL('https://api.aurinko.io/v1/auth/authorize');
  url.searchParams.set('clientId', clientId);
  url.searchParams.set('serviceType', 'Office365');
  url.searchParams.set('scopes', 'Mail.Read Mail.Send');
  url.searchParams.set('responseType', 'code');
  url.searchParams.set('returnUrl', redirectUri);
  url.searchParams.set('state', auth.userId);

  return Response.redirect(url.toString(), 302);
};
