import type { BadgeType, Verdict } from '../types';
import styles from './Badge.module.css';

const STATUS_LABEL: Record<BadgeType, string> = {
  new: '새소식',
  open: '신청 가능',
  past: '지난 행사',
};

export function StatusBadge({ type }: { type: BadgeType }) {
  return <span className={`${styles.status} ${styles[type]}`}>{STATUS_LABEL[type]}</span>;
}

const VERDICT_CLASS: Record<Verdict, string> = {
  '해당': styles.match,
  '비해당': styles.noMatch,
  '확인 필요': styles.check,
};

export function VerdictTag({ verdict }: { verdict: Verdict }) {
  return <span className={`${styles.verdict} ${VERDICT_CLASS[verdict]}`}>{verdict}</span>;
}