import { create } from 'zustand';

export const useBlueprintStore = create<{
  isBlueprintMode: boolean;
  toggleBlueprintMode: () => void;
}>((set) => ({
  isBlueprintMode: false,
  toggleBlueprintMode: () => set((state) => ({ isBlueprintMode: !state.isBlueprintMode }))
}));
