declare global {
  interface Window {
    api: {
      ping: () => void;
    };
  }
}

export {};
