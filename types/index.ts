export interface ClaudeModel {
  id: string;
  name: string;
  description: string;
  maxTokens: number;
  contextWindow: number;
}

export const CLAUDE_MODELS: ClaudeModel[] = [
  // Claude 4 Family (Latest)
  {
    id: 'claude-sonnet-4-5-20250929',
    name: 'Claude Sonnet 4.5',
    description: 'Latest and most intelligent model',
    maxTokens: 8192,
    contextWindow: 200000,
  },
  {
    id: 'claude-opus-4-1-20250514',
    name: 'Claude Opus 4.1',
    description: 'Most capable model for complex reasoning',
    maxTokens: 8192,
    contextWindow: 200000,
  },
  {
    id: 'claude-opus-4-20250514',
    name: 'Claude Opus 4',
    description: 'Powerful model for complex tasks',
    maxTokens: 8192,
    contextWindow: 200000,
  },
  {
    id: 'claude-sonnet-4-20250514',
    name: 'Claude Sonnet 4',
    description: 'Balanced intelligence and speed',
    maxTokens: 8192,
    contextWindow: 200000,
  },
  // Claude 3.5 Family
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    description: 'Previous generation intelligent model',
    maxTokens: 8192,
    contextWindow: 200000,
  },
  {
    id: 'claude-3-5-haiku-20241022',
    name: 'Claude 3.5 Haiku',
    description: 'Fast and efficient',
    maxTokens: 8192,
    contextWindow: 200000,
  },
  // Claude 3 Family (Legacy)
  {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    description: 'Legacy powerful model',
    maxTokens: 4096,
    contextWindow: 200000,
  },
  {
    id: 'claude-3-sonnet-20240229',
    name: 'Claude 3 Sonnet',
    description: 'Legacy balanced model',
    maxTokens: 4096,
    contextWindow: 200000,
  },
  {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    description: 'Legacy fast model',
    maxTokens: 4096,
    contextWindow: 200000,
  },
];

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
  attachments?: FileAttachment[];
  error?: boolean;
  isRetrying?: boolean;
}

export interface FileAttachment {
  id: string;
  fileName: string;
  fileType: string;
  filePath: string;
  fileSize: number;
}

export interface ConversationData {
  id: string;
  title: string;
  model: string;
  projectId?: string;
  createdAt: Date;
  updatedAt: Date;
  archived: boolean;
  messageCount?: number;
}

export interface ProjectData {
  id: string;
  name: string;
  description?: string;
  instructions?: string;
  createdAt: Date;
  updatedAt: Date;
  conversationCount?: number;
  fileCount?: number;
}
