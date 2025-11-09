# Multi-AI Provider System

The browser now supports multiple AI models! You can switch between different AI providers using simple commands.

## Available AI Providers

1. **Phi3 (Local)** - Ollama (Default)
   - Always available if Ollama is running
   - Fast and private
   - No API key required

2. **GPT-4o Mini** - OpenAI
   - Fast and cost-effective
   - Requires OpenAI API key

3. **Claude 3.5 Haiku** - Anthropic
   - Fast and capable
   - Requires Anthropic API key

4. **Gemini 1.5 Flash** - Google
   - Fast multimodal model
   - Requires Google API key

## Setup Instructions

### 1. Add API Keys

Edit the `.env.local` file and add your API keys:

```env
# OpenAI API Key (for GPT models)
VITE_OPENAI_API_KEY=sk-your-actual-openai-key-here

# Anthropic API Key (for Claude models)
VITE_ANTHROPIC_API_KEY=sk-ant-your-actual-anthropic-key-here

# Google API Key (for Gemini models)
VITE_GOOGLE_API_KEY=your-actual-google-key-here
```

### 2. Get API Keys

- **OpenAI**: https://platform.openai.com/api-keys
- **Anthropic**: https://console.anthropic.com/settings/keys
- **Google**: https://makersuite.google.com/app/apikey

### 3. Restart the Browser

After adding API keys, restart the development server:
```bash
npm run dev
```

## How to Switch AI Models

Type any of these commands in the AI chat to switch providers:

### Switch to OpenAI/GPT
- `/ai:openai`
- `/ai:gpt`
- `/ai:chatgpt`

### Switch to Claude
- `/ai:anthropic`
- `/ai:claude`

### Switch to Gemini
- `/ai:gemini`
- `/ai:google`

### Switch to Local Model
- `/ai:ollama`
- `/ai:phi3`
- `/ai:local`

## Usage Example

1. Open AI sidebar by clicking the sparkle ✨ button
2. Type `/ai:gpt` to switch to OpenAI
3. The AI will confirm: "Switched to GPT-4o Mini. How can I help you?"
4. Now all your chats and summaries will use GPT-4o Mini
5. Type `/ai:claude` to switch to Claude, and so on

## Current AI Provider Indicator

The AI sidebar header shows which model is currently active:
- **Icon**: Cpu icon for local (Ollama), Lightning bolt for cloud providers
- **Text**: Shows the provider name (e.g., "Phi3 (Local)", "GPT-4o Mini", "Claude 3.5 Haiku")

## Error Messages

If you try to use a provider without an API key:
```
GPT-4o Mini is not configured. Please add the API key to .env.local or switch to a different provider using /ai:ollama, /ai:gpt, /ai:claude, or /ai:gemini
```

## Default Provider

You can set the default AI provider in `.env.local`:
```env
VITE_DEFAULT_AI_PROVIDER=ollama
```

Options: `ollama`, `openai`, `anthropic`, `gemini`

## Features That Use AI

Both of these features respect your currently selected AI provider:

1. **Summarize Page** - Click the "Summarize Page" button
2. **Chat** - Type messages in the chat input

## Cost Considerations

- **Phi3 (Local)**: Free - runs on your machine
- **GPT-4o Mini**: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- **Claude 3.5 Haiku**: ~$0.25 per 1M input tokens, ~$1.25 per 1M output tokens
- **Gemini 1.5 Flash**: Free tier available, then ~$0.075 per 1M tokens

All cloud models support streaming for real-time responses!
