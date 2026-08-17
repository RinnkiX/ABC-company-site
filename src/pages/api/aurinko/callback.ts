import type { APIRoute } from 'astro';
import { getAurinkoAccountInfo } from '../../../lib/aurinko';
import { saveAurinkoAccount } from '../../../lib/redis';

function redirect(path: string) {
  return new Response(null, {
    status: 302,
    headers: { Location: path },
  });
}

export const GET: APIRoute = async ({ url }) => {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const status = url.searchParams.get('status');

  if (status !== 'success' || !code || !state) {
    return redirect('/?aurinko=failed');
  }

  const clientId = import.meta.env.AURINKO_CLIENT_ID;
  const secret = import.meta.env.AURINKO_CLIENT_SECRET;

  if (!clientId || !secret) {
    return redirect('/?aurinko=config_error');
  }

  // Exchange authorization code for an account access token.
  const tokenRes = await fetch(
    `https://api.aurinko.io/v1/auth/token/${encodeURIComponent(code)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString('base64')}`,
      },
    }
  );

  if (!tokenRes.ok) {
    console.error('Aurinko token exchange failed:', await tokenRes.text());
    return redirect('/?aurinko=token_failed');
  }

  const { accountId, accessToken } = (await tokenRes.json()) as {
    accountId: number;
    accessToken: string;
  };

  // Fetch account details so we know which email address was authorized.
  const account = await getAurinkoAccountInfo(accessToken);

  // Persist the authorization relationship keyed by the Clerk user id.
  await saveAurinkoAccount(state, {
    accountId,
    email: account.email,
    serviceType: account.serviceType,
    accessToken,
  });

  return redirect('/?aurinko=connected');
};
