export interface AurinkoAccountInfo {
  id: number;
  email: string;
  serviceType: string;
  scopes: string[];
}

export async function getAurinkoAccountInfo(
  accessToken: string
): Promise<AurinkoAccountInfo> {
  const res = await fetch('https://api.aurinko.io/v1/account', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Aurinko account info: ${await res.text()}`);
  }

  return (await res.json()) as AurinkoAccountInfo;
}

export interface SendEmailPayload {
  subject: string;
  body: string;
  to: { address: string }[];
}

export async function sendEmailWithAurinko(
  accessToken: string,
  email: SendEmailPayload
): Promise<Record<string, unknown>> {
  const res = await fetch(
    'https://api.aurinko.io/v1/email/messages?bodyType=html',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(email),
    }
  );

  if (!res.ok) {
    throw new Error(`Aurinko send failed: ${await res.text()}`);
  }

  return (await res.json()) as Record<string, unknown>;
}
