'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMic, FiSend, FiX, FiActivity, FiGlobe, FiYoutube } from 'react-icons/fi';
import { TbMessageChatbot, TbCpu } from 'react-icons/tb';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const HELP_NUDGE_COOLDOWN_MS = 2.5 * 60 * 1000;
const HELP_NUDGE_RECHECK_MS = 15 * 1000;
const HELP_NUDGE_DISPLAY_MS = 15_000;

export default function AstraAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHelpNudge, setShowHelpNudge] = useState(true);
  const nudgeSuppressedUntilRef = useRef(0);
  const nudgeAutoHideRef = useRef<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Astra online. I'm your futuristic AI assistant. Ask me about Nishit's work, skills, or anything on your mind!",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          handleSend(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setShowHelpNudge(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) return;
    const tick = () => {
      if (Date.now() >= nudgeSuppressedUntilRef.current) {
        setShowHelpNudge(true);
      }
    };
    tick();
    const id = window.setInterval(tick, HELP_NUDGE_RECHECK_MS);
    return () => window.clearInterval(id);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) return;
    const t = window.setTimeout(() => {
      if (Date.now() >= nudgeSuppressedUntilRef.current) {
        setShowHelpNudge(true);
      }
    }, 4500);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (!showHelpNudge || isOpen) {
      if (nudgeAutoHideRef.current) {
        window.clearTimeout(nudgeAutoHideRef.current);
        nudgeAutoHideRef.current = null;
      }
      return;
    }
    nudgeAutoHideRef.current = window.setTimeout(() => {
      nudgeAutoHideRef.current = null;
      setShowHelpNudge(false);
      nudgeSuppressedUntilRef.current = Date.now() + HELP_NUDGE_COOLDOWN_MS;
    }, HELP_NUDGE_DISPLAY_MS);
    return () => {
      if (nudgeAutoHideRef.current) {
        window.clearTimeout(nudgeAutoHideRef.current);
        nudgeAutoHideRef.current = null;
      }
    };
  }, [showHelpNudge, isOpen]);

  const dismissHelpNudge = () => {
    if (nudgeAutoHideRef.current) {
      window.clearTimeout(nudgeAutoHideRef.current);
      nudgeAutoHideRef.current = null;
    }
    nudgeSuppressedUntilRef.current = Date.now() + HELP_NUDGE_COOLDOWN_MS;
    setShowHelpNudge(false);
  };

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (text: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: messageText }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
        speak(data.reply);
      } else {
        throw new Error(data.error || 'Failed to get reply');
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "Sorry, I encountered a transmission error. Please check your connection." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  return (
    <div
      className={`fixed font-sans ${isOpen ? 'z-[20000]' : 'z-[10000]'}`}
      style={{
        bottom: 'max(1.25rem, env(safe-area-inset-bottom, 0px))',
        right: 'max(1.25rem, env(safe-area-inset-right, 0px))',
      }}
    >
      <div className="relative">
        <AnimatePresence>
          {showHelpNudge && !isOpen && (
            <motion.div
              key="help-nudge"
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { type: 'spring', stiffness: 380, damping: 30 },
              }}
              exit={{ opacity: 0, y: 6, scale: 0.98, transition: { duration: 0.22 } }}
              className="absolute bottom-[calc(100%+12px)] right-0 z-[1] w-[min(300px,calc(100vw-2rem))] cursor-pointer rounded-2xl border border-cyan-400/40 bg-[rgba(10,16,28,0.94)] shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_28px_rgba(61,214,255,0.14)] backdrop-blur-xl"
              data-no-custom-cursor="true"
              onClick={() => setIsOpen(true)}
            >
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-cyan-400/25"
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="relative z-[1] flex items-start gap-2 px-3.5 pb-3 pt-3">
                <p className="min-w-0 flex-1 text-left text-[13px] leading-relaxed text-white/90">
                  <span className="font-semibold text-cyan-200">Need help?</span>{' '}
                  Tap to ask <span className="font-semibold text-white">Astra</span> about this portfolio, skills, or projects.
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissHelpNudge();
                  }}
                  className="shrink-0 rounded-lg p-1.5 text-white/45 transition hover:bg-white/10 hover:text-white"
                  aria-label="Dismiss help reminder"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
              <span
                className="pointer-events-none absolute -bottom-1.5 right-8 z-[1] h-3 w-3 rotate-45 border-r border-b border-cyan-400/40 bg-[rgba(10,16,28,0.94)]"
                aria-hidden
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
            className="absolute bottom-20 right-0 w-[min(calc(100vw-1.25rem),400px)] max-w-[calc(100vw-1.25rem)] min-w-0 h-[min(600px,75dvh)] max-h-[min(80dvh,90svh)] flex flex-col glass rounded-2xl overflow-hidden shadow-2xl border border-white/10 cursor-auto"
            data-no-custom-cursor="true"
            style={{ 
              background: 'rgba(18, 28, 48, 0.8)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 0 40px rgba(61, 214, 255, 0.15)'
            }}
          >
            <div className="p-3 sm:p-4 border-b border-white/10 flex items-center justify-between gap-2 bg-white/5 min-w-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-cyan-400/50 flex items-center justify-center bg-cyan-400/10 shadow-[0_0_15px_rgba(61,214,255,0.3)]">
                  <TbCpu className="w-5 h-5 text-cyan-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-bold tracking-wider text-sm">ASTRA CORE</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] text-cyan-400/70 font-mono tracking-tighter uppercase">System Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
            >
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[min(85%,100%)] p-2.5 sm:p-3 rounded-2xl text-xs sm:text-sm leading-relaxed break-words ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-white' 
                        : 'bg-white/5 border border-white/10 text-cyan-50/90'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex gap-1">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
              <button 
                onClick={() => handleSend("Tell me about Nishit's skills")}
                className="shrink-0 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] text-cyan-400 uppercase tracking-widest transition-colors flex items-center gap-1.5"
              >
                <FiActivity className="w-3 h-3" /> Skills
              </button>
              <button 
                onClick={() => handleSend("What projects has he built?")}
                className="shrink-0 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] text-cyan-400 uppercase tracking-widest transition-colors flex items-center gap-1.5"
              >
                <FiGlobe className="w-3 h-3" /> Projects
              </button>
              <button 
                onClick={() => window.open('https://youtube.com', '_blank')}
                className="shrink-0 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] text-cyan-400 uppercase tracking-widest transition-colors flex items-center gap-1.5"
              >
                <FiYoutube className="w-3 h-3" /> YouTube
              </button>
            </div>

            <div className="p-3 sm:p-4 bg-white/5 border-t border-white/10">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-black/20 rounded-xl border border-white/10 p-1 min-w-0">
                <input 
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend('')}
                  placeholder="Ask Astra..."
                  className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-white text-sm px-3 placeholder:text-white/20"
                  style={{ pointerEvents: 'auto' }}
                />
                <button 
                  onClick={toggleListening}
                  className={`p-2 rounded-lg transition-all ${
                    isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'text-cyan-400 hover:bg-white/10'
                  }`}
                >
                  <FiMic className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleSend('')}
                  className="p-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-colors"
                >
                  <FiSend className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center shadow-[0_0_30px_rgba(61,214,255,0.4)] relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <TbMessageChatbot className={`w-8 h-8 text-black transition-transform duration-500 ${isOpen ? 'rotate-180 scale-75' : ''}`} />

        <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-[spin_4s_linear_infinite]"></div>
        <div className="absolute inset-2 border border-white/10 rounded-full animate-[spin_6s_linear_infinite_reverse]"></div>
      </motion.button>
      </div>
    </div>
  );
}
