import React, { useState, KeyboardEvent, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, Star, MoreVertical, Lock, Sparkles, Menu, Unlock } from 'lucide-react';
import { processInput, isSecureURL } from '../utils/urlUtils';

interface NavigationBarProps {
  url: string;
  canGoBack: boolean;
  canGoForward: boolean;
  isLoading: boolean;
  aiSidebarOpen: boolean;
  onNavigate: (url: string) => void;
  onBack: () => void;
  onForward: () => void;
  onRefresh: () => void;
  onHome: () => void;
  onToggleAI: () => void;
}

export default function NavigationBar({
  url,
  canGoBack,
  canGoForward,
  isLoading,
  aiSidebarOpen,
  onNavigate,
  onBack,
  onForward,
  onRefresh,
  onHome,
  onToggleAI,
}: NavigationBarProps) {
  const [inputValue, setInputValue] = useState(url);
  const [isFocused, setIsFocused] = useState(false);

  // Update input value when URL changes (from navigation, not user input)
  useEffect(() => {
    if (!isFocused) {
      setInputValue(url);
    }
  }, [url, isFocused]);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const processedURL = processInput(inputValue);
      onNavigate(processedURL);
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setInputValue(url);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setInputValue(url);
  };

  const isSecure = isSecureURL(url);

  return (
    <div className="flex items-center gap-2 px-3 py-3">
      <div className="flex items-center gap-1">
        <button
          onClick={onBack}
          disabled={!canGoBack}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'transparent' }}
          onMouseEnter={(e) => canGoBack && (e.currentTarget.style.backgroundColor = '#3c3c3c')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={onForward}
          disabled={!canGoForward}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'transparent' }}
          onMouseEnter={(e) => canGoForward && (e.currentTarget.style.backgroundColor = '#3c3c3c')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <button
          onClick={onRefresh}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-200 transition-colors"
          style={{ backgroundColor: 'transparent' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3c3c3c')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <RotateCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
        <button
          onClick={onHome}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-200 transition-colors"
          style={{ backgroundColor: 'transparent' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3c3c3c')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Home className="w-5 h-5" />
        </button>
      </div>

      <div
        className="flex-1 flex items-center rounded-lg px-4 py-2.5 transition-colors"
        style={{
          backgroundColor: '#2d2d2b',
          border: `1px solid ${isFocused ? '#1a73e8' : '#3c3c3c'}`,
        }}
      >
        {isSecure ? (
          <Lock className="w-4 h-4 text-green-400 mr-3" />
        ) : (
          <Unlock className="w-4 h-4 text-yellow-400 mr-3" />
        )}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="flex-1 bg-transparent text-gray-200 text-sm outline-none"
          placeholder="Search or enter address"
        />
        <Star className="w-4 h-4 text-gray-500 hover:text-yellow-400 cursor-pointer ml-2" />
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onToggleAI}
          className="p-2 rounded-lg transition-colors"
          style={{
            backgroundColor: aiSidebarOpen ? '#1a73e8' : 'transparent',
            color: aiSidebarOpen ? 'white' : '#9ca3af',
          }}
          onMouseEnter={(e) => !aiSidebarOpen && (e.currentTarget.style.backgroundColor = '#3c3c3c')}
          onMouseLeave={(e) => !aiSidebarOpen && (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Sparkles className="w-5 h-5" />
        </button>
        <button
          className="p-2 rounded-lg text-gray-400 hover:text-gray-200 transition-colors"
          style={{ backgroundColor: 'transparent' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3c3c3c')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <MoreVertical className="w-5 h-5" />
        </button>
        <button
          className="p-2 rounded-lg text-gray-400 hover:text-gray-200 transition-colors"
          style={{ backgroundColor: 'transparent' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3c3c3c')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
