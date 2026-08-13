import { useEffect, useState } from 'react';

const STORAGE_KEY = 'abc-site-likes';

// Read the stored count safely: server has no localStorage, and browsers may
// block storage (private mode, disabled cookies).
function readStoredCount() {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const n = raw === null ? 0 : parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

export default function Likes() {
  const [count, setCount] = useState(readStoredCount);

  // Persist on every change so the count survives page refreshes.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(count));
    } catch {
      // ignore: storage unavailable, count just won't persist
    }
  }, [count]);

  return (
    <div className="likes">
      <h3>Likes: {count}</h3>
      <button className="btn btn--primary" onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
