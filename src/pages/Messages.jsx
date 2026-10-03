import { useState, useEffect } from 'react';
import AppNavbar from '../components/AppNavbar';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export default function Messages() {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      const data = await api.getConversations();
      
      const searchParams = new URLSearchParams(window.location.search);
      const startChatId = searchParams.get('startChat');
      
      let allConvos = [...data];
      
      // If a chat was requested via URL but isn't in history yet, add a temporary local convo
      if (startChatId && !allConvos.find(c => c.id === startChatId)) {
        allConvos.unshift({
          id: startChatId,
          name: 'New Chat', // Ideally we'd fetch their name, but this is enough to start
          initials: '?',
          lastMessage: 'Start a conversation...',
          time: 'Now',
          unread: 0,
          messages: []
        });
      }
      
      setConversations(allConvos);
      
      if (selectedChat) {
        const updated = allConvos.find(c => c.id === selectedChat.id);
        if (updated) setSelectedChat(updated);
      } else if (startChatId) {
        const toSelect = allConvos.find(c => c.id === startChatId);
        if (toSelect) setSelectedChat(toSelect);
        // Clear URL without refreshing
        window.history.replaceState({}, '', '/messages');
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000); // Polling every 5s for new messages
    return () => clearInterval(interval);
  }, [selectedChat]);

  const handleSelectChat = async (convo) => {
    setSelectedChat(convo);
    if (convo.unread > 0) {
      try {
        await api.markMessagesRead(convo.id);
        fetchConversations(); // refresh unread counts
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChat) return;
    
    const text = messageText.trim();
    setMessageText('');
    
    // Optimistic UI update
    const optimisticTime = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit' });
    const optimisticChat = {
      ...selectedChat,
      messages: [...(selectedChat.messages || []), { text, isMine: true, time: optimisticTime }]
    };
    setSelectedChat(optimisticChat);
    
    try {
      await api.sendMessage(selectedChat.id, text);
      fetchConversations();
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

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
          <div className="flex flex-col gap-2 rounded-xl border border-brand-panel bg-white p-4 shadow-[0px_4px_6px_rgba(0,0,0,0.05)] h-[600px] overflow-y-auto">
            <h2 className="mb-2 font-display text-lg font-semibold text-brand-ink">Conversations</h2>
            {loading && conversations.length === 0 && (
              <p className="text-center font-body text-sm text-brand-text py-10">Loading...</p>
            )}
            {!loading && conversations.length === 0 && (
              <p className="text-center font-body text-sm text-brand-text py-10">No messages yet.</p>
            )}
            {conversations.map((convo) => {
              const isSelected = selectedChat?.id === convo.id;
              return (
                <button
                  key={convo.id}
                  type="button"
                  onClick={() => handleSelectChat(convo)}
                  className={`flex items-center gap-4 rounded-lg p-3 text-left transition-colors ${
                    isSelected ? 'bg-[#f5f5f5]' : 'hover:bg-[#f5f5f5]'
                  }`}
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

                  {convo.unread > 0 && !isSelected && (
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-red font-body text-xs text-white">
                      {convo.unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Chat area */}
          <div className="flex flex-col rounded-xl border border-brand-panel bg-white shadow-[0px_4px_6px_rgba(0,0,0,0.05)] lg:col-span-2 h-[600px] overflow-hidden">
            {!selectedChat ? (
              <div className="flex h-full flex-col items-center justify-center">
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
            ) : (
              <>
                {/* Chat Header */}
                <div className="flex items-center gap-4 border-b border-brand-panel p-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-red font-display text-sm font-bold text-white">
                    {selectedChat.initials}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-display text-base font-semibold text-brand-ink">{selectedChat.name}</span>
                    <span className="font-body text-xs text-brand-text">Active now</span>
                  </div>
                </div>
                
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[#fafafa]">
                  {(selectedChat.messages || []).map((msg, idx) => (
                    msg.isMine ? (
                      <div key={idx} className="flex items-start justify-end gap-3">
                        <div className="rounded-xl rounded-tr-none bg-brand-red text-white p-3 shadow-sm max-w-[75%]">
                          <p className="font-body text-sm">{msg.text}</p>
                          <span className="block mt-1 text-right text-[10px] text-white/80">{msg.time}</span>
                        </div>
                      </div>
                    ) : (
                      <div key={idx} className="flex items-start gap-3">
                         <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#dee9fc] font-display text-xs font-bold text-brand-ink">
                          {selectedChat.initials}
                        </span>
                        <div className="rounded-xl rounded-tl-none bg-white p-3 border border-[#f0f0f0] shadow-sm max-w-[75%]">
                          <p className="font-body text-sm text-brand-ink">{msg.text}</p>
                          <span className="block mt-1 text-right text-[10px] text-brand-text">{msg.time}</span>
                        </div>
                      </div>
                    )
                  ))}
                </div>

                {/* Chat Input */}
                <div className="border-t border-brand-panel p-4 bg-white">
                  <form 
                    className="flex items-center gap-3"
                    onSubmit={handleSendMessage}
                  >
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 rounded-full border border-brand-panel bg-[#f5f5f5] px-4 py-2 font-body text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={!messageText.trim()}
                      className="flex size-10 items-center justify-center rounded-full bg-brand-red text-white disabled:opacity-50 transition-opacity"
                    >
                      <svg className="size-5 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                      </svg>
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
