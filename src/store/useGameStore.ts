import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  hasVisitedBefore: boolean;
  unlockedDistricts: string[];
  currentZone: string;
  activeInteraction: string | null;
  
  // Actions
  markVisited: () => void;
  unlockDistrict: (districtId: string) => void;
  setCurrentZone: (zoneId: string) => void;
  setActiveInteraction: (interactionId: string | null) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      hasVisitedBefore: false,
      unlockedDistricts: ['SkyFoundry'], // Spawn is always unlocked
      currentZone: 'SkyFoundry',
      activeInteraction: null,
      
      markVisited: () => set({ hasVisitedBefore: true }),
      
      unlockDistrict: (districtId) => set((state) => ({
        unlockedDistricts: state.unlockedDistricts.includes(districtId) 
          ? state.unlockedDistricts 
          : [...state.unlockedDistricts, districtId]
      })),
      
      setCurrentZone: (zoneId) => set({ currentZone: zoneId }),
      setActiveInteraction: (interactionId) => set({ activeInteraction: interactionId }),
    }),
    {
      name: 'aether-creator-protocol', // The key in localStorage
    }
  )
);
