'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { X, Send, ShieldAlert, ExternalLink, RotateCcw } from 'lucide-react';
import { copyTextToClipboard } from '@/lib/browser';

type ChatMessage = { id: string; from: 'bot' | 'visitor'; text: string; links?: { label: string; href: string }[]; handoff?: boolean };
type ApiHistory = { role: 'user' | 'assistant'; content: string };
const welcome: ChatMessage = { id: 'welcome', from: 'bot', text: 'Hi, I am HopeBot, your GCC Foundation assistant. Ask me anything. I can help with fundraisers, donations, accounts, or general questions.' };
const quickQuestions = ['Help me start a fundraiser', 'How do I donate?', 'Account and sign-in', 'Report a fundraiser', 'Fees and payouts'];
const supportPhone = '+256 (0) 772 491 802';

function HopeBotMark({ small = false }: { small?: boolean }) {
  return <span className={`hopebot-mark ${small ? 'hopebot-mark-small' : ''}`} aria-hidden="true">
    <span className="hopebot-aura" />
    <svg viewBox="0 0 64 64" className="hopebot-face" fill="none">
      <defs><linearGradient id="hopebot-shell" x1="9" y1="8" x2="54" y2="58" gradientUnits="userSpaceOnUse"><stop stopColor="#E8FFF0"/><stop offset="1" stopColor="#B6E9C5"/></linearGradient><linearGradient id="hopebot-screen" x1="15" y1="16" x2="50" y2="50" gradientUnits="userSpaceOnUse"><stop stopColor="#147B49"/><stop offset="1" stopColor="#064B31"/></linearGradient></defs>
      <path d="M32 5v7" stroke="#E7FFF0" strokeWidth="3" strokeLinecap="round"/><circle cx="32" cy="5" r="3" fill="#FFD477"/>
      <rect x="8" y="13" width="48" height="43" rx="17" fill="url(#hopebot-shell)"/><rect x="13" y="18" width="38" height="32" rx="12" fill="url(#hopebot-screen)"/>
      <path d="M22 31c0-2 1.6-3.5 3.5-3.5S29 29 29 31s-1.6 3.5-3.5 3.5S22 33 22 31Zm13 0c0-2 1.6-3.5 3.5-3.5S42 29 42 31s-1.6 3.5-3.5 3.5S35 33 35 31Z" fill="#D8FFE2"/>
      <path d="M25 40c2 2 4.3 3 7 3s5-1 7-3" stroke="#8CE6A6" strokeWidth="2.5" strokeLinecap="round"/><path d="M8 31H4m56 0h-4" stroke="#E8FFF0" strokeWidth="3" strokeLinecap="round"/>
      <path d="m51 9 1.4 3.6L56 14l-3.6 1.4L51 19l-1.4-3.6L46 14l3.6-1.4L51 9Z" fill="#FFD477"/>
    </svg><span className="hopebot-spark" />
  </span>;
}

function isHandoffQuestion(question: string) {
  const text = question.toLowerCase();
  return /human|agent|manager|suspend|suspension|compliance|verification fail|failed payment|payment fail|transaction fail|charged twice|technical bug|site.*broken|error message/.test(text)
    || /(?:withdraw|payout|transfer).*(?:delay|5 business|five business)|(?:delay|5 business|five business).*(?:withdraw|payout|transfer)/.test(text);
}

function getGuidedReply(question: string): Omit<ChatMessage, 'id'> {
  const text = question.toLowerCase();
  const escalation = isHandoffQuestion(question);
  if (escalation) return { from: 'bot', handoff: true, text: `I am sorry you are dealing with this. A payout delay over five business days, an account or verification hold, a failed or duplicate payment, or a complex technical issue needs our support team to review the details. Please call GCC Foundation support at ${supportPhone}. Never send your password, full card number, bank login, mobile money PIN, or full ID number in chat.`, links: [{ label: 'Call GCC Support', href: 'tel:+256772491802' }] };
  if (/report|fraud|scam|suspicious|fake/.test(text)) return { from: 'bot', handoff: true, text: `Open the campaign page and use the Report this fundraiser button to alert our Trust & Safety team immediately, or call GCC Foundation compliance directly at ${supportPhone}.`, links: [{ label: 'Browse fundraisers', href: '/#discover' }, { label: 'Call GCC Support', href: 'tel:+256772491802' }] };
  if (/fee|fees|2\.9|processing|platform charge|tip/.test(text)) return { from: 'bot', text: 'GCC Foundation charges a 0% platform fee for causes so that 100% of cause funds go directly to verified hospital and school accounts. Standard payment processor charges apply at checkout.', links: [{ label: 'Browse fundraisers', href: '/#discover' }] };
  if (/tax|deduct/.test(text)) return { from: 'bot', text: 'GCC Foundation is a registered non-profit organization (Uganda NGO Bureau Reg #INDR15982736NB). Donation receipts are issued via email upon completion of your gift through Donorbox.' };
  if (/donat|support a campaign|give money|monthly|recurring/.test(text)) return { from: 'bot', text: 'To make a donation, open any verified fundraiser and click Donate Now. You can choose a one-time or recurring gift in our secure Donorbox checkout form.', links: [{ label: 'Explore fundraisers', href: '/#discover' }] };
  if (/start|create|launch|fundrais|campaign|story|goal|organizer/.test(text)) return { from: 'bot', text: 'To get started, choose Start a Fundraiser, select the beneficiary country and city or district, then follow the guided setup for the cause, goal, story, photo, and institutional payout details.', links: [{ label: 'Start a fundraiser', href: '/create/fundraiser/category' }, { label: 'How vetting works', href: '/how-it-works' }] };
  if (/share|whatsapp|social|email/.test(text)) return { from: 'bot', text: 'Open your fundraiser page and use its Share button to copy the link or share directly via WhatsApp. Adding a personal note about why the cause matters helps inspire more supporters.', links: [{ label: 'Explore fundraisers', href: '/#discover' }] };
  if (/edit|update|change.*fundrais|post.*update/.test(text)) return { from: 'bot', text: 'You can view your fundraisers from your Your impact page or post updates and manage disbursements from the Organizer Dashboard.', links: [{ label: 'Your impact', href: '/account/impact' }, { label: 'Dashboard', href: '/dashboard' }] };
  if (/login|log in|sign.?in|sign.?up|password|account|birthday|notification/.test(text)) return { from: 'bot', text: 'You can sign in or create a GCC Foundation account using your email and password or Google. Once signed in, visit Account settings to update your profile, password, or notification preferences.', links: [{ label: 'Sign in', href: '/sign-in' }, { label: 'Create account', href: '/sign-up' }, { label: 'Account settings', href: '/account/settings' }] };
  if (/verify|verification|withdraw|bank|payout|transfer/.test(text)) return { from: 'bot', text: 'All medical and tuition funds on GCC Foundation are wired directly to verified hospital and school bank accounts once invoices and National ID (NIN) verification are approved by our compliance team.', links: [{ label: 'How vetting works', href: '/how-it-works' }, { label: 'Public ledger', href: '/transparency' }] };
  if (/safe|secure|security|card|pin|private/.test(text)) return { from: 'bot', text: 'Never share a password, full payment card number, mobile money PIN, or bank login in chat. All donations are processed through encrypted Donorbox checkout and protected by our 100% Giving Guarantee.', links: [{ label: 'How vetting works', href: '/how-it-works' }] };
  if (/hello|hi\b|hey\b|help/.test(text)) return { from: 'bot', text: 'Of course! I can help with starting or sharing a fundraiser, making a donation, account settings, fees, verification, or general questions. What would you like to do next?' };
  return { from: 'bot', text: 'I can help you with starting or sharing a fundraiser, making a donation, managing your account, or learning about our 4-tier verification protocol. Choose a topic below or call our support team at +256 (0) 772 491 802.', links: [{ label: 'Explore fundraisers', href: '/#discover' }, { label: 'Start a fundraiser', href: '/create/fundraiser/category' }] };
}

export default function HelpAssistant() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([welcome]);
  const [isThinking, setIsThinking] = useState(false);
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, open, isThinking]);
  useEffect(() => {
    const openAssistant = () => setOpen(true);
    window.addEventListener('gcc:open-hopebot', openAssistant);
    return () => window.removeEventListener('gcc:open-hopebot', openAssistant);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);
  function resetChat() { setMessages([welcome]); setDraft(''); }
  async function sendQuestion(value: string) {
    const question = value.trim(); if (!question || isThinking) return;
    const history: ApiHistory[] = messages.filter((message) => message.id !== 'welcome').slice(-8).map((message) => ({ role: message.from === 'visitor' ? 'user' : 'assistant', content: message.text }));
    setMessages((current) => [...current, { id: `visitor_${Date.now()}`, from: 'visitor', text: question }]);
    setDraft(''); setIsThinking(true);
    let answer: string; let links: ChatMessage['links']; let handoff = isHandoffQuestion(question);
    try {
      const response = await fetch('/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: question, history }) });
      const data = await response.json() as { answer?: string; error?: string };
      if (!response.ok || !data.answer) throw new Error('fallback');
      answer = data.answer;
      if (handoff) {
        answer += `\n\nFor human review, call GCC Foundation support at ${supportPhone}. Do not share passwords, payment credentials, or full ID numbers here.`;
        links = [{ label: 'Call GCC Support', href: 'tel:+256772491802' }];
      }
    } catch {
      const fallback = getGuidedReply(question);
      answer = fallback.text; links = fallback.links; handoff = fallback.handoff ?? handoff;
    } finally { setIsThinking(false); }
    setMessages((current) => [...current, { id: `bot_${Date.now()}`, from: 'bot', text: answer, links, handoff }]);
  }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void sendQuestion(draft); }
  async function copyHandoff() {
    const summary = 'I need help from GCC Foundation support. Issue: [brief description]. Campaign ID (if relevant): [campaign ID]. Please contact me about next steps.';
    try { await copyTextToClipboard(summary); setCopied(true); window.setTimeout(() => setCopied(false), 2500); }
    catch { setMessages((current) => [...current, { id: `copy_${Date.now()}`, from: 'bot', text: summary }]); }
  }
  return <>
    <button type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? 'Close HopeBot' : 'Ask HopeBot anything'} aria-expanded={open} title={open ? 'Close HopeBot' : 'Ask HopeBot anything'} className={`hopebot-launcher fixed bottom-5 right-5 z-[60] ${open ? 'hopebot-launcher-open' : ''}`}>
      {open ? <X className="relative z-10 h-6 w-6 transition-transform duration-300"/> : <HopeBotMark/>}
      {!open && <span className="hopebot-launcher-label">Ask HopeBot</span>}
    </button>
    {open && <section aria-label="HopeBot AI assistant" className="hopebot-panel fixed inset-x-3 bottom-[5.5rem] z-[60] flex hopebot-viewport-height flex-col overflow-hidden rounded-3xl border border-[#dfe7df] bg-white shadow-[0_24px_80px_rgba(22,44,28,.24)] sm:inset-x-auto sm:bottom-24 sm:right-5 sm:w-[400px]">
      <header className="flex items-center justify-between bg-gradient-to-r from-[#075b39] via-[#087443] to-[#13935a] px-5 py-4 text-white"><div className="flex items-center gap-3"><HopeBotMark small/><div><h2 className="text-sm font-extrabold">HopeBot <span className="ml-1 rounded-full bg-white/15 px-1.5 py-0.5 text-[9px] uppercase tracking-wide">AI</span></h2><p className="mt-0.5 text-xs text-white/80">Ask anything. I will help you think it through.</p></div></div><div className="flex items-center gap-1"><button type="button" onClick={resetChat} aria-label="Start a new conversation" title="New conversation" className="rounded-full p-2 hover:bg-white/15"><RotateCcw className="h-4 w-4"/></button><button type="button" aria-label="Close assistant" onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-white/15"><X className="h-5 w-5"/></button></div></header>
      <div className="flex-1 space-y-4 overflow-y-auto bg-[#f8faf7] p-4" aria-live="polite">{messages.map((message) => <div key={message.id} className={`flex ${message.from === 'visitor' ? 'justify-end' : 'justify-start'}`}><article className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.from === 'visitor' ? 'rounded-br-md bg-[#087443] text-white' : 'rounded-bl-md border border-[#e7ece7] bg-white text-[#263128] shadow-sm'}`}>{message.handoff && <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-amber-700"><ShieldAlert className="h-4 w-4"/>Human review may be needed</div>}<p className="whitespace-pre-line">{message.text}</p>{message.links?.length ? <div className="mt-3 flex flex-wrap gap-2">{message.links.map((link) => <Link key={link.href} href={link.href} onClick={() => { if (link.href.startsWith('/')) setOpen(false); }} className="inline-flex items-center gap-1 rounded-full border border-[#dce8dd] bg-[#f5f9f5] px-3 py-1.5 text-xs font-bold text-[#087443] hover:bg-[#eaf5ed]">{link.label}{link.href.startsWith('http') && <ExternalLink className="h-3 w-3"/>}</Link>)}</div> : null}{message.handoff && <button type="button" onClick={copyHandoff} className="mt-3 text-left text-xs font-bold text-[#087443] underline">{copied ? 'Handoff summary copied' : 'Copy a support summary'}</button>}</article></div>)}{messages.length === 1 && <div className="flex flex-wrap gap-2 pl-1">{quickQuestions.map((question) => <button key={question} type="button" onClick={() => void sendQuestion(question)} disabled={isThinking} className="rounded-full border border-[#dce8dd] bg-white px-3 py-2 text-xs font-semibold text-[#42604a] hover:border-[#02a95c] hover:bg-[#f1f8f1]">{question}</button>)}</div>}{isThinking && <div className="flex"><div className="hopebot-typing rounded-2xl rounded-bl-md border border-[#e7ece7] bg-white px-4 py-3 text-xs text-[#647068] shadow-sm"><span>HopeBot is thinking</span><i/><i/><i/></div></div>}<div ref={bottomRef}/></div>
      <form onSubmit={submit} className="flex items-center gap-2 border-t border-[#e8ece8] bg-white p-3"><label className="sr-only" htmlFor="gcc-help-input">Ask HopeBot anything</label><input id="gcc-help-input" value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={1600} placeholder="Ask me anything..." className="h-11 min-w-0 flex-1 rounded-full border border-[#d8dfd8] px-4 text-sm outline-none focus:border-[#02a95c] focus:ring-4 focus:ring-[#02a95c]/10"/><button type="submit" disabled={!draft.trim() || isThinking} aria-label="Send message" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#02a95c] text-white hover:bg-[#087443] disabled:cursor-not-allowed disabled:opacity-50"><Send className="h-4 w-4"/></button></form>
      <p className="border-t border-[#f0f2ef] px-4 py-2 text-[10px] leading-relaxed text-[#7a837c]">Do not share passwords, payment card details, or full ID numbers in chat.</p>
    </section>}
  </>;
}
