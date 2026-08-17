import type { APIRoute } from 'astro';
import { sendEmailWithAurinko } from '../../../lib/aurinko';
import { getAurinkoAccount } from '../../../lib/redis';

export const POST: APIRoute = async ({ locals }) => {
  const auth = await locals.auth();
  if (!auth.userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const account = await getAurinkoAccount(auth.userId);
  if (!account) {
    return new Response(
      JSON.stringify({ error: 'No email account connected' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Mock email content — sent from the user's own address to themselves.
  const email = {
    subject: 'Test email sent via Aurinko',
    body: `<p>Hi there,</p>
<p>This is a mock email sent through <strong>Aurinko</strong> using your own mailbox (<code>${account.email}</code>).</p>
<p>If you received this, the integration is working correctly.</p>
<p>— ABC Company</p>`,
    to: [{ address: account.email }],
  };

  try {
    const result = await sendEmailWithAurinko(account.accessToken, email);
    return new Response(JSON.stringify({ success: true, aurinkoResponse: result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
