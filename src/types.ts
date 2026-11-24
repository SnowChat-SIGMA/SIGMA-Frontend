export type NoticeKind = 'event' | 'application' | 'schedule' | 'notice';
export type BadgeType = 'new' | 'open' | 'past';
export type Verdict = '해당' | '비해당' | '확인 필요';

export interface Fact {
  label: string;
  value: string | null; // null이면 "원문에 없음 [확인 필요]"
  verdict?: Verdict;
}

export interface Stage {
  name: string;
  when: string;
  status: 'done' | 'now' | 'next';
}

export interface Notice {
  id: string;
  kind: NoticeKind;
  badges: BadgeType[];
  office: string;
  title: string;
  contact: string;
  url: string;
  facts: Fact[];
  warning?: string;
  stages?: Stage[];
}

/* ---------- 내 라이브러리 (LIB) ---------- */

export type Field = '행사·프로그램' | '졸업' | '학사·교무' | '장학·등록';

// 달력과 D-day에 쓰는 일정 하나
export interface ScheduleItem {
  date: string;
  type: 'deadline' | 'event';   // deadline = 마감(주황 점), event = 행사·일정(파랑 점)
  text: string;
  ddayLabel: string;   // D-day 박스 위 이름 (신청 마감, 취소 기한, 행사일 …)
  weekLabel?: string;  // 주 단위 일정이면 '12월 둘째 주'처럼 적음 (달력에 점 없음)
}

// 저장한 공지에만 붙는 정보
export interface LibraryInfo {
  field: Field;
  change?: string;     // 원문이 수정됐을 때 바뀐 내용 (LIB-05)
  deleted?: boolean;   // 원문이 삭제됐을 때 (LIB-05)
  schedule: ScheduleItem[];
}