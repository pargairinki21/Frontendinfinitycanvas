import React, { useState, useEffect, useRef, memo, FormEvent, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
type ChatMessage = { id: number; sender: 'user' | 'assistant'; text: string };

type ChatPanelProps = {
  shadowColor?: string | null;
  droppedMessage?: string;
  droppedMessages?: ChatMessage[];
  hideInput?: boolean;
  selectedTool?: { label: string; icon: React.ElementType; color: string } | null;
  messages?: ChatMessage[]; // Controlled messages
  typing?: boolean; // Controlled typing indicator
  onSendMessage?: (message: string) => void; // Callback for sending messages
  onAskSubmit?: (input: string) => void; // Add Ask Something functionality
};

// --- Sub-components for better modularity ---

// ChatMessage component
const ChatMessageBubble = memo(({ message }: { message: ChatMessage }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
    className={`max-w-[80%] px-4 py-2 rounded-xl whitespace-pre-wrap text-white ${
      message.sender === 'user' 
        ? 'bg-white/20 self-end ml-auto' 
        : 'bg-white/10 self-start mr-auto'
    }`}
  >
    {message.text}
  </motion.div>
));

// Typing Indicator component
const TypingIndicator = memo(() => (
  <motion.div
    key="typing"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="max-w-[80%] px-4 py-2 rounded-xl bg-white/10 self-start mr-auto"
  >
    <div className="flex gap-1">
      <div className="w-2.5 h-2.5 bg-white/70 rounded-full animate-bounce" />
      <div className="w-2.5 h-2.5 bg-white/70 rounded-full animate-bounce delay-150" />
      <div className="w-2.5 h-2.5 bg-white/70 rounded-full animate-bounce delay-300" />
    </div>
  </motion.div>
));

// ChatInput component
type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  selectedTool?: ChatPanelProps['selectedTool'];
  onAskSubmit?: (input: string) => void; // Add this prop for Ask Something functionality
};

const ChatInput = memo(({ value, onChange, onSend, selectedTool, onAskSubmit }: ChatInputProps) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onAskSubmit) {
      onAskSubmit(value); // Use Ask Something functionality if available
    } else {
      onSend(); // Fallback to original functionality
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <form
      className="p-6 flex flex-col items-center gap-4"
      onSubmit={handleSubmit}
    >
      {/* NEW PROFESSIONAL DESIGN */}
      {/* Professional Input Container */}
      <div className="relative w-full max-w-md">
        {/* Enhanced Input Box */}
        <div className="relative flex items-center bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl px-4 py-3 shadow-[0_8px_32px_rgba(255,255,255,0.1)] hover:shadow-[0_8px_32px_rgba(255,255,255,0.2)] transition-all duration-300 group">
          {/* Left Icon */}
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 mr-3">
            <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          
          {/* Input Field */}
          <input
            type="text"
            className="flex-1 bg-transparent outline-none text-base text-white placeholder-white/40 font-medium"
            placeholder="Ask Something..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          
          {/* Send Button */}
          <button 
            type="submit" 
            className="ml-3 bg-gradient-to-r from-purple-500/80 to-blue-500/80 hover:from-purple-500 to-blue-500 text-white rounded-xl p-2.5 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group-hover:shadow-purple-500/25"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21l16.5-9-16.5-9v7.5l11.25 1.5-11.25 1.5V21z" />
            </svg>
          </button>
        </div>
        
        {/* Subtle Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
      </div>
      
      {/* Selected Tool Indicator - REMOVED */}
      {/* {selectedTool && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white shadow-lg">
          <selectedTool.icon color={selectedTool.color} size={20} />
          <span className="text-sm font-medium">{selectedTool.label}</span>
        </div>
      )} */}

      {/* OLD SIMPLE DESIGN - COMMENTED OUT */}
      {/* 
      <div className="flex items-center w-[320px] max-w-full px-4 py-2 rounded-full border border-gray-300 shadow bg-white focus:outline-none focus:ring-2 focus:ring-purple-400">
        <input
          type="text"
          className="flex-1 bg-transparent outline-none text-base"
          placeholder="Ask Something..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button type="submit" className="ml-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21l16.5-9-16.5-9v7.5l11.25 1.5-11.25 1.5V21z" />
          </svg>
        </button>
      </div>
      <div className="flex-1 flex justify-end">
        {selectedTool && (
          <span className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/70 border border-gray-300 shadow text-base">
            <selectedTool.icon color={selectedTool.color} size={22} />
          </span>
        )}
      </div>
      */}
    </form>
  );
});

// --- Main ChatPanel Component ---
export default function ChatPanel({
  shadowColor,
  droppedMessage,
  droppedMessages,
  hideInput,
  selectedTool,
  messages: messagesProp, // Renamed to avoid conflict with internal state
  typing: typingProp,     // Renamed to avoid conflict with internal state
  onSendMessage,          // New prop for sending messages
  onAskSubmit,            // Add Ask Something functionality
}: ChatPanelProps) {
  // Internal state for messages and typing if not controlled by props
  const [internalMessages, setInternalMessages] = useState<ChatMessage[]>([
    { id: 1, sender: 'assistant', text: 'Hi there! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [internalTyping, setInternalTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Determine which messages and typing state to display (controlled vs. internal)
  const displayMessages = messagesProp !== undefined ? messagesProp : internalMessages;
  const displayTyping = typingProp !== undefined ? typingProp : internalTyping;

  // Auto-scroll effect
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [displayMessages, displayTyping]);

  // Handle sending messages
  const handleSend = () => {
    if (!input.trim()) return;

    // If onAskSubmit prop is provided, use Ask Something functionality
    if (onAskSubmit) {
      onAskSubmit(input);
      setInput(''); // Clear input after submission
    } else if (onSendMessage) {
      // If onSendMessage prop is provided, use it for controlled behavior
      onSendMessage(input);
      setInput('');
    } else {
      // Otherwise, manage internal state
      setInternalMessages((m) => [...m, { id: Date.now(), sender: 'user', text: input }]);
      setInternalTyping(true);
      setTimeout(() => {
        setInternalMessages((m) => [...m, { id: Date.now() + 1, sender: 'assistant', text: 'That sounds interesting. Tell me more.' }]);
        setInternalTyping(false);
      }, 1500);
      setInput('');
    }
  };

  // Helper to render message list using the ChatMessageBubble and TypingIndicator components
  const renderMessageList = (list: ChatMessage[]) => (
    <AnimatePresence initial={false}>
      {list.map((m) => (
        <ChatMessageBubble key={m.id} message={m} />
      ))}
      {displayTyping && <TypingIndicator />}
    </AnimatePresence>
  );

  return (
    <div
      className="glass-border relative w-96 h-[28rem] rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.2)] text-white p-4 flex flex-col min-w-[40rem] min-h-[26rem]"
      style={{
        // boxShadow: shadowColor ? `0 8px 32px 0 ${shadowColor}99` : 'none',
      }}
    >
      {/* Messages area */}
      {droppedMessages ? (
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-base">
          {renderMessageList(droppedMessages)}
        </div>
      ) : droppedMessage ? (
        <div className="flex-1 flex items-center justify-center text-lg font-semibold text-purple-700 bg-purple-50">
          {droppedMessage}
        </div>
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 text-base">
          {renderMessageList(displayMessages)}
        </div>
      )}

      {/* Input bar (optional) */}
      {!hideInput && (
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          selectedTool={selectedTool}
          onAskSubmit={onAskSubmit}
        />
      )}

    </div>
  );
}