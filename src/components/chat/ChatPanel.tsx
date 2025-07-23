import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ChatMessage = { id:number; sender:'user'|'assistant'; text:string };

type ChatPanelProps = {
  shadowColor?: string|null;
  droppedMessage?: string;
  droppedMessages?: ChatMessage[];
  hideInput?: boolean;
  selectedTool?: { label:string; icon:React.ElementType; color:string }|null;
  messages?: ChatMessage[];
  typing?: boolean;
};

export default function ChatPanel({
  shadowColor,
  droppedMessage,
  droppedMessages,
  hideInput,
  selectedTool,
  messages: messagesProp,
  typing: typingProp,
}: ChatPanelProps) {
  const [messages,setMessages]=useState<ChatMessage[]>([
    { id:1, sender:'assistant', text:'Hi there! How can I help you today?' },
  ]);
  const [input,setInput]=useState('');
  const [typing,setTyping]=useState(false);
  const scrollRef=useRef<HTMLDivElement>(null);

  // Use props if provided
  const displayMessages = messagesProp !== undefined ? messagesProp : messages;
  const displayTyping = typingProp !== undefined ? typingProp : typing;

  /* auto‑scroll */
  useEffect(()=>{ scrollRef.current?.scrollTo({top:scrollRef.current.scrollHeight,behavior:'smooth'}); },[displayMessages,displayTyping]);

  /* send */
  function send(){
    if(!input.trim()) return;
    setMessages(m=>[...m,{id:Date.now(),sender:'user',text:input}]);
    setInput(''); setTyping(true);
    setTimeout(()=>{ setMessages(m=>[...m,{id:Date.now()+1,sender:'assistant',text:'That sounds interesting. Tell me more.'}]); setTyping(false); },1500);
  }

  /* helper to render list */
  const render=(list:ChatMessage[])=>(
    <AnimatePresence initial={false}>
      {list.map(m=>(
        <motion.div key={m.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.3}}
          className={`max-w-[80%] px-4 py-2 rounded-xl whitespace-pre-wrap ${
            m.sender==='user' ? 'bg-[#d1f0e4] self-end ml-auto' : 'bg-[#f3f3f3] self-start mr-auto'
          }`}>
          {m.text}
        </motion.div>
      ))}
      {displayTyping&&(
        <motion.div key="typing" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          className="max-w-[80%] px-4 py-2 rounded-xl bg-[#f3f3f3] self-start mr-auto">
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"/>
            <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-150"/>
            <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-300"/>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div
      className={"glass-card w-[340px] h-[340px] flex flex-col overflow-hidden relative"}
      style={{
        boxShadow: shadowColor ? `0 8px 32px 0 ${shadowColor}99` : 'none'
      }}
    >
      {/* Removed sine-wave shine effect overlay */}
      {/* Messages area */}
      {droppedMessages ? (
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-base">{render(droppedMessages)}</div>
      ) : droppedMessage ? (
        <div className="flex-1 flex items-center justify-center text-lg font-semibold text-purple-700 bg-purple-50">
          {droppedMessage}
        </div>
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 text-base scrollbar-hide">
          {render(displayMessages)}
        </div>
      )}

      {/* Input bar (optional) */}
    </div>
  );
}
