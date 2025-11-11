# ClaudeLocal - Feature TODOs

> **Last Updated:** 2025-11-11 (Phase 2 Complete)
> **Next Review:** After Phase 3 (UI display components)

---

## 🔥 IMMEDIATE PRIORITIES (Based on User Testing Session)

### 1. Console Error Investigation

- [x] Check browser console for the "1 error" showing in bottom left
- [x] Fix any console errors/warnings (React hydration mismatch)
- [x] Ensure clean console on app load

**Priority**: CRITICAL ✅ COMPLETED
**Effort**: Quick investigation

---

### 2. Thinking Sections - Make Visible

- [x] Display model thinking content in chat messages
- [x] Make thinking sections collapsible/expandable
- [x] Add visual indicator when model is thinking
- [x] Style thinking sections differently from regular content

**Priority**: HIGH - User can see model is thinking but can't view the content ✅ COMPLETED
**Effort**: Medium
**Files**: `components/chat/MessageBubble.tsx`, `app/api/chat/route.ts`, `components/chat/ThinkingSection.tsx`

---

### 3. Remove Deprecated Claude Models

Models to remove:

- [x] Claude 3 Sonnet (deprecated)
- [x] Claude 3.5 Sonnet (both versions - deprecated)
- [x] Claude Opus 3 (deprecated)

Keep only:

- ✅ Claude Sonnet 4.5 (latest)
- ✅ Claude Opus 4.1
- ✅ Claude Opus 4
- ✅ Claude Sonnet 4

**Priority**: HIGH ✅ COMPLETED - Cleanup deprecated models
**Effort**: Low
**Files**: `types/index.ts` (CLAUDE_MODELS array)

---

### 4. Cost Tracking System

#### 4a. Session-Wide Cost Tracker

- [ ] Add cost tracker in top left of UI
- [ ] Track all API usage across current browser session
- [ ] Calculate cost based on:
  - Input tokens
  - Output tokens
  - Cached tokens (90% discount)
  - Model pricing
- [ ] Display running total: `$X.XX spent this session`
- [ ] Persist in localStorage/sessionStorage
- [ ] Reset button or automatic reset on page reload

#### 4b. Per-Chat Cost Tracker

- [ ] Add cost display per conversation
- [ ] Show total cost for entire conversation
- [ ] Calculate from message metadata (tokens + model)
- [ ] Display in conversation header or info panel

**Priority**: HIGH - User wants visibility into API costs
**Effort**: Medium-High
**Dependencies**: Message stats storage (see #5)
**Files**: New cost calculation utilities, message components, database schema

---

### 5. Detailed Message Statistics (LM Studio Style)

#### 5a. Basic Stats (Always Visible)

Display below each assistant message:

- [ ] Tokens per second (e.g., "24.37 tok/sec")
- [ ] Total tokens (e.g., "102 tokens")
- [ ] Time to first token (e.g., "0.46s to first token")
- [ ] Stop reason (e.g., "end_turn", "max_tokens")

#### 5b. Advanced Stats (Behind Lightbulb/Info Icon)

- [ ] Model identifier used
- [ ] Model configuration (JSON):
  - Context length (e.g., 8192)
  - Thread pool size
  - Acceleration settings
  - Other model-specific params
- [ ] Request/response metadata
- [ ] Cache hit information

#### 5c. Database Schema Updates ✅ COMPLETED

- [x] Add `Message` fields:
  - `tokensPerSecond` (float)
  - `totalTokens` (int)
  - `inputTokens` (int)
  - `outputTokens` (int)
  - `cachedTokens` (int)
  - `timeToFirstToken` (float)
  - `stopReason` (string)
  - `modelConfig` (JSON)
  - `cost` (float)
  - `thinkingContent` (string) - BONUS: Added for thinking blocks

#### 5d. API Route Updates ✅ COMPLETED

- [x] Capture streaming metrics during `/api/chat` response
- [x] Calculate tokens/sec from streaming events
- [x] Store all metrics when message is complete
- [x] Calculate and store cost per message
- [x] Capture and store thinking content

**Priority**: HIGH - Rich analytics like LM Studio
**Effort**: HIGH (requires DB changes, API updates, UI components)
**Status**: Phase 2 (Backend) COMPLETED - Phase 3 (UI Display) TODO
**Files**:

- `prisma/schema.prisma` ✅
- `app/api/chat/route.ts` ✅
- `lib/cost-calculator.ts` ✅
- `types/index.ts` ✅
- `components/chat/MessageBubble.tsx` (needs MessageStats display)
- `components/chat/MessageStats.tsx` (new - TODO)

---

### 6. Settings Page Redesign

#### Current Issues:

- ❌ Opens directly to Pricing (not actual settings)
- ❌ Too much information at once (overwhelming)
- ❌ No actual configurable settings (read-only)
- ❌ Doesn't allow changing anything

#### New Structure:

- [ ] **General Tab** (default view)
  - App preferences
  - Default model selection
  - Language/locale
  - Startup behavior

- [ ] **Appearance Tab**
  - Theme toggle (dark/light)
  - Font size slider
  - Code theme selection
  - Message density
  - UI customization

- [ ] **Models & API Tab**
  - API key management
  - Model availability toggle (enable/disable models)
  - Default model per project
  - API timeout settings
  - Rate limiting preferences

- [ ] **Advanced Tab**
  - Default temperature
  - Default max tokens
  - Prompt caching settings
  - Experimental features

- [ ] **Pricing Tab** (move current pricing here)
  - Keep existing comprehensive pricing info
  - Make it one tab among many

**Priority**: HIGH - Core UX improvement
**Effort**: HIGH
**Files**:

- `components/settings/SettingsDialog.tsx`
- New settings components for each tab
- Settings context/state management

---

### 7. Chat Settings Panel (Overflow Right Panel)

Add a right sidebar panel for per-conversation settings:

#### Panel Contents:

- [ ] **System Prompt**
  - Text area for custom system prompt
  - Save per conversation
  - Templates/presets dropdown

- [ ] **Model Parameters** ("Valves")
  - Temperature slider (0-1)
  - Max tokens input
  - Top-p slider
  - Top-k input
  - Frequency penalty
  - Presence penalty

- [ ] **Context Settings**
  - Context window size
  - Message history limit
  - Prompt caching toggle

- [ ] **Advanced**
  - Stop sequences
  - Metadata/tags
  - Custom headers (for future OpenRouter/LMStudio support)

#### UI/UX:

- [ ] Toggle button to show/hide panel
- [ ] Panel slides in from right
- [ ] Sticky position while scrolling
- [ ] Collapsible sections
- [ ] Real-time preview of changes
- [ ] Save button (or auto-save)

**Priority**: HIGH - Essential for multi-provider support (OpenRouter, LM Studio, etc.)
**Effort**: HIGH
**Dependencies**: Settings system, database schema updates
**Files**:

- `components/chat/ChatSettingsPanel.tsx` (new)
- `prisma/schema.prisma` (add fields to Conversation)
- Layout components

---

### 8. Tool Calling Support

_Add to roadmap for future implementation_

Features needed:

- [ ] Define tool/function schemas
- [ ] Pass tools to Claude API
- [ ] Handle tool use responses
- [ ] Execute tools (or prompt user)
- [ ] Return tool results to API
- [ ] Display tool usage in chat
- [ ] Tool library/registry
- [ ] Custom tool creation UI

**Priority**: MEDIUM (Future feature)
**Effort**: VERY HIGH (Complex multi-turn interaction)
**Status**: Added to long-term roadmap (Tier 4)

---

## 📋 HIGH PRIORITY FEATURES

### Response Retry Button

- [ ] Add retry button for failed responses
- [ ] Allow retry with same parameters
- [ ] Show loading state during retry

**Effort**: Low-Medium

---

### Message Interaction Buttons

- [ ] **User Messages**
  - [ ] Edit button (allow inline editing)
  - [ ] Delete button
  - [ ] Copy to clipboard
- [ ] **Assistant Messages**
  - [ ] Regenerate button (retry with same prompt)
  - [ ] Rate response (thumbs up/down)
  - [ ] Fork conversation (branch from this point)
  - [ ] Copy to clipboard

**Effort**: Medium

---

### UI Icon Enhancement

- [ ] Add icons to navigation items
- [ ] Add icons to buttons (send, regenerate, edit, etc.)
- [ ] Add icons to sidebar actions
- [ ] Add icons to settings menu items
- [ ] Use lucide-react consistently

**Effort**: Low - Quick wins

---

## 📦 MEDIUM PRIORITY FEATURES

### Project Management System

- [ ] Create project entity with:
  - [ ] Name and description
  - [ ] Custom instructions (system prompt)
  - [ ] Associated file uploads
  - [ ] Project-specific settings
- [ ] Project selector in conversation view
- [ ] Automatic project context injection
- [ ] Project templates (coding, writing, analysis, etc.)

**Effort**: High

---

### Move Conversations to Projects

- [ ] Add "Move to Project" option in conversation menu
- [ ] Bulk move multiple conversations
- [ ] Filter conversations by project
- [ ] Unassigned conversations view

**Effort**: Medium
**Dependencies**: Project Management System

---

### Conversation Export

- [ ] Export single conversation as Markdown
- [ ] Export format with metadata
- [ ] Export all conversations in project
- [ ] Export as JSON option
- [ ] Export with attachments

**Effort**: Medium

---

## 🔮 LOW PRIORITY / FUTURE IDEAS

### Additional Features

- [ ] Conversation search functionality
- [ ] Tags/labels for conversations
- [ ] Favorite/pin important conversations
- [ ] Conversation templates
- [ ] Share conversation (generate public link)
- [ ] Multi-model comparison (send to multiple models)
- [ ] Voice input/output
- [ ] Image attachments and vision support
- [ ] Code execution sandbox
- [ ] Conversation analytics dashboard

### Performance & Optimization

- [ ] Lazy load old messages
- [ ] Virtual scrolling for long conversations
- [ ] Message pagination
- [ ] Database indexing optimization
- [ ] Cache frequently accessed data

### Accessibility

- [ ] Keyboard navigation improvements
- [ ] Screen reader support
- [ ] High contrast mode
- [ ] Focus indicators
- [ ] ARIA labels

---

## 🔧 TECHNICAL DEBT

- [ ] Add comprehensive error handling
- [ ] Add loading states everywhere
- [ ] Add optimistic updates
- [ ] Implement proper TypeScript types throughout
- [ ] Add unit tests for critical paths
- [ ] Add integration tests for API routes
- [ ] Set up CI/CD pipeline
- [ ] Add database migrations system
- [ ] Implement proper logging system
- [ ] Add performance monitoring

---

## 🎯 IMPLEMENTATION ROADMAP

### Phase 1: Critical Fixes ✅ COMPLETED

1. ✅ Investigate and fix console error (React hydration)
2. ✅ Display thinking sections (collapsible ThinkingSection component)
3. ✅ Remove deprecated models (Claude 3 family)
4. ⏭️ Quick Settings page improvements (deferred to Phase 4)

### Phase 2: Database & Backend ✅ COMPLETED

1. ✅ Database schema updates (10 new fields for statistics + thinking)
2. ✅ API metrics capture (streaming, tokens, cost, thinking)
3. ✅ Cost calculation utility (all Claude 4 models)
4. ✅ TypeScript types updated
5. ✅ ThinkingSection component created and integrated

### Phase 3: UI Display Components (NEXT)

1. Create MessageStats component to display metrics
2. Implement cost tracking (session + per-chat)
3. Add stats display to MessageBubble
4. Build session cost tracker (top-left UI)

### Phase 4: Settings & Advanced Features (Future)

1. Complete Settings page redesign
2. Build chat settings right panel
3. Multi-provider support preparation

### Phase 5: UX Polish (Future)

1. Message interaction buttons (edit, delete, copy, regenerate)
2. Response retry functionality
3. UI icons throughout
4. Enhanced error handling

### Phase 6: Advanced Features (Future)

1. Project management system
2. Conversation export
3. Tool calling support (research phase)
4. Multi-provider support (OpenRouter, LM Studio)

### Phase 7: Infrastructure (Ongoing)

1. Testing framework
2. CI/CD pipeline
3. Performance optimization
4. Accessibility improvements

---

## ✅ RECENTLY COMPLETED FEATURES

### Completed in Recent PRs

1. **PR #4** - Toast notifications, hydration fixes, message UX improvements
2. **PR #3** - Automatic conversation title generation
3. **PR #2** - SSE streaming response alignment
4. **PR #1** - Missing messages API route and error handling
5. **Earlier** - Claude 4 models support with prompt caching (90% cost reduction)
6. **Earlier** - OpenRouter API integration for live pricing data
7. **Earlier** - Comprehensive pricing panel in Settings

---

## 📝 NOTES

- Features are prioritized based on user testing feedback (2025-11-11)
- Focus on making ClaudeLocal production-ready for personal use
- Long-term goal: Support multiple providers (Anthropic, OpenRouter, LM Studio, Kimi K2, etc.)
- Keep UX clean and performant
- Maintain feature parity with Claude Desktop while adding advanced features
