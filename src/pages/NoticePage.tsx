import { useState, type UIEvent } from 'react';
import { Link } from 'react-router-dom';
import type { Notice } from '../types';
import { NOTICES } from '../mocks/notices';
import { useUserStore } from '../stores/useUserStore';
import { StatusBadge } from '../components/Badge';
import NoticeDetail from '../components/NoticeDetail';
import SaveButton from '../components/SaveButton';
import styles from './NoticePage.module.css';

type TabId = 'all' | 'new' | 'open';

const TABS: { id: TabId; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'new', label: '새소식' },
  { id: 'open', label: '신청 가능' },
];

const CAUTIONS: Partial<Record<TabId, string>> = {
  new: '새소식에는 최근 7일 이내에 게시된 공지가 표시됩니다.',
  open: 'AI 요약 정보는 정확하지 않을 수 있으니, 신청 전 반드시 원문을 확인하시기 바랍니다.',
};

const KIND_LABEL: Record<Notice['kind'], string> = {
  event: '행사형',
  application: '신청형',
  schedule: '일정형',
  notice: '안내형',
};

const PAGE_SIZE = 10;

function inTab(notice: Notice, tab: TabId) {
  return tab === 'all' || notice.badges.includes(tab);
}

function summaryOf(notice: Notice) {
  return notice.facts
    .slice(0, 2)
    .map((f) => f.value)
    .filter(Boolean)
    .join(' · ');
}

export default function NoticePage() {
  const interests = useUserStore((s) => s.interests);
  const [tab, setTab] = useState<TabId>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const list = NOTICES.filter((n) => inTab(n, tab));
  const shown = list.slice(0, visibleCount);
  const hasMore = list.length > visibleCount;
  const current = shown.find((n) => n.id === selectedId) ?? shown[0];

  const changeTab = (id: TabId) => {
    setTab(id);
    setVisibleCount(PAGE_SIZE);
  };

  // 목록을 바닥 근처까지 스크롤하면 다음 10건을 불러옴 (무한 스크롤, NOTICE-08)
  const handleListScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 40;
    if (nearBottom && hasMore) {
      setVisibleCount(visibleCount + PAGE_SIZE);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.titleRow}>
        <div>
          <h1 className={styles.title}>공지함</h1>
          <p className={styles.subtitle}>
            관심사: {interests.length > 0 ? interests.join(', ') : '아직 설정하지 않았어요'}
          </p>
        </div>
        <Link to="/settings" className={styles.settingsLink}>관심사·알림 설정</Link>
      </div>

      {interests.length === 0 ? (
        <div className={styles.emptyCard}>
          <p>관심사를 설정하면 관련 공지를 모아 드립니다.</p>
          <Link to="/settings" className={styles.primaryButton}>관심사 설정하기</Link>
        </div>
      ) : (
        <div className={styles.stack}>
          <div role="tablist" aria-label="공지 분류" className={styles.tabs}>
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => changeTab(t.id)}
                className={tab === t.id ? `${styles.tab} ${styles.tabActive}` : styles.tab}
              >
                {t.label}
                {t.id !== 'all' && <strong> {NOTICES.filter((n) => inTab(n, t.id)).length}</strong>}
              </button>
            ))}
          </div>

          {CAUTIONS[tab] && <p className={styles.caution}>{CAUTIONS[tab]}</p>}

          <div className={styles.columns}>
            <section aria-label="공지 목록" className={styles.listCard}>
              <div key={tab} className={styles.listScroll} onScroll={handleListScroll}>
                {shown.length === 0 && <p className={styles.empty}>해당하는 공지가 없습니다.</p>}

                {shown.map((n) => {
                  const isSelected = n.id === current?.id;
                  const isPast = n.badges.includes('past');
                  const classes = [styles.row, isSelected && styles.rowSelected, isPast && styles.rowPast]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <button
                      key={n.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedId(n.id)}
                      className={classes}
                    >
                      <span className={styles.meta}>
                        {n.badges.map((b) => <StatusBadge key={b} type={b} />)}
                        <span>{n.office}</span>
                      </span>
                      <span className={styles.rowTitle}>{n.title}</span>
                      <span className={styles.summary}>{summaryOf(n)}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {current && (
              <section aria-label="공지 상세 정보" className={styles.detailCard}>
                <div className={styles.meta}>
                  {current.badges.map((b) => <StatusBadge key={b} type={b} />)}
                  <span>{current.office} · {KIND_LABEL[current.kind]}</span>
                </div>
                <h2 className={styles.detailTitle}>{current.title}</h2>

                <NoticeDetail key={current.id} notice={current} />

                <div className={styles.actions}>
                  <a href={current.url} target="_blank" rel="noopener noreferrer" className={styles.primaryButton}>
                    원문 보기 ↗
                  </a>
                  <Link to={`/graph?focus=${current.id}`} className={styles.secondaryButton}>
                    그래프에서 보기
                  </Link>
                  <SaveButton noticeId={current.id} />
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
}