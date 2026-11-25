import { useEffect, useRef, useState } from 'react';
import { useBlocker, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ALL_DEPTS,
  COLLEGES,
  ENTRY_TYPES,
  ENTRY_YEARS,
  GRADUATIONS,
  INTEREST_GROUPS,
  SEMESTERS,
  STATUSES,
} from '../constants/settings';
import { EMPTY_PROFILE, useUserStore, type AcademicProfile } from '../stores/useUserStore';
import { useSavedStore } from '../stores/useSavedStore';
import Dropdown from '../components/Dropdown';
import styles from './SettingsPage.module.css';

type Permission = NotificationPermission | 'unsupported';

function currentPermission(): Permission {
  return 'Notification' in window ? Notification.permission : 'unsupported';
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const isFirst = params.get('mode') === 'first';

  const savedInterests = useUserStore((s) => s.interests);
  const savedProfile = useUserStore((s) => s.profile);
  const savedPush = useUserStore((s) => s.pushEnabled);
  const setInterests = useUserStore((s) => s.setInterests);
  const setProfile = useUserStore((s) => s.setProfile);
  const setPushEnabled = useUserStore((s) => s.setPushEnabled);
  const resetAll = useUserStore((s) => s.resetAll);

  const [picked, setPicked] = useState<string[]>(() => (isFirst ? [] : savedInterests));
  const [profile, setProfileForm] = useState<AcademicProfile>(() => (isFirst ? EMPTY_PROFILE : savedProfile));
  const [pushOn, setPushOn] = useState(() => (isFirst ? true : savedPush));
  const [permission, setPermission] = useState<Permission>(currentPermission);

  const [showError, setShowError] = useState(false);
  const [toast, setToast] = useState('');
  const [leaveOpen, setLeaveOpen] = useState(false);
  const interestRef = useRef<HTMLElement>(null);
  const skipBlockRef = useRef(false);

  const valid = picked.length > 0;
  const pushBlocked = permission === 'denied' || permission === 'unsupported';
  const pushShown = pushOn && !pushBlocked;

  const sameList = (a: string[], b: string[]) => [...a].sort().join('|') === [...b].sort().join('|');
  const dirty =
    !isFirst &&
    (!sameList(picked, savedInterests) ||
      JSON.stringify(profile) !== JSON.stringify(savedProfile) ||
      pushOn !== savedPush);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirty && !skipBlockRef.current && currentLocation.pathname !== nextLocation.pathname,
  );
  useEffect(() => {
    if (blocker.state !== 'blocked') return;
    if (window.confirm('저장하지 않은 변경 사항이 있습니다. 나가시겠어요?')) {
      blocker.proceed();
    } else {
      blocker.reset();
    }
  }, [blocker]);

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const flash = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(''), 2500);
  };

  const failValidation = () => {
    setShowError(true);
    interestRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const toggleChip = (chip: string) => {
    setShowError(false);
    setPicked((prev) => (prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]));
  };

  const updateProfile = (patch: Partial<AcademicProfile>) => {
    setProfileForm((prev) => ({ ...prev, ...patch }));
  };

  const deptOptions = profile.college ? COLLEGES[profile.college] : ALL_DEPTS;
  const noDept = !profile.dept;

  const updateDept = (dept: string) => {
    const college = Object.keys(COLLEGES).find((c) => COLLEGES[c].includes(dept));
    setProfileForm((p) => ({
      ...p,
      dept,
      college: college ?? p.college,
      deptNotice: dept ? p.deptNotice : '',
    }));
  };

  const togglePush = async () => {
    if (pushBlocked) return;
    if (pushOn) {
      setPushOn(false);           // TODO: 이 기기 구독 해제 API (다른 기기는 유지)
      return;
    }
    if (isFirst || permission === 'granted') {
      setPushOn(true);
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
    setPushOn(result === 'granted');   // TODO: 허용되면 이 기기 구독 저장 API
  };

  const handleSave = () => {
    if (!valid) return failValidation();
    setInterests(picked);
    setProfile(profile);
    setPushEnabled(pushOn);
    flash('설정을 저장했습니다.');
  };

  const handleComplete = async () => {
    if (!valid) return failValidation();
    let push = pushShown;
    if (push && permission !== 'granted') {
      const result = await Notification.requestPermission();
      setPermission(result);
      push = result === 'granted';
    }
    setInterests(picked);
    setProfile(profile);
    setPushEnabled(push);
    navigate('/');
  };

  const clearProfile = () => {
    setProfileForm(EMPTY_PROFILE);
    setProfile(EMPTY_PROFILE);
    flash('학적 정보를 지웠습니다.');
  };

  const withdraw = () => {
    skipBlockRef.current = true;
    navigate('/', { flushSync: true });
    resetAll();
    useSavedStore.setState({ savedIds: [] });
  };

  const previewText = valid
    ? `오늘 ${picked[0]} 새 소식 2건이 있습니다.`
    : '관심 분야를 고르면 예시 문구가 여기에 표시돼요';

  const pushStatus = (() => {
    if (permission === 'unsupported') return '이 브라우저는 알림을 지원하지 않아요.';
    if (permission === 'denied') return '브라우저 설정에서 알림을 허용해 주시기 바랍니다.';
    if (!pushOn) return '이 기기에서 꺼짐 (다른 기기는 그대로 유지)';
    if (isFirst && permission !== 'granted') return '[설정 완료]를 누르면 알림 권한을 물어봐요';
    return '이 기기에서 허용됨, 노트북 화면 오른쪽 아래에 표시';
  })();

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <h1 className={styles.title}>관심사·알림 설정</h1>
        {isFirst && (
          <p className={styles.firstNotice}>처음 한 번만 설정하면 관심 분야 소식을 받아볼 수 있습니다.</p>
        )}
      </div>

      <div className={styles.columns}>
        <div className={styles.leftCol}>
          <section
            ref={interestRef}
            aria-labelledby="sec-interest"
            className={showError ? `${styles.card} ${styles.cardError}` : styles.card}
          >
            <div className={styles.cardHead}>
              <h2 id="sec-interest" className={styles.cardTitle}>① 관심 분야</h2>
              <span className={styles.hint}>여러 개 선택할 수 있어요 · 1개 이상 필수</span>
            </div>

            {INTEREST_GROUPS.map((g) => (
              <div key={g.field} className={styles.group}>
                <span className={styles.groupName}>{g.field}</span>
                <div className={styles.chips}>
                  {g.chips.map((chip) => {
                    const on = picked.includes(chip);
                    return (
                      <button
                        key={chip}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggleChip(chip)}
                        className={on ? `${styles.chip} ${styles.chipOn}` : styles.chip}
                      >
                        {on && '✓ '}{chip}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {showError && (
              <p role="alert" className={styles.error}>관심 분야를 1개 이상 선택해 주세요.</p>
            )}
          </section>

          <section aria-labelledby="sec-profile" className={styles.card}>
            <h2 id="sec-profile" className={styles.cardTitle}>② 내 학적 정보</h2>

            <div className={styles.formGrid}>
              <Dropdown
                label="소속 단과대학"
                value={profile.college}
                options={Object.keys(COLLEGES)}
                onChange={(v) => updateProfile({ college: v, dept: '', deptNotice: '' })}
              />
              <Dropdown
                label="학과(전공)"
                value={profile.dept}
                options={deptOptions}
                onChange={(v) => updateDept(v)}
              />

              <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>학적 상태</legend>
                <div className={styles.chips}>
                  {STATUSES.map((s) => {
                    const on = profile.status === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        aria-pressed={on}
                        onClick={() => updateProfile({ status: on ? '' : s })}
                        className={on ? `${styles.pill} ${styles.pillOn}` : styles.pill}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <Dropdown label="현재 학기" value={profile.semester} options={SEMESTERS} onChange={(v) => updateProfile({ semester: v })} />
              <Dropdown label="입학연도" value={profile.entryYear} options={ENTRY_YEARS} onChange={(v) => updateProfile({ entryYear: v })} />
              <Dropdown label="입학 구분" value={profile.entryType} options={ENTRY_TYPES} onChange={(v) => updateProfile({ entryType: v })} />
              <Dropdown label="졸업 예정" value={profile.graduation} options={GRADUATIONS} onChange={(v) => updateProfile({ graduation: v })} />
              <Dropdown label="복수·부전공" value={profile.minor} options={ALL_DEPTS.filter((d) => d !== profile.dept)} onChange={(v) => updateProfile({ minor: v })} />

              <fieldset className={`${styles.fieldset} ${styles.full}`}>
                <legend className={styles.legend}>학과 공지 받기</legend>
                <div className={styles.chips}>
                  {(['받기', '안 받기'] as const).map((d) => {
                    const on = !noDept && profile.deptNotice === d;
                    return (
                      <button
                        key={d}
                        type="button"
                        disabled={noDept}
                        aria-pressed={on}
                        onClick={() => updateProfile({ deptNotice: d })}
                        className={on ? `${styles.pill} ${styles.pillOn}` : styles.pill}
                      >
                        {d}
                      </button>
                    );
                  })}
                  {noDept && <span className={styles.hint}>학과를 고르면 선택할 수 있어요</span>}
                </div>
              </fieldset>
            </div>

            <p className={styles.note}>학번·연락처·성적은 수집하지 않으며, 모든 항목은 선택사항입니다.</p>
          </section>
        </div>

        <aside className={styles.rightCol}>
          <section aria-labelledby="sec-preview" className={styles.card}>
            <h2 id="sec-preview" className={styles.cardTitle}>③ 알림 미리보기</h2>

            <div className={styles.preview}>
              <span className={styles.previewIcon} aria-hidden="true">s</span>
              <div className={styles.previewBody}>
                <span className={styles.previewFrom}>snowtice · 12:00</span>
                <span className={styles.previewText}>{previewText}</span>
              </div>
            </div>
            <p className={styles.small}>다음 확인: 내일 12:00 · 새 소식이 있을 때만 발송</p>

            <div className={styles.rule}>매일 정오(12:00)에 새 관심 공지가 있을 때만 알림이 전송됩니다.</div>

            <div className={styles.pushBox}>
              <div className={styles.pushRow}>
                <span id="push-label">브라우저 푸시 알림</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={pushShown}
                  aria-labelledby="push-label"
                  disabled={pushBlocked}
                  onClick={togglePush}
                  className={pushShown ? `${styles.switch} ${styles.switchOn}` : styles.switch}
                >
                  <span className={styles.knob} />
                </button>
              </div>
              <span className={pushBlocked ? `${styles.small} ${styles.warn}` : styles.small}>{pushStatus}</span>
            </div>
          </section>

          <div className={styles.actions}>
            {isFirst ? (
              <>
                <button type="button" className={styles.primary} onClick={handleComplete}>설정 완료</button>
                <button type="button" className={styles.secondary} onClick={() => navigate('/')}>나중에 하기</button>
              </>
            ) : (
              <>
                <button type="button" className={styles.primary} onClick={handleSave}>설정 저장</button>
                <button type="button" className={styles.secondary} onClick={() => navigate(-1)}>취소</button>
              </>
            )}
          </div>
        </aside>
      </div>

      {!isFirst && (
        <div className={styles.manage}>
          <button type="button" className={styles.manageButton} onClick={clearProfile}>학적 정보 지우기</button>
          <button type="button" className={`${styles.manageButton} ${styles.danger}`} onClick={() => setLeaveOpen(true)}>
            서비스 탈퇴
          </button>
        </div>
      )}

      {toast && <div role="status" className={styles.toast}>{toast}</div>}

      {leaveOpen && (
        <div className={styles.overlay}>
          <div role="dialog" aria-modal="true" aria-labelledby="leave-title" className={styles.dialog}>
            <h2 id="leave-title" className={styles.dialogTitle}>서비스를 탈퇴할까요?</h2>
            <p className={styles.dialogText}>
              관심 분야, 학적 정보, 저장한 공지가 모두 삭제되고 모든 기기의 푸시 알림이 해제됩니다.
            </p>
            <div className={styles.dialogActions}>
              <button type="button" className={styles.manageButton} onClick={() => setLeaveOpen(false)}>취소</button>
              <button type="button" className={styles.dangerFill} onClick={withdraw}>탈퇴하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}