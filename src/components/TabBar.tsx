import React from 'react';
import { Lock, X, Plus } from 'lucide-react';
import { Tab } from '../types';

interface TabBarProps {
  tabs: Tab[];
  activeTabId: number;
  onTabSwitch: (tabId: number) => void;
  onTabClose: (tabId: number, e: React.MouseEvent) => void;
  onNewTab: () => void;
}

export default function TabBar({ tabs, activeTabId, onTabSwitch, onTabClose, onNewTab }: TabBarProps) {
  const getTabWidth = () => {
    const minWidth = 120;
    const maxWidth = 240;
    const availableWidth = window.innerWidth - 300;
    const calculatedWidth = Math.floor(availableWidth / tabs.length);
    return Math.max(minWidth, Math.min(maxWidth, calculatedWidth));
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center flex-1 overflow-x-auto custom-scrollbar no-drag" style={{ maxWidth: 'calc(100% - 200px)' }}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => onTabSwitch(tab.id)}
            className="browser-tab flex items-center px-4 py-2.5 cursor-pointer group"
            style={{
              backgroundColor: tab.id === activeTabId ? '#2d2d2b' : 'transparent',
              borderTop: tab.id === activeTabId ? '2px solid #1a73e8' : '2px solid transparent',
              width: `${getTabWidth()}px`,
              minWidth: '120px',
              maxWidth: '240px',
            }}
          >
            <Lock className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-300 truncate flex-1">{tab.title}</span>
            <button
              onClick={(e) => onTabClose(tab.id, e)}
              className="ml-2 p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-700 transition-opacity flex-shrink-0"
            >
              <X className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        ))}
        <button
          onClick={onNewTab}
          className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg mx-1 transition-colors no-drag flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="drag-region flex-shrink-0" style={{ width: '80px', height: '40px' }}></div>

      <div className="flex items-center gap-1 pr-2 no-drag flex-shrink-0">
        <button
          onClick={() => window.windowControls?.minimize()}
          className="p-2 rounded text-gray-400 hover:text-gray-200 transition-colors"
          style={{ backgroundColor: 'transparent' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3c3c3c')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <button
          onClick={() => window.windowControls?.maximize()}
          className="p-2 rounded text-gray-400 hover:text-gray-200 transition-colors"
          style={{ backgroundColor: 'transparent' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3c3c3c')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="4" y="4" width="16" height="16" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={() => window.windowControls?.close()}
          className="p-2 rounded text-gray-400 hover:text-white transition-colors"
          style={{ backgroundColor: 'transparent' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
