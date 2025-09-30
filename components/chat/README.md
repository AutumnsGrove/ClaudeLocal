# Chat Components

These components implement the chat interface for ClaudeLocal.

## Components

### ChatInterface.tsx
Main chat container that orchestrates all chat functionality:
- Manages conversation state and message history
- Handles SSE streaming from `/api/chat`
- Creates new conversations when needed
- Integrates model picker and sidebar toggle
- **Props:**
  - `conversationId`: Current conversation ID or null for new chat
  - `onConversationCreated`: Callback when new conversation is created
  - `onToggleSidebar`: Callback to toggle sidebar (mobile)

### MessageList.tsx
Displays the message history with auto-scroll:
- Renders all messages in the conversation
- Auto-scrolls to bottom on new messages
- Shows loading indicator during streaming
- Empty state when no messages exist

### MessageBubble.tsx
Individual message display with markdown rendering:
- Different styling for user vs assistant messages
- Markdown rendering with `react-markdown` and `remark-gfm`
- Syntax highlighting for code blocks using Prism.js
- Copy button for code blocks
- Avatar icons (user/bot)

### MessageInput.tsx
Text input area with auto-expansion:
- Auto-expanding textarea (60px - 200px)
- Send on Enter, Shift+Enter for new line
- Character counter
- File upload button (placeholder)
- Disabled state during streaming

## Usage Example

```tsx
import { ChatInterface } from '@/components/chat';

export default function Page() {
  const [conversationId, setConversationId] = useState<string | null>(null);

  return (
    <ChatInterface
      conversationId={conversationId}
      onConversationCreated={(id) => setConversationId(id)}
      onToggleSidebar={() => console.log('Toggle sidebar')}
    />
  );
}
```

## SSE Streaming Format

The components expect SSE events in this format:

```
data: {"type": "content", "content": "Hello"}
data: {"type": "content", "content": " world"}
data: {"type": "done", "messageId": "msg_123"}
data: [DONE]
```

## Dependencies

- `react-markdown`: Markdown rendering
- `remark-gfm`: GitHub Flavored Markdown support
- `prismjs`: Syntax highlighting
- `lucide-react`: Icons
- Shadcn UI components (Button, Select, Textarea, etc.)

## Features

- ✅ Real-time streaming responses
- ✅ Markdown rendering with code highlighting
- ✅ Auto-expanding input
- ✅ Model selection
- ✅ Message persistence
- ✅ Loading states
- ✅ Error handling
- 🔄 File attachments (placeholder)
