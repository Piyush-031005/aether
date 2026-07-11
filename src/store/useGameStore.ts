import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  hasVisitedBefore: boolean;
  unlockedDistricts: string[];
  currentZone: string;
  
  // Actions
  markVisited: () => void;
  unlockDistrict: (districtId: string) => void;
  setCurrentZone: (zoneId: string) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      hasVisitedBefore: false,
      unlockedDistricts: ['SkyFoundry'], // Spawn is always unlocked
      currentZone: 'SkyFoundry',
      
      markVisited: () => set({ hasVisitedBefore: true }),
      
      unlockDistrict: (districtId) => set((state) => ({
        unlockedDistricts: state.unlockedDistricts.includes(districtId) 
          ? state.unlockedDistricts 
          : [...state.unlockedDistricts, districtId]
      })),
      
      setCurrentZone: (zoneId) => set({ currentZone: zoneId }),
    }),
    {
      name: 'aether-creator-protocol', // The key in localStorage
    }
  )
);
