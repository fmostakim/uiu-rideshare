import AppNavbar from '../components/AppNavbar';
import { useAuth } from '../context/AuthContext';

const SAMPLE_CONVERSATIONS = [
  {
    id: 'c1',
    name: 'Rahat S.',
    lastMessage: "I'll be at the gate by 9:25 AM.",
    time: '9:12 AM',
    unread: 2,
    initials: 'RS',
  },
  {
    id: 'c2',
    name: 'Fahim M.',
    lastMessage: 'Can you wait 5 minutes? Almost there.',
    time: 'Yesterday',
    unread: 0,
    initials: 'FM',
  },
  {
    id: 'c3',
    name: 'Nadia K.',
    lastMessage: 'Thanks for the ride! 😊',
    time: 'Sep 28',
    unread: 0,
    initials: 'NK',
  },
];

export default function Messages() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-brand-bg">
      <AppNavbar />

      <main className="mx-auto flex max-w-[1700px] flex-col gap-8 px-12 py-12">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-ink">Messages</h1>
          <p className="mt-1 font-body text-base text-brand-text">
            Chat with your drivers and fellow passengers.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Conversation list */}
          <div className="flex flex-col gap-2 rounded-xl border border-brand-panel bg-white p-4 shadow-[0px_4px_6px_rgba(0,0,0,0.05)]">
            <h2 className="mb-2 font-display text-lg font-semibold text-brand-ink">Conversations</h2>
            {SAMPLE_CONVERSATIONS.map((convo) => (
              <button
                key={convo.id}
                type="button"
                className="flex items-center gap-4 rounded-lg p-3 text-left transition-colors hover:bg-[#f5f5f5]"
              >
                {/* Avatar */}
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-red font-display text-sm font-bold text-white">
                  {convo.initials}
                </span>

                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm font-semibold text-brand-ink">
                      {convo.name}
                    </span>
                    <span className="font-body text-xs text-brand-text">{convo.time}</span>
                  </div>
                  <p className="truncate font-body text-sm text-brand-text">{convo.lastMessage}</p>
                </div>

                {convo.unread > 0 && (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-red font-body text-xs text-white">
                    {convo.unread}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Chat area placeholder */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-brand-panel bg-white py-24 lg:col-span-2">
            <div className="flex size-16 items-center justify-center rounded-full bg-[#e6eeff]">
              <svg className="size-8 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>
            </div>
            <p className="mt-4 font-display text-lg font-semibold text-brand-ink">
              Select a conversation
            </p>
            <p className="mt-1 font-body text-sm text-brand-text">
              Choose a chat from the left to start messaging.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
