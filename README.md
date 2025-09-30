# ClaudeLocal

A fully functional, feature-complete local clone of Claude.ai that runs entirely on your machine.

## Features

- Real-time streaming chat with Claude AI models
- Multiple Claude model support (Sonnet, Opus, Haiku)
- Project-based organization with custom instructions
- Smart file previews (PDF, Markdown, SVG, Images, Code)
- Conversation history with search and filtering
- File upload and attachment support
- Token usage tracking
- Dark/light theme support
- Responsive design

## Tech Stack

- **Frontend**: Next.js 14+ with React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **AI Integration**: Anthropic SDK + Vercel AI SDK
- **UI Components**: Shadcn UI

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `secrets_template.json` to `secrets.json` and add your Anthropic API key
4. Set up the database: `npx prisma migrate dev`
5. Run the development server: `npm run dev`
6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
ClaudeLocal/
├── app/              # Next.js App Router pages and API routes
├── components/       # React components
├── lib/             # Utility functions and API wrappers
├── prisma/          # Database schema and migrations
├── public/          # Static assets
└── types/           # TypeScript type definitions
```

## License

MIT
