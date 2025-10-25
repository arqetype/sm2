import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub
} from '@/components/ui/sidebar';
import {
  ChevronRightIcon,
  FileIcon,
  FolderIcon,
  ListCollapseIcon,
  RefreshCcwIcon
} from 'lucide-react';
import { Button } from '../ui/button';

const data = {
  tree: [
    ['app', ['api', ['hello', ['route.ts']], 'page.tsx', 'layout.tsx', ['blog', ['page.tsx']]]],
    ['components', ['ui', 'button.tsx', 'card.tsx'], 'header.tsx', 'footer.tsx'],
    ['components', ['ui', 'button.tsx', 'card.tsx'], 'header.tsx', 'footer.tsx'],
    ['components', ['ui', 'button.tsx', 'card.tsx'], 'header.tsx', 'footer.tsx'],
    ['components', ['ui', 'button.tsx', 'card.tsx'], 'header.tsx', 'footer.tsx'],
    ['lib', ['util.ts']],
    ['public', 'favicon.ico', 'vercel.svg'],
    '.eslintrc.json',
    '.gitignore',
    'next.config.js',
    'tailwind.config.js',
    'package.json',
    'README.md'
  ]
};

export function SidebarFileTree() {
  return (
    <>
      <SidebarMenuItem className="flex items-center justify-evenly">
        <Button size="sm" variant={'outline'}>
          Open another folder
        </Button>
        <Button size="icon-sm">
          <RefreshCcwIcon />
          <span className="sr-only">Refresh the files</span>
        </Button>
        <Button size="icon-sm">
          <ListCollapseIcon />
          <span className="sr-only">Collapse all</span>
        </Button>
      </SidebarMenuItem>
      <SidebarGroup className="flex-1 overflow-y-auto">
        <SidebarGroupContent>
          <SidebarMenu>
            {data.tree.map((item, index) => (
              <Tree key={index} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}

// TODO: fix those eslint thingies
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Tree({ item }: { item: string | any[] }) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [name, ...items] = Array.isArray(item) ? item : [item];

  if (!items.length) {
    return (
      <SidebarMenuButton
        isActive={name === 'button.tsx'}
        className="data-[active=true]:bg-transparent"
      >
        <FileIcon />
        {name}
      </SidebarMenuButton>
    );
  }
  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen={name === 'components' || name === 'ui'}
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <ChevronRightIcon className="transition-transform" />
            <FolderIcon />
            {name}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((subItem, index) => (
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              <Tree key={index} item={subItem} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}
