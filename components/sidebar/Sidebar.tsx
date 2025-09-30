'use client';

import { useState } from 'react';
import { ConversationData } from '@/types';
import { ConversationList } from './ConversationList';
import { ProjectSelector } from './ProjectSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Plus,
  Search,
  Settings,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface SidebarProps {
  conversations: ConversationData[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onConversationsChange: () => void;
  open?: boolean;
  onToggle?: () => void;
}

export function Sidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onConversationsChange,
  open = true,
  onToggle,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  // Filter conversations based on search query and selected project
  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      searchQuery === '' ||
      conv.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject =
      selectedProjectId === null || conv.projectId === selectedProjectId;
    return matchesSearch && matchesProject && !conv.archived;
  });

  const handleRenameConversation = async (id: string, newTitle: string) => {
    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });

      if (response.ok) {
        onConversationsChange();
      }
    } catch (error) {
      console.error('Failed to rename conversation:', error);
    }
  };

  const handleArchiveConversation = async (id: string) => {
    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: true }),
      });

      if (response.ok) {
        onConversationsChange();
      }
    } catch (error) {
      console.error('Failed to archive conversation:', error);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this conversation?')) {
      return;
    }

    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onConversationsChange();
        if (currentConversationId === id) {
          onNewConversation();
        }
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={onToggle}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-80 flex-col border-r bg-background transition-transform duration-300 md:relative md:translate-x-0',
          !open && '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b p-4">
          <h2 className="text-lg font-semibold">ClaudeLocal</h2>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onNewConversation}
              title="New chat"
            >
              <Plus className="h-5 w-5" />
            </Button>
            {onToggle && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="hidden md:flex"
                title={open ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                {open ? (
                  <ChevronLeft className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Search and Project Selector */}
        <div className="space-y-3 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <ProjectSelector
            selectedProjectId={selectedProjectId}
            onProjectChange={setSelectedProjectId}
          />
        </div>

        <Separator />

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-4">
          <ConversationList
            conversations={filteredConversations}
            currentConversationId={currentConversationId}
            onSelectConversation={onSelectConversation}
            onRenameConversation={handleRenameConversation}
            onArchiveConversation={handleArchiveConversation}
            onDeleteConversation={handleDeleteConversation}
          />
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
}
