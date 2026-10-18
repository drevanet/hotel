export async function initializePaystack(input: { email: string; amountKobo: number; reference: string; callbackUrl: string; metadata: Record<string, unknown> }) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error('PAYSTACK_SECRET_KEY is not configured');
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST', headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: input.email, amount: input.amountKobo, currency: 'NGN', reference: input.reference, callback_url: input.callbackUrl, metadata: input.metadata }),
  });
  const result = await response.json();
  if (!response.ok || !result.status || !result.data?.authorization_url) throw new Error(result.message || 'Could not initialize payment');
  return result.data as { authorization_url: string; access_code: string; reference: string };
}
export async function verifyPaystack(reference: string) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error('PAYSTACK_SECRET_KEY is not configured');
  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, { headers: { Authorization: `Bearer ${secret}` }, cache: 'no-store' });
  const result = await response.json();
  if (!response.ok || !result.status) throw new Error(result.message || 'Could not verify payment');
  return result.data;
}
