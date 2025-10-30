export const remoteAiProviderKeys = ['openai', 'anthropic', 'google', 'mistral'] as const;
export const localAiProviderKeys = ['ollama', 'lm-studio'] as const;

export type RemoteAiProviderKey = (typeof remoteAiProviderKeys)[number];
export type LocalAiProviderKey = (typeof localAiProviderKeys)[number];

export type RemoteAiProvider = {
  id: RemoteAiProviderKey;
  name: string;
};

export type LocalAiProvider = {
  id: LocalAiProviderKey;
  name: string;
  baseUrl: `http://${string}`;
};

export const remoteAiProviders: RemoteAiProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI'
  },
  {
    id: 'anthropic',
    name: 'Anthropic'
  },
  {
    id: 'google',
    name: 'Google (Gemini)'
  },
  {
    id: 'mistral',
    name: 'Mistral AI'
  }
];

export const localAiProvider: LocalAiProvider[] = [
  {
    id: 'lm-studio',
    name: 'LM Studio',
    baseUrl: 'http://localhost'
  },
  {
    id: 'ollama',
    name: 'Ollama',
    baseUrl: 'http://localhost'
  }
];

export const allowedRemoteIds = new Set(remoteAiProviders.map(p => p.id));
export const allowedLocalIds = new Set(localAiProvider.map(p => p.id));
