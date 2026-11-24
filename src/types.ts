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