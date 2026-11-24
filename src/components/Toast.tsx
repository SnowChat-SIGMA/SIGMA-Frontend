import { Link } from 'react-router-dom';
import { useSavedStore } from '../stores/useSavedStore';
import styles from './Toast.module.css';

export default function Toast() {
  const toast = useSavedStore((s) => s.toast);
  const undo = useSavedStore((s) => s.undo);

  if (!toast) return null;

  return (
    <div role="status" className={styles.toast}>
      {toast.text}
      {toast.kind === 'saved' ? (
        <Link to="/library" className={styles.action}>보기</Link>
      ) : (
        <button type="button" onClick={undo} className={styles.action}>되돌리기</button>
      )}
    </div>
  );
}