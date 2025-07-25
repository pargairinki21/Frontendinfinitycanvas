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
};

// --- Sub-components for better modularity ---

// ChatMessage component
const ChatMessageBubble = memo(({ message }: { message: ChatMessage }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
    className={`max-w-[80%] px-4 py-2 rounded-xl whitespace-pre-wrap ${
      message.sender === 'user' ? 'bg-[#d1f0e4] self-end ml-auto' : 'bg-[#f3f3f3] self-start mr-auto'
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
    className="max-w-[80%] px-4 py-2 rounded-xl bg-[#f3f3f3] self-start mr-auto"
  >
    <div className="flex gap-1">
      <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" />
      <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-150" />
      <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-300" />
    </div>
  </motion.div>
));

// ChatInput component
type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  selectedTool?: ChatPanelProps['selectedTool'];
};

const ChatInput = memo(({ value, onChange, onSend, selectedTool }: ChatInputProps) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSend();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <form
      className="border-t p-4 bg-white/60 backdrop-blur flex items-center gap-3"
      onSubmit={handleSubmit}
    >
      <div className="flex items-center bg-white/80 border border-gray-200 rounded-full px-3 py-2 shadow w-[260px]">
        <input
          type="text"
          className="flex-1 bg-transparent outline-none px-2 py-1 text-base"
          placeholder="Type…"
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
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21l16.5-9-16.5-9v7.5l11.25 1.5-11.25 1.5V21z" />
          </svg>
        </button>
      </div>
      <div className="flex-1 flex justify-end">
        {selectedTool && (
          <span className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/70 border border-gray-300 shadow text-base">
            <selectedTool.icon color={selectedTool.color} size={22} />
            {/* Removed label as per previous instructions for CanvasContainer; if needed, add it back */}
          </span>
        )}
      </div>
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

    // If onSendMessage prop is provided, use it for controlled behavior
    if (onSendMessage) {
      onSendMessage(input);
    } else {
      // Otherwise, manage internal state
      setInternalMessages((m) => [...m, { id: Date.now(), sender: 'user', text: input }]);
      setInternalTyping(true);
      setTimeout(() => {
        setInternalMessages((m) => [...m, { id: Date.now() + 1, sender: 'assistant', text: 'That sounds interesting. Tell me more.' }]);
        setInternalTyping(false);
      }, 1500);
    }
    setInput('');
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
      className="glass-card flex flex-col overflow-hidden rounded-2xl relative min-w-[40rem] min-h-[26rem]"
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
        />
      )}
    </div>
  );
}