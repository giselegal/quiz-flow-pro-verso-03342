import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  children?: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-full">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Components</h2>
        <ScrollArea className="h-full">
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              Text Block
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Image Block
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Button Block
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Form Block
            </Button>
          </div>
          {children}
        </ScrollArea>
      </div>
    </div>
  );
}
