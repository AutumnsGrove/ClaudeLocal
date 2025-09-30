# ClaudeLocal 🤖

A fully functional, feature-complete local clone of Claude.ai that runs entirely on your machine.

![ClaudeLocal](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma)
![Anthropic](https://img.shields.io/badge/Claude-API-orange)

## ✨ Features

### Chat & Messaging
- ✅ **Real-time streaming** responses with Server-Sent Events (SSE)
- ✅ **All Claude models** (3.5 Sonnet, 3.5 Haiku, 3 Opus, 3 Sonnet, 3 Haiku)
- ✅ **Markdown rendering** with GitHub Flavored Markdown support
- ✅ **Syntax highlighting** for 15+ programming languages
- ✅ **Code copy buttons** with one-click copying
- ✅ **Auto-scrolling** message list

### Organization
- ✅ **Projects** with custom instructions and knowledge base
- ✅ **Conversation management** (create, rename, archive, delete)
- ✅ **Search & filter** conversations
- ✅ **Date grouping** (Today, Yesterday, Last 7 days, Older)
- ✅ **Project filtering** to organize chats

### File Handling
- ✅ **PDF viewer** with zoom and page navigation
- ✅ **Image preview** with zoom and lightbox mode
- ✅ **Markdown preview** with live rendering
- ✅ **Code file** syntax highlighting
- ✅ **File attachments** (coming soon)

### UI/UX
- ✅ **Dark/light theme** toggle
- ✅ **Responsive design** (desktop and mobile)
- ✅ **Collapsible sidebar** with persistent state
- ✅ **Toast notifications** for user feedback
- ✅ **Loading states** and error handling

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5.7 |
| **Styling** | Tailwind CSS 3.4 |
| **Database** | SQLite with Prisma ORM |
| **AI** | Anthropic SDK + Claude API |
| **UI Components** | Shadcn UI (Radix UI primitives) |
| **State Management** | React Hooks |
| **Markdown** | react-markdown + remark-gfm |
| **Code Highlighting** | Prism.js |
| **PDF Rendering** | pdfjs-dist |

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** (comes with Node.js)
- **Anthropic API Key** ([Get one here](https://console.anthropic.com/))

### Installation

```bash
# 1. Navigate to the project
cd /Users/mini/Documents/projects/ClaudeLocal

# 2. Install dependencies (already done if coming from setup)
npm install

# 3. Create your secrets file
cp secrets_template.json secrets.json

# 4. Edit secrets.json and add your API key
# {
#   "anthropic_api_key": "sk-ant-api03-YOUR-KEY-HERE"
# }

# 5. Initialize database (already done if coming from setup)
npx prisma db push

# 6. Start the development server
npm run dev

# 7. Open http://localhost:3000
```

**📖 For detailed setup instructions, see [SETUP.md](./SETUP.md)**

## 📁 Project Structure

```
ClaudeLocal/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── chat/         # Streaming chat endpoint
│   │   ├── conversations/ # Conversation CRUD
│   │   ├── models/       # Model listing
│   │   └── projects/     # Project management
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/            # React Components
│   ├── chat/             # Chat UI (MessageList, MessageInput, MessageBubble)
│   ├── sidebar/          # Sidebar (ConversationList, ProjectSelector)
│   ├── preview/          # File previews (PDF, Image, Markdown, Code)
│   ├── model/            # Model picker
│   └── ui/               # Shadcn UI base components
├── lib/                  # Utilities
│   ├── db.ts            # Prisma client singleton
│   ├── secrets.ts       # API key management
│   └── utils.ts         # Helper functions (cn, etc.)
├── prisma/              # Database
│   ├── schema.prisma    # Database schema
│   └── dev.db           # SQLite database file
├── types/               # TypeScript Types
│   └── index.ts         # Shared type definitions
├── public/uploads/      # File uploads storage
├── secrets.json         # API keys (create from template)
└── secrets_template.json # Template for secrets
```

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Sync database with schema
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:migrate   # Create database migration
npm run db:generate  # Generate Prisma Client
```

## 🎯 Usage

### Starting a Chat

1. Open http://localhost:3000
2. Click **"New Chat"** button in the sidebar
3. Select a Claude model from the dropdown
4. Type your message and press **Enter** to send

### Managing Conversations

- **Rename**: Hover over a conversation → Click ⋯ → Rename
- **Archive**: Hover over a conversation → Click ⋯ → Archive
- **Delete**: Hover over a conversation → Click ⋯ → Delete
- **Search**: Use the search box in the sidebar to filter conversations

### Using Projects

1. Create a new project (Projects feature in sidebar)
2. Add custom instructions for the project
3. Upload knowledge base files (PDF, markdown, code)
4. Start conversations within the project context

### Keyboard Shortcuts

- **Enter** - Send message
- **Shift+Enter** - New line in message
- **Ctrl/Cmd+K** - Focus search (coming soon)
- **Ctrl/Cmd+N** - New chat (coming soon)

## 🔧 Configuration

### Changing Models

Edit the `CLAUDE_MODELS` array in `types/index.ts` to add/remove models.

### Database Schema Changes

1. Edit `prisma/schema.prisma`
2. Run `npx prisma db push` to apply changes
3. Run `npx prisma generate` to update the client

### Custom Themes

Edit the CSS variables in `app/globals.css` under `:root` and `.dark` selectors.

## 🐛 Troubleshooting

See [SETUP.md](./SETUP.md#troubleshooting) for common issues and solutions.

## 🔒 Security

- ✅ API keys stored in `secrets.json` (gitignored)
- ✅ All sensitive operations server-side only
- ✅ SQLite database local to your machine
- ✅ No data leaves your system except API calls to Anthropic
- ✅ File uploads stored locally in `public/uploads/`

## 🤝 Contributing

This is a personal project template. Feel free to fork and customize for your own use!

## 📄 License

MIT

---

**Built with Claude Code by Anthropic** 🤖
