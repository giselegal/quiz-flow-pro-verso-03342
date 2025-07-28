import React from "react";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, EyeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { PreviewContent } from "./PreviewContent";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface EditPreviewProps {
  isPreviewing: boolean;
  onPreviewToggle: () => void;
  onSelectComponent: (id: string | null) => void;
  selectedComponentId: string | null;
}

export function EditPreview({
  isPreviewing,
  onPreviewToggle,
  onSelectComponent,
  selectedComponentId
}: EditPreviewProps) {
  const [viewMode, setViewMode] = React.useState<"desktop" | "mobile">("desktop");

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-white p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode("desktop")}
                className={cn(viewMode === "desktop" && "bg-accent")}
              >
                <Monitor className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Visualização Desktop</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode("mobile")}
                className={cn(viewMode === "mobile" && "bg-accent")}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Visualização Mobile</TooltipContent>
          </Tooltip>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onPreviewToggle}
            >
              <EyeIcon className="w-4 h-4 mr-2" />
              {isPreviewing ? "Editar" : "Visualizar"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isPreviewing ? "Modo Edição" : "Modo Visualização"}</TooltipContent>
        </Tooltip>
      </div>

      <div className={cn(
        "flex-1 overflow-auto p-8",
        viewMode === "mobile" && "max-w-md mx-auto"
      )}>
        <PreviewContent
          isPreviewing={isPreviewing}
          selectedComponentId={selectedComponentId}
          onSelectComponent={onSelectComponent}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
}
