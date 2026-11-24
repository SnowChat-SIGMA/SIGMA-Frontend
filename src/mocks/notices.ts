import type { Notice } from '../types';

export const NOTICES: Notice[] = [
  {
    id: 'tour', kind: 'event', badges: ['new', 'open'],
    office: '대학일자리플러스센터', title: '아우모비오(AUMOVIO) 코리아 플랜트 투어',
    contact: '대학일자리플러스센터', url: '#',
    facts: [
      { label: '일시', value: '11/27(금) 07:00~18:00' },
      { label: '장소', value: '세종 플랜트 (교내에서 단체 이동)' },
      { label: '내용', value: '회사·UX 사업본부 소개, 플랜트 투어, 현장 엔지니어·UX 담당 임직원과의 소통' },
      { label: '대상', value: '모빌리티 산업·직무 관심 학생', verdict: '해당' },
      { label: '신청 방법', value: '원문 공지의 신청 링크' },
      { label: '신청 마감', value: null },
    ],
  },
  {
    id: 'acad', kind: 'event', badges: ['open'],
    office: '경력개발처 인재개발팀', title: '숙명여대와 함께하는 현직 5인 AI tech 산업 탐색 아카데미',
    contact: '경력개발처 인재개발팀', url: '#',
    facts: [
      { label: '일시', value: '10/29부터 5회차 · 회차별 15:00~17:00' },
      { label: '장소', value: '미래창조관 202호' },
      { label: '내용', value: '현직자가 소개하는 AI 산업·직무 (11/5 Microsoft, 11/12 AWS, 11/26 LG CNS, 12/3 SAP 등)' },
      { label: '대상', value: '재학생(학년·전공 무관)·휴학생·졸업생', verdict: '해당' },
      { label: '신청 방법', value: '회차별 개별 신청' },
      { label: '신청 마감', value: '회차별 상이 · 취소 기한 행사 2일 전' },
    ],
    warning: '무단 불참 시 1개월간 진로취업 비교과 참여가 제한돼요. 못 가게 되면 취소 기한 안에 취소하세요.',
  },
  {
    id: 'gemini', kind: 'event', badges: ['past'],
    office: '대학일자리플러스센터', title: '구글 Gemini Academy',
    contact: '대학일자리플러스센터', url: '#',
    facts: [
      { label: '일시', value: '10/29(목)' },
      { label: '대상', value: '재학생', verdict: '해당' },
    ],
    warning: '무단 불참 시 1개월간 진로취업 비교과 참여가 제한돼요.',
  },
  {
    id: 'exam', kind: 'schedule', badges: ['open'],
    office: '수학과', title: '2026학년도 전기(2027년 2월) 졸업 졸업시험(2차) 신청 공지',
    contact: '수학과 사무실', url: '#',
    facts: [
      { label: '지금 단계', value: '졸업시험(2차) 신청 · 10/12 ~ 11/13(금)' },
      { label: '다음 단계', value: '졸업시험 · 11/27(금) 11:00~14:00 · 사회교육관 417호' },
      { label: '대상', value: '수학과 8학기 이상 졸업 예정자', verdict: '해당' },
    ],
    warning: '필수 단계 · 과목이 모두 면제돼도 졸업시험을 신청하지 않으면 졸업논문제 합격 처리가 되지 않아요.',
    stages: [
      { name: '졸업논문제 신청', when: '10/6 ~ 10/19 · 숙명포털', status: 'done' },
      { name: '졸업시험(2차) 신청', when: '10/12 ~ 11/13 · 학과 공식 메일', status: 'now' },
      { name: '졸업시험', when: '11/27 11:00~14:00 · 사회교육관 417호', status: 'next' },
      { name: '졸업시험 결과', when: '12월 둘째 주 이내 · 메일', status: 'next' },
      { name: '졸업논문제 최종 증빙 제출', when: '12/1 ~ 12/30 · 학과사무실', status: 'next' },
    ],
  },
  {
    id: 'thesis', kind: 'application', badges: ['past'],
    office: '수학과', title: '2026학년도 전기(2027년 2월 졸업) 졸업논문제 신청 안내',
    contact: '수학과 사무실', url: '#',
    facts: [
      { label: '신청 기간', value: '10/6 ~ 10/19' },
      { label: '대상·자격', value: '2027년 2월 졸업 예정자', verdict: '해당' },
      { label: '신청 경로', value: '숙명포털' },
    ],
  },
  {
    id: 'mentor', kind: 'event', badges: ['past'],
    office: '대학일자리플러스센터', title: 'GMTCK-SWE-SMWU 함께하는 여성 엔지니어 멘토링 프로그램',
    contact: '대학일자리플러스센터', url: '#',
    facts: [
      { label: '일시', value: '10/6' },
      { label: '대상', value: '이공계 재학생', verdict: '확인 필요' },
    ],
  },
  {
    id: 'grad', kind: 'schedule', badges: [],
    office: '대표 홈페이지 주요공지', title: '2026-2 (2027년 2월) 주요 졸업 일정 안내 (8학기 이상 재학생 필독)',
    contact: '이과대학 02-710-9019', url: '#',
    facts: [
      { label: '지금 단계', value: '졸업논문제 신청 마감 (10/19), 다음 단계 대기 중' },
      { label: '다음 단계', value: '졸업논문제 최종 증빙 제출 · 12/1 ~ 12/30' },
      { label: '대상', value: '8학기 이상 재학생', verdict: '해당' },
    ],
    stages: [
      { name: '졸업계획 입력·전공선택', when: '9/15 ~ 9/28 · 숙명포털', status: 'done' },
      { name: '졸업논문제 신청', when: '10/6 ~ 10/19 · 숙명포털', status: 'done' },
      { name: '졸업논문제 최종 증빙 제출', when: '12/1 ~ 12/30', status: 'next' },
      { name: '졸업인증제 심사결과 확인', when: '1/7 ~ 1/8 · 숙명포털', status: 'next' },
      { name: '영문성명 확인', when: '1/13 ~ 1/31 · 숙명포털', status: 'next' },
      { name: '최종 졸업심사 결과', when: '1/28 ~ 1/29 · 숙명포털', status: 'next' },
    ],
  },
];