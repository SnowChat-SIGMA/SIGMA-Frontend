import type { Field } from '../types';

export interface PopularEntry {
  noticeId: string;
  views: number;
  postedAt: string;
  pinned?: boolean;
}

export interface PopularField {
  collected: boolean;
  entries: PopularEntry[];
}

export const COLLECTED_AT = '2026.11.3.';

// 분야별 인기 공지 (나중에 백엔드 API로 바꿀 부분)
export const POPULAR: Record<Field, PopularField> = {
  '행사·프로그램': {
    collected: true,
    entries: [
      { noticeId: 'acad', views: 513, postedAt: '2026.10.22' },
      { noticeId: 'gemini', views: 402, postedAt: '2026.10.15' },   // 지난 행사 → 화면에서 빠짐
      { noticeId: 'mentor', views: 377, postedAt: '2026.09.25' },   // 지난 행사 → 화면에서 빠짐
      { noticeId: 'tour', views: 36, postedAt: '2026.10.30' },
    ],
  },
  '졸업': {
    collected: true,
    entries: [
      { noticeId: 'grad', views: 8508, postedAt: '2026.09.03', pinned: true },
      { noticeId: 'exam', views: 1195, postedAt: '2026.10.12' },
      { noticeId: 'thesis', views: 960, postedAt: '2026.09.29' },   // 지난 행사 → 화면에서 빠짐
    ],
  },
  '학사·교무': {
    collected: false,
    entries: [],
  },
  '장학·등록': {
    collected: true,
    entries: [],
  },
};