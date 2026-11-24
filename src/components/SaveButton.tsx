import { useSavedStore } from '../stores/useSavedStore';
import styles from './SaveButton.module.css';

export default function SaveButton({ noticeId }: { noticeId: string }) {
  const saved = useSavedStore((s) => s.savedIds.includes(noticeId));
  const toggleSave = useSavedStore((s) => s.toggleSave);

  return (
    <button
      type="button"
      aria-pressed={saved}
      onClick={(e) => {
        e.stopPropagation();
        toggleSave(noticeId);
      }}
      className={saved ? `${styles.button} ${styles.saved}` : styles.button}
    >
      {saved ? '★ 라이브러리에 저장' : '☆ 라이브러리에 저장'}
    </button>
  );
}