'use client';

import { useState, useEffect } from 'react';
import { ConversationData } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MessageSquare, MoreHorizontal, Pencil, Archive, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConversationItemProps {
  conversation: ConversationData;
  isActive: boolean;
  onSelect: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onRename,
  onArchive,
  onDelete,
}: ConversationItemProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(conversation.title);

  // Sync local state when prop changes (e.g., after title generation)
  useEffect(() => {
    setNewTitle(conversation.title);
  }, [conversation.title]);

  const handleRename = () => {
    if (newTitle.trim() && newTitle !== conversation.title) {
      onRename(conversation.id, newTitle.trim());
    }
    setIsRenaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setNewTitle(conversation.title);
      setIsRenaming(false);
    }
  };

  return (
    <div
      className={cn(
        'group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent',
        isActive && 'bg-accent'
      )}
    >
      <MessageSquare className="h-4 w-4 flex-shrink-0 text-muted-foreground" />

      {isRenaming ? (
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none"
          autoFocus
        />
      ) : (
        <button
          onClick={() => onSelect(conversation.id)}
          className="flex-1 text-left line-clamp-2"
          title={conversation.title}
        >
          {conversation.title}
        </button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'flex-shrink-0 rounded-md p-1 opacity-0 transition-opacity hover:bg-accent-foreground/10 group-hover:opacity-100',
              isActive && 'opacity-100'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Conversation options</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setIsRenaming(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onArchive(conversation.id)}>
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete(conversation.id)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
