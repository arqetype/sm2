import { create } from 'zustand';
import type { FilePreviewData } from '../../../_shared/types/file-tree';

export const MAX_SELECTED_FILES = 5;

interface SelectedFilesState {
  selectedFiles: FilePreviewData[];
  addFile: (file: FilePreviewData) => void;
  removeFile: (path: string) => void;
  clearFiles: () => void;
  hasFile: (path: string) => boolean;
  isLimitReached: () => boolean;
}

export const useSelectedFiles = create<SelectedFilesState>((set, get) => ({
  selectedFiles: [],

  addFile: file => {
    const { selectedFiles } = get();
    if (
      !selectedFiles.some(f => f.path === file.path) &&
      selectedFiles.length < MAX_SELECTED_FILES
    ) {
      set({ selectedFiles: [...selectedFiles, file] });
    }
  },

  removeFile: path => {
    set(state => ({
      selectedFiles: state.selectedFiles.filter(f => f.path !== path)
    }));
  },

  clearFiles: () => {
    set({ selectedFiles: [] });
  },

  hasFile: path => {
    const { selectedFiles } = get();
    return selectedFiles.some(f => f.path === path);
  },

  isLimitReached: () => {
    const { selectedFiles } = get();
    return selectedFiles.length >= MAX_SELECTED_FILES;
  }
}));
