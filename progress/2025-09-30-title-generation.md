# Title Generation Feature - Progress Log
**Date:** 2025-09-30
**Branch:** `feature/auto-generate-titles`
**PR:** #3

## ✅ Completed

### Core Functionality
- [x] Created `lib/generate-title.ts` utility function for reusable title generation
- [x] Added `/api/conversations/[id]/generate-title` endpoint
- [x] Integrated title generation trigger in `/api/chat` route after first message exchange
- [x] Using Claude 3 Haiku (cheapest model at $0.25/$1.25 per million tokens)
- [x] Title generation produces 3-6 word concise, descriptive titles
- [x] Titles are being generated and saved to database successfully

### Bug Fixes
- [x] Fixed streaming response format mismatch (SSE events)
- [x] Fixed user message disappearing on submit (skipNextFetch flag)
- [x] Fixed title not auto-updating in sidebar (useEffect sync in ConversationItem)
- [x] Removed custom title check - now ALWAYS generates titles
- [x] Fixed truncation mismatch (50 vs 100 chars)
- [x] Expanded sidebar title preview to 2 lines (line-clamp-2)

## 🐛 Known Issues

### Critical Issue: UI Not Auto-Refreshing After Title Generation
**Status:** Title generates and saves to DB, but sidebar doesn't update without manual refresh (F5)

**What Works:**
- ✅ Title generation function executes successfully
- ✅ Anthropic API called with Claude 3 Haiku
- ✅ Database updated with generated title
- ✅ Logs show: `[generateTitle] Title generation complete!`
- ✅ Database query confirms title is updated
- ✅ Manual page refresh (F5) shows the correct title

**What Doesn't Work:**
- ❌ Sidebar doesn't automatically update after the 3-second delay
- ❌ `onConversationUpdated()` callback fires and fetches new data
- ❌ React state updates with new conversation data
- ❌ But ConversationItem component doesn't re-render with new title

**Investigation:**
- Browser console shows all callbacks firing correctly:
  - `[ChatInterface] First message complete, scheduling title refresh...`
  - `[ChatInterface] Refreshing conversation list for title update`
  - `[Page] loadConversations called`
  - `[Page] Loaded conversations: X`
- Server logs show title UPDATE query executing
- React DevTools would show state has new title, but component doesn't reflect it

**Likely Cause:**
The ConversationItem component has a `useEffect` that syncs `conversation.title` to local state, but React might not be detecting the change properly. Possible issues:
1. Object reference equality - conversations array might need a deep clone
2. Timing issue - title updates before the 3-second callback
3. React batching updates incorrectly
4. State mutation instead of immutable update

## 📝 Solution Ideas

### Option 1: Force Re-render with Key
Add a timestamp or version to force React to treat it as a new component:
```tsx
<ConversationItem
  key={`${conv.id}-${conv.updatedAt}`}  // Force new component on update
  conversation={conv}
  ...
/>
```

### Option 2: Remove Local State
Don't cache title in ConversationItem, always read from prop:
```tsx
// Remove: const [newTitle, setNewTitle] = useState(conversation.title);
// Just use: conversation.title directly
```

### Option 3: Immutable State Updates
Ensure parent component creates NEW array/object references:
```tsx
setConversations([...data]);  // Create new array reference
```

### Option 4: WebSocket or Polling
Real-time updates instead of timeout-based refresh

### Option 5: Optimistic UI Update
Update sidebar title immediately, confirm with API later

## 📊 Database Schema
```sql
Conversation {
  id: string
  title: string  ← Updated by title generation
  model: string
  temperature: float
  maxTokens: int
  createdAt: datetime
  updatedAt: datetime  ← Also updated
  archived: boolean
}
```

## 🔧 Files Modified

### New Files
- `lib/generate-title.ts` - Core title generation logic
- `app/api/conversations/[id]/generate-title/route.ts` - API endpoint
- `TODOS.md` - Feature roadmap
- `RESTART.md` - Server restart commands

### Modified Files
- `app/api/chat/route.ts` - Triggers title generation after first exchange
- `app/page.tsx` - Added onConversationUpdated callback
- `components/chat/ChatInterface.tsx` - Calls callback after streaming
- `components/sidebar/ConversationItem.tsx` - Added useEffect to sync title
- `lib/pricing.ts` - Added getCheapestModel() function

## 🧪 Testing

### Manual Test Steps
1. Create new conversation
2. Send any message (even "hello")
3. Wait for response to complete
4. **Expected:** After 3 seconds, sidebar title updates automatically
5. **Actual:** Title only updates after manual page refresh (F5)

### Debug Logs Show
```
[ChatInterface] Sending message, isFirstMessage: true current message count: 0
[ChatInterface] First message complete, scheduling title refresh...
[ChatInterface] Refreshing conversation list for title update
[Page] loadConversations called
[Page] Loaded conversations: 14
[generateTitle] Starting title generation for conversation: xxx
[generateTitle] Current title: how large is the earth, compared to the scale of a
[generateTitle] Message count: 2
[generateTitle] Calling Anthropic API for title generation...
[generateTitle] Generated title: Earth vs. Windows 10 Scale Comparison
[generateTitle] Updating database with new title...
[generateTitle] Title generation complete!
```

## 📈 Next Steps

1. **Fix UI auto-refresh issue** - Highest priority
2. Remove all debug console.log statements
3. Final testing with various prompts
4. Update PR description with final implementation details
5. Merge to master

## 💡 Additional Features to Consider (Future)

- Regenerate title button (manual trigger)
- Edit title inline without dropdown
- Show "generating title..." indicator
- Cache generated titles to avoid regeneration
- Support for multi-language title generation
- Title generation for existing conversations (batch job)

## 📚 Resources

- Anthropic API Docs: https://docs.anthropic.com/
- Claude 3 Haiku Pricing: $0.25 input / $1.25 output per MTok
- React useEffect Docs: https://react.dev/reference/react/useEffect
- Next.js 15 SSE Streaming: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

---
**Last Updated:** 2025-09-30 21:30 UTC
**Status:** 95% Complete - Only UI refresh issue remaining
