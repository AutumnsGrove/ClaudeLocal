# ClaudeLocal - Feature TODOs

## High Priority

### 0. UI/UX Improvements
- [ ] Add select button/interface for selecting multiple chats
- [ ] Add on-hover extra info button about the current chat selected in the right pane
- [x] Fix menu collapsing functionality (doesn't actually work)
**Status**: Completed - Fixed in PR #4 with hydration improvements
- [x] Improve message UX with better error handling
**Status**: Completed in PR #1 - Added comprehensive chat error handling
- [x] Add automatic conversation title generation
**Status**: Completed in PR #3 - Generates titles using cheapest model

### 1. Response Retry Button
- [ ] Add retry button for failed responses
- [ ] Allow retry with same parameters
- [ ] Show loading state during retry

### 2. Message Interaction Buttons
- [ ] **User Messages**
  - [ ] Edit button (allow inline editing)
  - [ ] Delete button
  - [ ] Copy to clipboard
- [ ] **Assistant Messages**
  - [ ] Regenerate button (retry with same prompt)
  - [ ] Rate response (thumbs up/down)
  - [ ] Fork conversation (branch from this point)
  - [ ] Copy to clipboard

### 3. Dark Mode Fix
- [x] Debug why dark mode toggle doesn't work
- [x] Ensure all components respect theme
- [x] Test persistence across page reloads
**Status**: Completed in PR #4 - Fixed hydration issues and ToastProvider

### 4. UI Icon Enhancement
- [ ] Add icons to navigation items
- [ ] Add icons to buttons (send, regenerate, edit, etc.)
- [ ] Add icons to sidebar actions
- [ ] Add icons to settings menu items
- [ ] Use lucide-react or similar icon library consistently

## Medium Priority

### 5. Enhanced Settings Menu
Current settings are too basic. Expand to include:
- [ ] **Model Settings**
  - [ ] Temperature slider (0-1)
  - [ ] Max tokens input
  - [ ] Top-p/Top-k controls
  - [ ] Frequency/presence penalty
- [ ] **Interface Settings**
  - [ ] Font size adjustment
  - [ ] Code theme selection
  - [ ] Message density (compact/comfortable/spacious)
  - [ ] Markdown rendering options
- [ ] **API Settings**
  - [ ] API key management (add/remove/test)
  - [ ] Default model selection
  - [ ] Rate limiting preferences
  - [ ] Timeout settings
- [ ] **Privacy Settings**
  - [ ] Local storage management
  - [ ] Data retention policies
  - [ ] Export/import settings
- [ ] **Keyboard Shortcuts**
  - [ ] View shortcut reference
  - [ ] Customize shortcuts
- [ ] **About Section**
  - [ ] Version information
  - [ ] Model capabilities
  - [ ] Links to documentation

### 6. Simplified Pricing Panel
- [x] Remove persistent "90% reduction" rate from every row (mention once at top)
- [x] Consolidate pricing display
- [x] Make pricing table more scannable
- [x] Add "Why prompt caching?" explanation section
- [x] Highlight cheapest/recommended models
**Status**: Completed - Comprehensive pricing panel added with OpenRouter API integration and fallback

### 7. Project Management System
- [ ] Create project entity with:
  - [ ] Name and description
  - [ ] Custom instructions (system prompt)
  - [ ] Associated file uploads
  - [ ] Project-specific settings
- [ ] Project selector in conversation view
- [ ] Automatic project context injection
- [ ] Project templates (coding, writing, analysis, etc.)

### 8. Move Conversations to Projects
- [ ] Add "Move to Project" option in conversation menu
- [ ] Bulk move multiple conversations
- [ ] Filter conversations by project
- [ ] Unassigned conversations view

### 9. Conversation Export
- [ ] Export single conversation as Markdown
- [ ] Export format:
  ```markdown
  # Conversation Title

  **Model:** Claude Sonnet 4.5
  **Date:** 2025-09-30
  **Messages:** 15

  ---

  ## User
  [Message content]

  ## Assistant
  [Response content]

  ---
  ```
- [ ] Include metadata (model, tokens, timestamps)
- [ ] Export all conversations in project
- [ ] Export as JSON option
- [ ] Export with attachments

### 10. API Call Information Display
- [ ] Add info (i) button next to each assistant message
- [ ] On hover/click, show:
  - [ ] Time to first token (TTFT)
  - [ ] Total tokens (input/output/cached)
  - [ ] Generation speed (tokens/sec)
  - [ ] Model used
  - [ ] Approximate cost
  - [ ] Response time
  - [ ] Whether prompt caching was used
- [ ] Store metrics in database with messages
- [ ] Aggregate metrics view in settings

## Low Priority / Future Ideas

### 11. Additional Features
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

### 12. Performance & Optimization
- [ ] Lazy load old messages
- [ ] Virtual scrolling for long conversations
- [ ] Message pagination
- [ ] Database indexing optimization
- [ ] Cache frequently accessed data

### 13. Accessibility
- [ ] Keyboard navigation improvements
- [ ] Screen reader support
- [ ] High contrast mode
- [ ] Focus indicators
- [ ] ARIA labels

## Technical Debt
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

## Recently Completed Features

### Completed in Recent PRs
1. **PR #4** - Toast notifications, hydration fixes, message UX improvements
2. **PR #3** - Automatic conversation title generation
3. **PR #2** - SSE streaming response alignment
4. **PR #1** - Missing messages API route and error handling
5. **Earlier** - Claude 4 models support with prompt caching (90% cost reduction)
6. **Earlier** - OpenRouter API integration for live pricing data
7. **Earlier** - Comprehensive pricing panel in Settings

---

**Last Updated:** 2025-09-30

**Note:** Features are prioritized but flexible. User testing and feedback will determine actual implementation order.
