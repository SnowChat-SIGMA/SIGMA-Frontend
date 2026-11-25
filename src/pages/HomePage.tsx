import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import logo from '../assets/logo.png';
import character from '../assets/character.png';
import { SNOWCHAT_URL } from '../constants/links';
import { useUserStore } from '../stores/useUserStore';
import styles from './HomePage.module.css';

type Permission = NotificationPermission | 'unsupported';

const BANNER_KEY = 'snowtice.pushBannerHiddenUntil';
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

const FLAKES = Array.from({ length: 12 }, (_, i) => ({
  left: `${(i * 8.3 + (i % 3) * 2.1).toFixed(1)}%`,
  duration: `${9 + (i % 5) * 2}s`,
  delay: `-${(i * 1.3) % 9}s`,
}));

function currentPermission(): Permission {
  return 'Notification' in window ? Notification.permission : 'unsupported';
}

function readBannerHidden() {
  try {
    return Number(localStorage.getItem(BANNER_KEY) ?? 0) > Date.now();
  } catch {
    return false;
  }
}

function nextAlertLabel() {
  return new Date().getHours() < 12 ? '오늘 12:00' : '내일 12:00';
}

export default function HomePage() {
  const loggedIn = useUserStore((s) => s.loggedIn);
  const interests = useUserStore((s) => s.interests);
  const status = useUserStore((s) => s.profile.status);
  const pushEnabled = useUserStore((s) => s.pushEnabled);
  const setPushEnabled = useUserStore((s) => s.setPushEnabled);

  const [permission, setPermission] = useState<Permission>(currentPermission);
  const [bannerHidden, setBannerHidden] = useState(readBannerHidden);

  const isS0 = !loggedIn;
  const isS1 = loggedIn && interests.length === 0;
  const isSet = loggedIn && interests.length > 0;
  const onLeave = loggedIn && (status === '휴학' || status === '수료');
  const pushOff = loggedIn && (permission !== 'granted' || !pushEnabled);
  const pushBlocked = permission === 'denied' || permission === 'unsupported';
  const showBanner = pushOff && !bannerHidden;

  const allowPush = async () => {
    if (permission === 'granted') {
      setPushEnabled(true);
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') setPushEnabled(true);   // TODO: 이 기기 구독 저장 API
  };

  const hideBanner = () => {
    setBannerHidden(true);
    try {
      localStorage.setItem(BANNER_KEY, String(Date.now() + SEVEN_DAYS));
    } catch {
      return;
    }
  };

  return (
    <div className={styles.page}>
      <Header />

      {showBanner && (
        <div role="region" aria-label="알림 안내" className={styles.banner}>
          <span className={styles.bannerText}>
            {pushBlocked
              ? '브라우저에서 알림이 차단돼 있어요. 주소창 왼쪽 자물쇠 아이콘 → 사이트 설정에서 알림을 허용해 주시기 바랍니다.'
              : '브라우저 알림이 꺼져 있어서 새 관심 공지 알림을 받을 수 없어요.'}
          </span>
          <div className={styles.bannerActions}>
            {!pushBlocked && (
              <button type="button" className={styles.bannerPrimary} onClick={allowPush}>알림 켜기</button>
            )}
            <button type="button" className={styles.bannerSecondary} onClick={hideBanner}>다음에</button>
          </div>
        </div>
      )}

      <main className={styles.main}>
        <img src={logo} alt="snowtice" className={styles.logo} />
        <p className={styles.intro}>흩어진 교내 공지를 하나로 모아, 나에게 필요한 소식을 먼저 알려 드려요</p>

        <div className={styles.askWrap}>
          <a href={SNOWCHAT_URL} target="_blank" rel="noopener noreferrer" className={styles.ask}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            SNOWCHAT 공지비서에게 물어보기
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17 17 7" />
              <path d="M8 7h9v9" />
            </svg>
          </a>
          {onLeave && (
            <p className={styles.leaveNote}>휴학·수료 중에는 학과 사정에 따라 일부 공지가 대상에서 빠질 수 있어요</p>
          )}
        </div>

        {isS0 && (
          <Link to="/login" className={styles.chip}>로그인하고 내 관심사 소식 받기</Link>
        )}
        {isS1 && (
          <Link to="/settings?mode=first" className={`${styles.chip} ${styles.chipStrong}`}>
            <span className={styles.dot} aria-hidden="true" />
            관심사 설정하고 첫 브리핑 받기
          </Link>
        )}
        {isSet && (
          <span className={styles.chip}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            다음 알림: {nextAlertLabel()}
          </span>
        )}
      </main>

      <div className={styles.snow} aria-hidden="true">
        {FLAKES.map((f, i) => (
          <svg
            key={i}
            className={styles.flake}
            style={{ left: f.left, animationDuration: f.duration, animationDelay: f.delay }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--blue)"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            <path d="M12 2v20M4.9 7l14.2 10M4.9 17 19.1 7" />
          </svg>
        ))}
      </div>

      <div className={styles.track} aria-hidden="true">
        <div className={styles.ground} />
        <div className={styles.runner}>
          <img src={character} alt="" className={styles.character} />
        </div>
      </div>

      <footer className={styles.footer}>
        공개 게시판 공지를 매일 모아 정리해요 · 날짜·자격 판정은 원문과 담당 부서에서 최종 확인하세요
      </footer>
    </div>
  );
}