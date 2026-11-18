import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const runtime = 'nodejs';
export const maxDuration = 30;

type HistoryItem = { role: 'user' | 'assistant'; content: string };

const recentRequests = new Map<string, number[]>();
const systemInstructions = `You are the GCC Bot, the warm, capable assistant for GCC Foundation, a verified crowdfunding platform focused on East African community support. Answer the user's actual question in a natural, useful way, including general questions beyond the platform. Think through complex requests and give clear steps, examples, and sensible next actions. Be empathetic with emergencies, illness, loss, and hardship. Keep answers concise unless the user asks for detail.

GCC site facts: fundraiser setup starts at /create/fundraiser/category; it guides the organizer through location and campaign details. Donations are processed securely through Donorbox (clicking Donate Now opens the Donorbox donation form), with a 0% GCC platform fee for causes and 100% direct payouts to verified hospital and school accounts. Users can sign in at /sign-in, create an account at /sign-up, and manage their profile and settings at /account/settings.

Never claim that you personally verify or approve a fundraiser, guarantee safety, guarantee a payout, or confirm tax deductibility. For suspicious campaigns, tell the user to use Report this fundraiser on the campaign page. Do not request or repeat passwords, full card numbers, mobile-money PINs, bank logins, or full identity numbers. For high-stakes medical, legal, tax, or financial questions, provide general information and recommend a qualified professional or local emergency service as appropriate.

Escalate payout delays over five business days, account suspension, identity verification failures, compliance holds, failed/duplicate payments, complex technical failures, or direct requests for a human. Explain that private records require human review. The contact shown by this site is GCC Support at +256 (0) 703 601 200 (compliance@gccfoundation.org). Give a short 2-3 sentence handoff summary the user can copy when escalation is needed.`;

function withinRateLimit(key: string): boolean {
  const now = Date.now();
  const recent = (recentRequests.get(key) ?? []).filter((time) => now - time < 60_000);
  if (recent.length >= 15) return false;
  recent.push(now);
  recentRequests.set(key, recent);
  return true;
}

export async function POST(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const clientKey = forwardedFor || request.headers.get('x-real-ip') || 'local';
  if (!withinRateLimit(clientKey)) return NextResponse.json({ error: 'Please wait a moment before asking another question.' }, { status: 429 });

  let body: { message?: unknown; history?: unknown };
  try { body = await request.json() as typeof body; }
  catch { return NextResponse.json({ error: 'Send a valid message to continue.' }, { status: 400 }); }

  if (typeof body.message !== 'string' || !body.message.trim() || body.message.length > 1600) {
    return NextResponse.json({ error: 'Your message must be between 1 and 1600 characters.' }, { status: 400 });
  }
  const history = Array.isArray(body.history)
    ? (body.history as HistoryItem[]).filter((item) => item && (item.role === 'user' || item.role === 'assistant') && typeof item.content === 'string').slice(-8).map((item) => ({ role: item.role, content: item.content.slice(0, 1200) }))
    : [];

  try {
    const { env } = await getCloudflareContext({ async: true });
    const ai = (env as { AI?: { run: (model: string, input: unknown) => Promise<unknown> } }).AI;
    if (!ai) return NextResponse.json({ error: 'AI is not configured on the server yet.' }, { status: 503 });

    const model = (env as { WORKERS_AI_MODEL?: string }).WORKERS_AI_MODEL || '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
    const messages = [
      { role: 'system', content: systemInstructions },
      ...history,
      { role: 'user', content: body.message.trim() },
    ];

    const result = await ai.run(model, { messages, max_tokens: 600 }) as { response?: unknown; result?: { response?: unknown } };
    const answer = typeof result?.response === 'string'
      ? result.response
      : typeof result?.result?.response === 'string'
        ? result.result.response
        : '';

    if (!answer.trim()) {
      return NextResponse.json({ error: 'The assistant returned an empty answer. Please try again.' }, { status: 502 });
    }

    const text = answer.trim();
    return NextResponse.json(
      { answer: text, reply: text, output_text: text },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    console.error('GCC Bot Workers AI request error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'The assistant is temporarily unavailable. Please try again.' }, { status: 502 });
  }
}