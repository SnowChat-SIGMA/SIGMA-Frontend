import { useState } from 'react';
import type { Notice, Stage } from '../types';
import { VerdictTag } from './Badge';
import styles from './NoticeDetail.module.css';

const STAGE_LABEL: Record<Stage['status'], string> = {
  done: '지남',
  now: '진행 중',
  next: '예정',
};

export default function NoticeDetail({ notice }: { notice: Notice }) {
  const [timelineOpen, setTimelineOpen] = useState(false);

  return (
    <div className={styles.body}>
      <dl className={styles.facts}>
        {notice.facts.map((f) => (
          <div key={f.label} className={styles.row}>
            <dt>{f.label}</dt>
            {f.value ? (
              <dd>
                {f.value}
                {f.verdict && <VerdictTag verdict={f.verdict} />}
              </dd>
            ) : (
              <dd className={styles.missing}>
                원문에 없음
                <VerdictTag verdict="확인 필요" />
              </dd>
            )}
          </div>
        ))}
        <div className={styles.row}>
          <dt>문의처</dt>
          <dd>{notice.contact}</dd>
        </div>
      </dl>

      {notice.warning && (
        <div role="note" className={styles.warning}>
          <strong>주의</strong> · {notice.warning}
        </div>
      )}

      {notice.stages && (
        <div className={styles.timeline}>
          <button
            type="button"
            className={styles.timelineToggle}
            aria-expanded={timelineOpen}
            onClick={() => setTimelineOpen(!timelineOpen)}
          >
            전체 일정
            <span className={styles.toggleLabel}>
              {timelineOpen ? '접기' : '펼치기'}
              <svg
                className={timelineOpen ? `${styles.chevron} ${styles.chevronOpen}` : styles.chevron}
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
            </span>
          </button>

          {timelineOpen && (
            <ol className={styles.stages}>
              {notice.stages.map((s) => (
                <li key={s.name} className={`${styles.stage} ${styles[s.status]}`}>
                  <span className={styles.dot} />
                  <span className={styles.stageText}>
                    <span className={styles.stageName}>{s.name}</span>
                    <span className={styles.when}>{s.when}</span>
                  </span>
                  <span className={styles.stageStatus}>{STAGE_LABEL[s.status]}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}