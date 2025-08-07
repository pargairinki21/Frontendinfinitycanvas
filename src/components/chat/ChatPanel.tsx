import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SupplierCards from './SupplierCards.jsx';

// ChatMessageBubble component
const ChatMessageBubble = memo(({ message }) => (
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

// TypingIndicator component
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
const ChatInput = memo(({ value, onChange, onSend, selectedTool, onAskSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onAskSubmit) {
      onAskSubmit(value);
    } else {
      onSend();
    }
  };

  const handleKeyDown = (e) => {
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
      <div className="relative w-full max-w-md">
        <div className="relative flex items-center bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl px-4 py-3 shadow-[0_8px_32px_rgba(255,255,255,0.1)] hover:shadow-[0_8px_32px_rgba(255,255,255,0.2)] transition-all duration-300 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 mr-3">
            <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <input
            type="text"
            className="flex-1 bg-transparent outline-none text-base text-white placeholder-white/40 font-medium"
            placeholder="Ask Something..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
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
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
      </div>
    </form>
  );
});

// Main ChatPanel Component
export default function ChatPanel({
  shadowColor,
  droppedMessage,
  droppedMessages,
  hideInput,
  selectedTool,
  messages: messagesProp,
  typing: typingProp,
  onSendMessage,
  onAskSubmit,
}) {
  const [internalMessages, setInternalMessages] = useState([
    { id: 1, sender: 'assistant', text: 'Hi there! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [internalTyping, setInternalTyping] = useState(false);
  const scrollRef = useRef(null);

  // Card state
  const [showCards, setShowCards] = useState(false);
  const [cardCity, setCardCity] = useState('Agra');
  const [cardInput, setCardInput] = useState('');

  // Card generation logic
  const handleAskSubmit = (inputValue) => {
    let city = 'Agra';
    const match = inputValue.match(/in ([a-zA-Z ]+)/i);
    if (match && match[1]) {
      city = match[1].trim();
    }
    setCardCity(city);
    setCardInput(inputValue);
    setShowCards(true);
    if (onAskSubmit) onAskSubmit(inputValue);
    setInput('');
  };

  // Determine which messages and typing state to display
  const displayMessages = messagesProp !== undefined ? messagesProp : internalMessages;
  const displayTyping = typingProp !== undefined ? typingProp : internalTyping;

  // Auto-scroll effect
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [displayMessages, displayTyping]);

  // Handle sending messages
  const handleSend = () => {
    if (!input.trim()) return;
    if (onAskSubmit) {
      handleAskSubmit(input);
    } else if (onSendMessage) {
      onSendMessage(input);
      setInput('');
    } else {
      setInternalMessages((m) => [...m, { id: Date.now(), sender: 'user', text: input }]);
      setInternalTyping(true);
      setTimeout(() => {
        setInternalMessages((m) => [...m, { id: Date.now() + 1, sender: 'assistant', text: 'That sounds interesting. Tell me more.' }]);
        setInternalTyping(false);
      }, 1500);
      setInput('');
    }
  };

  // Render message list
  const renderMessageList = (list) => (
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
    >
      {/* Cards Section - show if showCards is true */}
      {showCards && (
        <SupplierCards city={cardCity} inputValue={cardInput} onSendDetails={() => {}} />
      )}
      {/* Messages area (hide if cards are shown) */}
      {!showCards && (
        droppedMessages ? (
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
        )
      )}
      {/* Input bar (optional) */}
      {!hideInput && (
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          selectedTool={selectedTool}
          onAskSubmit={handleAskSubmit}
        />
      )}
    </div>
  );
}