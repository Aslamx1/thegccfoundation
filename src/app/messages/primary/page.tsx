'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import AccountLayout from '@/components/AccountLayout';
import { useAuth } from '@/context/AuthContext';
import { useDonation } from '@/context/DonationContext';

type Message = { id: string; sender: 'me' | 'them'; text: string; date: string };
type Conversation = { id: string; name: string; subject: string; messages: Message[] };

function createWelcomeConversation(firstName: string): Conversation {
  return {
    id: 'conv_welcome_leadership',
    name: 'GCC Foundation Leadership Team',
    subject: 'Welcome to the GCC Foundation Family & Impact Updates',
    messages: [
      {
        id: 'msg_welcome_1',
        sender: 'them',
        text: `Welcome to the family, ${firstName}! We are thrilled to have you here.\n\nThis inbox is your direct connection to our field teams across Uganda and East Africa. Whenever you make a donation, sponsor a child, or support a campaign, you will receive:\n• Automated tax receipts and direct hospital/school EFT confirmation slips\n• Field milestone updates and photos from our verification officers\n• Personal thank-you notes and moderated letters from sponsored children\n\nFeel free to reply here anytime if you have questions for our team!`,
        date: new Date().toISOString(),
      },
    ],
  };
}

function MessagesContent() {
  const { user } = useAuth();
  const { campaigns } = useDonation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState('');
  const [draft, setDraft] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [recipient, setRecipient] = useState('GCC Foundation Support');
  const [subject, setSubject] = useState('');
  const [notice, setNotice] = useState('');
  const key = user ? `gcc_foundation_messages_${user.id}` : '';
  const firstName = user?.name?.split(' ')[0] || 'Friend';

  useEffect(() => {
    if (!key) return;
    try {
      const saved = JSON.parse(localStorage.getItem(key) || '[]') as Conversation[];
      if (saved.length > 0) {
        setConversations(saved);
        setActiveId(saved[0].id);
      } else {
        const welcomeConv = [createWelcomeConversation(firstName)];
        setConversations(welcomeConv);
        setActiveId(welcomeConv[0].id);
        localStorage.setItem(key, JSON.stringify(welcomeConv));
      }
    } catch {
      const welcomeConv = [createWelcomeConversation(firstName)];
      setConversations(welcomeConv);
      setActiveId(welcomeConv[0].id);
    }
  }, [key, firstName]);

  const active = conversations.find((conversation) => conversation.id === activeId);
  const names = useMemo(
    () => [...new Set(campaigns.map((campaign) => campaign.organizer.name).filter(Boolean))],
    [campaigns]
  );

  function persist(next: Conversation[]) {
    setConversations(next);
    if (key) {
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        setNotice('Could not save message.');
      }
    }
  }

  function send(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const message: Message = {
      id: `msg_${Date.now()}`,
      sender: 'me',
      text,
      date: new Date().toISOString(),
    };
    if (active) {
      const autoReply: Message = {
        id: `msg_reply_${Date.now() + 1}`,
        sender: 'them',
        text: `Thank you for reaching out to ${active.name}. Our team has received your message regarding "${active.subject}" and will follow up shortly.`,
        date: new Date().toISOString(),
      };
      const updatedMessages = [...active.messages, message, autoReply];
      const next = conversations.map((conversation) =>
        conversation.id === active.id
          ? { ...conversation, messages: updatedMessages }
          : conversation
      );
      persist(next);
    } else {
      setNotice('Choose or start a conversation first.');
      return;
    }
    setDraft('');
    setNotice('Message sent.');
    window.setTimeout(() => setNotice(''), 3000);
  }

  function startConversation(event: FormEvent) {
    event.preventDefault();
    const id = `conversation_${Date.now()}`;
    const conversation: Conversation = {
      id,
      name: recipient,
      subject: subject.trim() || 'General inquiry',
      messages: [],
    };
    persist([conversation, ...conversations]);
    setActiveId(id);
    setShowCompose(false);
    setDraft('');
    setNotice('Conversation started.');
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#20251f]">Messages & Organization Updates</h2>
          <p className="mt-1 text-sm text-[#626b64]">
            Receive leadership updates, thank-you notes, and moderated letters from sponsored children.
          </p>
        </div>
        <button
          onClick={() => setShowCompose((value) => !value)}
          className="rounded-full bg-[#02a95c] px-5 py-3 text-sm font-bold text-white hover:bg-[#087443]"
        >
          {showCompose ? 'Close' : 'New message'}
        </button>
      </div>

      {showCompose && (
        <form
          onSubmit={startConversation}
          className="grid gap-4 rounded-2xl bg-[#f7faf7] p-5 sm:grid-cols-2"
        >
          <label className="text-sm font-semibold text-[#20251f]">
            To
            <select
              value={recipient}
              onChange={(event) => setRecipient(event.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-[#cfd6d0] bg-white px-3 text-sm"
            >
              {['GCC Foundation Support', 'GCC Foundation Leadership Team', ...names].map(
                (name) => (
                  <option key={name}>{name}</option>
                )
              )}
            </select>
          </label>
          <label className="text-sm font-semibold text-[#20251f]">
            Subject
            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              maxLength={100}
              placeholder="What would you like to discuss?"
              className="mt-2 h-11 w-full rounded-xl border border-[#cfd6d0] bg-white px-3 text-sm"
            />
          </label>
          <button className="rounded-full bg-[#20251f] px-5 py-2.5 text-sm font-bold text-white sm:col-span-2 sm:justify-self-start">
            Start conversation
          </button>
        </form>
      )}

      {notice && (
        <p role="status" className="text-sm font-semibold text-[#087443]">
          {notice}
        </p>
      )}

      <div className="grid min-h-[420px] overflow-hidden rounded-2xl border border-[#e4e8e3] md:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="border-b border-[#e4e8e3] md:border-b-0 md:border-r">
          <h3 className="border-b border-[#edf0ec] px-4 py-3 text-sm font-bold text-[#20251f]">
            Conversations
          </h3>
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setActiveId(conversation.id)}
              className={`block w-full border-b border-[#edf0ec] px-4 py-4 text-left ${
                activeId === conversation.id ? 'bg-[#eaf5ed]' : 'hover:bg-[#f7faf7]'
              }`}
            >
              <span className="block truncate text-sm font-bold text-[#20251f]">
                {conversation.name}
              </span>
              <span className="mt-1 block truncate text-xs text-[#626b64]">
                {conversation.subject}
              </span>
              <span className="mt-1 block truncate text-xs text-[#818981]">
                {conversation.messages[conversation.messages.length - 1]?.text ??
                  'Conversation started'}
              </span>
            </button>
          ))}
        </aside>

        <section className="flex min-h-[380px] flex-col">
          {active ? (
            <>
              <div className="border-b border-[#edf0ec] px-5 py-4">
                <h3 className="font-bold text-[#20251f]">{active.name}</h3>
                <p className="mt-1 text-xs text-[#626b64]">{active.subject}</p>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto bg-[#fcfdfb] p-5">
                {active.messages.length ? (
                  active.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line leading-relaxed ${
                        message.sender === 'me'
                          ? 'ml-auto bg-[#eaf5ed] text-[#20251f]'
                          : 'bg-white border border-[#e4e8e3] text-[#20251f] shadow-xs'
                      }`}
                    >
                      <p>{message.text}</p>
                      <time className="mt-2 block text-[10px] text-[#818981]">
                        {new Date(message.date).toLocaleString()}
                      </time>
                    </div>
                  ))
                ) : (
                  <div className="m-auto max-w-sm py-10 text-center">
                    <p className="font-semibold text-[#20251f]">Conversation started</p>
                    <p className="mt-2 text-sm leading-relaxed text-[#626b64]">
                      Write your first message below.
                    </p>
                  </div>
                )}
              </div>
              <form onSubmit={send} className="flex gap-2 border-t border-[#edf0ec] p-3">
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  maxLength={2000}
                  placeholder="Write a message..."
                  aria-label="Write a message"
                  className="min-w-0 flex-1 rounded-full border border-[#cfd6d0] px-4 py-3 text-sm"
                />
                <button className="rounded-full bg-[#02a95c] px-5 py-3 text-sm font-bold text-white hover:bg-[#087443]">
                  Send
                </button>
              </form>
            </>
          ) : null}
        </section>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <AccountLayout
      active="messages"
      title="Messages"
      description="Organization updates, leadership welcome notes, and thank-you letters."
    >
      <MessagesContent />
    </AccountLayout>
  );
}
