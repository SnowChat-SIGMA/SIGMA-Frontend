import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import styles from './Dropdown.module.css';

interface Props {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  visibleRows?: number;
}

const ROW_REM = 2.5;
const PEEK_REM = 1.25;
const PADDING_REM = 0.5;
const GAP_REM = 0.25;

function remToPx(rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export default function Dropdown({
  label,
  value,
  options,
  onChange,
  placeholder = '선택 안 함',
  visibleRows = 6,
}: Props) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const controlRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();

  const items = ['', ...options];
  const maxListRem = visibleRows * ROW_REM + PEEK_REM + PADDING_REM;

  useEffect(() => {
    if (!open) return;
    const handleDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleDown);
    return () => document.removeEventListener('mousedown', handleDown);
  }, [open]);

  const scrollToItem = (i: number) => {
    listRef.current?.children[i]?.scrollIntoView({ block: 'nearest' });
  };

  const shouldOpenUp = () => {
    const rect = controlRef.current?.getBoundingClientRect();
    if (!rect) return false;
    const headerBottom = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0;
    const listHeight = Math.min(remToPx(maxListRem), remToPx(items.length * ROW_REM + PADDING_REM));
    const needed = listHeight + remToPx(GAP_REM);
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top - Math.max(0, headerBottom);
    return spaceBelow < needed && spaceAbove > spaceBelow;
  };

  const openList = () => {
    const current = Math.max(0, items.indexOf(value));
    setOpenUp(shouldOpenUp());
    setActive(current);
    setOpen(true);
    requestAnimationFrame(() => scrollToItem(current));
  };

  const choose = (i: number) => {
    onChange(items[i]);
    setOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(items.length - 1, Math.max(0, active + (e.key === 'ArrowDown' ? 1 : -1)));
      setActive(next);
      scrollToItem(next);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (active >= 0) choose(active);
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <div className={styles.root} ref={rootRef}>
      <span id={`${id}-label`} className={styles.label}>{label}</span>

      <div className={styles.control} ref={controlRef}>
        <button
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-labelledby={`${id}-label`}
          aria-activedescendant={open && active >= 0 ? `${id}-opt-${active}` : undefined}
          className={styles.trigger}
          onClick={() => (open ? setOpen(false) : openList())}
          onKeyDown={handleKeyDown}
        >
          <span className={value ? styles.value : `${styles.value} ${styles.placeholder}`}>
            {value || placeholder}
          </span>
          <svg
            className={open ? `${styles.chevron} ${styles.chevronOpen}` : styles.chevron}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {open && (
          <ul
            id={`${id}-list`}
            ref={listRef}
            role="listbox"
            aria-labelledby={`${id}-label`}
            className={openUp ? `${styles.list} ${styles.listUp}` : styles.list}
            style={{ maxHeight: `${maxListRem}rem` }}
          >
            {items.map((item, i) => {
              const classes = [styles.option, i === active && styles.active, item === value && styles.selected]
                .filter(Boolean)
                .join(' ');
              return (
                <li
                  key={item || '__none'}
                  id={`${id}-opt-${i}`}
                  role="option"
                  aria-selected={item === value}
                  className={classes}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(i)}
                >
                  {item || placeholder}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}