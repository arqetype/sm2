import { useShallow } from 'zustand/react/shallow';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldLabel } from '../ui/field';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { aiSettingsSchema, AiSettingsSchema } from '../../types/settings';
import { useSettingsStore } from '../../store/settings';

export function AiSettingsForm() {
  const [aiSettings, setAiSettings] = useSettingsStore(
    useShallow((state) => [state.aiSettings, state.setAiSettings])
  );
  const form = useForm<AiSettingsSchema>({
    resolver: zodResolver(aiSettingsSchema),
    defaultValues: aiSettings,
    mode: 'onChange'
  });

  function onSubmit(data: AiSettingsSchema) {
    setAiSettings(data);
  }

  const triggerAutoSave = () => void form.handleSubmit(onSubmit)();

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-[800px] mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>LM Studio</CardTitle>
          <CardDescription>
            Configure connection to your local LM Studio instance
          </CardDescription>
          <CardAction>
            <Controller
              name="lmStudio"
              control={form.control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={(value) => {
                    field.onChange(value);
                    triggerAutoSave();
                  }}
                  disabled={field.disabled}
                  id="lm-studio-switch"
                />
              )}
            />
          </CardAction>
        </CardHeader>
        <CardContent>
          <Controller
            name="lmStudioAddress"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="lm-studio-address">Address</FieldLabel>
                <Input
                  name={field.name}
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    triggerAutoSave();
                  }}
                  disabled={!form.watch('lmStudio') || field.disabled}
                  id="lm-studio-address"
                  aria-invalid={!!fieldState.error}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ollama</CardTitle>
          <CardDescription>
            Configure connection to your local Ollama instance
          </CardDescription>
          <CardAction>
            <Controller
              name="oLlama"
              control={form.control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={(value) => {
                    field.onChange(value);
                    triggerAutoSave();
                  }}
                  disabled={field.disabled}
                  id="ollama-switch"
                />
              )}
            />
          </CardAction>
        </CardHeader>
        <CardContent>
          <Controller
            name="oLlamaAddress"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="ollama-address">Address</FieldLabel>
                <Input
                  name={field.name}
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    triggerAutoSave();
                  }}
                  disabled={!form.watch('oLlama') || field.disabled}
                  id="ollama-address"
                  aria-invalid={!!fieldState.error}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </CardContent>
      </Card>
    </form>
  );
}
