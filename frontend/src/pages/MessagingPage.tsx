import React, { useState, useEffect } from 'react';
import { messagingApi } from '../api';
import { Conversation, ChatMessage } from '../types';
import { MessageSquare, Send, PhoneCall, Paperclip, CheckCheck, User, Search, Sparkles } from 'lucide-react';

export const MessagingPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<number>(1);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await messagingApi.getConversations();
      setConversations(res.data);
      if (res.data.length > 0) setActiveConversationId(res.data[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  const activeConv = conversations.find(c => c.id === activeConversationId) || conversations[0];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConv) return;

    try {
      await messagingApi.sendMessage(activeConv.id, messageInput);
      setMessageInput('');
      fetchConversations();
    } catch (err) {
      console.error(err);
    }
  };

  const sendQuickReply = (text: string) => {
    setMessageInput(text);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-[600px]">
          
          {/* ================= LEFT CONVERSATION LIST (4 COLS) ================= */}
          <div className="md:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/50">
            <div className="p-4 border-b border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-black text-slate-900 text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-sky-600" /> Messaging Hub
                </h2>
                <span className="text-xs font-bold bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">
                  Inbox
                </span>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Conversation Items */}
            <div className="flex-grow overflow-y-auto divide-y divide-slate-100">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`p-4 cursor-pointer transition flex items-start gap-3 ${
                    activeConversationId === conv.id ? 'bg-white border-l-4 border-sky-600 shadow-xs' : 'hover:bg-slate-100/70'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img src={conv.participantAvatar} alt={conv.participantName} className="w-11 h-11 rounded-full object-cover border border-slate-200" />
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      conv.onlineStatus === 'ONLINE' ? 'bg-emerald-500' : 'bg-amber-400'
                    }`} />
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-xs truncate">{conv.participantName}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0">{conv.lastMessageTime}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{conv.participantTitle}</p>
                    <p className="text-xs text-slate-700 truncate mt-1 font-medium">{conv.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= RIGHT ACTIVE CHAT PANEL (8 COLS) ================= */}
          {activeConv ? (
            <div className="md:col-span-8 flex flex-col justify-between bg-white">
              
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={activeConv.participantAvatar} alt={activeConv.participantName} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                      activeConv.onlineStatus === 'ONLINE' ? 'bg-emerald-500' : 'bg-amber-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{activeConv.participantName}</h3>
                    <p className="text-xs text-slate-500">{activeConv.participantTitle} · <span className="text-emerald-600 font-semibold">{activeConv.onlineStatus}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded-xl transition">
                    <PhoneCall className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Messages Stream */}
              <div className="p-6 overflow-y-auto space-y-4 max-h-[420px] bg-slate-50/30">
                {activeConv.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md rounded-2xl p-4 space-y-1 shadow-xs ${
                      msg.isMine ? 'bg-sky-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none'
                    }`}>
                      <p className="text-xs leading-relaxed font-normal">{msg.content}</p>
                      <div className={`text-[10px] text-right ${msg.isMine ? 'text-sky-200' : 'text-slate-400'}`}>
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Reply Suggestions */}
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px]">
                <span className="font-bold text-slate-500 shrink-0">Quick prompts:</span>
                <button 
                  onClick={() => sendQuickReply("Thank you for reaching out! I'd love to learn more about the role requirements.")}
                  className="bg-white border border-slate-200 hover:border-sky-400 hover:text-sky-600 px-3 py-1 rounded-full whitespace-nowrap transition"
                >
                  "Interested in discussing role"
                </button>
                <button 
                  onClick={() => sendQuickReply("I am available for an interview call tomorrow afternoon. Let me know what time works best!")}
                  className="bg-white border border-slate-200 hover:border-sky-400 hover:text-sky-600 px-3 py-1 rounded-full whitespace-nowrap transition"
                >
                  "Share interview availability"
                </button>
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 flex items-center gap-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Write a message..."
                  className="flex-grow text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-1.5 shadow-xs disabled:opacity-50 transition"
                >
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </form>

            </div>
          ) : (
            <div className="md:col-span-8 flex items-center justify-center p-12 text-slate-400 text-xs">
              Select a conversation to start messaging
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
