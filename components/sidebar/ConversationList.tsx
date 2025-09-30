'use client';

import { ConversationData } from '@/types';
import { ConversationItem } from './ConversationItem';
import { MessageSquare } from 'lucide-react';

interface ConversationListProps {
  conversations: ConversationData[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onArchiveConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

interface GroupedConversations {
  today: ConversationData[];
  yesterday: ConversationData[];
  lastWeek: ConversationData[];
  older: ConversationData[];
}

function groupConversationsByDate(conversations: ConversationData[]): GroupedConversations {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const grouped: GroupedConversations = {
    today: [],
    yesterday: [],
    lastWeek: [],
    older: [],
  };

  conversations.forEach((conv) => {
    const convDate = new Date(conv.updatedAt);
    const convDay = new Date(convDate.getFullYear(), convDate.getMonth(), convDate.getDate());

    if (convDay.getTime() === today.getTime()) {
      grouped.today.push(conv);
    } else if (convDay.getTime() === yesterday.getTime()) {
      grouped.yesterday.push(conv);
    } else if (convDay >= lastWeek) {
      grouped.lastWeek.push(conv);
    } else {
      grouped.older.push(conv);
    }
  });

  return grouped;
}

export function ConversationList({
  conversations,
  currentConversationId,
  onSelectConversation,
  onRenameConversation,
  onArchiveConversation,
  onDeleteConversation,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">No conversations yet</p>
          <p className="text-xs text-muted-foreground/70">
            Start a new chat to begin
          </p>
        </div>
      </div>
    );
  }

  const grouped = groupConversationsByDate(conversations);

  return (
    <div className="space-y-6">
      {grouped.today.length > 0 && (
        <div className="space-y-1">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground">Today</h3>
          {grouped.today.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === currentConversationId}
              onSelect={onSelectConversation}
              onRename={onRenameConversation}
              onArchive={onArchiveConversation}
              onDelete={onDeleteConversation}
            />
          ))}
        </div>
      )}

      {grouped.yesterday.length > 0 && (
        <div className="space-y-1">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground">Yesterday</h3>
          {grouped.yesterday.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === currentConversationId}
              onSelect={onSelectConversation}
              onRename={onRenameConversation}
              onArchive={onArchiveConversation}
              onDelete={onDeleteConversation}
            />
          ))}
        </div>
      )}

      {grouped.lastWeek.length > 0 && (
        <div className="space-y-1">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground">Last 7 days</h3>
          {grouped.lastWeek.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === currentConversationId}
              onSelect={onSelectConversation}
              onRename={onRenameConversation}
              onArchive={onArchiveConversation}
              onDelete={onDeleteConversation}
            />
          ))}
        </div>
      )}

      {grouped.older.length > 0 && (
        <div className="space-y-1">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground">Older</h3>
          {grouped.older.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === currentConversationId}
              onSelect={onSelectConversation}
              onRename={onRenameConversation}
              onArchive={onArchiveConversation}
              onDelete={onDeleteConversation}
            />
          ))}
        </div>
      )}
    </div>
  );
}
