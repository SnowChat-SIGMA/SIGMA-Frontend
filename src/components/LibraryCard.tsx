import type { LibraryInfo, Notice } from '../types';
import { useSavedStore } from '../stores/useSavedStore';
import { StatusBadge } from './Badge';
import NoticeDetail from './NoticeDetail';
import styles from './LibraryCard.module.css';

// D-day 박스에 보여 줄 내용
export interface DdayInfo {
  label: string;                                       // 위쪽 작은 글자 (신청 마감, 행사일 …)
  value: string;                                       // D-3, D-DAY, 종료, 일정 미정
  tone: 'normal' | 'urgent' | 'ended' | 'unknown';     // 박스 색
}

interface Props {
  notice: Notice;
  info: LibraryInfo;
  dday: DdayInfo;
  isPast: boolean;
  open: boolean;
  onToggle: () => void;
}

export default function LibraryCard({ notice, info, dday, isPast, open, onToggle }: Props) {
  const toggleSave = useSavedStore((s) => s.toggleSave);

  // 요약 2줄 = 상세 항목의 앞 두 개 (LIB-02)
  const summary = notice.facts
    .slice(0, 2)
    .map((f) => f.value)
    .filter(Boolean);

  const cardClass = [styles.card, isPast && styles.past, open && styles.open].filter(Boolean).join(' ');

  return (
    <article id={`lib-card-${notice.id}`} className={cardClass}>
      <button type="button" className={styles.head} aria-expanded={open} onClick={onToggle}>
        <span className={`${styles.dday} ${styles[dday.tone]}`}>
          {dday.label && <span className={styles.ddayLabel}>{dday.label}</span>}
          <span className={styles.ddayValue}>{dday.value}</span>
        </span>

        <span className={styles.body}>
          <span className={styles.meta}>
            {notice.badges.map((b) => <StatusBadge key={b} type={b} />)}
            {info.change && <span className={styles.changedBadge}>변경됨</span>}
            <span>{notice.office}</span>
          </span>
          <span className={styles.title}>{notice.title}</span>
          {summary.map((line, i) => (
            <span key={i} className={styles.summary}>{line}</span>
          ))}
          {info.change && <span className={styles.change}>변경됨 · {info.change}</span>}
          {info.deleted && <span className={styles.deleted}>원문이 삭제됐어요</span>}
        </span>

        <svg
          className={open ? `${styles.chevron} ${styles.chevronOpen}` : styles.chevron}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div className={styles.actions}>
        {!info.deleted && (
          <a href={notice.url} target="_blank" rel="noopener noreferrer" className={styles.smallButton}>
            원문 보기
          </a>
        )}
        <button type="button" className={styles.smallButton} onClick={() => toggleSave(notice.id)}>
          저장 해제
        </button>
      </div>

      {open && (
        <div className={styles.detail}>
          <NoticeDetail notice={notice} />
          {/* TODO: SNOWCHAT 실제 주소로 바꾸기 (LIB-08) */}
          <a href="#" target="_blank" rel="noopener noreferrer" className={styles.snowchat}>
            SNOWCHAT에 물어보기 ↗
          </a>
        </div>
      )}
    </article>
  );
}