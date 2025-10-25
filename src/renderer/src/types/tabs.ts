export interface Tab {
  id: string;
  title: string;
  component: React.ComponentType<TabComponentProps>;
  closable?: boolean;
}

export interface TabComponentProps {
  tabId: string;
}

export interface TabStore {
  tabs: Tab[];
  activeTab: string | null;
  defaultTabComponent?: React.ComponentType<TabComponentProps>;
  setActiveTab: (id: string) => void;
  addTab: (tab: Omit<Tab, 'id'> & { id?: string }) => string;
  removeTab: (id: string) => boolean;
  updateTab: (id: string, updates: Partial<Omit<Tab, 'id'>>) => boolean;
  nextTab: () => void;
  prevTab: () => void;
  createNewTab: () => string;
}
