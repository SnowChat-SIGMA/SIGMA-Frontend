import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.css';

const MENUS = [
  { to: '/notices', label: '공지함' },
  { to: '/graph', label: '관심사 그래프' },
  { to: '/popular', label: '인기 게시글' },
  { to: '/library', label: '내 라이브러리' },
];

export default function Header() {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <span className={styles.logoMark} aria-hidden="true">Σ</span>
        시그마
      </Link>

      <nav className={styles.nav} aria-label="주요 메뉴">
        {MENUS.map((m) => (
          <NavLink
            key={m.to}
            to={m.to}
            className={({ isActive }) =>
              isActive ? `${styles.menu} ${styles.active}` : styles.menu
            }
          >
            {m.label}
          </NavLink>
        ))}
      </nav>

      {/* TODO: SNOWCHAT 실제 주소로 바꾸기 */}
      <a className={styles.snowchat} href="#" target="_blank" rel="noopener noreferrer">
        SNOWCHAT 공지비서 ↗
      </a>
      <span className={styles.profile} aria-label="프로필">지</span>
    </header>
  );
}