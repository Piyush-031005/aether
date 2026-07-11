import { create } from 'zustand';

interface JoystickState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  
  // Update inputs directly
  setInputs: (inputs: Partial<Omit<JoystickState, 'setInputs'>>) => void;
}

export const useJoystickStore = create<JoystickState>((set) => ({
  forward: false,
  backward: false,
  left: false,
  right: false,
  
  setInputs: (inputs) => set((state) => ({ ...state, ...inputs })),
}));
