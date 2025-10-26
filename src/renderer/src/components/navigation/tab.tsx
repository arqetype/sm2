import type { ReactNode } from 'react';
import { XIcon } from 'lucide-react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

interface TabProps {
  id: string;
  active: boolean;
  closable: boolean;
  onClose?: (id: string) => void;
  title: string;
  children: ReactNode;
}

export function Tab({ id, active, closable, onClose, title, children }: TabProps) {
  return (
    <TabsPrimitive.Trigger
      value={id}
      aria-label={`${title}${active ? ' (active)' : ''}`}
      className={cn(
        'text-sm not-drag-window max-w-52 w-full h-full pt-px py-1 pb-1 group flex justify-center relative group/container',
        active &&
          'bg-background rounded-tab-curve shadow-outline element-shadow-outline-out is-active'
      )}
    >
      <div
        className={cn(
          'w-full h-full transition-colors pl-2.5 pr-1.5 flex justify-center items-center rounded-sm relative',
          !active &&
            'group-hover:bg-primary group-hover:text-primary-foreground after:absolute after:-right-0.5 after:h-full after:w-px after:bg-border after:opacity-50 after:block group-[:has(+.is-active)]:after:hidden',
          active && 'transition-none'
        )}
      >
        <span className="block text-left text-ellipsis flex-1 shrink">{children}</span>
        {closable && (
          <span
            className={cn(
              'hidden group-hover:block hover:bg-secondary rounded-sm hover:text-secondary-foreground transition-colors p-0.5',
              active && 'block transition-none'
            )}
            role="button"
            onClick={e => {
              e.preventDefault();
              onClose?.(id);
            }}
          >
            <XIcon className="size-4" />
          </span>
        )}
      </div>
      <span
        className={cn(
          'hidden absolute -bottom-0.5 bg-background h-1 w-full z-15',
          active && 'block'
        )}
      ></span>
    </TabsPrimitive.Trigger>
  );
}

Tab.displayName = 'Tab';
