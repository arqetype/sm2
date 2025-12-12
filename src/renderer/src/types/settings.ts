import { z } from "zod";

export const aiSettingsSchema = z.object({
    lmStudio: z.boolean(),
    lmStudioAddress: z.url(),
    oLlama: z.boolean(),
    oLlamaAddress: z.url()
});

export type AiSettingsSchema = z.infer<typeof aiSettingsSchema>;