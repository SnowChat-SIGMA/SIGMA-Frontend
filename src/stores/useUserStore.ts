import { create } from 'zustand';

export type StudentStatus = '' | '재학' | '휴학' | '수료';
export type DeptNotice = '' | '받기' | '안 받기';

export interface AcademicProfile {
  college: string;      // 소속 단과대학
  dept: string;         // 학과(전공)
  status: StudentStatus;
  semester: string;     // 현재 학기
  entryYear: string;    // 입학연도
  entryType: string;    // 입학 구분 (신입학/편입학)
  graduation: string;   // 졸업 예정
  minor: string;        // 복수·부전공
  deptNotice: DeptNotice;
}

export const EMPTY_PROFILE: AcademicProfile = {
  college: '',
  dept: '',
  status: '',
  semester: '',
  entryYear: '',
  entryType: '',
  graduation: '',
  minor: '',
  deptNotice: '',
};

// 목데이터
const INITIAL_PROFILE: AcademicProfile = {
  college: '이과대학',
  dept: '수학과',
  status: '재학',
  semester: '7~8학기',
  entryYear: '2023',
  entryType: '신입학',
  graduation: '2027년 2월',
  minor: '',
  deptNotice: '받기',
};

// 학적 정보를 하나라도 입력했는지
function hasAnyValue(profile: AcademicProfile) {
  return Object.values(profile).some((v) => v !== '');
}

interface UserState {
  interests: string[];
  profile: AcademicProfile;
  hasAcademicInfo: boolean;
  pushEnabled: boolean;
  setInterests: (interests: string[]) => void;
  setProfile: (profile: AcademicProfile) => void;
  setPushEnabled: (on: boolean) => void;
  resetAll: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  interests: ['진로·취업', '교내 장학', '졸업 요건·심사'],
  profile: INITIAL_PROFILE,
  hasAcademicInfo: hasAnyValue(INITIAL_PROFILE),
  pushEnabled: true,
  setInterests: (interests) => set({ interests }),
  setProfile: (profile) => set({ profile, hasAcademicInfo: hasAnyValue(profile) }),
  setPushEnabled: (pushEnabled) => set({ pushEnabled }),
  resetAll: () => set({ interests: [], profile: EMPTY_PROFILE, hasAcademicInfo: false, pushEnabled: false }),
}));