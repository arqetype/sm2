import { AiSettingsSchema } from "@/types/settings";
import { create } from "zustand";

interface SettingsStore {
    aiSettings: AiSettingsSchema;
    setAiSettings: (settings: AiSettingsSchema) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
    aiSettings: {
        lmStudio: false,
        lmStudioAddress: 'http://localhost:1234',
        oLlama: false,
        oLlamaAddress: 'http://localhost:11434'
    },
    setAiSettings: (settings: AiSettingsSchema) => set({ aiSettings: settings }),
}));
