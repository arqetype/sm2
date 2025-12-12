import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { AiSettingsForm } from './ai-settings-form';

export function SettingsTab() {
  return (
    <div>
      <Tabs defaultValue="ai">
        <TabsList className="w-full justify-start bg-background border-b rounded-none mt-2 px-3 pb-2 h-10 gap-2">
          <TabsTrigger value="ai" className="flex-0">
            Artificial Intelligence
          </TabsTrigger>
          <TabsTrigger value="bind" className="flex-0">
            Bindings
          </TabsTrigger>
          <TabsTrigger value="other" className="flex-0">
            Other
          </TabsTrigger>
        </TabsList>
        <TabsContent value="ai">
          <AiSettingsForm />
        </TabsContent>
        <TabsContent value="bind">
          test
        </TabsContent>
        <TabsContent value="other">
          test
        </TabsContent>
      </Tabs>
    </div>
  );
}
