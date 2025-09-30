'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ConversationData } from '@/types';

export default function Home() {
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await fetch(`/api/conversations?_t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        // Create new object references to ensure React detects changes
        setConversations(data.map((conv: ConversationData) => ({ ...conv })));
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const handleNewConversation = () => {
    setCurrentConversationId(null);
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  const handleConversationCreated = (conversationId: string) => {
    setCurrentConversationId(conversationId);
    loadConversations();
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onConversationsChange={loadConversations}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatInterface
          conversationId={currentConversationId}
          onConversationCreated={handleConversationCreated}
          onConversationUpdated={loadConversations}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
      </main>
    </div>
  );
}
