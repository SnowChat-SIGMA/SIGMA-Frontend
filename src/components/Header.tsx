import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { SNOWCHAT_URL } from '../constants/links';
import { useUserStore } from '../stores/useUserStore';
import styles from './Header.module.css';

const MENUS = [
  { to: '/notices', label: '공지함' },
  { to: '/graph', label: '관심사 그래프' },
  { to: '/popular', label: '인기 게시글' },
  { to: '/library', label: '내 라이브러리' },
];

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isHome = pathname === '/';
  const loggedIn = useUserStore((s) => s.loggedIn);
  const logout = useUserStore((s) => s.logout);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleDown);
    return () => document.removeEventListener('mousedown', handleDown);
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    navigate('/', { flushSync: true });
    logout();   // TODO: 이 기기의 푸시 알림 구독 해제 API (HOME-06)
  };

  return (
    <header className={isHome ? `${styles.header} ${styles.home}` : styles.header}>
      {!isHome && (
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="snowtice" className={styles.logoImage} />
        </Link>
      )}

      <nav className={styles.nav} aria-label="주요 메뉴">
        {MENUS.map((m) => (
          <NavLink
            key={m.to}
            to={m.to}
            className={({ isActive }) => (isActive ? `${styles.menu} ${styles.active}` : styles.menu)}
          >
            {m.label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.right}>
        {!isHome && loggedIn && (
          <a className={styles.snowchat} href={SNOWCHAT_URL} target="_blank" rel="noopener noreferrer">
            SNOWCHAT 공지비서 ↗
          </a>
        )}

        {loggedIn ? (
          <div className={styles.profileWrap} ref={menuRef}>
            <button
              type="button"
              className={styles.profile}
              aria-label="프로필 메뉴"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              지
            </button>
            {menuOpen && (
              <div className={styles.profileMenu}>
                <Link to="/settings" className={styles.menuItem} onClick={() => setMenuOpen(false)}>
                  관심사·알림 설정
                </Link>
                <button type="button" className={styles.menuItem} onClick={handleLogout}>
                  로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className={styles.loginButton}>로그인</Link>
        )}
      </div>
    </header>
  );
}