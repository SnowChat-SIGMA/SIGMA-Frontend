import { create } from 'zustand';

interface UserState {
  interests: string[];
  hasAcademicInfo: boolean;   // 학적 정보를 하나라도 입력했는지
  setInterests: (interests: string[]) => void;
}

export const useUserStore = create<UserState>((set) => ({
  interests: ['진로·취업', '교내 장학', '졸업 요건·심사'],
  hasAcademicInfo: true,
  setInterests: (interests) => set({ interests }),
}));