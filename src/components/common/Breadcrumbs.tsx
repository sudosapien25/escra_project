import React from 'react';
import clsx from 'clsx';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps extends React.HTMLAttributes<HTMLOListElement> {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className,
  ...props
}) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className={clsx('flex items-center space-x-2 text-sm text-gray-500', className)} {...props}>
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.href ? (
              <a
                href={item.href}
                className={clsx(
                  'hover:text-primary',
                  index === items.length - 1 && 'text-primary pointer-events-none'
                )}
              >
                {item.label}
              </a>
            ) : (
              <span className={clsx(index === items.length - 1 && 'text-primary')}>
                {item.label}
              </span>
            )}
            {index < items.length - 1 && (
              <svg className="flex-shrink-0 mx-2 h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M5.555 17.776l8-16 .294.653-8 16-.294-.653z" />
              </svg>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

Breadcrumbs.displayName = 'Breadcrumbs'; 