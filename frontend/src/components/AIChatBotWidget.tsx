import React, { useState, useEffect } from 'react';
import { Sparkles, X, Send, User, CheckCircle2, Copy, RefreshCw, ChevronRight, Zap } from 'lucide-react';

export const AIRobotIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="2" r="1.5" fill="#0284C7" />
    <rect x="4" y="5" width="16" height="13" rx="4" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
    <circle cx="9" cy="10.5" r="1.75" fill="#0284C7" />
    <circle cx="15" cy="10.5" r="1.75" fill="#0284C7" />
    <circle cx="9.5" cy="10" r="0.5" fill="#FFFFFF" />
    <circle cx="15.5" cy="10" r="0.5" fill="#FFFFFF" />
    <path d="M8.5 15H15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <rect x="2" y="9" width="2" height="5" rx="1" fill="currentColor" />
    <rect x="20" y="9" width="2" height="5" rx="1" fill="currentColor" />
  </svg>
);

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

  useEffect(() => {
    const handleOpenCopilot = () => {
      setIsOpen(true);
    };

    window.addEventListener('open-ai-copilot', handleOpenCopilot);
    return () => {
      window.removeEventListener('open-ai-copilot', handleOpenCopilot);
    };
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      text: "🤖 **Welcome to Link2Career AI Copilot!**\n\nI am your intelligent career, talent matching & interview preparation assistant. How can I assist you today?",
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
        aiReply = "🎯 **Link2Career AI Profile Match Analysis**:\n\nYour profile is an **88% Match** for *Senior Full-Stack Engineer (Java & React)*!\n\n- ✅ **Matching Skills**: Java 21, Spring Boot, React.js, TypeScript, MySQL, Docker\n- 💡 **AI Recommendation**: Add *AWS Microservices & Kafka* to your profile skills to boost match score to 96%.";
      } else if (lower.includes('interview') || lower.includes('prep') || lower.includes('questions')) {
        aiReply = "🧠 **Top 3 Technical Interview Questions for Java 21 & React**:\n\n1. *Java*: How do Virtual Threads in Java 21 improve high-concurrency throughput compared to traditional OS threads?\n2. *Spring*: Describe how you handle distributed transaction consistency across microservices.\n3. *React*: How do you optimize React component re-renders using `useMemo` and `useCallback`?";
      } else if (lower.includes('salary') || lower.includes('pay') || lower.includes('compensation')) {
        aiReply = "💰 **San Francisco Salary Benchmark (2026)**:\n\n- **Senior Full-Stack Engineer**: $145,000 – $185,000 base + equity\n- **Lead / Staff Level**: $175,000 – $220,000 base\n\n*Your current experience (6+ years) positions you in the top 75th percentile for SF Bay Area compensation.*";
      } else if (lower.includes('resume') || lower.includes('summary') || lower.includes('improve')) {
        aiReply = "📝 **AI Suggested Resume Summary**:\n\n> *\"Results-driven Senior Full-Stack Engineer with 6+ years of expertise architecting high-throughput Spring Boot microservices and responsive React interfaces. Proven track record reducing API latency by 40% and scaling cloud SaaS applications to 500k+ active users.\"*";
      } else {
        aiReply = `I understand you're asking about "${textToSend}". Link2Career AI Copilot can help you optimize your candidate profile, generate tailored cover notes, and match you with top tier engineering roles!`;
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
      {/* Floating AI Robot Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          title="Open Link2Career AI Copilot"
          className="bg-gradient-to-r from-slate-900 via-sky-900 to-blue-900 hover:from-slate-800 hover:to-blue-800 text-white p-3.5 sm:px-4 sm:py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 group transition-all duration-300 hover:scale-105 border border-sky-400/40 ring-4 ring-sky-500/20"
        >
          <div className="p-1 rounded-xl bg-sky-500/20 text-sky-400 group-hover:text-yellow-300 transition">
            <AIRobotIcon className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-xs tracking-wider pr-1 hidden sm:inline flex items-center gap-1.5">
            AI Copilot
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </span>
        </button>
      </div>

      {/* AI Copilot Drawer Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[530px] animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Copilot Header */}
          <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/50 flex items-center justify-center text-sky-300 shadow-xs">
                <AIRobotIcon className="w-6 h-6 text-sky-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5">
                  Link2Career AI Copilot
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
                  <div className="w-7 h-7 rounded-xl bg-sky-900 text-sky-300 border border-sky-700/50 flex items-center justify-center text-xs shrink-0 mt-1">
                    <AIRobotIcon className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl text-xs space-y-1 shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-sky-600 text-white rounded-br-none font-medium'
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
                <div className="w-7 h-7 rounded-xl bg-sky-900 text-sky-300 flex items-center justify-center text-xs">
                  <AIRobotIcon className="w-4 h-4" />
                </div>
                <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl animate-pulse text-sky-700 font-semibold">
                  AI Copilot is analyzing...
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
              placeholder="Ask AI Copilot anything about your career..."
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

