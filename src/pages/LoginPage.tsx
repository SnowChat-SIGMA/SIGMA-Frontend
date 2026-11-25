import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';
import styles from './LoginPage.module.css';

// TODO: 02 로그인·동의 화면으로 교체 (지금은 임시 로그인 버튼)
export default function LoginPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const loggedIn = useUserStore((s) => s.loggedIn);
  const login = useUserStore((s) => s.login);
  const [submitted, setSubmitted] = useState(false);

  const redirect = params.get('redirect') ?? '';
  const safeRedirect = redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/';

  if (loggedIn && !submitted) return <Navigate to="/" replace />;

  const handleLogin = () => {
    setSubmitted(true);
    login();
    navigate(safeRedirect, { replace: true });
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>숙명 계정으로 시작하기</h1>
      <p className={styles.text}>로그인 화면은 다음 단계에서 만들어요. 지금은 임시 버튼으로 로그인돼요.</p>
      <button type="button" className={styles.button} onClick={handleLogin}>임시 로그인</button>
      <Link to="/" className={styles.link}>홈으로</Link>
    </div>
  );
}