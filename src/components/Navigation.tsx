
import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Navigation: React.FC = () => {
  const [location] = useLocation();

  const navItems = [
    { href: '/', label: 'Início' },
    { href: '/quiz', label: 'Quiz' },
    { href: '/craft-editor', label: 'Editor Visual' },
    { href: '/admin', label: 'Admin' }
  ];

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <span className="text-xl font-bold">Quiz Builder</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={location === item.href ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(
                    "text-sm",
                    location === item.href && "bg-primary text-primary-foreground"
                  )}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
