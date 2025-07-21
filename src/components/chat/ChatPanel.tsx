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
      className={"glass-card w-[520px] h-[520px] flex flex-col overflow-hidden relative"}
      style={{
        boxShadow: shadowColor ? `0 8px 32px 0 ${shadowColor}99` : 'none'
      }}
    >
      {/* Sine-wave shine effect overlay */}
      <div className="pointer-events-none absolute left-0 top-0 w-full h-1/3 z-10">
        <svg width="100%" height="100%" viewBox="0 0 520 173" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,58 Q130,0 260,58 T520,58 V173 H0 Z" fill="url(#shineGradient)"/>
          <defs>
            <linearGradient id="shineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0.32"/>
              <stop offset="100%" stopColor="white" stopOpacity="0"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      {/* Messages area */}
      {droppedMessages ? (
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-base">{render(droppedMessages)}</div>
      ) : droppedMessage ? (
        <div className="flex-1 flex items-center justify-center text-lg font-semibold text-purple-700 bg-purple-50">
          {droppedMessage}
        </div>
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 text-base">
          {render(displayMessages)}
        </div>
      )}

      {/* Input bar (optional) */}
      {!hideInput && (
        <form className="border-t p-4 bg-white/60 backdrop-blur flex items-center gap-3"
              onSubmit={e=>{e.preventDefault();send();}}>
          <div className="flex items-center bg-white/80 border border-gray-200 rounded-full px-3 py-2 shadow w-[260px]">
            <input
              type="text"
              className="flex-1 bg-transparent outline-none px-2 py-1 text-base"
              placeholder="Type…"
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{ if(e.key==='Enter' && !e.shiftKey){e.preventDefault();send();} }}
            />
            <button type="submit" className="ml-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21l16.5-9-16.5-9v7.5l11.25 1.5-11.25 1.5V21z"/>
              </svg>
            </button>
          </div>
          <div className="flex-1 flex justify-end">
            {selectedTool && (
              <span className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/70 border border-gray-300 shadow text-base">
                <selectedTool.icon color={selectedTool.color} size={22}/>
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
