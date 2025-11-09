# Testing Guide for Agentic Browser

## Quick Start

The browser is now running in development mode with all Phase 1 features implemented!

## What's Working

### ✅ Core Browser Functionality
- **WebView Integration**: Actual web pages load using Electron's webview tag
- **URL Navigation**: Type URLs or search queries in the address bar
  - Valid URLs (with or without protocol) are loaded directly
  - Text without dots/domains is treated as DuckDuckGo search
  - Press Enter to navigate
- **Navigation Controls**:
  - Back/Forward buttons (enabled when available)
  - Refresh button (with spinning animation when loading)
  - Home button (navigates to DuckDuckGo)

### ✅ AI Integration (Ollama + Phi3)
- **AI Sidebar**: Toggle with the sparkle ✨ button
- **Page Summarization**: Click "Summarize Page" button to get AI summary of current page
- **Chat with Context**: Ask questions about the current page
- **Streaming Responses**: See AI responses appear in real-time

### ✅ UI/UX Features
- **Tab Management**: Create, switch, and close tabs
- **Loading Indicators**: Spinning refresh icon while pages load
- **Secure URL Indicators**: Green lock for HTTPS, yellow unlock for HTTP
- **Dark Theme**: Modern, clean interface matching your original design
- **Window Controls**: Minimize, maximize, close buttons in top-right

## Testing Instructions

### 1. Test Navigation
```
Try these URLs in the address bar:
- google.com
- https://github.com
- localhost:11434 (if you have local services)
- Just type "weather" - it will search on DuckDuckGo
```

### 2. Test AI Features

**Prerequisites**: Make sure Ollama is running with phi3 model
```bash
# In a separate terminal:
ollama run phi3
# Or just make sure Ollama service is running
```

**Test Steps**:
1. Navigate to any website (e.g., wikipedia.org)
2. Wait for page to load
3. Click the sparkle ✨ button to open AI sidebar
4. Click "Summarize Page" - you should see Phi3 generate a summary
5. Ask a question like "What is this page about?"
6. The AI should respond with context from the current page

### 3. Test Browser Controls
- Click the back/forward buttons after navigating to multiple pages
- Try the refresh button while on a page
- Click home button to return to DuckDuckGo
- Try creating new tabs with the + button
- Close tabs (note: last tab will create a new one)

## Troubleshooting

### If webview doesn't load pages:
- Check browser console (Ctrl+Shift+I in Electron window)
- Look for CORS or security errors
- Make sure `webviewTag: true` is set in electron/main.ts

### If AI doesn't respond:
1. Check Ollama is running: `curl http://localhost:11434/api/tags`
2. Make sure phi3 model is installed: `ollama list`
3. If not installed: `ollama pull phi3`
4. Check browser console for network errors
5. Verify the Ollama URL in `src/services/ollama.ts` (should be `http://localhost:11434`)

### If layout is broken:
- Check for console errors
- Try refreshing the Electron window
- Restart the dev server

## Architecture Overview

### Component Structure
```
src/
├── components/
│   ├── TabBar.tsx           # Tab management UI
│   ├── NavigationBar.tsx    # Address bar + nav buttons
│   ├── WebView.tsx          # Electron webview wrapper
│   └── AISidebar.tsx        # AI chat interface
├── services/
│   └── ollama.ts            # Ollama API integration
├── utils/
│   └── urlUtils.ts          # URL validation & processing
├── types/
│   ├── index.ts             # TypeScript interfaces
│   └── webview.d.ts         # Webview type declarations
└── App.tsx                  # Main application orchestrator
```

### Data Flow
1. User types URL → NavigationBar processes it → App.tsx updates state
2. App.tsx calls WebView.loadURL() → Electron loads page
3. Page loads → WebView emits events → App updates state & extracts content
4. User clicks AI button → AISidebar sends content to Ollama
5. Ollama streams response → AISidebar displays in real-time

## Next Steps (Future Phases)

- [ ] Add history/bookmarks storage with SQLite
- [ ] Implement download manager
- [ ] Add settings panel
- [ ] Improve page content extraction (handle frames, dynamic content)
- [ ] Add DOM automation (click, fill forms)
- [ ] Implement keyboard shortcuts
- [ ] Add progress bar for page loading
- [ ] Multi-tab support (currently single webview for all tabs)

## Known Limitations

1. **Single WebView**: Currently only one webview exists; switching tabs doesn't preserve webview state
2. **No Persistence**: Tabs, history, and bookmarks are lost on restart
3. **Basic Content Extraction**: Only extracts visible text, not structured data
4. **No Download UI**: Downloads happen but no UI to track them

## Development Commands

```bash
# Start dev server (already running)
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

Enjoy your AI-powered browser! 🚀
