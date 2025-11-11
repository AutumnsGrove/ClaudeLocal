# ClaudeLocal - Project Instructions for Claude Code

> **Note**: This is the main orchestrator file. For detailed guides, see `ClaudeUsage/README.md`

---

## Project Purpose

**ClaudeLocal** is a fully functional local clone of Claude.ai built as a modern web application. It provides a Claude Desktop-like experience with support for multiple AI providers (Anthropic, OpenRouter, LM Studio, Kimi K2, etc.) with advanced features like prompt caching, streaming responses, and detailed analytics.

## Tech Stack

- **Language**: TypeScript 5.7
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 3.4
- **Database**: SQLite with Prisma ORM 5.22
- **AI Integration**: Anthropic SDK + Claude API
- **Package Manager**: npm
- **UI Components**: Shadcn UI (Radix UI primitives)
- **State Management**: React Hooks + Zustand
- **Markdown**: react-markdown + remark-gfm
- **Code Highlighting**: Prism.js
- **PDF Rendering**: pdfjs-dist

## Architecture Notes

### Key Features
- Real-time streaming responses with Server-Sent Events (SSE)
- All Claude 4 models (Sonnet 4.5, Opus 4.1, Opus 4, Sonnet 4)
- Prompt caching for 90% cost reduction
- Markdown rendering with syntax highlighting
- Conversation management (create, rename, archive, delete)
- Projects with custom instructions
- File previews (PDF, images, markdown, code)
- Dark/light theme toggle
- Responsive design

### Project Structure
```
app/                    # Next.js App Router
├── api/               # API Routes (chat, conversations, models, projects, pricing)
├── layout.tsx         # Root layout
├── page.tsx          # Home page
└── globals.css       # Global styles

components/            # React Components
├── chat/             # Chat UI (MessageList, MessageInput, MessageBubble)
├── sidebar/          # Sidebar (ConversationList, ProjectSelector)
├── preview/          # File previews (PDF, Image, Markdown, Code)
├── model/            # Model picker
├── settings/         # Settings dialog, pricing panel
└── ui/               # Shadcn UI base components

lib/                  # Utilities (db.ts, secrets.ts, utils.ts)
prisma/              # Database schema and SQLite database
types/               # TypeScript type definitions
public/uploads/      # File uploads storage
```

---

## Essential Instructions (Always Follow)

### Core Behavior
- Do what has been asked; nothing more, nothing less
- NEVER create files unless absolutely necessary for achieving your goal
- ALWAYS prefer editing existing files to creating new ones
- NEVER proactively create documentation files (*.md) or README files unless explicitly requested

### Naming Conventions
- **Directories**: Use CamelCase (e.g., `VideoProcessor`, `AudioTools`, `DataAnalysis`)
- **Date-based paths**: Use skewer-case with YYYY-MM-DD (e.g., `logs-2025-01-15`, `backup-2025-12-31`)
- **No spaces or underscores** in directory names (except date-based paths)

### TODO Management
- **Always check `TODO.md` first** when starting a task or session
- **Update immediately** when tasks are completed, added, or changed
- Keep the list current and manageable

---

## Development Pipeline

All code changes MUST follow this pipeline:

1. **Submission** - Identify and document the issue/feature
2. **Review/Audit** - Analyze the codebase to understand the problem
3. **Develop** - Create a feature branch and implement the fix
4. **Test** - Verify the fix works correctly
5. **Merge** - Create a pull request and merge to main

### Branch Naming Conventions
- `fix/` - Bug fixes (e.g., `fix/chat-error-handling`)
- `feature/` - New features (e.g., `feature/file-upload`)
- `refactor/` - Code refactoring (e.g., `refactor/api-routes`)
- `docs/` - Documentation updates (e.g., `docs/api-endpoints`)
- `test/` - Test additions (e.g., `test/message-flow`)

### Git Workflow Essentials

**After completing major changes, you MUST commit your work.**

**Conventional Commits Format:**
```bash
<type>: <brief description>

<optional body>

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Common Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`

**Examples:**
```bash
feat: Add user authentication
fix: Correct timezone bug
docs: Update README
refactor: Simplify API route handlers
```

**For complete details:** See `ClaudeUsage/git_guide.md`

---

## When to Read Specific Guides

**Read the full guide in `ClaudeUsage/` when you encounter these situations:**

### Secrets & API Keys
- **When managing API keys or secrets** → Read `ClaudeUsage/secrets_management.md`
- **Before implementing secrets loading** → Read `ClaudeUsage/secrets_management.md`

### Version Control
- **Before making a git commit** → Read `ClaudeUsage/git_guide.md`
- **When initializing a new repo** → Read `ClaudeUsage/git_guide.md`
- **For git workflow and branching** → Read `ClaudeUsage/git_guide.md`
- **For conventional commits reference** → Read `ClaudeUsage/git_guide.md`

### Database Management
- **When working with databases** → Read `ClaudeUsage/db_usage.md`
- **Before implementing data persistence** → Read `ClaudeUsage/db_usage.md`
- **For Prisma patterns** → Read `ClaudeUsage/db_usage.md`

### Search & Research
- **When searching across 20+ files** → Read `ClaudeUsage/house_agents.md`
- **When finding patterns in codebase** → Read `ClaudeUsage/house_agents.md`
- **When locating TODOs/FIXMEs** → Read `ClaudeUsage/house_agents.md`

### Testing
- **Before writing tests** → Read `ClaudeUsage/testing_strategies.md`
- **When implementing test coverage** → Read `ClaudeUsage/testing_strategies.md`
- **For test organization** → Read `ClaudeUsage/testing_strategies.md`

### Code Quality
- **When refactoring code** → Read `ClaudeUsage/code_style_guide.md`
- **Before major code changes** → Read `ClaudeUsage/code_style_guide.md`
- **For style guidelines** → Read `ClaudeUsage/code_style_guide.md`

### Project Setup
- **When starting a new project** → Read `ClaudeUsage/project_setup.md`
- **For directory structure** → Read `ClaudeUsage/project_setup.md`
- **Setting up CI/CD** → Read `ClaudeUsage/ci_cd_patterns.md`

---

## Quick Reference

### Security Basics
- Store API keys in `secrets.json` (NEVER commit)
- Add `secrets.json` to `.gitignore` immediately
- Provide `secrets_template.json` for setup
- Use environment variables as fallbacks

### House Agents Quick Trigger
**When searching 20+ files**, use house-research for:
- Finding patterns across codebase
- Searching TODO/FIXME comments
- Locating API endpoints or functions
- Documentation searches

---

## Project-Specific Guidelines

### API Routes (Next.js 15)
- All routes in `app/api/` must use Next.js 15 async params
- Use `const { param } = await params;` for dynamic routes
- Always include error handling with try/catch
- Return appropriate HTTP status codes
- Use Server-Sent Events (SSE) for streaming responses

**Example:**
```typescript
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Next.js 15 async params pattern

  try {
    // Your logic here
    return Response.json({ data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

### Database Queries (Prisma)
- Use Prisma for all database operations
- Include necessary relations with `include`
- Handle null cases explicitly
- Log queries in development for debugging

**Example:**
```typescript
const conversation = await prisma.conversation.findUnique({
  where: { id },
  include: {
    messages: {
      orderBy: { createdAt: 'asc' }
    }
  }
});

if (!conversation) {
  return Response.json({ error: 'Not found' }, { status: 404 });
}
```

### Frontend Components (React + TypeScript)
- Use TypeScript strict mode
- Properly type all props
- Handle loading and error states
- Use React hooks correctly (deps array, cleanup)
- Implement proper error boundaries

**Example:**
```typescript
interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  onRetry?: () => void;
}

export function MessageBubble({ message, isStreaming, onRetry }: MessageBubbleProps) {
  // Component implementation
}
```

### Authentication & Security
- API keys in `secrets.json` (gitignored)
- Never expose secrets to client
- Validate all user inputs
- Use proper CORS settings
- Sanitize markdown/HTML content

### Testing
```bash
# Development testing
npm run dev    # Test in development mode

# Production build verification
npm run build  # Ensure no TypeScript errors

# Database tools
npm run db:studio  # Open Prisma Studio
```

### Quality Checklist

Before merging any PR:
- [ ] Code follows TypeScript best practices
- [ ] No TypeScript errors (`npm run build` succeeds)
- [ ] No console errors in development
- [ ] Feature works as expected
- [ ] Related features still work
- [ ] Error handling is comprehensive
- [ ] Code is properly typed (no `any` unless necessary)
- [ ] Commit messages are descriptive
- [ ] PR description is complete

---

## Code Style Guidelines

### Function & Variable Naming
- Use meaningful, descriptive names
- Keep functions small and focused on single responsibilities
- Add docstrings/JSDoc to functions and classes

### Error Handling
- Use try/catch blocks gracefully
- Provide helpful error messages
- Never let errors fail silently
- Log errors appropriately

### File Organization
- Group related functionality into modules
- Use consistent import ordering:
  1. React/Next.js imports
  2. Third-party packages
  3. Local components
  4. Local utilities
  5. Types
  6. Styles
- Keep configuration separate from logic

---

## Communication Style
- Be concise but thorough
- Explain reasoning for significant decisions
- Ask for clarification when requirements are ambiguous
- Proactively suggest improvements when appropriate

---

## Complete Guide Index
For all detailed guides, workflows, and examples, see:
**`ClaudeUsage/README.md`** - Master index of all documentation

---

**Always follow this workflow. No exceptions.**

*Last updated: 2025-11-11*
*Model: Claude Sonnet 4.5*
