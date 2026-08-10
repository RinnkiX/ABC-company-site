import { useState } from 'react';

export default function Likes() {
  const [count, setCount] = useState(0);

  return (
    <div className="likes">
      <h3>Likes: {count}</h3>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
