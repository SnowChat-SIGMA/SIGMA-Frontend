import type { LibraryInfo } from '../types';

export const LIBRARY_INFO: Record<string, LibraryInfo> = {
  acad: {
    field: '행사·프로그램',
    change: '11/26 회차 시작 15:00 → 16:00',
    schedule: [
      { date: '2026-11-03', type: 'deadline', ddayLabel: '취소 기한', text: '아카데미 11/5 회차 취소 기한' },
      { date: '2026-11-05', type: 'event', ddayLabel: '행사일', text: '아카데미 Microsoft 회차' },
      { date: '2026-11-12', type: 'event', ddayLabel: '행사일', text: '아카데미 AWS 회차' },
      { date: '2026-11-24', type: 'deadline', ddayLabel: '취소 기한', text: '아카데미 11/26 회차 취소 기한' },
      { date: '2026-11-26', type: 'event', ddayLabel: '행사일', text: '아카데미 LG CNS 회차' },
      { date: '2026-12-01', type: 'deadline', ddayLabel: '취소 기한', text: '아카데미 12/3 회차 취소 기한' },
      { date: '2026-12-03', type: 'event', ddayLabel: '행사일', text: '아카데미 SAP 회차' },
    ],
  },
  exam: {
    field: '졸업',
    schedule: [
      { date: '2026-11-13', type: 'deadline', ddayLabel: '신청 마감', text: '졸업시험(2차) 신청 마감' },
      { date: '2026-11-27', type: 'event', ddayLabel: '시험일', text: '졸업시험 11:00~14:00' },
      { date: '2026-12-07', type: 'event', ddayLabel: '결과 발표', text: '졸업시험 결과', weekLabel: '12월 둘째 주' },
    ],
  },
  tour: {
    field: '행사·프로그램',
    schedule: [
      { date: '2026-11-27', type: 'event', ddayLabel: '행사일', text: '아우모비오 플랜트 투어' },
    ],
  },
  grad: {
    field: '졸업',
    schedule: [
      { date: '2026-12-01', type: 'event', ddayLabel: '다음 단계', text: '졸업논문제 최종 증빙 제출 시작' },
      { date: '2026-12-30', type: 'deadline', ddayLabel: '제출 마감', text: '졸업논문제 최종 증빙 제출 마감' },
    ],
  },
  gemini: {
    field: '행사·프로그램',
    deleted: true,
    schedule: [
      { date: '2026-10-29', type: 'event', ddayLabel: '행사일', text: '구글 Gemini Academy' },
    ],
  },
  thesis: {
    field: '졸업',
    schedule: [
      { date: '2026-10-19', type: 'deadline', ddayLabel: '신청 마감', text: '졸업논문제 신청 마감' },
    ],
  },
  mentor: {
    field: '행사·프로그램',
    schedule: [
      { date: '2026-10-06', type: 'event', ddayLabel: '행사일', text: '여성 엔지니어 멘토링' },
    ],
  },
};