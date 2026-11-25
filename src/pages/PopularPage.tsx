import { useState } from 'react';
import type { Field, Notice, Verdict } from '../types';
import { NOTICES } from '../mocks/notices';
import { COLLECTED_AT, POPULAR, type PopularEntry } from '../mocks/popular';
import { useUserStore } from '../stores/useUserStore';
import { StatusBadge, VerdictTag } from '../components/Badge';
import SaveButton from '../components/SaveButton';
import styles from './PopularPage.module.css';

// 분야 칩 (SET-02 대분류와 같은 이름·순서, POP-02)
const FIELDS: Field[] = ['행사·프로그램', '졸업', '학사·교무', '장학·등록'];

// 관심 분야 세부 칩 → 대분류 (첫 진입 시 선택할 칩을 고르는 데 씀)
// TODO: 03 설정 페이지(SET-02)를 만들면 그 목록과 맞추기
const INTEREST_FIELD: Record<string, Field> = {
  '진로·취업': '행사·프로그램',
  '교내 장학': '장학·등록',
  '졸업 요건·심사': '졸업',
};

const MAX_ROWS = 10;    // 일반 공지 최대 10위 (POP-03)
const MAX_PINNED = 3;   // 고정 공지 최대 3개 (POP-04)

interface Row {
  entry: PopularEntry;
  notice: Notice;
}

// S2: 내 관심 분야가 속한 대분류 중 칩 순서상 첫 번째 / S1: 첫 번째 칩 (POP-02)
function firstField(interests: string[]): Field {
  const mine = interests.map((i) => INTEREST_FIELD[i]).filter(Boolean);
  return FIELDS.find((f) => mine.includes(f)) ?? FIELDS[0];
}

// 대상 판정 배지 = '대상' 또는 '대상·자격' 항목의 판정 (NOTICE-10과 같은 기준)
function verdictOf(notice: Notice): Verdict | undefined {
  return notice.facts.find((f) => f.label === '대상' || f.label === '대상·자격')?.verdict;
}

export default function PopularPage() {
  const interests = useUserStore((s) => s.interests);
  const hasAcademicInfo = useUserStore((s) => s.hasAcademicInfo);
  const [field, setField] = useState<Field>(() => firstField(interests));

  const data = POPULAR[field];

  // 공지 데이터와 합치고, 지난 행사는 고정·일반 모두에서 뺌 (POP-03)
  const rows: Row[] = data.entries
    .map((entry) => ({ entry, notice: NOTICES.find((n) => n.id === entry.noticeId) }))
    .filter((r): r is Row => !!r.notice && !r.notice.badges.includes('past'))
    .sort((a, b) => b.entry.views - a.entry.views);   // 조회수 많은 순

  const pinned = rows.filter((r) => r.entry.pinned).slice(0, MAX_PINNED);
  const ranked = rows.filter((r) => !r.entry.pinned).slice(0, MAX_ROWS);
  const topViews = ranked[0]?.entry.views ?? 1;       // 막대 길이 기준 = 일반 공지 1위 (POP-05)

  // 한 줄 공통 부분: 제목·배지 / 부서·게시일 / 조회수·판정 / 저장
  const renderInfo = (r: Row) => {
    const verdict = verdictOf(r.notice);
    const badges = r.notice.badges.filter((b) => b !== 'past');
    return {
      title: (
        <span className={styles.titleLine}>
          {/* 행 아무 곳이나 누르면 원문이 새 탭에서 열림 (POP-03) */}
          <a href={r.notice.url} target="_blank" rel="noopener noreferrer" className={styles.titleLink}>
            {r.notice.title}
          </a>
          {badges.map((b) => <StatusBadge key={b} type={b} />)}
        </span>
      ),
      meta: <span className={styles.meta}>{r.notice.office} · {r.entry.postedAt}</span>,
      views: (
        <span className={styles.views}>
          조회 {r.entry.views.toLocaleString('ko-KR')}
          {hasAcademicInfo && verdict && <VerdictTag verdict={verdict} />}
        </span>
      ),
      save: (
        <span className={styles.saveSlot}>
          <SaveButton noticeId={r.notice.id} />
        </span>
      ),
    };
  };

  return (
    <div className={styles.page}>
      <div>
        <h1 className={styles.title}>인기 게시글</h1>
        <p className={styles.subtitle}>
          학교 게시판에서 조회수가 높은 공지를 분야별로 모았습니다. 조회수는 중요도가 아닌 참고 지표입니다.
        </p>
      </div>

      <div role="group" aria-label="분야" className={styles.chips}>
        {FIELDS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={field === f}
            onClick={() => setField(f)}
            className={field === f ? `${styles.chip} ${styles.chipActive}` : styles.chip}
          >
            {f}
          </button>
        ))}
      </div>

      <div className={styles.columns}>
        <section aria-label="인기 공지 목록" className={styles.listArea}>
          {pinned.length > 0 && (
            <div className={styles.card}>
              <span className={styles.pinnedHead}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 17v5M9 3h6l-1 6 4 4H6l4-4-1-6z" />
                </svg>
                고정 공지
              </span>
              <ul className={styles.list}>
                {pinned.map((r) => {
                  const info = renderInfo(r);
                  return (
                    <li key={r.notice.id} className={`${styles.row} ${styles.pinnedRow}`}>
                      <div className={styles.main}>
                        {info.title}
                        {info.meta}
                      </div>
                      {info.views}
                      {info.save}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className={styles.card}>
            {!data.collected ? (
              <p className={styles.empty}>이 분야는 시범 수집 범위에 아직 포함되지 않았습니다.</p>
            ) : ranked.length === 0 && pinned.length === 0 ? (
              <p className={styles.empty}>해당하는 공지가 없습니다.</p>
            ) : (
              <ol className={styles.list}>
                {ranked.map((r, i) => {
                  const info = renderInfo(r);
                  const barWidth = Math.max(3, Math.round((r.entry.views / topViews) * 100));
                  return (
                    <li key={r.notice.id} className={styles.row}>
                      <span className={i === 0 ? `${styles.rank} ${styles.rankFirst}` : styles.rank}>{i + 1}</span>
                      <div className={styles.main}>
                        {info.title}
                        {info.meta}
                        <span className={styles.barTrack} aria-hidden="true">
                          <span className={styles.bar} style={{ width: `${barWidth}%` }} />
                        </span>
                      </div>
                      {info.views}
                      {info.save}
                    </li>
                  );
                })}
              </ol>
            )}
            <p className={styles.basis}>{COLLECTED_AT} 수집 시점 누적 조회수</p>
          </div>
        </section>

        <aside className={styles.guide}>
          <h2 className={styles.guideTitle}>이렇게 계산합니다</h2>
          <ul className={styles.guideList}>
            <li>최근 6개월 동안 올라온 공지의 수집 시점 공개 조회수를 기준으로 순위를 매깁니다.</li>
            <li>이미 끝난 행사는 순위에서 제외합니다.</li>
            <li>상단 고정 공지는 조회수가 저절로 높아지므로 순위와 따로 보여 드립니다.</li>
            <li>조회수는 하루 한 번 공지를 수집할 때 함께 갱신됩니다.</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}