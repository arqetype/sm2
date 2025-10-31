import { create } from 'zustand';

interface CommandState {
  commandOpen: boolean;
  toggleCommand: () => void;
}

export const useCommandStore = create<CommandState>(set => ({
  commandOpen: false,
  toggleCommand: () => set(s => ({ commandOpen: !s.commandOpen }))
}));
