const ONE_DAY = 24 * 60 * 60 * 1000;

// '2026-11-27' → Date (한국 시간 그날 0시)
export function parseDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// 오늘 0시
export function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

// today 기준으로 dateStr까지 며칠 남았는지 (지났으면 음수)
export function daysFrom(today: Date, dateStr: string) {
  return Math.round((parseDate(dateStr).getTime() - today.getTime()) / ONE_DAY);
}

// Date → '2026-11-27'
export function toKey(date: Date) {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

// '2026-11-27' → '11/27'
export function formatMD(dateStr: string) {
  const date = parseDate(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}