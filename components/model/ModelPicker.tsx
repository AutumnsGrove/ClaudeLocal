"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cpu } from "lucide-react";

interface Model {
  id: string;
  name: string;
  description?: string;
  context_window?: number;
  max_tokens?: number;
}

interface ModelPickerProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  className?: string;
}

export function ModelPicker({
  selectedModel,
  onModelChange,
  className,
}: ModelPickerProps) {
  const [models, setModels] = React.useState<Model[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/models");

        if (!response.ok) {
          throw new Error(`Failed to fetch models: ${response.statusText}`);
        }

        const data = await response.json();
        setModels(data.models || []);
      } catch (err) {
        console.error("Error fetching models:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch models");
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const selectedModelData = models.find((m) => m.id === selectedModel);

  return (
    <div className={className}>
      <Select value={selectedModel} onValueChange={onModelChange} disabled={loading || !!error}>
        <SelectTrigger className="w-full">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder={loading ? "Loading models..." : "Select a model"} />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Available Models</SelectLabel>
            {loading ? (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                Loading models...
              </div>
            ) : error ? (
              <div className="px-2 py-1.5 text-sm text-destructive">
                {error}
              </div>
            ) : models.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                No models available
              </div>
            ) : (
              models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{model.name}</span>
                    {model.description && (
                      <span className="text-xs text-muted-foreground">
                        {model.description}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))
            )}
          </SelectGroup>
        </SelectContent>
      </Select>

      {selectedModelData && (selectedModelData.context_window || selectedModelData.max_tokens) && (
        <div className="mt-2 text-xs text-muted-foreground space-y-1">
          {selectedModelData.context_window && (
            <div>Context Window: {selectedModelData.context_window.toLocaleString()} tokens</div>
          )}
          {selectedModelData.max_tokens && (
            <div>Max Output: {selectedModelData.max_tokens.toLocaleString()} tokens</div>
          )}
        </div>
      )}
    </div>
  );
}
