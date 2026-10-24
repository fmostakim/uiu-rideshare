import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [conversations, setConversations] = useState([]);
  const [tempChat, setTempChat] = useState(null);
  const [loading, setLoading] = useState(true);

  // Combine real conversations with the temporary one if it hasn't been created yet
  const displayedConvos = [...conversations];
  if (tempChat && !displayedConvos.find(c => c.id === tempChat.id)) {
    displayedConvos.unshift(tempChat);
  }

  const selectedChat = displayedConvos.find(c => c.id === selectedChatId) || null;

  const fetchConversations = async () => {
    try {
      const data = await api.getConversations();
      setConversations(data);
      
      const searchParams = new URLSearchParams(window.location.search);
      const startChatId = searchParams.get('startChat');
      
      if (startChatId) {
        if (!data.find(c => c.id === startChatId)) {
          setTempChat({
            id: startChatId,
            name: 'New Chat',
            initials: '?',
            lastMessage: 'Start a conversation...',
            time: 'Now',
            unread: 0,
            messages: []
          });
        }
        setSelectedChatId(startChatId);
        navigate('/messages', { replace: true });
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000); 
    return () => clearInterval(interval);
  }, []);

  const handleSelectChat = async (convo) => {
    setSelectedChatId(convo.id);
    if (convo.unread > 0) {
      try {
        await api.markMessagesRead(convo.id);
        fetchConversations();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChatId) return;
    
    const text = messageText.trim();
    setMessageText('');
    
    const optimisticTime = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit' });
    
    setConversations(prev => prev.map(c => 
      c.id === selectedChatId 
        ? { ...c, messages: [...(c.messages || []), { text, isMine: true, time: optimisticTime }] }
        : c
    ));
    
    try {
      await api.sendMessage(selectedChatId, text);
      fetchConversations();
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <AppNavbar />

      <main className="mx-auto flex max-w-[1700px] flex-col gap-4 sm:gap-6 px-3 py-4 sm:px-8 sm:py-8 lg:px-12 pb-24 lg:pb-12">
        <div className="hidden sm:block">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-ink">Messages</h1>
          <p className="mt-1 font-body text-xs sm:text-base text-brand-text">
            Chat with your drivers and fellow passengers.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Conversation list */}
          <div className={`${selectedChatId ? 'hidden lg:flex' : 'flex'} flex-col gap-2 rounded-2xl border border-brand-panel bg-white p-3 sm:p-4 shadow-sm h-[calc(100vh-180px)] sm:h-[600px] overflow-y-auto`}>
            <div className="flex items-center justify-between pb-2 mb-1 border-b border-gray-100">
              <h2 className="font-display text-base sm:text-lg font-bold text-brand-ink">Conversations</h2>
              <span className="text-xs font-medium text-brand-text">{displayedConvos.length} chats</span>
            </div>

            {loading && displayedConvos.length === 0 && (
              <p className="text-center font-body text-sm text-brand-text py-10">Loading...</p>
            )}
            {!loading && displayedConvos.length === 0 && (
              <p className="text-center font-body text-sm text-brand-text py-10">No messages yet.</p>
            )}
            {displayedConvos.map((convo) => {
              const isSelected = selectedChat?.id === convo.id;
              return (
                <button
                  key={convo.id}
                  type="button"
                  onClick={() => handleSelectChat(convo)}
                  className={`flex items-center gap-3 sm:gap-4 rounded-xl p-3 text-left transition-all active:scale-98 ${
                    isSelected ? 'bg-brand-red/10 border-l-4 border-brand-red' : 'hover:bg-[#f5f5f5]'
                  }`}
                >
                  {/* Avatar */}
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-red font-display text-sm font-bold text-white shadow-sm">
                    {convo.initials}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="truncate font-display text-sm font-semibold text-brand-ink">
                        {convo.name}
                      </span>
                      <span className="font-body text-[11px] text-brand-text shrink-0 ml-1">{convo.time}</span>
                    </div>
                    <p className="truncate font-body text-xs sm:text-sm text-brand-text mt-0.5">{convo.lastMessage}</p>
                  </div>

                  {convo.unread > 0 && !isSelected && (
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-red font-body text-xs font-bold text-white">
                      {convo.unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Chat area */}
          <div className={`${!selectedChatId ? 'hidden lg:flex' : 'flex'} flex-col rounded-2xl border border-brand-panel bg-white shadow-sm lg:col-span-2 h-[calc(100vh-180px)] sm:h-[600px] overflow-hidden`}>
            {!selectedChat ? (
              <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-[#e6eeff]">
                  <svg className="size-8 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                  </svg>
                </div>
                <p className="mt-4 font-display text-lg font-bold text-brand-ink">
                  Select a conversation
                </p>
                <p className="mt-1 font-body text-xs sm:text-sm text-brand-text">
                  Choose a chat from the left to start messaging.
                </p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between border-b border-brand-panel p-3 sm:p-4 bg-white">
                  <div className="flex items-center gap-3">
                    {/* Mobile Back Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedChatId(null)}
                      className="flex size-9 items-center justify-center rounded-lg border border-brand-panel text-brand-ink lg:hidden active:scale-95"
                      aria-label="Back to conversations"
                    >
                      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                      </svg>
                    </button>

                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-red font-display text-sm font-bold text-white shadow-sm">
                      {selectedChat.initials}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-display text-sm sm:text-base font-bold text-brand-ink">{selectedChat.name}</span>
                      <span className="font-body text-[11px] text-green-600 font-medium flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-green-500 inline-block" /> Active
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 bg-[#fafafa]">
                  {(selectedChat.messages || []).map((msg, idx) => (
                    msg.isMine ? (
                      <div key={idx} className="flex items-start justify-end gap-2 sm:gap-3">
                        <div className="rounded-2xl rounded-tr-none bg-brand-red text-white p-3 shadow-sm max-w-[85%] sm:max-w-[75%]">
                          <p className="font-body text-xs sm:text-sm leading-relaxed">{msg.text}</p>
                          <span className="block mt-1 text-right text-[10px] text-white/80">{msg.time}</span>
                        </div>
                      </div>
                    ) : (
                      <div key={idx} className="flex items-start gap-2 sm:gap-3">
                        <span className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-full bg-[#dee9fc] font-display text-[10px] sm:text-xs font-bold text-brand-ink">
                          {selectedChat.initials}
                        </span>
                        <div className="rounded-2xl rounded-tl-none bg-white p-3 border border-[#f0f0f0] shadow-sm max-w-[85%] sm:max-w-[75%]">
                          <p className="font-body text-xs sm:text-sm text-brand-ink leading-relaxed">{msg.text}</p>
                          <span className="block mt-1 text-right text-[10px] text-brand-text">{msg.time}</span>
                        </div>
                      </div>
                    )
                  ))}
                </div>

                {/* Chat Input */}
                <div className="border-t border-brand-panel p-2.5 sm:p-4 bg-white">
                  <form 
                    className="flex items-center gap-2 sm:gap-3"
                    onSubmit={handleSendMessage}
                  >
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 rounded-full border border-brand-panel bg-[#f5f5f5] px-4 py-2 sm:py-2.5 font-body text-base sm:text-sm focus:border-brand-red focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-red"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={!messageText.trim()}
                      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-red text-white disabled:opacity-50 transition-all active:scale-95 shadow-sm"
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
