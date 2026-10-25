import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageSquare, 
  Send, 
  User as UserIcon, 
  CheckCheck, 
  Sparkles, 
  Image as ImageIcon,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const MessagesPage: React.FC = () => {
  const { 
    artists, 
    messages, 
    sendMessage, 
    currentUser, 
    activeChatRecipientId, 
    setActiveChatRecipientId, 
    t, 
    language 
  } = useApp();

  const [inputContent, setInputContent] = useState('');

  // Contacts: The gallery artists
  const contacts = artists.map(a => {
    const thread = messages.filter(
      m => (m.senderId === a.id && m.recipientId === currentUser.id) ||
           (m.senderId === currentUser.id && m.recipientId === a.id)
    );
    const lastMsg = thread[thread.length - 1];
    return {
      artist: a,
      lastMessage: lastMsg ? lastMsg.content : 'Inquire about artwork...',
      lastTime: lastMsg ? lastMsg.timestamp : ''
    };
  });

  const activeArtist = artists.find(a => a.id === activeChatRecipientId) || artists[0];

  const currentThread = messages.filter(
    m => (m.senderId === activeArtist.id && m.recipientId === currentUser.id) ||
         (m.senderId === currentUser.id && m.recipientId === activeArtist.id)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim()) return;
    sendMessage(activeArtist.id, inputContent);
    setInputContent('');
  };

  const sendQuickInquiry = (text: string) => {
    sendMessage(activeArtist.id, text);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="pb-6 mb-6 border-b border-stone-200">
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          {t.messages.title}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          {t.messages.subtitle}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Left Contacts Rail */}
        <div className="md:col-span-4 border-r border-stone-200 bg-stone-50/50 flex flex-col">
          <div className="p-4 border-b border-stone-200 font-semibold text-xs text-stone-700">
            Gallery Artists & Curators
          </div>

          <div className="divide-y divide-stone-100 overflow-y-auto flex-1">
            {contacts.map(({ artist, lastMessage, lastTime }) => {
              const isActive = activeArtist.id === artist.id;
              return (
                <button
                  key={artist.id}
                  onClick={() => setActiveChatRecipientId(artist.id)}
                  className={`w-full p-4 flex items-start gap-3 text-left transition-colors cursor-pointer ${
                    isActive ? 'bg-white border-l-4 border-stone-900 shadow-2xs' : 'hover:bg-stone-100/70'
                  }`}
                >
                  <img
                    src={artist.avatar}
                    alt={artist.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-stone-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-sm text-stone-900 truncate">
                        {artist.name}
                      </h4>
                      <span className="text-[10px] text-stone-400 font-mono shrink-0">
                        {lastTime || 'Active'}
                      </span>
                    </div>
                    <span className="text-[11px] text-amber-800 font-medium block truncate">
                      {artist.specialty}
                    </span>
                    <p className="text-xs text-stone-500 truncate mt-0.5">
                      {lastMessage}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Chat Area */}
        <div className="md:col-span-8 flex flex-col justify-between bg-[#FAF8F5]">
          {/* Active Contact Bar */}
          <div className="p-4 bg-white border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={activeArtist.avatar}
                alt={activeArtist.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-amber-500/30"
              />
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  {activeArtist.name}
                </h3>
                <span className="text-[11px] text-stone-500">
                  {activeArtist.location} · Verified Gallery Resident
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-stone-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Direct Studio Channel</span>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {currentThread.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <MessageSquare className="w-10 h-10 mb-2 opacity-40" />
                <p className="text-xs">No previous messages with {activeArtist.name}.</p>
                <p className="text-[11px] text-stone-400 mt-1">Start by asking about a painting or requesting a quote.</p>
              </div>
            ) : (
              currentThread.map(msg => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                        isMe
                          ? 'bg-stone-900 text-white rounded-br-xs'
                          : 'bg-white text-stone-800 border border-stone-200 rounded-bl-xs shadow-2xs'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Inquiry Suggestions */}
          <div className="px-4 py-2 bg-stone-100/70 border-t border-stone-200/80 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-[10px] uppercase font-bold text-stone-400 shrink-0">
              {t.messages.quickInquiry}:
            </span>
            <button
              onClick={() => sendQuickInquiry(t.messages.quick1)}
              className="px-2.5 py-1 bg-white hover:bg-stone-200 border border-stone-200 rounded-lg text-stone-700 whitespace-nowrap cursor-pointer text-[11px]"
            >
              "{t.messages.quick1}"
            </button>
            <button
              onClick={() => sendQuickInquiry(t.messages.quick2)}
              className="px-2.5 py-1 bg-white hover:bg-stone-200 border border-stone-200 rounded-lg text-stone-700 whitespace-nowrap cursor-pointer text-[11px]"
            >
              "{t.messages.quick2}"
            </button>
            <button
              onClick={() => sendQuickInquiry(t.messages.quick3)}
              className="px-2.5 py-1 bg-white hover:bg-stone-200 border border-stone-200 rounded-lg text-stone-700 whitespace-nowrap cursor-pointer text-[11px]"
            >
              "{t.messages.quick3}"
            </button>
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-stone-200 flex gap-2 items-center">
            <input
              type="text"
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder={t.messages.typeMessage}
              className="flex-1 bg-[#FAF8F5] border border-stone-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-stone-900"
            />
            <button
              type="submit"
              className="p-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl transition-colors cursor-pointer"
              title="Send"
            >
              <Send className="w-4 h-4 text-amber-400" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
