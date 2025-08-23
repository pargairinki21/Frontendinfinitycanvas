import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import { processAudio } from '../../services/apiService';

// Configure PDF.js worker - use CDN version that matches the installed version
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const BACKEND_BASE_URL = 'http://127.0.0.1:8001';

// Comprehensive form configuration with extended keywords
const FORM_CONFIG = {
  hdfc: { title: 'HDFC Bank Form', keywords: ['hdfc', 'hdfc bank', 'hdfc form'], backendQuery: 'hdfc' },
  axis: { title: 'Axis Bank Form', keywords: ['axis', 'axis bank', 'axis form'], backendQuery: 'axis' },
  loan: { title: 'Loan Application Form', keywords: ['loan', 'application', 'loan application', 'gold loan'], backendQuery: 'loan application' },
  form15g: { title: 'Form 15G', keywords: ['form 15', '15 g', '15g', 'form 15g'], backendQuery: 'form 15 g' },
  form60: { title: 'Form 60', keywords: ['form 60', '60'], backendQuery: 'form 60' },
  kyc: { title: 'KYC Verification', keywords: ['kyc', 'kyc verification', 'know your customer', 'verification', 're-kyc'], backendQuery: 'kyc' },
  account_opening: { title: 'Account Opening Form', keywords: ['account opening', 'account opening form', 'open account', 'new account'], backendQuery: 'account opening' },
  account_closure: { title: 'Account Closure Form', keywords: ['account closure', 'account closure form', 'close account', 'closure'], backendQuery: 'account closure' },
  current_account: { title: 'Current Account Form', keywords: ['current account', 'current'], backendQuery: 'current account' },
  savings_account: { title: 'Savings Account Form', keywords: ['savings account', 'savings'], backendQuery: 'savings account' },
  ppf: { title: 'PPF Form', keywords: ['ppf', 'ppf form', 'public provident fund', 'provident fund'], backendQuery: 'ppf' },
  signature: { title: 'Signature Update Form', keywords: ['signature', 'signature update', 'update signature'], backendQuery: 'signature' },
  dormant: { title: 'Dormant Account Activation', keywords: ['dormant', 'dormant account', 'activation', 'reactivation'], backendQuery: 'dormant' }
};

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface OutputChatPanelProps {
  isVisible: boolean;
  messages: Message[];
  pdfUrl?: string | null;
  onClose?: () => void;
  shadowColor?: string;
  backendMessage?: string | null;
}

const ChatMessageBubble = memo(({ message }: { message: Message }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
  >
    <div
      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        message.sender === 'user'
          ? 'bg-blue-500 text-white'
          : 'bg-white/20 text-white border border-white/30'
      }`}
    >
      <p className="text-sm">{message.text}</p>
      <p className="text-xs opacity-70 mt-1">
        {message.timestamp.toLocaleTimeString()}
      </p>
    </div>
  </motion.div>
));

const TypingIndicator = memo(() => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex justify-start"
  >
    <div className="bg-white/20 text-white border border-white/30 px-4 py-2 rounded-lg">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  </motion.div>
));

const PDFViewer = memo(({ url, onClose, onExpand }: { url: string; onClose: () => void; onExpand: () => void }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [useIframe, setUseIframe] = useState<boolean>(false);
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);

  console.log("🔍 PDFViewer rendering with URL:", url);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
    console.log('📄 PDF loaded successfully, pages:', numPages);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('📄 PDF load error:', error);
    console.error('📄 PDF URL that failed:', url);
    console.log('📄 Switching to iframe fallback');
    setUseIframe(true);
    setLoading(false);
    setError(null);
  };

  // Set timeout to fallback to iframe if loading takes too long
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading && !error) {
        console.log('📄 PDF loading timeout, switching to iframe');
        setUseIframe(true);
        setLoading(false);
      }
    }, 5000); // 5 second timeout
    
    setLoadingTimeout(timeout);
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [loading, error]);

  const goToPrevPage = () => {
    setPageNumber(page => Math.max(page - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(page => Math.min(page + 1, numPages));
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-white/10 border-b border-white/20">
        <div className="flex items-center gap-3">
          <h4 className="text-sm font-medium text-white">PDF Viewer</h4>
          {numPages > 0 && (
            <span className="text-xs text-white/70">
              Page {pageNumber} of {numPages}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Navigation Controls */}
          {numPages > 1 && !useIframe && (
            <div className="flex items-center gap-1">
              <button
                onClick={goToPrevPage}
                disabled={pageNumber <= 1}
                className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNextPage}
                disabled={pageNumber >= numPages}
                className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
          <button
            onClick={onClose}
            className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 bg-white overflow-auto flex items-center justify-center">
        {loading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading PDF...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center p-6">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <button 
                onClick={() => window.open(url, '_blank')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
              >
                Open in New Tab
              </button>
              <button 
                onClick={() => {
                  setError(null);
                  setLoading(true);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!loading && !error && !useIframe && (
          <div className="p-4">
            <Document
              file={url}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={(
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading PDF...</p>
                  <p className="text-xs text-gray-500 mt-2 break-all">URL: {url}</p>
                </div>
              )}
            >
              <Page 
                pageNumber={pageNumber}
                width={Math.min(window.innerWidth * 0.35, 400)}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                onLoadError={(error) => {
                  console.error('📄 Page load error:', error);
                  setError(`Failed to load page: ${error.message}`);
                }}
              />
            </Document>
          </div>
        )}

        {/* Clean PDF.js Web Viewer */}
        {useIframe && (
          <div className="flex-1 bg-white overflow-hidden relative group">
            <iframe
              src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(url)}`}
              className="w-full h-full border-0 cursor-pointer"
              title="PDF Viewer"
              allow="fullscreen"
              style={{ 
                minHeight: '400px',
                height: '100%',
                width: '100%'
              }}
              scrolling="yes"
              onClick={onExpand}
              onLoad={() => {
                console.log('📄 PDF loaded successfully');
              }}
              onError={(e) => {
                console.error('📄 PDF failed to load:', e);
                setError('PDF failed to load');
              }}
            />
            {/* Expand hint overlay */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors pointer-events-none group-hover:pointer-events-auto" 
                 onClick={onExpand}>
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Click to expand
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

const OutputChatPanel: React.FC<OutputChatPanelProps> = ({
  isVisible,
  messages,
  pdfUrl,
  onClose,
  shadowColor,
  backendMessage
}) => {
  const [localPdfUrl, setLocalPdfUrl] = useState<string | null>(pdfUrl || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedForm, setDetectedForm] = useState<string | null>(null);
  const [displayMessage, setDisplayMessage] = useState<string | null>(backendMessage || null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pdfUrl) {
      setLocalPdfUrl(pdfUrl);
    }
  }, [pdfUrl]);

  useEffect(() => {
    if (backendMessage) {
      setDisplayMessage(backendMessage);
    }
  }, [backendMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Form detection logic
  const detectFormFromMessage = (text: string): string | null => {
    const lowerText = text.toLowerCase();
    for (const [formType, config] of Object.entries(FORM_CONFIG)) {
      if (config.keywords.some(keyword => lowerText.includes(keyword))) {
        return formType;
      }
    }
    return null;
  };

  // Handle form button click using API service
  const handleFormButtonClick = async (formType: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const config = FORM_CONFIG[formType as keyof typeof FORM_CONFIG];
      const result = await processAudio(config.backendQuery);
      
      if (result.success && (result.pdf_url || result.pdf_path)) {
        const rawUrl = result.pdf_url || result.pdf_path;
        const fullPdfUrl = rawUrl.startsWith("http")
          ? rawUrl
          : `${BACKEND_BASE_URL}${rawUrl}`;
      
        console.log("📄 PDF URL received:", fullPdfUrl);
      
        setLocalPdfUrl(fullPdfUrl);
        setDisplayMessage(result.message || null);
        setDetectedForm(null);
      } else {
        setError(result.error || 'Form not found');
      }
    } catch (err) {
      console.error('Form request failed:', err);
      setError('Failed to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  // Auto-detect forms from new messages
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === 'user') {
      const messageText = lastMessage.text.trim();
      console.log('Checking message for form request:', messageText);
      
      const detectedFormType = detectFormFromMessage(messageText);
      if (detectedFormType) {
        setDetectedForm(detectedFormType);
        handleFormButtonClick(detectedFormType);
      }
    }
  }, [messages]);

  const renderForm = () => {
    if (detectedForm && !pdfUrl && !loading) {
      const config = FORM_CONFIG[detectedForm];
      return (
        <div className="w-full h-full flex items-center justify-center">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => handleFormButtonClick(detectedForm)}
            className="px-6 py-3 bg-blue-500/80 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
          >
            Open {config.title}
          </motion.button>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-white/80">Loading PDF...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-300 mb-2">❌ {error}</p>
            <p className="text-white/60 text-sm">
              Try asking for: "axis form", "hdfc form", "kyc", "loan application", etc.
            </p>
          </div>
        </div>
      );
    }

    if (localPdfUrl) {
      return <PDFViewer url={localPdfUrl} onClose={() => setLocalPdfUrl(null)} onExpand={() => setIsExpanded(true)} />;
    }

    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-2">🏦 PDF Viewer Ready</p>
          <p className="text-white/40 text-sm">
            Ask for any bank form to view it here
          </p>
        </div>
      </div>
    );
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
    <motion.div
      initial={{ opacity: 0, scale: 0.9, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="glass-border relative w-96 h-[28rem] bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl flex flex-col p-4 min-w-[40rem] min-h-[26rem] text-white"
      style={{
        boxShadow: shadowColor ? `0 0 30px ${shadowColor}` : '0 0 30px rgba(255,255,255,0.2)',
      }}
    >
      {/* Header with close button */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/20">
        <h3 className="text-lg font-semibold text-white">Output Panel</h3>
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="flex-shrink-0 overflow-y-auto p-5 space-y-4 max-h-32">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <ChatMessageBubble key={message.id} message={message} />
          ))}
          {loading && <TypingIndicator />}
        </AnimatePresence>
      </div>

      {/* Backend Message Display */}
      {displayMessage && (
        <div className="mx-4 mb-4">
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-4">
            <div className="text-white text-sm leading-relaxed whitespace-pre-line">
              {displayMessage.replace(/http:\/\/127\.0\.0\.1:\d+/g, '').replace(/localhost:\d+/g, '').trim()}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        {renderForm()}
      </div>
    </motion.div>

    {/* Expanded PDF Modal */}
    <AnimatePresence>
      {isExpanded && localPdfUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsExpanded(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl w-full h-full max-w-6xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">PDF Viewer - Expanded</h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 overflow-hidden">
              <iframe
                src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(localPdfUrl)}`}
                className="w-full h-full border-0"
                title="PDF Viewer - Expanded"
                allow="fullscreen"
                scrolling="yes"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
  );
};

export default OutputChatPanel;
