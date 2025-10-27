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
import { useTabs } from '@/hooks/use-tabs';
import { FilePreviewTab, type FilePreviewData } from '@/components/navigation/tab-file-preview';

type TreeNode =
  | { type: 'file'; name: string }
  | { type: 'folder'; name: string; children: TreeNode[] };

const tree: TreeNode[] = [
  {
    type: 'folder',
    name: 'app',
    children: [
      {
        type: 'folder',
        name: 'api',
        children: [
          { type: 'folder', name: 'hello', children: [{ type: 'file', name: 'route.ts' }] },
          { type: 'file', name: 'page.tsx' },
          { type: 'file', name: 'layout.tsx' },
          { type: 'folder', name: 'blog', children: [{ type: 'file', name: 'page.tsx' }] }
        ]
      }
    ]
  },
  {
    type: 'folder',
    name: 'components',
    children: [
      {
        type: 'folder',
        name: 'ui',
        children: [
          { type: 'file', name: 'button.tsx' },
          { type: 'file', name: 'card.tsx' }
        ]
      },
      { type: 'file', name: 'header.tsx' },
      { type: 'file', name: 'footer.tsx' }
    ]
  },
  {
    type: 'folder',
    name: 'components',
    children: [
      {
        type: 'folder',
        name: 'ui',
        children: [
          { type: 'file', name: 'button.tsx' },
          { type: 'file', name: 'card.tsx' }
        ]
      },
      { type: 'file', name: 'header.tsx' },
      { type: 'file', name: 'footer.tsx' }
    ]
  },
  {
    type: 'folder',
    name: 'components',
    children: [
      {
        type: 'folder',
        name: 'ui',
        children: [
          { type: 'file', name: 'button.tsx' },
          { type: 'file', name: 'card.tsx' }
        ]
      },
      { type: 'file', name: 'header.tsx' },
      { type: 'file', name: 'footer.tsx' }
    ]
  },
  {
    type: 'folder',
    name: 'components',
    children: [
      {
        type: 'folder',
        name: 'ui',
        children: [
          { type: 'file', name: 'button.tsx' },
          { type: 'file', name: 'card.tsx' }
        ]
      },
      { type: 'file', name: 'header.tsx' },
      { type: 'file', name: 'footer.tsx' }
    ]
  },
  { type: 'folder', name: 'lib', children: [{ type: 'file', name: 'util.ts' }] },
  {
    type: 'folder',
    name: 'public',
    children: [
      { type: 'file', name: 'favicon.ico' },
      { type: 'file', name: 'vercel.svg' }
    ]
  },
  { type: 'file', name: '.eslintrc.json' },
  { type: 'file', name: '.gitignore' },
  { type: 'file', name: 'next.config.js' },
  { type: 'file', name: 'tailwind.config.js' },
  { type: 'file', name: 'package.json' },
  { type: 'file', name: 'README.md' }
];

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
            {tree.map((item, index) => (
              <Tree key={index} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}

function Tree({ item, path = '' }: { item: TreeNode; path?: string }) {
  const { addTab, tabs, setActiveTab } = useTabs();

  const currentPath = path ? `${path}/${item.name}` : item.name;

  const handleFileClick = () => {
    const existingTab = tabs.find(
      tab => tab.data && (tab.data as FilePreviewData).path === currentPath
    );

    if (existingTab) {
      setActiveTab(existingTab.id);
      return;
    }

    // Otherwise, create a new tab
    const fileData: FilePreviewData = {
      path: currentPath,
      name: item.name,
      type: 'file'
    };

    addTab({
      title: item.name,
      component: FilePreviewTab,
      closable: true,
      data: fileData
    });
  };

  if (item.type === 'file') {
    return (
      <SidebarMenuButton
        isActive={false}
        className="data-[active=true]:bg-transparent"
        onClick={handleFileClick}
      >
        <FileIcon />
        {item.name}
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen={item.name === 'components' || item.name === 'ui'}
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <ChevronRightIcon className="transition-transform" />
            <FolderIcon />
            {item.name}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children.map((subItem, index) => (
              <Tree key={index} item={subItem} path={currentPath} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}
