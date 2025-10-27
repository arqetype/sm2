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
import { Button } from '@/components/ui/button';
import { useTabs } from '@/hooks/use-tabs';
import { FilePreviewTab, type FilePreviewData } from '@/components/navigation/tab-file-preview';
import { useIpcMutation } from '@/hooks/use-ipc-query';
import { useEffect } from 'react';
import type { TreeNode } from '../../../../_shared/types/file-tree';

export function SidebarFileTree() {
  const openDirectory = useIpcMutation('file-tree:open-directory');
  const scanDirectory = useIpcMutation('file-tree:scan-directory');

  useEffect(() => {
    if (openDirectory.data && !('error' in openDirectory.data)) {
      scanDirectory.mutate(openDirectory.data.path);
    }
  }, [openDirectory.data]);

  useEffect(() => {
    console.log(scanDirectory.data);
  }, [scanDirectory.data]);

  return (
    <>
      <SidebarMenuItem className="flex items-center justify-evenly">
        <Button
          size="sm"
          variant={'outline'}
          onClick={() => openDirectory.mutate()}
          disabled={openDirectory.isPending}
        >
          Open another folder
        </Button>
        <Button size="icon-sm" disabled={scanDirectory.isPending}>
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
            {scanDirectory.data &&
              !('error' in scanDirectory.data) &&
              scanDirectory.data.tree.map((item, index) => <Tree key={index} item={item} />)}
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
