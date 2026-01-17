// @ts-nocheck
'use client';

import { ChevronRight, Factory, Workflow, Box, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/lib/factory-os/types';

interface FactoryOSNavProps {
  breadcrumbs: BreadcrumbItem[];
  onNavigate: (index: number) => void;
  className?: string;
}

const TYPE_ICONS = {
  facility: Factory,
  line: Workflow,
  cell: Box,
  component: Cpu,
};

export function FactoryOSNav({ breadcrumbs, onNavigate, className }: FactoryOSNavProps) {
  return (
    <nav className={cn('flex items-center gap-1 text-sm', className)}>
      {breadcrumbs.map((item, index) => {
        const Icon = TYPE_ICONS[item.type];
        const isLast = index === breadcrumbs.length - 1;

        return (
          <div key={item.id} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-zinc-600 flex-shrink-0" />
            )}
            <button
              onClick={() => onNavigate(index)}
              disabled={isLast}
              className={cn(
                'flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors',
                isLast
                  ? 'text-zinc-100 cursor-default'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate max-w-[120px]">{item.name}</span>
            </button>
          </div>
        );
      })}
    </nav>
  );
}
