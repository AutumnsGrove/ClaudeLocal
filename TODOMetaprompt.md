🤖 Agent Metaprompt: ClaudeLocal Feature Implementation

  Mission

  You are tasked with systematically implementing features from the ClaudeLocal TodoSorted.md file. Follow this structured approach for each task.

  Pre-Implementation Protocol

  1. Read TodoSorted.md to understand the current task queue
  2. Select a task from the appropriate tier (start with Tier 1)
  3. Before any implementation, conduct a comprehensive audit:

  AUDIT CHECKLIST:
  □ Read all files related to this feature area
  □ Understand the current data models (check schema.prisma)
  □ Identify all UI components that need changes
  □ Map out the data flow: UI → API → Database → Response
  □ Check for existing similar functionality to reuse
  □ Note any dependencies on other incomplete tasks
  □ Identify potential breaking changes

  Implementation Workflow

  Phase 1: Analysis & Planning
  - Create a feature branch: git checkout -b feature/[descriptive-name]
  - Document your understanding of:
    - What files need to be modified
    - What new files need to be created (minimize this)
    - What database schema changes are required
    - What API routes are affected
    - What UI components need updates

  Phase 2: Development
  - Follow the project's established patterns:
    - API routes: Next.js 15 async params pattern
    - Database: Prisma with proper relations
    - UI: TypeScript strict mode, proper typing
    - State: React hooks with proper dependencies
  - Make incremental commits as you complete sub-tasks
  - Test each change before moving to the next

  Phase 3: Testing
  # Development testing
  npm run dev
  # Check browser console for errors
  # Test the specific feature thoroughly
  # Verify related features still work

  # Production build verification
  npm run build
  # Ensure no TypeScript errors

  Phase 4: Documentation & Merge
  - Update TodoSorted.md to mark task as complete
  - Create PR with comprehensive description
  - Follow the commit message format from CLAUDE.md
  - Merge and clean up branch

  Task Selection Strategy

  Week 1-2: Quick Wins
  Start with Tier 1 tasks (items 1-4) to build momentum:
  - UI Icon Enhancement
  - Simplified Pricing Panel
  - Response Retry Button
  - Copy to Clipboard Buttons

  Week 3-4: Core UX Improvements
  Move to Tier 2 tasks (items 5-12):
  - Dark Mode Fix (high user value)
  - Menu Collapsing Fix
  - Message deletion and rating
  - Basic conversation export

  Week 5+: Advanced Features
  Tackle Tier 3+ based on:
  - User feedback priority
  - Dependencies on completed tasks
  - Available development time

  Critical Rules

  1. Never skip the audit phase - Understanding the codebase prevents bugs
  2. Always use feature branches - Never commit directly to main
  3. Test before committing - Both dev mode and production build
  4. Update TodoSorted.md - Keep the task list current
  5. Follow existing patterns - Don't introduce new paradigms without discussion
  6. Minimize new files - Prefer editing existing files when possible
  7. No premature optimization - Get it working, then make it better

  Example Task Execution

  Task: Add Copy to Clipboard for Messages

  Step 1: Audit
  Files to examine:
  - app/components/MessageList.tsx (or similar)
  - Check if clipboard API is already used elsewhere
  - Verify we have lucide-react for icons

  Step 2: Plan
  Changes needed:
  1. Add copy button to message component
  2. Implement clipboard.writeText() with error handling
  3. Add toast/notification for user feedback
  4. Style button to match existing UI

  Step 3: Implement
  git checkout -b feature/message-copy-button
  # Make changes
  # Test in browser
  git add .
  git commit -m "Add: Copy to clipboard for user and assistant messages..."

  Step 4: Verify & Merge
  npm run build  # Check for errors
  gh pr create --title "Add: Copy to clipboard for messages"
  gh pr merge --squash --delete-branch

  Quality Gates

  Before marking any task complete:
  - Feature works in development mode
  - No console errors or warnings
  - TypeScript build succeeds
  - Related features still work
  - Code follows project conventions
  - PR description is comprehensive
  - TodoSorted.md is updated

  When Stuck

  1. Read the existing code - The answer is usually already there
  2. Check similar features - Reuse existing patterns
  3. Review Next.js 15 docs - For API route patterns
  4. Review Prisma docs - For database queries
  5. Check lucide-react - For icon components

  Success Metrics

  - ✅ Task completed without breaking existing functionality
  - ✅ Code quality maintained (types, error handling, patterns)
  - ✅ User experience improved
  - ✅ Documentation updated
  - ✅ Tests pass (when test suite exists)

  ---
  Start with Tier 1, Task 1: UI Icon Enhancement. Good luck! 🚀