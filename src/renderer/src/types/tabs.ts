import type { ComponentType } from 'react';

export interface Tab<TData = unknown> {
  id: string;
  title: string;
  component: ComponentType<TabComponentProps<TData>>;
  closable?: boolean;
  data?: TData;
}

export interface TabComponentProps<TData = unknown> {
  tabId: string;
  data?: TData;
}

export interface TabStore {
  tabs: Tab[];
  activeTab: string | null;
  defaultTabComponent: ComponentType<TabComponentProps>;
  setActiveTab: (id: string) => void;
  addTab: <TData = unknown>(tab: Omit<Tab<TData>, 'id'> & { id?: string }) => string;
  removeTab: (id: string) => boolean;
  updateTab: <TData = unknown>(id: string, updates: Partial<Omit<Tab<TData>, 'id'>>) => boolean;
  reorderTabs: (fromId: string, toId: string) => boolean;
  nextTab: () => void;
  prevTab: () => void;
  createNewTab: () => string;
}
