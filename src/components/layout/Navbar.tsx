import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { Link } from 'wouter';

export function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/">
              <h1 style={{ color: '#432818' }} className="cursor-pointer hover:opacity-80">
                Quiz Builder
              </h1>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/meus-templates">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Meus Templates
              </Button>
            </Link>
            <Link href="/editor">
              <Button variant="ghost" size="sm">
                Editor
              </Button>
            </Link>
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
