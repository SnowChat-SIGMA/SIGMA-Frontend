import type { Field } from '../types';

export const INTEREST_GROUPS: { field: Field; chips: string[] }[] = [
  { field: '행사·프로그램', chips: ['진로·취업', '비교과·특강', '공모전·대외활동'] },
  { field: '졸업', chips: ['졸업 요건·심사', '졸업시험·논문'] },
  { field: '학사·교무', chips: ['수강신청', '휴학·복학', '학점교류·전과'] },
  { field: '장학·등록', chips: ['교내 장학', '교외 장학', '등록금'] },
];

export const COLLEGES: Record<string, string[]> = {
  '문과대학': [
    '한국어문학부',
    '역사문화학과',
    '프랑스언어·문화학과',
    '중어중문학부',
    '독일언어·문화학과',
    '일본학과',
    '문헌정보학과',
    '문화관광외식학부 문화관광학전공',
    '문화관광외식학부 르꼬르동블루외식경영전공',
    '교육학부',
  ],
  '이과대학': ['화학과', '생명시스템학부', '수학과', '통계학과', '체육교육과', '무용과'],
  '공과대학': [
    '화공생명공학부',
    '인공지능공학부',
    '지능형전자시스템학부',
    '신소재물리학부',
    '소프트웨어학부 컴퓨터과학전공',
    '소프트웨어학부 데이터사이언스전공',
    '기계시스템학부',
    '첨단공학부',
  ],
  '생활과학대학': ['가족자원경영학과', '아동복지학부', '의류학과', '식품영양학과'],
  '사회과학대학': ['정치외교학과', '행정학과', '홍보광고학과', '소비자경제학과', '사회심리학과'],
  '법과대학': ['법학부'],
  '경상대학': ['경제학부', '경영학부'],
  '음악대학': ['피아노과', '관현악과', '성악과', '작곡과'],
  '약학대학': ['약학부'],
  '미술대학': ['시각·영상디자인과', '산업디자인과', '환경디자인과', '공예과', '회화과'],
  '한류국제대학': ['융합국제학부', '한류국제학부'],
  '글로벌서비스학부': ['글로벌협력전공', '앙트러프러너십전공'],
  '영어영문학부': ['영어영문학전공', '테슬(TESL)전공'],
  '미디어학부': ['미디어학부'],
};

export const ALL_DEPTS = Object.values(COLLEGES).flat();

export const STATUSES = ['재학', '휴학', '수료'] as const;
export const SEMESTERS = ['1~2학기', '3~4학기', '5~6학기', '7~8학기', '9학기 이상'];
export const ENTRY_TYPES = ['신입학', '편입학'];

function makeEntryYears(span = 6) {
  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: span }, (_, i) => String(thisYear - i));
  return [...years, `${thisYear - span} 이전`];
}
export const ENTRY_YEARS = makeEntryYears();

function makeGraduations(count = 14) {
  const now = new Date();
  let year = now.getFullYear();
  const month = now.getMonth() + 1;
  let isFeb: boolean;
  if (month <= 2) {
    isFeb = true;
  } else if (month <= 8) {
    isFeb = false;
  } else {
    year += 1;
    isFeb = true;
  }

  const list: string[] = [];
  for (let i = 0; i < count; i++) {
    list.push(`${year}년 ${isFeb ? 2 : 8}월`);
    if (!isFeb) year += 1;
    isFeb = !isFeb;
  }
  return list;
}
export const GRADUATIONS = makeGraduations();