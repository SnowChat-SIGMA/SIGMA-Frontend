import { create } from 'zustand';

interface UserState {
  interests: string[];
  setInterests: (interests: string[]) => void;
}

export const useUserStore = create<UserState>((set) => ({
  interests: ['진로·취업', '교내 장학', '졸업 요건·심사'],
  setInterests: (interests) => set({ interests }),
}));