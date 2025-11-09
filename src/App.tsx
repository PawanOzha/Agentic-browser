import React, { useState, useRef } from 'react';
import TabBar from './components/TabBar';
import NavigationBar from './components/NavigationBar';
import WebView from './components/WebView';
import AISidebar from './components/AISidebar';
import { Tab, WebViewRef } from './types';

const HOME_URL = 'https://duckduckgo.com';

export default function ModernBrowser() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 1, title: 'New Tab', url: 'about:blank', active: true, isLoading: false, canGoBack: false, canGoForward: false },
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [nextTabId, setNextTabId] = useState(2);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false); // Start with sidebar closed
  const [pageContent, setPageContent] = useState('');
  const [pageTitle, setPageTitle] = useState('New Tab');
  const [currentURL, setCurrentURL] = useState('about:blank');

  const webviewRef = useRef<WebViewRef>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId);

  const addNewTab = () => {
    const newTab: Tab = {
      id: nextTabId,
      title: 'New Tab',
      url: 'about:blank',
      active: false,
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
    };
    setTabs([...tabs, newTab]);
    setNextTabId(nextTabId + 1);
    switchTab(newTab.id);
  };

  const closeTab = (tabId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTabs = tabs.filter((tab) => tab.id !== tabId);

    if (newTabs.length === 0) {
      const newTab: Tab = {
        id: nextTabId,
        title: 'New Tab',
        url: 'about:blank',
        active: true,
        isLoading: false,
        canGoBack: false,
        canGoForward: false,
      };
      setTabs([newTab]);
      setNextTabId(nextTabId + 1);
      setActiveTabId(newTab.id);
      setCurrentURL(newTab.url);
    } else {
      setTabs(newTabs);
      if (tabId === activeTabId) {
        const currentIndex = tabs.findIndex((t) => t.id === tabId);
        const nextTab = newTabs[currentIndex] || newTabs[currentIndex - 1];
        switchTab(nextTab.id);
      }
    }
  };

  const switchTab = (tabId: number) => {
    setActiveTabId(tabId);
    const tab = tabs.find((t) => t.id === tabId);
    if (tab) {
      setCurrentURL(tab.url);
      setPageTitle(tab.title);
    }
  };

  const updateTab = (tabId: number, updates: Partial<Tab>) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => (tab.id === tabId ? { ...tab, ...updates } : tab))
    );
  };

  const handleNavigate = (url: string) => {
    // Just update state - WebView's useEffect will handle the actual loading
    setCurrentURL(url);
    updateTab(activeTabId, { url, isLoading: true });
  };

  const handleLoadStart = () => {
    updateTab(activeTabId, { isLoading: true });
  };

  const handleLoadStop = () => {
    updateTab(activeTabId, { isLoading: false });
    extractPageContent();
  };

  const handleTitleUpdate = (title: string) => {
    setPageTitle(title);
    updateTab(activeTabId, { title });
  };

  const handleURLUpdate = (url: string) => {
    // Only update if URL actually changed to prevent re-renders
    if (url !== currentURL) {
      setCurrentURL(url);
      updateTab(activeTabId, { url });
    }
  };

  const handleNavigationStateChange = (canGoBack: boolean, canGoForward: boolean) => {
    updateTab(activeTabId, { canGoBack, canGoForward });
  };

  const extractPageContent = async (showHighlight = false) => {
    try {
      if (webviewRef.current) {
        // If showing highlight, inject visual feedback
        if (showHighlight) {
          await webviewRef.current.executeJavaScript(`
            (function() {
              // Remove any existing highlight
              const existing = document.getElementById('ai-reading-overlay');
              if (existing) existing.remove();

              // Create highlight overlay
              const overlay = document.createElement('div');
              overlay.id = 'ai-reading-overlay';
              overlay.style.cssText = \`
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(180deg,
                  rgba(255, 235, 59, 0.15) 0%,
                  rgba(255, 235, 59, 0.05) 50%,
                  rgba(255, 235, 59, 0.15) 100%);
                pointer-events: none;
                z-index: 999999;
                animation: aiScanAnimation 2s ease-in-out;
              \`;

              // Add keyframe animation
              const style = document.createElement('style');
              style.textContent = \`
                @keyframes aiScanAnimation {
                  0% {
                    background-position: 0% 0%;
                    opacity: 0;
                  }
                  10% { opacity: 1; }
                  90% { opacity: 1; }
                  100% {
                    background-position: 0% 100%;
                    opacity: 0;
                  }
                }
              \`;
              document.head.appendChild(style);
              document.body.appendChild(overlay);

              // Remove after animation
              setTimeout(() => {
                overlay.remove();
                style.remove();
              }, 2000);
            })()
          `);
        }

        const content = await webviewRef.current.executeJavaScript(`
          (function() {
            // Remove script and style tags
            const clone = document.body.cloneNode(true);
            const scripts = clone.querySelectorAll('script, style, noscript');
            scripts.forEach(el => el.remove());

            // Get visible text content
            return clone.innerText || clone.textContent || '';
          })()
        `);
        setPageContent(content || '');
        return content;
      }
    } catch (error) {
      console.error('Failed to extract page content:', error);
      setPageContent('');
    }
    return '';
  };

  const handleBack = () => {
    webviewRef.current?.goBack();
  };

  const handleForward = () => {
    webviewRef.current?.goForward();
  };

  const handleRefresh = () => {
    webviewRef.current?.reload();
  };

  const handleHome = () => {
    handleNavigate(HOME_URL);
  };

  return (
    <>
      <style>{`
        /* Custom Scrollbar Styles */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4a4a48;
          border-radius: 4px;
          transition: background 0.2s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #5a5a58;
        }

        .custom-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }

        .custom-scrollbar {
          scroll-behavior: smooth;
          scrollbar-width: thin;
          scrollbar-color: #4a4a48 transparent;
        }

        .browser-tab {
          position: relative;
          transition: background-color 0.15s ease;
        }

        .browser-tab:hover {
          background-color: #3c3c3c !important;
        }

        .browser-tab::after {
          content: '';
          position: absolute;
          right: 0;
          top: 8px;
          bottom: 8px;
          width: 1px;
          background: #3c3c3c;
        }

        .browser-tab:last-child::after {
          display: none;
        }

        .drag-region {
          -webkit-app-region: drag;
        }

        .no-drag {
          -webkit-app-region: no-drag;
        }

        /* WebView container */
        webview {
          display: inline-flex;
          width: 100%;
          height: 100%;
        }
      `}</style>

      <div className="h-screen w-full flex flex-col overflow-hidden" style={{ backgroundColor: '#141413' }}>
        {/* Browser Chrome */}
        <div style={{ backgroundColor: '#232321', borderBottom: '1px solid #3c3c3c' }}>
          {/* Tab Bar */}
          <TabBar
            tabs={tabs}
            activeTabId={activeTabId}
            onTabSwitch={switchTab}
            onTabClose={closeTab}
            onNewTab={addNewTab}
          />

          {/* Navigation Bar */}
          <NavigationBar
            url={currentURL}
            canGoBack={activeTab?.canGoBack || false}
            canGoForward={activeTab?.canGoForward || false}
            isLoading={activeTab?.isLoading || false}
            aiSidebarOpen={aiSidebarOpen}
            onNavigate={handleNavigate}
            onBack={handleBack}
            onForward={handleForward}
            onRefresh={handleRefresh}
            onHome={handleHome}
            onToggleAI={() => setAiSidebarOpen(!aiSidebarOpen)}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Web Content */}
          <div className="flex-1 overflow-hidden" style={{ backgroundColor: '#1f1f1f' }}>
            <WebView
              ref={webviewRef}
              url={currentURL}
              onLoadStart={handleLoadStart}
              onLoadStop={handleLoadStop}
              onTitleUpdate={handleTitleUpdate}
              onURLUpdate={handleURLUpdate}
              onNavigationStateChange={handleNavigationStateChange}
            />
          </div>

          {/* AI Sidebar */}
          <AISidebar
            isOpen={aiSidebarOpen}
            onClose={() => setAiSidebarOpen(false)}
            pageTitle={pageTitle}
            pageContent={pageContent}
            currentURL={currentURL}
            onExtractContent={() => extractPageContent(true)}
          />
        </div>
      </div>
    </>
  );
}
