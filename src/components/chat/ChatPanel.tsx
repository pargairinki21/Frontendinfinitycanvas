import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatPanel() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'assistant', text: 'Hi there! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage = { id: Date.now(), sender: 'user', text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'assistant', text: 'That sounds interesting. Tell me more.' },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="w-[600px] h-[80vh] bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden">
      <div className="p-4 border-b text-center font-semibold text-lg bg-[#f9f4f4]">
        Welcome to Your AI Space
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`max-w-[80%] px-4 py-2 rounded-xl whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-[#d1f0e4] self-end ml-auto'
                  : 'bg-[#f3f3f3] self-start mr-auto'
              }`}
            >
              {msg.text}
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-[80%] px-4 py-2 rounded-xl bg-[#f3f3f3] self-start mr-auto"
            >
              <div className="flex items-center gap-1">
                <div className="typing-dots w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" />
                <div className="typing-dots w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-150" />
                <div className="typing-dots w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-300" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t p-4 bg-white flex gap-2">
        <textarea
          className="flex-1 resize-none rounded-xl p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 max-h-24"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="shrink-0 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
        >
          Send
        </button>
      </div>

      <style jsx>{`
        .typing-dots {
          display: inline-block;
          animation-duration: 1s;
          animation-iteration-count: infinite;
        }
        .delay-150 {
          animation-delay: 0.15s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
}
