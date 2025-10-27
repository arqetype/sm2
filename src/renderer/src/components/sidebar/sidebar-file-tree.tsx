import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub
} from '@/components/ui/sidebar';
import { ChevronRightIcon, FileIcon, ListCollapseIcon, RefreshCcwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTabs } from '@/hooks/use-tabs';
import { FilePreviewTab } from '@/components/navigation/tab-file-preview';
import { useIpcMutation, useIpcQuery } from '@/hooks/use-ipc-query';
import type { TreeNode, FilePreviewData } from '../../../../_shared/types/file-tree';

export function SidebarFileTree() {
  const openDirectory = useIpcMutation('file-tree:open-directory');
  const scanDirectory = useIpcQuery(
    'file-tree:scan-directory',
    openDirectory.data && 'path' in openDirectory.data ? openDirectory.data.path : null
  );

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
        <Button
          size="icon-sm"
          disabled={
            scanDirectory.isPending || scanDirectory.isRefetching || scanDirectory.isLoading
          }
        >
          <RefreshCcwIcon />
          <span className="sr-only">Refresh the files</span>
        </Button>
        <Button size="icon-sm">
          <ListCollapseIcon />
          <span className="sr-only">Collapse all</span>
        </Button>
      </SidebarMenuItem>
      <SidebarGroup className="flex-1 overflow-y-auto overflow-x-hidden">
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
        className="overflow-hidden mr-0 pr-0"
        onClick={handleFileClick}
      >
        <FileIcon />
        <span>{item.name}</span>
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuItem className="mr-0">
      <Collapsible className="[&[data-state=open]>button>svg:first-child]:rotate-90">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="overflow-hidden mr-0 pr-0">
            <ChevronRightIcon className="transition-transform" />
            <span>{item.name}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="mr-0 pr-0">
            {item.children.map((subItem, index) => (
              <Tree key={index} item={subItem} path={currentPath} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}
