# Tab System Documentation

## Overview

The tab system supports passing typed data to tab components, allowing you to create dynamic, context-aware tabs. This is useful for scenarios like file previews, process details, or any content that requires specific data.

## Architecture

### Key Components

- **Tab Types** (`types/tabs.ts`): Type-safe interfaces with generic support
- **Tab Store** (`store/tabs.ts`): Zustand store managing tab state
- **Tab Panels** (`components/navigation/tabs-panels.tsx`): Renders tab content with data
- **useTabs Hook** (`hooks/use-tabs.ts`): Access tab store from components

## Passing Data to Tabs

### 1. Define Your Data Type

```typescript
interface MyTabData {
  id: string;
  title: string;
  // ... other fields
}
```

### 2. Create a Tab Component

```typescript
import type { TabComponentProps } from '@/types/tabs';

export function MyTabComponent({ tabId, data }: TabComponentProps<MyTabData>) {
  if (!data) {
    return <div>No data available</div>;
  }

  const { id, title } = data;

  return (
    <div>
      <h1>{title}</h1>
      <p>ID: {id}</p>
    </div>
  );
}
```

### 3. Open a Tab with Data

```typescript
import { useTabs } from '@/hooks/use-tabs';
import { MyTabComponent, type MyTabData } from './my-tab-component';

function MyComponent() {
  const { addTab } = useTabs();

  const openTab = (data: MyTabData) => {
    addTab({
      title: data.title,
      component: MyTabComponent,
      closable: true,
      data: data // Type-safe data passing
    });
  };

  return (
    <button onClick={() => openTab({ id: '123', title: 'My Tab' })}>
      Open Tab
    </button>
  );
}
```

## Best Practices

### 1. Type Safety

Always use TypeScript generics to maintain type safety:

```typescript
// ✅ Good - Type-safe
function MyTab({ data }: TabComponentProps<MyTabData>) {
  // data is MyTabData | undefined
}

// ❌ Bad - Loses type information
function MyTab({ data }: TabComponentProps) {
  // data is unknown
}
```

### 2. Handle Missing Data

Always check if data exists before using it:

```typescript
function MyTab({ data }: TabComponentProps<MyTabData>) {
  if (!data) {
    return <div>Loading...</div>;
  }
  
  // Safe to use data here
  return <div>{data.title}</div>;
}
```

### 3. Prevent Duplicate Tabs

Check if a tab with the same data already exists:

```typescript
const { tabs, setActiveTab, addTab } = useTabs();

const openTab = (data: MyTabData) => {
  // Check for existing tab
  const existingTab = tabs.find(
    tab => tab.data && (tab.data as MyTabData).id === data.id
  );

  if (existingTab) {
    setActiveTab(existingTab.id);
    return;
  }

  // Create new tab
  addTab({
    title: data.title,
    component: MyTabComponent,
    data: data
  });
};
```

### 4. Update Tab Data

Use `updateTab` to modify existing tab data:

```typescript
const { updateTab } = useTabs();

const updateTabData = (tabId: string, newData: MyTabData) => {
  updateTab(tabId, {
    data: newData,
    title: newData.title // Optional: update title too
  });
};
```

### 5. Clean Component Design

Separate data fetching from presentation:

```typescript
// ✅ Good - Receives data as prop
function FilePreview({ data }: TabComponentProps<FileData>) {
  return <div>{data?.name}</div>;
}

// ❌ Bad - Fetches data internally without coordination
function FilePreview({ tabId }: TabComponentProps) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchData(tabId).then(setData);
  }, [tabId]);
  return <div>{data?.name}</div>;
}
```

## Examples

### File Preview Tab

See `tab-file-preview.tsx` for a complete example of:
- Typed data interface (`FilePreviewData`)
- Null data handling
- Rich preview UI
- Using data in rendering

### Opening File Preview from Sidebar

See `sidebar-file-tree.tsx` for:
- Click handler integration
- Duplicate tab prevention
- Building file paths
- Activating existing tabs

## API Reference

### TabComponentProps<TData>

Props received by all tab components:

```typescript
interface TabComponentProps<TData = unknown> {
  tabId: string;      // Unique identifier for this tab
  data?: TData;       // Optional typed data
}
```

### addTab<TData>

Add a new tab with typed data:

```typescript
addTab({
  title: string;                              // Tab title
  component: ComponentType<TabComponentProps<TData>>;  // Tab component
  closable?: boolean;                         // Can be closed (default: true)
  data?: TData;                               // Optional data
  id?: string;                                // Optional custom ID
}) => string;  // Returns tab ID
```

### updateTab<TData>

Update an existing tab:

```typescript
updateTab(
  id: string,
  updates: {
    title?: string;
    component?: ComponentType<TabComponentProps<TData>>;
    closable?: boolean;
    data?: TData;
  }
) => boolean;  // Returns success status
```

### Other Tab Store Methods

```typescript
setActiveTab(id: string) => void;
removeTab(id: string) => boolean;
reorderTabs(fromId: string, toId: string) => boolean;
nextTab() => void;
prevTab() => void;
createNewTab() => string;
```

## Common Patterns

### 1. Multi-Step Form in Tab

```typescript
interface FormData {
  step: number;
  values: Record<string, any>;
}

function FormTab({ tabId, data }: TabComponentProps<FormData>) {
  const { updateTab } = useTabs();
  
  const nextStep = () => {
    if (!data) return;
    
    updateTab(tabId, {
      data: { ...data, step: data.step + 1 }
    });
  };
  
  return <FormStep data={data} onNext={nextStep} />;
}
```

### 2. Dynamic Tab Titles

```typescript
const openProcessTab = (process: ProcessData) => {
  addTab({
    title: `${process.name} (${process.status})`,
    component: ProcessTab,
    data: process
  });
};

// Update title when status changes
const updateProcessStatus = (tabId: string, status: string) => {
  const tab = tabs.find(t => t.id === tabId);
  if (!tab?.data) return;
  
  const processData = tab.data as ProcessData;
  updateTab(tabId, {
    title: `${processData.name} (${status})`,
    data: { ...processData, status }
  });
};
```

### 3. Context-Based Tabs

For complex state, combine data prop with React Context:

```typescript
interface TabContextData {
  initialData: MyData;
}

function TabWithContext({ data }: TabComponentProps<TabContextData>) {
  if (!data) return null;
  
  return (
    <MyContextProvider initialData={data.initialData}>
      <TabContent />
    </MyContextProvider>
  );
}
```

## Troubleshooting

### Data is undefined

- Ensure you're passing `data` when calling `addTab`
- Check that your component is properly typed: `TabComponentProps<YourDataType>`

### Type errors with generic data

- Make sure the data type matches between `addTab` call and component props
- Use type assertions if necessary: `tab.data as YourDataType`

### Tab not updating

- Use `updateTab` to modify existing tabs
- Ensure immutability: create new objects, don't mutate existing data

### Duplicate tabs

- Implement duplicate checking before calling `addTab`
- Use a unique identifier in your data to match existing tabs