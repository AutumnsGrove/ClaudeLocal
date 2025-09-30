'use client';

import { useState, useEffect } from 'react';
import { ProjectData } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Folder } from 'lucide-react';

interface ProjectSelectorProps {
  selectedProjectId: string | null;
  onProjectChange: (projectId: string | null) => void;
}

export function ProjectSelector({
  selectedProjectId,
  onProjectChange,
}: ProjectSelectorProps) {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleValueChange = (value: string) => {
    if (value === 'all') {
      onProjectChange(null);
    } else {
      onProjectChange(value);
    }
  };

  return (
    <div className="px-3">
      <Select
        value={selectedProjectId || 'all'}
        onValueChange={handleValueChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full">
          <div className="flex items-center gap-2">
            <Folder className="h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Select project" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Conversations</SelectItem>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              <div className="flex items-center gap-2">
                <span>{project.name}</span>
                {project.conversationCount !== undefined && (
                  <span className="text-xs text-muted-foreground">
                    ({project.conversationCount})
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
