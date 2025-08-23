import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SupplierCards from './SupplierCards.jsx';
import VoiceButton from './VoiceButton';

// PDF.js worker configuration
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type Message = {
  id: number;
  sender: 'user' | 'assistant';
  text: string;
};

interface ChatPanelProps {
  shadowColor?: string;
  droppedMessage?: string | null;
  droppedMessages?: Message[] | null;
  hideInput?: boolean;
  selectedTool?: any;
  messages?: Message[];
  typing?: boolean;
  onSendMessage?: (text: string) => void;
  onAskSubmit?: (text: string) => void;
}

const ChatMessageBubble = memo(({ message }: { message: Message }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.18 }}
    className={`max-w-[80%] px-4 py-2 rounded-xl whitespace-pre-wrap text-white ${
      message.sender === 'user'
        ? 'bg-white/20 self-end ml-auto'
        : 'bg-white/10 self-start mr-auto'
    }`}
  >
    {message.text}
  </motion.div>
));

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

const ChatInput = memo(
  ({
    value,
    onChange,
    onSend,
  }: {
    value: string;
    onChange: (v: string) => void;
    onSend: () => void;
  }) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSend();
      }
    };

    return (
      <form
        className="p-6 flex flex-col items-center gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
      >
        <div className="relative w-full max-w-md">
          <div className="relative flex items-center bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl px-4 py-3">
            <VoiceButton
              onVoiceResult={(text) => onChange(text)}
              className="mr-3"
            />
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
              className="ml-3 bg-gradient-to-r from-purple-500/80 to-blue-500/80 text-white rounded-xl p-2.5"
            >
              Send
            </button>
          </div>
        </div>
      </form>
    );
  }
);

export default function ChatPanel(props: ChatPanelProps) {
  const {
    droppedMessage,
    droppedMessages,
    hideInput,
    messages: messagesProp,
    typing: typingProp,
    onAskSubmit,
  } = props;

  const [internalMessages, setInternalMessages] = useState<Message[]>([
    { id: 1, sender: 'assistant', text: 'Hi there! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [internalTyping, setInternalTyping] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [cardCity, setCardCity] = useState('Agra');
  const [cardInput, setCardInput] = useState('');
  // Remove unused form state variables
  // const [activeForm, setActiveForm] = useState<string | null>(null);
  // const [numPages, setNumPages] = useState(0);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const displayMessages = messagesProp ?? internalMessages;
  const displayTyping = typingProp ?? internalTyping;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [displayMessages, displayTyping]);

  const handleAskSubmit = (inputValue: string) => {
    let city = 'Agra';
    const match = inputValue.match(/in ([a-zA-Z ]+)/i);
    if (match && match[1]) city = match[1].trim();

    setCardCity(city);
    setCardInput(inputValue);
    setShowCards(true);
    onAskSubmit?.(inputValue);
    setInput('');
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Always call onAskSubmit for form requests instead of handling locally
    onAskSubmit?.(input);
    setInput('');
    
    // Remove the local form handling logic
    /*
    const lower = input.toLowerCase();
    const matchedKeyword = Object.keys(keywordMap).find((k) => lower.includes(k));
    setInternalMessages((msgs) => [...msgs, { id: Date.now(), sender: 'user', text: input }]);

    if (matchedKeyword) {
      const formKey = keywordMap[matchedKeyword];
      setActiveForm(formKey);
      setInternalMessages((msgs) => [
        ...msgs,
        { id: Date.now() + 1, sender: 'assistant', text: `Opening ${formKey.toUpperCase()} form...` },
      ]);
    } else {
      setInternalTyping(true);
      setTimeout(() => {
        setInternalMessages((msgs) => [
          ...msgs,
          { id: Date.now() + 1, sender: 'assistant', text: "Sorry, I couldn't find that form." },
        ]);
        setInternalTyping(false);
      }, 700);
    }
    setInput('');
    */
  };

  const renderMessageList = (list: Message[]) => (
    <AnimatePresence initial={false}>
      {list.map((m) => (
        <ChatMessageBubble key={m.id} message={m} />
      ))}
      {displayTyping && <TypingIndicator />}
    </AnimatePresence>
  );

  return (
    <div className="glass-border relative w-96 h-[28rem] bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl flex flex-col p-4 min-w-[40rem] min-h-[26rem] text-white">
      {showCards ? (
        <SupplierCards city={cardCity} inputValue={cardInput} onSendDetails={() => {}} />
      ) : droppedMessages ? (
        <div className="flex-1 overflow-y-auto p-5 space-y-4">{renderMessageList(droppedMessages)}</div>
      ) : droppedMessage ? (
        <div className="flex-1 flex items-center justify-center">{droppedMessage}</div>
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
          {renderMessageList(displayMessages)}
          {/* Remove inline form display - now handled by OutputChatPanel */}
          {/* {renderInlineForm()} */}
        </div>
      )}
      {!hideInput && <ChatInput value={input} onChange={setInput} onSend={handleSend} />}
    </div>
);
}





// import React, { useState, useRef, useEffect } from 'react';
// import { ChatMessage, Tool } from '../shared/types';

// interface ChatPanelProps {
//   shadowColor?: string;
//   messages: ChatMessage[];
//   typing: boolean;
//   selectedTool?: Tool | null;
//   onAskSubmit: (value: string) => void;
// }

// export default function ChatPanel({
//   shadowColor,
//   messages,
//   typing,
//   selectedTool,
//   onAskSubmit,
// }: ChatPanelProps) {
//   const [inputValue, setInputValue] = useState('');
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const handleSend = () => {
//     if (!inputValue.trim()) return;
//     onAskSubmit(inputValue);
//     setInputValue('');
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, typing]);

//   return (
//     <div className="flex flex-col h-full">
//       {/* Messages */}
//       <div className="flex-1 overflow-auto space-y-3">
//         {messages.map(msg => (
//           <div
//             key={msg.id}
//             className={`p-3 rounded-xl max-w-[80%] ${
//               msg.sender === 'user'
//                 ? 'bg-blue-500 text-white self-end'
//                 : 'bg-gray-200 text-gray-800 self-start'
//             }`}
//             style={{
//               boxShadow: shadowColor ? `0 2px 6px ${shadowColor}` : undefined,
//             }}
//           >
//             {msg.text}
//           </div>
//         ))}

//         {typing && (
//           <div className="self-start bg-gray-200 text-gray-500 px-3 py-2 rounded-xl">
//             Typing...
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <div className="mt-3 flex">
//         <input
//           type="text"
//           placeholder="Type your message..."
//           className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           value={inputValue}
//           onChange={e => setInputValue(e.target.value)}
//           onKeyDown={handleKeyDown}
//         />
//         <button
//           onClick={handleSend}
//           className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r-lg"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }
