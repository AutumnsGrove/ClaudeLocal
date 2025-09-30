# ClaudeLocal - TODOs Sorted by Implementation Complexity

**Sorted from Easiest to Most Complex**

---

## Tier 1: Quick Wins (Simple UI/Config Changes)

### 1. UI Icon Enhancement
- [ ] Add icons to navigation items
- [ ] Add icons to buttons (send, regenerate, edit, etc.)
- [ ] Add icons to sidebar actions
- [ ] Add icons to settings menu items
- [ ] Use lucide-react or similar icon library consistently

**Complexity**: Low - Mostly adding existing icon components to UI elements

---

### 2. Simplified Pricing Panel ✅ COMPLETED
- [x] Remove persistent "90% reduction" rate from every row (mention once at top)
- [x] Consolidate pricing display
- [x] Make pricing table more scannable
- [x] Add "Why prompt caching?" explanation section
- [x] Highlight cheapest/recommended models

**Complexity**: Low - UI restructuring and content reorganization
**Status**: Completed with OpenRouter API integration and fallback

---

### 3. Response Retry Button
- [ ] Add retry button for failed responses
- [ ] Allow retry with same parameters
- [ ] Show loading state during retry

**Complexity**: Low-Medium - Reuse existing message sending logic with error handling

---

### 4. Copy to Clipboard Buttons
- [ ] **User Messages**: Copy to clipboard
- [ ] **Assistant Messages**: Copy to clipboard

**Complexity**: Low - Simple browser API implementation

---

## Tier 2: Moderate Features (State Management & UI Logic)

### 5. Dark Mode Fix ✅ COMPLETED
- [x] Debug why dark mode toggle doesn't work
- [x] Ensure all components respect theme
- [x] Test persistence across page reloads

**Complexity**: Low-Medium - Debug existing implementation, fix state/storage issues
**Status**: Completed in PR #4 - Fixed hydration and ToastProvider issues

---

### 6. Menu Collapsing Functionality Fix ✅ COMPLETED
- [x] Fix menu collapsing functionality (doesn't actually work)

**Complexity**: Low-Medium - Debug and fix existing feature
**Status**: Completed in PR #4

---

### 7. On-Hover Info Button
- [ ] Add on-hover extra info button about the current chat selected in the right pane

**Complexity**: Low-Medium - Tooltip/popover component with chat metadata

---

### 8. Delete User Messages
- [ ] **User Messages**: Delete button

**Complexity**: Low-Medium - Delete from DB, update UI state

---

### 9. Rate Assistant Responses
- [ ] **Assistant Messages**: Rate response (thumbs up/down)

**Complexity**: Low-Medium - Add rating field to DB, simple UI toggle

---

### 10. Conversation Export (Markdown)
- [ ] Export single conversation as Markdown
- [ ] Include metadata (model, tokens, timestamps)
- [ ] Export format with proper structure

**Complexity**: Medium - Data formatting and file download

---

### 11. Conversation Export (Advanced)
- [ ] Export all conversations in project
- [ ] Export as JSON option
- [ ] Export with attachments

**Complexity**: Medium - Builds on basic export with bulk operations

---

### 12. Move Conversations to Projects
- [ ] Add "Move to Project" option in conversation menu
- [ ] Bulk move multiple conversations
- [ ] Filter conversations by project
- [ ] Unassigned conversations view

**Complexity**: Medium - Requires project system to exist first

---

## Tier 3: Complex Features (Data Models & Business Logic)

### 13. Select Multiple Chats Interface
- [ ] Add select button/interface for selecting multiple chats

**Complexity**: Medium - Multi-select state management, bulk operations UI

---

### 14. Edit User Messages
- [ ] **User Messages**: Edit button (allow inline editing)

**Complexity**: Medium - Edit mode state, DB update, conversation re-flow handling

---

### 15. Regenerate Assistant Messages
- [ ] **Assistant Messages**: Regenerate button (retry with same prompt)

**Complexity**: Medium - Requires message history truncation and re-sending

---

### 16. API Call Information Display
- [ ] Add info (i) button next to each assistant message
- [ ] Show: TTFT, tokens, speed, model, cost, response time, caching status
- [ ] Store metrics in database with messages
- [ ] Aggregate metrics view in settings

**Complexity**: Medium-High - Requires capturing metrics during API calls, DB schema changes

---

### 17. Enhanced Settings Menu - Interface Settings
- [ ] **Interface Settings**
  - [ ] Font size adjustment
  - [ ] Code theme selection
  - [ ] Message density (compact/comfortable/spacious)
  - [ ] Markdown rendering options

**Complexity**: Medium - UI preferences with persistence

---

### 18. Enhanced Settings Menu - Model Settings
- [ ] **Model Settings**
  - [ ] Temperature slider (0-1)
  - [ ] Max tokens input
  - [ ] Top-p/Top-k controls
  - [ ] Frequency/presence penalty

**Complexity**: Medium - Form inputs with validation, pass to API

---

### 19. Enhanced Settings Menu - API Settings
- [ ] **API Settings**
  - [ ] API key management (add/remove/test)
  - [ ] Default model selection
  - [ ] Rate limiting preferences
  - [ ] Timeout settings

**Complexity**: Medium-High - Secure key storage, validation, testing

---

### 20. Enhanced Settings Menu - Privacy & About
- [ ] **Privacy Settings**
  - [ ] Local storage management
  - [ ] Data retention policies
  - [ ] Export/import settings
- [ ] **About Section**
  - [ ] Version information
  - [ ] Model capabilities
  - [ ] Links to documentation

**Complexity**: Medium - Data management and informational UI

---

### 21. Enhanced Settings Menu - Keyboard Shortcuts
- [ ] **Keyboard Shortcuts**
  - [ ] View shortcut reference
  - [ ] Customize shortcuts

**Complexity**: Medium-High - Global keyboard handler, customization UI

---

### 22. Conversation Search
- [ ] Conversation search functionality

**Complexity**: Medium-High - Search index, query logic, results UI

---

### 23. Tags/Labels for Conversations
- [ ] Tags/labels for conversations
- [ ] Favorite/pin important conversations

**Complexity**: Medium-High - Many-to-many relationship, tagging UI

---

### 24. Project Management System
- [ ] Create project entity with:
  - [ ] Name and description
  - [ ] Custom instructions (system prompt)
  - [ ] Associated file uploads
  - [ ] Project-specific settings
- [ ] Project selector in conversation view
- [ ] Automatic project context injection
- [ ] Project templates (coding, writing, analysis, etc.)

**Complexity**: High - New data model, context injection system, templates

---

## Tier 4: Advanced Features (Complex Systems)

### 25. Fork Conversation
- [ ] **Assistant Messages**: Fork conversation (branch from this point)

**Complexity**: High - Conversation branching, tree structure, navigation

---

### 26. Conversation Templates
- [ ] Conversation templates

**Complexity**: Medium-High - Template system, variable substitution

---

### 27. Share Conversation
- [ ] Share conversation (generate public link)

**Complexity**: High - Public routes, auth bypass for shared links, security

---

### 28. Multi-Model Comparison
- [ ] Multi-model comparison (send to multiple models)

**Complexity**: High - Parallel API calls, comparison UI, cost implications

---

### 29. Voice Input/Output
- [ ] Voice input/output

**Complexity**: High - Web Audio API, speech recognition, TTS integration

---

### 30. Image Attachments and Vision
- [ ] Image attachments and vision support

**Complexity**: High - File upload, storage, vision API integration

---

### 31. Code Execution Sandbox
- [ ] Code execution sandbox

**Complexity**: Very High - Security sandboxing, execution environment

---

### 32. Conversation Analytics Dashboard
- [ ] Conversation analytics dashboard

**Complexity**: High - Data aggregation, visualization, analytics queries

---

## Tier 5: Performance & Infrastructure

### 33. Performance Optimization
- [ ] Lazy load old messages
- [ ] Virtual scrolling for long conversations
- [ ] Message pagination
- [ ] Database indexing optimization
- [ ] Cache frequently accessed data

**Complexity**: Medium-High - Performance profiling, optimization techniques

---

### 34. Accessibility
- [ ] Keyboard navigation improvements
- [ ] Screen reader support
- [ ] High contrast mode
- [ ] Focus indicators
- [ ] ARIA labels

**Complexity**: Medium-High - Comprehensive accessibility audit and fixes

---

## Tier 6: Technical Debt (Essential Maintenance)

### 35. Error Handling & States
- [ ] Add comprehensive error handling
- [ ] Add loading states everywhere
- [ ] Add optimistic updates

**Complexity**: Medium - Apply patterns across entire codebase

---

### 36. TypeScript & Type Safety
- [ ] Implement proper TypeScript types throughout

**Complexity**: Medium - Systematic type addition and refinement

---

### 37. Testing Infrastructure
- [ ] Add unit tests for critical paths
- [ ] Add integration tests for API routes
- [ ] Set up CI/CD pipeline

**Complexity**: High - Test framework setup, test writing, CI configuration

---

### 38. Database & Backend Infrastructure
- [ ] Add database migrations system
- [ ] Implement proper logging system
- [ ] Add performance monitoring

**Complexity**: High - Infrastructure setup, migration system, monitoring tools

---

## Implementation Strategy

### Phase 1: Quick Wins (Week 1-2)
Start with Tier 1 items to build momentum and improve UX immediately.

### Phase 2: Core Features (Week 3-6)
Tackle Tier 2 and select Tier 3 items that provide high user value.

### Phase 3: Advanced Systems (Week 7-10)
Implement complex features from Tier 3 and 4 based on user feedback.

### Phase 4: Infrastructure (Ongoing)
Address Tier 5 and 6 items continuously alongside feature work.

---

## Recently Completed (PRs #1-4)

### ✅ Completed Features:
1. **Dark Mode Fix** - Fixed hydration and theme persistence
2. **Menu Collapsing** - Fixed sidebar collapse functionality
3. **Pricing Panel** - Comprehensive pricing with OpenRouter API integration
4. **Automatic Titles** - Conversation title generation using cheapest model
5. **Error Handling** - Missing API routes and comprehensive chat error handling
6. **SSE Streaming** - Aligned streaming response format
7. **Toast Notifications** - Added ToastProvider for better UX
8. **Prompt Caching** - Implemented 90% cost reduction with Claude 4 models

---

**Last Updated**: 2025-09-30
