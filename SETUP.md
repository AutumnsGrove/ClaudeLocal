# ClaudeLocal Setup Guide

Complete setup instructions for running ClaudeLocal on your machine.

## Prerequisites

- **Node.js** 18.0 or higher
- **npm** (comes with Node.js)
- **Anthropic API Key** ([Get one here](https://console.anthropic.com/))

## Installation Steps

### 1. Navigate to the Project

```bash
cd /Users/mini/Documents/projects/ClaudeLocal
```

### 2. Install Dependencies (Already Done)

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### 3. Set Up Your API Key

Create a `secrets.json` file in the project root:

```bash
cp secrets_template.json secrets.json
```

Edit `secrets.json` and add your Anthropic API key:

```json
{
  "anthropic_api_key": "sk-ant-api03-YOUR-ACTUAL-KEY-HERE",
  "comment": "This file is gitignored for security."
}
```

**Important:** Never commit `secrets.json` to version control!

### 4. Initialize the Database (Already Done)

The SQLite database has been created. If you need to reset it:

```bash
npx prisma db push
```

To view the database in a GUI:

```bash
npm run db:studio
```

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Features Available

✅ **Chat Interface**
- Real-time streaming responses from Claude
- Multiple Claude model support (Sonnet, Opus, Haiku)
- Markdown rendering with syntax highlighting
- Code blocks with copy functionality

✅ **Conversation Management**
- Create, rename, archive, and delete conversations
- Search and filter conversations
- Date-grouped conversation history
- Project-based organization

✅ **Projects**
- Create projects with custom instructions
- Filter conversations by project
- Project knowledge base (file upload)

✅ **File Previews**
- PDF viewer with zoom and navigation
- Image viewer with zoom and lightbox
- Markdown preview
- Code syntax highlighting

✅ **UI/UX**
- Dark/light theme toggle
- Responsive design (mobile-friendly)
- Collapsible sidebar
- Auto-scrolling messages
- Loading states and error handling

## Database Management

### View Database

```bash
npm run db:studio
```

Opens Prisma Studio at http://localhost:5555

### Reset Database

```bash
rm prisma/dev.db
npx prisma db push
```

### Run Migrations

```bash
npm run db:migrate
```

## Project Structure

```
ClaudeLocal/
├── app/                    # Next.js pages and API routes
│   ├── api/               # API endpoints
│   │   ├── chat/         # Streaming chat API
│   │   ├── conversations/ # Conversation CRUD
│   │   ├── models/       # Model listing
│   │   └── projects/     # Project management
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── chat/             # Chat UI (MessageList, MessageInput, etc.)
│   ├── sidebar/          # Sidebar components
│   ├── preview/          # File preview components
│   ├── model/            # Model picker
│   └── ui/               # Shadcn UI components
├── lib/                  # Utilities
│   ├── db.ts            # Prisma client
│   ├── secrets.ts       # API key management
│   └── utils.ts         # Helper functions
├── prisma/              # Database
│   ├── schema.prisma    # Database schema
│   └── dev.db           # SQLite database file
├── types/               # TypeScript types
├── public/uploads/      # File storage
└── secrets.json         # API keys (create this!)
```

## Troubleshooting

### "Anthropic API key not found"

Make sure you created `secrets.json` with your actual API key:

```bash
cat secrets.json
```

Should show:
```json
{
  "anthropic_api_key": "sk-ant-api03-...",
  "comment": "..."
}
```

### Database errors

Reset the database:

```bash
rm prisma/dev.db
npx prisma db push
```

### Port 3000 already in use

Kill the existing process or use a different port:

```bash
PORT=3001 npm run dev
```

### Module not found errors

Reinstall dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Sync database with schema
- `npm run db:studio` - Open Prisma Studio
- `npm run db:migrate` - Create migration
- `npm run db:generate` - Generate Prisma Client

## Production Deployment

### Build the application

```bash
npm run build
```

### Start production server

```bash
npm run start
```

### Environment Variables (Alternative to secrets.json)

For production, you can use environment variables instead:

```bash
export ANTHROPIC_API_KEY="sk-ant-api03-..."
npm run start
```

## Security Notes

- ✅ `secrets.json` is gitignored
- ✅ All API keys are server-side only
- ✅ SQLite database is local and not exposed
- ✅ No data leaves your machine except API calls to Anthropic

## Next Steps

1. Open http://localhost:3000
2. Click "New Chat" to start a conversation
3. Select a Claude model from the dropdown
4. Start chatting!

Enjoy your local Claude.ai clone! 🚀
