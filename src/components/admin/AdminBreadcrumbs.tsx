import React from 'react';
import { Link } from 'wouter';

type Crumb = {
  label: string;
  href?: string;
};

interface AdminBreadcrumbsProps {
  items: Crumb[];
  className?: string;
}

export const AdminBreadcrumbs: React.FC<AdminBreadcrumbsProps> = ({ items, className }) => {
  if (!items?.length) return null;
  return (
    <nav className={`text-sm text-[#8F7A6A] ${className || ''}`} aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-[#432818]">{item.label}</span>
              )}
              {!isLast && <span className="opacity-60">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default AdminBreadcrumbs;
