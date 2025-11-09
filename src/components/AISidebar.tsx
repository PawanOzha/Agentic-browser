import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Loader2, Cpu, Zap } from 'lucide-react';
import { AIMessage } from '../types';
import * as aiProvider from '../services/aiProvider';
import type { AIProvider } from '../services/aiProvider';

interface AISidebarProps {
  isOpen: boolean;
  onClose: () => void;
  pageTitle: string;
  pageContent: string;
  currentURL: string;
  onExtractContent: () => Promise<string>;
}

export default function AISidebar({ isOpen, onClose, pageTitle, pageContent, currentURL, onExtractContent }: AISidebarProps) {
  const [currentProvider, setCurrentProvider] = useState<AIProvider>(() => aiProvider.getDefaultProvider());
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      role: 'assistant',
      content: `Hi! I'm your AI assistant powered by ${aiProvider.getProviderDisplayName(aiProvider.getDefaultProvider())}. I can help you understand this page, answer questions, or assist with your browsing. Type /ai:gpt, /ai:claude, or /ai:gemini to switch models.`,
      timestamp: Date.now(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const handleSummarizePage = async () => {
    if (isLoading) return;

    // Check if provider is available
    if (!aiProvider.isProviderAvailable(currentProvider)) {
      const errorMsg: AIMessage = {
        role: 'assistant',
        content: `${aiProvider.getProviderDisplayName(currentProvider)} is not configured. Please add the API key to .env.local or switch to a different provider using /ai:ollama, /ai:gpt, /ai:claude, or /ai:gemini`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      return;
    }

    setIsLoading(true);
    setStreamingContent('');

    const userMsg: AIMessage = {
      role: 'user',
      content: 'Can you summarize this page for me?',
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      // Extract content with visual highlight
      const content = await onExtractContent();

      if (!content) {
        throw new Error('No content to summarize');
      }

      let fullResponse = '';
      const response = await aiProvider.summarizePage(
        currentProvider,
        content,
        pageTitle,
        (chunk) => {
          fullResponse += chunk;
          setStreamingContent(fullResponse);
        }
      );

      const assistantMsg: AIMessage = {
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setStreamingContent('');
    } catch (error) {
      console.error('Summarization error:', error);
      const errorMsg: AIMessage = {
        role: 'assistant',
        content: getErrorMessage(currentProvider, error),
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setStreamingContent('');
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (provider: AIProvider, error: any): string => {
    const errorStr = error?.message || String(error);

    if (provider === 'ollama') {
      return 'Sorry, I encountered an error. Please make sure Ollama is running with the phi3 model at http://localhost:11434';
    }

    if (errorStr.includes('API key')) {
      return `API key error for ${aiProvider.getProviderDisplayName(provider)}. Please check your .env.local file.`;
    }

    return `Sorry, I encountered an error with ${aiProvider.getProviderDisplayName(provider)}: ${errorStr}`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Check if this is an AI provider switch command
    const detectedProvider = aiProvider.detectProviderFromCommand(inputMessage);
    if (detectedProvider) {
      if (!aiProvider.isProviderAvailable(detectedProvider)) {
        const errorMsg: AIMessage = {
          role: 'assistant',
          content: `${aiProvider.getProviderDisplayName(detectedProvider)} is not available. Please add the API key to .env.local`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMsg]);
        setInputMessage('');
        return;
      }

      setCurrentProvider(detectedProvider);
      const confirmMsg: AIMessage = {
        role: 'assistant',
        content: `Switched to ${aiProvider.getProviderDisplayName(detectedProvider)}. How can I help you?`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, confirmMsg]);
      setInputMessage('');
      return;
    }

    // Check if provider is available
    if (!aiProvider.isProviderAvailable(currentProvider)) {
      const errorMsg: AIMessage = {
        role: 'assistant',
        content: `${aiProvider.getProviderDisplayName(currentProvider)} is not configured. Please add the API key to .env.local or switch to a different provider using /ai:ollama, /ai:gpt, /ai:claude, or /ai:gemini`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setInputMessage('');
      return;
    }

    const userMsg: AIMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);
    setStreamingContent('');

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));

      let fullResponse = '';
      const response = await aiProvider.chat(
        currentProvider,
        userMsg.content,
        conversationHistory,
        pageContent ? { title: pageTitle, content: pageContent } : undefined,
        (chunk) => {
          fullResponse += chunk;
          setStreamingContent(fullResponse);
        }
      );

      const assistantMsg: AIMessage = {
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setStreamingContent('');
    } catch (error) {
      const errorMsg: AIMessage = {
        role: 'assistant',
        content: getErrorMessage(currentProvider, error),
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setStreamingContent('');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 flex flex-col" style={{ backgroundColor: '#232321', borderLeft: '1px solid #3c3c3c' }}>
      {/* Sidebar Header */}
      <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid #3c3c3c' }}>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            {currentProvider === 'ollama' ? (
              <Cpu className="w-4 h-4 text-white" />
            ) : (
              <Zap className="w-4 h-4 text-white" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Assistant</h3>
            <p className="text-xs text-gray-400">{aiProvider.getProviderDisplayName(currentProvider)}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-gray-400 hover:text-gray-200"
          style={{ backgroundColor: 'transparent' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3c3c3c')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Actions */}
      {pageContent && currentURL !== 'about:blank' && (
        <div className="p-4" style={{ borderBottom: '1px solid #3c3c3c' }}>
          <button
            onClick={handleSummarizePage}
            disabled={isLoading}
            className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Summarizing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Summarize Page
              </>
            )}
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-xl px-4 py-2.5 ${
                msg.role === 'user' ? 'bg-blue-600 text-white' : 'text-gray-200'
              }`}
              style={msg.role === 'assistant' ? { backgroundColor: '#2d2d2b' } : {}}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {streamingContent && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-xl px-4 py-2.5 text-gray-200" style={{ backgroundColor: '#2d2d2b' }}>
              <p className="text-sm whitespace-pre-wrap">{streamingContent}</p>
              <Loader2 className="w-4 h-4 animate-spin mt-2 text-blue-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4" style={{ borderTop: '1px solid #3c3c3c' }}>
        <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ backgroundColor: '#2d2d2b' }}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm text-gray-200 outline-none placeholder-gray-500 disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="p-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">AI can make mistakes. Verify important info.</p>
      </div>
    </div>
  );
}
