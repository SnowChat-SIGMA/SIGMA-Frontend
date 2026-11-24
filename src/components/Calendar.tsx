import { useState, type ReactNode } from 'react';
import type { ScheduleItem } from '../types';
import { formatMD, parseDate, startOfToday, toKey } from '../utils/date';
import styles from './Calendar.module.css';

export interface CalendarEvent extends ScheduleItem {
  noticeId: string;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

interface Props {
  events: CalendarEvent[];
  onPickEvent: (noticeId: string) => void;
}

export default function Calendar({ events, onPickEvent }: Props) {
  const today = startOfToday();
  const todayKey = toKey(today);
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const year = month.getFullYear();
  const m = month.getMonth();
  const firstWeekday = new Date(year, m, 1).getDay();   // 1일이 무슨 요일인지 (0 = 일요일)
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const monthPrefix = toKey(month).slice(0, 7);          // '2026-11'

  // 주 단위 일정은 달력에 점 X
  const dayEvents = events.filter((e) => !e.weekLabel);

  const monthEvents = events
    .filter((e) => e.date.startsWith(monthPrefix))
    .sort((a, b) => a.date.localeCompare(b.date));
  const listed = selectedDay
    ? monthEvents.filter((e) => !e.weekLabel && e.date === selectedDay)
    : monthEvents;

  const moveMonth = (diff: number) => {
    setMonth(new Date(year, m + diff, 1));
    setSelectedDay(null);
  };

  const cells: ReactNode[] = [];
  for (let i = 0; i < firstWeekday; i++) {
    cells.push(<span key={`blank-${i}`} aria-hidden="true" />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const key = toKey(new Date(year, m, d));
    const isToday = key === todayKey;
    const isSelected = selectedDay === key;
    const hasDeadline = dayEvents.some((e) => e.date === key && e.type === 'deadline');
    const hasEvent = dayEvents.some((e) => e.date === key && e.type === 'event');
    const classes = [styles.day, isToday && styles.today, isSelected && styles.selected]
      .filter(Boolean)
      .join(' ');

    cells.push(
      <button
        key={key}
        type="button"
        className={classes}
        aria-pressed={isSelected}
        aria-label={`${m + 1}월 ${d}일${isToday ? ' 오늘' : ''}`}
        onClick={() => setSelectedDay(isSelected ? null : key)}
      >
        <span>{d}</span>
        <span className={styles.dots}>
          {hasDeadline && <span className={`${styles.dot} ${styles.deadline}`} />}
          {hasEvent && <span className={`${styles.dot} ${styles.event}`} />}
        </span>
      </button>,
    );
  }

  const selectedDate = selectedDay ? parseDate(selectedDay) : null;
  const listHead = selectedDate
    ? `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일 일정`
    : `${m + 1}월 일정`;

  return (
    <aside aria-label="달력" className={styles.calendar}>
      <div className={styles.header}>
        <button type="button" className={styles.navButton} aria-label="이전 달" onClick={() => moveMonth(-1)}>‹</button>
        <h2 className={styles.monthLabel}>{year}년 {m + 1}월</h2>
        <button type="button" className={styles.navButton} aria-label="다음 달" onClick={() => moveMonth(1)}>›</button>
      </div>

      <div className={styles.weekdays}>
        {WEEKDAYS.map((w) => <span key={w}>{w}</span>)}
      </div>
      <div className={styles.grid}>{cells}</div>

      <div className={styles.legend}>
        <span><span className={`${styles.dot} ${styles.deadline}`} />마감</span>
        <span><span className={`${styles.dot} ${styles.event}`} />행사·일정</span>
      </div>

      <div className={styles.listBox}>
        <span className={styles.listHead}>{listHead}</span>
        {listed.length === 0 ? (
          <p className={styles.noEvents}>{selectedDay ? '이날 일정이 없어요' : '이달 일정이 없어요'}</p>
        ) : (
          <ul className={styles.list}>
            {listed.map((e, i) => (
              <li key={`${e.noticeId}-${e.date}-${i}`}>
                <button type="button" className={styles.item} onClick={() => onPickEvent(e.noticeId)}>
                  <span
                    className={`${styles.dot} ${
                      e.weekLabel ? styles.week : e.type === 'deadline' ? styles.deadline : styles.event
                    }`}
                  />
                  <span className={styles.itemDate}>{e.weekLabel ?? formatMD(e.date)}</span>
                  <span>{e.text}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}