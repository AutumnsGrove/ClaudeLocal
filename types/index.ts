export interface ClaudeModel {
  id: string;
  name: string;
  description: string;
  maxTokens: number;
  contextWindow: number;
}

export const CLAUDE_MODELS: ClaudeModel[] = [
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    description: 'Most intelligent model',
    maxTokens: 8192,
    contextWindow: 200000,
  },
  {
    id: 'claude-3-5-haiku-20241022',
    name: 'Claude 3.5 Haiku',
    description: 'Fastest model',
    maxTokens: 8192,
    contextWindow: 200000,
  },
  {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    description: 'Powerful model for complex tasks',
    maxTokens: 4096,
    contextWindow: 200000,
  },
  {
    id: 'claude-3-sonnet-20240229',
    name: 'Claude 3 Sonnet',
    description: 'Balanced performance',
    maxTokens: 4096,
    contextWindow: 200000,
  },
  {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    description: 'Fast and compact',
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
