import React from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-semibold text-gray-900">Quiz Builder</h1>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              Preview
            </Button>
            <Button variant="default" size="sm">
              Save
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
