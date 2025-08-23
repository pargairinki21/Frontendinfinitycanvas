import React, { useState, useRef, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    webkitAudioContext: any;
  }
}

interface VoiceButtonProps {
  onVoiceResult: (text: string) => void;
  className?: string;
}

export default function VoiceButton({ 
  onVoiceResult, 
  className = "" 
}: VoiceButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleVoiceResult = useCallback(async (text: string) => {
    console.log('Voice result:', text);
    onVoiceResult(text);
  }, [onVoiceResult]);

  const setupAudioAnalysis = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const checkAudioLevel = () => {
        if (!analyserRef.current || !isListening) return;
        
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        
        // Detect speech (adjust threshold as needed)
        const isSpeakingNow = average > 20;
        setIsSpeaking(isSpeakingNow);
        
        if (isListening) {
          requestAnimationFrame(checkAudioLevel);
        }
      };
      
      checkAudioLevel();
    } catch (error) {
      console.error('Error setting up audio analysis:', error);
    }
  }, [isListening]);

  const startListening = useCallback(async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      console.error('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setupAudioAnalysis();
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleVoiceResult(transcript);
      setIsListening(false);
      setIsSpeaking(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setIsSpeaking(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setIsSpeaking(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [handleVoiceResult, setupAudioAnalysis]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setIsSpeaking(false);
      
      // Clean up audio analysis
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    }
  }, []);


  const handleClick = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  if (!isSupported) {
    return (
      <button
        type="button"
        className={`text-white/30 cursor-not-allowed p-1 ${className}`}
        disabled
        title="Voice input not supported in this browser"
      >
        <MicOff size={20} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`text-white/70 hover:text-white transition-all duration-200 p-1 ${
        isListening ? 'text-blue-400' : ''
      } ${className}`}
      title={isListening ? "Listening... Click to stop" : "Start voice input"}
      style={{
        transform: isSpeaking ? 'scale(1.2)' : 'scale(1)',
        transition: 'transform 0.1s ease-in-out'
      }}
    >
      <Mic size={20} className={isListening ? 'animate-pulse' : ''} />
    </button>
  );
}
