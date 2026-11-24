import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { LibraryInfo, Notice, ScheduleItem } from '../types';
import { NOTICES } from '../mocks/notices';
import { LIBRARY_INFO } from '../mocks/library';
import { useSavedStore } from '../stores/useSavedStore';
import LibraryCard, { type DdayInfo } from '../components/LibraryCard';
import Calendar, { type CalendarEvent } from '../components/Calendar';
import { daysFrom, startOfToday } from '../utils/date';
import styles from './LibraryPage.module.css';

type TabId = 'live' | 'past';

const TABS: { id: TabId; label: string }[] = [
  { id: 'live', label: '진행 중' },
  { id: 'past', label: '지난 공지' },
];

interface SavedItem {
  notice: Notice;
  info: LibraryInfo;
  isPast: boolean;
  next?: ScheduleItem;   // 앞으로 다가올 가장 가까운 일정
  last?: ScheduleItem;   // 이미 지난 가장 최근 일정
}

function toSavedItem(notice: Notice, info: LibraryInfo, today: Date): SavedItem {
  const dated = info.schedule.filter((s) => !s.weekLabel);
  const upcoming = dated
    .filter((s) => daysFrom(today, s.date) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date));
  const passed = dated
    .filter((s) => daysFrom(today, s.date) < 0)
    .sort((a, b) => b.date.localeCompare(a.date));

  return {
    notice,
    info,
    isPast: notice.badges.includes('past'),
    next: upcoming[0],
    last: passed[0],
  };
}

function ddayOf(item: SavedItem, today: Date): DdayInfo {
  if (item.isPast) {
    return { label: item.last?.ddayLabel ?? '', value: '종료', tone: 'ended' };
  }
  if (!item.next) {
    return { label: '', value: '일정 미정', tone: 'unknown' };
  }
  const days = daysFrom(today, item.next.date);
  return {
    label: item.next.ddayLabel,
    value: days === 0 ? 'D-DAY' : `D-${days}`,
    tone: days === 0 ? 'urgent' : 'normal',
  };
}

function compareLive(a: SavedItem, b: SavedItem) {
  if (!a.next && !b.next) return 0;
  if (!a.next) return 1;
  if (!b.next) return -1;
  return a.next.date.localeCompare(b.next.date);
}

function comparePast(a: SavedItem, b: SavedItem) {
  return (b.last?.date ?? '').localeCompare(a.last?.date ?? '');
}

export default function LibraryPage() {
  const savedIds = useSavedStore((s) => s.savedIds);
  const [tab, setTab] = useState<TabId>('live');
  const [field, setField] = useState('all');
  const [openIds, setOpenIds] = useState<string[]>([]);

  const today = startOfToday();

  const items = NOTICES
    .filter((n) => savedIds.includes(n.id) && LIBRARY_INFO[n.id])
    .map((n) => toSavedItem(n, LIBRARY_INFO[n.id], today));

  const fields: string[] = Array.from(new Set(items.map((i) => i.info.field)));
  const activeField = fields.includes(field) ? field : 'all';

  const visible = items
    .filter((i) => (tab === 'past' ? i.isPast : !i.isPast))
    .filter((i) => activeField === 'all' || i.info.field === activeField)
    .sort(tab === 'live' ? compareLive : comparePast);

  const countOf = (id: TabId) => items.filter((i) => (id === 'past' ? i.isPast : !i.isPast)).length;
  const anyOpen = visible.some((i) => openIds.includes(i.notice.id));

  const toggleOpen = (id: string) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const events: CalendarEvent[] = items.flatMap((i) =>
    i.info.schedule.map((s) => ({ ...s, noticeId: i.notice.id })),
  );

  const openFromCalendar = (noticeId: string) => {
    const item = items.find((i) => i.notice.id === noticeId);
    if (!item) return;
    setTab(item.isPast ? 'past' : 'live');
    setField('all');
    setOpenIds((prev) => (prev.includes(noticeId) ? prev : [...prev, noticeId]));
    setTimeout(() => {
      document.getElementById(`lib-card-${noticeId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  return (
    <div className={styles.page}>
      <div>
        <h1 className={styles.title}>내 라이브러리</h1>
        <p className={styles.subtitle}>저장한 공지와 다가오는 일정을 모아 봐요</p>
      </div>

      {items.length === 0 ? (
        <div className={styles.emptyCard}>
          <p>관심 있는 공지에서 ☆를 눌러 저장해 보세요</p>
          <div className={styles.emptyActions}>
            <Link to="/notices" className={styles.primaryButton}>공지함 가기</Link>
            <Link to="/popular" className={styles.secondaryButton}>인기 게시글 보기</Link>
          </div>
        </div>
      ) : (
        <div className={styles.columns}>
          <section aria-label="저장한 공지" className={styles.listArea}>
            <div className={styles.toolbar}>
              <div role="tablist" aria-label="진행 상태" className={styles.tabs}>
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={tab === t.id}
                    onClick={() => setTab(t.id)}
                    className={tab === t.id ? `${styles.tab} ${styles.tabActive}` : styles.tab}
                  >
                    {t.label} <strong>{countOf(t.id)}</strong>
                  </button>
                ))}
              </div>
              {anyOpen && (
                <button type="button" className={styles.collapseAll} onClick={() => setOpenIds([])}>
                  모두 접기
                </button>
              )}
            </div>

            <div role="group" aria-label="분야" className={styles.chips}>
              {['all', ...fields].map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={activeField === f}
                  onClick={() => setField(f)}
                  className={activeField === f ? `${styles.chip} ${styles.chipActive}` : styles.chip}
                >
                  {f === 'all' ? '전체' : f}
                </button>
              ))}
            </div>

            {visible.length === 0 ? (
              <p className={styles.noCards}>
                {tab === 'past' ? '지난 공지가 없어요' : '진행 중인 공지가 없어요'}
              </p>
            ) : (
              visible.map((item) => (
                <LibraryCard
                  key={item.notice.id}
                  notice={item.notice}
                  info={item.info}
                  dday={ddayOf(item, today)}
                  isPast={item.isPast}
                  open={openIds.includes(item.notice.id)}
                  onToggle={() => toggleOpen(item.notice.id)}
                />
              ))
            )}
          </section>

          <div className={styles.calendarSlot}>
            <Calendar events={events} onPickEvent={openFromCalendar} />
          </div>
        </div>
      )}
    </div>
  );
}