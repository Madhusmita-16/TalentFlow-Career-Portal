import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User, CheckCircle2, Copy, RefreshCw, ChevronRight, Zap } from 'lucide-react';

interface Message {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actionButton?: {
    label: string;
    action: () => void;
  };
}

export const AIChatBotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      text: "👋 Hi! I'm **TalentFlow AI Copilot**, your personal career & recruitment assistant. How can I help you accelerate your job search today?",
      timestamp: 'Just now'
    }
  ]);

  const handleSend = (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!userText) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiReply = "I've analyzed your request! ";
      const lower = textToSend.toLowerCase();

      if (lower.includes('match') || lower.includes('senior full-stack') || lower.includes('profile')) {
        aiReply = "🎯 **TalentAI Profile Match Analysis**:\n\nYour profile is an **88% Match** for *Senior Full-Stack Engineer (Java & React)*!\n\n- ✅ **Matching Skills**: Java 21, Spring Boot, React.js, TypeScript, MySQL, Docker\n- 💡 **AI Recommendation**: Add *AWS Microservices & Kafka* to your profile skills to boost match score to 96%.";
      } else if (lower.includes('interview') || lower.includes('prep') || lower.includes('questions')) {
        aiReply = "🧠 **Top 3 Technical Interview Questions for Java 21 & React**:\n\n1. *Java*: How do Virtual Threads in Java 21 improve high-concurrency throughput compared to traditional OS threads?\n2. *Spring*: Describe how you handle distributed transaction consistency across microservices.\n3. *React*: How do you optimize React component re-renders using `useMemo` and `useCallback`?";
      } else if (lower.includes('salary') || lower.includes('pay') || lower.includes('compensation')) {
        aiReply = "💰 **San Francisco Salary Benchmark (2026)**:\n\n- **Senior Full-Stack Engineer**: $145,000 – $185,000 base + equity\n- **Lead / Staff Level**: $175,000 – $220,000 base\n\n*Your current experience (6+ years) positions you in the top 75th percentile for SF Bay Area compensation.*";
      } else if (lower.includes('resume') || lower.includes('summary') || lower.includes('improve')) {
        aiReply = "📝 **AI Suggested Resume Summary**:\n\n> *\"Results-driven Senior Full-Stack Engineer with 6+ years of expertise architecting high-throughput Spring Boot microservices and responsive React interfaces. Proven track record reducing API latency by 40% and scaling cloud SaaS applications to 500k+ active users.\"*";
      } else {
        aiReply = `I understand you're asking about "${textToSend}". TalentFlow AI Copilot can help you optimize your profile, generate tailored cover notes, and match you with top engineering roles!`;
      }

      const aiMsg: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 group transition-all duration-200 hover:scale-105"
        >
          <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
          <span className="font-extrabold text-xs tracking-wider pr-1 hidden sm:inline">TalentAI Copilot</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white"></span>
        </button>
      </div>

      {/* Chat Drawer Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[520px] animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-sky-600/90 border border-sky-400 flex items-center justify-center text-yellow-300 shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5">
                  TalentFlow AI Copilot
                  <span className="bg-sky-500/30 text-sky-300 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-sky-400/40">
                    GPT-4o
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400">AI Career Assistant & Job Matcher</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick AI Action Prompt Chips */}
          <div className="bg-sky-50/70 border-b border-sky-100 p-2.5 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => handleSend("Match my profile to Senior Full-Stack Engineer role")}
              className="bg-white hover:bg-sky-100 text-sky-900 border border-sky-200 font-semibold px-2.5 py-1 rounded-full whitespace-nowrap flex items-center gap-1 shadow-2xs transition"
            >
              🎯 Job Match
            </button>
            <button
              onClick={() => handleSend("Generate technical interview prep questions")}
              className="bg-white hover:bg-sky-100 text-sky-900 border border-sky-200 font-semibold px-2.5 py-1 rounded-full whitespace-nowrap flex items-center gap-1 shadow-2xs transition"
            >
              🧠 Interview Prep
            </button>
            <button
              onClick={() => handleSend("What is the average salary for Senior Engineers in SF?")}
              className="bg-white hover:bg-sky-100 text-sky-900 border border-sky-200 font-semibold px-2.5 py-1 rounded-full whitespace-nowrap flex items-center gap-1 shadow-2xs transition"
            >
              💰 Salary Insights
            </button>
          </div>

          {/* Chat Stream */}
          <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-slate-50/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-sky-600 text-white flex items-center justify-center text-xs shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl text-xs space-y-1 shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-sky-600 text-white rounded-br-none'
                      : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-line leading-relaxed font-normal">
                    {msg.text}
                  </div>
                  <span className={`block text-[9px] text-right mt-1 ${msg.sender === 'user' ? 'text-sky-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-xs text-slate-500 font-medium pt-1">
                <div className="w-7 h-7 rounded-xl bg-sky-600 text-white flex items-center justify-center text-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl animate-pulse">
                  AI is analyzing...
                </span>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI anything about your career..."
              className="flex-grow text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-sky-600 hover:bg-sky-700 text-white p-2.5 rounded-xl disabled:opacity-50 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
